<script setup lang="ts">
/**
 * SessionDrawer — Slideover kiri "Menu Sesi"
 *
 * Pusat identitas org + info sesi + aksi cepat. State buka/tutup dikoordinasi
 * via useUiOverlayStore (single source of truth).
 *
 * MIGRATION: USlideover → Teleport + Transition manual
 * - Animasi slide dari kiri dengan cubic-bezier yang smooth
 * - Overlay fade in/out independen dari panel slide
 * - Body scroll-lock konsisten dengan CartSheet & OrdersDrawer
 * - ConfirmExitSessionModal menggunakan Teleport sendiri (z-[200]), tampil
 *   di atas drawer tanpa masalah stacking context
 *
 * Berisi:
 * - Header clean (logo + nama + slug + close)
 * - SessionInfoCard: detail sesi aktif
 * - QuickActionsCard: aksi cepat (keranjang / ganti meja / keluar sesi)
 * - Aksi org: beranda, buka pesanan saya
 */

import { useRoute, useRouter } from '#imports'
import { watch, onUnmounted } from 'vue'

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

// ── Body scroll-lock — konsisten dengan CartSheet & OrdersDrawer ──
watch(
  () => overlay.isSession,
  (isOpen) => {
    if (import.meta.client) {
      document.body.style.overflow = isOpen ? 'hidden' : ''
    }
  },
  { immediate: true }
)

onUnmounted(() => {
  if (import.meta.client) document.body.style.overflow = ''
})

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

const handleScanCode = async () => {
  await overlay.openSafely('scanner')
}

const handleOpenCart = async () => {
  await overlay.openSafely('cart')
}

// ── Aksi org ───────────────────────────────────────────────
const navigateToHome = () => {
  overlay.close('session')
  router.push(`/o/${orgSlug.value}`)
}

const openOrders = async () => {
  await overlay.openSafely('orders')
}

const handleInlineScan = async () => {
  await overlay.openSafely('scanner')
}

const formatPrice = (v: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(v)

const billStatusConfigLabel = computed(() => {
  const status = session.openBill.value?.status
  if (status === 'locked') return 'Terkunci'
  if (status === 'closed') return 'Ditutup'
  return 'Aktif'
})

const billStatusConfigClass = computed(() => {
  const status = session.openBill.value?.status
  if (status === 'locked') return 'bg-amber-50 text-amber-700 border border-amber-200'
  if (status === 'closed') return 'bg-rose-50 text-rose-700 border border-rose-200'
  return 'bg-emerald-50 text-emerald-700 border border-emerald-200'
})
</script>

<template>
  <Teleport to="body">
    <Transition name="session-drawer">
      <div
        v-if="overlay.isSession"
        class="fixed inset-0 z-50 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Menu Sesi"
      >
        <!-- Backdrop (klik untuk tutup) -->
        <div
          class="absolute inset-0 bg-black/45 backdrop-blur-xs"
          @click="overlay.close('session')"
        />

        <!-- Panel — slide dari kiri -->
        <div class="session-panel absolute inset-y-0 left-0 w-[85%] max-w-[340px] h-full shadow-2xl flex flex-col bg-gray-50 overflow-hidden outline-none">

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

                <!-- Name only -->
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

          <!-- Banner Ringkasan Open Bill (Full Width) -->
          <div
            v-if="isOpenBill && session.hasSession.value"
            class="bg-emerald-50/50 border-b border-emerald-100 px-4 py-3.5 flex flex-col gap-2 flex-shrink-0"
          >
            <!-- Top line: Label Open Bill + status singkat -->
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800/80">Open Bill</span>
              <span
                class="px-2 py-0.5 rounded-full text-[9px] font-bold"
                :class="billStatusConfigClass"
              >
                {{ billStatusConfigLabel }}
              </span>
            </div>

            <!-- Bottom line: Nomor Bill + Total Tagihan -->
            <div class="flex items-center justify-between gap-4">
              <!-- Bill Number -->
              <div class="flex items-center gap-2 min-w-0">
                <UIcon name="i-lucide-receipt" class="size-4 text-emerald-700 shrink-0" />
                <span class="text-xs font-black text-emerald-950 font-mono truncate leading-none">
                  {{ session.sessionLabel.value }}
                </span>
              </div>
              
              <!-- Total tagihan -->
              <div
                v-if="session.openBill.value?.total_amount"
                class="text-right shrink-0"
              >
                <span class="text-xs font-black text-orange-600">
                  {{ formatPrice(session.openBill.value.total_amount) }}
                </span>
              </div>
            </div>
          </div>

          <!-- ─── Body ──────────────────────────────────────── -->
          <div class="flex-1 p-4 overflow-y-auto flex flex-col">
            <!-- Active Session Area -->
            <template v-if="session.hasSession.value">
              <div class="flex-1 flex flex-col justify-between min-h-0">
                <div class="space-y-3">
                  <!-- Session Info Card (only for Table Order) -->
                  <SessionInfoCard v-if="!isOpenBill" />

                  <!-- Lihat Keranjang (Solid Light Neutral) -->
                  <button
                    class="motion-btn w-full bg-stone-100 rounded-xl px-3.5 py-3 text-[13px] font-semibold text-stone-800 cursor-pointer flex items-center justify-between gap-3 hover:bg-stone-200/85 transition-all duration-150"
                    aria-label="Lihat keranjang belanja"
                    @click="handleOpenCart"
                  >
                    <div class="flex items-center gap-3">
                      <span class="size-8 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                        <UIcon name="i-lucide-shopping-bag" class="size-4 text-orange-600" />
                      </span>
                      <span>Lihat Keranjang</span>
                    </div>
                    <UIcon name="i-lucide-chevron-right" class="size-4 text-stone-400 flex-shrink-0" />
                  </button>

                  <!-- Buka Pesanan Saya (Primary Action - Solid Orange) -->
                  <button
                    v-if="shouldShowOrdersBtn"
                    class="motion-btn w-full bg-orange-600 border border-orange-600 rounded-xl px-3.5 py-2.5 text-[13px] font-semibold text-white cursor-pointer flex items-center justify-between gap-3 hover:bg-orange-700 active:scale-[0.98] transition-all duration-150 shadow-sm"
                    aria-label="Buka pesanan saya"
                    @click="openOrders"
                  >
                    <div class="flex items-center gap-3">
                      <span class="size-8 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                        <UIcon name="i-lucide-clipboard-list" class="size-4 text-white" />
                      </span>
                      <span>Buka Pesanan Saya</span>
                    </div>
                    <UIcon name="i-lucide-chevron-right" class="size-4 text-white/70 flex-shrink-0" />
                  </button>

                  <!-- Ganti Meja (Table order only - Solid Light Neutral) -->
                  <button
                    v-if="session.sessionMode.value === 'table'"
                    class="motion-btn w-full bg-stone-100 rounded-xl px-3.5 py-3 text-[13px] font-semibold text-stone-800 cursor-pointer flex items-center justify-between gap-3 hover:bg-stone-200/85 transition-all duration-150"
                    aria-label="Ganti meja dengan scan QR baru"
                    @click="handleScanCode"
                  >
                    <div class="flex items-center gap-3">
                      <span class="size-8 rounded-lg bg-slate-200 flex items-center justify-center flex-shrink-0">
                        <UIcon name="i-lucide-scan-line" class="size-4 text-slate-600" />
                      </span>
                      <span>Ganti Meja</span>
                    </div>
                    <UIcon name="i-lucide-chevron-right" class="size-4 text-stone-400 flex-shrink-0" />
                  </button>

                  <!-- Informasi sesi Open Bill -->
                  <div
                    v-if="isOpenBill"
                    class="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-3.5"
                  >
                    <span class="size-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <UIcon name="i-lucide-info" class="size-4.5 text-blue-500" />
                    </span>
                    <p class="text-xs text-blue-600 leading-relaxed font-semibold">
                      Sesi Open Bill hanya dapat diakhiri saat pembayaran selesai atau oleh kasir &amp; admin.
                    </p>
                  </div>
                </div>

                <!-- Bottom Leave Session Action (Solid Soft Rose) -->
                <div class="mt-auto pt-8 pb-2">
                  <button
                    class="motion-btn w-full bg-rose-600 rounded-xl px-3.5 py-3 text-[13px] font-bold text-white cursor-pointer flex items-center justify-between gap-3 hover:bg-rose-700 active:scale-[0.98] transition-all duration-150"
                    :aria-label="isOpenBill ? 'Keluar dari sesi open bill ini' : 'Keluar dari sesi meja ini'"
                    @click="handleExitSession"
                  >
                    <div class="flex items-center gap-3">
                      <span class="size-8 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                        <UIcon name="i-lucide-log-out" class="size-4 text-white" />
                      </span>
                      <span>Keluar Sesi</span>
                    </div>
                    <UIcon name="i-lucide-chevron-right" class="size-4 text-rose-200 flex-shrink-0" />
                  </button>
                </div>
              </div>
            </template>

            <!-- No Session Area -->
            <template v-else>
              <div class="space-y-3">
                <div class="rounded-xl border border-gray-100 bg-white p-4 flex flex-col gap-3 shadow-sm">
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
                      @click="handleInlineScan"
                    >
                      <UIcon name="i-lucide-scan-line" class="size-3.5 text-orange-400 shrink-0" />
                      <span>Scan QR Meja</span>
                    </button>
                  </div>
                </div>
              </div>
            </template>
          </div>

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
      </div>
    </Transition>
  </Teleport>

  <!--
    Confirm Exit Modal — di-mount sebagai sibling, bukan child drawer.
    Modal ini menggunakan Teleport to="body" sendiri (z-[200]),
    sehingga selalu tampil di atas drawer ini (z-50).
  -->
  <SessionConfirmExitSessionModal
    :open="showExitConfirm"
    :has-cart-items="session.hasCart.value"
    :session-mode="session.sessionMode.value"
    @confirm="handleConfirmExit"
    @cancel="handleCancelExit"
  />
</template>

<style scoped>
/* ── Overlay: fade in/out ─────────────────────────────────── */
.session-drawer-enter-active {
  transition: opacity 0.25s ease-out;
}
.session-drawer-leave-active {
  transition: opacity 0.2s ease-in;
}
.session-drawer-enter-from,
.session-drawer-leave-to {
  opacity: 0;
}

/* ── Panel: slide dari kiri ───────────────────────────────── */
/* Enter: ease-out (spring) untuk natural feel saat masuk */
.session-drawer-enter-active .session-panel {
  transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}
/* Leave: ease-in (accelerate) untuk cepat saat keluar */
.session-drawer-leave-active .session-panel {
  transition: transform 0.2s cubic-bezier(0.7, 0, 0.84, 0);
}
.session-drawer-enter-from .session-panel,
.session-drawer-leave-to .session-panel {
  transform: translateX(-100%);
}

/* ── Reduced motion ───────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .session-drawer-enter-active,
  .session-drawer-leave-active,
  .session-drawer-enter-active .session-panel,
  .session-drawer-leave-active .session-panel {
    transition: none !important;
  }
}
</style>
