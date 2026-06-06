<script setup lang="ts">
/**
 * SessionInfoCard — Kartu informasi sesi aktif (versi ringkas)
 * Header drawer sudah menampilkan org name + session label,
 * card ini menampilkan detail tambahan: mode, status, total (open_bill).
 */

const session = useCustomerSession()

const modeLabel = computed(() => {
  if (session.sessionMode.value === 'open_bill') return 'Open Bill'
  if (session.sessionMode.value === 'table') return 'Pesanan Meja'
  return 'Tracking'
})

const modeIcon = computed(() => {
  if (session.sessionMode.value === 'open_bill') return 'i-lucide-receipt'
  return 'i-lucide-armchair'
})

const billStatusConfig = computed(() => {
  const status = session.openBill.value?.status
  if (status === 'locked') return { label: 'Terkunci', color: 'warning' as const }
  if (status === 'closed') return { label: 'Ditutup', color: 'error' as const }
  return { label: 'Aktif', color: 'success' as const }
})

const isOpenBill = computed(() => session.sessionMode.value === 'open_bill')

const formatPrice = (v: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(v)
</script>

<template>
  <!-- Active session -->
  <div v-if="session.hasSession.value" class="bg-transparent rounded-xl border border-slate-200 overflow-hidden shadow-none transition-all duration-200">

    <!-- Mode row -->
    <div class="flex items-center justify-between px-3 py-2.5 border-b border-slate-200">
      <div class="flex items-center gap-1.5 text-slate-500">
        <span class="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">{{ modeLabel }}</span>
      </div>
      <UBadge
        :label="billStatusConfig.label"
        :color="billStatusConfig.color"
        variant="soft"
        size="sm"
        class="rounded-full text-[9px] px-1.5 py-0"
      />
    </div>

    <!-- Session label & info row -->
    <div v-if="session.sessionLabel.value" class="flex items-center gap-3 px-3.5 py-3">
      <div class="size-8 rounded-lg border border-slate-200 bg-transparent flex items-center justify-center shrink-0">
        <span class="text-sm">
          <template v-if="session.sessionMode.value === 'table'">
            <UIcon name="i-lucide-armchair" class="size-4 text-slate-600" />
          </template>
          <template v-else>
            <UIcon name="i-lucide-receipt" class="size-4 text-slate-600" />
          </template>
        </span>
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-1">
          {{ session.sessionMode.value === 'table' ? 'Nomor Meja' : 'Nomor Bill' }}
        </p>
        <p class="text-[13px] font-extrabold text-slate-800 leading-tight">
          {{ session.sessionLabel.value }}
        </p>
      </div>

      <!-- Inline Total tagihan (open_bill only) for ultimate visual lightness -->
      <div
        v-if="isOpenBill && session.openBill.value?.total_amount"
        class="text-right"
      >
        <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-1">Tagihan</p>
        <p class="text-[13px] font-extrabold text-slate-800 leading-tight">
          {{ formatPrice(session.openBill.value.total_amount) }}
        </p>
      </div>
    </div>
  </div>

  <!-- No session state -->
  <div v-else class="bg-slate-50 rounded-xl border border-dashed border-slate-200 p-5 flex flex-col items-center gap-2.5 text-center">
    <div class="size-10 rounded-xl bg-slate-100 flex items-center justify-center">
      <UIcon name="i-lucide-scan-line" class="size-5 text-slate-300" />
    </div>
    <div>
      <p class="text-[13px] text-slate-500 font-semibold m-0">Belum ada sesi aktif</p>
      <p class="text-[11px] text-slate-400 font-medium mt-0.5">Scan QR meja untuk mulai memesan</p>
    </div>
  </div>
</template>
