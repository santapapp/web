<script setup lang="ts">
definePageMeta({
  layout: 'org',
  middleware: ['org-exists', 'validate-order-query']
})

const route = useRoute()
const router = useRouter()

const orgSlug = computed(() => String(route.params.orgSlug || ''))
const tableCode = computed(() => String(route.query.table || ''))
const qrToken = computed(() => String(route.query.qr || ''))

// Composables
const customerSession = useCustomerSession()
const { categories, pending: menuPending, error: menuError, fetchMenu } = useCustomerMenu()
const { openBill, billPending, billError, fetchOpenBill, callCashier, cashierPending } = useCustomerOrder()
const cart = useCart('table_order')

// State
const sessionLoading = ref(false)
const sessionError = ref<string | null>(null)
const isSessionReady = ref(false)
const orderSubmitting = ref(false)
const orderSuccess = ref(false)
const orderError = ref<string | null>(null)
const showScanner = ref(false)

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(value)

// Inisiasi sesi dan load menu
onMounted(async () => {
  // Coba restore session lokal dulu
  const hasLocalSession = customerSession.restoreLocal()

  if (hasLocalSession) {
    // Sudah ada sesi — langsung load menu
    isSessionReady.value = true
    await fetchMenu()

    // Load open bill jika ada
    if (customerSession.openBill.value?.id) {
      await fetchOpenBill()
    }
    return
  }

  // Tidak ada sesi — cek apakah ada QR token untuk start session baru
  if (!tableCode.value || !qrToken.value) {
    sessionError.value = 'no_qr'
    return
  }

  // Start session baru
  sessionLoading.value = true
  const result = await customerSession.startSession(
    orgSlug.value,
    tableCode.value,
    qrToken.value
  )
  sessionLoading.value = false

  if (!result.success) {
    sessionError.value = result.error?.message ?? 'Gagal memulai sesi. QR tidak valid atau sudah kedaluwarsa.'
    return
  }

  isSessionReady.value = true
  await fetchMenu()
})

// Handle QR scan result dari kamera
const handleScanResult = async (result: { table: string; qr: string }) => {
  showScanner.value = false
  sessionError.value = null
  sessionLoading.value = true

  // Navigate dengan params baru sehingga URL juga update
  await router.replace({
    query: {
      ...route.query,
      table: result.table,
      qr: result.qr
    }
  })

  const sessionResult = await customerSession.startSession(
    orgSlug.value,
    result.table,
    result.qr
  )

  sessionLoading.value = false

  if (!sessionResult.success) {
    sessionError.value = sessionResult.error?.message ?? 'QR tidak valid atau sudah kedaluwarsa. Coba scan lagi.'
    return
  }

  isSessionReady.value = true
  await fetchMenu()
}

// Submit order dari cart
const submitOrder = async () => {
  if (cart.totalQuantity.value === 0) return

  orderSubmitting.value = true
  orderError.value = null

  const items = cart.items.value.map((item) => ({
    menu_id: item.menuId,
    quantity: item.quantity,
    notes: item.notes ?? null
  }))

  const { placeOrder } = useCustomerOrder()
  const result = await placeOrder(items, cart.customerNote.value || undefined)

  orderSubmitting.value = false

  if (result.success) {
    orderSuccess.value = true
    cart.clearCart()
    // Navigasi ke halaman payment
    router.push(`/o/${orgSlug.value}/payments`)
  } else {
    orderError.value = result.error?.message ?? 'Gagal mengirim pesanan.'
  }
}

const handleCallCashier = async () => {
  const result = await callCashier()
  if (!result.success) {
    alert('Gagal memanggil kasir. Coba lagi.')
  }
}
</script>

<template>
  <div class="orders-root">
  <section class="orders-page">
    <!-- Loading Session -->
    <div v-if="sessionLoading" class="state-container">
      <div class="state-card loading">
        <div class="spinner" />
        <h2>Memulai sesi...</h2>
        <p>Memvalidasi QR meja Anda</p>
      </div>
    </div>

    <!-- QR Required / Session Error -->
    <div v-else-if="sessionError" class="state-container">
      <div class="qr-prompt-card">

        <!-- Ikon QR animasi -->
        <div class="qr-prompt-icon" aria-hidden="true">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <rect x="4" y="4" width="20" height="20" rx="3" stroke="#E87722" stroke-width="2.5"/>
            <rect x="9" y="9" width="10" height="10" rx="1.5" fill="#E87722"/>
            <rect x="32" y="4" width="20" height="20" rx="3" stroke="#E87722" stroke-width="2.5"/>
            <rect x="37" y="9" width="10" height="10" rx="1.5" fill="#E87722"/>
            <rect x="4" y="32" width="20" height="20" rx="3" stroke="#E87722" stroke-width="2.5"/>
            <rect x="9" y="37" width="10" height="10" rx="1.5" fill="#E87722"/>
            <rect x="32" y="32" width="5" height="5" rx="1" fill="#E87722"/>
            <rect x="43" y="32" width="5" height="5" rx="1" fill="#E87722"/>
            <rect x="32" y="43" width="5" height="5" rx="1" fill="#E87722"/>
            <rect x="43" y="43" width="5" height="5" rx="1" fill="#E87722"/>
          </svg>
        </div>

        <!-- Pesan berdasarkan kondisi -->
        <template v-if="sessionError === 'no_qr'">
          <h2>Scan QR meja Anda</h2>
          <p>Arahkan kamera ke QR code yang ada di meja untuk mulai memesan.</p>
        </template>
        <template v-else>
          <h2>QR tidak valid</h2>
          <p>{{ sessionError }}</p>
          <p class="hint">Pastikan Anda scan QR dari meja yang benar, atau minta pelayan untuk QR yang baru.</p>
        </template>

        <!-- CTA scan -->
        <button
          id="btn-open-qr-scanner"
          class="btn-scan-camera"
          @click="showScanner = true"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
          </svg>
          Scan QR Kamera
        </button>

        <p class="scan-alt-label">Tidak bisa scan? Tanyakan URL ke pelayan.</p>
      </div>
    </div>

    <!-- Main Content -->
    <template v-else-if="isSessionReady">
      <!-- Header -->
      <header class="orders-header">
        <div class="header-content">
          <div class="header-info">
            <p class="org-name">{{ customerSession.orgName.value }}</p>
            <h1>Meja {{ customerSession.tableName.value ?? tableCode }}</h1>
          </div>
          <div class="header-actions">
            <button
              v-if="openBill?.total_amount"
              class="btn-cashier"
              :disabled="cashierPending"
              @click="handleCallCashier"
            >
              🔔 Panggil Kasir
            </button>
          </div>
        </div>
      </header>

      <div class="orders-layout">
        <!-- Menu Section -->
        <main class="menu-section">
          <!-- Loading Menu -->
          <div v-if="menuPending" class="menu-loading">
            <div v-for="n in 6" :key="n" class="menu-skeleton" />
          </div>

          <!-- Menu Error -->
          <div v-else-if="menuError" class="state-card error">
            <p>Gagal memuat menu: {{ menuError.message }}</p>
            <button class="btn-outline" @click="fetchMenu">Coba Lagi</button>
          </div>

          <!-- Menu List -->
          <template v-else>
            <div v-for="category in categories" :key="category.id" class="menu-category">
              <h2 class="category-title">{{ category.name }}</h2>
              <div class="menu-grid">
                <article
                  v-for="menu in category.menus"
                  :key="menu.id"
                  class="menu-card"
                  :class="{ 'out-of-stock': menu.status === 'out_of_stock' }"
                >
                  <div class="menu-image-wrapper">
                    <img
                      v-if="menu.image_url"
                      :src="menu.image_url"
                      :alt="menu.name"
                      class="menu-image"
                    />
                    <div v-else class="menu-image-placeholder">🍽️</div>
                    <span v-if="menu.status === 'out_of_stock'" class="out-of-stock-badge">Habis</span>
                  </div>
                  <div class="menu-info">
                    <h3 class="menu-name">{{ menu.name }}</h3>
                    <p v-if="menu.description" class="menu-desc">{{ menu.description }}</p>
                    <div class="menu-footer">
                      <span class="menu-price">{{ formatCurrency(menu.price) }}</span>
                      <div class="menu-qty-control">
                        <template v-if="cart.items.value.find(i => i.menuId === menu.id)">
                          <button
                            class="qty-btn"
                            @click="cart.updateQuantity(menu.id, (cart.items.value.find(i => i.menuId === menu.id)?.quantity ?? 1) - 1)"
                          >
                            −
                          </button>
                          <span class="qty-value">
                            {{ cart.items.value.find(i => i.menuId === menu.id)?.quantity ?? 0 }}
                          </span>
                          <button
                            class="qty-btn qty-add"
                            :disabled="menu.status === 'out_of_stock'"
                            @click="cart.addItem({ menuId: menu.id, name: menu.name, price: menu.price })"
                          >
                            +
                          </button>
                        </template>
                        <button
                          v-else
                          class="btn-add"
                          :disabled="menu.status === 'out_of_stock'"
                          @click="cart.addItem({ menuId: menu.id, name: menu.name, price: menu.price })"
                        >
                          + Tambah
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </template>
        </main>

        <!-- Cart Sidebar -->
        <aside class="cart-sidebar">
          <div class="cart-card">
            <div class="cart-header">
              <h3>Pesanan Saya</h3>
              <span v-if="cart.totalQuantity.value > 0" class="cart-badge">
                {{ cart.totalQuantity.value }}
              </span>
            </div>

            <!-- Empty Cart -->
            <div v-if="cart.totalQuantity.value === 0" class="cart-empty">
              <p>🛒</p>
              <p>Belum ada item</p>
            </div>

            <!-- Cart Items -->
            <template v-else>
              <ul class="cart-items">
                <li v-for="item in cart.items.value" :key="item.menuId" class="cart-item">
                  <div class="cart-item-info">
                    <span class="cart-item-name">{{ item.name }}</span>
                    <span class="cart-item-price">{{ formatCurrency(item.price * item.quantity) }}</span>
                  </div>
                  <div class="cart-item-controls">
                    <button class="qty-btn-sm" @click="cart.updateQuantity(item.menuId, item.quantity - 1)">−</button>
                    <span class="qty-val-sm">{{ item.quantity }}</span>
                    <button class="qty-btn-sm" @click="cart.updateQuantity(item.menuId, item.quantity + 1)">+</button>
                  </div>
                </li>
              </ul>

              <!-- Note -->
              <div class="cart-note">
                <label for="customer-note">Catatan (opsional)</label>
                <textarea
                  id="customer-note"
                  :value="cart.customerNote.value"
                  placeholder="Contoh: Tolong siapkan 2 gelas air"
                  rows="2"
                  @input="(e) => cart.setCustomerNote((e.target as HTMLTextAreaElement).value)"
                />
              </div>

              <!-- Total -->
              <div class="cart-total">
                <span>Total</span>
                <strong>{{ formatCurrency(cart.totalPrice.value) }}</strong>
              </div>

              <!-- Error -->
              <p v-if="orderError" class="order-error">{{ orderError }}</p>

              <!-- Submit Button -->
              <button
                class="btn-order"
                :disabled="orderSubmitting"
                @click="submitOrder"
              >
                <span v-if="orderSubmitting">Mengirim pesanan...</span>
                <span v-else>Pesan Sekarang 🛎️</span>
              </button>
            </template>
          </div>

          <!-- Open Bill Summary -->
          <div v-if="openBill" class="bill-summary-card">
            <h4>Tagihan Meja</h4>
            <div class="bill-summary-row">
              <span>{{ openBill.bill_number }}</span>
              <strong>{{ formatCurrency(openBill.total_amount) }}</strong>
            </div>
            <NuxtLink :to="`/o/${orgSlug}/payments`" class="btn-pay">
              💳 Bayar Sekarang
            </NuxtLink>
          </div>
        </aside>
      </div>
    </template>
  </section>

  <!-- QR Scanner fullscreen overlay (harus di luar chain v-if) -->
  <Teleport to="body">
    <OrdersQrScanner
      v-if="showScanner"
      @scanned="handleScanResult"
      @cancel="showScanner = false"
    />
  </Teleport>

  </div>
</template>

<style scoped>
/* ── Layout ──────────────────────────────────────────── */
.orders-root {
  display: contents; /* Transparan ke layout, tidak tambah box */
}

.orders-page {
  min-height: 100dvh;
  background: transparent;
}

/* ── QR Prompt (state: no QR / invalid) ──────────────── */
.qr-prompt-card {
  text-align: center;
  background: white;
  border-radius: 28px;
  padding: 40px 32px 36px;
  max-width: 360px;
  width: 100%;
  box-shadow:
    0 4px 24px rgba(0,0,0,0.07),
    0 1px 4px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.qr-prompt-icon {
  width: 88px;
  height: 88px;
  background: #FFF5EC;
  border-radius: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
  animation: qrPulse 2.5s ease-in-out infinite;
}

@keyframes qrPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(232, 119, 34, 0); }
  50%       { box-shadow: 0 0 0 10px rgba(232, 119, 34, 0.08); }
}

.qr-prompt-card h2 {
  font-size: 20px;
  font-weight: 800;
  color: #1a1714;
  margin: 0;
  letter-spacing: -0.02em;
  font-family: var(--font-body, sans-serif);
}

.qr-prompt-card p {
  font-size: 14px;
  color: #8a7f6e;
  line-height: 1.6;
  margin: 0;
}

.qr-prompt-card .hint {
  font-size: 13px;
  color: #b5aca0;
}

.btn-scan-camera {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  background: #E87722;
  color: white;
  border: none;
  border-radius: 14px;
  padding: 15px 20px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 6px;
  transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
  box-shadow: 0 4px 18px rgba(232, 119, 34, 0.35);
  letter-spacing: -0.01em;
}

.btn-scan-camera:hover {
  background: #C45E0F;
  box-shadow: 0 6px 24px rgba(232, 119, 34, 0.4);
}

.btn-scan-camera:active {
  transform: scale(0.98);
}

.scan-alt-label {
  font-size: 12px !important;
  color: #c4b9af !important;
  margin: 0 !important;
}

.orders-header {
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
}

.org-name {
  font-size: 12px;
  color: #8a7f6e;
  margin: 0 0 2px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.header-content h1 {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  color: #1a1714;
}

.btn-cashier {
  background: #fff3e0;
  border: 1px solid #f09c33;
  color: #b36b00;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-cashier:hover {
  background: #ffe0a0;
}

.btn-cashier:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ── Orders Layout ───────────────────────────────────── */
.orders-layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

@media (max-width: 900px) {
  .orders-layout {
    grid-template-columns: 1fr;
    padding: 16px;
  }
}

/* ── Menu Section ────────────────────────────────────── */
.menu-section {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.category-title {
  font-size: 18px;
  font-weight: 700;
  color: #1a1714;
  margin: 0 0 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #f09c33;
  display: inline-block;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}

.menu-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  transition: box-shadow 0.2s, transform 0.2s;
}

.menu-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}

.menu-card.out-of-stock {
  opacity: 0.65;
}

.menu-image-wrapper {
  position: relative;
  width: 100%;
  height: 160px;
  background: #f5f3ee;
}

.menu-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.menu-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  background: #f5f3ee;
}

.out-of-stock-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0,0,0,0.6);
  color: white;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 600;
}

.menu-info {
  padding: 14px 16px 16px;
}

.menu-name {
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 4px;
  color: #1a1714;
}

.menu-desc {
  font-size: 13px;
  color: #8a7f6e;
  margin: 0 0 12px;
  line-height: 1.4;
}

.menu-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.menu-price {
  font-weight: 700;
  color: #c07b2a;
  font-size: 15px;
}

.menu-qty-control {
  display: flex;
  align-items: center;
  gap: 6px;
}

.qty-btn {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: 1.5px solid #e0d9ce;
  background: white;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.15s, background 0.15s;
}

.qty-btn.qty-add {
  background: #f09c33;
  border-color: #f09c33;
  color: white;
}

.qty-btn:hover:not(:disabled) {
  border-color: #c07b2a;
}

.qty-value {
  min-width: 20px;
  text-align: center;
  font-weight: 700;
  font-size: 15px;
}

.btn-add {
  background: #f09c33;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 7px 14px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-add:hover:not(:disabled) {
  background: #c07b2a;
}

.btn-add:disabled {
  background: #d5cfc5;
  cursor: not-allowed;
}

/* ── Skeleton ─────────────────────────────────────────── */
.menu-loading {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}

.menu-skeleton {
  height: 260px;
  background: linear-gradient(90deg, #f0ece5 25%, #e8e3da 50%, #f0ece5 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 16px;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* ── Cart Sidebar ─────────────────────────────────────── */
.cart-sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: sticky;
  top: 80px;
  align-self: start;
}

.cart-card {
  background: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.cart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.cart-header h3 {
  font-size: 17px;
  font-weight: 700;
  margin: 0;
}

.cart-badge {
  background: #f09c33;
  color: white;
  border-radius: 50px;
  padding: 2px 10px;
  font-size: 13px;
  font-weight: 700;
}

.cart-empty {
  text-align: center;
  padding: 32px 0;
  color: #a09580;
  font-size: 14px;
}

.cart-empty p:first-child {
  font-size: 36px;
  margin-bottom: 8px;
}

.cart-items {
  list-style: none;
  padding: 0;
  margin: 0 0 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cart-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0ece5;
}

.cart-item:last-child {
  border-bottom: none;
}

.cart-item-info {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.cart-item-name {
  font-size: 14px;
  font-weight: 500;
  color: #1a1714;
}

.cart-item-price {
  font-size: 14px;
  font-weight: 700;
  color: #c07b2a;
  white-space: nowrap;
}

.cart-item-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qty-btn-sm {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  border: 1.5px solid #e0d9ce;
  background: white;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qty-btn-sm:hover {
  background: #f5f3ee;
}

.qty-val-sm {
  min-width: 18px;
  text-align: center;
  font-weight: 700;
  font-size: 14px;
}

.cart-note {
  margin-bottom: 16px;
}

.cart-note label {
  display: block;
  font-size: 13px;
  color: #8a7f6e;
  margin-bottom: 6px;
}

.cart-note textarea {
  width: 100%;
  border: 1.5px solid #e0d9ce;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 13px;
  font-family: inherit;
  resize: none;
  background: #fafaf8;
  color: #1a1714;
  transition: border-color 0.15s;
  box-sizing: border-box;
}

.cart-note textarea:focus {
  outline: none;
  border-color: #f09c33;
}

.cart-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  border-top: 2px solid #f0ece5;
  margin-bottom: 14px;
  font-size: 16px;
}

.cart-total strong {
  font-weight: 800;
  color: #1a1714;
  font-size: 18px;
}

.order-error {
  color: #c0392b;
  font-size: 13px;
  margin: 0 0 12px;
  text-align: center;
}

.btn-order {
  width: 100%;
  background: #f09c33;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
}

.btn-order:hover:not(:disabled) {
  background: #c07b2a;
}

.btn-order:active:not(:disabled) {
  transform: scale(0.99);
}

.btn-order:disabled {
  background: #d5cfc5;
  cursor: not-allowed;
}

/* ── Bill Summary ─────────────────────────────────────── */
.bill-summary-card {
  background: #fff9f0;
  border: 1.5px solid #f09c33;
  border-radius: 16px;
  padding: 16px;
}

.bill-summary-card h4 {
  font-size: 13px;
  font-weight: 600;
  color: #8a7f6e;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 10px;
}

.bill-summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  margin-bottom: 14px;
}

.bill-summary-row strong {
  font-weight: 800;
  color: #c07b2a;
}

.btn-pay {
  display: block;
  text-align: center;
  background: #c07b2a;
  color: white;
  text-decoration: none;
  border-radius: 10px;
  padding: 10px;
  font-weight: 700;
  font-size: 14px;
  transition: background 0.15s;
}

.btn-pay:hover {
  background: #9a6020;
}

/* ── State Containers ─────────────────────────────────── */
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
  margin: 0 0 var(--space-2);
  line-height: 1.6;
}

.state-icon {
  font-size: 48px;
  margin-bottom: var(--space-4);
}

.hint {
  font-size: 13px !important;
  color: #a09580 !important;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f0ece5;
  border-top-color: #f09c33;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.btn-outline {
  border: 1.5px solid #e0d9ce;
  background: white;
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 12px;
  transition: border-color 0.15s;
}

.btn-outline:hover {
  border-color: #c07b2a;
}
</style>
