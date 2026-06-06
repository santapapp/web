/**
 * types/customer-menu.ts
 *
 * Type definitions untuk Customer Menu API.
 * Endpoint: GET /v1/customer/menu?org={orgId}
 *
 * Backend schema: satu table `menus` dengan self-referencing hierarchy:
 *   product (parent_id = null)
 *   └── variant_group (parent_id = product.id)
 *       └── variant (parent_id = variant_group.id)
 *
 * API mengembalikan flat array — frontend normalize ke tree via normalizeMenus().
 */

// ─── Menu Type ────────────────────────────────────────────────────────────────

export type MenuType = 'product' | 'variant_group' | 'variant' | 'addon_group' | 'addon'

// ─── Raw API Shape (flat, sesuai MenuResource) ────────────────────────────────

export interface RawMenu {
  id: number
  organization_id?: number
  parent_id: number | null
  type: MenuType
  name: string
  slug?: string | null
  price: string | number   // backend mengembalikan string dari decimal column
  status?: string | null
  is_available: boolean
  is_required: boolean
  min_select: number
  max_select: number
  sort_order: number
  image: string | null       // field 'image', bukan 'image_url'
  image_url?: string | null
  sku: string | null
  description: string | null
  metadata: Record<string, unknown> | null
  category_id?: number | string | null
  category_name?: string | null
  children?: RawMenu[]       // opsional — API bisa sertakan nested atau tidak
  created_at?: string
  updated_at?: string
}

export interface RawMenuCategory {
  id: number | string
  name: string
  description?: string | null
  sort_order?: number
  menus: Array<Partial<RawMenu> & { id: number; name: string; price?: string | number }>
}

// ─── Normalized Tree Types ────────────────────────────────────────────────────

/**
 * Leaf node — pilihan spesifik dalam satu variant group.
 * Contoh: "Alpukat", "Mangga", "Sirsak" dalam group "Pilihan Rasa".
 */
export interface MenuVariant {
  id: number
  parent_id: number           // id variant_group
  type: 'variant' | 'addon'
  name: string
  price: number               // harga tambahan (bisa 0)
  is_available: boolean
  sort_order: number
  sku: string | null
  description: string | null
}

/**
 * Container group — mengelompokkan beberapa variant.
 * Contoh: "Pilihan Rasa", "Tingkat Manis", "Kekentalan".
 *
 * is_required + min_select/max_select menentukan UI behaviour:
 * - is_required = true  → user wajib memilih minimal min_select variant
 * - max_select = 1      → radio (single select)
 * - max_select > 1      → checkbox (multi select)
 */
export interface MenuVariantGroup {
  id: number
  parent_id: number           // id product
  type: 'variant_group' | 'addon_group'
  name: string
  price: number               // biasanya 0, harga ada di variant
  is_required: boolean
  min_select: number
  max_select: number
  sort_order: number
  variants: MenuVariant[]
}

/**
 * Root product — item menu yang ditampilkan di halaman ordering.
 * parent_id selalu null untuk product.
 *
 * Jika variant_groups kosong → bisa langsung tambah ke cart.
 * Jika ada variant_groups → buka ProductDetailSheet dulu.
 */
export interface MenuProduct {
  id: number
  parent_id: null
  type: 'product'
  name: string
  price: number               // harga dasar product
  is_available: boolean
  is_required: boolean        // selalu false untuk product root
  min_select: number
  max_select: number
  sort_order: number
  image: string | null
  category_id?: number | string | null
  category_name?: string | null
  sku: string | null
  description: string | null
  metadata: Record<string, unknown> | null
  variant_groups: MenuVariantGroup[]
}

// ─── Convenience aliases ──────────────────────────────────────────────────────

/** Alias untuk legacy code yang masih pakai CustomerMenuItem */
export type CustomerMenuItem = MenuProduct

// ─── Legacy types (backward compat) — akan di-cleanup bertahap ───────────────

/** @deprecated Gunakan MenuProduct */
export interface CustomerMenuChild {
  id: number
  type: string
  name: string
  price: number
  is_available: boolean
  is_required: boolean
  min_select: number
  max_select: number
  sort_order: number
  children: CustomerMenuChild[]
}

/** @deprecated Tidak ada category real dari backend */
export type MenuCategory = string

/** @deprecated Tidak ada category real dari backend */
export interface CustomerMenuCategoryGroup {
  id: string
  name: string
  icon?: string
  menus: MenuProduct[]
}
