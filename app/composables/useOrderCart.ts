import { computed, ref, toValue, watch, type MaybeRefOrGetter } from 'vue'
import type { MenuProduct } from '~/types/menu'
import type { CartMode, SelectedVariant } from '~/stores/cart.store'

export const useOrderCart = (mode: MaybeRefOrGetter<CartMode> = 'table_order') => {
  const store = useCartStore()
  const overlay = useUiOverlayStore()

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

  const customerName = computed({
    get: () => store.customerName(currentMode.value),
    set: (val: string) => store.setCustomerName(currentMode.value, val)
  })

  const orderNote = computed({
    get: () => store.orderNote(currentMode.value),
    set: (val: string) => store.setOrderNote(currentMode.value, val)
  })

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
    overlay.open('product')
  }

  const closeProductDetail = () => {
    showProductDetail.value = false
    selectedProduct.value = null
    overlay.close('product')
  }

  watch(
    () => overlay.active,
    (active) => {
      if (active === 'product') return
      if (!showProductDetail.value) return

      showProductDetail.value = false
      selectedProduct.value = null
    }
  )

  const addDirect = (product: MenuProduct) => {
    store.addItem(currentMode.value, {
      menuId: product.id,
      name: product.name,
      base_price: product.price,
      quantity: 1,
      selected_variants: [],
      image: product.image
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
      note: payload.note || undefined,
      image: payload.product.image
    })
  }

  return {
    mode: currentMode,
    items,
    totalQuantity,
    totalPrice,
    orderPayload,
    customerName,
    orderNote,
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
    updateNoteById: (cartItemId: string, note: string) =>
      store.updateNoteById(currentMode.value, cartItemId, note),
    clearCart: () => store.clearCart(currentMode.value)
  }
}
