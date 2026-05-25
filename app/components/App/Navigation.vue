<template>
  <!--
    Mobile: single integrated card (brand + hamburger in one bar)
    Desktop: logo pill left + nav+CTA pill right (separate floating elements)
  -->

  <!-- ── DESKTOP: two separate floating pills ──────────────────── -->
  <!-- Inset further to remain perfectly inside the hero section margins -->
  <div class="hidden md:flex fixed top-9 left-11 right-11 z-50 items-center justify-between pointer-events-none nav-desktop-entry">

    <!-- Logo pill (left) -->
    <NuxtLink
      class="pointer-events-auto inline-flex items-center gap-2 no-underline
             px-3 py-2 rounded-md transition-all duration-250 ease-out"
      :class="desktopLogoGlass"
      to="/"
      aria-label="Santap — Beranda"
    >
      <img src="~/assets/icons/brand.svg" alt="" class="h-[26px] w-[26px]" aria-hidden="true">
      <span
        class="text-[16px] font-bold tracking-tight transition-colors duration-200"
        :class="isOnDarkBg ? 'text-white' : 'text-[var(--color-text-primary)]'"
      >
        Santap
      </span>
    </NuxtLink>

    <!-- Right pill: nav links + CTA -->
    <div
      class="pointer-events-auto flex items-center gap-1 rounded-md px-1 py-1
             transition-all duration-250 ease-out"
      :class="desktopNavGlass"
    >
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        active-class="nav-active"
        :exact="item.to === '/'"
        class="text-[11px] font-bold no-underline px-4 py-2 rounded-md
               uppercase tracking-[0.06em] transition-all duration-150"
        :class="isOnDarkBg
          ? 'text-[#0F0C09]/55 hover:text-[#0F0C09] hover:bg-black/[0.07]'
          : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-black/[0.06]'"
      >
        {{ item.label }}
      </NuxtLink>

      <div class="w-px h-4 mx-1 flex-shrink-0 bg-black/10" />

      <NuxtLink
        to="/#"
        class="inline-flex items-center justify-center px-6 py-2 rounded-md
               text-[11px] font-bold no-underline uppercase tracking-[0.06em]
               transition-all duration-150 hover:-translate-y-px
               bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
      >
        Download Sekarang
      </NuxtLink>
    </div>
  </div>

  <!-- ── MOBILE: single integrated bar ─────────────────────────── -->
  <!-- Full screen container -->
  <div
    class="md:hidden fixed inset-0 z-50 pointer-events-none nav-mobile-entry"
  >
    <!-- Dropdown Menu Background -->
    <div
      class="absolute inset-0 bg-[#1A1512] flex flex-col pt-[100px] pb-6 overflow-y-auto overflow-x-hidden transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
      :class="mobileOpen ? 'translate-y-0 pointer-events-auto' : '-translate-y-full pointer-events-none'"
    >
      <!-- ── Decorative background — varied shapes ────────── -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <svg class="absolute w-full h-full opacity-[0.04]" viewBox="0 0 400 700" fill="none" preserveAspectRatio="xMidYMid slice">
          <!-- Large offset circle top-right -->
          <circle cx="380" cy="80" r="200" stroke="white" stroke-width="0.7"/>
          <!-- Medium circle bottom-left -->
          <circle cx="40" cy="580" r="160" stroke="white" stroke-width="0.7"/>
          <!-- Diagonal slash lines -->
          <line x1="0" y1="120" x2="400" y2="380" stroke="white" stroke-width="0.5"/>
          <line x1="0" y1="180" x2="400" y2="440" stroke="white" stroke-width="0.3"/>
          <!-- Dot grid cluster top-left -->
          <circle cx="20" cy="20" r="1.5" fill="white" opacity="0.6"/>
          <circle cx="40" cy="20" r="1.5" fill="white" opacity="0.6"/>
          <circle cx="60" cy="20" r="1.5" fill="white" opacity="0.6"/>
          <circle cx="20" cy="40" r="1.5" fill="white" opacity="0.6"/>
          <circle cx="40" cy="40" r="1.5" fill="white" opacity="0.6"/>
          <circle cx="60" cy="40" r="1.5" fill="white" opacity="0.6"/>
          <circle cx="20" cy="60" r="1.5" fill="white" opacity="0.6"/>
          <circle cx="40" cy="60" r="1.5" fill="white" opacity="0.6"/>
          <circle cx="60" cy="60" r="1.5" fill="white" opacity="0.6"/>
          <!-- Dot grid cluster bottom-right -->
          <circle cx="320" cy="620" r="1.5" fill="white" opacity="0.4"/>
          <circle cx="340" cy="620" r="1.5" fill="white" opacity="0.4"/>
          <circle cx="360" cy="620" r="1.5" fill="white" opacity="0.4"/>
          <circle cx="380" cy="620" r="1.5" fill="white" opacity="0.4"/>
          <circle cx="320" cy="640" r="1.5" fill="white" opacity="0.4"/>
          <circle cx="340" cy="640" r="1.5" fill="white" opacity="0.4"/>
          <circle cx="360" cy="640" r="1.5" fill="white" opacity="0.4"/>
          <circle cx="380" cy="640" r="1.5" fill="white" opacity="0.4"/>
          <circle cx="320" cy="660" r="1.5" fill="white" opacity="0.4"/>
          <circle cx="340" cy="660" r="1.5" fill="white" opacity="0.4"/>
          <circle cx="360" cy="660" r="1.5" fill="white" opacity="0.4"/>
          <circle cx="380" cy="660" r="1.5" fill="white" opacity="0.4"/>
          <!-- Small accent rectangle outline -->
          <rect x="280" y="160" width="60" height="40" rx="4" stroke="white" stroke-width="0.5" opacity="0.5"/>
          <!-- Tiny floating cross -->
          <line x1="200" y1="490" x2="200" y2="510" stroke="white" stroke-width="0.8" opacity="0.4"/>
          <line x1="190" y1="500" x2="210" y2="500" stroke="white" stroke-width="0.8" opacity="0.4"/>
          <!-- Arc segment bottom center -->
          <path d="M 100 700 A 160 160 0 0 1 300 700" stroke="white" stroke-width="0.6" opacity="0.5"/>
        </svg>
      </div>

      <!-- Nav links — centered vertically & horizontally -->
      <nav
        class="relative z-10 flex-1 flex flex-col items-center justify-center gap-4 min-h-max my-auto"
        aria-label="Navigasi mobile"
      >
        <NuxtLink
          v-for="(item, i) in navItems"
          :key="item.to"
          :to="item.to"
          :style="{ 
            transitionDelay: mobileOpen ? `${150 + i * 55}ms` : '0ms',
            fontSize: 'clamp(32px, 9vw, 44px)',
            color: 'rgba(255, 255, 255, 0.7)'
          }"
          class="w-full text-center font-light no-underline py-2 tracking-[-0.01em] transition-all duration-300 hover:!text-white hover:scale-110"
          :class="mobileOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
          @click="mobileOpen = false"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <!-- Bottom: email -->
      <div 
        class="relative z-10 pt-8 text-center transition-all duration-500"
        :style="{ transitionDelay: mobileOpen ? '350ms' : '0ms' }"
        :class="mobileOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
      >
        <a
          href="mailto:halo@santap.id"
          class="text-[13px] font-medium !text-white opacity-60 hover:opacity-100
                 transition-opacity duration-150 no-underline
                 underline underline-offset-4 decoration-white/30"
          style="color: white;"
        >
          halo@santap.id
        </a>
      </div>
    </div>

    <!-- Top bar — always visible pill -->
    <div
      class="absolute top-4 left-4 right-4 sm:top-5 sm:left-5 sm:right-5 z-20 flex items-center justify-between px-2 py-2 rounded-md pointer-events-auto transition-all duration-300"
      :class="mobileOpen
        ? 'bg-white/10 backdrop-blur-md border border-white/20 shadow-lg'
        : 'bg-[#F4EDE4] shadow-md'"
    >
      <!-- Brand -->
      <NuxtLink
        class="inline-flex items-center gap-2 no-underline px-2"
        to="/"
        @click="mobileOpen && (mobileOpen = false)"
      >
        <img src="~/assets/icons/brand.svg" alt="" class="h-[26px] w-[26px]" aria-hidden="true">
        <span
          class="text-[16px] font-bold tracking-tight transition-colors duration-200"
          :class="mobileOpen ? '!text-white' : '!text-[#1A1512]'"
        >
          Santap
        </span>
      </NuxtLink>

      <!-- Hamburger / X button -->
      <button
        class="flex items-center justify-center w-10 h-10 rounded-md
               border-none cursor-pointer transition-all duration-200
               active:scale-95"
        :class="mobileOpen
          ? 'bg-transparent text-white hover:bg-white/10'
          : 'bg-[#1A1512] text-white hover:bg-[#2a2420] shadow-sm'"
        :aria-expanded="mobileOpen"
        :aria-label="mobileOpen ? 'Tutup menu' : 'Buka menu navigasi'"
        id="nav-hamburger-btn"
        @click="toggleMobile"
      >
        <template v-if="!mobileOpen">
          <!-- Hamburger icon (≡) -->
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true">
            <path d="M0 1h16M0 6h16M0 11h16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </template>
        <template v-else>
          <!-- Close X icon -->
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

// Desktop glass pill style
const desktopLogoGlass = computed(() => {
  if (!isScrolled.value) {
    return 'bg-transparent border border-transparent'
  }
  return 'bg-white/88 backdrop-blur-xl border border-black/[0.07] shadow-[0_2px_16px_rgba(0,0,0,0.07)]'
})

const desktopNavGlass = computed(() => {
  if (isOnDarkBg.value) {
    return 'bg-white/95 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.12)]'
  }
  return 'bg-white/88 backdrop-blur-xl border border-black/[0.07] shadow-[0_2px_16px_rgba(0,0,0,0.07)]'
})

const mobileOpen = ref(false)

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
/* Active state — strong dark pill so it's clearly distinguishable from hover */
.nav-active {
  background-color: rgba(15, 12, 9, 0.10) !important;
  color: #0F0C09 !important;
  font-weight: 800;
  box-shadow: inset 0 0 0 1px rgba(15, 12, 9, 0.08);
}

/* ── Nav entry animations ───────────────────────────────── */
.nav-desktop-entry {
  animation: nav-slide-down 0.65s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both;
}

.nav-mobile-entry > .absolute {
  /* Targets the top bar pill */
  animation: nav-fade-in 0.5s ease 0.1s both;
}

@keyframes nav-slide-down {
  from {
    opacity: 0;
    transform: translateY(-24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes nav-fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .nav-desktop-entry,
  .nav-mobile-entry > .absolute {
    animation: none;
  }
}
</style>
