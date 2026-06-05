<script setup lang="ts">
/**
 * OrgHeader — Header utama halaman order
 *
 * Kiri: hamburger → buka SessionDrawer (drawer kiri "Menu Sesi")
 * Tengah: nama restoran (OrgIdentityMenu dropdown)
 * Kanan: badge meja — menampilkan nomor meja aktif atau status "Belum ada meja"
 */

import { useRoute } from '#imports'

defineEmits<{
  openDrawer: []
  openOrders: []
}>()

const route = useRoute()
const orgSlug = computed(() => String(route.params.orgSlug || ''))

const session = useCustomerSession()

// Label meja / bill yang sedang aktif
const tableBadgeLabel = computed(() => {
  if (session.sessionMode.value === 'table' && session.sessionLabel.value) {
    return `Meja ${session.sessionLabel.value}`
  }
  if (session.sessionMode.value === 'open_bill' && session.sessionLabel.value) {
    return `Bill ${session.sessionLabel.value}`
  }
  return null
})

const hasActiveSession = computed(() => session.hasSession.value)
</script>

<template>
  <header class="sticky top-0 left-0 right-0 z-40 bg-white/97 backdrop-blur-md border-b border-gray-100 h-14 lg:h-16 flex items-center">
    <div class="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between gap-3">

      <!-- Left: Hamburger → Session Drawer -->
      <button
        class="size-10 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100 active:scale-90 transition-all duration-150 cursor-pointer flex-shrink-0"
        aria-label="Buka menu sesi"
        @click="$emit('openDrawer')"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="8" x2="21" y2="8" />
          <line x1="3" y1="16" x2="21" y2="16" />
        </svg>
      </button>

      <!-- Center: OrgIdentityMenu Dropdown -->
      <div class="flex-1 flex items-center justify-center min-w-0">
        <LayoutsOrgIdentityMenu @open-orders="$emit('openOrders')" />
      </div>

      <!-- Right: Table Badge -->
      <div class="flex-shrink-0">
        <!-- Active session: show meja/bill badge -->
        <button
          v-if="hasActiveSession && tableBadgeLabel"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-orange-200 bg-orange-50 text-orange-700 text-xs font-bold hover:bg-orange-100 active:scale-95 transition-all duration-150 cursor-pointer max-w-[120px]"
          aria-label="Info sesi aktif"
          @click="$emit('openDrawer')"
        >
          <!-- Table icon -->
          <svg class="size-3.5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M3 14h18M5 10V6a1 1 0 011-1h12a1 1 0 011 1v4" />
          </svg>
          <span class="truncate">{{ tableBadgeLabel }}</span>
        </button>

        <!-- No session: ghost placeholder badge -->
        <div
          v-else
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-dashed border-gray-200 bg-transparent text-gray-400 text-xs font-medium select-none"
          aria-label="Belum ada meja"
        >
          <svg class="size-3.5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M3 14h18M5 10V6a1 1 0 011-1h12a1 1 0 011 1v4" />
          </svg>
          <span>Belum ada meja</span>
        </div>
      </div>

    </div>
  </header>
</template>
