<template>
  <!-- Desktop: two separate floating pills -->
  <div
    class="hidden md:flex fixed z-50 items-center justify-between pointer-events-none nav-desktop-entry motion-nav-shell"
    :class="isScrolled ? 'top-7 left-11 right-11' : 'top-9 left-11 right-11'"
  >
    <NuxtLink
      class="motion-nav-glass motion-btn pointer-events-auto inline-flex items-center gap-2 no-underline
             px-3 py-2 rounded-md"
      :class="[desktopLogoGlass, isScrolled && 'motion-nav-glass--scrolled']"
      to="/"
      aria-label="Santap — Beranda"
    >
      <img src="~/assets/icons/brand.svg" alt="" class="h-[26px] w-[26px]" aria-hidden="true">
      <span
        class="text-[16px] font-bold tracking-tight transition-colors duration-[var(--motion-micro)]"
        :class="isOnDarkBg ? 'text-white' : 'text-[var(--color-text-primary)]'"
      >
        Santap
      </span>
    </NuxtLink>

    <div
      class="motion-nav-glass pointer-events-auto flex items-center gap-1 rounded-md px-1 py-1"
      :class="[desktopNavGlass, isScrolled && 'motion-nav-glass--scrolled']"
    >
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        active-class="nav-active"
        :exact="item.to === '/'"
        class="motion-btn text-[11px] font-bold no-underline px-4 py-2 rounded-md
               uppercase tracking-[0.06em]"
        :class="isOnDarkBg
          ? 'text-[#0F0C09]/55 hover:text-[#0F0C09] hover:bg-black/[0.07]'
          : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-black/[0.06]'"
      >
        {{ item.label }}
      </NuxtLink>

      <div class="w-px h-4 mx-1 flex-shrink-0 bg-black/10" />

      <NuxtLink
        to="https://play.google.com/store/apps/details?id=com.santap.pos"
        target="_blank"
        rel="noopener noreferrer"
        class="motion-btn inline-flex items-center justify-center px-6 py-2 rounded-md
               text-[11px] font-bold no-underline uppercase tracking-[0.06em]
               bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
      >
        Download Sekarang
      </NuxtLink>
    </div>
  </div>

  <!-- Mobile -->
  <div class="md:hidden fixed inset-0 z-50 pointer-events-none nav-mobile-entry">
    <div
      class="absolute inset-0 bg-[#1A1512] flex flex-col pt-[100px] pb-6 overflow-y-auto overflow-x-hidden
             transition-[transform,opacity] duration-[var(--motion-ui)] ease-[var(--ease-premium)]"
      :class="mobileOpen ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-full opacity-0 pointer-events-none'"
    >
      <div class="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.04]" aria-hidden="true">
        <svg class="absolute w-full h-full" viewBox="0 0 400 700" fill="none" preserveAspectRatio="xMidYMid slice">
          <circle cx="380" cy="80" r="200" stroke="white" stroke-width="0.7"/>
          <circle cx="40" cy="580" r="160" stroke="white" stroke-width="0.7"/>
        </svg>
      </div>

      <nav class="relative z-10 flex-1 flex flex-col items-center justify-center gap-4 min-h-max my-auto" aria-label="Navigasi mobile">
        <NuxtLink
          v-for="(item, i) in navItems"
          :key="item.to"
          :to="item.to"
          :style="{
            transitionDelay: mobileOpen ? `${120 + i * 45}ms` : '0ms',
            fontSize: 'clamp(32px, 9vw, 44px)',
            color: 'rgba(255, 255, 255, 0.7)',
          }"
          class="w-full text-center font-light no-underline py-2 tracking-[-0.01em]
                 transition-[opacity,transform,color] duration-[var(--motion-ui)] ease-[var(--ease-premium)]
                 hover:!text-white"
          :class="mobileOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'"
          @click="mobileOpen = false"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div
        class="relative z-10 pt-8 text-center transition-[opacity,transform] duration-[var(--motion-ui)] ease-[var(--ease-premium)]"
        :style="{ transitionDelay: mobileOpen ? '280ms' : '0ms' }"
        :class="mobileOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'"
      >
        <a
          href="mailto:halo@santap.id"
          class="text-[13px] font-medium !text-white opacity-60 hover:opacity-100
                 transition-opacity duration-[var(--motion-micro)] no-underline
                 underline underline-offset-4 decoration-white/30"
        >
          halo@santap.id
        </a>
      </div>
    </div>

    <div
      class="motion-nav-glass absolute top-4 left-4 right-4 sm:top-5 sm:left-5 sm:right-5 z-20
             flex items-center justify-between px-2 py-2 rounded-md pointer-events-auto"
      :class="mobileNavClass"
    >
      <NuxtLink class="inline-flex items-center gap-2 no-underline px-2" to="/" @click="mobileOpen && (mobileOpen = false)">
        <img src="~/assets/icons/brand.svg" alt="" class="h-[26px] w-[26px]" aria-hidden="true">
        <span
          class="text-[16px] font-bold tracking-tight transition-colors duration-[var(--motion-micro)]"
          :class="mobileLogoColor"
        >
          Santap
        </span>
      </NuxtLink>

      <button
        class="motion-btn flex items-center justify-center w-10 h-10 rounded-md cursor-pointer"
        :class="mobileButtonClass"
        :aria-expanded="mobileOpen"
        :aria-label="mobileOpen ? 'Tutup menu' : 'Buka menu navigasi'"
        @click="toggleMobile"
      >
        <template v-if="!mobileOpen">
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true">
            <path d="M0 1h16M0 6h16M0 11h16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </template>
        <template v-else>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
            <path d="M1 1l11 11M12 1L1 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </template>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const { y: scrollY } = useWindowScroll()
const route = useRoute()

const isScrolled = computed(() => scrollY.value > 20)
const isHeroPage = computed(() => route.path === '/')
const isOnDarkBg = computed(() => isHeroPage.value && !isScrolled.value)

const desktopLogoGlass = computed(() => {
  if (!isScrolled.value) {
    return 'bg-transparent border border-transparent'
  }
  return 'bg-white/90 border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.06)]'
})

const desktopNavGlass = computed(() => {
  if (isOnDarkBg.value) {
    return 'bg-white/95 border border-white/15 shadow-[0_4px_20px_rgba(0,0,0,0.08)]'
  }
  return 'bg-white/90 border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.06)]'
})

const mobileOpen = ref(false)
const isMobileScrolled = computed(() => scrollY.value > 300)

const mobileNavClass = computed(() => {
  if (mobileOpen.value) {
    return 'bg-white/10 border border-white/15 shadow-lg motion-nav-glass--scrolled'
  }
  if (isMobileScrolled.value) {
    return 'bg-[#F4EDE4] border border-transparent shadow-md motion-nav-glass--scrolled'
  }
  return 'bg-transparent border border-transparent shadow-none'
})

const mobileLogoColor = computed(() => {
  if (mobileOpen.value) {
    return '!text-white'
  }
  if (!isMobileScrolled.value && isHeroPage.value) {
    return '!text-white'
  }
  return '!text-[#1A1512]'
})

const mobileButtonClass = computed(() => {
  if (mobileOpen.value) {
    return 'bg-transparent text-white hover:bg-white/10 border border-transparent'
  }
  if (!isMobileScrolled.value && isHeroPage.value) {
    return 'bg-white/10 text-white hover:bg-white/20 border border-white/10 shadow-none'
  }
  return 'bg-[#1A1512] text-white hover:bg-[#2a2420] shadow-sm border border-transparent'
})

function toggleMobile() {
  mobileOpen.value = !mobileOpen.value
}

watch(() => route.path, () => { mobileOpen.value = false })

const navItems = [
  { to: '/company', label: 'Mitra' },
  { to: '/features', label: 'Fitur' },
  { to: '/pricing', label: 'Harga' },
  { to: '/contact', label: 'Kontak' },
]
</script>

<style scoped>
.nav-active {
  background-color: rgba(15, 12, 9, 0.10) !important;
  color: #0f0c09 !important;
  font-weight: 800;
  box-shadow: inset 0 0 0 1px rgba(15, 12, 9, 0.08);
}

.motion-nav-shell {
  transition:
    top var(--motion-ui) var(--ease-premium),
    left var(--motion-ui) var(--ease-premium),
    right var(--motion-ui) var(--ease-premium);
}

.nav-desktop-entry {
  animation: nav-enter var(--motion-ui) var(--ease-premium) 0.1s both;
}

.nav-mobile-entry > .motion-nav-glass {
  animation: nav-enter var(--motion-ui) var(--ease-premium) 0.08s both;
}

@keyframes nav-enter {
  from {
    opacity: 0;
    transform: translate3d(0, -10px, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .nav-desktop-entry,
  .nav-mobile-entry > .motion-nav-glass {
    animation: none;
  }
}
</style>
