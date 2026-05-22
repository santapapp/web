import { defineStore } from 'pinia'
import type { PublicOrder } from '~/types/order'

interface OrderState {
  currentOrderToken: string | null
  ordersByToken: Record<string, PublicOrder>
}

export const useOrderStore = defineStore('order', {
  state: (): OrderState => ({
    currentOrderToken: null,
    ordersByToken: {}
  }),

  getters: {
    currentOrder: (state) =>
      state.currentOrderToken ? state.ordersByToken[state.currentOrderToken] ?? null : null
  },

  actions: {
    setOrder(order: PublicOrder) {
      this.ordersByToken[order.token] = order
      this.currentOrderToken = order.token
    },

    clearCurrentOrder() {
      this.currentOrderToken = null
    }
  }
})

