import { computed, ref } from 'vue'
import type {
  CustomerMenuCategoryGroup,
  MenuProduct,
  MenuVariant,
  MenuVariantGroup,
  RawMenu,
  RawMenuCategory
} from '~/types/customer-menu'
import type { CustomerApiError } from './useCustomerApi'

const toNumber = (value: unknown, fallback = 0) => {
  const numberValue = Number(value)
  return Number.isFinite(numberValue) ? numberValue : fallback
}

const toNullableString = (value: unknown): string | null => {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed || null
}

const sortByOrder = <T extends { sort_order?: number }>(items: T[]) =>
  [...items].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))

const sameId = (left: unknown, right: unknown) =>
  String(left) === String(right)

const isUnavailableStatus = (status: unknown) =>
  ['inactive', 'disabled', 'out_of_stock', 'sold_out', 'unavailable'].includes(
    String(status || '').toLowerCase()
  )

const resolveAvailability = (raw: Partial<RawMenu>) => {
  if (typeof raw.is_available === 'boolean') return raw.is_available
  return !isUnavailableStatus(raw.status)
}

const resolveImage = (raw: Partial<RawMenu>) =>
  toNullableString(raw.image) ?? toNullableString(raw.image_url)

const flattenMenus = (items: RawMenu[]): RawMenu[] => {
  const flat: RawMenu[] = []

  const traverse = (nodes: RawMenu[]) => {
    for (const node of nodes) {
      flat.push(node)
      if (Array.isArray(node.children) && node.children.length > 0) {
        traverse(node.children)
      }
    }
  }

  traverse(items)
  return flat
}

const unwrapMenuPayload = (response: any): any[] => {
  const root = response?.data ?? response

  if (Array.isArray(root)) return root
  if (Array.isArray(root?.menus)) return root.menus
  if (Array.isArray(root?.items)) return root.items
  if (Array.isArray(root?.data)) return root.data

  return []
}

const isCategorizedPayload = (items: any[]): items is RawMenuCategory[] =>
  items.some((item) => Array.isArray(item?.menus))

const resolveCategoryName = (
  raw: Partial<RawMenu>,
  category?: Pick<RawMenuCategory, 'id' | 'name'>
): string => {
  if (category?.name) return category.name
  if (raw.category_name) return raw.category_name

  const metadataCategory = raw.metadata?.category
  if (metadataCategory) {
    const cat = String(metadataCategory).trim().toLowerCase()
    if (cat === 'makanan' || cat === 'makanan utama') return 'Makanan'
    if (cat === 'minuman') return 'Minuman'
    return cat.charAt(0).toUpperCase() + cat.slice(1)
  }

  return 'Makanan'
}

const resolveCategoryId = (
  raw: Partial<RawMenu>,
  categoryName: string,
  category?: Pick<RawMenuCategory, 'id' | 'name'>
): string | number => {
  if (category?.id !== undefined) return category.id
  if (raw.category_id !== undefined && raw.category_id !== null) return raw.category_id
  return categoryName.toLowerCase()
}

const buildProduct = (
  raw: Partial<RawMenu> & { id: number; name: string },
  category?: Pick<RawMenuCategory, 'id' | 'name'>
): MenuProduct => {
  const categoryName = resolveCategoryName(raw, category)
  const categoryId = resolveCategoryId(raw, categoryName, category)

  return {
    id: toNumber(raw.id),
    parent_id: null,
    type: 'product',
    name: String(raw.name),
    price: toNumber(raw.price),
    is_available: resolveAvailability(raw),
    is_required: false,
    min_select: 0,
    max_select: 1,
    sort_order: toNumber(raw.sort_order),
    image: resolveImage(raw),
    category_id: categoryId,
    category_name: categoryName,
    sku: toNullableString(raw.sku),
    description: toNullableString(raw.description),
    metadata: raw.metadata ?? null,
    variant_groups: []
  }
}

const normalizeCategorizedMenus = (categories: RawMenuCategory[]): MenuProduct[] =>
  sortByOrder(categories)
    .flatMap((category) =>
      sortByOrder(category.menus)
        .filter((menu): menu is Partial<RawMenu> & { id: number; name: string } =>
          menu.id !== undefined && Boolean(menu.name)
        )
        .map((menu) => buildProduct(menu, category))
    )

export function normalizeMenus(rawMenus: RawMenu[]): MenuProduct[] {
  const flat = rawMenus.some((item) => Array.isArray(item.children) && item.children.length > 0)
    ? flattenMenus(rawMenus)
    : rawMenus

  const products = sortByOrder(
    flat.filter((item) =>
      (item.type === 'product' || !item.type) &&
      (item.parent_id === null || item.parent_id === undefined)
    )
  )

  const variantGroups = sortByOrder(
    flat.filter((item) => item.type === 'variant_group' || item.type === 'addon_group')
  )

  const variants = sortByOrder(
    flat.filter((item) => item.type === 'variant' || item.type === 'addon')
  )

  return products.map((product): MenuProduct => {
    const productGroups: MenuVariantGroup[] = variantGroups
      .filter((group) => sameId(group.parent_id, product.id))
      .map((group): MenuVariantGroup => ({
        id: toNumber(group.id),
        parent_id: toNumber(group.parent_id),
        type: group.type as 'variant_group' | 'addon_group',
        name: group.name,
        price: toNumber(group.price),
        is_required: Boolean(group.is_required),
        min_select: toNumber(group.min_select),
        max_select: Math.max(1, toNumber(group.max_select, 1)),
        sort_order: toNumber(group.sort_order),
        variants: variants
          .filter((variant) => sameId(variant.parent_id, group.id))
          .map((variant): MenuVariant => ({
            id: toNumber(variant.id),
            parent_id: toNumber(variant.parent_id),
            type: variant.type as 'variant' | 'addon',
            name: variant.name,
            price: toNumber(variant.price),
            is_available: resolveAvailability(variant),
            sort_order: toNumber(variant.sort_order),
            sku: toNullableString(variant.sku),
            description: toNullableString(variant.description)
          }))
      }))

    return {
      ...buildProduct(product),
      variant_groups: productGroups
    }
  })
}

export const useCustomerMenu = () => {
  const api = useCustomerApi()

  const products = ref<MenuProduct[]>([])
  const searchQuery = ref('')
  const activeCategory = ref('all')
  const pending = ref(false)
  const error = ref<CustomerApiError | null>(null)

  const categories = computed<CustomerMenuCategoryGroup[]>(() => {
    const grouped = new Map<string, CustomerMenuCategoryGroup>()

    for (const product of products.value) {
      if (!product.category_id && !product.category_name) continue

      const id = String(product.category_id ?? product.category_name)
      const existing = grouped.get(id)
      if (existing) {
        existing.menus.push(product)
      } else {
        grouped.set(id, {
          id,
          name: product.category_name ?? 'Kategori',
          menus: [product]
        })
      }
    }

    return [
      { id: 'all', name: 'Semua', menus: products.value },
      ...Array.from(grouped.values())
    ]
  })

  const filteredProducts = computed<MenuProduct[]>(() => {
    const q = searchQuery.value.trim().toLowerCase()
    const scopedProducts = activeCategory.value === 'all'
      ? products.value
      : products.value.filter((product) =>
          String(product.category_id ?? product.category_name) === activeCategory.value
        )

    if (!q) return scopedProducts

    return scopedProducts.filter((product) =>
      product.name.toLowerCase().includes(q) ||
      (product.description?.toLowerCase().includes(q) ?? false) ||
      (product.category_name?.toLowerCase().includes(q) ?? false)
    )
  })

  const totalCount = computed(() => products.value.length)

  const processMenuResponse = (response: any) => {
    const payload = unwrapMenuPayload(response)
    products.value = isCategorizedPayload(payload)
      ? normalizeCategorizedMenus(payload)
      : normalizeMenus(payload as RawMenu[])

    if (!categories.value.some((category) => category.id === activeCategory.value)) {
      activeCategory.value = 'all'
    }
  }

  const fetchMenu = async () => {
    pending.value = true
    error.value = null

    try {
      const sessionStore = useCustomerSessionStore()
      const response = await api.getMenu(sessionStore.organization?.id, true)
      processMenuResponse(response)
      return { success: true, count: products.value.length }
    } catch (err) {
      error.value = err as CustomerApiError
      products.value = []
      return { success: false, error: err as CustomerApiError }
    } finally {
      pending.value = false
    }
  }

  const fetchMenuByOrgId = async (orgId: number | string) => {
    pending.value = true
    error.value = null

    try {
      const response = await api.getMenu(orgId, false)
      processMenuResponse(response)
      return { success: true, count: products.value.length }
    } catch (err) {
      error.value = err as CustomerApiError
      products.value = []
      return { success: false, error: err as CustomerApiError }
    } finally {
      pending.value = false
    }
  }

  const fetchMenuByOrgSlug = async (orgSlug: string) => {
    const normalizedSlug = orgSlug.trim()
    if (!normalizedSlug) {
      products.value = []
      return { success: false, error: { message: 'Slug outlet tidak valid.', statusCode: 400 } }
    }

    pending.value = true
    error.value = null

    try {
      const response = await api.getMenuByOrgSlug(normalizedSlug)
      processMenuResponse(response)
      return { success: true, count: products.value.length }
    } catch (err) {
      error.value = err as CustomerApiError
      products.value = []
      return { success: false, error: err as CustomerApiError }
    } finally {
      pending.value = false
    }
  }

  const findProductById = (id: number): MenuProduct | undefined =>
    products.value.find((product) => product.id === id)

  const setCategory = (categoryId: string) => {
    activeCategory.value = categories.value.some((category) => category.id === categoryId)
      ? categoryId
      : 'all'
  }

  return {
    products,
    filteredProducts,
    searchQuery,
    totalCount,
    pending,
    error,
    fetchMenu,
    fetchMenuByOrgId,
    fetchMenuByOrgSlug,
    findProductById,
    filteredMenus: filteredProducts,
    categories,
    activeCategory,
    setCategory
  }
}
