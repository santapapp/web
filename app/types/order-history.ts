/**
 * types/order-history.ts
 *
 * Type untuk riwayat pesanan customer yang disimpan di localStorage.
 * Key: `santap:${orgSlug}:order_history`
 *
 * Catatan desain:
 * - Gunakan order_public_id (public_token) dan order_code (order_number) sebagai identifier.
 * - Jangan simpan raw database ID sebagai identifier utama customer-facing.
 * - Data ini adalah pointer ringan — source of truth tetap backend.
 */

export type OrderHistoryMode = 'table' | 'open_bill'

export type OrderHistoryStatus =
  | 'pending'
  | 'waiting_payment'
  | 'paid'
  | 'processing'    // order_status confirmed/preparing (alias legacy: processing)
  | 'ready'         // order_status ready — pesanan siap disajikan
  | 'completed'
  | 'cancelled'
  | 'expired'  // order tidak ditemukan / session expired / 403 dari backend

export interface OrderHistoryItem {
  /** public_token dari backend — identifier utama untuk fetch ulang ke API */
  order_public_id: string

  /** order_number dari backend — kode yang ditampilkan ke customer */
  order_code: string

  /** raw order id numerik dari backend (reference, bukan identifier customer-facing) */
  order_id?: number | string

  /** public_token eksplisit (mirror order_public_id) untuk kejelasan reference */
  public_token?: string

  org_slug: string
  org_name?: string

  /** Label meja (table mode) atau bill code (open_bill mode) */
  table_label?: string

  /** Mode sesi saat order dibuat */
  mode: OrderHistoryMode

  status?: OrderHistoryStatus

  total_amount?: number

  created_at: string

  /** Diperbarui setiap kali drawer dibuka dan status di-refresh */
  last_seen_at: string

  qris_data?: {
    qr_url?: string | null
    qr_string?: string | null
    payment_reference?: string | null
  }
}

/** Metadata storage agar bisa versioning dan cleanup */
export interface OrderHistoryStorage {
  version: number
  org_slug: string
  items: OrderHistoryItem[]
}

/** Versi storage saat ini — bump ini untuk trigger auto-cleanup format lama */
export const ORDER_HISTORY_STORAGE_VERSION = 1

/** Jumlah maksimal riwayat yang disimpan per org */
export const ORDER_HISTORY_MAX_ITEMS = 30
