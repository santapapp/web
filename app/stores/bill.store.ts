import { defineStore } from 'pinia'
import type { PublicBill } from '~/types/bill'

interface BillState {
  currentBillToken: string | null
  billsByToken: Record<string, PublicBill>
}

export const useBillStore = defineStore('bill', {
  state: (): BillState => ({
    currentBillToken: null,
    billsByToken: {}
  }),

  getters: {
    currentBill: (state) =>
      state.currentBillToken ? state.billsByToken[state.currentBillToken] ?? null : null
  },

  actions: {
    setBill(bill: PublicBill) {
      this.billsByToken[bill.token] = bill
      this.currentBillToken = bill.token
    },

    clearCurrentBill() {
      this.currentBillToken = null
    }
  }
})

