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
  if (isUnavailable.value) return
  if (hasVariants.value) {
    emit('open-detail', props.product)
  } else {
    emit('add', props.product)
  }
}
</script>

<template>
  <article
    class="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:border-amber-300 hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col h-full relative"
    :class="{ 'opacity-65 cursor-not-allowed': isUnavailable }"
    @click="handleAction"
  >
    <!-- Image with fallback warm gradient -->
    <div class="relative aspect-[4/3] bg-gradient-to-br from-amber-100 via-orange-50 to-stone-100 flex-shrink-0 overflow-hidden">
      <img
        v-if="product.image"
        :src="product.image"
        :alt="product.name"
        class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        loading="lazy"
      />
      <div v-else class="w-full h-full flex items-center justify-center bg-transparent">
        <UIcon name="i-lucide-utensils" class="size-8 text-amber-900/20" />
      </div>

      <!-- Badge: Out of stock -->
      <UBadge
        v-if="isUnavailable"
        label="Habis"
        color="neutral"
        variant="solid"
        class="absolute top-2 left-2 font-bold px-2 py-0.5 rounded-full text-[10px]"
      />

      <!-- Badge: Cart quantity (only shown for variant items) -->
      <span
        v-if="cartQty && cartQty > 0 && !isUnavailable && hasVariants"
        class="absolute top-2 right-2 size-6 rounded-full bg-amber-700 text-white text-xs font-bold flex items-center justify-center shadow-md animate-scale-in"
      >
        {{ cartQty }}
      </span>
    </div>

    <!-- Body text and pricing details -->
    <div class="p-4 flex flex-col gap-1.5 flex-1 justify-between">
      <div class="flex flex-col gap-1">
        <h4 class="text-sm font-bold text-stone-900 leading-snug line-clamp-2">
          {{ product.name }}
        </h4>
        <p v-if="product.description" class="text-xs text-stone-500 leading-relaxed line-clamp-2 font-medium">
          {{ product.description }}
        </p>
      </div>

      <div class="flex items-center justify-between mt-auto pt-2.5 gap-2">
        <span class="text-sm font-extrabold text-amber-700 whitespace-nowrap">{{ formatPrice(product.price) }}</span>
        
        <!-- Action Buttons -->
        <div v-if="!isUnavailable" class="flex-shrink-0" @click.stop>
          <!-- Choose variant button -->
          <button
            v-if="hasVariants"
            type="button"
            class="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 font-extrabold text-xs flex items-center gap-1 transition-all duration-150 cursor-pointer shadow-sm"
            @click="handleAction"
          >
            <span>Pilih</span>
            <UIcon name="i-lucide-chevron-right" class="size-3.5" />
          </button>

          <!-- Stepper for non-variant products -->
          <div
            v-else-if="cartQty && cartQty > 0"
            class="flex items-center gap-1.5 border border-amber-250 bg-amber-50/50 rounded-xl px-1 py-0.5 shadow-sm animate-scale-in"
          >
            <!-- Minus -->
            <button
              type="button"
              class="size-8 rounded-lg text-amber-850 hover:bg-amber-100/50 active:scale-90 flex items-center justify-center transition-all cursor-pointer"
              aria-label="Kurangi"
              @click="emit('decrease', product)"
            >
              <UIcon name="i-lucide-minus" class="size-3.5" />
            </button>
            <span class="text-xs font-black text-stone-900 w-5 text-center tabular-nums">
              {{ cartQty }}
            </span>
            <!-- Plus -->
            <button
              type="button"
              class="size-8 rounded-lg text-amber-850 hover:bg-amber-100/50 active:scale-90 flex items-center justify-center transition-all cursor-pointer"
              aria-label="Tambah"
              @click="emit('increase', product)"
            >
              <UIcon name="i-lucide-plus" class="size-3.5" />
            </button>
          </div>

          <!-- Add to cart direct button -->
          <button
            v-else
            type="button"
            class="size-8 rounded-xl bg-amber-700 text-white hover:bg-amber-800 active:scale-95 flex items-center justify-center shadow-sm transition-all duration-150 cursor-pointer"
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
