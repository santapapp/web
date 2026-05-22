<template>
  <section class="content-card stack">
    <span v-if="label" class="badge">{{ label }}</span>
    <h2>{{ title }}</h2>
    <p>{{ description }}</p>
    <slot />
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description: string
  label?: string
}>()
</script>
