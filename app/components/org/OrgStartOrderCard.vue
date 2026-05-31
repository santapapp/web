<script setup lang="ts">
/**
 * OrgStartOrderCard.vue
 * Main call-to-action card encouraging customers to initiate a new table order.
 *
 * Catatan: Table order BUKAN session. Kartu ini TIDAK menawarkan "lanjutkan sesi meja".
 * Setiap scan/masuk meja selalu memulai order baru. Jika ada riwayat pesanan
 * tersimpan untuk outlet ini, kartu menampilkan aksi "Riwayat Pesanan" terpisah.
 */

defineProps<{
  orderTo: string
  hasOrderHistory?: boolean
}>()

const emit = defineEmits<{
  'open-history': []
}>()
</script>

<template>
  <section class="mx-auto max-w-5xl px-5 pb-5 sm:px-6 lg:px-8">
    <!-- Main glow CTA card with amber border and warm light gradient -->
    <div class="rounded-2xl border border-amber-200/70 bg-gradient-to-br from-amber-50/40 via-white to-amber-50/20 p-5 shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-5 relative overflow-hidden group">
      <!-- Corner ambient light glow -->
      <div class="absolute -right-16 -top-16 size-36 bg-amber-200/10 rounded-full blur-2xl group-hover:bg-amber-200/20 transition-all duration-500 pointer-events-none" />

      <!-- Text contents -->
      <div class="relative z-10">
        <h3 class="text-lg font-extrabold text-stone-900 flex items-center gap-2">
          <UIcon
            name="i-lucide-help-circle"
            class="size-5 text-amber-700 shrink-0"
          />
          <span>Siap pesan dari meja?</span>
        </h3>
        <p class="mt-2 text-xs sm:text-sm leading-relaxed text-stone-600 font-semibold max-w-2xl">
          Scan QR meja atau masukkan kode dari kasir untuk mulai memesan.
        </p>
      </div>

      <!-- Action Button Container -->
      <div class="relative z-10 mt-2 md:mt-0 w-full md:w-auto shrink-0 flex flex-col sm:flex-row gap-3">
        <!-- Secondary: Riwayat Pesanan (hanya jika ada history) -->
        <button
          v-if="hasOrderHistory"
          type="button"
          class="w-full md:w-auto min-h-[44px] px-5 py-3 rounded-xl border border-amber-300 bg-white text-amber-800 hover:bg-amber-50 active:scale-[0.98] focus:ring-2 focus:ring-amber-500 focus:outline-none font-bold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer text-sm"
          @click="emit('open-history')"
        >
          <UIcon name="i-lucide-history" class="size-4.5 shrink-0" />
          <span>Riwayat Pesanan</span>
        </button>

        <!-- Primary: selalu mulai order baru -->
        <NuxtLink
          :to="orderTo"
          class="w-full md:w-auto min-h-[44px] px-6 py-3 rounded-xl bg-amber-700 text-white hover:bg-amber-800 active:scale-[0.98] focus:ring-2 focus:ring-amber-500 focus:outline-none shadow-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer text-sm"
        >
          <UIcon name="i-lucide-utensils" class="size-4.5 shrink-0" />
          <span>Mulai Pesan</span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
