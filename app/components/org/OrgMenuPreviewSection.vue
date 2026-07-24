<script setup lang="ts">
/**
 * OrgMenuPreviewSection.vue
 * Renders the full interactive menu with search, category tabs, and product cards.
 * Sized exactly as the original menu page.
 */

import { ref, onMounted, onUnmounted } from 'vue'
import type { MenuProduct } from '~/types/menu'
import type { CustomerMenuCategoryGroup } from '~/types/customer-menu'
import { useUiOverlayStore } from '~/stores/ui-overlay.store'

defineProps<{
  products: MenuProduct[]
  loading?: boolean
  categories?: CustomerMenuCategoryGroup[]
  activeCategory?: string
  shouldGroupByCategory?: boolean
  filteredCategoryGroups?: any[]
  menuError?: any
  menuErrorMessage?: string | null
}>()

const searchQuery = defineModel<string>('searchQuery', { default: '' })
const overlay = useUiOverlayStore()

const emit = defineEmits<{
  'open-detail': [product: MenuProduct]
  'change-category': [categoryId: string]
  'retry': []
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
  <section class="mx-auto max-w-5xl px-5 py-6 sm:px-6 lg:px-8">
    <div class="mb-5">
      <p class="text-xs font-bold uppercase tracking-wide text-amber-700">Daftar Menu</p>
      <h2 class="mt-1 text-2xl font-serif font-black text-stone-900 tracking-tight">Menu Kami</h2>
    </div>

    <div ref="sentinelRef" class="h-0 w-full pointer-events-none"></div>

    <!-- Search & Tabs Sticky Header -->
    <div
      v-if="!overlay.isSearchSticky || (categories && categories.length > 1)"
      class="sticky top-14 z-30 -mx-5 border-b border-gray-100 bg-gray-50/95 px-5 py-3 backdrop-blur-md lg:top-16 lg:mx-0 lg:rounded-2xl lg:border lg:bg-white/95 lg:px-4 mb-5"
    >
      <div class="flex flex-col gap-3">
        <OrdersMenuSearchBar v-show="!overlay.isSearchSticky" v-model="searchQuery" />

        <OrdersCategoryTabs
          v-if="categories && categories.length > 1"
          :categories="categories"
          :active-category="activeCategory || 'all'"
          @change="emit('change-category', $event)"
        />
      </div>
    </div>

    <!-- Error Alert -->
    <UAlert
      v-if="menuError"
      icon="i-lucide-wifi-off"
      color="error"
      variant="soft"
      title="Menu belum bisa dimuat"
      :description="menuErrorMessage || 'Gagal memuat menu. Coba lagi.'"
      class="rounded-2xl"
    >
      <template #actions>
        <UButton
          color="error"
          variant="soft"
          icon="i-lucide-refresh-cw"
          label="Coba Lagi"
          @click="emit('retry')"
        />
      </template>
    </UAlert>

    <!-- Loading Skeletons -->
    <div v-else-if="loading" class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      <USkeleton
        v-for="n in 10"
        :key="n"
        class="aspect-square w-full rounded-2xl"
      />
    </div>

    <!-- Empty State -->
    <div v-else-if="products.length === 0" class="rounded-2xl border border-dashed border-stone-300 bg-stone-50/50 p-8 text-center">
      <UIcon name="i-lucide-utensils-crossed" class="mx-auto size-10 text-stone-400" />
      <p class="mt-3 text-sm font-semibold text-stone-550">Menu belum tersedia atau tidak ditemukan.</p>
    </div>

    <!-- Active Products List grouped by category -->
    <div v-else-if="shouldGroupByCategory" class="space-y-8">
      <section
        v-for="category in filteredCategoryGroups"
        :key="category.id"
        class="space-y-3"
      >
        <div class="flex items-center justify-between gap-3">
          <div>
            <h3 class="text-base font-extrabold text-stone-900">{{ category.name }}</h3>
            <p class="text-xs font-semibold text-stone-400">{{ category.menus.length }} menu</p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          <OrdersProductCard
            v-for="product in category.menus"
            :key="product.id"
            :product="product"
            :read-only="true"
            @open-detail="emit('open-detail', $event)"
          />
        </div>
      </section>
    </div>

    <!-- Active Products List not grouped -->
    <div
      v-else
      class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
    >
      <OrdersProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        :read-only="true"
        @open-detail="emit('open-detail', $event)"
      />
    </div>
  </section>
</template>
