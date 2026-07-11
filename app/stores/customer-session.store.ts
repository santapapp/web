/**
 * customer-session.store.ts
 * Store untuk Customer Session (Real API)
 *
 * Menyimpan session_token di localStorage dengan key 'customer_session'
 * sesuai dokumentasi API Santap.
 */

import { defineStore } from 'pinia'
import type { CustomerSessionOrg, CustomerSessionTable, StoredSessionOpenBill, CustomerSessionType } from '~/types/customer-session'

const STORAGE_KEY = 'customer_session'

const getActiveOrgSlug = (): string => {
  try {
    const route = useRoute()
    return String(route.params.orgSlug || '').trim().toLowerCase()
  } catch {
    return ''
  }
}

interface CustomerSessionState {
  sessionToken: string | null
  expiresAt: string | null
  organization: CustomerSessionOrg | null
  table: CustomerSessionTable | null
  openBill: StoredSessionOpenBill | null
  /**
   * Tipe session aktif — ditentukan HANYA dari response backend.
   * 'table_order' : scan QR meja / input manual kode meja
   * 'open_bill'   : scan QR open bill dari kasir
   * null          : tidak ada session aktif
   */
  sessionType: CustomerSessionType | null
  restored: boolean
  lastRestoredSlug: string | null
}

export const useCustomerSessionStore = defineStore('customer-session', {
  state: (): CustomerSessionState => ({
    sessionToken: null,
    expiresAt: null,
    organization: null,
    table: null,
    openBill: null,
    sessionType: null,
    restored: false,
    lastRestoredSlug: null
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
     * Simpan session ke localStorage dan state.
     * Dipanggil setelah sukses scan QR meja atau QR open bill.
     *
     * session_type WAJIB diisi dari response backend:
     * - 'table_order' : scan QR meja / input manual
     * - 'open_bill'   : scan QR open bill dari kasir
     *
     * open_bill boleh null (untuk table order biasa).
     */
    setSession(data: {
      session_token: string
      expires_at: string
      organization: CustomerSessionOrg
      table: CustomerSessionTable
      session_type: CustomerSessionType
      open_bill: StoredSessionOpenBill | null
    }) {
      this.sessionToken = data.session_token
      this.expiresAt = data.expires_at
      this.organization = data.organization
      this.table = data.table
      this.sessionType = data.session_type
      this.openBill = data.open_bill  // null untuk table order

      this.persist()
    },

    /**
     * Update data open bill (misal setelah order atau bayar).
     */
    setOpenBill(bill: StoredSessionOpenBill) {
      this.openBill = bill
      this.persist()
    },

    /**
     * Restore state dari localStorage saat app dimuat.
     *
     * PENTING: hanya OPEN BILL yang dipersist & boleh di-restore dari localStorage.
     * Table order BUKAN session — datanya hanya hidup di memory selama proses pesan,
     * jadi tidak pernah dipulihkan dari localStorage. Data table order lama (mis. dari
     * versi sebelumnya) akan ikut dibersihkan di sini.
     */
    restore(orgSlugParam?: string) {
      if (!import.meta.client) return
      
      const orgSlug = (orgSlugParam || getActiveOrgSlug()).trim().toLowerCase()
      if (this.restored && this.lastRestoredSlug === orgSlug) return
      
      this.restored = true
      this.lastRestoredSlug = orgSlug

      const storageKey = orgSlug ? `customer_session_${orgSlug}` : STORAGE_KEY
      let raw = localStorage.getItem(`${storageKey}.meta`)

      // Migrasi: jika key namespace kosong tapi ada data di key legacy global, migrasikan.
      if (!raw && orgSlug) {
        const legacyRaw = localStorage.getItem(`${STORAGE_KEY}.meta`)
        if (legacyRaw) {
          try {
            const legacyMeta = JSON.parse(legacyRaw)
            // Hanya migrasikan jika org cocok atau tidak ada org di data lama
            const legacySlug = legacyMeta.organization?.slug?.trim()?.toLowerCase() || ''
            if (!legacySlug || legacySlug === orgSlug) {
              localStorage.setItem(`${storageKey}.meta`, legacyRaw)
              const legacyToken = localStorage.getItem(STORAGE_KEY)
              if (legacyToken) localStorage.setItem(storageKey, legacyToken)
              // Bersihkan legacy key setelah migrasi berhasil
              localStorage.removeItem(STORAGE_KEY)
              localStorage.removeItem(`${STORAGE_KEY}.meta`)
              raw = legacyRaw
            }
          } catch {
            // Legacy data rusak — abaikan
          }
        }
      }

      if (!raw) {
        // Tidak ada metadata sesi — bersihkan token lepas (mis. sisa table order lama).
        localStorage.removeItem(storageKey)
        this._clearState()
        return
      }

      try {
        const meta = JSON.parse(raw) as Omit<CustomerSessionState, 'restored' | 'lastRestoredSlug'>

        // Hanya open bill yang merupakan session valid yang boleh dipulihkan.
        if (meta.sessionType !== 'open_bill') {
          this.clear()
          return
        }

        this.sessionToken = meta.sessionToken
        this.expiresAt = meta.expiresAt
        this.organization = meta.organization
        this.table = meta.table
        this.openBill = meta.openBill
        this.sessionType = meta.sessionType

        if (this.isExpired) {
          this.clear()
        }
      } catch {
        this.clear()
      }
    },

    /**
     * Persist session ke localStorage.
     * @param orgSlugOverride — gunakan saat organization belum di-set di state
     *   (misal: awal startSessionForOpenBill saat token baru di-inject).
     */
    persist(orgSlugOverride?: string) {
      if (!import.meta.client) return

      const orgSlug = (orgSlugOverride || this.organization?.slug || getActiveOrgSlug()).trim().toLowerCase()
      const storageKey = orgSlug ? `customer_session_${orgSlug}` : STORAGE_KEY

      // Hanya OPEN BILL yang dipersist ke localStorage.
      // Table order bersifat sementara (in-memory) dan TIDAK boleh menjadi session
      // permanen — jadi setiap kali state bukan open_bill, bersihkan localStorage.
      if (this.sessionType !== 'open_bill') {
        localStorage.removeItem(storageKey)
        localStorage.removeItem(`${storageKey}.meta`)
        return
      }

      // Simpan token di key utama
      if (this.sessionToken) {
        localStorage.setItem(storageKey, this.sessionToken)
      }

      // Simpan metadata session di key terpisah
      localStorage.setItem(
        `${storageKey}.meta`,
        JSON.stringify({
          sessionToken: this.sessionToken,
          expiresAt: this.expiresAt,
          organization: this.organization,
          table: this.table,
          openBill: this.openBill,
          sessionType: this.sessionType
        })
      )
    },

    clear() {
      const orgSlug = (this.organization?.slug || getActiveOrgSlug()).trim().toLowerCase()

      this.sessionToken = null
      this.expiresAt = null
      this.organization = null
      this.table = null
      this.openBill = null
      this.sessionType = null
      // Reset restore flags agar re-restore dimungkinkan setelah clear
      this.restored = false
      this.lastRestoredSlug = null

      if (import.meta.client) {
        const storageKey = orgSlug ? `customer_session_${orgSlug}` : STORAGE_KEY
        localStorage.removeItem(storageKey)
        localStorage.removeItem(`${storageKey}.meta`)

        // Bersihkan juga legacy global key
        localStorage.removeItem(STORAGE_KEY)
        localStorage.removeItem(`${STORAGE_KEY}.meta`)
      }
    },

    /**
     * Helper internal: bersihkan state tanpa menghapus localStorage.
     * Digunakan oleh restore() saat tidak ada data untuk di-restore.
     */
    _clearState() {
      this.sessionToken = null
      this.expiresAt = null
      this.organization = null
      this.table = null
      this.openBill = null
      this.sessionType = null
    }
  }
})
