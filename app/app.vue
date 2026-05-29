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
} as const
</script>

<style>
/* Page transition — opacity + subtle vertical shift (Santap motion) */
.page-enter-active {
  transition:
    opacity var(--motion-ui) var(--ease-premium),
    transform var(--motion-ui) var(--ease-premium);
}
.page-leave-active {
  transition:
    opacity var(--motion-micro) var(--ease-premium),
    transform var(--motion-micro) var(--ease-premium);
}
.page-enter-from {
  opacity: 0;
  transform: translate3d(0, var(--motion-y-sm), 0);
}
.page-leave-to {
  opacity: 0;
  transform: translate3d(0, calc(var(--motion-y-sm) * -0.5), 0);
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
