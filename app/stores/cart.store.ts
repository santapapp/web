/**
 * cart.store.ts — Pinia store untuk cart customer
 *
 * Cart key rules:
 * - product_id + sorted variant_ids + note = unique cart item
 * - Product sama + variants sama + note sama → merge quantity
 * - Product sama + variants beda → cart item baru
 * - Product sama + note beda → cart item baru
 */

import { defineStore } from 'pinia'

export type CartMode = 'table_order' | 'open_bill'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SelectedVariant {
  variant_group_id: number
  variant_group_name: string
  variant_id: number
  variant_name: string
  price: number
}

export interface CartItem {
  /** Stable unique identifier for UI and list rendering */
  id: string
  /** Deterministic key used for merge check (product + variants + note) */
  cartKey: string
  menuId: number
  name: string
  /** Harga dasar product (tanpa variant) */
  base_price: number
  quantity: number
  selected_variants: SelectedVariant[]
  note?: string
  image?: string | null
  /** Preview subtotal = (base_price + sum(variant.price)) * quantity — hanya untuk display */
  preview_subtotal: number
}

/** Payload untuk dikirim ke backend */
export interface OrderItemPayload {
  menu_id: number
  quantity: number
  notes?: string | null
  selected_variants: Array<{
    variant_group_id: number
    variant_id: number
  }>
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Generate deterministic cart key dari product_id, sorted variant_ids, dan note.
 * Memastikan item yang sama selalu merge, item berbeda selalu dipisah.
 */
export function buildCartKey(
  menuId: number,
  selectedVariants: SelectedVariant[],
  note: string = ''
): string {
  const variantPart = [...selectedVariants]
    .sort((a, b) => a.variant_id - b.variant_id)
    .map((v) => `${v.variant_group_id}:${v.variant_id}`)
    .join(',')
  return `${menuId}|${variantPart}|${note.trim()}`
}

/**
 * Helper untuk membuat stable unique ID secara SSR-safe
 */
export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9)
}

/**
 * Hitung preview subtotal (hanya untuk display — harga final dari backend).
 */
export function calcPreviewSubtotal(
  basePrice: number,
  selectedVariants: SelectedVariant[],
  quantity: number
): number {
  const variantTotal = selectedVariants.reduce((sum, v) => sum + v.price, 0)
  return (basePrice + variantTotal) * quantity
}

// ─── Store ────────────────────────────────────────────────────────────────────

interface CartBucket {
  items: CartItem[]
  customerName: string
  orderNote: string
}

interface CartState {
  carts: Record<CartMode, CartBucket>
  restored: boolean
  lastRestoredSlug: string | null
}

const STORAGE_KEY = 'santap_cart_v2'

const getActiveOrgSlug = (): string => {
  try {
    const route = useRoute()
    return String(route.params.orgSlug || '').trim().toLowerCase()
  } catch {
    return ''
  }
}

const cleanOrphanStorages = (activeSlug: string) => {
  if (!import.meta.client || !activeSlug) return
  try {
    const activeCartKey = `santap_cart_${activeSlug}`
    const activeSessionKey = `customer_session_${activeSlug}`
    const keysToRemove: string[] = []

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) {
        if (key.startsWith('santap_cart_') && key !== activeCartKey) {
          keysToRemove.push(key)
        }
        if (key.startsWith('customer_session_') && !key.startsWith(activeSessionKey) && key !== 'customer_session') {
          keysToRemove.push(key)
        }
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k))
  } catch (e) {
    console.error('Failed to clean orphan storage:', e)
  }
}

const createBucket = (): CartBucket => ({
  items: [],
  customerName: '',
  orderNote: ''
})

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    carts: {
      table_order: createBucket(),
      open_bill: createBucket()
    },
    restored: false,
    lastRestoredSlug: null
  }),

  getters: {
    items: (state) => (mode: CartMode) => state.carts[mode].items,

    totalQuantity: (state) => (mode: CartMode) =>
      state.carts[mode].items.reduce((total, item) => total + item.quantity, 0),

    /** Preview total — hanya untuk display, final price dari backend */
    totalPrice: (state) => (mode: CartMode) =>
      state.carts[mode].items.reduce((total, item) => total + item.preview_subtotal, 0),

    customerName: (state) => (mode: CartMode) => state.carts[mode].customerName || '',

    orderNote: (state) => (mode: CartMode) => state.carts[mode].orderNote || '',

    /** Payload siap kirim ke backend */
    orderPayload: (state) => (mode: CartMode): OrderItemPayload[] =>
      state.carts[mode].items.map((item) => ({
        menu_id: item.menuId,
        quantity: item.quantity,
        notes: item.note ?? null,
        selected_variants: item.selected_variants.map((v) => ({
          variant_group_id: v.variant_group_id,
          variant_id: v.variant_id
        }))
      }))
  },

  actions: {
    /**
     * Tambah item ke cart atau merge jika cart key sudah ada.
     */
    addItem(
      mode: CartMode,
      params: {
        menuId: number
        name: string
        base_price: number
        quantity?: number
        selected_variants?: SelectedVariant[]
        note?: string
        image?: string | null
      }
    ) {
      const variants = params.selected_variants ?? []
      const note = params.note ?? ''
      const qty = params.quantity ?? 1
      const cartKey = buildCartKey(params.menuId, variants, note)

      const existing = this.carts[mode].items.find((i) => i.cartKey === cartKey)

      if (existing) {
        existing.quantity += qty
        existing.preview_subtotal = calcPreviewSubtotal(
          existing.base_price,
          existing.selected_variants,
          existing.quantity
        )
      } else {
        this.carts[mode].items.push({
          id: generateId(),
          cartKey,
          menuId: params.menuId,
          name: params.name,
          base_price: params.base_price,
          quantity: qty,
          selected_variants: variants,
          note: note || undefined,
          image: params.image || null,
          preview_subtotal: calcPreviewSubtotal(params.base_price, variants, qty)
        })
      }

      this.persist()
    },

    /**
     * Update quantity item berdasarkan cart item id (bukan menu id).
     */
    updateQuantityById(mode: CartMode, cartItemId: string, quantity: number) {
      const item = this.carts[mode].items.find((i) => i.id === cartItemId)
      if (!item) return

      if (quantity <= 0) {
        this.removeById(mode, cartItemId)
        return
      }

      item.quantity = quantity
      item.preview_subtotal = calcPreviewSubtotal(
        item.base_price,
        item.selected_variants,
        quantity
      )
      this.persist()
    },

    /**
     * Remove item berdasarkan cart item id.
     */
    removeById(mode: CartMode, cartItemId: string) {
      this.carts[mode].items = this.carts[mode].items.filter((i) => i.id !== cartItemId)
      this.persist()
    },

    /**
     * Update catatan item menu berdasarkan cart item id dan hitung ulang merge.
     */
    updateNoteById(mode: CartMode, cartItemId: string, note: string) {
      const item = this.carts[mode].items.find((i) => i.id === cartItemId)
      if (!item) return

      const cleanNote = note.trim()
      item.note = cleanNote || undefined
      item.cartKey = buildCartKey(item.menuId, item.selected_variants, cleanNote)

      // Cek apakah ada tabrakan key dengan item lain (selain dirinya sendiri)
      const duplicate = this.carts[mode].items.find(
        (i) => i.cartKey === item.cartKey && i.id !== cartItemId
      )

      if (duplicate) {
        duplicate.quantity += item.quantity
        duplicate.preview_subtotal = calcPreviewSubtotal(
          duplicate.base_price,
          duplicate.selected_variants,
          duplicate.quantity
        )
        // Hapus item lama karena sudah digabung
        this.carts[mode].items = this.carts[mode].items.filter((i) => i.id !== cartItemId)
      }

      this.persist()
    },

    setCustomerName(mode: CartMode, name: string) {
      this.carts[mode].customerName = name
      this.persist()
    },

    setOrderNote(mode: CartMode, note: string) {
      this.carts[mode].orderNote = note
      this.persist()
    },

    /**
     * @deprecated Gunakan updateQuantityById — legacy untuk backward compat
     */
    updateQuantity(mode: CartMode, menuId: number, quantity: number) {
      const item = this.carts[mode].items.find((i) => i.menuId === menuId)
      if (!item) return
      this.updateQuantityById(mode, item.id, quantity)
    },

    /**
     * @deprecated Gunakan removeById — legacy untuk backward compat
     */
    removeItem(mode: CartMode, menuId: number) {
      const item = this.carts[mode].items.find((i) => i.menuId === menuId)
      if (item) this.removeById(mode, item.id)
    },

    clearCart(mode: CartMode) {
      this.carts[mode] = createBucket()
      this.persist()
    },

    persist() {
      if (!import.meta.client) return
      
      const orgSlug = getActiveOrgSlug()
      const storageKey = orgSlug ? `santap_cart_${orgSlug}` : STORAGE_KEY
      
      try {
        localStorage.setItem(storageKey, JSON.stringify(this.carts))
      } catch {
        // Storage quota exceeded — ignore
      }
    },

    restore(force = false) {
      if (!import.meta.client) return
      
      const orgSlug = getActiveOrgSlug()
      
      // Jika sudah di-restore untuk outlet yang sama, lewati (kecuali dipaksa via force=true)
      if (this.restored && this.lastRestoredSlug === orgSlug && !force) return
      
      this.restored = true
      this.lastRestoredSlug = orgSlug

      // Bersihkan sampah outlet lain
      if (orgSlug) {
        cleanOrphanStorages(orgSlug)
      }

      const storageKey = orgSlug ? `santap_cart_${orgSlug}` : STORAGE_KEY
      const raw = localStorage.getItem(storageKey)
      if (!raw) {
        // Reset state jika tidak ada data di local storage untuk outlet ini
        this.carts = {
          table_order: createBucket(),
          open_bill: createBucket()
        }
        return
      }

      try {
        const parsed = JSON.parse(raw)
        if (parsed && typeof parsed === 'object') {
          const migrateBucket = (bucket: any): CartBucket => {
            const items = (bucket.items || []).map((item: any) => {
              const cartKey = item.cartKey || item.id || buildCartKey(item.menuId, item.selected_variants || [], item.note || '')
              let id = item.id
              // Jika id lama berupa key (mengandung '|') maka kita ganti dengan stable ID
              if (!id || id.includes('|')) {
                id = generateId()
              }
              return {
                ...item,
                id,
                cartKey,
                image: item.image || null
              }
            })
            return {
              items,
              customerName: bucket.customerName || '',
              orderNote: bucket.orderNote || ''
            }
          }

          this.carts = {
            table_order: parsed.table_order ? migrateBucket(parsed.table_order) : createBucket(),
            open_bill: parsed.open_bill ? migrateBucket(parsed.open_bill) : createBucket()
          }
        }
      } catch {
        this.carts = { table_order: createBucket(), open_bill: createBucket() }
      }
    }
  }
})
