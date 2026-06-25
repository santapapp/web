<script setup lang="ts">
defineProps<{
  title: string
  description: string
  icon?: string
}>()
</script>

<template>
  <div class="rounded-lg border border-red-200 bg-red-50 p-5 text-center">
    <UIcon :name="icon || 'i-lucide-alert-circle'" class="mx-auto size-10 text-red-500" />
    <div class="mt-4 text-base font-bold text-red-950">{{ title }}</div>
    <p class="mt-2 text-sm leading-6 text-red-700">{{ description }}</p>
    <slot />
  </div>
</template>
