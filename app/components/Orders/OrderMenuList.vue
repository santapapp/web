<script setup lang="ts">
/**
 * OrderMenuList.vue
 * Core container for customer ordering menus. Includes search, categories tabs,
 * active session status banner, and the modular product grids.
 */

import { ref, onMounted, onUnmounted } from 'vue'
import type { MenuProduct } from '~/types/menu'
import type { CustomerMenuCategoryGroup } from '~/types/customer-menu'
import { useUiOverlayStore } from '~/stores/ui-overlay.store'

defineProps<{
  products: MenuProduct[]
  loading?: boolean
  cartQtyMap?: Record<number, number>
  tableLabel?: string | null
  isOpenBill?: boolean
  categories?: CustomerMenuCategoryGroup[]
  activeCategory?: string
}>()

const searchQuery = defineModel<string>('searchQuery', { default: '' })
const overlay = useUiOverlayStore()

const emit = defineEmits<{
  add: [product: MenuProduct]
  'open-detail': [product: MenuProduct]
  'change-category': [categoryId: string]
  decrease: [product: MenuProduct]
  increase: [product: MenuProduct]
}>()

const sentinelRef = ref<HTMLElement | null>(null)
let handleScroll: () => void

onMounted(() => {
  overlay.isSearchSticky = false
  overlay.showNavbarSearchInput = false

  handleScroll = () => {
    if (!sentinelRef.value) return
    const rect = sentinelRef.value.getBoundingClientRect()
    // top-14 is 56px, lg:top-16 is 64px
    const headerHeight = window.innerWidth >= 1024 ? 64 : 56
    const isSticky = rect.top <= headerHeight
    overlay.isSearchSticky = isSticky
    if (!isSticky) {
      overlay.showNavbarSearchInput = false
    }
  }

  window.addEventListener('scroll', handleScroll, { capture: true, passive: true })
  // Initial check
  handleScroll()
})

onUnmounted(() => {
  if (handleScroll) {
    window.removeEventListener('scroll', handleScroll, { capture: true })
  }
  overlay.isSearchSticky = false
  overlay.showNavbarSearchInput = false
})
</script>

<template>
  <section class="mx-auto w-full max-w-5xl px-4 pt-0 pb-32 lg:px-6 lg:pb-8">
    <div ref="sentinelRef" class="h-0 w-full pointer-events-none"></div>

    <div
      v-if="!overlay.isSearchSticky || (categories && categories.length > 1)"
      class="sticky top-0 z-10 bg-gray-50/95 backdrop-blur-md py-3 -mx-4 px-4 mb-4 flex flex-col gap-3.5 border-b border-stone-250/10"
    >
      <!-- Search field input -->
      <OrdersMenuSearchBar v-show="!overlay.isSearchSticky" v-model="searchQuery" />

      <!-- Category selection tabs -->
      <OrdersCategoryTabs
        v-if="categories && categories.length > 1"
        :categories="categories"
        :active-category="activeCategory || 'all'"
        @change="emit('change-category', $event)"
      />
    </div>

    <!-- Skeletons Loader -->
    <div v-if="loading" class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      <div v-for="n in 8" :key="n" class="overflow-hidden rounded-2xl bg-white shadow-sm">
        <USkeleton class="aspect-square w-full" />
        <div class="space-y-2 p-3">
          <USkeleton class="h-4 w-3/4 rounded-lg" />
          <USkeleton class="h-3.5 w-1/2 rounded-lg" />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <OrdersEmptyState
      v-else-if="products.length === 0"
      title="Menu tidak ditemukan"
      description="Coba kata kunci lain atau hubungi kasir untuk bantuan."
      icon="i-lucide-utensils-crossed"
    />

    <!-- Active Menu Cards Grid -->
    <div v-else class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 animate-fade-in-up">
      <OrdersProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        :cart-qty="cartQtyMap?.[product.id] ?? 0"
        @add="emit('add', $event)"
        @open-detail="emit('open-detail', $event)"
        @decrease="emit('decrease', $event)"
        @increase="emit('increase', $event)"
      />
    </div>
  </section>
</template>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
