<script setup lang="ts">
import type { CustomerOrderDetail } from '~/types/order'

const props = defineProps<{
  order: CustomerOrderDetail | null
  loading?: boolean
  error?: string | null
  orgSlug: string
  orderToken?: string | null
}>()

const formatPrice = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(value)

const paymentTone = computed(() => {
  if (!props.order) return 'neutral'
  if (props.order.payment_status === 'paid') return 'success'
  if (props.order.payment_status === 'cancelled') return 'error'
  return 'warning'
})

const paymentLabel = computed(() => {
  if (!props.order) return 'Tidak tersedia'
  if (props.order.payment_status === 'paid') return 'Sudah dibayar'
  if (props.order.payment_status === 'pending') return 'Menunggu pembayaran'
  if (props.order.payment_status === 'cancelled') return 'Dibatalkan'
  return 'Belum dibayar'
})

const paymentTo = computed(() => ({
  path: `/o/${props.orgSlug}/payments`,
  query: { order: props.orderToken || props.order?.order_number }
}))
</script>

<template>
  <section class="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
    <OrdersOrderSkeleton v-if="loading" />

    <OrdersOrderErrorState
      v-else-if="error || !order"
      title="Order tidak ditemukan"
      :description="error || 'Token order tidak valid atau akses sudah kedaluwarsa.'"
      icon="i-lucide-file-warning"
    />

    <div v-else class="space-y-4">
      <div class="rounded-lg border border-gray-200 bg-white p-5">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-primary">Status order</p>
            <h1 class="mt-1 text-2xl font-bold tracking-normal text-gray-950">
              {{ order.order_number }}
            </h1>
            <p v-if="order.dining_table" class="mt-2 text-sm text-gray-500">
              {{ order.dining_table.name }}
            </p>
          </div>
          <UBadge :label="paymentLabel" :color="paymentTone" variant="soft" />
        </div>

        <div class="mt-5 grid grid-cols-2 gap-3">
          <div class="rounded-lg bg-gray-50 p-3">
            <p class="text-xs text-gray-500">Order</p>
            <p class="mt-1 text-sm font-semibold text-gray-950">{{ order.order_status }}</p>
          </div>
          <div class="rounded-lg bg-gray-50 p-3">
            <p class="text-xs text-gray-500">Tagihan</p>
            <p class="mt-1 text-sm font-semibold text-gray-950">{{ order.bill_status }}</p>
          </div>
        </div>
      </div>

      <div class="rounded-lg border border-gray-200 bg-white">
        <div class="border-b border-gray-100 px-5 py-4">
          <h2 class="text-base font-bold text-gray-950">Item pesanan</h2>
        </div>

        <div v-if="order.items.length > 0" class="divide-y divide-gray-100">
          <div v-for="item in order.items" :key="item.id" class="px-5 py-4">
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-sm font-semibold text-gray-950">{{ item.name }}</p>
                <p class="mt-1 text-xs text-gray-500">Qty {{ item.quantity }}</p>
              </div>
              <p class="text-sm font-bold text-gray-950">{{ formatPrice(item.subtotal) }}</p>
            </div>
          </div>
        </div>

        <div v-else class="px-5 py-6 text-sm text-gray-500">
          Detail item belum tersedia.
        </div>

        <div class="border-t border-gray-100 px-5 py-4">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500">Total</span>
            <strong class="text-lg text-gray-950">{{ formatPrice(order.total_amount) }}</strong>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-2 sm:flex-row">
        <UButton
          v-if="order.payment_status !== 'paid'"
          :to="paymentTo"
          block
          color="primary"
          icon="i-lucide-credit-card"
          label="Bayar Sekarang"
        />
        <UButton
          :to="`/o/${orgSlug}/orders`"
          block
          color="neutral"
          variant="soft"
          icon="i-lucide-utensils"
          label="Kembali ke Menu"
        />
      </div>
    </div>
  </section>
</template>
