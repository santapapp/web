import { defineStore } from 'pinia'
import type { GuestSession } from '~/types/api'

const STORAGE_KEY = 'santap.guest-session.v1'

interface GuestSessionState {
  id: string | null
  token: string | null
  orgSlug: string | null
  tableToken: string | null
  billToken: string | null
  expiresAt: string | null
  restored: boolean
}

export const useGuestSessionStore = defineStore('guest-session', {
  state: (): GuestSessionState => ({
    id: null,
    token: null,
    orgSlug: null,
    tableToken: null,
    billToken: null,
    expiresAt: null,
    restored: false
  }),

  getters: {
    isExpired: (state) => {
      if (!state.expiresAt) return true
      return new Date(state.expiresAt).getTime() <= Date.now()
    },
    hasSession: (state) => Boolean(state.id && state.token)
  },

  actions: {
    restore() {
      if (!import.meta.client || this.restored) return

      const rawSession = localStorage.getItem(STORAGE_KEY)
      this.restored = true

      if (!rawSession) return

      try {
        const parsed = JSON.parse(rawSession) as GuestSessionState
        this.id = parsed.id
        this.token = parsed.token
        this.orgSlug = parsed.orgSlug
        this.tableToken = parsed.tableToken
        this.billToken = parsed.billToken
        this.expiresAt = parsed.expiresAt

        if (this.isExpired) {
          this.clear()
        }
      } catch {
        this.clear()
      }
    },

    persist() {
      if (!import.meta.client) return

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          id: this.id,
          token: this.token,
          orgSlug: this.orgSlug,
          tableToken: this.tableToken,
          billToken: this.billToken,
          expiresAt: this.expiresAt,
          restored: this.restored
        })
      )
    },

    setSession(session: GuestSession) {
      this.id = session.id
      this.token = session.token
      this.orgSlug = session.org_slug ?? this.orgSlug
      this.expiresAt = session.expires_at
      this.persist()
    },

    bindContext(payload: { orgSlug?: string; tableToken?: string | null; billToken?: string | null }) {
      this.orgSlug = payload.orgSlug ?? this.orgSlug
      this.tableToken = payload.tableToken ?? null
      this.billToken = payload.billToken ?? null
      this.persist()
    },

    clear() {
      this.id = null
      this.token = null
      this.orgSlug = null
      this.tableToken = null
      this.billToken = null
      this.expiresAt = null

      if (import.meta.client) {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }
})

