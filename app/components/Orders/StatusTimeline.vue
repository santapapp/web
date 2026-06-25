<script setup lang="ts">
/**
 * StatusTimeline.vue
 * Timeline progres status pesanan (derived dari order_status — TIDAK menambah data baru).
 *
 * Backend hanya memberi satu nilai order_status (pending|confirmed|preparing|ready|
 * completed|cancelled), bukan riwayat transisi bertimestamp. Maka timeline ini murni representasi
 * visual dari status saat ini: langkah sebelum = selesai (check hijau), langkah saat ini =
 * aktif (oranye), langkah sesudah = menunggu (abu).
 *
 * Timestamp hanya ditampilkan bila benar-benar tersedia (created_at untuk langkah pertama).
 * Langkah aktif diberi label "Sekarang". Tidak ada waktu yang dikarang.
 */

import type { OrderStatus } from '~/types/customer-order'
import { ORDER_STATUS_RANK } from '~/composables/useOrderStatus'

const props = defineProps<{
  status: OrderStatus
  orderType?: string
  createdAt?: string | null
}>()

const isOpenBill = computed(() => props.orderType === 'open_bill')

// Rank progres order_status (sumber tunggal di useOrderStatus).
const currentRank = computed(() => ORDER_STATUS_RANK[props.status] ?? 0)

interface TimelineStep {
  label: string
  desc: string
  /** Rank minimum agar langkah ini dianggap selesai */
  threshold: number
  icon: string
}

const steps = computed<TimelineStep[]>(() => [
  {
    label: 'Pesanan Diterima',
    desc: 'Pesananmu sudah masuk ke sistem',
    threshold: 1,
    icon: 'i-lucide-clipboard-check'
  },
  {
    label: 'Sedang Diproses',
    desc: 'Dapur sedang menyiapkan pesananmu',
    threshold: 2,
    icon: 'i-lucide-cooking-pot'
  },
  {
    label: 'Siap Disajikan',
    desc: 'Pesananmu sudah siap',
    threshold: 3,
    icon: 'i-lucide-utensils-crossed'
  },
  {
    label: isOpenBill.value ? 'Pesanan Selesai' : 'Diantar ke Meja',
    desc: 'Selamat menikmati makananmu',
    threshold: 4,
    icon: isOpenBill.value ? 'i-lucide-check-check' : 'i-lucide-hand-platter'
  }
])

type StepState = 'done' | 'active' | 'pending'

const stepState = (threshold: number, index: number): StepState => {
  if (currentRank.value >= threshold) return 'done'
  // Langkah aktif = langkah pertama yang belum selesai
  const firstPendingIndex = steps.value.findIndex((s) => currentRank.value < s.threshold)
  return index === firstPendingIndex ? 'active' : 'pending'
}

const createdTime = computed(() => {
  if (!props.createdAt) return null
  try {
    return new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(props.createdAt))
  } catch {
    return null
  }
})
</script>

<template>
  <ol class="relative flex flex-col">
    <li
      v-for="(step, index) in steps"
      :key="step.label"
      class="relative flex gap-2.5 pb-4 last:pb-0"
    >
      <!-- Connector line -->
      <span
        v-if="index < steps.length - 1"
        class="absolute left-[11px] top-6 bottom-0 w-0.5"
        :class="stepState(step.threshold, index) === 'done' ? 'bg-green-500' : 'bg-stone-200'"
        aria-hidden="true"
      />

      <!-- Node -->
      <span
        class="relative z-10 flex-shrink-0 size-6 rounded-full flex items-center justify-center transition-colors duration-200"
        :class="{
          'bg-green-500 text-white': stepState(step.threshold, index) === 'done',
          'bg-amber-600 text-white ring-4 ring-amber-100': stepState(step.threshold, index) === 'active',
          'bg-stone-100 text-stone-300 border border-stone-200': stepState(step.threshold, index) === 'pending'
        }"
      >
        <UIcon
          v-if="stepState(step.threshold, index) === 'done'"
          name="i-lucide-check"
          class="size-3"
        />
        <UIcon
          v-else
          :name="step.icon"
          class="size-3"
          :class="{ 'animate-pulse': stepState(step.threshold, index) === 'active' }"
        />
      </span>

      <!-- Label -->
      <div class="min-w-0 pt-0.5">
        <p
          class="text-xs font-semibold leading-tight"
          :class="stepState(step.threshold, index) === 'pending' ? 'text-stone-400' : 'text-stone-900'"
        >
          {{ step.label }}
        </p>

        <!-- Waktu hanya bila tersedia (langkah pertama = created_at), aktif = 'Sekarang' -->
        <p class="text-[10px] mt-0.5 leading-snug" :class="stepState(step.threshold, index) === 'pending' ? 'text-stone-300' : 'text-stone-500'">
          <template v-if="stepState(step.threshold, index) === 'active'">
            Sekarang
          </template>
          <template v-else-if="index === 0 && createdTime">
            {{ createdTime }}
          </template>
        </p>

        <p
          v-if="stepState(step.threshold, index) === 'active'"
          class="text-[10px] text-stone-400 mt-0.5 leading-snug"
        >
          {{ step.desc }}
        </p>
      </div>
    </li>
  </ol>
</template>
