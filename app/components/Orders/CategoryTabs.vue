<script setup lang="ts">
/**
 * CategoryTabs.vue
 * Pill-style horizontal-scroll category navigation.
 * Active: solid orange bg + white text.
 * Inactive: light gray bg + dark gray text.
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
  <div class="flex min-h-7 items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none flex-shrink-0 -mx-1 px-1">
    <button
      v-for="category in categories"
      :key="category.id"
      type="button"
      class="shrink-0 px-3 py-0.5 rounded-full font-semibold text-[11px] tracking-wide transition-all duration-200 cursor-pointer border"
      :class="[
        activeCategory === category.id
          ? 'bg-orange-600 border-orange-600 text-white shadow-sm shadow-orange-500/20'
          : 'bg-gray-50 border-gray-200/90 text-gray-600 hover:bg-gray-100/80 hover:text-gray-900 hover:border-gray-300'
      ]"
      @click="$emit('change', category.id)"
    >
      {{ category.name }}
    </button>
  </div>
</template>

<style scoped>
/* Hide scrollbars for a clean pill-row look */
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
