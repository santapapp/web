<script setup lang="ts">
/**
 * ActiveOrderCard — Kartu status order aktif
 *
 * Menampilkan:
 * - Order number / kode
 * - Mode: table order atau open bill
 * - Status pesanan + payment status
 * - Total amount
 * - Jumlah item
 * - Link ke halaman status order
 */

import type { CustomerOrderDetail } from '~/types/customer-order'
import { getCustomerOrderDisplayStatus, orderStatusLabel } from '~/composables/useOrderStatus'

const props = defineProps<{
  order: CustomerOrderDetail | null
  orgSlug: string
  isRefreshing?: boolean
}>()

const formatPrice = (v: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(v)

// isOpenBill ditentukan dari order_type yang diterima dari backend via prop
// order_type = 'open_bill' hanya jika kasir membuat open bill
const isOpenBill = computed(() =>
  props.order?.order_type === 'open_bill'
)

// Label & warna status → sumber tunggal di useOrderStatus.
const displayStatus = computed(() => getCustomerOrderDisplayStatus(props.order))

const orderStatusText = computed(() => orderStatusLabel(props.order?.order_status))

const itemCount = computed(() => props.order?.items?.length ?? 0)

const statusRoute = computed(() => ({
  path: `/o/${props.orgSlug}/orders`,
  query: { order: props.order?.public_token ?? props.order?.order_number }
}))
</script>

<template>
  <div class="active-order-card">
    <!-- Loading shimmer -->
    <div v-if="isRefreshing && !order" class="loading-state">
      <UIcon name="i-lucide-loader-circle" class="size-4 text-amber-600 animate-spin" />
      <span>Memuat status pesanan…</span>
    </div>

    <!-- No active order -->
    <div v-else-if="!order" class="empty-state">
      <UIcon name="i-lucide-clipboard-list" class="size-8 text-gray-200" />
      <p>Belum ada pesanan aktif</p>
    </div>

    <!-- Order detail -->
    <template v-else>
      <!-- Mode badge -->
      <div class="mode-row">
        <div class="mode-pill">
          <UIcon
            :name="isOpenBill ? 'i-lucide-receipt' : 'i-lucide-utensils'"
            class="size-3"
          />
          <span>{{ isOpenBill ? 'Open Bill' : 'Table Order' }}</span>
        </div>
        <UBadge
          :label="displayStatus.label"
          :color="displayStatus.color"
          variant="soft"
          size="sm"
        />
      </div>

      <!-- Order number -->
      <div class="order-code-row">
        <p class="order-code-label">Kode Pesanan</p>
        <p class="order-code-val">{{ order.order_number }}</p>
      </div>

      <!-- Table info -->
      <div v-if="order.dining_table" class="table-row">
        <UIcon name="i-lucide-armchair" class="size-3.5 text-gray-400" />
        <span>{{ order.dining_table.name }}</span>
      </div>

      <!-- Stats row -->
      <div class="stats-row">
        <div class="stat-item">
          <span class="stat-label">Status Order</span>
          <span class="stat-val">{{ orderStatusText }}</span>
        </div>
        <div class="stat-divider" />
        <div class="stat-item">
          <span class="stat-label">Jumlah Item</span>
          <span class="stat-val">{{ itemCount }} item</span>
        </div>
        <div class="stat-divider" />
        <div class="stat-item">
          <span class="stat-label">Total</span>
          <span class="stat-val total">{{ formatPrice(order.total_amount) }}</span>
        </div>
      </div>

      <!-- CTA -->
      <UButton
        :to="statusRoute"
        block
        size="sm"
        color="primary"
        variant="soft"
        trailing-icon="i-lucide-arrow-right"
        label="Lihat Detail Pesanan"
      />
    </template>
  </div>
</template>

<style scoped>
.active-order-card {
  background: white;
  border-radius: 14px;
  border: 1px solid rgba(224, 217, 206, 0.5);
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 80px;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 0;
  color: #a09080;
  font-size: 12px;
  text-align: center;
}

.loading-state {
  flex-direction: row;
  gap: 6px;
  font-size: 13px;
  color: #c07b2a;
}

.empty-state p {
  margin: 0;
}

.mode-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mode-pill {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #8a7f6e;
}

.order-code-label {
  margin: 0;
  font-size: 10px;
  color: #a09080;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-weight: 600;
}

.order-code-val {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: #1a1714;
  letter-spacing: -0.02em;
}

.table-row {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: #8a7f6e;
}

.stats-row {
  display: flex;
  gap: 0;
  background: #faf8f3;
  border-radius: 10px;
  overflow: hidden;
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 10px;
  text-align: center;
}

.stat-divider {
  width: 1px;
  background: rgba(224, 217, 206, 0.6);
  margin: 6px 0;
}

.stat-label {
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #a09080;
}

.stat-val {
  font-size: 12px;
  font-weight: 600;
  color: #1a1714;
}

.stat-val.total {
  color: #c07b2a;
}
</style>
