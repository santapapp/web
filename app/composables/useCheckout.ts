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
      const tableToken = sessionStore.table?.code // wait, what token is stored for table_order? 
      // table_order actually stores the token in 'code' or we need to extract from URL?
      // Wait, we need the actual qrToken! It's saved as sessionToken for table_order.
      const qrToken = sessionStore.sessionToken
      if (!qrToken) {
        submitting.value = false
        error.value = 'Token meja tidak ditemukan.'
        return
      }
      result = await createNewOrder(qrToken, cart.orderPayload.value)
      
      // Do not alter sessionStore for Table Order to keep it stateless.
    }

    submitting.value = false

    // Jangan bersihkan cart di sini untuk Table Order.
    // Cart hanya dibersihkan saat benar-benar paid/success di halaman tracking.
    if (isModeOpenBill) {
      cart.clearCart()
    }

    if (!result.success) {
      error.value = result.error?.message ?? 'Gagal mengirim pesanan.'
      return
    }
    
    if (import.meta.client && result.data && isModeOpenBill) {
      try {
        const raw = result.data
        const slug = toValue(orgSlug)
        const publicToken = raw.public_token ?? raw.token ?? raw.order_token
        const orderCode = raw.order_number

        if (slug && publicToken && orderCode) {
          const history = useOrderHistory(slug)
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
            mode: 'open_bill',
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

      // Open bill: langsung bersihkan cart karena order sudah di-sync ke backend open bill
      cart.clearCart()
    }

    const trackingIdentifier = isModeOpenBill
      ? (result.data?.public_token ?? result.data?.token)
      : (result.data?.order_number ?? result.data?.order_no ?? result.data?.public_token)
    
    if (trackingIdentifier) {
      // Langsung redirect ke halaman payments
      await router.push({
        path: `/o/${toValue(orgSlug)}/payments`,
        query: isModeOpenBill ? { bill: trackingIdentifier } : { order: trackingIdentifier }
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
