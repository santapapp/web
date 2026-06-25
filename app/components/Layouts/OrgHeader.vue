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

import { useCustomerMenu } from '~/composables/useCustomerMenu'

defineProps<{
  maxWidthClass?: string
}>()

const overlay = useUiOverlayStore()
const session = useCustomerSession()
const { searchQuery } = useCustomerMenu()

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
    <div
      class="w-full mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between gap-3"
      :class="maxWidthClass || 'max-w-[1280px]'"
    >

      <!-- Left: Hamburger → Session Drawer -->
      <button
        class="size-10 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100 active:scale-95 transition-all duration-150 cursor-pointer flex-shrink-0"
        aria-label="Buka menu sesi"
        @click="overlay.open('session')"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="8" x2="21" y2="8" />
          <line x1="3" y1="16" x2="21" y2="16" />
        </svg>
      </button>

      <!-- Right Side -->
      <template v-if="overlay.isSearchSticky">
        <!-- Search Input Open -->
        <div v-if="overlay.showNavbarSearchInput" class="flex items-center gap-2 flex-1 max-w-[240px] sm:max-w-[320px] transition-all duration-300">
          <div class="relative w-full">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari menu..."
              class="w-full h-9 pl-9 pr-8 rounded-full border border-stone-200 bg-stone-50 focus:bg-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-xs font-semibold text-stone-855 outline-none transition-all"
              autofocus
            />
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
              <UIcon name="i-lucide-search" class="size-3.5" />
            </span>
            <button
              v-if="searchQuery"
              type="button"
              class="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-405 hover:text-stone-600 size-5 flex items-center justify-center rounded-full hover:bg-stone-200 active:scale-95 transition-all"
              @click="searchQuery = ''"
            >
              <UIcon name="i-lucide-x" class="size-3" />
            </button>
          </div>
          <button
            type="button"
            class="text-xs font-bold text-stone-500 hover:text-stone-800 px-1 py-1 transition-all cursor-pointer shrink-0"
            @click="overlay.showNavbarSearchInput = false; searchQuery = ''"
          >
            Batal
          </button>
        </div>

        <!-- Search Icon Closed -->
        <button
          v-else
          type="button"
          class="size-10 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100 active:scale-90 transition-all duration-150 cursor-pointer"
          aria-label="Cari menu"
          @click="overlay.showNavbarSearchInput = true"
        >
          <UIcon name="i-lucide-search" class="size-5" />
        </button>
      </template>

      <!-- Standard view: Active Session Badge -->
      <OrdersSessionBanner v-else />

    </div>
  </header>
</template>
