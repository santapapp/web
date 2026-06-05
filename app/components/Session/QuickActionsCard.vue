<script setup lang="ts">
/**
 * QuickActionsCard — Aksi cepat di session drawer kiri
 *
 * Logika tombol per mode sesi:
 * - table   → Lihat Keranjang + Ganti Meja + Keluar Sesi
 * - open_bill → Lihat Keranjang + info (sesi diakhiri kasir/admin)
 * - no session → Lihat Keranjang saja
 */

defineEmits<{
  'open-cart': []
  'scan-code': []
  'exit-session': []
}>()

const session = useCustomerSession()
const isTable = computed(() => session.sessionMode.value === 'table')
const isOpenBill = computed(() => session.sessionMode.value === 'open_bill')
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <h4 class="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 px-0.5">Aksi Cepat</h4>

    <!-- Lihat Keranjang — always visible -->
    <button
      class="w-full bg-white border border-slate-100 rounded-xl px-3.5 py-3 text-[13px] font-semibold text-slate-700 cursor-pointer flex items-center justify-between gap-3 hover:bg-orange-50 hover:border-orange-200 transition-all duration-150"
      aria-label="Lihat keranjang belanja"
      @click="$emit('open-cart')"
    >
      <div class="flex items-center gap-3">
        <span class="size-8 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
          <UIcon name="i-lucide-shopping-bag" class="size-4 text-orange-500" />
        </span>
        <span class="text-slate-700">Lihat Keranjang</span>
      </div>
      <UIcon name="i-lucide-chevron-right" class="size-4 text-slate-300 flex-shrink-0" />
    </button>

    <!-- Table only: Ganti Meja -->
    <button
      v-if="isTable"
      class="w-full bg-white border border-slate-100 rounded-xl px-3.5 py-3 text-[13px] font-semibold text-slate-700 cursor-pointer flex items-center justify-between gap-3 hover:bg-slate-50 hover:border-slate-200 transition-all duration-150"
      aria-label="Ganti meja dengan scan QR baru"
      @click="$emit('scan-code')"
    >
      <div class="flex items-center gap-3">
        <span class="size-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
          <UIcon name="i-lucide-scan-line" class="size-4 text-slate-500" />
        </span>
        <span class="text-slate-700">Ganti Meja</span>
      </div>
      <UIcon name="i-lucide-chevron-right" class="size-4 text-slate-300 flex-shrink-0" />
    </button>

    <!-- Table only: Keluar Sesi -->
    <button
      v-if="isTable"
      class="w-full bg-white border border-rose-100 rounded-xl px-3.5 py-3 text-[13px] font-semibold text-rose-500 cursor-pointer flex items-center justify-between gap-3 hover:bg-rose-50 hover:border-rose-200 transition-all duration-150"
      aria-label="Keluar dari sesi meja ini"
      @click="$emit('exit-session')"
    >
      <div class="flex items-center gap-3">
        <span class="size-8 rounded-lg bg-rose-50 flex items-center justify-center flex-shrink-0">
          <UIcon name="i-lucide-log-out" class="size-4 text-rose-400" />
        </span>
        <span>Keluar Sesi</span>
      </div>
      <UIcon name="i-lucide-chevron-right" class="size-4 text-rose-200 flex-shrink-0" />
    </button>

    <!-- Open Bill: info notice (cannot exit from here) -->
    <div
      v-if="isOpenBill"
      class="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-3.5 py-3"
    >
      <span class="size-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
        <UIcon name="i-lucide-info" class="size-4 text-blue-500" />
      </span>
      <p class="text-[12px] text-blue-600 leading-relaxed font-medium">
        Sesi Open Bill hanya dapat diakhiri saat pembayaran selesai atau oleh kasir &amp; admin.
      </p>
    </div>
  </div>
</template>
