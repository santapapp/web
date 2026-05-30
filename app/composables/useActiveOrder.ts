/**
 * useActiveOrder — Composable untuk tracking order aktif customer
 *
 * Wrapper tipis di atas useCustomerOrder() yang:
 * 1. Expose order aktif dengan refresh on-demand
 * 2. Sync ke order history localStorage setelah refresh
 *
 * Berbeda dengan useCustomerOrder yang diinstansiasi di page,
 * composable ini didesain untuk digunakan di drawer/sidebar.
 */

import { ref } from 'vue'
import type { CustomerOrderDetail } from '~/types/customer-order'
import { mapToHistoryStatus } from '~/composables/useOrderHistory'

/**
 * Status yang menandakan order sudah selesai dan tidak perlu di-refresh lagi.
 * Middleware backend (EnsureCustomerToken) mengembalikan 403 jika bill_status bukan 'open'.
 */
const isOrderTerminal = (raw: {
  bill_status?: string
  payment_status?: string
  order_status?: string
}): boolean => {
  if (raw.bill_status === 'closed' || raw.bill_status === 'cancelled') return true
  if (raw.payment_status === 'paid' || raw.payment_status === 'cancelled') return true
  if (raw.order_status === 'cancelled') return true
  return false
}

export const useActiveOrder = (orgSlug: string) => {
  const api = useCustomerApi()
  const sessionStore = useCustomerSessionStore()

  const order = ref<CustomerOrderDetail | null>(null)
  const isRefreshing = ref(false)
  const refreshError = ref<string | null>(null)

  /**
   * Refresh status order aktif dari backend.
   * Menggunakan X-Public-Token dari session store.
   *
   * Behavior:
   * - 403/401: token tidak valid atau order sudah closed → clear order, stop
   * - 404: order tidak ditemukan → clear order, stop
   * - Order terminal (paid/closed/cancelled): sync ke history, clear active
   * - Error network/lainnya: tampilkan pesan error, tapi jangan clear order
   */
  const refresh = async (): Promise<void> => {
    if (!import.meta.client) return
    if (!sessionStore.hasSession) return

    // Jangan polling order backend jika session ini murni table_order lokal
    if (sessionStore.sessionType === 'table_order') {
      order.value = null
      return
    }

    isRefreshing.value = true
    refreshError.value = null

    try {
      const res = await api.getOrder()
      const raw = res?.data ?? res

      if (!raw) {
        order.value = null
        return
      }

      // Map ke CustomerOrderDetail
      order.value = {
        id: raw.id,
        order_number: raw.order_number ?? '-',
        public_token: raw.public_token ?? '',
        order_type: raw.order_type ?? 'table_order',
        bill_status: raw.bill_status ?? 'open',
        order_status: raw.order_status ?? 'pending',
        payment_status: raw.payment_status ?? 'unpaid',
        payment_method: raw.payment_method ?? null,
        payment_reference: raw.payment_reference ?? null,
        subtotal_amount: Number(raw.subtotal_amount ?? 0),
        discount_amount: Number(raw.discount_amount ?? 0),
        tax_amount: Number(raw.tax_amount ?? 0),
        service_charge_amount: Number(raw.service_charge_amount ?? 0),
        total_amount: Number(raw.total_amount ?? 0),
        payment_amount: Number(raw.payment_amount ?? 0),
        change_amount: Number(raw.change_amount ?? 0),
        note: raw.note ?? null,
        opened_at: raw.opened_at ?? null,
        closed_at: raw.closed_at ?? null,
        paid_at: raw.paid_at ?? null,
        dining_table: raw.dining_table || raw.table
          ? {
              id: raw.dining_table?.id ?? raw.table?.id ?? 0,
              name: raw.dining_table?.name ?? raw.table?.name ?? '-',
              code: raw.dining_table?.code ?? raw.table?.code ?? '',
              location: raw.dining_table?.location ?? raw.table?.location ?? null
            }
          : null,
        items: Array.isArray(raw.items)
          ? raw.items.map((item: any) => ({
              id: item.id,
              parent_item_id: item.parent_item_id ?? null,
              item_type: item.item_type ?? 'product',
              menu_id: item.menu_id,
              name: item.name ?? '-',
              price: Number(item.price ?? 0),
              quantity: item.quantity,
              subtotal: Number(item.subtotal ?? 0),
              item_status: item.item_status ?? null,
              note: item.note ?? null,
              children: []
            }))
          : [],
        created_at: raw.created_at ?? new Date().toISOString()
      }

      // Sync ke history localStorage
      syncToHistory()

      // Jika order sudah terminal → pindahkan ke history tapi jangan tampilkan sebagai aktif
      if (isOrderTerminal(raw)) {
        order.value = null
      }
    } catch (err: any) {
      const statusCode = err?.statusCode ?? err?.status

      if (statusCode === 403 || statusCode === 401) {
        // Token tidak valid atau order sudah closed — ini expected behavior
        // Middleware EnsureCustomerToken mengembalikan 403 jika bill_status bukan 'open'
        // Jangan tampilkan sebagai error ke user — cukup clear active order
        order.value = null
        refreshError.value = null
      } else if (statusCode === 404) {
        // Order tidak ditemukan
        order.value = null
        refreshError.value = null
      } else {
        // Error lain (network, 500) — tampilkan pesan tapi jangan clear state yang ada
        refreshError.value = err?.message ?? 'Gagal memuat status pesanan.'
      }
    } finally {
      isRefreshing.value = false
    }
  }

  /**
   * Simpan/update order aktif ke order history localStorage.
   * Dipanggil setelah refresh berhasil, atau setelah checkout sukses.
   */
  const syncToHistory = () => {
    if (!import.meta.client) return
    if (!order.value || !orgSlug) return

    const o = order.value
    const publicToken = o.public_token
    const orderCode = o.order_number

    if (!publicToken || !orderCode) return

    const history = useOrderHistory(orgSlug)
    const mode = String(o.order_type).includes('open_bill') ? 'open_bill' : 'table'

    history.addOrUpdate({
      order_public_id: publicToken,
      order_code: orderCode,
      org_slug: orgSlug,
      org_name: sessionStore.orgName ?? undefined,
      table_label: o.dining_table?.name ?? sessionStore.tableName ?? undefined,
      mode,
      status: mapToHistoryStatus(o.order_status, o.payment_status, o.bill_status),
      total_amount: o.total_amount,
      created_at: o.created_at,
      last_seen_at: new Date().toISOString()
    })
  }

  /**
   * Clear order aktif (saat session di-clear).
   */
  const clear = () => {
    order.value = null
    refreshError.value = null
  }

  return {
    order,
    isRefreshing,
    refreshError,
    refresh,
    syncToHistory,
    clear
  }
}
