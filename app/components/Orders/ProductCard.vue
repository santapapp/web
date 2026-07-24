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
    class="relative aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-350 cursor-pointer flex flex-col group border border-stone-200/10"
    :class="{ 'opacity-75': isUnavailable }"
    @click="handleAction"
  >
    <!-- Background Image / Aesthetic Placeholder (Clean without dark gradient overlay) -->
    <div class="absolute inset-0 bg-stone-100 flex-shrink-0 overflow-hidden">
      <img
        v-if="product.image"
        :src="product.image"
        :alt="product.name"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <!-- Warm placeholder if no image -->
      <div v-else class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-stone-100 to-stone-200">
        <UIcon name="i-lucide-utensils" class="size-8 text-stone-300" />
      </div>
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
      class="absolute top-2.5 right-2.5 size-6 rounded-full bg-orange-600 text-white text-[11px] font-black flex items-center justify-center shadow-md border border-white/40 z-10 animate-scale-in"
    >
      {{ cartQty }}
    </span>

    <!-- Content Panel at bottom: Transparent Overlay -->
    <div class="absolute bottom-0 left-0 right-0 p-2.5 sm:p-3 flex flex-col justify-end z-10 gap-1 bg-transparent">
      <!-- Title & Description -->
      <div class="flex flex-col gap-0.5">
        <h4 class="text-xs sm:text-sm font-bold text-slate-900 leading-snug line-clamp-1">
          {{ product.name }}
        </h4>
        <p v-if="product.description" class="text-[10px] sm:text-[11px] text-slate-600 leading-normal line-clamp-1 font-medium">
          {{ product.description }}
        </p>
      </div>

      <!-- Price & Actions Row -->
      <div class="flex items-center justify-between gap-2 pt-0.5">
        <span class="text-xs sm:text-sm font-extrabold text-orange-600 whitespace-nowrap">
          {{ formatPrice(product.price) }}
        </span>

        <!-- Action Buttons -->
        <div v-if="!isUnavailable && !readOnly" class="flex-shrink-0" @click.stop>
          <!-- Choose variant button -->
          <button
            v-if="hasVariants"
            type="button"
            class="h-7 px-2.5 rounded-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-[10px] leading-none flex items-center justify-center gap-0.5 transition-all duration-150 cursor-pointer shadow-xs shrink-0"
            @click="handleAction"
          >
            <span>Pilih</span>
            <UIcon name="i-lucide-chevron-right" class="size-3 text-white" />
          </button>

          <!-- Stepper for non-variant products -->
          <div
            v-else-if="cartQty && cartQty > 0"
            class="flex items-center gap-1 bg-stone-100 rounded-full px-1 py-0.5 border border-stone-200 shadow-xs animate-scale-in"
          >
            <!-- Minus -->
            <button
              type="button"
              class="size-6 rounded-full text-orange-600 hover:bg-orange-100 active:scale-90 flex items-center justify-center transition-all cursor-pointer"
              aria-label="Kurangi"
              @click="emit('decrease', product)"
            >
              <UIcon name="i-lucide-minus" class="size-3 text-orange-600" />
            </button>
            <span class="text-xs font-black text-stone-900 w-4 text-center tabular-nums">
              {{ cartQty }}
            </span>
            <!-- Plus -->
            <button
              type="button"
              class="size-6 rounded-full text-orange-600 hover:bg-orange-100 active:scale-90 flex items-center justify-center transition-all cursor-pointer"
              aria-label="Tambah"
              @click="emit('increase', product)"
            >
              <UIcon name="i-lucide-plus" class="size-3 text-orange-600" />
            </button>
          </div>

          <!-- Add to cart direct button -->
          <button
            v-else
            type="button"
            class="size-7 rounded-full bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center transition-all duration-150 cursor-pointer shadow-xs"
            :aria-label="`Tambah ${product.name}`"
            @click="handleAction"
          >
            <UIcon name="i-lucide-plus" class="size-3.5 text-white" />
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
