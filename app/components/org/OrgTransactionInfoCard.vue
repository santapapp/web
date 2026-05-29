<script setup lang="ts">
/**
 * OrgTransactionInfoCard.vue
 * Grid displaying Locations, Contact Channels, and Transaction Terms (currency, tax, service charges)
 * styled in a warm, premium layout.
 */

import type { PublicOrg } from '~/types/org'

defineProps<{
  org: PublicOrg
  fullAddress: string
}>()
</script>

<template>
  <section class="mx-auto grid max-w-5xl gap-5 px-5 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8 py-5">
    <!-- Location Card -->
    <div v-if="fullAddress" class="rounded-2xl border border-stone-200/60 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300">
      <div class="flex items-start gap-4">
        <!-- Warm icon container -->
        <div class="size-10 rounded-xl bg-amber-50 border border-amber-100/60 flex items-center justify-center text-amber-700 shrink-0">
          <UIcon name="i-lucide-map-pin" class="size-5" />
        </div>
        <div>
          <p class="text-sm font-bold text-stone-900">Lokasi Outlet</p>
          <p class="mt-1 text-xs sm:text-sm leading-relaxed text-stone-600 font-medium">{{ fullAddress }}</p>
        </div>
      </div>
    </div>

    <!-- Contact Card -->
    <div v-if="org.phone || org.email" class="rounded-2xl border border-stone-200/60 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300">
      <div class="flex items-start gap-4">
        <!-- Warm icon container -->
        <div class="size-10 rounded-xl bg-amber-50 border border-amber-100/60 flex items-center justify-center text-amber-700 shrink-0">
          <UIcon name="i-lucide-phone" class="size-5" />
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-sm font-bold text-stone-900">Hubungi Kami</p>
          <a
            v-if="org.phone"
            :href="`tel:${org.phone}`"
            class="mt-1.5 block truncate text-xs sm:text-sm text-stone-600 hover:text-amber-700 font-semibold"
          >
            {{ org.phone }}
          </a>
          <a
            v-if="org.email"
            :href="`mailto:${org.email}`"
            class="mt-1 block truncate text-xs sm:text-sm text-stone-600 hover:text-amber-700 font-semibold"
          >
            {{ org.email }}
          </a>
        </div>
      </div>
    </div>

    <!-- Transaction info card with specialized warm container accent -->
    <div class="rounded-2xl border border-stone-200/60 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300">
      <div class="flex items-start gap-4">
        <!-- Accent container -->
        <div class="size-10 rounded-xl bg-amber-100/80 border border-amber-200/60 flex items-center justify-center text-amber-800 shrink-0 shadow-sm">
          <UIcon name="i-lucide-receipt-text" class="size-5" />
        </div>
        <div>
          <p class="text-sm font-bold text-stone-900">Informasi Transaksi</p>
          <p class="mt-1.5 text-xs sm:text-sm leading-relaxed text-stone-600 font-semibold">
            Mata Uang: <span class="text-stone-950 font-bold">{{ org.currency || 'IDR' }}</span>
            <span v-if="org.tax_enabled" class="block mt-0.5 text-stone-500 font-normal">Pajak Restoran: <strong class="text-stone-950 font-bold">{{ org.tax_rate }}%</strong></span>
            <span v-if="org.service_charge_enabled" class="block mt-0.5 text-stone-500 font-normal">Biaya Layanan: <strong class="text-stone-950 font-bold">{{ org.service_charge_rate }}%</strong></span>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
