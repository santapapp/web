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
import { historyStatusConfig } from '~/composables/useOrderStatus'

const props = withDefaults(defineProps<{
  items: OrderHistoryItem[]
  orgSlug: string
  /** Jumlah item per langkah expand */
  step?: number
}>(), {
  step: 5
})

const stepSize = computed(() => props.step ?? 5)

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
        <h2 class="text-sm font-extrabold uppercase tracking-wide text-stone-800">
          Pesanan Terbaru
        </h2>
      </div>
      <span class="text-xs font-bold text-stone-400 tabular-nums">
        {{ sortedItems.length }}
      </span>
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
              :label="statusConfig(item.status).label"
              :color="statusConfig(item.status).color"
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

          <!-- Bottom: date + chevron -->
          <div class="flex items-center justify-between gap-2 mt-1.5">
            <span class="flex items-center gap-1 text-[11px] text-stone-400 font-medium">
              <UIcon name="i-lucide-clock" class="size-3" />
              {{ formatDate(item.created_at) }}
            </span>
            <span class="flex items-center gap-0.5 text-[11px] font-bold text-amber-700">
              Lihat
              <UIcon name="i-lucide-chevron-right" class="size-3.5" />
            </span>
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
  </section>
</template>
