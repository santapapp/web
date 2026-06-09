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
import { getCustomerOrderDisplayStatus, mapToHistoryStatus } from '~/composables/useOrderStatus'

const router = useRouter()

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

const mappedStatus = computed(() => {
  if (!props.order) return 'pending'
  return mapToHistoryStatus(
    props.order.order_status,
    props.order.payment_status,
    props.order.bill_status
  )
})

const orderDisplayStatus = computed(() => getCustomerOrderDisplayStatus(props.order))

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

const isCancelled = computed(() => mappedStatus.value === 'cancelled')
const isPaid = computed(() => props.order?.payment_status === 'paid')
const isCompleted = computed(() => mappedStatus.value === 'completed')
const isReady = computed(() => mappedStatus.value === 'ready')
const isPreparing = computed(() => mappedStatus.value === 'processing')


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

const config = useRuntimeConfig()
const baseUrl = String(config.public.apiBaseUrl || 'https://api.santap.app').replace(/\/$/, '')

const downloadLoading = ref(false)
const downloadError = ref<string | null>(null)

const downloadReceipt = async () => {
  if (downloadLoading.value) return
  downloadLoading.value = true
  downloadError.value = null
  try {
    const token = props.orderToken || props.order?.public_token || props.order?.order_number
    if (!token) {
      throw new Error('Token pesanan tidak ditemukan.')
    }
    const response = await fetch(`${baseUrl}/v1/customer/orders/${token}/receipt/download`, {
      headers: {
        Accept: 'application/pdf'
      }
    })
    
    if (!response.ok) {
      const text = await response.text()
      let message = 'Gagal mengunduh struk.'
      try {
        const json = JSON.parse(text)
        message = json.message || message
      } catch {}
      throw new Error(message)
    }

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `receipt-${props.orgSlug}-${props.order?.order_number || token}.pdf`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch (err: any) {
    downloadError.value = err.message || 'Terjadi kesalahan saat mengunduh struk.'
  } finally {
    downloadLoading.value = false
  }
}
</script>

<template>
  <div class="flex-1 flex flex-col min-h-0">
    <!-- Header -->
    <header class="sticky top-0 z-20 flex-shrink-0 flex items-center justify-between gap-2 px-4 py-3 bg-white/85 backdrop-blur-md border-b border-stone-100/80">
      <button
        type="button"
        class="size-10 rounded-xl flex items-center justify-center text-stone-600 hover:bg-stone-50 border border-stone-100 active:scale-95 transition-all duration-150 cursor-pointer shadow-xs"
        @click="router.push(`/o/${orgSlug}/orders`)"
      >
        <UIcon name="i-lucide-arrow-left" class="size-5" />
      </button>
      <div class="flex flex-col items-center text-center">
        <h2 class="text-base font-black text-stone-900 leading-none">Detail Pesanan</h2>
      </div>
      <span class="size-10 flex-shrink-0" aria-hidden="true" />
    </header>

    <div class="flex-1 overflow-y-auto">
      <section class="mx-auto w-full max-w-md lg:max-w-5xl px-4 py-6 sm:py-8 transition-all duration-300">
        <OrdersOrderSkeleton v-if="loading" />

        <OrdersOrderErrorState
          v-else-if="error || !order"
          title="Order tidak ditemukan"
          :description="error || 'Token order tidak valid atau akses sudah kedaluwarsa.'"
          icon="i-lucide-file-warning"
        />

        <div v-else class="flex flex-col gap-4 lg:gap-6">
          <!-- Confirmation header -->
          <header class="text-center pt-2 pb-2 lg:pb-4">
            <div
              class="mx-auto size-16 rounded-2xl flex items-center justify-center mb-3 shadow-inner"
              :class="{
                'bg-green-50 text-green-600 border border-green-100': header.tone === 'success',
                'bg-orange-50 text-orange-600 border border-orange-100': header.tone === 'warning',
                'bg-rose-50 text-rose-600 border border-rose-100': header.tone === 'error'
              }"
            >
              <UIcon :name="header.icon" class="size-8" />
            </div>

            <h1 class="text-xl lg:text-3xl font-extrabold tracking-tight text-stone-900 transition-all duration-200">
              {{ header.title }}
            </h1>
            <p class="text-sm text-stone-500 mt-1">{{ header.subtitle }}</p>

            <!-- Order code badge -->
            <span
              class="inline-flex items-center mt-3 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-orange-700 text-sm font-extrabold tracking-wide"
            >
              #{{ order.order_number }}
            </span>
          </header>

          <!-- Desktop 2-column Grid -->
          <div class="lg:grid lg:grid-cols-12 lg:gap-6 lg:items-start">

            <!-- Kolom Kiri: Order Status Panel (Sticky on Desktop) -->
            <aside class="lg:col-span-5 lg:sticky lg:top-24 lg:self-start flex flex-col gap-4 mb-4 lg:mb-0">
              <!-- Status timeline card (sembunyikan bila dibatalkan) -->
              <div
                v-if="!isCancelled"
                class="bg-white rounded-3xl shadow-sm border border-stone-200/70 p-5 motion-card hover:shadow-md transition-all duration-200"
              >
                <div class="flex items-center justify-between gap-2 mb-4">
                  <h2 class="text-xs font-extrabold uppercase tracking-wide text-stone-800">
                    Status Pesanan
                  </h2>
                  <UBadge :label="orderDisplayStatus.label" :color="orderDisplayStatus.color" variant="soft" size="sm" />
                </div>

                <!-- Table Info / Nomor Meja if available -->
                <div v-if="tableLabel" class="flex items-center gap-2 mb-4 pb-3 border-b border-stone-100 text-stone-600">
                  <UIcon name="i-lucide-armchair" class="size-4 text-stone-400" />
                  <span class="text-xs font-bold">Meja: {{ tableLabel }}</span>
                </div>

                <OrdersStatusTimeline
                  :status="order.order_status"
                  :order-type="order.order_type"
                  :created-at="order.created_at"
                />
              </div>

              <!-- Status Card Fallback when Cancelled -->
              <div
                v-else
                class="bg-white rounded-3xl shadow-sm border border-stone-200/70 p-6 flex flex-col items-center text-center gap-3.5 motion-card hover:shadow-md transition-all duration-200"
              >
                <div class="size-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center">
                  <UIcon name="i-lucide-circle-x" class="size-6" />
                </div>
                <div>
                  <h2 class="text-xs font-extrabold uppercase tracking-wide text-stone-800 mb-1">
                    Status Pesanan
                  </h2>
                  <p class="text-xs text-stone-500 mt-1 leading-relaxed">{{ order.cancel_reason || 'Pesanan ini telah dibatalkan' }}</p>
                </div>
                <UBadge :label="orderDisplayStatus.label" :color="orderDisplayStatus.color" variant="soft" size="sm" />
              </div>
            </aside>

            <!-- Kolom Kanan: Detail & Payment Panel -->
            <div class="lg:col-span-7 flex flex-col gap-4">
              <!-- Full item breakdown (detail menu lengkap dalam pesanan) -->
              <OrdersOrderItemsCard :order="order" />

              <!-- Payment summary -->
              <OrdersOrderSummaryCard :order="order" />

              <!-- Info banner -->
              <div
                v-if="!isCancelled"
                class="flex items-start gap-2.5 rounded-2xl bg-orange-50/50 border border-orange-200/50 px-4 py-3"
              >
                <UIcon name="i-lucide-info" class="size-4 text-orange-600 flex-shrink-0 mt-0.5" />
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
                  class="w-full min-h-[52px] px-6 py-3.5 rounded-2xl bg-orange-600 text-white hover:bg-orange-700 active:scale-[0.98] shadow-lg shadow-orange-600/20 font-bold flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer"
                  @click="router.push(paymentTo)"
                >
                  <UIcon name="i-lucide-credit-card" class="size-5" />
                  <span>Bayar Sekarang</span>
                </button>

                <button
                  v-if="isPaid"
                  type="button"
                  :disabled="downloadLoading"
                  class="w-full min-h-[52px] px-6 py-3.5 rounded-2xl bg-stone-900 text-white hover:bg-stone-850 active:scale-[0.98] shadow-lg shadow-stone-900/20 font-bold flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  @click="downloadReceipt"
                >
                  <UIcon v-if="downloadLoading" name="i-lucide-loader-2" class="size-5 animate-spin" />
                  <UIcon v-else name="i-lucide-download" class="size-5" />
                  <span>{{ downloadLoading ? 'Mengunduh...' : 'Download Struk' }}</span>
                </button>

                <p v-if="downloadError" class="text-xs text-rose-600 text-center font-medium mt-1">
                  {{ downloadError }}
                </p>

                <NuxtLink
                  :to="`/o/${orgSlug}/orders`"
                  class="w-full min-h-[52px] px-6 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer active:scale-[0.98]"
                  :class="canPay
                    ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                    : 'bg-orange-600 text-white hover:bg-orange-700 shadow-lg shadow-orange-600/20'"
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

          </div>
        </div>
      </section>
    </div>
  </div>
</template>
