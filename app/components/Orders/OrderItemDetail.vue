<script setup lang="ts">
/**
 * OrderItemDetail.vue
 * Menampilkan SATU item pesanan secara lengkap:
 * - nama produk + quantity + subtotal
 * - daftar variant/addon (children) beserta harga tambahannya
 * - catatan per item
 * - status item (bila tersedia dari backend)
 *
 * Presentational only — data dari CustomerOrderItem existing.
 * `children` sudah dinormalisasi oleh parent (nested maupun flat parent_item_id).
 */

import type { CustomerOrderItem } from '~/types/customer-order'
import { itemStatusConfig } from '~/composables/useOrderStatus'

const props = defineProps<{
  item: CustomerOrderItem
  /** True bila order induk dibatalkan — status item non-final tidak relevan lagi */
  orderCancelled?: boolean
}>()

const formatPrice = (v: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(v)

// Label & warna status item → sumber tunggal di useOrderStatus.
const status = computed(() => {
  // Bila order dibatalkan, status item non-final (mis. "Menunggu"/"Disiapkan")
  // tidak relevan — tampilkan "Dibatalkan" atau sembunyikan agar tidak menyesatkan.
  if (props.orderCancelled) {
    return props.item.item_status === 'cancelled'
      ? itemStatusConfig('cancelled')
      : null
  }
  return itemStatusConfig(props.item.item_status)
})

// Kelompokkan children berdasarkan tipe agar variant & addon terlihat rapi.
const children = computed(() => props.item.children ?? [])
</script>

<template>
  <div class="flex gap-3 py-3.5">
    <!-- Thumbnail + quantity badge -->
    <div class="relative flex-shrink-0">
      <div class="size-14 rounded-xl overflow-hidden bg-gradient-to-br from-amber-100 via-orange-50 to-stone-100 flex items-center justify-center">
        <img
          v-if="item.image"
          :src="item.image"
          :alt="item.name"
          class="w-full h-full object-cover"
          loading="lazy"
        />
        <UIcon v-else name="i-lucide-utensils" class="size-6 text-amber-900/20" />
      </div>
      <span
        class="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-amber-600 text-white text-[10px] font-extrabold flex items-center justify-center tabular-nums shadow-sm"
      >
        {{ item.quantity }}×
      </span>
    </div>

    <div class="flex-1 min-w-0">
      <!-- Name + subtotal -->
      <div class="flex items-start justify-between gap-3">
        <p class="text-sm font-bold text-stone-900 leading-snug">
          {{ item.name }}
        </p>
        <span class="text-sm font-bold text-stone-900 whitespace-nowrap">
          {{ formatPrice(item.subtotal) }}
        </span>
      </div>

      <!-- Base price per unit (bila ada children, bantu user pahami komposisi) -->
      <p v-if="children.length && item.price > 0" class="text-xs text-stone-400 mt-0.5">
        Dasar {{ formatPrice(item.price) }}
      </p>

      <!-- Variants / addons -->
      <ul v-if="children.length" class="mt-1.5 flex flex-col gap-1">
        <li
          v-for="child in children"
          :key="child.id"
          class="flex items-center justify-between gap-2 text-xs"
        >
          <span class="flex items-center gap-1.5 min-w-0 text-stone-500">
            <UIcon
              :name="child.item_type === 'addon' ? 'i-lucide-circle-plus' : 'i-lucide-dot'"
              class="size-3.5 flex-shrink-0 text-stone-300"
            />
            <span class="truncate">{{ child.name }}</span>
          </span>
          <span v-if="child.price > 0" class="font-semibold text-amber-700 whitespace-nowrap">
            + {{ formatPrice(child.price) }}
          </span>
        </li>
      </ul>

      <!-- Note -->
      <p
        v-if="item.note"
        class="mt-1.5 flex items-start gap-1.5 text-xs text-stone-500 italic"
      >
        <UIcon name="i-lucide-message-square" class="size-3.5 flex-shrink-0 mt-0.5 not-italic text-stone-300" />
        <span>{{ item.note }}</span>
      </p>

      <!-- Per-item status -->
      <div v-if="status" class="mt-1.5">
        <UBadge :label="status.label" :color="status.color" variant="soft" size="xs" />
      </div>
    </div>
  </div>
</template>
