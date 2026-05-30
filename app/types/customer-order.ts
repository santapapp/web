// Types untuk Customer Order & Bill
// Tambah item  → POST /v1/customer/order/items   (header: X-Public-Token)
// Lihat order  → GET  /v1/customer/order          (header: X-Public-Token)

// ─── Add Items ───────────────────────────────────────────────────────────────

export interface CreateOrderItem {
  menu_id: number
  quantity: number
  notes?: string | null   // note per item (bukan root order)
  selected_variants?: Array<{
    variant_group_id: number
    variant_id: number
  }>
}

export interface CreateOrderPayload {
  items: CreateOrderItem[]
  // Global order note tidak didukung backend — gunakan note per item
}

// ─── Order Item (dari OrderItemResource) ─────────────────────────────────────

export type OrderItemStatus =
  | 'pending'
  | 'preparing'
  | 'ready'
  | 'served'
  | 'cancelled'

export interface CustomerOrderItem {
  id: number | string
  parent_item_id: number | string | null
  item_type: 'product' | 'variant' | 'addon'
  menu_id: number
  name: string
  price: number
  quantity: number
  subtotal: number
  item_status: OrderItemStatus | null
  note: string | null
  children: CustomerOrderItem[]
}

// ─── Order Detail (dari OrderDetailResource) ──────────────────────────────────

export type BillStatus = 'open' | 'closed' | 'cancelled'
export type OrderStatus = 'pending' | 'confirmed' | 'cancelled'
export type PaymentStatus = 'unpaid' | 'pending' | 'paid' | 'cancelled'

export interface OrderDiningTable {
  id: number
  name: string
  code: string
  location: string | null
}

/**
 * Representasi penuh data order dari GET /v1/customer/order.
 * Field sesuai OrderDetailResource.
 */
export interface CustomerOrderDetail {
  id: number | string
  order_number: string
  public_token: string
  order_type: string
  bill_status: BillStatus
  order_status: OrderStatus
  payment_status: PaymentStatus
  payment_method: 'qris' | 'cash' | null
  payment_reference: string | null
  // Financial
  subtotal_amount: number
  discount_amount: number
  tax_amount: number
  service_charge_amount: number
  total_amount: number
  payment_amount: number
  change_amount: number
  // Meta
  note: string | null
  opened_at: string | null
  closed_at: string | null
  paid_at: string | null
  // Relations
  dining_table: OrderDiningTable | null
  items: CustomerOrderItem[]
  created_at: string
  // Atomic Checkout additions
  qris_data?: { qr_url?: string; qr_string?: string } | null
  payment_expires_at?: string | null
  server_time?: string | null
}

export interface CustomerOrderDetailResponse {
  data: CustomerOrderDetail
}

export interface AddItemsResponse {
  data: CustomerOrderDetail
  message: string
}
