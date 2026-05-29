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
  /** Unique key: product_id + sorted variant_ids + note */
  id: string
  menuId: number
  name: string
  /** Harga dasar product (tanpa variant) */
  base_price: number
  quantity: number
  selected_variants: SelectedVariant[]
  note?: string
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

// ─── Cart Key ─────────────────────────────────────────────────────────────────

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
}

interface CartState {
  carts: Record<CartMode, CartBucket>
  restored: boolean
}

const STORAGE_KEY = 'santap_cart_v2'

const createBucket = (): CartBucket => ({ items: [] })

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

    totalQuantity: (state) => (mode: CartMode) =>
      state.carts[mode].items.reduce((total, item) => total + item.quantity, 0),

    /** Preview total — hanya untuk display, final price dari backend */
    totalPrice: (state) => (mode: CartMode) =>
      state.carts[mode].items.reduce((total, item) => total + item.preview_subtotal, 0),

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
      }
    ) {
      const variants = params.selected_variants ?? []
      const note = params.note ?? ''
      const qty = params.quantity ?? 1
      const key = buildCartKey(params.menuId, variants, note)

      const existing = this.carts[mode].items.find((i) => i.id === key)

      if (existing) {
        existing.quantity += qty
        existing.preview_subtotal = calcPreviewSubtotal(
          existing.base_price,
          existing.selected_variants,
          existing.quantity
        )
      } else {
        this.carts[mode].items.push({
          id: key,
          menuId: params.menuId,
          name: params.name,
          base_price: params.base_price,
          quantity: qty,
          selected_variants: variants,
          note: note || undefined,
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
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.carts))
      } catch {
        // Storage quota exceeded — ignore
      }
    },

    restore() {
      if (!import.meta.client || this.restored) return
      this.restored = true

      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return

      try {
        const parsed = JSON.parse(raw)
        if (parsed && typeof parsed === 'object') {
          if (parsed.table_order?.items) this.carts.table_order = parsed.table_order
          if (parsed.open_bill?.items) this.carts.open_bill = parsed.open_bill
        }
      } catch {
        this.carts = { table_order: createBucket(), open_bill: createBucket() }
      }
    }
  }
})
