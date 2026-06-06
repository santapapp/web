<script setup lang="ts">
/**
 * SessionDrawer — Slideover kiri "Menu Sesi"
 *
 * Pusat identitas org + info sesi + aksi cepat. State buka/tutup dikoordinasi
 * via useUiOverlayStore (single source of truth). Migrasi ke Nuxt UI USlideover
 * → overlay, scroll-lock, z-index otomatis.
 *
 * Berisi:
 * - Header clean (logo + nama + slug + close)
 * - Open Bill Banner (mode open_bill, soft style)
 * - Org info card (status buka, alamat, deskripsi)
 * - SessionInfoCard: detail sesi aktif
 * - QuickActionsCard: aksi cepat (keranjang / ganti meja / keluar sesi)
 * - Aksi org: beranda, salin link, buka pesanan saya
 */

import { useRoute, useRouter } from '#imports'

const route = useRoute()
const router = useRouter()
const session = useCustomerSession()
const overlay = useUiOverlayStore()
const { sessionMode, clearSession } = session

const orgSlug = computed(() =>
  String(route.params.orgSlug || session.organization.value?.slug || '')
)

// Data publik org untuk section identitas
const { org, openingStatus, fullAddress } = usePublicOrg(orgSlug)

// Riwayat untuk menentukan visibilitas tombol "Buka Pesanan Saya"
const history = useOrderHistory(orgSlug.value)

const showExitConfirm = ref(false)

const isOpenBill = computed(() => sessionMode.value === 'open_bill')

const shouldShowOrdersBtn = computed(() =>
  session.hasSession.value === true ||
  history.activeCount.value > 0 ||
  history.items.value.length > 0
)

// ── Aksi sesi ──────────────────────────────────────────────
const handleExitSession = () => {
  showExitConfirm.value = true
}

const handleConfirmExit = () => {
  clearSession()
  showExitConfirm.value = false
  overlay.close('session')
  router.push(`/o/${orgSlug.value}`)
}

const handleCancelExit = () => {
  showExitConfirm.value = false
}

const handleScanCode = () => {
  overlay.open('scanner')
}

const handleOpenCart = () => {
  overlay.open('cart')
}

// ── Aksi org ───────────────────────────────────────────────
const navigateToHome = () => {
  overlay.close('session')
  router.push(`/o/${orgSlug.value}`)
}

const openOrders = () => {
  overlay.open('orders')
}
// Actions no longer needed in drawer body

const formatPrice = (v: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(v)
</script>

<template>
  <!--
  Tailwind Safelist for Nuxt UI USlideover:
  fixed inset-y-0 left-0 bg-default bg-elevated/75 focus:outline-none divide-y divide-default sm:ring ring-default
  -->
  <USlideover
    :open="overlay.isSession"
    side="left"
    title="Menu Sesi"
    :ui="{ content: 'w-[85%] max-w-[340px]' }"
    @update:open="(v: boolean) => { if (!v) overlay.close('session') }"
  >
    <template #content>
      <div class="flex flex-col h-full bg-gray-50 overflow-hidden">

        <!-- ─── Clean White Top Bar ────────────────────────── -->
        <div class="bg-white border-b border-gray-100 px-4 py-3.5 flex-shrink-0">
          <div class="flex items-center gap-3">
            <!-- Clickable Profile Link to Home Page -->
            <button
              class="flex items-center gap-3 flex-1 min-w-0 text-left hover:opacity-80 transition-opacity duration-150 cursor-pointer focus:outline-none"
              aria-label="Kembali ke Beranda Restoran"
              @click="navigateToHome"
            >
              <!-- Logo / Avatar -->
              <div class="size-9 rounded-lg overflow-hidden flex-shrink-0 bg-orange-50 border border-orange-100/70 flex items-center justify-center shadow-sm">
                <img
                  v-if="org?.logo"
                  :src="org.logo"
                  :alt="org.name"
                  class="w-full h-full object-cover"
                />
                <UIcon v-else name="i-lucide-store" class="size-4.5 text-orange-600" />
              </div>

              <!-- Name only - no slug -->
              <div class="flex-1 min-w-0">
                <p class="text-[13.5px] font-extrabold text-gray-900 leading-tight line-clamp-2">
                  {{ session.orgName.value || org?.name || 'Restoran' }}
                </p>
              </div>
            </button>

            <!-- Close button -->
            <button
              class="motion-btn size-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 active:scale-90 transition-all duration-150 cursor-pointer flex-shrink-0"
              aria-label="Tutup drawer"
              @click="overlay.close('session')"
            >
              <UIcon name="i-lucide-x" class="size-4 text-gray-600" />
            </button>
          </div>
        </div>

        <!-- ─── Body ──────────────────────────────────────── -->
        <div class="flex-1 p-4 overflow-y-auto flex flex-col gap-4">

          <!-- Restaurant info card removed from drawer body -->
          <!-- Session Info Card (hanya tampil jika ada sesi aktif) -->
          <SessionInfoCard v-if="session.hasSession.value" />

          <!-- Empty state: tidak ada sesi aktif -->
          <div
            v-else
            class="rounded-xl border border-gray-100 bg-white p-4 flex flex-col gap-3 shadow-sm"
          >
            <div class="flex items-center gap-2.5">
              <div class="size-9 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                <UIcon name="i-lucide-circle-off" class="size-4 text-gray-400" />
              </div>
              <div>
                <p class="text-[13px] font-extrabold text-gray-700 leading-tight">Belum ada sesi aktif</p>
                <p class="text-[11px] text-gray-400 font-medium mt-0.5 leading-snug">
                  Scan QR meja atau masukkan kode untuk mulai memesan.
                </p>
              </div>
            </div>
            <div class="flex flex-col gap-1.5">
              <button
                class="motion-btn w-full bg-gray-900 rounded-lg px-3 py-2.5 text-[12px] font-bold text-white cursor-pointer flex items-center gap-2.5 hover:bg-gray-800 active:scale-[0.98] transition-all duration-150"
                @click="() => { overlay.close('session'); overlay.open('scanner') }"
              >
                <UIcon name="i-lucide-scan-line" class="size-3.5 text-orange-400 shrink-0" />
                <span>Scan QR Meja</span>
              </button>
            </div>
          </div>

          <!-- Quick Actions -->
          <SessionQuickActionsCard
            @open-cart="handleOpenCart"
            @scan-code="handleScanCode"
            @exit-session="handleExitSession"
          />

          <!-- Org Actions -->
          <div v-if="shouldShowOrdersBtn" class="flex flex-col gap-1.5">
            <!-- Buka Pesanan Saya -->
            <button
              class="motion-btn w-full bg-orange-600 border border-orange-600 rounded-xl px-3.5 py-2.5 text-[13px] font-semibold text-white cursor-pointer flex items-center justify-between gap-3 hover:bg-orange-700 active:scale-[0.98] transition-all duration-150"
              aria-label="Buka pesanan saya"
              @click="openOrders"
            >
              <div class="flex items-center gap-3">
                <span class="size-7 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                  <UIcon name="i-lucide-shopping-bag" class="size-3.5 text-white" />
                </span>
                <span>Buka Pesanan Saya</span>
              </div>
              <UIcon name="i-lucide-chevron-right" class="size-4 text-white/70 flex-shrink-0" />
            </button>
          </div>        </div>

        <!-- ─── Footer ────────────────────────────────────── -->
        <div class="px-4 py-3 border-t border-gray-100 flex-shrink-0 bg-white flex justify-center">
          <NuxtLink
            to="/"
            class="text-[11px] text-gray-400 hover:text-gray-600 hover:underline transition-all duration-200 cursor-pointer block"
            aria-label="Kembali ke Beranda Santap App"
          >
            © {{ new Date().getFullYear() }} Santap App
          </NuxtLink>
        </div>
      </div>
    </template>
  </USlideover>

  <!-- Confirm Exit Modal -->
  <SessionConfirmExitSessionModal
    :open="showExitConfirm"
    :has-cart-items="session.hasCart.value"
    :session-mode="session.sessionMode.value"
    @confirm="handleConfirmExit"
    @cancel="handleCancelExit"
  />
</template>
