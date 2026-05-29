<script setup lang="ts">
/**
 * Layout: order
 *
 * Digunakan oleh halaman /o/[orgSlug]/orders dan /o/[orgSlug]/payments
 *
 * Drawer kiri: SessionDrawer — "Menu Sesi" (info org + sesi + aksi cepat)
 * Drawer kanan: OrdersDrawer — "Pesanan Saya" (order aktif + riwayat)
 *
 * open-cart dari SessionDrawer ditangani di sini dan
 * diteruskan ke halaman via provide (jika dibutuhkan)
 * atau cukup emit ke page melalui event bus sederhana.
 */

import { onMounted, ref } from 'vue'
import OrgHeader from '~/components/Layouts/OrgHeader.vue'
import SessionDrawer from '~/components/Layouts/SessionDrawer.vue'
import OrdersDrawer from '~/components/Layouts/OrdersDrawer.vue'

const customerSession = useCustomerSession()

const isSessionDrawerOpen = ref(false)
const isOrdersDrawerOpen = ref(false)

// open-cart: emit dari SessionDrawer saat user menekan "Lihat Keranjang" di mobile
// Kita provide state ini agar page orders.vue bisa subscribe jika perlu
const cartOpenRequested = ref(false)

const handleOpenCart = () => {
  isSessionDrawerOpen.value = false
  cartOpenRequested.value = true
  // Reset setelah satu tick agar watcher di page bisa mendeteksi perubahan
  nextTick(() => { cartOpenRequested.value = false })
}

// Provide ke child pages
provide('cartOpenRequested', cartOpenRequested)

const handleOpenScanner = () => {
  isSessionDrawerOpen.value = false
  // Scanner dihandle di page orders.vue — tidak perlu forward dari layout
  // karena SessionDrawer sudah emit 'open-scanner' ke sini,
  // dan halaman sudah punya state showScanner sendiri.
  // Di sini kita hanya log untuk development.
}

onMounted(() => {
  customerSession.restoreLocal()
})
</script>

<template>
  <div class="min-h-dvh bg-gray-50">
    <OrgHeader
      @open-drawer="isSessionDrawerOpen = true"
      @open-orders="isOrdersDrawerOpen = true"
    />

    <!-- Drawer kiri: Menu Sesi -->
    <SessionDrawer
      :is-open="isSessionDrawerOpen"
      @close="isSessionDrawerOpen = false"
      @open-cart="handleOpenCart"
      @open-scanner="handleOpenScanner"
    />

    <!-- Drawer kanan: Pesanan Saya -->
    <OrdersDrawer
      :is-open="isOrdersDrawerOpen"
      @close="isOrdersDrawerOpen = false"
    />

    <main class="flex min-h-[calc(100dvh-56px)] flex-col lg:min-h-[calc(100dvh-64px)]">
      <slot />
    </main>
  </div>
</template>
