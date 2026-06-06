/**
 * useCheckout — Composable untuk proses checkout
 *
 * Setelah checkout sukses:
 * 1. Bersihkan cart
 * 2. Sync order ke riwayat localStorage (useOrderHistory)
 * 3. Redirect ke halaman status order
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
    let result

    if (isModeOpenBill) {
      result = await placeOrder(cart.orderPayload.value)
    } else {
      // Table order: qr_token meja dipegang sementara di memory (sessionStore.sessionToken)
      // hanya untuk membuat order baru. Konteks ini dibersihkan setelah order dibuat.
      const qrToken = sessionStore.sessionToken
      if (!qrToken) {
        submitting.value = false
        error.value = 'Token meja tidak ditemukan.'
        return
      }
      result = await createNewOrder(qrToken, cart.orderPayload.value)
    }

    submitting.value = false

    if (!result.success) {
      if (result.error?.errors) {
        if (import.meta.dev) {
          console.error('Customer order validation failed:', result.error.errors)
        }
        // Extract and flatten all validation messages
        error.value = Object.values(result.error.errors).flat().join(' ')
      } else {
        error.value = result.error?.message ?? 'Gagal mengirim pesanan.'
      }
      return
    }

    const slug = toValue(orgSlug)

    // Simpan reference order ke history SEGERA setelah order berhasil dibuat —
    // bukan menunggu payment paid. Jika user menutup browser saat payment pending,
    // order sudah ada di backend dan tetap harus muncul di riwayat/tracking.
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
            mode: isModeOpenBill ? 'open_bill' : 'table',
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

    // Bersihkan cart untuk SEMUA mode segera setelah order berhasil dibuat.
    // Jangan menunggu payment paid.
    cart.clearCart()

    // Table order BUKAN session: bersihkan konteks meja sementara setelah order dibuat.
    // Open bill dibiarkan — sesinya memang dibutuhkan untuk lanjut menambah item.
    if (!isModeOpenBill) {
      sessionStore.clear()
    }

    const trackingIdentifier = isModeOpenBill
      ? (result.data?.public_token ?? result.data?.token)
      : (result.data?.order_number ?? result.data?.public_token)

    if (trackingIdentifier) {
      // Langsung redirect ke halaman payments/tracking.
      // Table order memakai order_number (sesuai contract), open bill memakai bill token.
      await router.push({
        path: `/o/${slug}/payments`,
        query: isModeOpenBill ? { bill: trackingIdentifier } : { order: trackingIdentifier }
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
