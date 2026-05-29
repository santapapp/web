<script setup lang="ts">
/**
 * CategoryTabs.vue
 * Elegant category navigation tab bar with smooth scroll,
 * styled to match the warm amber brand theme.
 */

import type { CustomerMenuCategoryGroup } from '~/types/customer-menu'

defineProps<{
  categories: CustomerMenuCategoryGroup[]
  activeCategory: string
}>()

defineEmits<{
  change: [id: string]
}>()
</script>

<template>
  <div class="flex min-h-11 items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none flex-shrink-0">
    <button
      v-for="category in categories"
      :key="category.id"
      type="button"
      class="shrink-0 px-4 py-2 rounded-full font-bold text-xs sm:text-sm tracking-wide transition-all duration-200 cursor-pointer shadow-sm"
      :class="[
        activeCategory === category.id
          ? 'bg-amber-700 text-white shadow-sm scale-[1.01]'
          : 'bg-white text-stone-700 border border-stone-200/80 hover:border-amber-300 hover:bg-amber-50/50 hover:text-amber-800'
      ]"
      @click="$emit('change', category.id)"
    >
      {{ category.name }}
      <span 
        class="ml-1 text-[10px] font-black"
        :class="activeCategory === category.id ? 'text-amber-200' : 'text-stone-400'"
      >
        {{ category.menus.length }}
      </span>
    </button>
  </div>
</template>

<style scoped>
/* Hide scrollbars for a clean floating look */
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
