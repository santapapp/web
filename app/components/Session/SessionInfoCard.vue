<script setup lang="ts">
/**
 * SessionInfoCard — Kartu informasi sesi aktif
 *
 * Menampilkan:
 * - Nama & slug organisasi
 * - Mode sesi: Meja (table) atau Open Bill
 * - Label sesi: nama meja atau kode bill
 * - Status sesi (aktif/expired)
 * - Status bill (open/locked/closed) untuk mode open_bill
 */

const session = useCustomerSession()

const modeLabel = computed(() => {
  if (session.sessionMode.value === 'open_bill') return 'Open Bill'
  return 'Pesanan Meja'
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
</script>

<template>
  <div v-if="session.hasSession.value" class="session-info-card">
    <!-- Org Info -->
    <div class="org-row">
      <div class="org-icon">
        <UIcon name="i-lucide-store" class="size-4 text-amber-700" />
      </div>
      <div class="org-text">
        <p class="org-name">{{ session.orgName.value }}</p>
        <p class="org-slug">{{ session.orgSlug.value }}</p>
      </div>
    </div>

    <div class="divider" />

    <!-- Session Mode Badge -->
    <div class="mode-row">
      <div class="mode-badge">
        <UIcon :name="modeIcon" class="size-3.5" />
        <span>{{ modeLabel }}</span>
      </div>
      <UBadge
        :label="billStatusConfig.label"
        :color="billStatusConfig.color"
        variant="soft"
        size="sm"
      />
    </div>

    <!-- Session Label (Table name / Bill code) -->
    <div v-if="session.sessionLabel.value" class="label-row">
      <p class="label-text">
        <span v-if="session.sessionMode.value === 'table'">🪑 Meja</span>
        <span v-else>🧾 No. Bill</span>
        &nbsp;
        <strong>{{ session.sessionLabel.value }}</strong>
      </p>
    </div>

    <!-- Bill total (open_bill mode) -->
    <div
      v-if="session.sessionMode.value === 'open_bill' && session.openBill.value?.total_amount"
      class="total-row"
    >
      <span class="total-label">Total Tagihan</span>
      <span class="total-val">
        {{
          new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0
          }).format(session.openBill.value.total_amount)
        }}
      </span>
    </div>
  </div>

  <!-- No session state -->
  <div v-else class="no-session-card">
    <UIcon name="i-lucide-scan-line" class="size-5 text-gray-300" />
    <p>Belum ada sesi aktif</p>
  </div>
</template>

<style scoped>
.session-info-card {
  background: white;
  border-radius: 14px;
  border: 1px solid rgba(224, 217, 206, 0.5);
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.org-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.org-icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: #fef3c7;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.org-text {
  flex: 1;
  min-width: 0;
}

.org-name {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: #1a1714;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.org-slug {
  margin: 0;
  font-size: 11px;
  color: #8a7f6e;
}

.divider {
  height: 1px;
  background: rgba(224, 217, 206, 0.5);
}

.mode-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mode-badge {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #8a7f6e;
}

.label-row {
  background: #faf8f3;
  border-radius: 8px;
  padding: 8px 12px;
}

.label-text {
  margin: 0;
  font-size: 13px;
  color: #3d3529;
}

.total-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 4px;
}

.total-label {
  font-size: 12px;
  color: #8a7f6e;
}

.total-val {
  font-size: 13px;
  font-weight: 700;
  color: #1a1714;
}

.no-session-card {
  background: #f5f3ee;
  border-radius: 14px;
  border: 1px dashed rgba(224, 217, 206, 0.8);
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
}

.no-session-card p {
  margin: 0;
  font-size: 13px;
  color: #8a7f6e;
}
</style>
