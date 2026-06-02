/**
 * useOrderStatus — Sumber tunggal pemetaan status order/order item/payment → label & warna.
 *
 * Tujuan: hindari duplikasi mapping status yang tersebar di banyak komponen.
 * Semua nilai status di sini SELARAS dengan enum backend `api-santap`:
 *
 *   order_status   : pending | confirmed | preparing | ready | completed | cancelled
 *   payment_status : unpaid | pending | paid | failed | cancelled
 *   bill_status    : none | open | closed
 *   item_status    : pending | preparing | ready | served | cancelled
 *
 * Catatan: backend TIDAK mengirim `processing` untuk order_status (itu hanya alias
 * legacy yang dipetakan setara `preparing`). `order_status` di backend di-roll up
 * dari `item_status`, jadi frontend hanya membaca — tidak pernah mengarang status.
 *
 * Mapping riwayat (OrderHistoryStatus) tetap berada di useOrderHistory.mapToHistoryStatus
 * (karena di-import eksplisit di beberapa composable); di sini disediakan hanya
 * konfigurasi tampilannya (`historyStatusConfig`).
 */

import type {
  OrderStatus,
  PaymentStatus,
  OrderItemStatus
} from '~/types/customer-order'
import type { OrderHistoryStatus } from '~/types/order-history'

/** Warna badge yang valid pada Nuxt UI (UBadge `color`). */
export type StatusColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warning'
  | 'error'
  | 'neutral'

export interface StatusConfig {
  label: string
  color: StatusColor
}

// ─── Payment status ──────────────────────────────────────────────────────────
// Backend: unpaid | pending | paid | failed | cancelled
// `failed` & `cancelled` diperlakukan setara (kegagalan terminal).

export function paymentStatusConfig(status?: PaymentStatus | string | null): StatusConfig {
  switch (status) {
    case 'paid':
      return { label: 'Lunas', color: 'success' }
    case 'pending':
      return { label: 'Menunggu Bayar', color: 'warning' }
    case 'failed':
    case 'cancelled':
      return { label: 'Dibatalkan', color: 'error' }
    default: // 'unpaid' / null
      return { label: 'Belum Bayar', color: 'neutral' }
  }
}

// ─── Order status ────────────────────────────────────────────────────────────
// Backend: pending | confirmed | preparing | ready | completed | cancelled
// 'processing' = alias legacy untuk 'preparing'.

export function orderStatusLabel(status?: OrderStatus | string | null): string {
  switch (status) {
    case 'confirmed':
      return 'Dikonfirmasi'
    case 'preparing':
    case 'processing':
      return 'Diproses'
    case 'ready':
      return 'Siap'
    case 'completed':
      return 'Selesai'
    case 'cancelled':
      return 'Dibatalkan'
    default: // 'pending'
      return 'Menunggu'
  }
}

/**
 * Peringkat progres order_status untuk timeline (semakin besar = semakin maju).
 * Selaras dengan urutan transisi backend. 'processing' = alias 'preparing'.
 */
export const ORDER_STATUS_RANK: Record<string, number> = {
  pending: 0,
  confirmed: 1,
  preparing: 2,
  processing: 2,
  ready: 3,
  completed: 4
}

// ─── Order item status ───────────────────────────────────────────────────────
// Backend: pending | preparing | ready | served | cancelled
// Mengembalikan null bila status tidak perlu ditampilkan (mis. tanpa status).

export function itemStatusConfig(status?: OrderItemStatus | string | null): StatusConfig | null {
  switch (status) {
    case 'preparing':
      return { label: 'Disiapkan', color: 'info' }
    case 'ready':
      return { label: 'Siap', color: 'warning' }
    case 'served':
      return { label: 'Disajikan', color: 'success' }
    case 'cancelled':
      return { label: 'Dibatalkan', color: 'error' }
    case 'pending':
      return { label: 'Menunggu', color: 'neutral' }
    default:
      return null
  }
}

// ─── History status (display) ────────────────────────────────────────────────
// OrderHistoryStatus adalah bucket turunan dari mapToHistoryStatus (useOrderHistory).

export function historyStatusConfig(status?: OrderHistoryStatus | string | null): StatusConfig {
  switch (status) {
    case 'paid':
      return { label: 'Lunas', color: 'success' }
    case 'waiting_payment':
      return { label: 'Menunggu Bayar', color: 'warning' }
    case 'processing':
      return { label: 'Diproses', color: 'info' }
    case 'ready':
      return { label: 'Siap', color: 'warning' }
    case 'completed':
      return { label: 'Selesai', color: 'success' }
    case 'cancelled':
      return { label: 'Dibatalkan', color: 'error' }
    case 'expired':
      return { label: 'Kedaluwarsa', color: 'neutral' }
    default: // 'pending'
      return { label: 'Pending', color: 'neutral' }
  }
}
