<script setup lang="ts">
/**
 * OrdersDrawer — "Pesanan Saya" panel dari kanan
 *
 * MIGRATION: USlideover → Teleport + Transition manual
 * - Pattern konsisten dengan CartSheet.vue (Teleport + Transition + fixed overlay)
 * - Animasi: slide dari kanan (translate-x-full → translate-x-0)
 * - Overlay fade independen dari panel slide
 * - Body scroll-lock sinkron dengan SessionDrawer dan CartSheet
 *
 * Berisi:
 * - ActiveOrderCard: status pesanan aktif (dari backend, di-refresh saat dibuka)
 * - Riwayat pesanan (history.activeCount badge di header)
 */

import { watch, onUnmounted } from 'vue'

const route = useRoute()
const orgSlug = computed(() => String(route.params.orgSlug || ''))
const session = useCustomerSession()
const overlay = useUiOverlayStore()

// Active order
const activeOrder = useActiveOrder(orgSlug.value)

// Order history (untuk badge count di header)
const history = useOrderHistory(orgSlug.value)

// Refresh saat overlay dibuka
watch(
  () => overlay.isOrders,
  async (open) => {
    if (!open || !import.meta.client) return
    if (session.hasSession.value) {
      await activeOrder.refresh()
    }
    await history.refreshFromBackend()
  }
)

// ── Body scroll-lock — konsisten dengan CartSheet & SessionDrawer ──
watch(
  () => overlay.isOrders,
  (isOpen) => {
    if (import.meta.client) {
      document.body.style.overflow = isOpen ? 'hidden' : ''
    }
  },
  { immediate: true }
)

onUnmounted(() => {
  if (import.meta.client) document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="orders-drawer">
      <div
        v-if="overlay.isOrders"
        class="fixed inset-0 z-50 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Pesanan Saya"
      >
        <!-- Backdrop (klik untuk tutup) -->
        <div
          class="absolute inset-0 bg-black/45 backdrop-blur-xs"
          @click="overlay.close('orders')"
        />

        <!-- Panel — slide dari kanan -->
        <div class="orders-panel absolute inset-y-0 right-0 w-full max-w-lg md:max-w-xl h-full shadow-2xl flex flex-col bg-gray-50 overflow-hidden outline-none">

          <!-- Header (Sticky) -->
          <header class="flex-shrink-0 flex items-center justify-between gap-2 px-4 py-3 bg-white border-b border-gray-100">
            <!-- Back / Close button -->
            <button
              type="button"
              class="size-10 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 active:scale-90 transition-all duration-150 cursor-pointer"
              aria-label="Tutup pesanan saya"
              @click="overlay.close('orders')"
            >
              <UIcon name="i-lucide-arrow-left" class="size-5" />
            </button>

            <!-- Title -->
            <div class="flex flex-col items-center text-center">
              <h2 class="text-base font-extrabold text-gray-900 leading-none">Pesanan Saya</h2>
              <span v-if="history.activeCount.value > 0" class="text-xs text-orange-600 font-semibold mt-1">
                {{ history.activeCount.value }} pesanan aktif
              </span>
            </div>

            <!-- Refresh button -->
            <button
              v-if="session.hasSession.value"
              type="button"
              class="size-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 active:scale-90 transition-all duration-150 cursor-pointer disabled:opacity-40"
              :disabled="activeOrder.isRefreshing.value"
              aria-label="Refresh status pesanan"
              @click="activeOrder.refresh()"
            >
              <UIcon
                name="i-lucide-refresh-cw"
                class="size-4.5"
                :class="{ 'animate-spin': activeOrder.isRefreshing.value }"
              />
            </button>
            <!-- Spacer when no refresh button (to keep title centered) -->
            <span v-else class="size-10 flex-shrink-0" aria-hidden="true" />
          </header>

          <!-- Scrollable body -->
          <div class="flex-1 overflow-y-auto px-4 py-4 space-y-4">

            <!-- Active orders section -->
            <div>
              <h3 class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 px-1">Pesanan Aktif</h3>

              <OrdersActiveOrderCard
                :order="activeOrder.order.value"
                :org-slug="orgSlug"
                :is-refreshing="activeOrder.isRefreshing.value"
              />

              <!-- No session hint -->
              <div
                v-if="!session.hasSession.value"
                class="flex items-center gap-2 mt-3 p-3 rounded-xl bg-amber-50 border border-amber-100"
              >
                <UIcon name="i-lucide-info" class="size-4 text-amber-600 shrink-0" />
                <p class="text-xs text-amber-700 font-semibold">
                  Scan QR meja untuk melihat pesanan aktif
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* ── Overlay: fade in/out ─────────────────────────────────── */
.orders-drawer-enter-active {
  transition: opacity 0.25s ease-out;
}
.orders-drawer-leave-active {
  transition: opacity 0.2s ease-in;
}
.orders-drawer-enter-from,
.orders-drawer-leave-to {
  opacity: 0;
}

/* ── Panel: slide dari kanan ──────────────────────────────── */
/* Enter: ease-out (spring) untuk natural feel saat masuk */
.orders-drawer-enter-active .orders-panel {
  transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}
/* Leave: ease-in (accelerate) untuk cepat saat keluar */
.orders-drawer-leave-active .orders-panel {
  transition: transform 0.2s cubic-bezier(0.7, 0, 0.84, 0);
}
.orders-drawer-enter-from .orders-panel,
.orders-drawer-leave-to .orders-panel {
  transform: translateX(100%);
}

/* ── Reduced motion ───────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .orders-drawer-enter-active,
  .orders-drawer-leave-active,
  .orders-drawer-enter-active .orders-panel,
  .orders-drawer-leave-active .orders-panel {
    transition: none !important;
  }
}
</style>
