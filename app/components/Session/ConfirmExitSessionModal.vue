<script setup lang="ts">
/**
 * ConfirmExitSessionModal — wrapper UModal untuk konfirmasi keluar sesi.
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

const handleOpenUpdate = (value: boolean) => {
  if (!value) emit('cancel')
}
</script>

<template>
  <UModal
    :open="open"
    :close="false"
    :overlay="true"
    :modal="true"
    :dismissible="true"
    :scrollable="false"
    :transition="true"
    :ui="{
      overlay: 'fixed inset-0 z-[60] bg-black/50',
      content: 'fixed z-[70] bottom-0 left-0 right-0 sm:top-1/2 sm:left-1/2 sm:bottom-auto sm:right-auto sm:-translate-x-1/2 sm:-translate-y-1/2 w-full max-w-[400px] overflow-hidden rounded-t-[20px] bg-[#FAFAF9] shadow-[0_-8px_40px_rgba(0,0,0,0.2)] sm:rounded-[20px] focus:outline-none'
    }"
    @update:open="handleOpenUpdate"
  >
    <template #content>
      <div class="flex flex-col items-center gap-3 px-5 pb-6 pt-3 sm:px-6 sm:pb-7">
        <div class="h-1 w-9 rounded-full bg-stone-300 sm:hidden" />

        <div class="flex size-13 items-center justify-center rounded-2xl bg-rose-50">
          <UIcon name="i-lucide-log-out" class="size-6 text-red-500" />
        </div>

        <div class="space-y-1 text-center">
          <h3 class="text-[17px] font-bold text-stone-900">{{ title }}</h3>
          <p class="text-[13px] leading-6 text-stone-600">{{ description }}</p>
        </div>

        <div
          v-if="hasCartItems"
          class="flex w-full items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-left"
        >
          <UIcon name="i-lucide-triangle-alert" class="mt-0.5 size-4 shrink-0 text-amber-600" />
          <p class="text-[12px] leading-5 text-amber-900">
            Keranjang Anda akan dikosongkan. Pesanan yang belum disubmit akan hilang.
          </p>
        </div>

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
    </template>
  </UModal>
</template>
