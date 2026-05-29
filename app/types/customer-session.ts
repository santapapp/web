// Types untuk Customer Session
// Scan QR meja → GET /v1/customer/table/{qrToken}
// Validasi sesi aktif → GET /v1/customer/order (header: X-Public-Token)

/**
 * Payload untuk startSession() di composable.
 * Hanya membutuhkan qr_token — scan QR meja sudah cukup.
 * organization_slug dan table_code tidak diperlukan oleh API.
 */
export interface StartSessionPayload {
  qr_token: string
}

export interface CustomerSessionOrg {
  id: number
  uuid?: string   // opsional — dipakai oleh store legacy
  name: string
  slug: string
}

export interface CustomerSessionTable {
  id: number
  name: string
  code: string
  location?: string | null  // opsional — store tidak selalu menyediakan ini
}

/**
 * Representasi sesi order customer.
 * public_token digunakan sebagai X-Public-Token header
 * untuk semua request yang membutuhkan autentikasi customer.
 */
export interface CustomerSessionOrder {
  public_token: string
  order_number: string
}

export interface CustomerSession {
  organization: CustomerSessionOrg
  table: CustomerSessionTable
  order: CustomerSessionOrder
}

// Response dari GET /v1/customer/table/{qrToken}
export interface StartSessionResponse {
  data: CustomerSession
}

// Response dari GET /v1/customer/order (dipakai untuk validasi sesi)
export interface CurrentOrderResponse {
  data: {
    id: number
    order_number: string
    public_token: string
    bill_status: 'open' | 'closed' | 'cancelled'
    order_status: string
    payment_status: string
    total_amount: number
    opened_at: string | null
    dining_table: {
      id: number
      name: string
      code: string
      location: string | null
    } | null
  }
}

// Tipe data yang disimpan di store (format legacy — id dan bill_number)
export interface StoredSessionOpenBill {
  id: string
  bill_number: string
  status: 'open' | 'locked' | 'closed'
  total_amount: number
}
