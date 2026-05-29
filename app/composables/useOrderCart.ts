import { computed, ref, toValue, type MaybeRefOrGetter } from 'vue'
import type { MenuProduct } from '~/types/menu'
import type { CartMode, SelectedVariant } from '~/stores/cart.store'

export const useOrderCart = (mode: MaybeRefOrGetter<CartMode> = 'table_order') => {
  const store = useCartStore()

  if (import.meta.client) {
    store.restore()
  }

  const currentMode = computed(() => toValue(mode))
  const selectedProduct = ref<MenuProduct | null>(null)
  const showProductDetail = ref(false)

  const items = computed(() => store.items(currentMode.value))
  const totalQuantity = computed(() => store.totalQuantity(currentMode.value))
  const totalPrice = computed(() => store.totalPrice(currentMode.value))
  const orderPayload = computed(() => store.orderPayload(currentMode.value))

  const cartQtyMap = computed<Record<number, number>>(() => {
    const map: Record<number, number> = {}
    for (const item of items.value) {
      map[item.menuId] = (map[item.menuId] ?? 0) + item.quantity
    }
    return map
  })

  const openProductDetail = (product: MenuProduct) => {
    selectedProduct.value = product
    showProductDetail.value = true
  }

  const closeProductDetail = () => {
    showProductDetail.value = false
  }

  const addDirect = (product: MenuProduct) => {
    store.addItem(currentMode.value, {
      menuId: product.id,
      name: product.name,
      base_price: product.price,
      quantity: 1,
      selected_variants: []
    })
  }

  const addFromDetail = (payload: {
    product: MenuProduct
    quantity: number
    note: string
    selected_variants: SelectedVariant[]
  }) => {
    store.addItem(currentMode.value, {
      menuId: payload.product.id,
      name: payload.product.name,
      base_price: payload.product.price,
      quantity: payload.quantity,
      selected_variants: payload.selected_variants,
      note: payload.note || undefined
    })
  }

  return {
    mode: currentMode,
    items,
    totalQuantity,
    totalPrice,
    orderPayload,
    cartQtyMap,
    selectedProduct,
    showProductDetail,
    openProductDetail,
    closeProductDetail,
    addDirect,
    addFromDetail,
    updateQuantityById: (cartItemId: string, quantity: number) =>
      store.updateQuantityById(currentMode.value, cartItemId, quantity),
    removeById: (cartItemId: string) =>
      store.removeById(currentMode.value, cartItemId),
    clearCart: () => store.clearCart(currentMode.value)
  }
}
