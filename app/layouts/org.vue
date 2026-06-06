<script setup lang="ts">
import { onMounted } from 'vue'
import { useCustomerSession } from '~/composables/useCustomerSession'
import OrgHeader from '~/components/Layouts/OrgHeader.vue'
import SessionDrawer from '~/components/Layouts/SessionDrawer.vue'
import OrdersDrawer from '~/components/Layouts/OrdersDrawer.vue'

/**
 * Layout: org
 * Digunakan oleh semua halaman di /o/[orgSlug]/**
 *
 * Drawer kiri: SessionDrawer — "Menu Sesi"
 * Drawer kanan: OrdersDrawer — "Pesanan Saya"
 */

const customerSession = useCustomerSession()

onMounted(() => {
  customerSession.restoreLocal()
})
</script>

<template>
  <div class="org-shell">
    <!-- Header -->
    <OrgHeader />

    <!-- Slideover kiri: Menu Sesi -->
    <SessionDrawer />

    <!-- Slideover kanan: Pesanan Saya -->
    <OrdersDrawer />

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
  background: #F4F4F4;
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
