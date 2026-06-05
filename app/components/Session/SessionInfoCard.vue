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
  <div v-if="session.hasSession.value" class="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">

    <!-- Mode row -->
    <div class="flex items-center justify-between px-4 py-3 border-b border-slate-50">
      <div class="flex items-center gap-2 text-slate-500">
        <UIcon :name="modeIcon" class="size-3.5" />
        <span class="text-[11px] font-bold uppercase tracking-wider">{{ modeLabel }}</span>
      </div>
      <UBadge
        :label="billStatusConfig.label"
        :color="billStatusConfig.color"
        variant="soft"
        size="sm"
        class="rounded-full"
      />
    </div>

    <!-- Session label row -->
    <div v-if="session.sessionLabel.value" class="flex items-center gap-3 px-4 py-3">
      <span class="text-base leading-none">
        <template v-if="session.sessionMode.value === 'table'">🪑</template>
        <template v-else>🧾</template>
      </span>
      <div class="flex-1 min-w-0">
        <p class="text-[11px] text-slate-400 font-medium mb-0.5">
          {{ session.sessionMode.value === 'table' ? 'Nomor Meja' : 'Nomor Bill' }}
        </p>
        <p class="text-[14px] font-extrabold text-slate-800">
          {{ session.sessionLabel.value }}
        </p>
      </div>
    </div>

    <!-- Total tagihan (open_bill only) -->
    <div
      v-if="isOpenBill && session.openBill.value?.total_amount"
      class="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-100"
    >
      <span class="text-[12px] text-slate-500 font-medium">Total Tagihan</span>
      <span class="text-[14px] font-extrabold text-slate-800">
        {{ formatPrice(session.openBill.value.total_amount) }}
      </span>
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
