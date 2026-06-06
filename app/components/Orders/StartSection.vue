<script setup lang="ts">
/**
 * StartSection.vue
 * Entry state ketika customer belum memiliki sesi aktif.
 *
 * Layout desktop: 2 kolom
 * - Kiri (sticky): Restaurant Info Panel — logo, nama, status, alamat, kontak, deskripsi, quick CTAs
 * - Kanan (scrollable): QR scanner card, manual code input, recent history
 *
 * Layout mobile: satu kolom, info restoran sebagai compact card di atas
 */

import { ref } from 'vue'
import type { OrderHistoryItem } from '~/types/order-history'
import type { PublicOrg, OpeningStatus } from '~/types/org'

const props = defineProps<{
  sessionError?: string | null
  loading?: boolean
  historyItems?: OrderHistoryItem[]
  orgSlug?: string
  org?: PublicOrg | null
  openingStatus?: OpeningStatus | null
  fullAddress?: string
}>()

const emit = defineEmits<{
  'open-scanner': []
  'submit-manual': [code: string]
}>()

const code = ref('')
const inputError = ref<string | null>(null)

const submitManualCode = () => {
  inputError.value = null
  const trimmed = code.value.trim()
  if (!trimmed) {
    inputError.value = 'Masukkan kode meja terlebih dahulu.'
    return
  }
  emit('submit-manual', trimmed)
}

// Initials fallback untuk logo
const initials = computed(() => {
  if (!props.org?.name) return 'R'
  return props.org.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
})

// Status warna
const statusDotClass = computed(() => {
  if (!props.openingStatus) return 'bg-gray-300'
  return props.openingStatus.open ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
})
</script>

<template>
  <div class="flex-1 bg-gray-50 px-4 py-6 lg:py-10 min-h-[calc(100dvh-56px)] lg:min-h-[calc(100dvh-64px)]">
    <div class="w-full max-w-5xl mx-auto lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start">

      <!-- ════════════════════════════════════════════════════════════
           LEFT COLUMN — Restaurant Info Panel (sticky on desktop)
           ════════════════════════════════════════════════════════════ -->
      <aside class="lg:col-span-5 lg:sticky lg:top-[88px] lg:self-start mb-6 lg:mb-0">
        <div class="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden motion-card hover:shadow-md">

          <!-- Loading skeleton saat org belum tersedia -->
          <template v-if="!org && !orgSlug">
            <div class="p-5 flex flex-col gap-3">
              <div class="flex items-center gap-3">
                <div class="size-14 rounded-xl bg-gray-100 animate-pulse shrink-0" />
                <div class="flex-1 space-y-2">
                  <div class="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
                  <div class="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
                </div>
              </div>
              <div class="h-3 bg-gray-100 rounded animate-pulse" />
              <div class="h-3 bg-gray-100 rounded animate-pulse w-5/6" />
            </div>
          </template>

          <template v-else>
            <!-- Header area: logo + nama + slug -->
            <div class="p-5 pb-4 flex items-start gap-4 border-b border-gray-50">
              <!-- Logo / Avatar -->
              <div class="size-14 rounded-xl overflow-hidden flex-shrink-0 bg-orange-50 border border-orange-100/60 flex items-center justify-center shadow-sm">
                <img
                  v-if="org?.logo"
                  :src="org.logo"
                  :alt="org?.name"
                  class="w-full h-full object-cover"
                />
                <span v-else class="text-xl font-black text-orange-600 select-none">{{ initials }}</span>
              </div>

              <!-- Name + status -->
              <div class="flex-1 min-w-0 pt-0.5">
                <h1 class="text-base font-extrabold text-gray-900 leading-snug line-clamp-2">
                  {{ org?.name || 'Restoran' }}
                </h1>

                <!-- Status badge -->
                <div v-if="openingStatus" class="mt-2 flex items-center gap-1.5 w-fit">
                  <span class="size-1.5 rounded-full flex-shrink-0" :class="statusDotClass" />
                  <span class="text-xs font-bold" :class="openingStatus.open ? 'text-emerald-700' : 'text-rose-600'">
                    {{ openingStatus.label }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Info rows -->
            <div class="px-5 py-4 flex flex-col gap-3">

              <!-- Deskripsi -->
              <p
                v-if="org?.description"
                class="text-xs text-gray-500 leading-relaxed font-medium"
              >
                {{ org.description }}
              </p>

              <!-- Telepon -->
              <a
                v-if="org?.phone"
                :href="`tel:${org.phone}`"
                class="flex items-center gap-2.5 group"
              >
                <span class="size-7 rounded-lg bg-orange-50 border border-orange-100/60 flex items-center justify-center shrink-0 transition-colors duration-200 group-hover:bg-orange-100">
                  <UIcon name="i-lucide-phone" class="size-3.5 text-orange-600" />
                </span>
                <span class="text-xs text-gray-600 font-semibold group-hover:text-orange-700 transition-colors duration-200">
                  {{ org.phone }}
                </span>
              </a>

              <!-- Email -->
              <a
                v-if="org?.email"
                :href="`mailto:${org.email}`"
                class="flex items-center gap-2.5 group"
              >
                <span class="size-7 rounded-lg bg-orange-50 border border-orange-100/60 flex items-center justify-center shrink-0 transition-colors duration-200 group-hover:bg-orange-100">
                  <UIcon name="i-lucide-mail" class="size-3.5 text-orange-600" />
                </span>
                <span class="text-xs text-gray-600 font-semibold group-hover:text-orange-700 transition-colors duration-200 truncate">
                  {{ org.email }}
                </span>
              </a>

              <!-- Mata uang / Pajak -->
              <div class="flex items-center gap-2.5">
                <span class="size-7 rounded-lg bg-orange-50 border border-orange-100/60 flex items-center justify-center shrink-0">
                  <UIcon name="i-lucide-receipt-text" class="size-3.5 text-orange-600" />
                </span>
                <div class="flex flex-wrap items-center gap-1.5 text-xs text-gray-500 font-medium">
                  <span>{{ org?.currency || 'IDR' }}</span>
                  <template v-if="org?.tax_enabled">
                    <span class="text-gray-300">·</span>
                    <span>PPN {{ org.tax_rate }}%</span>
                  </template>
                  <template v-if="org?.service_charge_enabled">
                    <span class="text-gray-300">·</span>
                    <span>Layanan {{ org.service_charge_rate }}%</span>
                  </template>
                </div>
              </div>
            </div>
          </template>
        </div>
      </aside>

      <!-- ════════════════════════════════════════════════════════════
           RIGHT COLUMN — Action cards + history
           ════════════════════════════════════════════════════════════ -->
      <div class="lg:col-span-7 flex flex-col gap-4">

        <!-- Error Alert -->
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <UAlert
            v-if="sessionError && sessionError !== 'no_session'"
            icon="i-lucide-alert-circle"
            color="error"
            variant="soft"
            :description="sessionError"
            class="rounded-xl border border-rose-200/60 shadow-sm"
          />
        </Transition>

        <!-- ── QR Scanner Card ─────────────────────────────────── -->
        <button
          id="btn-open-qr-scanner"
          type="button"
          :disabled="loading"
          class="qr-scan-btn group relative flex items-center gap-4 w-full bg-gray-900 text-white rounded-2xl overflow-hidden cursor-pointer disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] transition-all duration-200 motion-card"
          @click="emit('open-scanner')"
        >
          <!-- Animated decorative ornaments -->
          <div class="absolute inset-0 pointer-events-none overflow-hidden">
            <div class="absolute -top-6 -right-6 size-24 bg-orange-500/20 rotate-12 rounded-2xl transition-opacity duration-300 group-hover:opacity-80" />
            <div class="absolute top-3 right-14 size-5 rounded-full bg-orange-400/30 ornament-float" />
            <div class="absolute bottom-3 right-6 size-3 rounded-sm bg-white/10 ornament-pulse rotate-45" />
            <div class="absolute -bottom-4 -left-4 size-16 bg-orange-600/20 -rotate-6 rounded-xl" />
            <div class="absolute top-2 right-3 flex gap-1">
              <div class="size-1.5 rounded-full bg-orange-400/50" />
              <div class="size-1.5 rounded-full bg-orange-400/30" />
              <div class="size-1 rounded-full bg-orange-400/20 mt-0.5" />
            </div>
          </div>

          <!-- Left: QR Icon block -->
          <div class="relative flex-shrink-0 flex items-center justify-center size-[80px] bg-white/10 group-hover:bg-white/15 transition-colors duration-200">
            <UIcon name="i-lucide-qr-code" class="size-9 text-orange-400 group-hover:text-orange-300 transition-colors duration-200" />
          </div>

          <!-- Text content -->
          <div class="flex-1 py-5 pr-4 text-left">
            <p class="text-[10px] font-bold uppercase tracking-widest text-orange-400 mb-1">Cara cepat</p>
            <p class="text-[16px] font-extrabold text-white leading-tight mb-1">Scan QR Meja</p>
            <p class="text-[12px] text-gray-400 font-medium">Arahkan kamera ke QR di meja Anda</p>
          </div>

          <!-- Arrow indicator -->
          <div class="flex-shrink-0 pr-5">
            <div class="size-8 rounded-full bg-orange-600 flex items-center justify-center group-hover:bg-orange-500 transition-colors duration-200">
              <UIcon name="i-lucide-scan-line" class="size-4" />
            </div>
          </div>
        </button>

        <!-- ── Divider ─────────────────────────────────────────── -->
        <div class="flex items-center gap-3">
          <div class="flex-1 h-px bg-gray-200" />
          <span class="text-xs font-bold uppercase tracking-wider text-gray-400">atau</span>
          <div class="flex-1 h-px bg-gray-200" />
        </div>

        <!-- ── Manual Code Card ───────────────────────────────── -->
        <div class="motion-card bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 p-5 flex flex-col gap-3 transition-all duration-300">
          <div class="flex items-center gap-2.5">
            <div class="size-9 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
              <UIcon name="i-lucide-keyboard" class="size-4 text-slate-500" />
            </div>
            <div>
              <p class="text-[13px] font-extrabold text-gray-800 leading-tight">Masukkan Kode Manual</p>
              <p class="text-[11px] text-gray-400 font-medium">Dari struk kasir atau QR code di meja</p>
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <div class="flex gap-2 items-start">
              <div class="flex-1 min-w-0">
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
                    base: 'rounded-xl border-gray-200 focus:border-orange-400 focus:ring-1 focus:ring-orange-400 font-medium text-gray-800 transition-all duration-200'
                  }"
                  @keydown.enter="submitManualCode"
                />
              </div>

              <button
                id="btn-use-manual-code"
                type="button"
                :disabled="loading"
                aria-label="Gunakan kode"
                class="motion-btn h-[44px] w-[44px] rounded-xl bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer"
                @click="submitManualCode"
              >
                <UIcon v-if="loading" name="i-lucide-loader-2" class="size-4.5 animate-spin shrink-0" />
                <UIcon v-else name="i-lucide-arrow-right" class="size-4.5 shrink-0" />
              </button>
            </div>

            <Transition
              enter-active-class="transition-all duration-200 ease-out"
              enter-from-class="opacity-0 -translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition-all duration-150 ease-in"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
            >
              <p v-if="inputError" class="flex items-center gap-1.5 text-xs text-rose-600 font-semibold mt-0.5">
                <UIcon name="i-lucide-alert-circle" class="size-3.5 shrink-0" />
                <span>{{ inputError }}</span>
              </p>
            </Transition>
          </div>
        </div>

        <!-- ── Recent order history ───────────────────────────── -->
        <Transition
          enter-active-class="transition-all duration-400 ease-out"
          enter-from-class="opacity-0 translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
        >
          <OrdersRecentHistory
            v-if="orgSlug && historyItems && historyItems.length"
            :items="historyItems"
            :org-slug="orgSlug"
            :step="5"
          />
        </Transition>
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
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.22), 0 0 0 1px rgba(255, 255, 255, 0.08);
  transform: translateY(-1px);
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

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .ornament-float,
  .ornament-pulse {
    animation: none !important;
  }

  .qr-scan-btn:hover,
  .motion-card:hover {
    transform: none !important;
  }
}
</style>
