<script setup lang="ts">
import { useWaiterCallStore } from '~/stores/waiter-call.store'

defineProps<{
  isOpen: boolean
}>()

defineEmits<{
  close: []
}>()

const waiterCallStore = useWaiterCallStore()

const handleCallWaiter = () => {
  waiterCallStore.callWaiter()
}

const handleCallCashier = async () => {
  const result = await waiterCallStore.callCashier()
  if (!result.success && result.error) {
    alert(result.error.message || 'Gagal memanggil kasir. Silakan coba lagi.')
  }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="drawer-overlay" @click="$emit('close')">
      <div class="drawer-content right-drawer" @click.stop>
        <div class="drawer-header">
          <h3>Panggilan & Notifikasi</h3>
          <button class="drawer-close" @click="$emit('close')">✕</button>
        </div>
        <div class="drawer-body">
          <div class="waiter-status-box">
            <h4>Pelayan</h4>
            <div v-if="waiterCallStore.waiterCallStatus === 'pending'" class="status-indicator warning">
              <span class="pulse-dot"></span>
              <span>{{ waiterCallStore.waiterCallMessage }}</span>
            </div>
            <div v-else-if="waiterCallStore.waiterCallStatus === 'success'" class="status-indicator success">
              <span>✅ {{ waiterCallStore.waiterCallMessage }}</span>
            </div>
            <div v-else class="status-indicator idle">
              <span>Tidak ada panggilan aktif</span>
            </div>
            <button class="btn-call-waiter-primary" @click="handleCallWaiter" :disabled="waiterCallStore.waiterCallStatus === 'pending'">
              💁‍♂️ Panggil Pelayan Sekarang
            </button>
          </div>

          <div class="waiter-status-box">
            <h4>Kasir</h4>
            <div v-if="waiterCallStore.cashierCallStatus === 'pending'" class="status-indicator warning">
              <span class="pulse-dot"></span>
              <span>{{ waiterCallStore.cashierCallMessage }}</span>
            </div>
            <div v-else-if="waiterCallStore.cashierCallStatus === 'success'" class="status-indicator success">
              <span>✅ {{ waiterCallStore.cashierCallMessage }}</span>
            </div>
            <div v-else class="status-indicator idle">
              <span>Tidak ada panggilan aktif</span>
            </div>
            <button class="btn-call-waiter-primary" @click="handleCallCashier" :disabled="waiterCallStore.cashierCallStatus === 'pending'">
              💰 Panggil Kasir / Tagihan
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.drawer-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(13, 11, 9, 0.4);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  justify-content: flex-end;
  animation: fadeIn 0.25s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.drawer-content {
  width: 85%;
  max-width: 320px;
  height: 100%;
  background: #FAF8F3;
  box-shadow: -4px 0 24px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
  animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideInRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.drawer-header {
  padding: 20px 16px 16px;
  border-bottom: 1px solid rgba(224, 217, 206, 0.6);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.drawer-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1a1714;
}

.drawer-close {
  background: transparent;
  border: none;
  font-size: 20px;
  color: #8a7f6e;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.drawer-body {
  flex: 1;
  padding: 20px 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Waiter Status Box */
.waiter-status-box {
  background: white;
  border-radius: 16px;
  border: 1px solid rgba(224, 217, 206, 0.6);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.waiter-status-box h4 {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: #1a1714;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
}

.status-indicator.idle {
  background: #f5f3ee;
  color: #8a7f6e;
}

.status-indicator.warning {
  background: #fff8eb;
  color: #c07b2a;
}

.status-indicator.success {
  background: #e8f5e9;
  color: #388e3c;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: #f09c33;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: scale(0.9); opacity: 0.6; }
  50% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(0.9); opacity: 0.6; }
}

.btn-call-waiter-primary {
  background: #c07b2a;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 12px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.15s;
  width: 100%;
}

.btn-call-waiter-primary:hover {
  background: #9a6020;
}

.btn-call-waiter-primary:disabled {
  background: #d5cfc5;
  cursor: not-allowed;
}
</style>
