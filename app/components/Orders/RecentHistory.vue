<script setup lang="ts">
/**
 * RecentHistory.vue
 * Menampilkan riwayat pesanan terbaru di halaman ordering (entry state).
 *
 * Behavior expand progresif (sesuai permintaan):
 * - Awal tampil maksimal `step` (default 5) item terbaru.
 * - Tombol "Lihat lebih banyak" menambah `step` item lagi setiap klik.
 * - Saat semua item sudah tampil & jumlah > step → tombol berubah jadi
 *   "Lihat lebih sedikit" untuk menciutkan kembali ke `step`.
 *
 * Catatan:
 * - Hanya presentational + state visibleCount lokal.
 * - Data riwayat tetap dari useOrderHistory (localStorage) — TIDAK diubah.
 * - Tap item → buka detail order via query existing (?order=public_token).
 */

import type { OrderHistoryItem } from '~/types/order-history'
import { historyStatusConfig, getCustomerOrderDisplayStatus } from '~/composables/useOrderStatus'

const props = withDefaults(defineProps<{
  items: OrderHistoryItem[]
  orgSlug: string
  /** Jumlah item per langkah expand */
  step?: number
  refreshing?: boolean
}>(), {
  step: 5,
  refreshing: false
})

const stepSize = computed(() => props.step ?? 5)

const getDisplayStatus = (item: OrderHistoryItem) => {
  // 1. Jika ada status cache yang valid, tampilkan status cache
  if (item.status) {
    return getCustomerOrderDisplayStatus(item)
  }

  // 2. Jika tidak ada status cache, dan sedang me-refresh
  if (props.refreshing) {
    return { label: 'Memuat status...', color: 'neutral' as const }
  }

  // 3. Jika tidak ada status cache, dan tidak sedang me-refresh (misalnya refresh gagal)
  return { label: 'Status belum tersedia', color: 'neutral' as const }
}

// Riwayat terbaru di atas — urutkan desc by created_at (fallback ke urutan asli)
const sortedItems = computed(() =>
  [...props.items].sort((a, b) =>
    (b.created_at || '').localeCompare(a.created_at || '')
  )
)

const visibleCount = ref(stepSize.value)

// Reset saat jumlah item berubah (mis. setelah refresh / hapus)
watch(() => props.items.length, () => {
  visibleCount.value = stepSize.value
})

const visibleItems = computed(() => sortedItems.value.slice(0, visibleCount.value))

const hasMore = computed(() => visibleCount.value < sortedItems.value.length)
const canCollapse = computed(
  () => !hasMore.value && sortedItems.value.length > stepSize.value
)

const remaining = computed(() =>
  Math.max(0, sortedItems.value.length - visibleCount.value)
)
const nextChunk = computed(() => Math.min(stepSize.value, remaining.value))

const showMore = () => {
  visibleCount.value = Math.min(
    visibleCount.value + stepSize.value,
    sortedItems.value.length
  )
}

const showLess = () => {
  visibleCount.value = stepSize.value
}

// ─── Format helpers ──────────────────────────────────────────────────────────

const formatPrice = (v?: number) => {
  if (!v) return null
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(v)
}

const formatDate = (iso: string) => {
  try {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

// Label & warna status riwayat → sumber tunggal di useOrderStatus.
const statusConfig = historyStatusConfig

const orderHistory = useOrderHistory(props.orgSlug)
const showDeleteAllModal = ref(false)

const handleRemoveOne = (orderPublicId: string) => {
  orderHistory.removeOne(orderPublicId)
}

const handleClearAll = () => {
  orderHistory.removeAll()
  showDeleteAllModal.value = false
}

const orderDetailRoute = (item: OrderHistoryItem) => ({
  path: `/o/${props.orgSlug}/orders`,
  query: { order: item.order_public_id }
})
</script>

<template>
  <section v-if="sortedItems.length" class="w-full">
    <!-- Header -->
    <div class="flex items-center justify-between gap-2 mb-3">
      <div class="flex items-center gap-2">
        <span class="size-8 rounded-xl bg-amber-100 border border-amber-200/60 flex items-center justify-center text-amber-700 shrink-0">
          <UIcon name="i-lucide-clock" class="size-4" />
        </span>
        <div class="text-sm font-extrabold uppercase tracking-wide text-stone-800">
          Pesanan Terbaru
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button
          v-if="sortedItems.length > 0"
          type="button"
          class="inline-flex items-center gap-1 text-[11px] font-bold text-stone-400 hover:text-rose-600 px-2 py-1 rounded-lg hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all duration-150 cursor-pointer"
          title="Hapus cache riwayat pesanan"
          @click="showDeleteAllModal = true"
        >
          <UIcon name="i-lucide-trash-2" class="size-3.5" />
          <span>Hapus Riwayat</span>
        </button>
        <span class="text-xs font-bold text-stone-400 tabular-nums">
          {{ sortedItems.length }}
        </span>
      </div>
    </div>

    <!-- List -->
    <ul class="flex flex-col gap-2.5">
      <li v-for="item in visibleItems" :key="item.order_public_id">
        <NuxtLink
          :to="orderDetailRoute(item)"
          class="block bg-white rounded-2xl border border-stone-200/70 shadow-sm hover:border-amber-300 hover:shadow-md active:scale-[0.99] transition-all duration-150 px-4 py-3.5"
        >
          <!-- Top: mode + status -->
          <div class="flex items-center justify-between gap-2 mb-1.5">
            <span class="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-stone-400">
              <UIcon
                :name="item.mode === 'open_bill' ? 'i-lucide-receipt' : 'i-lucide-utensils'"
                class="size-3"
              />
              {{ item.mode === 'open_bill' ? 'Open Bill' : 'Meja' }}
              <template v-if="item.table_label">
                <span class="text-stone-300">·</span>
                <span class="text-stone-600 font-bold normal-case tracking-normal">{{ item.table_label }}</span>
              </template>
            </span>
            <UBadge
              :label="getDisplayStatus(item).label"
              :color="getDisplayStatus(item).color"
              variant="soft"
              size="xs"
            />
          </div>

          <!-- Mid: order code + total -->
          <div class="flex items-baseline justify-between gap-2">
            <span class="text-sm font-extrabold text-stone-900 truncate">
              {{ item.order_code }}
            </span>
            <span
              v-if="formatPrice(item.total_amount)"
              class="text-sm font-extrabold text-amber-700 whitespace-nowrap"
            >
              {{ formatPrice(item.total_amount) }}
            </span>
          </div>

          <!-- Bottom: date + actions -->
          <div class="flex items-center justify-between gap-2 mt-1.5">
            <span class="flex items-center gap-1 text-[11px] text-stone-400 font-medium">
              <UIcon name="i-lucide-clock" class="size-3" />
              {{ formatDate(item.created_at) }}
            </span>
            <div class="flex items-center gap-2.5">
              <button
                type="button"
                class="inline-flex items-center gap-1 text-[11px] font-medium text-stone-400 hover:text-rose-600 transition-colors cursor-pointer p-0.5"
                title="Hapus dari riwayat"
                @click.prevent.stop="handleRemoveOne(item.order_public_id)"
              >
                <UIcon name="i-lucide-trash-2" class="size-3.5" />
              </button>
              <span class="flex items-center gap-0.5 text-[11px] font-bold text-amber-700">
                Lihat
                <UIcon name="i-lucide-chevron-right" class="size-3.5" />
              </span>
            </div>
          </div>
        </NuxtLink>
      </li>
    </ul>

    <!-- Expand control -->
    <div v-if="hasMore || canCollapse" class="mt-3 flex justify-center">
      <button
        v-if="hasMore"
        type="button"
        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-amber-300 bg-white text-amber-800 hover:bg-amber-50 active:scale-95 font-bold text-xs transition-all duration-150 cursor-pointer"
        @click="showMore"
      >
        <span>Lihat {{ nextChunk }} lagi</span>
        <UIcon name="i-lucide-chevron-down" class="size-4" />
      </button>

      <button
        v-else-if="canCollapse"
        type="button"
        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-stone-300 bg-white text-stone-600 hover:bg-stone-50 active:scale-95 font-bold text-xs transition-all duration-150 cursor-pointer"
        @click="showLess"
      >
        <span>Lihat lebih sedikit</span>
        <UIcon name="i-lucide-chevron-up" class="size-4" />
      </button>
    </div>

    <!-- Delete All Confirm Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showDeleteAllModal"
          class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
          @click.self="showDeleteAllModal = false"
        >
          <div class="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl border border-stone-100 flex flex-col items-center text-center gap-3">
            <div class="size-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
              <UIcon name="i-lucide-trash-2" class="size-6" />
            </div>
            <div>
              <h4 class="text-base font-extrabold text-stone-900">Hapus Riwayat Pesanan?</h4>
              <p class="text-xs text-stone-500 mt-1 leading-relaxed">
                Seluruh cache riwayat pesanan di kedai ini akan dihapus dari perangkat Anda.
              </p>
            </div>
            <div class="flex items-center gap-2.5 w-full mt-2">
              <button
                type="button"
                class="flex-1 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50 transition-all cursor-pointer"
                @click="showDeleteAllModal = false"
              >
                Batal
              </button>
              <button
                type="button"
                class="flex-1 py-2.5 rounded-xl bg-rose-600 text-xs font-bold text-white hover:bg-rose-700 transition-all cursor-pointer shadow-sm"
                @click="handleClearAll"
              >
                Ya, Hapus Semua
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>
