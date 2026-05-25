<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCustomerSession } from '~/composables/useCustomerSession'
import OrgHeader from '~/components/Layouts/OrgHeader.vue'
import SessionDrawer from '~/components/Layouts/SessionDrawer.vue'
import NotificationsDrawer from '~/components/Layouts/NotificationsDrawer.vue'

/**
 * Layout: org
 * Digunakan oleh semua halaman di /o/[orgSlug]/**
 *
 * Desain Modular:
 * - Menyederhanakan layout dengan membagi Header dan Drawer ke component terpisah
 * - Menggunakan state global via Pinia store untuk sinkronisasi aksi panggil waiter/kasir
 */

const customerSession = useCustomerSession()

const isDrawerOpen = ref(false)
const isNotificationsOpen = ref(false)

onMounted(() => {
  customerSession.restoreLocal()
})
</script>

<template>
  <div class="org-shell">
    <!-- Premium Header Component -->
    <OrgHeader
      @open-drawer="isDrawerOpen = true"
      @open-notifications="isNotificationsOpen = true"
    />

    <!-- Modular Drawer Components -->
    <SessionDrawer
      :is-open="isDrawerOpen"
      @close="isDrawerOpen = false"
      @open-notifications="isNotificationsOpen = true"
    />

    <NotificationsDrawer
      :is-open="isNotificationsOpen"
      @close="isNotificationsOpen = false"
    />

    <!-- Konten halaman -->
    <main class="org-main" id="org-main-content">
      <slot />
    </main>

    <!-- Bottom safe area untuk iPhone notch -->
    <div class="org-safe-area-bottom" aria-hidden="true" />
  </div>
</template>

<style scoped>
/* ── Shell ────────────────────────────────────────────── */
.org-shell {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: #FAF8F3;
  position: relative;
}

/* ── Main Content ─────────────────────────────────────── */
.org-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* ── Bottom Safe Area ─────────────────────────────────── */
.org-safe-area-bottom {
  height: env(safe-area-inset-bottom, 0px);
  flex-shrink: 0;
}
</style>
