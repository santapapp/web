<script setup lang="ts">
/**
 * OrderSummaryCard.vue
 * Ringkasan pembayaran untuk detail pesanan — rincian biaya saja.
 * (Daftar item lengkap ditampilkan terpisah oleh OrderItemsCard / "Detail Pesanan".)
 *
 * Semua nilai berasal dari CustomerOrderDetail (backend). TIDAK menghitung ulang
 * total: subtotal/pajak/service/diskon/total semua dari field existing.
 * Baris rincian hanya muncul bila nilainya > 0 agar bersih (sesuai referensi).
 */

import type { CustomerOrderDetail } from '~/types/customer-order'

defineProps<{
  order: CustomerOrderDetail
}>()

const formatPrice = (v: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(v)
</script>

<template>
  <div class="bg-white rounded-xl shadow-xs border border-stone-200/60 p-3">
    <div class="text-xs font-extrabold uppercase tracking-wide text-stone-800 mb-3">
      Ringkasan Pembayaran
    </div>

    <!-- Breakdown -->
    <dl class="flex flex-col gap-2 text-sm">
      <div class="flex items-center justify-between">
        <dt class="text-stone-500">Subtotal</dt>
        <dd class="font-semibold text-stone-700">{{ formatPrice(order.subtotal_amount) }}</dd>
      </div>

      <div v-if="order.discount_amount > 0" class="flex items-center justify-between">
        <dt class="text-stone-500">Diskon</dt>
        <dd class="font-semibold text-green-600">- {{ formatPrice(order.discount_amount) }}</dd>
      </div>

      <div v-if="order.tax_amount > 0" class="flex items-center justify-between">
        <dt class="text-stone-500">Pajak</dt>
        <dd class="font-semibold text-stone-700">{{ formatPrice(order.tax_amount) }}</dd>
      </div>

      <div v-if="order.service_charge_amount > 0" class="flex items-center justify-between">
        <dt class="text-stone-500">Biaya Layanan</dt>
        <dd class="font-semibold text-stone-700">{{ formatPrice(order.service_charge_amount) }}</dd>
      </div>
    </dl>

    <!-- Dashed divider -->
    <div class="my-4 border-t border-dashed border-stone-200" />

    <!-- Total -->
    <div class="flex items-center justify-between">
      <span class="text-base font-extrabold text-stone-900">Total Bayar</span>
      <span class="text-base font-extrabold text-orange-600">{{ formatPrice(order.total_amount) }}</span>
    </div>
  </div>
</template>
