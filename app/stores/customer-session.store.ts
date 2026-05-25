/**
 * customer-session.store.ts
 * Store untuk Customer Session (Real API)
 *
 * Menyimpan session_token di localStorage dengan key 'customer_session'
 * sesuai dokumentasi API Santap.
 */

import { defineStore } from 'pinia'
import type { CustomerSessionOrg, CustomerSessionTable, CustomerSessionOpenBill } from '~/types/customer-session'

const STORAGE_KEY = 'customer_session'

interface CustomerSessionState {
  sessionToken: string | null
  expiresAt: string | null
  organization: CustomerSessionOrg | null
  table: CustomerSessionTable | null
  openBill: CustomerSessionOpenBill | null
  restored: boolean
}

export const useCustomerSessionStore = defineStore('customer-session', {
  state: (): CustomerSessionState => ({
    sessionToken: null,
    expiresAt: null,
    organization: null,
    table: null,
    openBill: null,
    restored: false
  }),

  getters: {
    hasSession: (state) => Boolean(state.sessionToken),

    isExpired: (state) => {
      if (!state.expiresAt) return true
      return new Date(state.expiresAt).getTime() <= Date.now()
    },

    isValid: (state): boolean => {
      if (!state.sessionToken || !state.expiresAt) return false
      return new Date(state.expiresAt).getTime() > Date.now()
    },

    orgSlug: (state) => state.organization?.slug ?? null,
    tableCode: (state) => state.table?.code ?? null,
    tableName: (state) => state.table?.name ?? null,
    orgName: (state) => state.organization?.name ?? null
  },

  actions: {
    /**
     * Simpan session token ke localStorage dan state.
     * Dipanggil setelah sukses POST /api/v1/customer/sessions/start
     */
    setSession(data: {
      session_token: string
      expires_at: string
      organization: CustomerSessionOrg
      table: CustomerSessionTable
      open_bill: CustomerSessionOpenBill
    }) {
      this.sessionToken = data.session_token
      this.expiresAt = data.expires_at
      this.organization = data.organization
      this.table = data.table
      this.openBill = data.open_bill

      this.persist()
    },

    /**
     * Update data open bill (misal setelah order atau bayar).
     */
    setOpenBill(bill: CustomerSessionOpenBill) {
      this.openBill = bill
      this.persist()
    },

    /**
     * Restore state dari localStorage saat app dimuat.
     */
    restore() {
      if (!import.meta.client || this.restored) return
      this.restored = true

      const token = localStorage.getItem(STORAGE_KEY)
      if (!token) return

      // Coba baca metadata session dari storage terpisah
      const raw = localStorage.getItem(`${STORAGE_KEY}.meta`)
      if (!raw) {
        // Token ada tapi meta tidak — simpan token saja, meta akan diisi saat cek session
        this.sessionToken = token
        return
      }

      try {
        const meta = JSON.parse(raw) as Omit<CustomerSessionState, 'restored'>
        this.sessionToken = meta.sessionToken
        this.expiresAt = meta.expiresAt
        this.organization = meta.organization
        this.table = meta.table
        this.openBill = meta.openBill

        if (this.isExpired) {
          this.clear()
        }
      } catch {
        this.clear()
      }
    },

    persist() {
      if (!import.meta.client) return

      // Simpan token di key utama (sesuai docs: 'customer_session')
      if (this.sessionToken) {
        localStorage.setItem(STORAGE_KEY, this.sessionToken)
      }

      // Simpan metadata session di key terpisah
      localStorage.setItem(
        `${STORAGE_KEY}.meta`,
        JSON.stringify({
          sessionToken: this.sessionToken,
          expiresAt: this.expiresAt,
          organization: this.organization,
          table: this.table,
          openBill: this.openBill
        })
      )
    },

    clear() {
      this.sessionToken = null
      this.expiresAt = null
      this.organization = null
      this.table = null
      this.openBill = null

      if (import.meta.client) {
        localStorage.removeItem(STORAGE_KEY)
        localStorage.removeItem(`${STORAGE_KEY}.meta`)
      }
    }
  }
})
