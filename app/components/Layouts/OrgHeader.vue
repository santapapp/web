<script setup lang="ts">
/**
 * OrgHeader — Header utama halaman order/landing
 *
 * Minimal & bersih:
 * - Kiri: hamburger → buka Menu Sesi (slideover kiri, berisi identitas org + sesi)
 *
 * Tombol kanan (badge meja & ikon pesanan saya) dihapus.
 * Navigasi ke "Pesanan Saya" tersedia dari dalam SessionDrawer.
 * State overlay dikoordinasi via useUiOverlayStore.
 */

const overlay = useUiOverlayStore()
const session = useCustomerSession()

const isGreen = computed(() =>
  session.sessionMode.value === 'open_bill' && overlay.openBillHeaderPassed
)
</script>

<template>
  <header
    class="sticky top-0 left-0 right-0 z-40 backdrop-blur-md h-14 lg:h-16 flex items-center transition-all duration-300"
    :class="isGreen
      ? 'bg-emerald-50/95 border-b border-emerald-100'
      : 'bg-white/97 border-b border-gray-100'"
  >
    <div class="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between gap-3">

      <!-- Left: Hamburger → Session Drawer -->
      <button
        class="size-10 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100 active:scale-90 transition-all duration-150 cursor-pointer flex-shrink-0"
        aria-label="Buka menu sesi"
        @click="overlay.open('session')"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="8" x2="21" y2="8" />
          <line x1="3" y1="16" x2="21" y2="16" />
        </svg>
      </button>

      <!-- Right: Active Session Badge -->
      <OrdersSessionBanner />

    </div>
  </header>
</template>
