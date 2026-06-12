<script setup lang="ts">
/**
 * ProductCard.vue
 * Elegant product card inside the customer menu list, featuring
 * direct add-to-cart stepper actions for non-variant products and
 * variant choices selector.
 */

import { computed } from 'vue'
import type { MenuProduct } from '~/types/customer-menu'

const props = defineProps<{
  product: MenuProduct
  /** Quantity in cart */
  cartQty?: number
  readOnly?: boolean
}>()

const emit = defineEmits<{
  add: [product: MenuProduct]
  'open-detail': [product: MenuProduct]
  decrease: [product: MenuProduct]
  increase: [product: MenuProduct]
}>()

const formatPrice = (v: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(v)

const hasVariants = computed(() => props.product.variant_groups.length > 0)
const isUnavailable = computed(() => !props.product.is_available)

const handleAction = () => {
  if (isUnavailable.value || hasVariants.value || props.readOnly) {
    emit('open-detail', props.product)
  } else {
    emit('add', props.product)
  }
}
</script>

<template>
  <article
    class="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-350 cursor-pointer flex flex-col group border border-stone-200/10"
    :class="{ 'opacity-75': isUnavailable }"
    @click="handleAction"
  >
    <!-- Background Image / Aesthetic Placeholder -->
    <div class="absolute inset-0 bg-gradient-to-br from-stone-900 to-stone-950 flex-shrink-0 overflow-hidden">
      <img
        v-if="product.image"
        :src="product.image"
        :alt="product.name"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <!-- Soft gradient F&B placeholder if no image -->
      <div v-else class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-orange-950/20 via-stone-900 to-stone-950 p-4">
        <UIcon name="i-lucide-utensils" class="size-7 text-white/10 mb-1" />
      </div>
      
      <!-- Gradient overlay for readability -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent" />
    </div>

    <!-- Badge: Out of stock -->
    <span
      v-if="isUnavailable"
      class="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-sm border border-white/10 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full z-10"
    >
      Habis
    </span>

    <!-- Badge: Cart quantity -->
    <span
      v-if="cartQty && cartQty > 0 && !isUnavailable"
      class="absolute top-2.5 right-2.5 size-6 rounded-full bg-orange-600 text-white text-[11px] font-black flex items-center justify-center shadow-lg border border-white/20 z-10 animate-scale-in"
    >
      {{ cartQty }}
    </span>

    <!-- Overlay Content at bottom -->
    <div class="absolute bottom-0 left-0 right-0 p-3 sm:p-3.5 flex flex-col justify-end z-10 gap-2 min-h-[50%]">
      <!-- Title & Description -->
      <div class="flex flex-col gap-0.5">
        <h4 class="text-xs sm:text-sm font-black text-white leading-snug line-clamp-2 drop-shadow-sm">
          {{ product.name }}
        </h4>
        <p v-if="product.description" class="text-[10px] sm:text-[11px] text-white/70 leading-normal line-clamp-1 font-medium">
          {{ product.description }}
        </p>
      </div>

      <!-- Price & Actions Row -->
      <div class="flex items-center justify-between gap-2 pt-1">
        <span class="text-xs sm:text-sm font-black text-orange-400 whitespace-nowrap drop-shadow-sm">
          {{ formatPrice(product.price) }}
        </span>

        <!-- Action Buttons -->
        <div v-if="!isUnavailable && !readOnly" class="flex-shrink-0" @click.stop>
          <!-- Choose variant button (Glass pill button) -->
          <button
            v-if="hasVariants"
            type="button"
            class="size-8 sm:size-auto sm:px-3 sm:py-1.5 rounded-full bg-orange-500/15 border border-orange-400/35 hover:bg-orange-500/25 text-orange-300 hover:text-orange-200 backdrop-blur-md font-black text-[10px] uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1 transition-all duration-150 cursor-pointer"
            @click="handleAction"
          >
            <span class="hidden sm:inline">Pilih</span>
            <UIcon name="i-lucide-chevron-right" class="size-4 sm:size-3.5" />
          </button>

          <!-- Stepper for non-variant products (Glass stepper) -->
          <div
            v-else-if="cartQty && cartQty > 0"
            class="flex items-center gap-1 bg-black/40 backdrop-blur-md rounded-full px-1 py-0.5 border border-white/10 shadow-sm animate-scale-in"
          >
            <!-- Minus -->
            <button
              type="button"
              class="size-7 rounded-full text-orange-400 hover:bg-white/10 active:scale-90 flex items-center justify-center transition-all cursor-pointer"
              aria-label="Kurangi"
              @click="emit('decrease', product)"
            >
              <UIcon name="i-lucide-minus" class="size-3.5" />
            </button>
            <span class="text-xs font-black text-white w-4 text-center tabular-nums">
              {{ cartQty }}
            </span>
            <!-- Plus -->
            <button
              type="button"
              class="size-7 rounded-full text-orange-400 hover:bg-white/10 active:scale-90 flex items-center justify-center transition-all cursor-pointer"
              aria-label="Tambah"
              @click="emit('increase', product)"
            >
              <UIcon name="i-lucide-plus" class="size-3.5" />
            </button>
          </div>

          <!-- Add to cart direct button (Glass circular button) -->
          <button
            v-else
            type="button"
            class="size-8 rounded-full bg-orange-500/15 border border-orange-400/35 hover:bg-orange-500/25 text-orange-400 hover:text-orange-300 backdrop-blur-md flex items-center justify-center transition-all duration-150 cursor-pointer"
            :aria-label="`Tambah ${product.name}`"
            @click="handleAction"
          >
            <UIcon name="i-lucide-plus" class="size-4" />
          </button>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.animate-scale-in {
  animation: scaleIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes scaleIn {
  from { transform: scale(0.85); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
</style>
