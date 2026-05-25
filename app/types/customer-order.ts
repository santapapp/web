// Types untuk Customer Order & Bill API (Real API)
// Endpoint: POST /api/v1/customer/orders
// Endpoint: GET /api/v1/customer/open-bill

export type CustomerOrderStatus = 'pending' | 'cooking' | 'ready' | 'served' | 'cancelled'

// Request
export interface CreateOrderItem {
  menu_id: number
  quantity: number
  notes?: string | null
}

export interface CreateOrderPayload {
  items: CreateOrderItem[]
  note?: string
}

// Response item dalam order
export interface CustomerOrderItem {
  id: string
  menu_id: number
  menu_name_snapshot: string
  menu_price_snapshot: number
  quantity: number
  note: string | null
  status: CustomerOrderStatus
  subtotal_amount: number
}

// Response order setelah create
export interface CustomerOrder {
  id: string
  organization_id: number
  open_bill_id: string
  dining_table_id: number
  order_number: string
  source: string
  status: CustomerOrderStatus
  note: string | null
  subtotal_amount: number
  total_amount: number
  created_at: string
  items: CustomerOrderItem[]
}

export interface CreateOrderResponse {
  message: string
  data: CustomerOrder
}

// Open Bill
export type BillStatus = 'open' | 'locked' | 'payment_requested' | 'closed'

export type PaymentStatus = 'pending' | 'paid' | 'failed'

export interface BillPayment {
  id: string
  payment_number: string
  method: 'qris' | 'cash'
  status: PaymentStatus
  amount: number
  paid_at: string | null
  qr_string: string | null
  expiry_time: string | null
}

export interface OpenBillTable {
  id: number
  name: string
  code: string
}

export interface OpenBill {
  id: string
  bill_number: string
  status: BillStatus
  subtotal_amount: number
  discount_amount: number
  service_amount: number
  tax_amount: number
  total_amount: number
  opened_at: string
  table: OpenBillTable
  payments: BillPayment[]
}

export interface OpenBillResponse {
  data: OpenBill
}

// Call Cashier
export interface CallCashierResponse {
  message: string
}
