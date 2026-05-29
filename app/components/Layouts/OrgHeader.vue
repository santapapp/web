<script setup lang="ts">
/**
 * OrgHeader — Header utama halaman order
 *
 * Kiri: hamburger → buka SessionDrawer (drawer kiri "Menu Sesi")
 * Tengah: nama restoran
 * Kanan: icon orders → buka OrdersDrawer (drawer kanan "Pesanan Saya")
 *        Badge hanya muncul jika ada order aktif/pending
 */

import { useRoute } from '#imports'

defineEmits<{
  openDrawer: []
  openOrders: []
}>()

const route = useRoute()

const orgSlug = computed(() => String(route.params.orgSlug || ''))

// History untuk badge count (hanya order aktif/pending)
const history = useOrderHistory(orgSlug.value)
const activeOrderCount = history.activeCount
</script>

<template>
  <header class="premium-header">
    <div class="header-inner">
      <!-- Left: Hamburger → Session Drawer -->
      <button
        class="icon-btn hamburger-btn"
        aria-label="Buka menu sesi"
        @click="$emit('openDrawer')"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="8" x2="21" y2="8" />
          <line x1="3" y1="16" x2="21" y2="16" />
        </svg>
      </button>

      <!-- Center: OrgIdentityMenu Dropdown -->
      <div class="header-location">
        <LayoutsOrgIdentityMenu @open-orders="$emit('openOrders')" />
      </div>

      <!-- Right: Orders Icon → Orders Drawer -->
      <div class="header-actions">
        <button
          class="icon-btn action-btn"
          aria-label="Lihat pesanan saya"
          @click="$emit('openOrders')"
        >
          <!-- Shopping bag icon -->
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          <!-- Badge: jumlah order aktif/pending -->
          <span v-if="activeOrderCount > 0" class="order-badge">
            {{ activeOrderCount > 9 ? '9+' : activeOrderCount }}
          </span>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.premium-header {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 40;
  background: rgba(255, 255, 255, 0.97);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid #F0F0F0;
  height: 56px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
}

@media (min-width: 1024px) {
  .premium-header {
    height: 64px;
  }
}

.header-inner {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

@media (min-width: 768px) {
  .header-inner {
    padding: 0 24px;
  }
}

@media (min-width: 1024px) {
  .header-inner {
    padding: 0 40px;
  }
}

.icon-btn {
  background: transparent;
  border: none;
  color: #111111;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  padding: 0;
  position: relative;
}

.icon-btn:hover {
  background: rgba(0, 0, 0, 0.05);
}

.icon-btn:active {
  transform: scale(0.92);
}

.header-location {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #111111;
}

.pin-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.location-name {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #111111;
}

@media (min-width: 1024px) {
  .location-name {
    font-size: 17px;
  }
}

.header-actions {
  display: flex;
  align-items: center;
}

/* Badge — hanya untuk order aktif/pending */
.order-badge {
  position: absolute;
  top: 6px;
  right: 6px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 8px;
  background: #c07b2a;
  color: white;
  font-size: 9px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid white;
  line-height: 1;
}
</style>
