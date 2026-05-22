import type { PublicTable } from './table'

export type OrderStatus =
  | 'draft'
  | 'pending_payment'
  | 'paid'
  | 'submitted_to_bill'
  | 'in_kitchen'
  | 'ready'
  | 'served'
  | 'cancelled'
  | 'expired'

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'expired'

export interface OrderItemInput {
  menu_id: string
  quantity: number
  notes?: string
}

export interface OrderItem {
  menu_id: string
  name: string
  quantity: number
  price: number
  notes?: string
}

export interface CreateTableOrderPayload {
  table_token: string
  guest_session_id: string
  items: OrderItemInput[]
  customer_note?: string
}

export interface PublicOrder {
  token: string
  status: OrderStatus
  payment_status: PaymentStatus
  table?: Pick<PublicTable, 'label'>
  items: OrderItem[]
  subtotal: number
  service_fee: number
  tax: number
  total: number
  bill_token?: string
  customer_note?: string
}

export interface CreateTableOrderResponse {
  order: Pick<PublicOrder, 'token' | 'status' | 'payment_status' | 'total'>
  next_url: string
}

export interface OrderDetailResponse {
  order: PublicOrder
}

