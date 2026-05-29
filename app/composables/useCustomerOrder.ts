/**
 * useCustomerOrder — Composable untuk mengelola order customer
 *
 * Endpoints:
 * - POST /v1/customer/order/items  → tambah item (X-Public-Token)
 * - GET  /v1/customer/order        → lihat order aktif (X-Public-Token)
 *
 * Catatan keputusan desain:
 * - Note order hanya di level item (items[].note), bukan root order
 * - Fitur callCashier tidak tersedia (endpoint backend belum ada)
 * - fetchOpenBill() memetakan CustomerOrderDetail dari OrderDetailResource
 */

import { ref } from 'vue'
import type {
  CustomerOrderDetail,
  CustomerOrderItem,
  CreateOrderItem
} from '~/types/customer-order'
import type { CustomerApiError } from './useCustomerApi'

export const useCustomerOrder = () => {
  const api = useCustomerApi()
  const sessionStore = useCustomerSessionStore()

  const order = ref<CustomerOrderDetail | null>(null)
  const orderPending = ref(false)
  const fetchPending = ref(false)
  const statusPending = ref(false)
  const orderError = ref<CustomerApiError | null>(null)
  const fetchError = ref<CustomerApiError | null>(null)
  const statusError = ref<CustomerApiError | null>(null)

  // Aliases yang dipakai di halaman-halaman lama
  const openBill = order
  const billPending = fetchPending
  const billError = fetchError

  /**
   * Tambah item ke order aktif.
   *
   * Payload baru mendukung selected_variants:
   * {
   *   menu_id: product.id,
   *   quantity,
   *   notes,
   *   selected_variants: [{ variant_group_id, variant_id }]
   * }
   *
   * Frontend hanya menghitung preview subtotal — harga final dari backend response.
   */
  const placeOrder = async (
    items: Array<{
      menu_id: number
      quantity: number
      notes?: string | null
      selected_variants?: Array<{ variant_group_id: number; variant_id: number }>
    }>
  ) => {
    orderPending.value = true
    orderError.value = null

    try {
      const payload = {
        items: items.map((item) => ({
          menu_id: item.menu_id,
          quantity: item.quantity,
          notes: item.notes ?? null,
          selected_variants: item.selected_variants ?? []
        }))
      }

      const response = await api.addItems(payload)

      // Update order state dengan data terbaru dari backend
      if (response.data) {
        order.value = mapOrderResponse(response.data)
        syncToSessionStore(response.data)
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
   * Ambil detail order aktif dari server.
   * Menggunakan public_token dari localStorage sebagai X-Public-Token.
   * GET /v1/customer/order
   */
  const fetchOpenBill = async () => {
    fetchPending.value = true
    fetchError.value = null

    try {
      const response = await api.getOrder()
      const raw = response.data

      if (!raw) {
        order.value = null
        return { success: true, data: null }
      }

      order.value = mapOrderResponse(raw)

      // Sync total ke session store
      syncToSessionStore(raw)

      return { success: true, data: order.value }
    } catch (err) {
      fetchError.value = err as CustomerApiError
      return { success: false, error: err as CustomerApiError }
    } finally {
      fetchPending.value = false
    }
  }

  /**
   * Ambil detail/status order publik dari query ?order.
   * Query hanya menjadi entry point; data final selalu dari backend.
   */
  const fetchOrderStatus = async (orgSlug: string, orderToken: string) => {
    statusPending.value = true
    statusError.value = null

    try {
      const response = await api.getPublicOrder(orgSlug, orderToken)
      const raw = unwrapOrderResponse(response)

      if (!raw) {
        order.value = null
        throw { message: 'Order tidak ditemukan atau sudah kedaluwarsa.', statusCode: 404 }
      }

      order.value = mapOrderResponse(raw)
      return { success: true, data: order.value }
    } catch (err) {
      statusError.value = err as CustomerApiError
      order.value = null
      return { success: false, error: err as CustomerApiError }
    } finally {
      statusPending.value = false
    }
  }

  return {
    order,
    openBill,       // alias untuk backward compatibility
    orderPending,
    fetchPending,
    statusPending,
    billPending,    // alias untuk backward compatibility
    orderError,
    fetchError,
    statusError,
    billError,      // alias untuk backward compatibility
    placeOrder,
    fetchOpenBill,
    fetchOrderStatus
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Memetakan raw response dari OrderDetailResource ke CustomerOrderDetail.
 * Field sesuai dengan yang dikembalikan backend secara eksplisit.
 */
function mapOrderResponse(raw: any): CustomerOrderDetail {
  return {
    id: raw.id ?? raw.uuid ?? raw.token ?? raw.order_token ?? raw.order_number,
    order_number: raw.order_number ?? raw.token ?? raw.order_token ?? '-',
    public_token: raw.public_token ?? raw.token ?? raw.order_token ?? raw.order_number ?? '',
    order_type: raw.order_type ?? raw.type ?? 'table_order',
    bill_status: raw.bill_status ?? raw.bill?.status ?? 'open',
    order_status: raw.order_status ?? raw.status ?? 'pending',
    payment_status: raw.payment_status ?? raw.payment?.status ?? 'unpaid',
    payment_method: raw.payment_method ?? null,
    payment_reference: raw.payment_reference ?? null,
    subtotal_amount: Number(raw.subtotal_amount ?? raw.subtotal ?? 0),
    discount_amount: Number(raw.discount_amount ?? 0),
    tax_amount: Number(raw.tax_amount ?? raw.tax ?? 0),
    service_charge_amount: Number(raw.service_charge_amount ?? raw.service_fee ?? raw.service_amount ?? 0),
    total_amount: Number(raw.total_amount ?? raw.total ?? raw.amount ?? 0),
    payment_amount: Number(raw.payment_amount ?? 0),
    change_amount: Number(raw.change_amount ?? 0),
    note: raw.note ?? null,
    opened_at: raw.opened_at ?? null,
    closed_at: raw.closed_at ?? null,
    paid_at: raw.paid_at ?? null,
    dining_table: raw.dining_table || raw.table
      ? {
          id: raw.dining_table?.id ?? raw.table?.id ?? 0,
          name: raw.dining_table?.name ?? raw.table?.label ?? raw.table?.name ?? '-',
          code: raw.dining_table?.code ?? raw.table?.code ?? raw.table?.token ?? '',
          location: raw.dining_table?.location ?? raw.table?.location ?? null
        }
      : null,
    items: Array.isArray(raw.items) ? raw.items.map(mapOrderItem) : [],
    created_at: raw.created_at ?? new Date().toISOString()
  }
}

/**
 * Memetakan item dari OrderItemResource ke CustomerOrderItem.
 */
function mapOrderItem(raw: any): CustomerOrderItem {
  return {
    id: raw.id,
    parent_item_id: raw.parent_item_id ?? null,
    item_type: raw.item_type ?? 'product',
    menu_id: raw.menu_id,
    name: raw.name ?? raw.menu_name_snapshot ?? raw.menu_name ?? '-',
    price: Number(raw.price ?? raw.menu_price_snapshot ?? 0),
    quantity: raw.quantity,
    subtotal: Number(raw.subtotal ?? raw.subtotal_amount ?? 0),
    item_status: raw.item_status ?? raw.status ?? null,
    note: raw.note ?? raw.notes ?? null,
    children: Array.isArray(raw.children) ? raw.children.map(mapOrderItem) : []
  }
}

function unwrapOrderResponse(response: any): any {
  if (!response) return null
  if (response.data?.order) return response.data.order
  if (response.data) return response.data
  if (response.order) return response.order
  return response
}

/**
 * Sinkronisasi total order ke session store untuk konsistensi UI.
 */
function syncToSessionStore(raw: any) {
  const sessionStore = useCustomerSessionStore()
  if (sessionStore.openBill) {
    sessionStore.setOpenBill({
      id: raw.public_token,
      bill_number: raw.order_number,
      status: raw.bill_status,
      total_amount: Number(raw.total_amount ?? 0)
    })
  }
}
