// Types untuk Customer Payment API (Real API)
// Endpoint: POST /api/v1/customer/payments
// Endpoint: POST /api/v1/customer/payments/{id}/check
// Endpoint: POST /api/v1/customer/payments/{id}/cancel

export type CustomerPaymentStatus = 'pending' | 'paid' | 'failed'

export interface CustomerPaymentMetadata {
  status_code: string
  status_message: string
  transaction_id: string
  order_id: string
  gross_amount: string
  qr_string: string
  expiry_time: string
}

export interface CustomerPayment {
  id: string
  organization_id: number
  open_bill_id: string
  payment_number: string
  method: 'qris' | 'cash'
  status: CustomerPaymentStatus
  amount: number
  paid_amount: number
  reference_number: string
  void_reason?: string | null
  metadata: CustomerPaymentMetadata | null
  created_at: string
  paid_at?: string | null
}

export interface InitiatePaymentResponse {
  message: string
  data: CustomerPayment
}

export interface CheckPaymentResponse {
  message: string
  data: CustomerPayment
}

export interface CancelPaymentResponse {
  message: string
  data: CustomerPayment
}
