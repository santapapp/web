<template>
  <!--
    Mobile: single integrated card (brand + hamburger in one bar)
    Desktop: logo pill left + nav+CTA pill right (separate floating elements)
  -->

  <!-- ── DESKTOP: two separate floating pills ─────────────── -->
  <div class="hidden md:flex fixed top-3 left-3 right-3 z-50 items-center justify-between pointer-events-none">

    <!-- Logo pill (left) -->
    <NuxtLink
      class="pointer-events-auto inline-flex items-center gap-2 no-underline
             px-3 py-2 rounded-sm transition-all duration-250 ease-out"
      :class="desktopGlass"
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
      class="pointer-events-auto flex items-center gap-0.5 rounded-sm px-1.5 py-1.5
             transition-all duration-250 ease-out"
      :class="desktopGlass"
    >
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        active-class="nav-active"
        :exact="item.to === '/'"
        class="text-[12px] font-semibold no-underline px-3.5 py-1.5 rounded-sm
               uppercase tracking-[0.06em] transition-all duration-150"
        :class="isOnDarkBg
          ? 'text-white/70 hover:text-white hover:bg-white/[0.10]'
          : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-black/[0.05]'"
      >
        {{ item.label }}
      </NuxtLink>

      <div class="w-px h-4 mx-1 flex-shrink-0" :class="isOnDarkBg ? 'bg-white/15' : 'bg-black/10'" />

      <NuxtLink
        to="/register"
        class="inline-flex items-center justify-center px-5 py-2 rounded-sm
               text-[12px] font-bold no-underline uppercase tracking-[0.06em]
               transition-all duration-150 hover:-translate-y-px"
        :class="isOnDarkBg
          ? 'bg-white text-[#0F0C09] hover:bg-white/90'
          : 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]'"
      >
        Coba Gratis
      </NuxtLink>
    </div>
  </div>

  <!-- ── MOBILE: single integrated bar ─────────────────────── -->
  <!--
    Closed: compact card (warm cream bg) with brand + hamburger.
    References IntegratedBio mobile: one card, light warm background,
    dark square hamburger button on the right.
  -->
  <div
    class="md:hidden fixed top-3 left-3 right-3 z-50 rounded-2xl overflow-hidden
           transition-none"
    :class="mobileOpen ? 'bottom-3' : ''"
  >
    <!-- Top bar — always visible -->
    <div
      class="flex items-center justify-between px-4 transition-colors duration-300"
      :class="mobileOpen
        ? 'bg-[#1A1512] py-3'
        : 'bg-[#F4EDE4] py-3'"
    >
      <!-- Brand -->
      <NuxtLink
        class="inline-flex items-center gap-2 no-underline"
        to="/"
        @click="mobileOpen && (mobileOpen = false)"
      >
        <img src="~/assets/icons/brand.svg" alt="" class="h-[26px] w-[26px]" aria-hidden="true">
        <span
          class="text-[16px] font-bold tracking-tight transition-colors duration-200"
          :class="mobileOpen ? 'text-white' : 'text-[#1A1512]'"
        >
          Santap
        </span>
      </NuxtLink>

      <!-- Hamburger / X button -->
      <button
        class="flex items-center justify-center w-10 h-10 rounded-xl
               border-none cursor-pointer transition-all duration-200
               active:scale-95"
        :class="mobileOpen
          ? 'bg-transparent border border-white/25 text-white hover:bg-white/[0.06]'
          : 'bg-[#1A1512] text-white hover:bg-[#2a2420]'"
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

    <!-- Expanded menu content (only when open) -->
    <Transition name="menu-expand">
      <div
        v-if="mobileOpen"
        class="bg-[#1A1512] flex flex-col"
        style="height: calc(100% - 60px)"
      >
        <!-- Organic blob pattern (like IntegratedBio) -->
        <div class="absolute inset-0 pointer-events-none overflow-hidden top-[60px]" aria-hidden="true">
          <svg class="w-full h-full opacity-[0.035]" viewBox="0 0 400 550" fill="none" preserveAspectRatio="xMidYMid slice">
            <circle cx="340" cy="60" r="220" stroke="white" stroke-width="0.8"/>
            <circle cx="60" cy="260" r="200" stroke="white" stroke-width="0.8"/>
            <circle cx="260" cy="460" r="180" stroke="white" stroke-width="0.8"/>
            <circle cx="180" cy="180" r="260" stroke="white" stroke-width="0.5"/>
          </svg>
        </div>

        <!-- Nav links — centered vertically & horizontally -->
        <nav
          class="relative z-10 flex-1 flex flex-col items-center justify-center gap-1"
          aria-label="Navigasi mobile"
        >
          <NuxtLink
            v-for="(item, i) in navItems"
            :key="item.to"
            :to="item.to"
            :style="{ animationDelay: `${i * 55}ms` }"
            class="mobile-link w-full text-center
                   text-[clamp(32px,9vw,44px)] font-light text-white/60 no-underline
                   py-2.5 tracking-[-0.01em]
                   transition-colors duration-150 hover:text-white"
            @click="mobileOpen = false"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <!-- Bottom: email -->
        <div class="relative z-10 pb-8 text-center">
          <a
            href="mailto:halo@santap.id"
            class="text-[13px] text-white/40 hover:text-white/70
                   transition-colors duration-150 no-underline
                   underline underline-offset-4 decoration-white/20"
          >
            halo@santap.id
          </a>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const { y: scrollY } = useWindowScroll()
const route = useRoute()

const isScrolled = computed(() => scrollY.value > 20)
const isHeroPage = computed(() => route.path === '/')
const isOnDarkBg = computed(() => isHeroPage.value && !isScrolled.value)

// Desktop glass pill style
const desktopGlass = computed(() => {
  if (isOnDarkBg.value) {
    return 'bg-black/30 backdrop-blur-lg border border-white/[0.12] shadow-[0_2px_16px_rgba(0,0,0,0.2)]'
  }
  return 'bg-white/88 backdrop-blur-xl border border-black/[0.07] shadow-[0_2px_16px_rgba(0,0,0,0.07)]'
})

const mobileOpen = ref(false)

function toggleMobile() {
  mobileOpen.value = !mobileOpen.value
}

watch(() => route.path, () => { mobileOpen.value = false })

watch(mobileOpen, (val) => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = val ? 'hidden' : ''
  }
})

const navItems = [
  { to: '/', label: 'Beranda' },
  { to: '/features', label: 'Fitur' },
  { to: '/pricing', label: 'Harga' },
  { to: '/contact', label: 'Kontak' },
]
</script>

<style scoped>
.nav-active {
  color: white;
  font-weight: 700;
}

/* Mobile nav link staggered entrance */
.mobile-link {
  animation: linkIn 0.38s cubic-bezier(0.16, 1, 0.3, 1) both;
}

/* Expand transition */
.menu-expand-enter-active {
  transition: opacity 0.22s ease, transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}
.menu-expand-leave-active {
  transition: opacity 0.15s ease, transform 0.18s ease;
}
.menu-expand-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}
.menu-expand-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@keyframes linkIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
