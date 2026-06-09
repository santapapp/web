<script setup lang="ts">
/**
 * OrgStatusPage.vue
 * Shared full-page state for outlet not-found and server error conditions.
 * Used by /o/[orgSlug]/index.vue and /o/[orgSlug]/orders.vue.
 */

const props = withDefaults(
  defineProps<{
    /** 'not_found' = 404-style, 'server_error' = 5xx / network error */
    type: 'not_found' | 'server_error'
  }>(),
  { type: 'not_found' }
)

const emit = defineEmits<{
  retry: []
}>()

const isNotFound = computed(() => props.type === 'not_found')

const badge = computed(() =>
  isNotFound.value ? 'OUTLET TIDAK TERSEDIA' : 'GANGGUAN TEKNIS'
)
const title = computed(() =>
  isNotFound.value ? 'Outlet tidak ditemukan' : 'Terjadi kesalahan'
)
const description = computed(() =>
  isNotFound.value
    ? 'Link outlet tidak valid atau outlet sedang tidak tersedia. Coba kembali ke beranda atau minta link baru dari restoran.'
    : 'Ada gangguan saat memuat outlet ini. Silakan coba lagi beberapa saat.'
)
const illustrationSrc = computed(() =>
  isNotFound.value ? '/store-closed.avif' : '/page-not-found.avif'
)
const illustrationAlt = computed(() =>
  isNotFound.value
    ? 'Ilustrasi outlet tidak ditemukan'
    : 'Ilustrasi gangguan server'
)

const showScanner = ref(false)
const scanLoading = ref(false)

const openScanner = () => {
  showScanner.value = true
}

const handleScanToken = async (token: string) => {
  showScanner.value = false
  scanLoading.value = true
  const customerSession = useCustomerSession()
  const router = useRouter()
  const route = useRoute()
  const currentOrgSlug = String(route.params.orgSlug || '')

  try {
    const result = await customerSession.startSessionFromToken(token, { orgSlug: currentOrgSlug })

    if (result.success) {
      await router.replace({
        path: `/o/${currentOrgSlug}/orders`,
        query: { table: token }
      })
    } else if (result.correctSlug) {
      await router.replace({
        path: `/o/${result.correctSlug}/orders`,
        query: { table: token }
      })
    } else {
      alert(result.error || 'Format QR atau kode meja tidak valid.')
    }
  } finally {
    scanLoading.value = false
  }
}
</script>

<template>
  <section
    class="flex min-h-[calc(100dvh-56px)] lg:min-h-[calc(100dvh-64px)] items-center justify-center px-5 py-10 sm:py-14"
    style="background-color: var(--color-bg-page); font-family: var(--font-body);"
  >
    <div class="w-full max-w-sm sm:max-w-md lg:max-w-lg">

      <!-- Loading view -->
      <OrdersSessionLoading v-if="scanLoading" />

      <!-- Error / not found content -->
      <template v-else>

        <!-- Top divider -->
        <div class="h-px mb-6 sm:mb-8" style="background-color: var(--color-border);" />

        <!-- Brand row -->
        <div class="flex items-center gap-2 mb-5 sm:mb-6">
          <img
            src="~/assets/icons/brand.svg"
            alt="Logo Santap"
            class="h-4 w-4 sm:h-5 sm:w-5"
          />
          <span
            class="font-black tracking-tight"
            style="font-size: clamp(12px, 2vw, 14px); color: var(--color-text-primary);"
          >Santap</span>
        </div>

        <!-- Badge + heading + description -->
        <div class="mb-5 sm:mb-6">
          <span
            class="inline-block font-bold uppercase tracking-[0.15em] mb-3 sm:mb-4"
            style="font-size: clamp(9px, 1.5vw, 10px); color: var(--color-primary);"
          >
            {{ badge }}
          </span>

          <h1
            class="font-medium tracking-tight leading-[1.08] mb-2.5 sm:mb-3"
            style="font-size: clamp(22px, 5vw, 36px); color: var(--color-text-primary);"
          >
            {{ title }}
          </h1>

          <p
            style="font-size: clamp(13px, 1.8vw, 14px); color: var(--color-text-secondary); line-height: 1.75;"
          >
            {{ description }}
          </p>
        </div>

        <!-- Illustration -->
        <div class="mb-5 sm:mb-7">
          <NuxtImg
            :src="illustrationSrc"
            :alt="illustrationAlt"
            width="280"
            height="200"
            sizes="(max-width: 360px) 180px, (max-width: 480px) 220px, (max-width: 640px) 260px, 280px"
            class="h-auto object-contain"
            style="width: clamp(160px, 55vw, 280px);"
            loading="eager"
          />
        </div>

        <!-- Bottom divider -->
        <div class="h-px mb-5 sm:mb-6" style="background-color: var(--color-border);" />

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
          <NuxtLink
            to="/"
            class="inline-flex items-center justify-center gap-2 rounded-full font-bold uppercase tracking-[0.08em] no-underline transition-all hover:-translate-y-px cursor-pointer flex-1"
            style="
              padding: clamp(11px, 2vw, 14px) clamp(16px, 3vw, 20px);
              font-size: clamp(10px, 1.4vw, 11px);
              background-color: var(--color-text-primary);
              color: #FFFFFF;
            "
          >
            <UIcon name="i-lucide-house" class="size-3 sm:size-3.5 shrink-0" />
            Kembali ke Beranda
          </NuxtLink>

          <button
            v-if="!isNotFound"
            type="button"
            class="inline-flex items-center justify-center gap-2 rounded-full font-bold uppercase tracking-[0.08em] transition-all hover:-translate-y-px cursor-pointer border flex-1"
            style="
              padding: clamp(11px, 2vw, 14px) clamp(16px, 3vw, 20px);
              font-size: clamp(10px, 1.4vw, 11px);
              background-color: transparent;
              color: var(--color-text-primary);
              border-color: var(--color-border);
            "
            @click="emit('retry')"
          >
            <UIcon name="i-lucide-refresh-cw" class="size-3 sm:size-3.5 shrink-0" />
            Coba Lagi
          </button>

          <button
            v-if="isNotFound"
            type="button"
            class="inline-flex items-center justify-center gap-2 rounded-full font-bold uppercase tracking-[0.08em] transition-all hover:-translate-y-px cursor-pointer border flex-1"
            style="
              padding: clamp(11px, 2vw, 14px) clamp(16px, 3vw, 20px);
              font-size: clamp(10px, 1.4vw, 11px);
              background-color: transparent;
              color: var(--color-text-primary);
              border-color: var(--color-border);
            "
            @click="openScanner"
          >
            <UIcon name="i-lucide-scan-line" class="size-3 sm:size-3.5 shrink-0" />
            Scan QR Ulang
          </button>
        </div>

        <!-- Footer -->
        <p
          class="mt-6 sm:mt-8 font-bold uppercase tracking-[0.2em]"
          style="font-size: clamp(9px, 1.5vw, 11px); color: var(--color-text-tertiary);"
        >
          © {{ new Date().getFullYear() }} Santap
        </p>

      </template>
    </div>
  </section>

  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <OrdersQrScannerPanel
        v-if="showScanner"
        @scan="handleScanToken"
        @close="showScanner = false"
      />
    </Transition>
  </Teleport>
</template>