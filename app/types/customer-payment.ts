// Types untuk Customer Payment
// Inisiasi QRIS → POST /v1/customer/order/pay-qris   (header: X-Public-Token)
// Cek status    → GET  /v1/customer/order/qris-status (header: X-Public-Token)
// Batalkan      → DELETE /v1/customer/order/qris-cancel (header: X-Public-Token)

// Sinkron dengan App\Enums\PaymentStatus backend. 'failed' diperlakukan setara
// 'cancelled' (kegagalan terminal) di seluruh UI.
export type QrisPaymentStatus = 'unpaid' | 'pending' | 'paid' | 'cancelled' | 'failed'

// ─── Initiate QRIS Payment ────────────────────────────────────────────────────

/**
 * Response dari POST /v1/customer/order/pay-qris
 * Sesuai CustomerController::payQris()
 */
export interface InitiateQrisResponse {
  data: {
    qr_url: string | null
    payment_reference: string
  }
  message: string
}

// ─── Check QRIS Status ────────────────────────────────────────────────────────

/**
 * Response dari GET /v1/customer/order/qris-status
 * Sesuai CustomerController::qrisStatus()
 */
export interface QrisStatusResponse {
  data: {
    payment_status: QrisPaymentStatus
  }
}

// ─── Cancel QRIS ──────────────────────────────────────────────────────────────

/**
 * Response dari DELETE /v1/customer/order/qris-cancel
 * Sesuai CustomerController::qrisCancel()
 */
export interface QrisCancelResponse {
  message: string
}

// ─── Local Payment State ──────────────────────────────────────────────────────

/**
 * State lokal untuk mengelola siklus pembayaran QRIS di frontend.
 * Digunakan oleh useCustomerPayment composable.
 */
export interface LocalQrisPayment {
  qr_url: string
  payment_reference: string
  status: QrisPaymentStatus
  expires_at: string | null
}

// Legacy aliases — kept for backward compatibility with payments.vue
export interface InitiatePaymentResponse extends InitiateQrisResponse {}
export interface CheckPaymentResponse extends QrisStatusResponse {}
export interface CancelPaymentResponse extends QrisCancelResponse {}
