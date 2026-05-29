<script setup lang="ts">
/**
 * EmptyState.vue
 * Beautiful empty state display with warm theme accentuation.
 */

defineProps<{
  title: string
  description: string
  icon?: string
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-stone-50/40 px-6 py-12 text-center shadow-sm">
    <!-- Icon accent container -->
    <div class="size-12 rounded-2xl bg-amber-50 border border-amber-100/50 flex items-center justify-center text-amber-700 shrink-0 mb-4 shadow-sm">
      <UIcon :name="icon || 'i-lucide-inbox'" class="size-5.5" />
    </div>
    <h3 class="text-base font-extrabold text-stone-900 leading-snug">{{ title }}</h3>
    <p class="mt-2 max-w-sm text-xs sm:text-sm leading-relaxed text-stone-500 font-semibold">{{ description }}</p>
    <slot />
  </div>
</template>
