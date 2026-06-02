<script setup lang="ts">
/**
 * OrderStatusView — Halaman detail/status pesanan customer.
 *
 * Slicing UI mengikuti referensi: header konfirmasi, badge kode order,
 * timeline status, ringkasan pembayaran, info banner, dan CTA.
 *
 * LOGIC TIDAK BERUBAH:
 * - Data sepenuhnya dari prop `order` (CustomerOrderDetail dari backend).
 * - paymentTone/paymentLabel/canPay/paymentTo tetap seperti sebelumnya.
 * - Tidak ada perhitungan total/pajak baru — semua dari field existing.
 */

import type { CustomerOrderDetail } from '~/types/order'
import { paymentStatusConfig } from '~/composables/useOrderStatus'

const props = defineProps<{
  order: CustomerOrderDetail | null
  loading?: boolean
  error?: string | null
  orgSlug: string
  orderToken?: string | null
}>()

// 'failed' diperlakukan setara 'cancelled' (kegagalan terminal).
const isPaymentFailed = computed(() =>
  props.order?.payment_status === 'cancelled' ||
  props.order?.payment_status === 'failed'
)

// Badge pembayaran → sumber tunggal di useOrderStatus.
const paymentBadge = computed(() => paymentStatusConfig(props.order?.payment_status))
const paymentTone = computed(() => paymentBadge.value.color)
const paymentLabel = computed(() => paymentBadge.value.label)

const paymentTo = computed(() => ({
  path: `/o/${props.orgSlug}/payments`,
  query: { order: props.orderToken || props.order?.order_number }
}))

// Tombol bayar hanya relevan jika masih menunggu pembayaran.
const canPay = computed(() =>
  props.order
    ? props.order.payment_status !== 'paid' &&
      !isPaymentFailed.value &&
      props.order.order_status !== 'cancelled'
    : false
)

const isCancelled = computed(() =>
  props.order?.order_status === 'cancelled' ||
  isPaymentFailed.value
)

const isPaid = computed(() => props.order?.payment_status === 'paid')
const isCompleted = computed(() => props.order?.order_status === 'completed')
const isReady = computed(() => props.order?.order_status === 'ready')
const isPreparing = computed(() =>
  ['confirmed', 'preparing', 'processing'].includes(props.order?.order_status ?? '')
)

// Header dinamis berdasarkan status existing — tidak mengarang state baru.
const header = computed(() => {
  if (isCancelled.value) {
    return {
      icon: 'i-lucide-circle-x',
      tone: 'error' as const,
      title: 'PESANAN DIBATALKAN',
      subtitle: props.order?.cancel_reason || 'Pesanan ini telah dibatalkan'
    }
  }
  if (isCompleted.value) {
    return {
      icon: 'i-lucide-check-check',
      tone: 'success' as const,
      title: 'PESANAN SELESAI',
      subtitle: 'Selamat menikmati makananmu ❤️'
    }
  }
  if (isReady.value) {
    return {
      icon: 'i-lucide-hand-platter',
      tone: 'success' as const,
      title: 'PESANAN SIAP DISAJIKAN',
      subtitle: 'Pesananmu sudah siap'
    }
  }
  if (isPaid.value) {
    return {
      icon: 'i-lucide-clipboard-check',
      tone: 'success' as const,
      title: 'PESANAN DIKONFIRMASI!',
      subtitle: isPreparing.value
        ? 'Dapur sedang menyiapkan pesananmu'
        : 'Pembayaran berhasil diterima'
    }
  }
  return {
    icon: 'i-lucide-clock',
    tone: 'warning' as const,
    title: 'MENUNGGU PEMBAYARAN',
    subtitle: 'Selesaikan pembayaran untuk memproses pesananmu'
  }
})

const tableLabel = computed(() => props.order?.dining_table?.name ?? null)
</script>

<template>
  <section class="mx-auto w-full max-w-md px-4 py-6 sm:py-8">
    <OrdersOrderSkeleton v-if="loading" />

    <OrdersOrderErrorState
      v-else-if="error || !order"
      title="Order tidak ditemukan"
      :description="error || 'Token order tidak valid atau akses sudah kedaluwarsa.'"
      icon="i-lucide-file-warning"
    />

    <div v-else class="flex flex-col gap-4">
      <!-- Confirmation header -->
      <header class="text-center pt-2">
        <div
          class="mx-auto size-16 rounded-2xl flex items-center justify-center mb-3"
          :class="{
            'bg-green-100 text-green-600': header.tone === 'success',
            'bg-amber-100 text-amber-600': header.tone === 'warning',
            'bg-rose-100 text-rose-600': header.tone === 'error'
          }"
        >
          <UIcon :name="header.icon" class="size-8" />
        </div>

        <h1 class="text-xl font-extrabold tracking-tight text-stone-900">
          {{ header.title }}
        </h1>
        <p class="text-sm text-stone-500 mt-1">{{ header.subtitle }}</p>

        <!-- Order code badge -->
        <span
          class="inline-flex items-center mt-3 px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 text-sm font-extrabold tracking-wide"
        >
          #{{ order.order_number }}
        </span>
      </header>

      <!-- Status timeline card (sembunyikan bila dibatalkan) -->
      <div
        v-if="!isCancelled"
        class="bg-white rounded-3xl shadow-sm border border-stone-200/70 p-5"
      >
        <div class="flex items-center justify-between gap-2 mb-4">
          <h2 class="text-xs font-extrabold uppercase tracking-wide text-stone-800">
            Status Pesanan
          </h2>
          <UBadge :label="paymentLabel" :color="paymentTone" variant="soft" size="sm" />
        </div>

        <OrdersStatusTimeline
          :status="order.order_status"
          :order-type="order.order_type"
          :created-at="order.created_at"
        />
      </div>

      <!-- Full item breakdown (detail menu lengkap dalam pesanan) -->
      <OrdersOrderItemsCard :order="order" />

      <!-- Payment summary -->
      <OrdersOrderSummaryCard :order="order" />

      <!-- Info banner -->
      <div
        v-if="!isCancelled"
        class="flex items-start gap-2.5 rounded-2xl bg-amber-50 border border-amber-200/60 px-4 py-3"
      >
        <UIcon name="i-lucide-info" class="size-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p class="text-xs text-stone-600 leading-relaxed">
          <template v-if="canPay">
            Selesaikan pembayaran agar pesananmu segera diproses.
          </template>
          <template v-else>
            Pesanan akan segera disiapkan.
            <template v-if="tableLabel">
              Tetap di <strong class="font-bold text-stone-800">{{ tableLabel }}</strong> ya,
              kami akan mengantarkan langsung ke mejamu.
            </template>
          </template>
        </p>
      </div>

      <!-- Actions -->
      <div class="flex flex-col gap-2.5">
        <button
          v-if="canPay"
          type="button"
          class="w-full min-h-[52px] px-6 py-3.5 rounded-full bg-amber-600 text-white hover:bg-amber-700 active:scale-[0.99] shadow-lg shadow-amber-600/25 font-bold flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer"
          @click="$router.push(paymentTo)"
        >
          <UIcon name="i-lucide-credit-card" class="size-5" />
          <span>Bayar Sekarang</span>
        </button>

        <NuxtLink
          :to="`/o/${orgSlug}/orders`"
          class="w-full min-h-[52px] px-6 py-3.5 rounded-full font-bold flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer active:scale-[0.99]"
          :class="canPay
            ? 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
            : 'bg-amber-600 text-white hover:bg-amber-700 shadow-lg shadow-amber-600/25'"
        >
          <UIcon name="i-lucide-plus" class="size-5" />
          <span>Tambah Pesanan Lagi</span>
        </NuxtLink>
      </div>

      <!-- Footer note -->
      <p class="text-center text-xs text-stone-400 pt-1 pb-2">
        Terima kasih sudah memilih Santap ❤️
      </p>
    </div>
  </section>
</template>
