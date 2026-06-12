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

const formatPrice = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(value)
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
        class="px-4 py-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-[1.01]"
      >
        <span>Tampilkan lebih banyak</span>
        <UIcon name="i-lucide-arrow-right" class="size-4" />
      </NuxtLink>
    </div>

    <!-- Loading Skeletons -->
    <div v-if="loading" class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      <div v-for="n in 6" :key="n" class="overflow-hidden rounded-2xl border border-stone-200/60 bg-white">
        <USkeleton class="aspect-[4/3] w-full" />
        <div class="space-y-2 p-4">
          <USkeleton class="h-4 w-4/5" />
          <USkeleton class="h-3.5 w-1/2" />
        </div>
      </div>
    </div>

    <!-- Active Products List -->
    <div
      v-else-if="previewProducts.length > 0"
      class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
    >
      <article
        v-for="product in previewProducts"
        :key="product.id"
        class="overflow-hidden rounded-2xl border border-stone-200/60 bg-white shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
      >
        <div class="aspect-[4/3] bg-stone-50 overflow-hidden relative">
          <img
            v-if="product.image"
            :src="product.image"
            :alt="product.name"
            class="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
          >
          <div v-else class="flex h-full w-full items-center justify-center bg-stone-50">
            <UIcon name="i-lucide-utensils" class="size-8 text-stone-300" />
          </div>
        </div>
        <div class="p-4 flex-1 flex flex-col justify-between">
          <p class="line-clamp-2 text-xs sm:text-sm font-bold leading-snug text-stone-850">
            {{ product.name }}
          </p>
          <p class="mt-2 text-xs sm:text-sm font-extrabold text-amber-700">
            {{ formatPrice(product.price) }}
          </p>
        </div>
      </article>
    </div>

    <!-- Empty State -->
    <div v-else class="rounded-2xl border border-dashed border-stone-300 bg-stone-50/50 p-8 text-center">
      <UIcon name="i-lucide-utensils-crossed" class="mx-auto size-10 text-stone-400" />
      <p class="mt-3 text-sm font-semibold text-stone-550">Menu belum tersedia untuk ditampilkan.</p>
    </div>
  </section>
</template>
