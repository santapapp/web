<script setup lang="ts">
/**
 * ConfirmExitSessionModal — Modal konfirmasi keluar sesi
 *
 * Props:
 * - open: boolean — tampilkan modal
 * - hasCartItems: boolean — tampilkan warning cart akan hilang
 * - sessionMode: 'table' | 'open_bill' | null — beda teks untuk tiap mode
 *
 * Emits:
 * - confirm: user menekan "Ya, Keluar"
 * - cancel: user menekan "Batal"
 */

const props = defineProps<{
  open: boolean
  hasCartItems?: boolean
  sessionMode?: 'table' | 'open_bill' | null
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const title = computed(() => {
  if (props.sessionMode === 'open_bill') return 'Keluar dari Open Bill?'
  return 'Keluar dari sesi meja?'
})

const description = computed(() => {
  if (props.sessionMode === 'open_bill') {
    return 'Anda akan keluar dari sesi open bill ini. Bill tetap berjalan di sisi kasir.'
  }
  return 'Anda perlu scan ulang QR meja untuk memesan kembali.'
})
</script>

<template>
  <Transition name="modal-fade">
    <div v-if="open" class="modal-overlay" @click.self="emit('cancel')">
      <div class="modal-sheet" role="dialog" aria-modal="true" :aria-label="title">
        <!-- Handle bar (mobile) -->
        <div class="modal-handle" />

        <!-- Icon -->
        <div class="modal-icon-wrap">
          <UIcon name="i-lucide-log-out" class="size-6 text-red-500" />
        </div>

        <h3 class="modal-title">{{ title }}</h3>
        <p class="modal-desc">{{ description }}</p>

        <!-- Cart warning -->
        <div v-if="hasCartItems" class="cart-warning">
          <UIcon name="i-lucide-triangle-alert" class="size-4 text-amber-600" />
          <p>Keranjang Anda akan dikosongkan. Pesanan yang belum disubmit akan hilang.</p>
        </div>

        <div class="modal-actions">
          <UButton
            id="btn-cancel-exit-session"
            block
            color="neutral"
            variant="outline"
            label="Batal"
            size="md"
            @click="emit('cancel')"
          />
          <UButton
            id="btn-confirm-exit-session"
            block
            color="error"
            variant="solid"
            label="Ya, Keluar"
            icon="i-lucide-log-out"
            size="md"
            @click="emit('confirm')"
          />
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(13, 11, 9, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

@media (min-width: 480px) {
  .modal-overlay {
    align-items: center;
  }
}

.modal-sheet {
  background: #FAFAF9;
  width: 100%;
  max-width: 400px;
  border-radius: 20px 20px 0 0;
  padding: 12px 20px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  box-shadow: 0 -8px 40px rgba(0, 0, 0, 0.2);
}

@media (min-width: 480px) {
  .modal-sheet {
    border-radius: 20px;
    padding: 28px 24px;
  }
}

.modal-handle {
  width: 36px;
  height: 4px;
  background: #ddd;
  border-radius: 2px;
  margin-bottom: 8px;
}

@media (min-width: 480px) {
  .modal-handle {
    display: none;
  }
}

.modal-icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: #fff1f0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-title {
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  color: #1a1714;
  text-align: center;
}

.modal-desc {
  margin: 0;
  font-size: 13px;
  color: #6b6055;
  line-height: 1.55;
  text-align: center;
}

.cart-warning {
  background: #fffbeb;
  border: 1px solid rgba(217, 119, 6, 0.3);
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
  box-sizing: border-box;
}

.cart-warning p {
  margin: 0;
  font-size: 12px;
  color: #92400e;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  margin-top: 4px;
}

/* Transition */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-active .modal-sheet,
.modal-fade-leave-active .modal-sheet {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-fade-enter-from {
  opacity: 0;
}

.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal-sheet {
  transform: translateY(30px);
}

.modal-fade-leave-to .modal-sheet {
  transform: translateY(30px);
}
</style>
