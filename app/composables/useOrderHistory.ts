/**
 * useOrderHistory — Composable untuk riwayat pesanan customer per org
 *
 * localStorage key: `santap:${orgSlug}:order_history`
 *
 * Fitur:
 * - SSR-safe (semua akses localStorage dibungkus guard import.meta.client)
 * - Versioning: format lama otomatis di-reset saat versi tidak cocok
 * - Max items: ORDER_HISTORY_MAX_ITEMS per org (hapus yang paling lama)
 * - Menggunakan order_public_id / order_code sebagai identifier, bukan raw ID
 */

import { ref, computed } from 'vue'
import type { OrderHistoryItem, OrderHistoryStorage } from '~/types/order-history'
import {
  ORDER_HISTORY_STORAGE_VERSION,
  ORDER_HISTORY_MAX_ITEMS
} from '~/types/order-history'

const storageKey = (orgSlug: string) => `santap:${orgSlug}:order_history`

// ─── SSR-safe localStorage helpers ───────────────────────────────────────────

function readStorage(orgSlug: string): OrderHistoryItem[] {
  if (!import.meta.client) return []

  try {
    const raw = localStorage.getItem(storageKey(orgSlug))
    if (!raw) return []

    const parsed = JSON.parse(raw) as OrderHistoryStorage

    // Versi tidak cocok → reset (format lama tidak kompatibel)
    if (parsed.version !== ORDER_HISTORY_STORAGE_VERSION) {
      localStorage.removeItem(storageKey(orgSlug))
      return []
    }

    if (!Array.isArray(parsed.items)) return []

    return parsed.items
  } catch {
    return []
  }
}

function writeStorage(orgSlug: string, items: OrderHistoryItem[]): void {
  if (!import.meta.client) return

  try {
    // Potong jika melebihi batas — pertahankan item paling baru (sort by last_seen_at desc)
    const trimmed = [...items]
      .sort((a, b) => b.last_seen_at.localeCompare(a.last_seen_at))
      .slice(0, ORDER_HISTORY_MAX_ITEMS)

    const storage: OrderHistoryStorage = {
      version: ORDER_HISTORY_STORAGE_VERSION,
      org_slug: orgSlug,
      items: trimmed
    }

    localStorage.setItem(storageKey(orgSlug), JSON.stringify(storage))
  } catch {
    // localStorage bisa penuh — abaikan error tulis
  }
}

// ─── Map status backend → OrderHistoryStatus ─────────────────────────────────

type RawOrderStatus = string | undefined | null

export function mapToHistoryStatus(
  orderStatus: RawOrderStatus,
  paymentStatus: RawOrderStatus,
  billStatus: RawOrderStatus
): OrderHistoryItem['status'] {
  if (paymentStatus === 'paid' || billStatus === 'closed') return 'paid'
  if (
    orderStatus === 'cancelled' ||
    paymentStatus === 'cancelled' ||
    paymentStatus === 'failed' ||
    billStatus === 'cancelled'
  ) return 'cancelled'
  if (paymentStatus === 'pending') return 'waiting_payment'
  if (orderStatus === 'confirmed' || orderStatus === 'processing') return 'processing'
  if (orderStatus === 'completed') return 'completed'
  return 'pending'
}

// ─── Composable ──────────────────────────────────────────────────────────────

export const useOrderHistory = (orgSlug: string) => {
  const items = ref<OrderHistoryItem[]>([])

  // ── Load dari localStorage (SSR-safe) ──────────────────────────────────────

  const load = () => {
    if (!import.meta.client) return
    items.value = readStorage(orgSlug)
  }

  // Muat langsung saat composable diinisialisasi (client-only)
  if (import.meta.client) {
    load()
  }

  // ── Computed ────────────────────────────────────────────────────────────────

  /**
   * Jumlah order yang masih aktif/pending (untuk badge header).
   * Active = status pending/processing/waiting_payment
   */
  const activeCount = computed(() =>
    items.value.filter(
      (i) =>
        i.status === 'pending' ||
        i.status === 'processing' ||
        i.status === 'waiting_payment'
    ).length
  )

  // ── Mutasi ──────────────────────────────────────────────────────────────────

  /**
   * Tambah atau update satu item history.
   * Jika order_public_id sudah ada → update.
   * Jika belum → tambah di awal list.
   */
  const addOrUpdate = (item: OrderHistoryItem) => {
    if (!import.meta.client) return

    const existing = items.value.findIndex(
      (i) => i.order_public_id === item.order_public_id
    )

    if (existing !== -1) {
      items.value[existing] = { ...items.value[existing], ...item }
    } else {
      items.value.unshift(item)
    }

    writeStorage(orgSlug, items.value)
  }

  /**
   * Update status satu item berdasarkan order_public_id.
   */
  const updateStatus = (
    orderPublicId: string,
    patch: Partial<Pick<OrderHistoryItem, 'status' | 'total_amount' | 'last_seen_at'>>
  ) => {
    if (!import.meta.client) return

    const idx = items.value.findIndex((i) => i.order_public_id === orderPublicId)
    if (idx !== -1) {
      items.value[idx] = { ...items.value[idx], ...patch } as OrderHistoryItem
      writeStorage(orgSlug, items.value)
    }
  }

  /**
   * Hapus satu item dari riwayat.
   */
  const removeOne = (orderPublicId: string) => {
    if (!import.meta.client) return

    items.value = items.value.filter((i) => i.order_public_id !== orderPublicId)
    writeStorage(orgSlug, items.value)
  }

  /**
   * Hapus semua riwayat untuk org ini.
   */
  const removeAll = () => {
    if (!import.meta.client) return

    items.value = []
    try {
      localStorage.removeItem(storageKey(orgSlug))
    } catch {
      // abaikan
    }
  }

  /**
   * Refresh status order ke backend, lalu update localStorage.
   * Dipanggil saat drawer dibuka.
   *
   * Hanya me-refresh item yang belum terminal (non-final status).
   * Item yang mendapat 403/404 akan ditandai 'expired'.
   */
  const refreshFromBackend = async () => {
    if (!import.meta.client || items.value.length === 0) return

    const api = useCustomerApi()

    // Status terminal — tidak perlu di-refresh lagi
    const TERMINAL_STATUSES: OrderHistoryItem['status'][] = ['paid', 'cancelled', 'completed', 'expired']

    const toRefresh = items.value.filter(
      (i) => !TERMINAL_STATUSES.includes(i.status ?? 'pending')
    )

    await Promise.allSettled(
      toRefresh.map(async (item) => {
        // Identifier publik untuk tracking: utamakan public_token, fallback ke order_number.
        const identifier = item.public_token ?? item.order_public_id ?? item.order_code

        try {
          const res = await api.getPublicOrder(orgSlug, identifier)
          const raw = res?.data ?? res

          if (!raw) return

          const newStatus = mapToHistoryStatus(
            raw.order_status ?? raw.status,
            raw.payment_status,
            raw.bill_status
          )

          updateStatus(item.order_public_id, {
            status: newStatus,
            total_amount: Number(raw.total_amount ?? raw.total ?? item.total_amount ?? 0),
            last_seen_at: new Date().toISOString()
          })
        } catch (err: any) {
          const statusCode = err?.statusCode ?? err?.status

          if (statusCode === 403 || statusCode === 404) {
            // Order tidak ditemukan atau session sudah tidak valid
            // Tandai sebagai 'expired' agar tidak terus di-refresh
            updateStatus(item.order_public_id, {
              status: 'expired',
              last_seen_at: new Date().toISOString()
            })
          }
          // Error lain (network error, 500) — biarkan status tidak berubah
          // agar bisa di-retry pada kunjungan berikutnya
        }
      })
    )
  }

  return {
    items,
    activeCount,
    load,
    addOrUpdate,
    updateStatus,
    removeOne,
    removeAll,
    refreshFromBackend
  }
}
