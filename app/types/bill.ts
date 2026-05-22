import type { OrderItem, OrderItemInput } from './order'

export type BillStatus = 'open' | 'locked' | 'payment_requested' | 'closed' | 'expired'

export interface PublicBill {
  token: string
  status: BillStatus
  table: {
    label: string
  }
  items: OrderItem[]
  total: number
}

export interface BillDetailResponse {
  bill: PublicBill
}

export interface AddBillOrderPayload {
  guest_session_id: string
  items: OrderItemInput[]
  customer_note?: string
}

export interface AddBillOrderResponse {
  order: {
    token: string
    status: 'submitted_to_bill'
    bill_token: string
  }
}

