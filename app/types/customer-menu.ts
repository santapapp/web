// Types untuk Customer Menu API (Real API)
// Endpoint: GET /api/v1/customer/menu

export interface CustomerMenuItem {
  id: number
  name: string
  slug: string
  description: string | null
  price: number
  sku: string | null
  status: 'active' | 'out_of_stock'
  sort_order: number
  image_url: string | null
}

export interface CustomerMenuCategory {
  id: number
  name: string
  description: string | null
  sort_order: number
  menus: CustomerMenuItem[]
}

export interface CustomerMenuResponse {
  data: CustomerMenuCategory[]
}
