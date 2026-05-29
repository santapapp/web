<script setup lang="ts">
/**
 * OrgIdentityMenu.vue
 * Interactive dropdown displaying restaurant and session information.
 * Uses Nuxt UI UPopover with customizable, responsive styles.
 */

import { ref, computed } from 'vue'
import { useRoute, useRouter } from '#imports'
import { useCustomerSession } from '~/composables/useCustomerSession'
import { usePublicOrg } from '~/composables/usePublicOrg'
import { useOrderHistory } from '~/composables/useOrderHistory'

const emit = defineEmits<{
  'open-orders': []
}>()

const route = useRoute()
const router = useRouter()
const customerSession = useCustomerSession()

// Get org slug from route, or fallback to session org slug
const orgSlug = computed(() => String(route.params.orgSlug || customerSession.organization.value?.slug || ''))

// Fetch public org details
const { org, openingStatus, fullAddress } = usePublicOrg(orgSlug)

// Fetch order history to check for session drawer / orders drawer button visibility
const history = useOrderHistory(orgSlug.value)

// Popover open state
const isPopoverOpen = ref(false)

// Truncated org name for trigger button
const displayName = computed(() => {
  return customerSession.orgName.value || org.value?.name || 'Santap'
})

// Session details for popover card
const modeLabel = computed(() => {
  if (customerSession.sessionMode.value === 'open_bill') return 'Open Bill'
  return 'Pesanan Meja'
})

const modeIcon = computed(() => {
  if (customerSession.sessionMode.value === 'open_bill') return 'i-lucide-receipt'
  return 'i-lucide-armchair'
})

const billStatusConfig = computed(() => {
  const status = customerSession.openBill.value?.status
  if (status === 'locked') return { label: 'Terkunci', color: 'warning' as const }
  if (status === 'closed') return { label: 'Ditutup', color: 'error' as const }
  return { label: 'Aktif', color: 'success' as const }
})

// Clipboard copy functionality (absolute URL, SSR-safe)
const copied = ref(false)
const copyLink = () => {
  if (!import.meta.client) return
  const url = `${window.location.origin}/o/${orgSlug.value}`
  navigator.clipboard.writeText(url)
    .then(() => {
      copied.value = true
      setTimeout(() => {
        copied.value = false
      }, 2000)
    })
    .catch((err) => {
      console.error('Failed to copy link: ', err)
    })
}

// Quick Actions
const navigateToHome = () => {
  isPopoverOpen.value = false
  router.push(`/o/${orgSlug.value}`)
}

const openOrdersDrawer = () => {
  isPopoverOpen.value = false
  emit('open-orders')
}

// Condition to show "Buka Pesanan Saya" button
const shouldShowOrdersBtn = computed(() => {
  return (
    customerSession.hasSession.value === true ||
    history.activeCount.value > 0 ||
    history.items.value.length > 0
  )
})
</script>

<template>
  <UPopover
    v-model:open="isPopoverOpen"
    :content="{ side: 'bottom', align: 'center', sideOffset: 8 }"
    :ui="{ content: 'z-[100]' }"
  >
    <!-- Trigger Button -->
    <button
      class="trigger-btn"
      aria-label="Lihat detail restoran"
    >
      <span class="pin-icon flex items-center justify-center flex-shrink-0">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="#C07B2A" stroke="#C07B2A" stroke-width="1" />
          <circle cx="12" cy="10" r="3" fill="#ffffff" />
        </svg>
      </span>
      <span class="trigger-name truncate">
        {{ displayName }}
      </span>
      <UIcon name="i-lucide-chevron-down" class="chevron-icon size-3.5" />
    </button>

    <!-- Popover Panel -->
    <template #content>
      <div class="popover-panel">
        <!-- Restaurant Brand Info -->
        <div class="brand-section">
          <div class="logo-wrapper">
            <img
              v-if="org?.logo"
              :src="org.logo"
              :alt="org.name"
              class="brand-logo"
            />
            <div v-else class="brand-logo-fallback">
              <UIcon name="i-lucide-store" class="size-5 text-amber-800" />
            </div>
          </div>
          
          <div class="brand-text">
            <h3 class="brand-name">{{ displayName }}</h3>
            <p class="brand-slug">/o/{{ orgSlug }}</p>
          </div>
        </div>

        <!-- Description (if any) -->
        <p v-if="org?.description" class="brand-desc">
          {{ org.description }}
        </p>

        <!-- Operating opening hours status (if valid opening_hours exist) -->
        <div v-if="org?.opening_hours && openingStatus" class="status-section">
          <span
            class="status-dot"
            :class="openingStatus.color"
          />
          <span class="status-label">{{ openingStatus.label }}</span>
        </div>

        <!-- Address (1-2 lines line-clamp) -->
        <div v-if="fullAddress" class="address-section">
          <UIcon name="i-lucide-map-pin" class="address-icon flex-shrink-0" />
          <p class="address-text line-clamp-2">
            {{ fullAddress }}
          </p>
        </div>

        <!-- Active Session Status (if hasSession) -->
        <div v-if="customerSession.hasSession.value" class="session-section">
          <div class="divider" />
          
          <div class="session-card">
            <div class="session-mode-row">
              <div class="session-mode-badge">
                <UIcon :name="modeIcon" class="size-3.5 text-amber-700" />
                <span>{{ modeLabel }}</span>
              </div>
              <UBadge
                :label="billStatusConfig.label"
                :color="billStatusConfig.color"
                variant="soft"
                size="sm"
              />
            </div>
            
            <div v-if="customerSession.sessionLabel.value" class="session-label-row">
              <p class="session-label-text">
                <span v-if="customerSession.sessionMode.value === 'table'">🪑 Meja</span>
                <span v-else>🧾 No. Bill</span>
                &nbsp;
                <strong>{{ customerSession.sessionLabel.value }}</strong>
              </p>
            </div>
          </div>
        </div>

        <div class="divider" />

        <!-- Actions Menu -->
        <div class="actions-menu">
          <!-- Lihat Beranda Restoran -->
          <button
            class="action-btn"
            @click="navigateToHome"
          >
            <UIcon name="i-lucide-home" class="action-icon" />
            <span>Lihat Beranda Restoran</span>
          </button>

          <!-- Salin Link Restoran -->
          <button
            class="action-btn"
            @click="copyLink"
          >
            <UIcon :name="copied ? 'i-lucide-check' : 'i-lucide-copy'" class="action-icon" :class="{ 'text-emerald-600': copied }" />
            <span>{{ copied ? 'Link Tersalin!' : 'Salin Link Restoran' }}</span>
          </button>

          <!-- Buka Pesanan Saya (if hasSession or activeCount > 0 or items.length > 0) -->
          <button
            v-if="shouldShowOrdersBtn"
            class="action-btn primary-action"
            @click="openOrdersDrawer"
          >
            <UIcon name="i-lucide-shopping-bag" class="action-icon" />
            <span>Buka Pesanan Saya</span>
          </button>
        </div>
      </div>
    </template>
  </UPopover>
</template>

<style scoped>


.trigger-btn {
  background: rgba(192, 123, 42, 0.05);
  border: 1px solid rgba(192, 123, 42, 0.15);
  border-radius: 9999px;
  padding: 6px 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  max-width: 140px;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  box-sizing: border-box;
}

@media (min-width: 375px) {
  .trigger-btn {
    max-width: 170px;
  }
}

@media (min-width: 480px) {
  .trigger-btn {
    max-width: 260px;
  }
}

@media (min-width: 640px) {
  .trigger-btn {
    max-width: 340px;
  }
}

.trigger-btn:hover {
  background: rgba(192, 123, 42, 0.1);
  border-color: rgba(192, 123, 42, 0.3);
  transform: translateY(-0.5px);
}

.trigger-btn:active {
  transform: scale(0.97) translateY(0);
}

.trigger-name {
  font-size: 14.5px;
  font-weight: 700;
  color: #1a1714;
  letter-spacing: -0.01em;
}

.chevron-icon {
  color: #8a7f6e;
  flex-shrink: 0;
  transition: transform 0.2s;
}

.trigger-btn[aria-expanded="true"] .chevron-icon {
  transform: rotate(180deg);
}

/* Popover Panel Content styling */
.popover-panel {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 16px -6px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(224, 217, 206, 0.4);
  padding: 14px;
  width: 270px;
  max-width: calc(100vw - 32px);
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-sizing: border-box;
  z-index: 100;
  position: relative;
}

.brand-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-wrapper {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  overflow: hidden;
  background: #fef3c7;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(224, 217, 206, 0.5);
  flex-shrink: 0;
}

.brand-logo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.brand-logo-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-text {
  flex: 1;
  min-width: 0;
}

.brand-name {
  margin: 0;
  font-size: 14.5px;
  font-weight: 800;
  color: #1a1714;
  line-height: 1.25;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.brand-slug {
  margin: 2px 0 0;
  font-size: 11px;
  color: #8a7f6e;
  font-weight: 500;
}

.brand-desc {
  margin: 0;
  font-size: 11.5px;
  color: #6e6456;
  line-height: 1.4;
}

/* Status Section */
.status-section {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.status-dot.green {
  background-color: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}

.status-dot.red {
  background-color: #ef4444;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
}

.status-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  color: #8a7f6e;
}

/* Address */
.address-section {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  color: #8a7f6e;
}

.address-icon {
  margin-top: 1px;
  font-size: 12.5px;
}

.address-text {
  margin: 0;
  font-size: 11.5px;
  line-height: 1.35;
  color: #6e6456;
}

/* Session Section */
.session-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.session-card {
  background: #faf8f3;
  border: 1px solid rgba(224, 217, 206, 0.5);
  border-radius: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.session-mode-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.session-mode-badge {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #8a7f6e;
}

.session-label-row {
  background: #ffffff;
  border-radius: 6px;
  padding: 6px 10px;
  border: 1px solid rgba(224, 217, 206, 0.3);
}

.session-label-text {
  margin: 0;
  font-size: 12px;
  color: #3d3529;
}

.divider {
  height: 1px;
  background: rgba(224, 217, 206, 0.4);
  margin: 2px 0;
}

/* Actions Menu */
.actions-menu {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.action-btn {
  background: #ffffff;
  border: 1px solid rgba(224, 217, 206, 0.4);
  border-radius: 10px;
  padding: 9px 12px;
  font-size: 12.5px;
  font-weight: 600;
  color: #3d3529;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.15s;
  width: 100%;
  box-sizing: border-box;
  text-align: left;
}

.action-btn:hover {
  background: #faf8f3;
  border-color: #c07b2a;
  color: #1a1714;
}

.action-icon {
  font-size: 14px;
  color: #8a7f6e;
  flex-shrink: 0;
  transition: color 0.15s;
}

.action-btn:hover .action-icon {
  color: #c07b2a;
}

.action-btn.primary-action {
  background: #c07b2a;
  border-color: #c07b2a;
  color: #ffffff;
}

.action-btn.primary-action:hover {
  background: #ab6a20;
  border-color: #ab6a20;
}

.action-btn.primary-action .action-icon {
  color: #ffffff;
}
</style>
