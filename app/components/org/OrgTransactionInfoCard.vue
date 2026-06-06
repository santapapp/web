<script setup lang="ts">
/**
 * OrgTransactionInfoCard.vue
 * Card displaying Transaction Terms (currency, tax, service charges).
 * Address and contact info is already shown in OrgHeroSection, so only transaction info is shown here.
 */

import type { PublicOrg } from '~/types/org'

defineProps<{
  org: PublicOrg
  fullAddress: string
}>()
</script>

<template>
  <section class="mx-auto max-w-5xl px-5 sm:px-6 lg:px-8 pt-5">
    <!-- Transaction info card -->
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
