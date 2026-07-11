import { computed, watch } from 'vue'
import type { CartItem, CartMode, SelectedVariant, OrderItemPayload } from '~/stores/cart.store'

export const useCart = (mode: CartMode = 'table_order') => {
  const store = useCartStore()

  if (import.meta.client) {
    store.restore()

    // Re-restore cart saat berpindah outlet tanpa full page reload (SPA navigation)
    const route = useRoute()
    watch(() => route.params.orgSlug, () => {
      store.restore(true) // force=true
    })
  }

  return {
    mode,
    items: computed(() => store.items(mode)),
    totalQuantity: computed(() => store.totalQuantity(mode)),
    totalPrice: computed(() => store.totalPrice(mode)),
    orderPayload: computed<OrderItemPayload[]>(() => store.orderPayload(mode)),

    /** Tambah item ke cart (dengan selected_variants) */
    addItem: (params: {
      menuId: number
      name: string
      base_price: number
      quantity?: number
      selected_variants?: SelectedVariant[]
      note?: string
    }) => store.addItem(mode, params),

    /** Update quantity berdasarkan cart item id */
    updateQuantityById: (cartItemId: string, quantity: number) =>
      store.updateQuantityById(mode, cartItemId, quantity),

    /** Remove berdasarkan cart item id */
    removeById: (cartItemId: string) =>
      store.removeById(mode, cartItemId),

    /** @deprecated Gunakan updateQuantityById */
    updateQuantity: (menuId: number, quantity: number) =>
      store.updateQuantity(mode, menuId, quantity),

    /** @deprecated Gunakan removeById */
    removeItem: (menuId: number) =>
      store.removeItem(mode, menuId),

    clearCart: () => store.clearCart(mode)
  }
}
