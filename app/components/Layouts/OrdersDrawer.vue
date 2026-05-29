<script setup lang="ts">
/**
 * OrdersDrawer — Drawer kanan "Pesanan Saya"
 *
 * Berisi:
 * - ActiveOrderCard: status pesanan aktif (dari backend, di-refresh saat drawer dibuka)
 * - OrderHistoryList: riwayat pesanan per org dari localStorage
 *
 * Behavior:
 * - Saat drawer dibuka → refresh active order dari backend
 * - Refresh hanya item non-final di history (pending/processing/waiting_payment)
 * - Badge di header hanya untuk order aktif (bukan total history)
 */

const props = defineProps<{
  isOpen: boolean
}>()

defineEmits<{
  close: []
}>()

const route = useRoute()
const orgSlug = computed(() => String(route.params.orgSlug || ''))
const session = useCustomerSession()

// Active order
const activeOrder = useActiveOrder(orgSlug.value)

// Order history
const history = useOrderHistory(orgSlug.value)

// Refresh saat drawer dibuka
watch(
  () => props.isOpen,
  async (open) => {
    if (!open || !import.meta.client) return
    if (session.hasSession.value) {
      await activeOrder.refresh()
    }
    await history.refreshFromBackend()
  }
)

const handleRemoveOne = (orderPublicId: string) => {
  history.removeOne(orderPublicId)
}

const handleRemoveAll = () => {
  history.removeAll()
}
</script>

<template>
  <Teleport to="body">
    <!-- Overlay -->
    <Transition name="drawer-fade">
      <div
        v-if="isOpen"
        class="drawer-overlay"
        @click="$emit('close')"
      />
    </Transition>

    <!-- Drawer panel -->
    <Transition name="drawer-slide-right">
      <div
        v-if="isOpen"
        class="drawer-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Pesanan Saya"
        @click.stop
      >
        <!-- Header -->
        <div class="drawer-header">
          <div class="drawer-header-left">
            <div class="drawer-header-icon">
              <UIcon name="i-lucide-clipboard-list" class="size-4 text-amber-700" />
            </div>
            <h2 class="drawer-title">Pesanan Saya</h2>
            <!-- Badge hanya untuk order aktif/pending -->
            <span
              v-if="history.activeCount.value > 0"
              class="active-badge"
            >
              {{ history.activeCount.value }}
            </span>
          </div>
          <button
            class="close-btn"
            aria-label="Tutup drawer pesanan"
            @click="$emit('close')"
          >
            <UIcon name="i-lucide-x" class="size-5" />
          </button>
        </div>

        <!-- Body -->
        <div class="drawer-body">
          <!-- Section: Pesanan Aktif -->
          <div class="body-section">
            <div class="section-header-row">
              <h3 class="section-title">Pesanan Aktif</h3>
              <button
                v-if="session.hasSession.value"
                class="refresh-btn"
                :disabled="activeOrder.isRefreshing.value"
                aria-label="Refresh status pesanan"
                @click="activeOrder.refresh()"
              >
                <UIcon
                  name="i-lucide-refresh-cw"
                  class="size-3.5"
                  :class="{ 'animate-spin': activeOrder.isRefreshing.value }"
                />
              </button>
            </div>

            <OrdersActiveOrderCard
              :order="activeOrder.order.value"
              :org-slug="orgSlug"
              :is-refreshing="activeOrder.isRefreshing.value"
            />

            <!-- No session hint -->
            <p v-if="!session.hasSession.value" class="no-session-hint">
              <UIcon name="i-lucide-info" class="size-3.5" />
              Scan QR meja untuk melihat pesanan aktif
            </p>
          </div>

          <div class="section-divider" />

          <!-- Section: Riwayat -->
          <div class="body-section">
            <OrdersOrderHistoryList
              :items="history.items.value"
              :org-slug="orgSlug"
              @remove-one="handleRemoveOne"
              @remove-all="handleRemoveAll"
            />
          </div>
        </div>

        <!-- Footer -->
        <div class="drawer-footer">
          <p>Riwayat disimpan di perangkat ini</p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.drawer-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(13, 11, 9, 0.4);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
}

.drawer-panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 101;
  width: 88%;
  max-width: 340px;
  background: #FAF8F3;
  box-shadow: -4px 0 32px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.drawer-header {
  padding: 18px 16px 14px;
  border-bottom: 1px solid rgba(224, 217, 206, 0.6);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.drawer-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.drawer-header-icon {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: #fef3c7;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.drawer-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #1a1714;
}

.active-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 9px;
  background: #c07b2a;
  color: white;
  font-size: 10px;
  font-weight: 700;
}

.close-btn {
  background: transparent;
  border: none;
  color: #8a7f6e;
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.06);
}

.drawer-body {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.body-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 4px 0 16px;
}

.section-header-row {
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

.refresh-btn {
  background: transparent;
  border: none;
  color: #a09080;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s, background 0.15s;
}

.refresh-btn:hover:not(:disabled) {
  color: #c07b2a;
  background: rgba(192, 123, 42, 0.08);
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.no-session-hint {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: #a09080;
  margin: 0;
}

.section-divider {
  height: 1px;
  background: rgba(224, 217, 206, 0.5);
  margin: 0 0 16px;
}

.drawer-footer {
  padding: 12px 16px;
  border-top: 1px solid rgba(224, 217, 206, 0.5);
  flex-shrink: 0;
}

.drawer-footer p {
  margin: 0;
  font-size: 11px;
  color: #a09080;
  text-align: center;
}

/* ── Transitions ─────────────────────────────────────────── */
.drawer-fade-enter-active,
.drawer-fade-leave-active {
  transition: opacity 0.25s ease;
}

.drawer-fade-enter-from,
.drawer-fade-leave-to {
  opacity: 0;
}

.drawer-slide-right-enter-active,
.drawer-slide-right-leave-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.drawer-slide-right-enter-from,
.drawer-slide-right-leave-to {
  transform: translateX(100%);
}
</style>
