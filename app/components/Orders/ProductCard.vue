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
    class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col h-full relative"
    :class="{ 'opacity-60 cursor-not-allowed': isUnavailable }"
    @click="handleAction"
  >
    <!-- Image with fallback warm gradient -->
    <div class="relative aspect-[4/3] bg-gradient-to-br from-orange-50 via-gray-50 to-gray-100 flex-shrink-0 overflow-hidden">
      <img
        v-if="product.image"
        :src="product.image"
        :alt="product.name"
        class="w-full h-full object-cover transition-transform duration-500 hover:scale-105 rounded-xl"
        loading="lazy"
      />
      <div v-else class="w-full h-full flex items-center justify-center bg-transparent">
        <UIcon name="i-lucide-utensils" class="size-8 text-gray-300" />
      </div>

      <!-- Badge: Out of stock -->
      <span
        v-if="isUnavailable"
        class="absolute top-2 left-2 bg-gray-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-full"
      >
        Habis
      </span>

      <!-- Badge: Cart quantity (circular, orange/red) -->
      <span
        v-if="cartQty && cartQty > 0 && !isUnavailable"
        class="absolute top-2 right-2 size-6 rounded-full bg-orange-600 text-white text-xs font-bold flex items-center justify-center shadow-md animate-scale-in"
      >
        {{ cartQty }}
      </span>
    </div>

    <!-- Body text and pricing details -->
    <div class="p-3 flex flex-col gap-1.5 flex-1 justify-between">
      <div class="flex flex-col gap-0.5">
        <h4 class="text-sm font-bold text-gray-900 leading-snug line-clamp-2">
          {{ product.name }}
        </h4>
        <p v-if="product.description" class="text-xs text-gray-400 leading-relaxed line-clamp-1 font-medium">
          {{ product.description }}
        </p>
      </div>

      <div class="flex items-center justify-between mt-auto pt-2 gap-2">
        <span class="text-sm font-extrabold text-orange-600 whitespace-nowrap">{{ formatPrice(product.price) }}</span>

        <!-- Action Buttons -->
        <div v-if="!isUnavailable" class="flex-shrink-0" @click.stop>
          <!-- Choose variant button -->
          <button
            v-if="hasVariants"
            type="button"
            class="px-3 py-1.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-100 font-bold text-xs flex items-center gap-1 transition-all duration-150 cursor-pointer"
            @click="handleAction"
          >
            <span>Pilih</span>
            <UIcon name="i-lucide-chevron-right" class="size-3.5" />
          </button>

          <!-- Stepper for non-variant products -->
          <div
            v-else-if="cartQty && cartQty > 0"
            class="flex items-center gap-1 bg-gray-50 rounded-full px-1 py-0.5 border border-gray-200 shadow-sm animate-scale-in"
          >
            <!-- Minus -->
            <button
              type="button"
              class="size-7 rounded-full text-orange-600 hover:bg-orange-50 active:scale-90 flex items-center justify-center transition-all cursor-pointer"
              aria-label="Kurangi"
              @click="emit('decrease', product)"
            >
              <UIcon name="i-lucide-minus" class="size-3.5" />
            </button>
            <span class="text-xs font-black text-gray-900 w-4 text-center tabular-nums">
              {{ cartQty }}
            </span>
            <!-- Plus -->
            <button
              type="button"
              class="size-7 rounded-full text-orange-600 hover:bg-orange-50 active:scale-90 flex items-center justify-center transition-all cursor-pointer"
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
            class="size-8 rounded-full bg-orange-600 text-white hover:bg-orange-700 active:scale-95 flex items-center justify-center shadow-sm shadow-orange-200 transition-all duration-150 cursor-pointer"
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
