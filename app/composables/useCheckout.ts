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
import { mapToHistoryStatus } from '~/composables/useOrderHistory'

type CheckoutCart = ReturnType<typeof useOrderCart>

export const useCheckout = (orgSlug: MaybeRefOrGetter<string>, cart: CheckoutCart) => {
  const router = useRouter()
  const { placeOrder } = useCustomerOrder()
  const sessionStore = useCustomerSessionStore()

  const submitting = ref(false)
  const error = ref<string | null>(null)

  const checkout = async () => {
    if (cart.totalQuantity.value === 0 || submitting.value) return

    submitting.value = true
    error.value = null

    const result = await placeOrder(cart.orderPayload.value)
    submitting.value = false

    if (!result.success) {
      error.value = result.error?.message ?? 'Gagal mengirim pesanan.'
      return
    }

    // ── Sync ke order history langsung setelah checkout sukses ──────────────
    if (import.meta.client && result.data) {
      try {
        const raw = result.data
        const slug = toValue(orgSlug)
        const publicToken = raw.public_token ?? raw.token ?? raw.order_token
        const orderCode = raw.order_number

        if (slug && publicToken && orderCode) {
          const history = useOrderHistory(slug)
          const mode = String(raw.order_type ?? '').includes('open_bill')
            ? 'open_bill'
            : 'table'

          history.addOrUpdate({
            order_public_id: String(publicToken),
            order_code: String(orderCode),
            org_slug: slug,
            org_name: sessionStore.orgName ?? undefined,
            table_label:
              raw.dining_table?.name ??
              raw.dining_table?.label ??
              sessionStore.tableName ??
              undefined,
            mode,
            status: mapToHistoryStatus(
              raw.order_status ?? raw.status,
              raw.payment_status,
              raw.bill_status
            ),
            total_amount: Number(raw.total_amount ?? 0),
            created_at: raw.created_at ?? new Date().toISOString(),
            last_seen_at: new Date().toISOString()
          })
        }
      } catch {
        // Jangan block redirect jika sync history gagal
      }
    }

    const orderNumber = result.data?.order_number
    cart.clearCart()

    if (orderNumber) {
      await router.push({
        path: `/o/${toValue(orgSlug)}/orders`,
        query: { order: orderNumber }
      })
      return
    }

    await router.push(`/o/${toValue(orgSlug)}/orders`)
  }

  return {
    submitting,
    error,
    checkout
  }
}
