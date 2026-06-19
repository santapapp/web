// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxt/ui",
    "@nuxt/image",
    "@nuxt/fonts",
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "@vite-pwa/nuxt",
    "@nuxtjs/seo",
  ],
  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    public: {
      // Override via NUXT_PUBLIC_API_BASE_URL (mis. http://localhost:8000 untuk dev lokal).
      // Default production menunjuk ke API publik Santap.
      apiBaseUrl: "https://api.santap.app",
      useMockApi: false,
      reverbAppKey: process.env.NUXT_PUBLIC_REVERB_APP_KEY || process.env.VITE_REVERB_APP_KEY || process.env.REVERB_APP_KEY || "",
      reverbHost: process.env.NUXT_PUBLIC_REVERB_HOST || process.env.VITE_REVERB_HOST || process.env.REVERB_HOST || "",
      reverbPort: process.env.NUXT_PUBLIC_REVERB_PORT || process.env.VITE_REVERB_PORT || process.env.REVERB_PORT || "",
      reverbScheme: process.env.NUXT_PUBLIC_REVERB_SCHEME || process.env.VITE_REVERB_SCHEME || process.env.REVERB_SCHEME || "https",
    },
  },
  // Konfigurasi site — dipakai oleh @nuxtjs/seo (nuxt-site-config) sebagai default
  // untuk canonical URL, OG site_name, sitemap, dan schema.org.
  site: {
    url: "https://santap.app",
    name: "Santap",
    description:
      "Santap membantu restoran menerima pesanan digital dari meja, open bill, dan pembayaran QRIS secara praktis.",
    defaultLocale: "id",
    indexable: true,
  },

  // Robots.txt — disallow halaman sesi/order/payment agar token dan data
  // customer tidak ter-index oleh search engine.
  robots: {
    groups: [
      {
        userAgent: ["*"],
        disallow: ["/o/*/orders", "/o/*/payments"],
        allow: ["/"],
      },
    ],
  },

  image: {
    domains: ["images.unsplash.com"],
  },
  fonts: {
    families: [
      {
        name: "Plus Jakarta Sans",
        provider: "google",
        weights: [400, 500, 600, 700, 800],
      },
      {
        name: "Fraunces",
        provider: "google",
        weights: [400, 600, 700, 900],
        styles: ["italic", "normal"],
      },
    ],
    defaults: {
      preload: true,
    },
  },
  app: {
    head: {
      // Default head — halaman yang tidak override useSeoMeta akan memakai ini.
      // Halaman outlet menggantikan semua ini via useOutletSeo composable.
      htmlAttrs: { lang: "id" },
      meta: [{ name: "theme-color", content: "#ffffff" }],
    },
  },
});
