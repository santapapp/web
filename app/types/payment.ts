export type PaymentMethod = 'qris' | 'bank_transfer' | 'cashier'

export type PublicPaymentStatus = 'pending' | 'paid' | 'failed' | 'expired'

export interface PublicPayment {
  order_token: string
  status: PublicPaymentStatus
  amount: number
  methods: PaymentMethod[]
}

export interface PaymentDetailResponse {
  payment: PublicPayment
}

export interface PayOrderResponse {
  payment: PublicPayment
  next_url: string
}

