import { defineStore } from 'pinia'

export type CartMode = 'table_order' | 'open_bill'

export interface CartItem {
  menuId: number
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
  restored: boolean
}

const STORAGE_KEY = 'santap_cart'

const createBucket = (): CartBucket => ({
  items: [],
  customerNote: ''
})

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    carts: {
      table_order: createBucket(),
      open_bill: createBucket()
    },
    restored: false
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
      } else {
        this.carts[mode].items.push({
          ...item,
          quantity: item.quantity ?? 1
        })
      }
      this.persist()
    },

    updateQuantity(mode: CartMode, menuId: number, quantity: number) {
      const item = this.carts[mode].items.find((candidate) => candidate.menuId === menuId)

      if (!item) return

      if (quantity <= 0) {
        this.removeItem(mode, menuId)
        return
      }

      item.quantity = quantity
      this.persist()
    },

    removeItem(mode: CartMode, menuId: number) {
      this.carts[mode].items = this.carts[mode].items.filter((item) => item.menuId !== menuId)
      this.persist()
    },

    setCustomerNote(mode: CartMode, note: string) {
      this.carts[mode].customerNote = note
      this.persist()
    },

    clearCart(mode: CartMode) {
      this.carts[mode] = createBucket()
      this.persist()
    },

    persist() {
      if (!import.meta.client) return
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.carts))
    },

    restore() {
      if (!import.meta.client || this.restored) return
      this.restored = true

      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return

      try {
        const parsed = JSON.parse(raw)
        if (parsed && typeof parsed === 'object') {
          // Restore items safely
          if (parsed.table_order) this.carts.table_order = parsed.table_order
          if (parsed.open_bill) this.carts.open_bill = parsed.open_bill
        }
      } catch {
        // Clear on corrupt data
        this.carts = {
          table_order: createBucket(),
          open_bill: createBucket()
        }
      }
    }
  }
})
