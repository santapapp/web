import { defineStore } from 'pinia'

export type CartMode = 'table_order' | 'open_bill'

export interface CartItem {
  menuId: string
  name: string
  price: number
  quantity: number
  notes?: string
}

interface CartBucket {
  items: CartItem[]
  customerNote: string
}

interface CartState {
  carts: Record<CartMode, CartBucket>
}

const createBucket = (): CartBucket => ({
  items: [],
  customerNote: ''
})

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    carts: {
      table_order: createBucket(),
      open_bill: createBucket()
    }
  }),

  getters: {
    items: (state) => (mode: CartMode) => state.carts[mode].items,
    customerNote: (state) => (mode: CartMode) => state.carts[mode].customerNote,
    totalQuantity: (state) => (mode: CartMode) =>
      state.carts[mode].items.reduce((total, item) => total + item.quantity, 0),
    totalPrice: (state) => (mode: CartMode) =>
      state.carts[mode].items.reduce((total, item) => total + item.price * item.quantity, 0)
  },

  actions: {
    addItem(mode: CartMode, item: Omit<CartItem, 'quantity'> & { quantity?: number }) {
      const existingItem = this.carts[mode].items.find(
        (candidate) => candidate.menuId === item.menuId && candidate.notes === item.notes
      )

      if (existingItem) {
        existingItem.quantity += item.quantity ?? 1
        return
      }

      this.carts[mode].items.push({
        ...item,
        quantity: item.quantity ?? 1
      })
    },

    updateQuantity(mode: CartMode, menuId: string, quantity: number) {
      const item = this.carts[mode].items.find((candidate) => candidate.menuId === menuId)

      if (!item) return

      if (quantity <= 0) {
        this.removeItem(mode, menuId)
        return
      }

      item.quantity = quantity
    },

    removeItem(mode: CartMode, menuId: string) {
      this.carts[mode].items = this.carts[mode].items.filter((item) => item.menuId !== menuId)
    },

    setCustomerNote(mode: CartMode, note: string) {
      this.carts[mode].customerNote = note
    },

    clearCart(mode: CartMode) {
      this.carts[mode] = createBucket()
    }
  }
})

