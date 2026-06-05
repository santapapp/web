<script setup lang="ts">
/**
 * SessionDrawer — Drawer kiri "Menu Sesi"
 *
 * Berisi:
 * - Header orange dengan org info
 * - Open Bill Banner (jika mode open_bill)
 * - SessionInfoCard: detail sesi aktif
 * - QuickActionsCard: aksi cepat
 */

import { useRoute, useRouter } from '#imports'

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  'open-cart': []
  'open-scanner': []
}>()

const route = useRoute()
const router = useRouter()
const session = useCustomerSession()
const { sessionMode, clearSession } = session

const showExitConfirm = ref(false)

const isOpenBill = computed(() => sessionMode.value === 'open_bill')
const isTable = computed(() => sessionMode.value === 'table')

const handleExitSession = () => {
  showExitConfirm.value = true
}

const handleConfirmExit = () => {
  clearSession()
  showExitConfirm.value = false
  emit('close')
  router.push(`/o/${route.params.orgSlug}`)
}

const handleCancelExit = () => {
  showExitConfirm.value = false
}

const handleScanCode = () => {
  emit('close')
  emit('open-scanner')
}

const handleOpenCart = () => {
  emit('close')
  emit('open-cart')
}

const formatPrice = (v: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(v)
</script>

<template>
  <Teleport to="body">
    <!-- Overlay -->
    <Transition name="drawer-fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
        aria-label="Tutup menu sesi"
        @click="$emit('close')"
      />
    </Transition>

    <!-- Drawer panel -->
    <Transition name="drawer-slide-left">
      <div
        v-if="isOpen"
        class="fixed top-0 left-0 bottom-0 z-[101] w-[85%] max-w-[320px] bg-white flex flex-col overflow-hidden shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Menu Sesi"
        @click.stop
      >
        <!-- ─── Orange Header Block ─────────────────────── -->
        <div class="bg-orange-600 px-5 pt-5 pb-5 flex-shrink-0 relative overflow-hidden">
          <!-- Decorative circles -->
          <div class="absolute -top-6 -right-6 size-20 rounded-full bg-white/10 pointer-events-none" />
          <div class="absolute -bottom-8 -right-2 size-28 rounded-full bg-white/5 pointer-events-none" />

          <!-- Top row: title + close -->
          <div class="relative flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <div class="size-7 rounded-lg bg-white/20 flex items-center justify-center">
                <UIcon name="i-lucide-layout-dashboard" class="size-3.5 !text-white" />
              </div>
              <h2 class="text-[15px] font-bold !text-white" style="color: white;">Menu Sesi</h2>
            </div>
            <button
              class="size-8 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors cursor-pointer"
              aria-label="Tutup drawer"
              @click="$emit('close')"
            >
              <UIcon name="i-lucide-x" class="size-4 !text-white" />
            </button>
          </div>

          <!-- Org + session info row -->
          <div class="relative flex items-center gap-3">
            <div class="size-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <UIcon name="i-lucide-store" class="size-5 !text-white" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-bold leading-tight truncate" style="color: white;">
                {{ session.orgName.value || 'Restoran' }}
              </p>
              <p class="text-[12px] mt-0.5" style="color: rgba(255,255,255,0.65);">
                <span v-if="isTable">🪑 Meja {{ session.sessionLabel.value }}</span>
                <span v-else-if="isOpenBill">🧾 Open Bill {{ session.sessionLabel.value }}</span>
                <span v-else>Belum ada sesi aktif</span>
              </p>
            </div>
            <!-- Session type pill -->
            <div
              v-if="session.hasSession.value"
              class="flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold"
              :class="isOpenBill ? 'bg-blue-500 text-white' : 'bg-white/20 text-white'"
            >
              {{ isOpenBill ? 'Open Bill' : 'Meja' }}
            </div>
          </div>
        </div>

        <!-- ─── Open Bill Active Banner ─────────────────── -->
        <div
          v-if="isOpenBill"
          class="flex-shrink-0 bg-blue-600 px-4 py-3 flex items-center gap-3"
        >
          <div class="size-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
            <UIcon name="i-lucide-receipt" class="size-4 !text-white" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-[11px] font-extrabold uppercase tracking-widest" style="color: rgba(255,255,255,0.75);">Open Bill Session</p>
            <p class="text-[13px] font-bold leading-tight" style="color: white;">
              Tambah pesanan ke
              <span v-if="session.sessionLabel.value"> — {{ session.sessionLabel.value }}</span>
            </p>
          </div>
          <!-- Total if available -->
          <div
            v-if="session.openBill.value?.total_amount"
            class="flex-shrink-0 text-right"
          >
            <p class="text-[10px] font-bold" style="color: rgba(255,255,255,0.65);">Total</p>
            <p class="text-[13px] font-extrabold" style="color: white;">
              {{ formatPrice(session.openBill.value.total_amount) }}
            </p>
          </div>
        </div>

        <!-- ─── Body ──────────────────────────────────────── -->
        <div class="flex-1 p-4 overflow-y-auto flex flex-col gap-4">

          <!-- Session Info Card (hanya tampil jika ada sesi) -->
          <SessionInfoCard v-if="session.hasSession.value" />

          <!-- Quick Actions -->
          <SessionQuickActionsCard
            @open-cart="handleOpenCart"
            @scan-code="handleScanCode"
            @exit-session="handleExitSession"
          />
        </div>

        <!-- ─── Footer ─────────────────────────────────────── -->
        <div class="px-4 py-3 border-t border-gray-100 flex-shrink-0">
          <p class="text-[11px] text-center text-gray-400">© {{ new Date().getFullYear() }} Santap App</p>
        </div>
      </div>
    </Transition>

    <!-- Confirm Exit Modal -->
    <SessionConfirmExitSessionModal
      :open="showExitConfirm"
      :has-cart-items="session.hasCart.value"
      :session-mode="session.sessionMode.value"
      @confirm="handleConfirmExit"
      @cancel="handleCancelExit"
    />
  </Teleport>
</template>

<style scoped>
/* ── Transitions ─────────────────────────────────────────── */
.drawer-fade-enter-active,
.drawer-fade-leave-active {
  transition: opacity 0.25s ease;
}

.drawer-fade-enter-from,
.drawer-fade-leave-to {
  opacity: 0;
}

.drawer-slide-left-enter-active,
.drawer-slide-left-leave-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.drawer-slide-left-enter-from,
.drawer-slide-left-leave-to {
  transform: translateX(-100%);
}
</style>
