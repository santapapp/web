<script setup lang="ts">
/**
 * Layout: order
 *
 * Digunakan oleh halaman /o/[orgSlug]/orders dan /o/[orgSlug]/payments
 *
 * Slideover kiri: SessionDrawer — "Menu Sesi" (identitas org + sesi + aksi cepat)
 * Slideover kanan: OrdersDrawer — "Pesanan Saya" (order aktif + riwayat)
 *
 * State buka/tutup seluruh overlay dikoordinasi via useUiOverlayStore — komponen
 * membaca store sendiri, jadi layout tidak lagi memegang state drawer.
 */

import { onMounted } from 'vue'
import OrgHeader from '~/components/Layouts/OrgHeader.vue'
import SessionDrawer from '~/components/Layouts/SessionDrawer.vue'
import OrdersDrawer from '~/components/Layouts/OrdersDrawer.vue'

const customerSession = useCustomerSession()

onMounted(() => {
  customerSession.restoreLocal()
})
</script>

<template>
  <div class="min-h-dvh bg-gray-50 customer-ordering-layout">
    <OrgHeader max-width-class="max-w-5xl" />

    <!-- Slideover kiri: Menu Sesi -->
    <SessionDrawer />

    <!-- Slideover kanan: Pesanan Saya -->
    <OrdersDrawer />

    <main class="flex min-h-[calc(100dvh-56px)] flex-col lg:min-h-[calc(100dvh-64px)]">
      <slot />
    </main>
  </div>
</template>
