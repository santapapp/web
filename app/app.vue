<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage :transition="pageTransition" />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
const pageTransition = {
  name: 'page',
  mode: 'out-in',
}
</script>

<style>
/* ── Page transition — smooth fade + subtle y lift ────────── */
.page-enter-active {
  transition: opacity 0.32s ease, transform 0.32s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.page-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (prefers-reduced-motion: reduce) {
  .page-enter-active,
  .page-leave-active {
    transition: opacity 0.18s ease;
  }
  .page-enter-from,
  .page-leave-to {
    transform: none;
  }
}
</style>
