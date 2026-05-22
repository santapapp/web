import type { AddBillOrderPayload, AddBillOrderResponse, BillDetailResponse, PublicBill } from '~/types/bill'
import type { GuestSessionResponse } from '~/types/api'
import type { PaymentDetailResponse, PayOrderResponse, PublicPayment } from '~/types/payment'
import type { PublicMenuResponse } from '~/types/menu'
import type { PublicOrg, PublicOrgResponse } from '~/types/org'
import type {
  CreateTableOrderPayload,
  CreateTableOrderResponse,
  OrderDetailResponse,
  OrderItem,
  PublicOrder
} from '~/types/order'
import type { PublicTable, ValidateTableResponse } from '~/types/table'

class MockApiError extends Error {
  code: string
  statusCode: number

  constructor(code: string, message: string, statusCode = 400) {
    super(message)
    this.name = 'MockApiError'
    this.code = code
    this.statusCode = statusCode
  }
}

const delay = async <T>(value: T, ms = 120) =>
  new Promise<T>((resolve) => {
    setTimeout(() => resolve(value), ms)
  })

const randomToken = (prefix: string) =>
  `${prefix}_${Math.random().toString(36).slice(2, 8).toUpperCase()}`

const orgs: PublicOrg[] = [
  {
    id: 'ORG_001',
    slug: 'kedai-bubub',
    name: 'Kedai Bubub',
    description: 'Kedai sarapan hangat dengan bubur ayam, nasi tim, kopi, dan minuman segar.',
    logo_url: '/favicon.ico',
    cover_image_url: '/favicon.ico',
    status: 'active',
    open_status: 'open',
    timezone: 'Asia/Jakarta',
    address: 'Jl. Melati No. 7, Jakarta Selatan',
    business_hours: [
      { day: 'Senin', open: '07:00', close: '21:00', is_closed: false },
      { day: 'Selasa', open: '07:00', close: '21:00', is_closed: false },
      { day: 'Rabu', open: '07:00', close: '21:00', is_closed: false },
      { day: 'Kamis', open: '07:00', close: '21:00', is_closed: false },
      { day: 'Jumat', open: '07:00', close: '22:00', is_closed: false },
      { day: 'Sabtu', open: '08:00', close: '22:00', is_closed: false },
      { day: 'Minggu', open: '08:00', close: '20:00', is_closed: false }
    ]
  },
  {
    id: 'ORG_002',
    slug: 'warung-tutup',
    name: 'Warung Tutup',
    description: 'Mock restoran tidak aktif untuk menguji state unavailable.',
    logo_url: '/favicon.ico',
    cover_image_url: '/favicon.ico',
    status: 'inactive',
    open_status: 'unavailable',
    timezone: 'Asia/Jakarta',
    address: 'Jl. Mock No. 1',
    business_hours: []
  }
]

const menu: PublicMenuResponse = {
  categories: [
    { id: 'CAT_BUBUR', name: 'Bubur', sort_order: 1 },
    { id: 'CAT_MINUM', name: 'Minuman', sort_order: 2 },
    { id: 'CAT_SNACK', name: 'Snack', sort_order: 3 }
  ],
  items: [
    {
      id: 'MENU_BUBUR_AYAM',
      category_id: 'CAT_BUBUR',
      name: 'Bubur Ayam Santap',
      description: 'Bubur ayam gurih dengan cakwe, kacang, dan kuah kaldu.',
      price: 28000,
      is_available: true
    },
    {
      id: 'MENU_NASI_TIM',
      category_id: 'CAT_BUBUR',
      name: 'Nasi Tim Jamur',
      description: 'Nasi tim lembut dengan ayam cincang dan jamur.',
      price: 34000,
      is_available: true
    },
    {
      id: 'MENU_ES_TEH',
      category_id: 'CAT_MINUM',
      name: 'Es Teh Manis',
      description: 'Teh hitam dingin dengan gula secukupnya.',
      price: 9000,
      is_available: true
    },
    {
      id: 'MENU_KOPI_SUSU',
      category_id: 'CAT_MINUM',
      name: 'Kopi Susu Aren',
      description: 'Kopi susu dengan gula aren.',
      price: 22000,
      is_available: true
    },
    {
      id: 'MENU_PANGSIT',
      category_id: 'CAT_SNACK',
      name: 'Pangsit Goreng',
      description: 'Pangsit renyah isi ayam.',
      price: 18000,
      is_available: false
    }
  ]
}

const tables: PublicTable[] = [
  { token: 'TBL_8KJ2QX', number: '7', label: 'Meja 7', status: 'available' },
  { token: 'TBL_DEMO01', number: '1', label: 'Meja 1', status: 'available' }
]

const orders = new Map<string, PublicOrder>()

const payments = new Map<string, PublicPayment>()

const bills = new Map<string, PublicBill>([
  [
    'BILL_7JA92K',
    {
      token: 'BILL_7JA92K',
      status: 'open',
      table: { label: 'Meja 7' },
      items: [
        {
          menu_id: 'MENU_ES_TEH',
          name: 'Es Teh Manis',
          quantity: 2,
          price: 9000
        }
      ],
      total: 18000
    }
  ],
  [
    'BILL_LOCKED',
    {
      token: 'BILL_LOCKED',
      status: 'locked',
      table: { label: 'Meja 4' },
      items: [],
      total: 0
    }
  ]
])

const findOrg = (orgSlug: string) => {
  const org = orgs.find((item) => item.slug === orgSlug)

  if (!org) {
    throw new MockApiError('invalid_org', 'Restoran tidak ditemukan.', 404)
  }

  return org
}

const buildOrderItems = (items: CreateTableOrderPayload['items']): OrderItem[] => {
  return items.map((item) => {
    const menuItem = menu.items.find((candidate) => candidate.id === item.menu_id)

    if (!menuItem || !menuItem.is_available) {
      throw new MockApiError('validation_error', 'Menu tidak tersedia.', 422)
    }

    return {
      menu_id: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: item.quantity,
      notes: item.notes
    }
  })
}

const totalItems = (items: OrderItem[]) =>
  items.reduce((total, item) => total + item.price * item.quantity, 0)

export const mockSantapApi = {
  async getPublicOrg(orgSlug: string): Promise<PublicOrgResponse> {
    return delay({ org: findOrg(orgSlug) })
  },

  async getPublicMenus(orgSlug: string): Promise<PublicMenuResponse> {
    findOrg(orgSlug)
    return delay(menu)
  },

  async createGuestSession(payload?: { org_slug?: string }): Promise<GuestSessionResponse> {
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString()

    return delay({
      guest_session: {
        id: randomToken('GUEST'),
        token: randomToken('GST'),
        org_slug: payload?.org_slug,
        expires_at: expiresAt
      }
    })
  },

  async validateTable(orgSlug: string, tableToken: string): Promise<ValidateTableResponse> {
    findOrg(orgSlug)

    const table = tables.find((item) => item.token === tableToken)

    if (!table) {
      return delay({
        valid: false,
        message: 'QR meja tidak valid.'
      })
    }

    return delay({
      valid: true,
      table
    })
  },

  async createTableOrder(orgSlug: string, payload: CreateTableOrderPayload): Promise<CreateTableOrderResponse> {
    findOrg(orgSlug)

    const table = tables.find((item) => item.token === payload.table_token)

    if (!table) {
      throw new MockApiError('invalid_table_token', 'QR meja tidak valid.', 404)
    }

    const items = buildOrderItems(payload.items)
    const subtotal = totalItems(items)
    const orderToken = randomToken('ORD')
    const order: PublicOrder = {
      token: orderToken,
      status: 'pending_payment',
      payment_status: 'pending',
      table: { label: table.label },
      items,
      subtotal,
      service_fee: 0,
      tax: 0,
      total: subtotal,
      customer_note: payload.customer_note
    }

    orders.set(orderToken, order)
    payments.set(orderToken, {
      order_token: orderToken,
      status: 'pending',
      amount: subtotal,
      methods: ['qris', 'bank_transfer', 'cashier']
    })

    return delay({
      order: {
        token: order.token,
        status: order.status,
        payment_status: order.payment_status,
        total: order.total
      },
      next_url: `/o/${orgSlug}/payments?order=${orderToken}`
    })
  },

  async getOrderDetail(orgSlug: string, orderToken: string): Promise<OrderDetailResponse> {
    findOrg(orgSlug)

    const order = orders.get(orderToken)

    if (!order) {
      throw new MockApiError('invalid_order_token', 'Order tidak ditemukan.', 404)
    }

    return delay({ order })
  },

  async getPaymentDetail(orgSlug: string, orderToken: string): Promise<PaymentDetailResponse> {
    findOrg(orgSlug)

    const payment = payments.get(orderToken)

    if (!payment) {
      throw new MockApiError('invalid_order_token', 'Payment tidak ditemukan.', 404)
    }

    return delay({ payment })
  },

  async payOrder(orgSlug: string, orderToken: string): Promise<PayOrderResponse> {
    findOrg(orgSlug)

    const order = orders.get(orderToken)
    const payment = payments.get(orderToken)

    if (!order || !payment) {
      throw new MockApiError('invalid_order_token', 'Order tidak ditemukan.', 404)
    }

    order.status = 'paid'
    order.payment_status = 'paid'
    payment.status = 'paid'

    return delay({
      payment,
      next_url: `/o/${orgSlug}/orders?order=${orderToken}`
    })
  },

  async getBillDetail(orgSlug: string, billToken: string): Promise<BillDetailResponse> {
    findOrg(orgSlug)

    const bill = bills.get(billToken)

    if (!bill) {
      throw new MockApiError('invalid_bill_token', 'Open bill tidak ditemukan atau sudah tidak aktif.', 404)
    }

    return delay({ bill })
  },

  async addOrderToBill(
    orgSlug: string,
    billToken: string,
    payload: AddBillOrderPayload
  ): Promise<AddBillOrderResponse> {
    findOrg(orgSlug)

    const bill = bills.get(billToken)

    if (!bill) {
      throw new MockApiError('invalid_bill_token', 'Open bill tidak ditemukan atau sudah tidak aktif.', 404)
    }

    if (bill.status !== 'open') {
      throw new MockApiError('invalid_bill_token', 'Open bill tidak bisa menerima order baru.', 409)
    }

    const items = buildOrderItems(payload.items)
    const orderToken = randomToken('ORD_BILL')
    bill.items.push(...items)
    bill.total = totalItems(bill.items)

    return delay({
      order: {
        token: orderToken,
        status: 'submitted_to_bill',
        bill_token: billToken
      }
    })
  }
}

export const isMockApiError = (error: unknown): error is MockApiError =>
  error instanceof MockApiError
