// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@nuxt/image',
    '@nuxt/fonts',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@vite-pwa/nuxt',
    '@nuxtjs/seo'
  ],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      // Override via NUXT_PUBLIC_API_BASE_URL (mis. http://localhost:8000 untuk dev lokal).
      // Default production menunjuk ke API publik Santap.
      apiBaseUrl: 'https://api.santap.app',
      useMockApi: false
    }
  },
  image: {
    domains: ['images.unsplash.com']
  },
  fonts: {
    families: [
      {
        name: 'Plus Jakarta Sans',
        provider: 'google',
        weights: [400, 500, 600, 700, 800]
      },
      {
        name: 'Fraunces',
        provider: 'google',
        weights: [400, 600, 700, 900],
        styles: ['italic', 'normal']
      }
    ],
    defaults: {
      preload: true
    }
  },
  app: {
    head: {
      title: 'Santap — Platform POS Cloud untuk Bisnis Kuliner',
      meta: [
        {
          name: 'description',
          content:
            'Sistem kasir (POS) berbasis cloud untuk restoran dan cafe. Kelola pesanan, inventaris, dan laporan secara real-time dari mana saja.'
        }
      ]
    }
  }
})
