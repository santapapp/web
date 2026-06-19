<script setup lang="ts">
/**
 * WelcomeModal.vue
 * Full-screen welcome splash screen shown after a session is successfully validated.
 * Refined to match the rustic orange gradient, watermark, and clean typography of the mockup.
 */

import { computed } from 'vue'

const props = defineProps<{
  open: boolean
  orgName: string
  orgLogo?: string | null
  tableName?: string | null
  sessionType?: 'open_bill' | 'table_order'
}>()

const emit = defineEmits<{
  'confirm': []
}>()

const initials = computed(() => {
  if (!props.orgName) return 'S'
  return props.orgName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
})
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-300 ease-out"
    leave-active-class="transition-opacity duration-200 ease-in"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div
      v-if="open"
      class="customer-ordering-layout fixed inset-0 z-[100] flex items-center justify-center bg-stone-950/40 backdrop-blur-xs p-0 md:p-6 select-none font-sans"
    >
      <!-- Modal Box -->
      <div class="relative w-full h-full md:max-h-[812px] md:h-full max-w-md flex flex-col bg-white overflow-hidden md:rounded-3xl md:shadow-2xl md:border md:border-stone-200/50">
        <!-- Background SVG Curve -->
        <div class="absolute inset-0 pointer-events-none">
          <svg
            viewBox="0 0 375 812"
            fill="none"
            preserveAspectRatio="none"
            class="absolute inset-0 w-full h-[52%] sm:h-[55%]"
          >
            <path
              d="M 0 0 L 375 0 L 375 440 C 280 430 100 380 0 220 Z"
              fill="url(#rust-orange-welcome-grad)"
            />
            <defs>
              <linearGradient id="rust-orange-welcome-grad" x1="0" y1="0" x2="0" y2="440" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#ea580c" />
                <stop offset="100%" stop-color="#f97316" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <!-- Watermark -->
        <div class="absolute top-[8%] right-[8%] opacity-[0.06] text-white pointer-events-none select-none">
          <UIcon name="i-lucide-utensils" class="size-24 sm:size-28" />
        </div>

        <!-- Main Flex Container -->
        <div class="relative flex-1 flex flex-col justify-between px-6 pt-14 pb-8 z-10">

          <!-- Brand & Welcome Section -->
          <div class="flex-1 flex flex-col items-center justify-center text-center gap-0">

            <!-- Logo -->
            <div class="size-20 rounded-2xl bg-white border border-white/20 flex items-center justify-center shadow-xl mb-4 overflow-hidden transform hover:scale-105 transition-transform duration-300 shrink-0">
              <img
                v-if="orgLogo"
                :src="orgLogo"
                :alt="orgName"
                class="w-full h-full object-cover"
              />
              <span v-else class="text-2xl font-black text-orange-600">{{ initials }}</span>
            </div>

            <!-- Org Name -->
            <h1 class="text-2xl font-black text-white tracking-wide mb-1 drop-shadow-xs leading-tight">
              {{ orgName.toUpperCase() }}
            </h1>

            <!-- Tagline -->
            <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-white/75 mb-10">
              PESAN, SANTAP, BAHAGIA
            </p>

            <!-- Table/Bill Badge -->
            <div
              v-if="tableName"
              class="mb-5 px-4 py-2 rounded-full bg-[#FFEAE2] text-[#7C2D12] font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <UIcon name="i-lucide-armchair" class="size-3.5" />
              <span>{{ tableName.toLowerCase().includes('meja') ? tableName : 'Meja ' + tableName }}</span>
            </div>
            <div
              v-else-if="sessionType === 'open_bill'"
              class="mb-5 px-4 py-2 rounded-full bg-[#FFEAE2] text-[#7C2D12] font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <UIcon name="i-lucide-receipt-text" class="size-3.5" />
              <span>Sesi Open Bill Aktif</span>
            </div>

            <!-- Welcome Heading -->
            <h2 class="text-xl font-bold text-stone-900 mb-2 leading-snug">
              Selamat Datang!
            </h2>

            <!-- Description -->
            <div class="max-w-[260px] text-sm leading-relaxed text-stone-500 font-normal space-y-1.5">
              <p>
                <template v-if="tableName">
                  Kamu duduk di <strong class="text-[#9A3412] font-semibold">{{ tableName.toLowerCase().includes('meja') ? tableName : 'Meja ' + tableName }}</strong>.
                </template>
                <template v-else-if="sessionType === 'open_bill'">
                  Sesi Open Bill kamu telah aktif.
                </template>
                <template v-else>
                  Sesi pemesanan kamu telah aktif.
                </template>
              </p>
              <p>
                Yuk pilih menu favorit mu dan kami akan segera menyiapkan pesananmu!
              </p>
            </div>
          </div>

          <!-- CTA Button -->
          <div class="shrink-0 w-full max-w-sm mx-auto mt-8">
            <button
              type="button"
              class="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold tracking-wide text-sm active:scale-[0.98] transition-all duration-150 cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-orange-500/20"
              @click="emit('confirm')"
            >
              <span>Lihat Menu &amp; Pesan</span>
              <UIcon name="i-lucide-arrow-right" class="size-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.drop-shadow-xs {
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.15));
}
</style>
