<script setup lang="ts">
/**
 * SessionDrawer — Drawer kiri "Menu Sesi"
 *
 * Berisi:
 * - SessionInfoCard: info org & sesi aktif (table/open_bill)
 * - QuickActionsCard: aksi cepat
 * - ConfirmExitSessionModal: konfirmasi keluar sesi
 *
 * Emits:
 * - close: tutup drawer
 * - open-cart: buka cart (mobile)
 * - open-scanner: buka QR scanner (dari quick actions)
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

const showExitConfirm = ref(false)

const handleExitSession = () => {
  showExitConfirm.value = true
}

const handleConfirmExit = () => {
  session.clearSession()
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
</script>

<template>
  <Teleport to="body">
    <!-- Overlay -->
    <Transition name="drawer-fade">
      <div
        v-if="isOpen"
        class="drawer-overlay"
        aria-label="Tutup menu sesi"
        @click="$emit('close')"
      />
    </Transition>

    <!-- Drawer panel -->
    <Transition name="drawer-slide-left">
      <div
        v-if="isOpen"
        class="drawer-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Menu Sesi"
        @click.stop
      >
        <!-- Header -->
        <div class="drawer-header">
          <div class="drawer-header-left">
            <div class="drawer-header-icon">
              <UIcon name="i-lucide-layout-dashboard" class="size-4 text-amber-700" />
            </div>
            <h2 class="drawer-title">Menu Sesi</h2>
          </div>
          <button
            class="close-btn"
            aria-label="Tutup drawer"
            @click="$emit('close')"
          >
            <UIcon name="i-lucide-x" class="size-5" />
          </button>
        </div>

        <!-- Body -->
        <div class="drawer-body">
          <!-- Session Info Card -->
          <SessionInfoCard />

          <!-- Quick Actions -->
          <SessionQuickActionsCard
            @open-cart="handleOpenCart"
            @scan-code="handleScanCode"
            @exit-session="handleExitSession"
          />
        </div>

        <!-- Footer -->
        <div class="drawer-footer">
          <p>© {{ new Date().getFullYear() }} Santap App</p>
        </div>
      </div>
    </Transition>

    <!-- Confirm Exit Modal (di luar drawer agar tidak ter-clip) -->
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
  left: 0;
  bottom: 0;
  z-index: 101;
  width: 85%;
  max-width: 320px;
  background: #FAF8F3;
  box-shadow: 4px 0 32px rgba(0, 0, 0, 0.15);
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
}

.drawer-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #1a1714;
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
  gap: 20px;
}

.drawer-footer {
  padding: 14px 16px;
  border-top: 1px solid rgba(224, 217, 206, 0.5);
  text-align: center;
  flex-shrink: 0;
}

.drawer-footer p {
  margin: 0;
  font-size: 11px;
  color: #a09080;
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

.drawer-slide-left-enter-active,
.drawer-slide-left-leave-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.drawer-slide-left-enter-from,
.drawer-slide-left-leave-to {
  transform: translateX(-100%);
}
</style>
