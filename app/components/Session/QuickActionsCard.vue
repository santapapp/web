<script setup lang="ts">
/**
 * QuickActionsCard — Aksi cepat di session drawer kiri
 *
 * Emits:
 * - open-cart: buka cart (mobile — di desktop sudah ada CartSidebar)
 * - scan-code: buka scanner / input kode ulang
 * - exit-session: trigger confirm modal keluar sesi
 */

defineEmits<{
  'open-cart': []
  'scan-code': []
  'exit-session': []
}>()

const session = useCustomerSession()
</script>

<template>
  <div class="quick-actions">
    <h4 class="section-title">Aksi Cepat</h4>

    <!-- Lihat Keranjang (mobile: tampil selalu, desktop: hidden karena ada sidebar) -->
    <button
      class="action-btn"
      aria-label="Lihat keranjang belanja"
      @click="$emit('open-cart')"
    >
      <div class="action-btn-left">
        <span class="action-icon">
          <UIcon name="i-lucide-shopping-bag" class="size-4 text-amber-700" />
        </span>
        <span>Lihat Keranjang</span>
      </div>
      <UIcon name="i-lucide-chevron-right" class="size-4 text-gray-400" />
    </button>

    <!-- Scan / Input Ulang Kode -->
    <button
      v-if="session.hasSession.value"
      class="action-btn"
      aria-label="Scan atau input ulang kode meja"
      @click="$emit('scan-code')"
    >
      <div class="action-btn-left">
        <span class="action-icon">
          <UIcon name="i-lucide-scan-line" class="size-4 text-gray-600" />
        </span>
        <span>Scan / Input Ulang Kode</span>
      </div>
      <UIcon name="i-lucide-chevron-right" class="size-4 text-gray-400" />
    </button>

    <!-- Ganti Meja / Keluar Sesi (danger) -->
    <button
      v-if="session.hasSession.value"
      class="action-btn danger"
      aria-label="Keluar dari sesi ini"
      @click="$emit('exit-session')"
    >
      <div class="action-btn-left">
        <span class="action-icon danger-icon">
          <UIcon name="i-lucide-log-out" class="size-4 text-red-500" />
        </span>
        <span>Ganti Meja / Keluar Sesi</span>
      </div>
      <UIcon name="i-lucide-chevron-right" class="size-4 text-red-300" />
    </button>
  </div>
</template>

<style scoped>
.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-title {
  margin: 0 0 4px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #8a7f6e;
}

.action-btn {
  background: white;
  border: 1px solid rgba(224, 217, 206, 0.6);
  border-radius: 12px;
  padding: 13px 14px;
  font-size: 13.5px;
  font-weight: 600;
  color: #1a1714;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: background 0.15s, border-color 0.15s;
  width: 100%;
  box-sizing: border-box;
  text-align: left;
}

.action-btn:hover {
  background: #fdfdfb;
  border-color: #c07b2a;
}

.action-btn-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.action-icon {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: #faf8f3;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.danger-icon {
  background: #fff1f0;
}

.action-btn.danger {
  color: #e53e3e;
  border-color: rgba(229, 62, 62, 0.2);
}

.action-btn.danger:hover {
  background: #fff5f5;
  border-color: #fc8181;
}
</style>
