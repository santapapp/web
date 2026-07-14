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

// Module-level throttle trackers to protect API from aggressive polling / reconnect loops
let lastOrderStatusFetchTime = 0
let lastOpenBillFetchTime = 0
const MIN_FETCH_INTERVAL_MS = 5000 // 5 seconds throttle

export const useCustomerOrder = () => {
  const api = useCustomerApi()
  const sessionStore = useCustomerSessionStore()

  const order = ref<CustomerOrderDetail | null>(null)
  const orderPending = ref(false)
  const fetchPending = ref(false)
  const statusPending = ref(true)
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
  /**
   * Buat order baru (table_order) di backend.
   * Dipanggil saat checkout.
   */
  const createNewOrder = async (
    tableToken: string,
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
        qr_token: tableToken,
        idempotency_key: crypto.randomUUID(),
        items: items.map((item) => ({
          menu_id: item.menu_id,
          quantity: item.quantity,
          // Contract create table order memakai `note` (singular)
          note: item.notes ?? null,
          selected_variants: item.selected_variants ?? []
        }))
      }

      const response = await api.createOrder(payload)

      const rawOrder = unwrapOrderResponse(response)

      if (rawOrder) {
        order.value = mapOrderResponse(rawOrder)
        syncToSessionStore(rawOrder)
      }

      return { success: true, data: rawOrder, message: response.message }
    } catch (err) {
      orderError.value = err as CustomerApiError
      return { success: false, error: err as CustomerApiError }
    } finally {
      orderPending.value = false
    }
  }

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
  const fetchOpenBill = async (opts: { silent?: boolean } = {}) => {
    const { silent = false } = opts
    const now = Date.now()

    // Throttle silent background fetches
    if (silent && (now - lastOpenBillFetchTime < MIN_FETCH_INTERVAL_MS) && order.value) {
      return { success: true, data: order.value }
    }

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
      lastOpenBillFetchTime = Date.now()

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
   *
   * Endpoint publik: GET /v1/customer/orders/{order_number_or_public_token}
   * Tidak butuh session / X-Public-Token.
   */
  const fetchOrderStatus = async (
    orgSlug: string,
    orderToken: string,
    opts: { silent?: boolean } = {}
  ) => {
    // silent = polling background. Tujuannya: refresh data diam-diam tanpa memicu
    // skeleton/loading dan tanpa mengosongkan state valid terakhir saat 1 request gagal.
    // Loading (statusPending) hanya untuk load awal / aksi penting.
    const { silent = false } = opts
    const now = Date.now()

    // Throttle silent background fetches
    if (silent && (now - lastOrderStatusFetchTime < MIN_FETCH_INTERVAL_MS) && order.value) {
      return { success: true, data: order.value }
    }

    if (!silent) statusPending.value = true
    statusError.value = null

    try {
      const response = await api.getPublicOrder(orgSlug, orderToken)
      const raw = unwrapOrderResponse(response)

      if (!raw) {
        // Load awal: tampilkan state kosong + error. Polling: pertahankan state terakhir.
        if (silent) return { success: false }
        order.value = null
        throw { message: 'Order tidak ditemukan atau sudah kedaluwarsa.', statusCode: 404 }
      }

      order.value = mapOrderResponse(raw)
      lastOrderStatusFetchTime = Date.now()
      return { success: true, data: order.value }
    } catch (err) {
      // Saat polling background, JANGAN hapus tampilan valid hanya karena error transien
      // (network/500). Biarkan UI tetap stabil dan coba lagi pada poll berikutnya.
      if (silent) return { success: false, error: err as CustomerApiError }
      statusError.value = err as CustomerApiError
      order.value = null
      return { success: false, error: err as CustomerApiError }
    } finally {
      if (!silent) statusPending.value = false
    }
  }

  /**
   * Poll/refresh status pembayaran TABLE ORDER (publik).
   * Endpoint: GET /v1/customer/orders/{order_number_or_public_token}/payment-status
   *
   * Tidak butuh session, table token, maupun X-Public-Token.
   * Mengembalikan payment_status + field status order ringan,
   * dan ikut memperbarui beberapa field di `order` jika sudah ada.
   */
  const fetchPublicPaymentStatus = async (orderToken: string) => {
    try {
      const response = await api.getPublicPaymentStatus(orderToken)
      const raw = unwrapOrderResponse(response)

      if (!raw) {
        return { success: true, data: null }
      }

      // Update field status ringan pada order aktif jika sudah ada
      if (order.value) {
        order.value = {
          ...order.value,
          payment_status: raw.payment_status ?? order.value.payment_status,
          order_status: raw.order_status ?? order.value.order_status,
          bill_status: raw.bill_status ?? order.value.bill_status,
          paid_at: raw.paid_at ?? order.value.paid_at,
          cancel_reason: raw.cancel_reason ?? order.value.cancel_reason ?? null
        }
      }

      return {
        success: true,
        data: {
          payment_status: raw.payment_status,
          order_status: raw.order_status,
          bill_status: raw.bill_status,
          paid_at: raw.paid_at ?? null,
          cancel_reason: raw.cancel_reason ?? null
        }
      }
    } catch (err) {
      return { success: false, error: err as CustomerApiError }
    }
  }

  return {
    order,
    orderPending,
    fetchPending,
    statusPending,
    orderError,
    fetchError,
    statusError,

    openBill,
    billPending,
    billError,

    createNewOrder,
    placeOrder,
    fetchOpenBill,
    fetchOrderStatus,
    fetchPublicPaymentStatus
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Memetakan raw response dari OrderDetailResource ke CustomerOrderDetail.
 * Field sesuai dengan yang dikembalikan backend secara eksplisit.
 */
function mapOrderResponse(raw: any): CustomerOrderDetail {
  return {
    id: raw.id ?? raw.order_id ?? raw.uuid ?? raw.token ?? raw.order_token ?? raw.order_number,
    order_id: raw.order_id ?? raw.id ?? undefined,
    order_number: raw.order_number ?? raw.token ?? raw.order_token ?? '-',
    public_token: raw.public_token ?? raw.token ?? raw.order_token ?? raw.order_number ?? '',
    order_type: raw.order_type ?? raw.type ?? 'table_order',
    bill_status: raw.bill_status ?? raw.bill?.status ?? 'none',
    order_status: raw.order_status ?? raw.status ?? 'pending',
    payment_status: raw.payment_status ?? raw.payment?.status ?? 'unpaid',
    payment_method: raw.payment_method ?? null,
    payment_reference: raw.payment_reference ?? raw.qris_data?.payment_reference ?? null,
    cancel_reason: raw.cancel_reason ?? null,
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
    created_at: raw.created_at ?? new Date().toISOString(),
    qris_data: raw.qris_data ?? null,
    payment_expires_at: raw.payment_expires_at ?? null,
    server_time: raw.server_time ?? null
  }
}

/**
 * Memetakan item dari OrderItemResource ke CustomerOrderItem.
 */
export function mapOrderItem(raw: any): CustomerOrderItem {
  return {
    id: raw.id,
    parent_item_id: raw.parent_item_id ?? null,
    item_type: raw.item_type ?? 'product',
    menu_id: raw.menu_id,
    name: raw.name ?? raw.menu_name_snapshot ?? raw.menu_name ?? '-',
    price: Number(raw.base_price ?? raw.price ?? raw.menu_price_snapshot ?? 0),
    quantity: raw.quantity,
    subtotal: Number(raw.subtotal ?? raw.subtotal_amount ?? 0),
    item_status: raw.item_status ?? raw.status ?? null,
    note: raw.note ?? raw.notes ?? null,
    image: raw.image ?? raw.image_url ?? raw.menu_image ?? raw.menu?.image ?? raw.menu?.image_url ?? null,
    children: [
      ...(Array.isArray(raw.children) ? raw.children.map(mapOrderItem) : []),
      ...(Array.isArray(raw.selected_options)
        ? raw.selected_options.map((opt: any, idx: number) => ({
            id: `${raw.id}-opt-${opt.option_id ?? idx}`,
            parent_item_id: raw.id,
            item_type: opt.option_type === 'addon' ? 'addon' : 'variant',
            menu_id: opt.option_id ?? 0,
            name: opt.option_name ?? '-',
            price: Number(opt.price_delta ?? 0),
            quantity: raw.quantity,
            subtotal: Number(opt.price_delta ?? 0) * raw.quantity,
            item_status: null,
            note: null,
            image: null,
            children: []
          }))
        : [])
    ]
  }
}

function unwrapOrderResponse(response: any): any {
  if (!response) return null
  
  if (response.data?.order) {
    return {
      ...response.data.order,
      qris_data: response.data.payment?.qris_data ?? response.data.order.qris_data,
      payment_expires_at: response.data.payment?.payment_expires_at ?? response.data.order.payment_expires_at,
      server_time: response.data.server_time ?? response.server_time
    }
  }

  if (response.order) {
    return {
      ...response.order,
      qris_data: response.payment?.qris_data ?? response.order.qris_data,
      payment_expires_at: response.payment?.payment_expires_at ?? response.order.payment_expires_at,
      server_time: response.server_time
    }
  }

  if (response.data) return response.data
  
  return response
}

/**
 * Sinkronisasi total order ke session store untuk konsistensi UI.
 *
 * ATURAN: Hanya update openBill jika session ini memang open bill.
 * Untuk table order biasa, jangan menyentuh openBill di store.
 */
function syncToSessionStore(raw: any) {
  const sessionStore = useCustomerSessionStore()

  // Guard: hanya sync openBill untuk open_bill session
  if (sessionStore.sessionType !== 'open_bill') return
  if (!sessionStore.openBill) return

  sessionStore.setOpenBill({
    id: raw.public_token,
    bill_number: raw.order_number,
    status: raw.bill_status,
    total_amount: Number(raw.total_amount ?? 0)
  })
}
