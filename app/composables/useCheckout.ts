/**
 * useCheckout — Composable untuk proses checkout
 *
 * Branching yang BENAR:
 *
 * Table Order (QR meja biasa):
 *   → createNewOrder() → create order + payment bersama-sama
 *   → redirect ke /payments?order=
 *
 * Open Bill:
 *   → placeOrder() = POST /v1/customer/order/items → hanya tambah item
 *   → JANGAN create payment otomatis
 *   → clear cart → kembali ke halaman orders (tampilkan OpenBillSessionView)
 *   Payment baru dibuat saat customer klik "Bayar Total Pesanan" di OpenBillSessionView.
 */

import type { MaybeRefOrGetter } from 'vue'
import { ref, toValue } from 'vue'
import { mapToHistoryStatus } from '~/composables/useOrderStatus'

type CheckoutCart = ReturnType<typeof useOrderCart>

export const useCheckout = (orgSlug: MaybeRefOrGetter<string>, cart: CheckoutCart) => {
  const router = useRouter()
  const { placeOrder, createNewOrder } = useCustomerOrder()
  const sessionStore = useCustomerSessionStore()

  const submitting = ref(false)
  const error = ref<string | null>(null)

  const checkout = async () => {
    if (cart.totalQuantity.value === 0 || submitting.value) return

    submitting.value = true
    error.value = null

    const isModeOpenBill = sessionStore.sessionType === 'open_bill'
    const slug = toValue(orgSlug)

    // ── Open Bill ──────────────────────────────────────────────────────────
    // Hanya tambah item ke order aktif — TIDAK create payment, TIDAK redirect
    // ke halaman payment. Customer pesan berkali-kali, bayar di akhir.
    if (isModeOpenBill) {
      const result = await placeOrder(cart.orderPayload.value)

      submitting.value = false

      if (!result.success) {
        if (result.error?.errors) {
          error.value = Object.values(result.error.errors).flat().join(' ')
        } else {
          error.value = result.error?.message ?? 'Gagal mengirim pesanan.'
        }
        return
      }

      // Bersihkan cart lokal — item sudah masuk ke backend/kitchen.
      // Sesi open bill TETAP DIPERTAHANKAN agar customer bisa pesan lagi.
      cart.clearCart()

      // Kembali ke halaman orders — OpenBillSessionView akan otomatis tampil
      // karena session open bill masih aktif dan fetchOpenBill() sudah diperbarui
      // oleh placeOrder() via syncToSessionStore().
      // Tutup cart sheet terlebih dahulu (jika masih buka), lalu close semua overlay.
      const overlay = useUiOverlayStore()
      overlay.closeAll()

      return
    }

    // ── Table Order ────────────────────────────────────────────────────────
    // Flow lama: create order baru + create payment → redirect ke /payments.
    const qrToken = sessionStore.sessionToken
    if (!qrToken) {
      submitting.value = false
      error.value = 'Token meja tidak ditemukan.'
      return
    }

    const result = await createNewOrder(qrToken, cart.orderPayload.value)

    submitting.value = false

    if (!result.success) {
      if (result.error?.errors) {
        if (import.meta.dev) {
          console.error('Customer order validation failed:', result.error.errors)
        }
        error.value = Object.values(result.error.errors).flat().join(' ')
      } else {
        error.value = result.error?.message ?? 'Gagal mengirim pesanan.'
      }
      return
    }

    // Simpan reference order ke history SEGERA setelah order berhasil dibuat.
    if (import.meta.client && result.data && slug) {
      try {
        const raw = result.data
        const publicToken = raw.public_token ?? raw.token ?? raw.order_token
        const orderCode = raw.order_number

        if (publicToken || orderCode) {
          const history = useOrderHistory(slug)
          history.addOrUpdate({
            order_public_id: String(publicToken ?? orderCode),
            order_code: String(orderCode ?? publicToken),
            order_id: raw.order_id ?? raw.id ?? undefined,
            public_token: publicToken ? String(publicToken) : undefined,
            org_slug: slug,
            org_name: sessionStore.orgName ?? undefined,
            table_label:
              raw.dining_table?.name ??
              raw.dining_table?.label ??
              raw.dining_table?.code ??
              sessionStore.tableName ??
              undefined,
            mode: 'table',
            status: mapToHistoryStatus(
              raw.order_status ?? raw.status,
              raw.payment_status,
              raw.bill_status
            ),
            total_amount: Number(raw.total_amount ?? 0),
            created_at: raw.created_at ?? new Date().toISOString(),
            last_seen_at: new Date().toISOString(),
            qris_data: raw.qris_data
          })
        }
      } catch {
        // Jangan block redirect jika sync history gagal
      }
    }

    // Bersihkan cart dan session meja (table order bukan session persisten).
    cart.clearCart()
    sessionStore.clear()

    const trackingIdentifier = result.data?.order_number ?? result.data?.public_token

    if (trackingIdentifier) {
      await router.push({
        path: `/o/${slug}/payments`,
        query: { order: trackingIdentifier }
      })
      return
    }

    await router.push(`/o/${slug}/orders`)
  }

  return {
    submitting,
    error,
    checkout
  }
}
