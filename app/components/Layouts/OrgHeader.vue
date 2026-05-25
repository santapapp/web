<script setup lang="ts">
import { useRoute } from '#imports'
import { useCustomerSession } from '~/composables/useCustomerSession'
import { useWaiterCallStore } from '~/stores/waiter-call.store'

defineEmits<{
  openDrawer: []
  openNotifications: []
}>()

const route = useRoute()
const customerSession = useCustomerSession()
const waiterCallStore = useWaiterCallStore()

const formatOrgSlug = (slug: string | string[] | undefined) => {
  if (!slug) return ''
  const s = Array.isArray(slug) ? slug[0] : slug
  if (!s) return ''
  return s
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
</script>

<template>
  <header class="premium-header">
    <div class="header-inner">
      <!-- Left: Hamburger button -->
      <button
        class="icon-btn hamburger-btn"
        aria-label="Buka menu"
        @click="$emit('openDrawer')"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>

      <!-- Center: Pin + Restaurant/Organization Name -->
      <div class="header-location">
        <span class="pin-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="geo-pin">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="#ea4335" stroke="#ea4335" stroke-width="1"/>
            <circle cx="12" cy="10" r="3" fill="#ffffff"/>
          </svg>
        </span>
        <span class="location-name">
          {{ customerSession.orgName.value || formatOrgSlug(route.params.orgSlug) || 'Santap' }}
        </span>
      </div>

      <!-- Right: Action button (Notification Bell) -->
      <div class="header-actions">
        <button
          class="icon-btn action-btn"
          aria-label="Notifikasi & Panggilan"
          @click="$emit('openNotifications')"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <span v-if="waiterCallStore.hasActiveRequests" class="notification-badge-dot" />
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
  background: rgba(250, 248, 243, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(224, 217, 206, 0.6);
  height: 56px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
}

.header-inner {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.icon-btn {
  background: transparent;
  border: none;
  color: #1a1714;
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
  background: rgba(26, 23, 20, 0.05);
}

.icon-btn:active {
  transform: scale(0.95);
}

.header-location {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1a1714;
}

.pin-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.location-name {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: #1a1714;
}

.notification-badge-dot {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  background: #ff4d4f;
  border-radius: 50%;
  border: 1.5px solid #FAF8F3;
}
</style>
