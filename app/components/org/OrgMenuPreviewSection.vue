<script setup lang="ts">
/**
 * OrgMenuPreviewSection.vue
 * Renders a sample card list of products available at the restaurant.
 * Fully responsive and warm colored.
 */

import { computed } from 'vue'
import type { MenuProduct } from '~/types/menu'

const props = defineProps<{
  products: MenuProduct[]
  loading?: boolean
  menuTo: string
}>()

const previewProducts = computed(() => props.products.slice(0, 6))
</script>

<template>
  <section class="mx-auto max-w-5xl px-5 py-6 sm:px-6 lg:px-8">
    <div class="mb-5 flex items-end justify-between gap-4">
      <div>
        <p class="text-xs font-bold uppercase tracking-wide text-amber-700">Daftar Menu</p>
        <h2 class="mt-1 text-2xl font-serif font-black text-stone-900 tracking-tight">Preview Menu</h2>
      </div>
      <!-- Secondary Button with warm soft styling -->
      <NuxtLink
        :to="menuTo"
        class="p-2 sm:px-4 sm:py-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-[1.01]"
      >
        <span class="hidden sm:inline">Tampilkan lebih banyak</span>
        <UIcon name="i-lucide-arrow-right" class="size-4" />
      </NuxtLink>
    </div>

    <!-- Loading Skeletons -->
    <div v-if="loading" class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      <USkeleton
        v-for="n in 6"
        :key="n"
        class="aspect-[4/5] w-full rounded-2xl"
      />
    </div>

    <!-- Active Products List -->
    <div
      v-else-if="previewProducts.length > 0"
      class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
    >
      <div
        v-for="product in previewProducts"
        :key="product.id"
        class="pointer-events-none"
      >
        <OrdersProductCard
          :product="product"
          :read-only="true"
        />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="rounded-2xl border border-dashed border-stone-300 bg-stone-50/50 p-8 text-center">
      <UIcon name="i-lucide-utensils-crossed" class="mx-auto size-10 text-stone-400" />
      <p class="mt-3 text-sm font-semibold text-stone-550">Menu belum tersedia untuk ditampilkan.</p>
    </div>
  </section>
</template>
