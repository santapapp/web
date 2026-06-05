<script setup lang="ts">
/**
 * StartSection.vue
 * Start ordering view when the customer has no active session.
 * Highly polished, responsive, and styled to Santap guidelines.
 */

import { ref } from 'vue'
import type { OrderHistoryItem } from '~/types/order-history'

const props = defineProps<{
  sessionError?: string | null
  loading?: boolean
  /** Riwayat pesanan terbaru per org (dari localStorage via useOrderHistory) */
  historyItems?: OrderHistoryItem[]
  orgSlug?: string
}>()

const emit = defineEmits<{
  'open-scanner': []
  'submit-manual': [code: string]
}>()

const code = ref('')
const inputError = ref<string | null>(null)

const steps = [
  { n: 1, text: 'Scan QR di meja menggunakan kamera.' },
  { n: 2, text: 'Atau masukkan kode meja dari struk/kasir.' },
  { n: 3, text: 'Pilih menu dan pesan langsung.' }
]

const submitManualCode = () => {
  inputError.value = null
  const trimmed = code.value.trim()
  if (!trimmed) {
    inputError.value = 'Masukkan kode meja terlebih dahulu.'
    return
  }
  emit('submit-manual', trimmed)
}
</script>

<template>
  <div class="flex-1 flex items-center justify-center bg-gray-50 px-4 py-8 lg:py-16 min-h-[calc(100dvh-56px)] lg:min-h-[calc(100dvh-64px)]">
    <div class="w-full max-w-5xl mx-auto lg:grid lg:grid-cols-12 lg:gap-12 lg:items-center">

      <!-- Left Column: Intro -->
      <div class="lg:col-span-6 flex flex-col gap-5 pb-8 lg:pb-0">
        <div class="size-12 rounded-2xl bg-orange-100 border border-orange-200/50 flex items-center justify-center text-orange-600 shadow-sm self-start">
          <UIcon name="i-lucide-qr-code" class="size-6" />
        </div>

        <div>
          <h1 class="text-3xl font-bold text-gray-900 tracking-tight leading-tight mb-3">
            Mulai Pesanan
          </h1>
          <p class="text-gray-500 font-medium text-sm sm:text-base leading-relaxed">
            Scan QR meja atau masukkan kode dari kasir untuk mulai memesan.
          </p>
        </div>

        <!-- Steps List -->
        <ul class="space-y-3 mt-2">
          <li v-for="step in steps" :key="step.n" class="flex items-start gap-3.5 text-slate-600 text-sm font-medium">
            <span class="size-6 rounded-full bg-orange-600 text-white text-xs font-black flex items-center justify-center shrink-0 shadow-sm">
              {{ step.n }}
            </span>
            <span class="mt-0.5 leading-normal">{{ step.text }}</span>
          </li>
        </ul>
      </div>

      <!-- Right Column: Action Cards -->
      <div class="lg:col-span-6 flex flex-col gap-4">

        <!-- Error Alert -->
        <UAlert
          v-if="sessionError && sessionError !== 'no_session'"
          icon="i-lucide-alert-circle"
          color="error"
          variant="soft"
          :description="sessionError"
          class="rounded-xl border border-rose-200/60 shadow-sm"
        />

        <!-- ══════════════════════════════════════
             QR SCANNER CARD — Flex premium design
             ══════════════════════════════════════ -->
        <button
          id="btn-open-qr-scanner"
          type="button"
          :disabled="loading"
          class="qr-scan-btn group relative flex items-center gap-4 w-full bg-gray-900 text-white rounded-2xl overflow-hidden cursor-pointer disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] transition-all duration-200"
          @click="emit('open-scanner')"
        >
          <!-- Animated decorative ornaments -->
          <div class="absolute inset-0 pointer-events-none overflow-hidden">
            <!-- Diagonal top-right block -->
            <div class="absolute -top-6 -right-6 size-24 bg-orange-500/20 rotate-12 rounded-2xl" />
            <!-- Animated floating circle -->
            <div class="absolute top-3 right-14 size-5 rounded-full bg-orange-400/30 ornament-float" />
            <!-- Small square bottom-right -->
            <div class="absolute bottom-3 right-6 size-3 rounded-sm bg-white/10 ornament-pulse rotate-45" />
            <!-- Diagonal bottom-left block -->
            <div class="absolute -bottom-4 -left-4 size-16 bg-orange-600/20 -rotate-6 rounded-xl" />
            <!-- Dot cluster -->
            <div class="absolute top-2 right-3 flex gap-1">
              <div class="size-1.5 rounded-full bg-orange-400/50" />
              <div class="size-1.5 rounded-full bg-orange-400/30" />
              <div class="size-1 rounded-full bg-orange-400/20 mt-0.5" />
            </div>
          </div>

          <!-- Left: QR Icon block -->
          <div class="relative flex-shrink-0 flex items-center justify-center size-[80px] bg-white/10 group-hover:bg-white/15 transition-colors duration-200">
            <!-- QR code pattern -->
            <div class="grid-qr-icon">
              <UIcon name="i-lucide-qr-code" class="size-9 text-orange-400 group-hover:text-orange-300 transition-colors" />
            </div>
          </div>

          <!-- Right: Text content -->
          <div class="flex-1 py-5 pr-4 text-left">
            <p class="text-[10px] font-bold uppercase tracking-widest text-orange-400 mb-1">Cara cepat</p>
            <p class="text-[16px] font-extrabold text-white leading-tight mb-1">Scan QR Meja</p>
            <p class="text-[12px] text-gray-400 font-medium">Arahkan kamera ke QR di meja Anda</p>
          </div>

          <!-- Right: Arrow indicator -->
          <div class="flex-shrink-0 pr-5">
            <div class="size-8 rounded-full bg-orange-600 flex items-center justify-center group-hover:bg-orange-500 transition-colors duration-200">
              <UIcon name="i-lucide-scan-line" class="size-4" />
            </div>
          </div>
        </button>

        <!-- ══════════════════════════════════════
             DIVIDER
             ══════════════════════════════════════ -->
        <div class="flex items-center gap-3">
          <div class="flex-1 h-px bg-gray-200" />
          <span class="text-xs font-bold uppercase tracking-wider text-gray-400">atau</span>
          <div class="flex-1 h-px bg-gray-200" />
        </div>

        <!-- ══════════════════════════════════════
             MANUAL CODE CARD
             ══════════════════════════════════════ -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <div class="size-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
              <UIcon name="i-lucide-keyboard" class="size-4 text-slate-500" />
            </div>
            <div>
              <p class="text-[13px] font-extrabold text-gray-800 leading-tight">Masukkan Kode Manual</p>
              <p class="text-[11px] text-gray-400 font-medium">Dari struk kasir atau QR code di meja</p>
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <UInput
              id="manual-table-code"
              v-model="code"
              placeholder="Kode meja atau token"
              size="lg"
              :disabled="loading"
              autocomplete="off"
              autocorrect="off"
              autocapitalize="off"
              spellcheck="false"
              class="w-full"
              :ui="{
                base: 'rounded-xl border-gray-200 focus:border-orange-400 focus:ring-1 focus:ring-orange-400 font-medium text-gray-800'
              }"
              @keydown.enter="submitManualCode"
            />

            <p v-if="inputError" class="flex items-center gap-1.5 text-xs text-rose-600 font-semibold mt-0.5">
              <UIcon name="i-lucide-alert-circle" class="size-3.5 shrink-0" />
              <span>{{ inputError }}</span>
            </p>

            <button
              id="btn-use-manual-code"
              type="button"
              :disabled="loading"
              class="w-full min-h-[44px] px-6 py-2.5 rounded-xl bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none font-bold flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer text-sm"
              @click="submitManualCode"
            >
              <UIcon v-if="loading" name="i-lucide-loader-2" class="size-4.5 animate-spin shrink-0" />
              <UIcon v-else name="i-lucide-arrow-right" class="size-4.5 shrink-0" />
              <span>{{ loading ? 'Memvalidasi...' : 'Gunakan Kode' }}</span>
            </button>
          </div>
        </div>

        <!-- Recent order history -->
        <OrdersRecentHistory
          v-if="orgSlug && historyItems && historyItems.length"
          :items="historyItems"
          :org-slug="orgSlug"
          :step="5"
        />

      </div>
    </div>
  </div>
</template>

<style scoped>
/* QR scan button */
.qr-scan-btn {
  min-height: 88px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.05);
}

.qr-scan-btn:hover {
  box-shadow: 0 6px 28px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.08);
}

/* Floating circle ornament */
.ornament-float {
  animation: ornamentFloat 3s ease-in-out infinite;
}

@keyframes ornamentFloat {
  0%, 100% { transform: translateY(0) scale(1); opacity: 0.6; }
  50% { transform: translateY(-5px) scale(1.15); opacity: 1; }
}

/* Pulse square ornament */
.ornament-pulse {
  animation: ornamentPulse 2.5s ease-in-out infinite;
}

@keyframes ornamentPulse {
  0%, 100% { opacity: 0.3; transform: rotate(45deg) scale(1); }
  50% { opacity: 0.7; transform: rotate(45deg) scale(1.2); }
}
</style>
