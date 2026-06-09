<script setup lang="ts">
/**
 * ConfirmExitSessionModal — Konfirmasi keluar sesi.
 *
 * ROOT CAUSE FIX:
 * Modal sebelumnya menggunakan UModal yang di-render DALAM template SessionDrawer.
 * USlideover menggunakan CSS `transform` untuk animasi slide, yang menciptakan
 * CSS Stacking Context baru. Ini "menjebak" `position: fixed` — modal tidak bisa
 * lagi refer ke viewport, melainkan ke bounding box parent yang ber-transform.
 * Akibatnya: modal tidak center di mobile, bisa terpotong, z-index tidak efektif.
 *
 * SOLUSI:
 * - Teleport to="body" → elemen render langsung di body, bebas dari stacking context
 * - z-[200] → selalu di atas semua drawer (z-50) dan sheet (z-[60])
 * - Animasi manual: overlay fade + card slide-up (mobile) / scale (desktop)
 *
 * Props:
 * - open: boolean — tampilkan modal
 * - hasCartItems: boolean — tampilkan warning cart akan hilang
 * - sessionMode: 'table' | 'open_bill' | null — beda teks untuk tiap mode
 *
 * Emits:
 * - confirm: user menekan "Ya, Keluar"
 * - cancel: user menekan "Batal"
 */

const props = defineProps<{
  open: boolean
  hasCartItems?: boolean
  sessionMode?: 'table' | 'open_bill' | 'tracking_order' | null
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const title = computed(() => {
  if (props.sessionMode === 'open_bill') return 'Keluar dari Open Bill?'
  return 'Keluar dari sesi meja?'
})

const description = computed(() => {
  if (props.sessionMode === 'open_bill') {
    return 'Anda akan keluar dari sesi open bill ini. Bill tetap berjalan di sisi kasir.'
  }
  return 'Anda perlu scan ulang QR meja untuk memesan kembali.'
})
</script>

<template>
  <Teleport to="body">
    <Transition name="exit-modal">
      <div
        v-if="open"
        class="fixed inset-0 z-[200] flex items-end sm:items-center justify-center"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
      >
        <!-- Overlay — klik untuk tutup -->
        <div
          class="absolute inset-0 bg-black/50"
          @click="emit('cancel')"
        />

        <!-- Modal card -->
        <div class="exit-modal-card relative w-full max-w-sm bg-[#FAFAF9] rounded-t-[20px] sm:rounded-[20px] shadow-2xl mx-0 sm:mx-4 overflow-hidden">
          <div class="flex flex-col items-center gap-3 px-5 pt-3 pb-[max(24px,env(safe-area-inset-bottom))] sm:px-6 sm:py-7">
            <!-- Drag handle (mobile only) -->
            <div class="h-1 w-9 rounded-full bg-stone-300 sm:hidden" />

            <!-- Icon -->
            <div class="flex size-13 items-center justify-center rounded-2xl bg-rose-50">
              <UIcon name="i-lucide-log-out" class="size-6 text-red-500" />
            </div>

            <!-- Text -->
            <div class="space-y-1 text-center">
              <h3 class="text-[17px] font-bold text-stone-900">{{ title }}</h3>
              <p class="text-[13px] leading-6 text-stone-600">{{ description }}</p>
            </div>

            <!-- Cart warning -->
            <div
              v-if="hasCartItems"
              class="flex w-full items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-left"
            >
              <UIcon name="i-lucide-triangle-alert" class="mt-0.5 size-4 shrink-0 text-amber-600" />
              <p class="text-[12px] leading-5 text-amber-900">
                Keranjang Anda akan dikosongkan. Pesanan yang belum disubmit akan hilang.
              </p>
            </div>

            <!-- Actions -->
            <div class="mt-2 flex w-full flex-col gap-2.5">
              <UButton
                id="btn-cancel-exit-session"
                block
                color="neutral"
                variant="outline"
                label="Batal"
                size="md"
                :ui="{
                  base: 'rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-extrabold transition-all duration-200 cursor-pointer justify-center h-12 shadow-xs ring-0 focus:ring-2 focus:ring-slate-100'
                }"
                @click="emit('cancel')"
              />
              <UButton
                id="btn-confirm-exit-session"
                block
                color="error"
                variant="solid"
                label="Ya, Keluar"
                icon="i-lucide-log-out"
                size="md"
                :ui="{
                  base: 'rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold transition-all duration-200 cursor-pointer justify-center h-12 shadow-md shadow-red-500/10 ring-0 focus:ring-2 focus:ring-red-100'
                }"
                @click="emit('confirm')"
              />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* ── Overlay: fade in/out ─────────────────────────────────── */
.exit-modal-enter-active {
  transition: opacity 0.2s ease-out;
}
.exit-modal-leave-active {
  transition: opacity 0.15s ease-in;
}
.exit-modal-enter-from,
.exit-modal-leave-to {
  opacity: 0;
}

/* ── Card: slide-up (mobile), scale (desktop) ────────────── */
.exit-modal-enter-active .exit-modal-card {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.exit-modal-leave-active .exit-modal-card {
  transition: transform 0.15s ease-in;
}

/* Mobile: slide dari bawah */
.exit-modal-enter-from .exit-modal-card,
.exit-modal-leave-to .exit-modal-card {
  transform: translateY(100%);
}

/* Desktop: scale */
@media (min-width: 640px) {
  .exit-modal-enter-from .exit-modal-card,
  .exit-modal-leave-to .exit-modal-card {
    transform: scale(0.95);
  }
}

/* ── Reduced motion ───────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .exit-modal-enter-active,
  .exit-modal-leave-active,
  .exit-modal-enter-active .exit-modal-card,
  .exit-modal-leave-active .exit-modal-card {
    transition: none !important;
  }
}
</style>
