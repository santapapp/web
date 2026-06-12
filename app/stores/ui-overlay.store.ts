/**
 * ui-overlay.store.ts — Koordinasi overlay halaman order customer.
 *
 * Single source of truth: hanya SATU overlay besar boleh aktif pada satu waktu
 * (session / orders / cart / product / scanner). Membuka satu overlay otomatis
 * menutup yang lain → mutual exclusivity gratis, lintas batas layout & page.
 *
 * Catatan:
 * - ExitConfirm BUKAN bagian enum ini — ia modal turunan SessionDrawer dan boleh
 *   stack di atas slideover (pakai boolean lokal di komponen).
 * - Scroll-lock & z-index tidak diatur di sini — ditangani Nuxt UI
 *   (USlideover/UModal/UDrawer dengan modal:true) lewat reka-ui.
 * - SSR-safe: state awal 'none', tidak menyentuh window/localStorage.
 */

import { defineStore } from 'pinia'
import { nextTick } from 'vue'

export type OverlayKey = 'none' | 'session' | 'orders' | 'cart' | 'product' | 'scanner'

interface UiOverlayState {
  active: OverlayKey
  isSwitching: boolean
  openBillHeaderPassed: boolean
}

// Helper to wait for a browser animation frame to complete DOM rendering
const waitFrame = () =>
  new Promise<void>((resolve) => {
    if (import.meta.client) {
      requestAnimationFrame(() => resolve())
    } else {
      resolve()
    }
  })

export const useUiOverlayStore = defineStore('ui-overlay', {
  state: (): UiOverlayState => ({
    active: 'none',
    isSwitching: false,
    openBillHeaderPassed: false
  }),

  getters: {
    isSession: (state) => state.active === 'session',
    isOrders: (state) => state.active === 'orders',
    isCart: (state) => state.active === 'cart',
    isProduct: (state) => state.active === 'product',
    isScanner: (state) => state.active === 'scanner',
    anyOpen: (state) => state.active !== 'none'
  },

  actions: {
    /** Buka overlay tertentu — otomatis menutup overlay lain yang sedang aktif. */
    open(key: Exclude<OverlayKey, 'none'>) {
      this.active = key
    },

    /**
     * Buka overlay secara aman dengan transisi tertunda untuk menghindari
     * race condition / error insertBefore saat unmount & mount teleport secara simultan.
     */
    async openSafely(key: Exclude<OverlayKey, 'none'>) {
      if (this.isSwitching) return
      if (this.active === key) return

      if (this.active === 'none') {
        this.active = key
        return
      }

      this.isSwitching = true
      this.active = 'none'

      await nextTick()
      await waitFrame()

      this.active = key
      this.isSwitching = false
    },

    /**
     * Tutup overlay. Bila `key` diberikan, hanya menutup jika overlay itu yang
     * sedang aktif (mencegah race menutup overlay yang baru saja dibuka).
     */
    close(key?: Exclude<OverlayKey, 'none'>) {
      if (!key || this.active === key) {
        this.active = 'none'
      }
    },

    closeAll() {
      this.active = 'none'
    }
  }
})
