<script setup lang="ts">
const props = defineProps<{
  loading?: boolean
}>()

const emit = defineEmits<{
  submit: [code: string]
}>()

const code = ref('')
const error = ref<string | null>(null)

const submitCode = () => {
  error.value = null
  const trimmed = code.value.trim()

  if (!trimmed) {
    error.value = 'Masukkan kode meja terlebih dahulu.'
    return
  }

  emit('submit', trimmed)
}
</script>

<template>
  <div>
    <UInput
      id="manual-table-code"
      v-model="code"
      placeholder="Kode meja atau token QR"
      size="lg"
      :disabled="props.loading"
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      @keydown.enter="submitCode"
    />

    <p v-if="error" class="mt-2 flex items-center gap-1 text-xs text-red-600">
      <UIcon name="i-lucide-alert-circle" class="size-3" />
      {{ error }}
    </p>

    <UButton
      id="btn-use-manual-code"
      block
      size="lg"
      color="primary"
      class="mt-3"
      :loading="props.loading"
      :disabled="props.loading"
      :trailing-icon="props.loading ? undefined : 'i-lucide-arrow-right'"
      :label="props.loading ? 'Memvalidasi...' : 'Gunakan Kode'"
      @click="submitCode"
    />
  </div>
</template>
