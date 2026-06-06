<script setup lang="ts">
/**
 * OrdersDrawer — "Pesanan Saya" fullscreen overlay
 *
 * Berisi:
 * - ActiveOrderCard: status pesanan aktif (dari backend, di-refresh saat dibuka)
 *
 * Tampil sebagai fullscreen overlay seperti CartSheet.vue menggunakan
 * Teleport + Transition. State buka/tutup via useUiOverlayStore.
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

// Body scroll lock
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
  if (import.meta.client) {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="translate-y-full opacity-90"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-full opacity-90"
    >
      <div
        v-if="overlay.isOrders"
        class="fixed inset-0 z-50 flex justify-center bg-black/45 backdrop-blur-xs w-full h-dvh min-h-screen overflow-hidden"
      >
        <div class="bg-gray-50 flex flex-col w-full max-w-lg md:max-w-xl h-full shadow-2xl relative outline-none">

          <!-- Header (Sticky) -->
          <header class="sticky top-0 z-10 flex-shrink-0 flex items-center justify-between gap-2 px-4 py-3 bg-white border-b border-gray-100">
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
