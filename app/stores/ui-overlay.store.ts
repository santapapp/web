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

export type OverlayKey = 'none' | 'session' | 'orders' | 'cart' | 'product' | 'scanner'

interface UiOverlayState {
  active: OverlayKey
}

export const useUiOverlayStore = defineStore('ui-overlay', {
  state: (): UiOverlayState => ({
    active: 'none'
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
