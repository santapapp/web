<script setup lang="ts">
definePageMeta({
  layout: 'org',
  middleware: ['org-exists']
})

const route = useRoute()
const orgSlug = computed(() => String(route.params.orgSlug || ''))

// Composables
const customerSession = useCustomerSession()
const { openBill, billPending, fetchOpenBill } = useCustomerOrder()
const {
  payment,
  isPaid,
  isFailed,
  isPolling,
  initiatePending,
  cancelPending,
  initiatePayment,
  startPolling,
  stopPolling,
  cancelPayment
} = useCustomerPayment()

// State
const sessionError = ref<string | null>(null)
const initError = ref<string | null>(null)
const qrDataUrl = ref<string | null>(null)

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(value)

const formatTime = (isoString: string) => {
  return new Date(isoString).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Generate QR code dari qr_string menggunakan canvas API
const generateQrDataUrl = async (qrString: string): Promise<string> => {
  if (qrString.startsWith('http')) {
    return qrString
  }
  // Gunakan QR API publik untuk generate QR image
  return `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(qrString)}&bgcolor=ffffff&color=1a1714&margin=2`
}

// Inisiasi pembayaran dan generate QR
const handleInitiatePayment = async () => {
  initError.value = null
  qrDataUrl.value = null

  const result = await initiatePayment()

  if (!result.success || !result.data) {
    initError.value = result.error?.message ?? 'Gagal memulai pembayaran QRIS.'
    return
  }

  const qrString = result.data.metadata?.qr_string
  if (qrString) {
    qrDataUrl.value = await generateQrDataUrl(qrString)
    // Mulai polling setelah QR ditampilkan
    startPolling(result.data.id)
  }
}

// Batalkan pembayaran
const handleCancelPayment = async () => {
  if (!payment.value?.id) return
  await cancelPayment(payment.value.id)
  qrDataUrl.value = null
}

onMounted(async () => {
  // Restore session
  const isValid = customerSession.restoreLocal()

  if (!isValid) {
    sessionError.value = 'Sesi tidak valid. Silakan scan ulang QR meja.'
    return
  }

  // Load open bill
  await fetchOpenBill()

  // Jika sudah ada pembayaran pending dari sesi sebelumnya
  if (openBill.value?.payments?.length) {
    const pendingPayment = openBill.value.payments.find((p) => p.status === 'pending')
    if (pendingPayment?.id) {
      // Resume polling
      startPolling(pendingPayment.id)
      if (pendingPayment.qr_string) {
        qrDataUrl.value = await generateQrDataUrl(pendingPayment.qr_string)
      }
    }
  }
})

onUnmounted(() => stopPolling())
</script>

<template>
  <section class="payments-page">
    <!-- Session Error -->
    <div v-if="sessionError" class="state-container">
      <div class="state-card error">
        <div class="state-icon">🔒</div>
        <h2>Sesi tidak valid</h2>
        <p>{{ sessionError }}</p>
        <NuxtLink :to="`/o/${orgSlug}/orders`" class="btn-back">
          ← Kembali ke Menu
        </NuxtLink>
      </div>
    </div>

    <template v-else>
      <!-- Header -->
      <header class="payments-header">
        <div class="header-content">
          <NuxtLink :to="`/o/${orgSlug}/orders`" class="btn-back-header">
            ← Kembali ke Menu
          </NuxtLink>
          <h1>Pembayaran</h1>
          <div />
        </div>
      </header>

      <div class="payments-layout">

        <!-- ── Payment Sukses ── -->
        <div v-if="isPaid" class="success-card">
          <div class="success-icon">✅</div>
          <h2>Pembayaran Berhasil!</h2>
          <p>Terima kasih. Pesanan Anda sedang diproses.</p>
          <div v-if="payment" class="payment-detail-row">
            <span>{{ payment.payment_number }}</span>
            <strong>{{ formatCurrency(payment.amount) }}</strong>
          </div>
          <NuxtLink :to="`/o/${orgSlug}/orders`" class="btn-primary-full">
            Pesan Lagi
          </NuxtLink>
        </div>

        <!-- ── Payment Gagal ── -->
        <div v-else-if="isFailed" class="failed-card">
          <div class="state-icon">❌</div>
          <h2>Pembayaran Gagal</h2>
          <p>{{ payment?.void_reason ?? 'Transaksi dibatalkan atau kedaluwarsa.' }}</p>
          <button class="btn-primary-full" @click="handleInitiatePayment">
            Coba Lagi
          </button>
        </div>

        <!-- ── Main Content ── -->
        <div v-else class="payments-main">

          <!-- Open Bill Summary -->
          <div v-if="billPending" class="bill-skeleton" />

          <div v-else-if="openBill" class="bill-card">
            <div class="bill-header">
              <span class="bill-number">{{ openBill.bill_number }}</span>
              <span class="bill-status" :class="openBill.status">{{ openBill.status }}</span>
            </div>

            <div class="bill-table-info">
              <p>🪑 {{ openBill.table.name }} ({{ openBill.table.code }})</p>
            </div>

            <div class="bill-amounts">
              <div class="amount-row">
                <span>Subtotal</span>
                <span>{{ formatCurrency(openBill.subtotal_amount) }}</span>
              </div>
              <div v-if="openBill.discount_amount > 0" class="amount-row discount">
                <span>Diskon</span>
                <span>-{{ formatCurrency(openBill.discount_amount) }}</span>
              </div>
              <div v-if="openBill.service_amount > 0" class="amount-row">
                <span>Biaya Layanan</span>
                <span>{{ formatCurrency(openBill.service_amount) }}</span>
              </div>
              <div v-if="openBill.tax_amount > 0" class="amount-row">
                <span>Pajak</span>
                <span>{{ formatCurrency(openBill.tax_amount) }}</span>
              </div>
              <div class="amount-row total">
                <strong>Total</strong>
                <strong>{{ formatCurrency(openBill.total_amount) }}</strong>
              </div>
            </div>
          </div>

          <!-- No Bill -->
          <div v-else class="state-card">
            <div class="state-icon">📋</div>
            <h2>Tidak ada tagihan aktif</h2>
            <p>Silakan buat pesanan terlebih dahulu.</p>
            <NuxtLink :to="`/o/${orgSlug}/orders`" class="btn-primary-full">
              Lihat Menu
            </NuxtLink>
          </div>

          <!-- QRIS Payment Section -->
          <div v-if="openBill && openBill.total_amount > 0" class="qris-section">

            <!-- QR Code Display -->
            <div v-if="qrDataUrl && !isPaid && !isFailed" class="qr-container">
              <div class="qr-header">
                <h3>Scan QRIS untuk Membayar</h3>
                <div v-if="isPolling" class="polling-indicator">
                  <span class="poll-dot" />
                  Menunggu pembayaran...
                </div>
              </div>

              <div class="qr-image-wrapper">
                <img :src="qrDataUrl" alt="QRIS QR Code" class="qr-image" />
                <div v-if="isPolling" class="qr-overlay-pulse" />
              </div>

              <div v-if="payment?.metadata?.expiry_time" class="qr-expiry">
                ⏱ Berlaku sampai pukul {{ formatTime(payment.metadata.expiry_time) }}
              </div>

              <p class="qr-hint">
                Buka aplikasi bank atau dompet digital Anda, pilih "Scan QR", lalu arahkan ke kode di atas.
              </p>

              <button
                class="btn-cancel"
                :disabled="cancelPending"
                @click="handleCancelPayment"
              >
                {{ cancelPending ? 'Membatalkan...' : 'Batalkan Pembayaran' }}
              </button>
            </div>

            <!-- Initiate Payment Button -->
            <div v-else-if="!qrDataUrl && !isPaid && !isFailed" class="initiate-section">
              <div class="qris-logo">
                <span class="qris-text">QRIS</span>
              </div>

              <p class="initiate-desc">
                Bayar langsung dengan scan QR — semua aplikasi bank dan dompet digital didukung.
              </p>

              <p v-if="initError" class="init-error">{{ initError }}</p>

              <button
                class="btn-pay-qris"
                :disabled="initiatePending || !openBill"
                @click="handleInitiatePayment"
              >
                <span v-if="initiatePending">Membuat QR...</span>
                <span v-else>💳 Bayar {{ formatCurrency(openBill?.total_amount ?? 0) }}</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </template>
  </section>
</template>

<style scoped>
/* ── Layout ──────────────────────────────────────────── */
.payments-page {
  min-height: 100dvh;
  background: transparent;
}

.payments-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid #ece9e2;
  padding: 12px 24px;
  position: sticky;
  top: 56px;
  z-index: 8;
}

.header-content {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  max-width: 600px;
  margin: 0 auto;
}

.header-content h1 {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  text-align: center;
  color: #1a1714;
}

.btn-back-header {
  color: #8a7f6e;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.15s;
}

.btn-back-header:hover {
  color: #c07b2a;
}

.payments-layout {
  max-width: 600px;
  margin: 0 auto;
  padding: 24px 24px 48px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ── Bill Card ───────────────────────────────────────── */
.bill-skeleton {
  height: 200px;
  background: linear-gradient(90deg, #f0ece5 25%, #e8e3da 50%, #f0ece5 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 20px;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.bill-card {
  background: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
}

.bill-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.bill-number {
  font-family: monospace;
  font-size: 13px;
  color: #8a7f6e;
}

.bill-status {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 3px 10px;
  border-radius: 50px;
}

.bill-status.open {
  background: #e8f5e9;
  color: #388e3c;
}

.bill-status.locked {
  background: #fff3e0;
  color: #f57c00;
}

.bill-table-info {
  font-size: 14px;
  color: #6b6055;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0ece5;
}

.bill-table-info p {
  margin: 0;
}

.bill-amounts {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.amount-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #6b6055;
}

.amount-row.discount {
  color: #388e3c;
}

.amount-row.total {
  padding-top: 10px;
  border-top: 2px solid #f0ece5;
  font-size: 18px;
  color: #1a1714;
}

/* ── QRIS Section ────────────────────────────────────── */
.qris-section {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
}

.initiate-section {
  text-align: center;
}

.qris-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #e91e63, #9c27b0);
  border-radius: 20px;
  margin: 0 auto 16px;
}

.qris-text {
  color: white;
  font-weight: 900;
  font-size: 18px;
  letter-spacing: 0.05em;
}

.initiate-desc {
  font-size: 15px;
  color: #6b6055;
  line-height: 1.5;
  margin: 0 0 20px;
}

.init-error {
  color: #c0392b;
  font-size: 14px;
  margin: 0 0 16px;
  text-align: center;
}

.btn-pay-qris {
  width: 100%;
  background: linear-gradient(135deg, #f09c33, #c07b2a);
  color: white;
  border: none;
  border-radius: 14px;
  padding: 16px;
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
  box-shadow: 0 4px 16px rgba(240, 156, 51, 0.35);
}

.btn-pay-qris:hover:not(:disabled) {
  opacity: 0.92;
}

.btn-pay-qris:active:not(:disabled) {
  transform: scale(0.99);
}

.btn-pay-qris:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ── QR Display ──────────────────────────────────────── */
.qr-container {
  text-align: center;
}

.qr-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.qr-header h3 {
  font-size: 16px;
  font-weight: 700;
  margin: 0;
}

.polling-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #388e3c;
  font-weight: 500;
}

.poll-dot {
  width: 8px;
  height: 8px;
  background: #388e3c;
  border-radius: 50%;
  animation: pulse 1.2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.8); }
}

.qr-image-wrapper {
  position: relative;
  display: inline-block;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.12);
  margin-bottom: 16px;
}

.qr-image {
  display: block;
  width: 280px;
  height: 280px;
  max-width: 100%;
}

.qr-overlay-pulse {
  position: absolute;
  inset: 0;
  border: 3px solid #388e3c;
  border-radius: 16px;
  animation: borderPulse 2s infinite;
}

@keyframes borderPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.qr-expiry {
  font-size: 13px;
  color: #e67e22;
  font-weight: 600;
  margin-bottom: 12px;
}

.qr-hint {
  font-size: 13px;
  color: #8a7f6e;
  line-height: 1.5;
  margin: 0 0 20px;
}

.btn-cancel {
  background: transparent;
  border: 1.5px solid #e0d9ce;
  color: #6b6055;
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
}

.btn-cancel:hover:not(:disabled) {
  border-color: #c0392b;
  color: #c0392b;
}

.btn-cancel:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ── Success / Failed Cards ──────────────────────────── */
.success-card, .failed-card {
  text-align: center;
  background: white;
  border-radius: 20px;
  padding: 40px 24px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
}

.success-icon {
  font-size: 56px;
  margin-bottom: 16px;
}

.success-card h2 {
  font-size: 22px;
  font-weight: 800;
  color: #27ae60;
  margin: 0 0 8px;
}

.failed-card h2 {
  font-size: 22px;
  font-weight: 800;
  color: #c0392b;
  margin: 0 0 8px;
}

.success-card p, .failed-card p {
  color: #6b6055;
  font-size: 15px;
  margin: 0 0 20px;
}

.payment-detail-row {
  display: flex;
  justify-content: space-between;
  background: #f8faf8;
  border-radius: 10px;
  padding: 12px 16px;
  margin-bottom: 20px;
  font-size: 14px;
}

.payment-detail-row strong {
  font-weight: 800;
  color: #27ae60;
}

/* ── State & Error ───────────────────────────────────── */
.state-container {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-6);
}

.state-card {
  text-align: center;
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: var(--space-10) var(--space-8);
  max-width: 380px;
  box-shadow: var(--shadow-md);
}

.state-card.error {
  background: var(--color-danger-soft);
  border: 1px solid var(--color-danger-border);
}

.state-card h2 {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 var(--space-2);
  color: var(--color-black);
}

.state-card.error h2 {
  color: var(--color-danger);
}

.state-card p {
  font-size: 15px;
  color: var(--color-gray-600);
  margin: 0 0 var(--space-5);
  line-height: 1.6;
}

.state-icon {
  font-size: 48px;
  margin-bottom: var(--space-4);
}

.btn-primary-full {
  display: block;
  width: 100%;
  text-align: center;
  background: #f09c33;
  color: white;
  text-decoration: none;
  border: none;
  border-radius: 12px;
  padding: 14px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-primary-full:hover {
  background: #c07b2a;
}

.btn-back {
  display: inline-block;
  color: #8a7f6e;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  margin-top: 16px;
  transition: color 0.15s;
}

.btn-back:hover {
  color: #c07b2a;
}
</style>
