export interface MenuCategory {
  id: string
  name: string
  sort_order: number
}

export interface MenuItem {
  id: string
  category_id: string
  name: string
  description: string
  price: number
  image_url?: string
  is_available: boolean
}

export interface PublicMenuResponse {
  categories: MenuCategory[]
  items: MenuItem[]
}

