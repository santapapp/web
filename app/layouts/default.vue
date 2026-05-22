<template>
  <div class="app-shell">
    <AppNavigation />
    <!-- pt-[76px] compensates for the fixed floating nav (nav height 52px + top offset 4*4=16px + buffer 8px) -->
    <main class="app-main">
      <slot />
    </main>
    <LandingFooterCta />
  </div>
</template>
