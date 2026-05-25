/**
 * useCustomerOrder — Composable untuk membuat pesanan dan melihat tagihan aktif
 *
 * Endpoints:
 * - POST /api/v1/customer/orders
 * - GET /api/v1/customer/open-bill
 * - POST /api/v1/customer/call-cashier
 */

import { ref } from 'vue'
import type { CustomerOrder, OpenBill } from '~/types/customer-order'
import type { CustomerApiError } from './useCustomerApi'

export const useCustomerOrder = () => {
  const api = useCustomerApi()
  const sessionStore = useCustomerSessionStore()

  const lastOrder = ref<CustomerOrder | null>(null)
  const openBill = ref<OpenBill | null>(null)
  const orderPending = ref(false)
  const billPending = ref(false)
  const cashierPending = ref(false)
  const orderError = ref<CustomerApiError | null>(null)
  const billError = ref<CustomerApiError | null>(null)

  /**
   * Kirim pesanan baru ke API.
   * Items berasal dari cart (menu_id = integer, sesuai API real).
   */
  const placeOrder = async (
    items: Array<{ menu_id: number; quantity: number; notes?: string | null }>,
    note?: string
  ) => {
    orderPending.value = true
    orderError.value = null

    try {
      const formattedItems = items.map((item) => ({
        menu_id: item.menu_id,
        quantity: item.quantity,
        note: item.notes ?? null
      }))

      const response = await api.createOrder({ items: formattedItems, note })
      lastOrder.value = response.data

      // Update total di session store jika ada open bill
      if (sessionStore.openBill) {
        // Refresh open bill setelah order berhasil
        await fetchOpenBill()
      }

      return { success: true, data: response.data, message: response.message }
    } catch (err) {
      orderError.value = err as CustomerApiError
      return { success: false, error: err as CustomerApiError }
    } finally {
      orderPending.value = false
    }
  }

  /**
   * Ambil detail tagihan aktif meja (semua order + pembayaran).
   */
  const fetchOpenBill = async () => {
    billPending.value = true
    billError.value = null

    try {
      const response = await api.getOpenBill()
      const order = response.data

      if (!order) {
        openBill.value = null
        return { success: true, data: null }
      }

      const payments: any[] = []
      if (order.payment_method && order.payment_reference) {
        payments.push({
          id: order.id.toString(),
          payment_number: order.payment_reference,
          method: order.payment_method,
          status: order.payment_status,
          amount: Number(order.total_amount),
          paid_at: order.paid_at,
          qr_string: order.payment_method === 'qris' ? order.payment_reference : null,
          expiry_time: null
        })
      }

      const mappedBill: OpenBill = {
        id: order.id.toString(),
        bill_number: order.order_number,
        status: order.bill_status,
        subtotal_amount: Number(order.subtotal_amount),
        discount_amount: 0,
        service_amount: 0,
        tax_amount: 0,
        total_amount: Number(order.total_amount),
        opened_at: order.opened_at,
        table: {
          id: order.dining_table_id,
          name: order.dining_table?.name || `Meja ${order.dining_table_id}`,
          code: order.dining_table?.name || `Meja ${order.dining_table_id}`
        },
        payments
      }

      openBill.value = mappedBill

      // Sync total ke session store
      if (sessionStore.openBill) {
        sessionStore.setOpenBill({
          id: mappedBill.id,
          bill_number: mappedBill.bill_number,
          status: mappedBill.status as 'open' | 'locked' | 'closed',
          total_amount: mappedBill.total_amount
        })
      }

      return { success: true, data: mappedBill }
    } catch (err) {
      billError.value = err as CustomerApiError
      return { success: false, error: err as CustomerApiError }
    } finally {
      billPending.value = false
    }
  }

  /**
   * Panggil kasir untuk bantuan atau ingin bayar.
   */
  const callCashier = async () => {
    cashierPending.value = true

    try {
      const response = await api.callCashier()
      return { success: true, message: response.message }
    } catch (err) {
      return { success: false, error: err as CustomerApiError }
    } finally {
      cashierPending.value = false
    }
  }

  return {
    lastOrder,
    openBill,
    orderPending,
    billPending,
    cashierPending,
    orderError,
    billError,
    placeOrder,
    fetchOpenBill,
    callCashier
  }
}
