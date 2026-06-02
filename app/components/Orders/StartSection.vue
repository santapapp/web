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
  <div class="flex-1 flex items-center justify-center bg-[#FAF7F2] px-5 py-8 lg:py-16 min-h-[calc(100dvh-56px)] lg:min-h-[calc(100dvh-64px)]">
    <div class="w-full max-w-5xl mx-auto lg:grid lg:grid-cols-12 lg:gap-12 lg:items-center">
      
      <!-- Left Column: Intro (desktop: visible, mobile: short header) -->
      <div class="lg:col-span-6 flex flex-col gap-5 pb-8 lg:pb-0">
        <!-- Accent Icon -->
        <div class="size-12 rounded-2xl bg-amber-100 border border-amber-200/50 flex items-center justify-center text-amber-800 shadow-sm self-start">
          <UIcon name="i-lucide-qr-code" class="size-6" />
        </div>
        
        <div>
          <h1 class="text-3xl font-serif font-black text-stone-900 tracking-tight leading-tight mb-3">
            Mulai Pesanan
          </h1>
          <p class="text-stone-600 font-semibold text-sm sm:text-base leading-relaxed">
            Scan QR meja atau masukkan kode dari kasir untuk mulai memesan.
          </p>
        </div>

        <!-- Elegant Steps List -->
        <ul class="space-y-3.5 mt-3">
          <li v-for="step in steps" :key="step.n" class="flex items-start gap-3.5 text-stone-650 text-sm font-semibold">
            <span class="size-6 rounded-full bg-amber-700 text-white text-xs font-black flex items-center justify-center shrink-0 shadow-sm">
              {{ step.n }}
            </span>
            <span class="mt-0.5 leading-normal">{{ step.text }}</span>
          </li>
        </ul>
      </div>

      <!-- Right Column: Action Cards -->
      <div class="lg:col-span-6 flex flex-col gap-5">
        
        <!-- Error Alerts -->
        <UAlert
          v-if="sessionError && sessionError !== 'no_session'"
          icon="i-lucide-alert-circle"
          color="error"
          variant="soft"
          :description="sessionError"
          class="rounded-xl border border-rose-200/60 shadow-sm"
        />

        <!-- Action Card Wrapper -->
        <div class="rounded-2xl border border-stone-200/65 bg-white p-5 lg:p-6 shadow-md flex flex-col gap-6 relative overflow-hidden group">
          <!-- Background decoration -->
          <div class="absolute -right-12 -top-12 size-28 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />

          <!-- Option 1: Scan QR Meja -->
          <div class="flex flex-col gap-2.5">
            <div class="flex items-center gap-2 text-stone-900">
              <UIcon name="i-lucide-scan-line" class="size-4.5 text-amber-700 shrink-0" />
              <h2 class="text-sm font-extrabold tracking-wide uppercase text-stone-800">Scan QR Meja</h2>
            </div>
            <p class="text-xs text-stone-500 font-medium">Arahkan kamera ke QR code di meja Anda.</p>
            
            <button
              id="btn-open-qr-scanner"
              type="button"
              :disabled="loading"
              class="w-full min-h-[44px] px-6 py-2.5 rounded-xl bg-amber-700 text-white hover:bg-amber-800 active:scale-[0.98] focus:ring-2 focus:ring-amber-500 disabled:opacity-50 disabled:pointer-events-none shadow-sm font-bold flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer text-sm"
              @click="emit('open-scanner')"
            >
              <UIcon name="i-lucide-qr-code" class="size-4.5 shrink-0" />
              <span>Scan QR Meja</span>
            </button>
          </div>

          <!-- Divider -->
          <div class="flex items-center gap-3">
            <div class="flex-1 h-px bg-stone-200" />
            <span class="text-xs font-bold uppercase tracking-wider text-stone-400">atau</span>
            <div class="flex-1 h-px bg-stone-200" />
          </div>

          <!-- Option 2: Enter Manual Code -->
          <div class="flex flex-col gap-3">
            <div class="flex items-center gap-2 text-stone-900">
              <UIcon name="i-lucide-keyboard" class="size-4.5 text-amber-700 shrink-0" />
              <h2 class="text-sm font-extrabold tracking-wide uppercase text-stone-800">Masukkan Kode Manual</h2>
            </div>
            <p class="text-xs text-stone-500 font-medium">Kode bisa dilihat di QR meja atau struk dari kasir.</p>
            
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
                  base: 'rounded-xl border-stone-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-medium text-stone-850'
                }"
                @keydown.enter="submitManualCode"
              />

              <p v-if="inputError" class="flex items-center gap-1.5 text-xs text-rose-600 font-semibold mt-1">
                <UIcon name="i-lucide-alert-circle" class="size-3.5 shrink-0" />
                <span>{{ inputError }}</span>
              </p>

              <!-- Solid primary button for manual submit -->
              <button
                id="btn-use-manual-code"
                type="button"
                :disabled="loading"
                class="w-full min-h-[44px] px-6 py-2.5 rounded-xl bg-amber-700 text-white hover:bg-amber-800 active:scale-[0.98] focus:ring-2 focus:ring-amber-500 disabled:opacity-50 disabled:pointer-events-none shadow-sm font-bold flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer text-sm mt-1"
                @click="submitManualCode"
              >
                <UIcon v-if="loading" name="i-lucide-loader-2" class="size-4.5 animate-spin shrink-0" />
                <UIcon v-else name="i-lucide-arrow-right" class="size-4.5 shrink-0" />
                <span>{{ loading ? 'Memvalidasi...' : 'Gunakan Kode' }}</span>
              </button>
            </div>
          </div>

        </div>

        <!-- Recent order history (returning customers) -->
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
