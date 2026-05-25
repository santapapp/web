<script setup lang="ts">
import { useRoute, useRouter } from '#imports'
import { useCustomerSession } from '~/composables/useCustomerSession'
import { useWaiterCallStore } from '~/stores/waiter-call.store'

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  openNotifications: []
}>()

const route = useRoute()
const router = useRouter()
const customerSession = useCustomerSession()
const waiterCallStore = useWaiterCallStore()

const handleCallWaiter = () => {
  waiterCallStore.callWaiter()
  emit('close')
  emit('openNotifications')
}

const handleCallCashier = async () => {
  emit('close')
  emit('openNotifications')
  const result = await waiterCallStore.callCashier()
  if (!result.success && result.error) {
    alert(result.error.message || 'Gagal memanggil kasir. Silakan coba lagi.')
  }
}

const handleResetSession = () => {
  if (confirm('Apakah Anda yakin ingin keluar dari sesi meja ini? Anda perlu memindai QR meja kembali untuk memesan.')) {
    customerSession.clearSession()
    emit('close')
    router.push(`/o/${route.params.orgSlug}`)
  }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="drawer-overlay" @click="$emit('close')">
      <div class="drawer-content" @click.stop>
        <div class="drawer-header">
          <div class="drawer-title-group">
            <h3>Menu Sesi</h3>
            <p v-if="customerSession.tableName.value" class="drawer-table">🪑 Meja {{ customerSession.tableName.value }}</p>
          </div>
          <button class="drawer-close" @click="$emit('close')" aria-label="Tutup menu">✕</button>
        </div>
        <div class="drawer-body">
          <div class="drawer-section">
            <h4 class="section-title">Informasi Restoran</h4>
            <div class="info-card">
              <p class="info-label">Restoran</p>
              <p class="info-val">{{ customerSession.orgName.value || '-' }}</p>
            </div>
            <div class="info-card" v-if="customerSession.tableName.value">
              <p class="info-label">Nomor Meja</p>
              <p class="info-val">{{ customerSession.tableName.value }}</p>
            </div>
          </div>

          <div class="drawer-section">
            <h4 class="section-title">Aksi Cepat</h4>
            <button class="drawer-btn" @click="handleCallWaiter">
              <span>💁‍♂️ Panggil Pelayan</span>
            </button>
            <button class="drawer-btn" @click="handleCallCashier" :disabled="!customerSession.openBill.value">
              <span>💰 Panggil Kasir / Minta Tagihan</span>
            </button>
            <button class="drawer-btn danger-btn" @click="handleResetSession">
              <span>🚪 Ganti Meja / Keluar Sesi</span>
            </button>
          </div>
        </div>
        <div class="drawer-footer">
          <p>© Santap App</p>
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
  justify-content: flex-start;
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
  box-shadow: 4px 0 24px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
  animation: slideInLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideInLeft {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

.drawer-header {
  padding: 20px 16px 16px;
  border-bottom: 1px solid rgba(224, 217, 206, 0.6);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.drawer-title-group h3 {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  color: #1a1714;
}

.drawer-table {
  margin: 4px 0 0;
  font-size: 13px;
  font-weight: 600;
  color: #c07b2a;
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

.drawer-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  margin: 0 0 4px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #8a7f6e;
}

.info-card {
  background: white;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid rgba(224, 217, 206, 0.4);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-label {
  margin: 0;
  font-size: 13px;
  color: #8a7f6e;
}

.info-val {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #1a1714;
}

.drawer-btn {
  background: white;
  border: 1px solid rgba(224, 217, 206, 0.6);
  border-radius: 12px;
  padding: 14px;
  font-size: 14px;
  font-weight: 600;
  color: #1a1714;
  cursor: pointer;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: background 0.15s, border-color 0.15s;
  width: 100%;
  box-sizing: border-box;
}

.drawer-btn:hover {
  background: #fdfdfb;
  border-color: #c07b2a;
}

.drawer-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.danger-btn {
  color: #ff4d4f;
  border-color: rgba(255, 77, 79, 0.2);
}

.danger-btn:hover {
  background: rgba(255, 77, 79, 0.03);
  border-color: #ff4d4f;
}

.drawer-footer {
  padding: 16px;
  border-top: 1px solid rgba(224, 217, 206, 0.6);
  text-align: center;
}

.drawer-footer p {
  margin: 0;
  font-size: 12px;
  color: #8a7f6e;
}
</style>
