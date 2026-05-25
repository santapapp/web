import { computed } from 'vue'
import type { CartItem, CartMode } from '~/stores/cart.store'

export const useCart = (mode: CartMode = 'table_order') => {
  const store = useCartStore()

  if (import.meta.client) {
    store.restore()
  }

  return {
    mode,
    items: computed(() => store.items(mode)),
    customerNote: computed(() => store.customerNote(mode)),
    totalQuantity: computed(() => store.totalQuantity(mode)),
    totalPrice: computed(() => store.totalPrice(mode)),
    addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => store.addItem(mode, item),
    updateQuantity: (menuId: number, quantity: number) => store.updateQuantity(mode, menuId, quantity),
    removeItem: (menuId: number) => store.removeItem(mode, menuId),
    setCustomerNote: (note: string) => store.setCustomerNote(mode, note),
    clearCart: () => store.clearCart(mode)
  }
}
