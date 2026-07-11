<script setup lang="ts">
/**
 * OrderHistoryList — List riwayat pesanan per org
 *
 * Fitur:
 * - Tampil list riwayat dengan status badge
 * - Bedakan table order vs open_bill
 * - Hapus satu item (konfirmasi inline)
 * - Hapus semua (konfirmasi via modal)
 * - Empty state jika tidak ada riwayat
 */

import type { OrderHistoryItem } from '~/types/order-history'
import { historyStatusConfig } from '~/composables/useOrderStatus'

const props = defineProps<{
  items: OrderHistoryItem[]
  orgSlug: string
}>()

const emit = defineEmits<{
  'remove-one': [orderPublicId: string]
  'remove-all': []
}>()

// Konfirmasi hapus satu
const pendingDeleteId = ref<string | null>(null)

const requestDelete = (id: string) => {
  pendingDeleteId.value = id
}

const confirmDelete = () => {
  if (pendingDeleteId.value) {
    emit('remove-one', pendingDeleteId.value)
    pendingDeleteId.value = null
  }
}

const cancelDelete = () => {
  pendingDeleteId.value = null
}

// Konfirmasi hapus semua
const showDeleteAll = ref(false)

// Format helpers
const formatPrice = (v?: number) => {
  if (!v) return null
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(v)
}

const formatDate = (iso: string) => {
  try {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

// Label & warna status riwayat → sumber tunggal di useOrderStatus.
const statusConfig = historyStatusConfig

const orderDetailRoute = (item: OrderHistoryItem) => ({
  path: `/o/${props.orgSlug}/orders`,
  query: { order: item.order_public_id }
})

const config = useRuntimeConfig()
const baseUrl = String(config.public.apiBaseUrl || 'https://api.santap.app').replace(/\/$/, '')

const activeDownloads = ref<Record<string, boolean>>({})

const downloadReceipt = async (orderToken: string, orderCode: string) => {
  if (activeDownloads.value[orderToken]) return
  activeDownloads.value[orderToken] = true
  try {
    const response = await fetch(`${baseUrl}/v1/customer/orders/${orderToken}/receipt/download`, {
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
    a.download = `receipt-${props.orgSlug}-${orderCode}.pdf`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch (err: any) {
    alert(err.message || 'Terjadi kesalahan saat mengunduh struk.')
  } finally {
    activeDownloads.value[orderToken] = false
  }
}
</script>

<template>
  <div class="history-section">
    <!-- Header -->
    <div class="history-header">
      <h4 class="section-title">Riwayat Pesanan</h4>
      <button
        v-if="items.length > 0"
        class="clear-all-btn"
        @click="showDeleteAll = true"
      >
        Hapus Semua
      </button>
    </div>

    <!-- Empty state -->
    <div v-if="items.length === 0" class="empty-state">
      <UIcon name="i-lucide-clock" class="size-8 text-gray-200" />
      <p>Belum ada riwayat pesanan di restoran ini</p>
    </div>

    <!-- List -->
    <div v-else class="history-list">
      <div
        v-for="item in items"
        :key="item.order_public_id"
        class="history-item"
      >
        <!-- Confirm delete overlay -->
        <div v-if="pendingDeleteId === item.order_public_id" class="delete-confirm">
          <p class="delete-confirm-text">Hapus riwayat ini?</p>
          <div class="delete-confirm-actions">
            <button class="btn-text" @click="cancelDelete">Batal</button>
            <button class="btn-text danger" @click="confirmDelete">Hapus</button>
          </div>
        </div>

        <template v-else>
          <!-- Top row: mode icon + order code + status -->
          <div class="item-top">
            <div class="item-mode">
              <UIcon
                :name="item.mode === 'open_bill' ? 'i-lucide-receipt' : 'i-lucide-utensils'"
                class="size-3 text-gray-400"
              />
              <span>{{ item.mode === 'open_bill' ? 'Open Bill' : 'Meja' }}</span>
              <span v-if="item.table_label" class="table-label-dot">·</span>
              <span v-if="item.table_label" class="table-label-text">
                {{ item.table_label }}
              </span>
            </div>
            <UBadge
              :label="statusConfig(item.status).label"
              :color="statusConfig(item.status).color"
              variant="soft"
              size="xs"
            />
          </div>

          <!-- Order code + price -->
          <div class="item-mid">
            <NuxtLink :to="orderDetailRoute(item)" class="order-code-link">
              {{ item.order_code }}
            </NuxtLink>
            <span v-if="formatPrice(item.total_amount)" class="item-total">
              {{ formatPrice(item.total_amount) }}
            </span>
          </div>

          <!-- Date + delete -->
          <div class="item-bottom">
            <span class="item-date">
              <UIcon name="i-lucide-clock" class="size-3" />
              {{ formatDate(item.created_at) }}
            </span>
            <div class="flex items-center gap-2">
              <button
                v-if="['paid', 'processing', 'ready', 'completed'].includes(item.status || '')"
                class="download-btn"
                :disabled="activeDownloads[item.order_public_id]"
                :aria-label="'Download struk ' + item.order_code"
                @click="downloadReceipt(item.order_public_id, item.order_code)"
              >
                <UIcon
                  :name="activeDownloads[item.order_public_id] ? 'i-lucide-loader-2' : 'i-lucide-download'"
                  class="size-3.5"
                  :class="{ 'animate-spin': activeDownloads[item.order_public_id] }"
                />
              </button>
              <button
                class="delete-btn"
                aria-label="Hapus riwayat ini"
                @click="requestDelete(item.order_public_id)"
              >
                <UIcon name="i-lucide-trash-2" class="size-3" />
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Delete all confirm modal -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div
          v-if="showDeleteAll"
          class="modal-overlay"
          @click.self="showDeleteAll = false"
        >
          <div class="modal-sheet">
            <div class="modal-icon-wrap">
              <UIcon name="i-lucide-trash-2" class="size-5 text-red-500" />
            </div>
            <p class="modal-title">Hapus semua riwayat?</p>
            <p class="modal-desc">
              Semua riwayat pesanan di restoran ini akan dihapus dari perangkat Anda.
            </p>
            <div class="modal-actions">
              <UButton
                block
                color="neutral"
                variant="outline"
                label="Batal"
                size="sm"
                @click="() => { showDeleteAll = false }"
              />
              <UButton
                block
                color="error"
                variant="solid"
                label="Hapus Semua"
                icon="i-lucide-trash-2"
                size="sm"
                @click="() => { emit('remove-all'); showDeleteAll = false }"
              />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.history-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-title {
  margin: 0;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #8a7f6e;
}

.clear-all-btn {
  background: transparent;
  border: none;
  font-size: 11px;
  font-weight: 600;
  color: #e53e3e;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 4px;
  transition: background 0.15s;
}

.clear-all-btn:hover {
  background: #fff5f5;
}

.empty-state {
  background: #faf8f3;
  border-radius: 12px;
  border: 1px dashed rgba(224, 217, 206, 0.8);
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
}

.empty-state p {
  margin: 0;
  font-size: 12px;
  color: #a09080;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.history-item {
  background: white;
  border-radius: 12px;
  border: 1px solid rgba(224, 217, 206, 0.5);
  padding: 12px 12px 10px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow: hidden;
  min-height: 78px;
}

/* Confirm delete overlay */
.delete-confirm {
  position: absolute;
  inset: 0;
  background: rgba(255, 245, 245, 0.97);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-radius: 12px;
}

.delete-confirm-text {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: #1a1714;
}

.delete-confirm-actions {
  display: flex;
  gap: 16px;
}

.btn-text {
  background: transparent;
  border: none;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  color: #6b6055;
  transition: background 0.15s;
}

.btn-text:hover {
  background: rgba(0, 0, 0, 0.05);
}

.btn-text.danger {
  color: #e53e3e;
}

.btn-text.danger:hover {
  background: #fff5f5;
}

/* Item layout */
.item-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
}

.item-mode {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-weight: 600;
  color: #a09080;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.table-label-dot {
  color: #ccc;
}

.table-label-text {
  font-weight: 700;
  color: #6b6055;
}

.item-mid {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 6px;
}

.order-code-link {
  font-size: 14px;
  font-weight: 800;
  color: #1a1714;
  text-decoration: none;
  letter-spacing: -0.01em;
  transition: color 0.15s;
}

.order-code-link:hover {
  color: #c07b2a;
}

.item-total {
  font-size: 12px;
  font-weight: 700;
  color: #c07b2a;
}

.item-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.item-date {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #a09080;
}

.delete-btn {
  background: transparent;
  border: none;
  color: #ccc;
  cursor: pointer;
  padding: 3px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s, background 0.15s;
}

.delete-btn:hover {
  color: #e53e3e;
  background: #fff5f5;
}

/* Delete all modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 300;
  background: rgba(13, 11, 9, 0.45);
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

@media (min-width: 480px) {
  .modal-overlay {
    align-items: center;
  }
}

.modal-sheet {
  background: #FAFAF9;
  width: 100%;
  max-width: 360px;
  border-radius: 20px 20px 0 0;
  padding: 20px 20px 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

@media (min-width: 480px) {
  .modal-sheet {
    border-radius: 20px;
    padding: 24px 20px;
  }
}

.modal-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: #fff1f0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-title {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: #1a1714;
  text-align: center;
}

.modal-desc {
  margin: 0;
  font-size: 12px;
  color: #6b6055;
  line-height: 1.5;
  text-align: center;
}

.modal-actions {
  display: flex;
  gap: 8px;
  width: 100%;
  margin-top: 6px;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.download-btn {
  background: transparent;
  border: none;
  color: #a09080;
  cursor: pointer;
  padding: 3px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s, background 0.15s;
}

.download-btn:hover:not(:disabled) {
  color: #c07b2a;
  background: #fdf8f2;
}

.download-btn:disabled {
  color: #ccc;
  cursor: not-allowed;
}
</style>
