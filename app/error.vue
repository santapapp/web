<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: Partial<NuxtError>
}>()

const statusCode = computed(() => props.error?.statusCode ?? 500)
const isNotFound = computed(() => statusCode.value === 404)

const pageTitle = computed(() =>
  isNotFound.value ? 'Halaman tidak ditemukan' : 'Terjadi kesalahan'
)

const pageDescription = computed(() =>
  isNotFound.value
    ? 'Tautan yang Anda buka tidak tersedia. Coba kembali ke beranda atau buka ulang dari halaman restoran.'
    : 'Ada gangguan saat memuat halaman ini. Silakan coba lagi atau kembali ke beranda.'
)

useSeoMeta({
  title: () => `${pageTitle.value} | Santap`,
  description: () => pageDescription.value,
  ogTitle: () => `${pageTitle.value} | Santap`,
  ogDescription: () => pageDescription.value,
  ogType: 'website',
  ogImage: 'https://santap.app/og-default.png',
  ogSiteName: 'Santap',
  ogLocale: 'id_ID',
  twitterCard: 'summary_large_image',
  twitterTitle: () => `${pageTitle.value} | Santap`,
  twitterDescription: () => pageDescription.value,
  twitterImage: 'https://santap.app/og-default.png',
})
useHead({
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})

const goHome = async () => {
  await clearError({ redirect: '/' })
}

const goBack = async () => {
  await clearError()
  if (import.meta.client && window.history.length > 1) {
    window.history.back()
    return
  }
  await clearError({ redirect: '/' })
}
</script>

<template>
  <main
    class="min-h-screen flex items-center justify-center px-5 py-12 sm:py-16 lg:py-20"
    style="background-color: var(--color-bg-page); font-family: var(--font-body);"
  >
    <div class="w-full max-w-5xl">

      <!-- Top divider -->
      <div class="h-px mb-8 sm:mb-12" style="background-color: var(--color-border);" />

      <!-- Brand row -->
      <div class="flex items-center gap-2 mb-8 sm:mb-10">
        <img
          src="~/assets/icons/brand.svg"
          alt="Logo Santap"
          class="h-4 w-4 sm:h-5 sm:w-5"
        />
        <span
          class="text-xs sm:text-sm font-black tracking-tight"
          style="color: var(--color-text-primary);"
        >Santap</span>
      </div>

      <!-- Two-column layout on desktop -->
      <div class="flex flex-col lg:flex-row lg:items-center lg:gap-16 xl:gap-24 mb-8 sm:mb-10">

        <!-- Left: Text content -->
        <div class="flex-1 min-w-0">

          <!-- Status badge + heading -->
          <div class="mb-6 sm:mb-8">
            <span
              class="inline-block font-bold uppercase tracking-[0.15em] mb-4 sm:mb-5"
              style="font-size: clamp(9px, 1.5vw, 10px); color: var(--color-primary);"
            >Error {{ statusCode }}</span>

            <h1
              class="font-medium tracking-tight leading-[1.08] mb-3 sm:mb-4"
              style="font-size: clamp(26px, 5vw, 48px); color: var(--color-text-primary);"
            >
              {{ pageTitle }}
            </h1>

            <p
              class="leading-relaxed"
              style="font-size: clamp(13.5px, 1.8vw, 15px); color: var(--color-text-secondary); line-height: 1.75;"
            >
              {{ pageDescription }}
            </p>
          </div>

          <!-- Illustration — mobile only (between description and buttons) -->
          <div class="flex justify-start mb-6 lg:hidden">
            <NuxtImg
              src="/page-not-found.avif"
              alt="Ilustrasi halaman error Santap"
              width="400"
              height="280"
              sizes="(max-width: 480px) 200px, (max-width: 1024px) 260px"
              class="h-auto object-contain w-[200px] sm:w-[260px]"
              loading="eager"
            />
          </div>

          <!-- Action buttons -->
          <div class="flex flex-col sm:flex-row gap-3">
            <NuxtLink
              to="/"
              class="inline-flex items-center justify-center gap-2 rounded-full font-bold uppercase tracking-[0.08em] no-underline transition-all hover:-translate-y-px cursor-pointer"
              style="
                padding: clamp(12px, 2vw, 14px) clamp(20px, 3vw, 28px);
                font-size: clamp(10px, 1.4vw, 11px);
                background-color: var(--color-text-primary);
                color: #FFFFFF;
              "
              @click.prevent="goHome"
            >
              <UIcon name="i-lucide-house" class="size-3 sm:size-3.5 shrink-0" />
              Kembali ke beranda
            </NuxtLink>

            <button
              class="inline-flex items-center justify-center gap-2 rounded-full font-bold uppercase tracking-[0.08em] transition-all hover:-translate-y-px cursor-pointer border"
              style="
                padding: clamp(12px, 2vw, 14px) clamp(20px, 3vw, 28px);
                font-size: clamp(10px, 1.4vw, 11px);
                background-color: transparent;
                color: var(--color-text-primary);
                border-color: var(--color-border);
              "
              @click="goBack"
            >
              <UIcon name="i-lucide-arrow-left" class="size-3 sm:size-3.5 shrink-0" />
              Kembali sebelumnya
            </button>
          </div>

        </div>

        <!-- Right: Illustration — desktop only -->
        <div class="hidden lg:flex flex-shrink-0 justify-center">
          <NuxtImg
            src="/page-not-found.avif"
            alt="Ilustrasi halaman error Santap"
            width="400"
            height="280"
            sizes="(max-width: 1280px) 320px, 380px"
            class="h-auto object-contain w-[320px] xl:w-[380px]"
            loading="eager"
          />
        </div>

      </div>

      <!-- Bottom divider -->
      <div class="h-px mb-6 sm:mb-8" style="background-color: var(--color-border);" />

      <!-- Footer caption -->
      <p
        class="font-bold uppercase tracking-[0.2em]"
        style="font-size: clamp(9px, 1.5vw, 11px); color: var(--color-text-tertiary);"
      >
        © {{ new Date().getFullYear() }} Santap
      </p>

    </div>
  </main>
</template>
