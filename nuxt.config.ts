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
      // Override via NUXT_PUBLIC_API_BASE_URL (mis. http://127.0.0.1:8000 untuk dev lokal).
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

  // Sitemap — konfigurasi prioritas dan frekuensi crawl per halaman.
  // Halaman dinamis outlet (/o/**) di-exclude karena slug tidak diketahui build-time.
  sitemap: {
    excludeAppSources: true,
    defaults: {
      changefreq: 'monthly',
      priority: 0.5,
      lastmod: new Date().toISOString(),
    },
    urls: [
      { loc: '/', changefreq: 'weekly', priority: 1.0 },
      { loc: '/features', changefreq: 'monthly', priority: 0.9 },
      { loc: '/pricing', changefreq: 'monthly', priority: 0.9 },
      { loc: '/about-us', changefreq: 'monthly', priority: 0.7 },
      { loc: '/company', changefreq: 'monthly', priority: 0.7 },
      { loc: '/contact', changefreq: 'monthly', priority: 0.8 },
      { loc: '/team', changefreq: 'monthly', priority: 0.5 },
      { loc: '/privacy-policy', changefreq: 'yearly', priority: 0.3 },
      { loc: '/terms', changefreq: 'yearly', priority: 0.3 },
    ],
  },

  // Schema.org — identitas organisasi global (single source of truth).
  // @nuxtjs/seo (nuxt-schema-org) memakai identity ini untuk meng-emit node
  // Organization sekali di @graph dan menautkannya ke WebSite + WebPage tiap
  // halaman. JANGAN duplikasi node Organization secara manual di plugin/halaman.
  schemaOrg: {
    identity: {
      type: 'Organization',
      name: 'Santap',
      legalName: 'PT Sarwa Kalyana Cara',
      alternateName: 'Sekeco',
      description:
        'Santap adalah aplikasi kasir (POS) cloud untuk restoran dan cafe di Indonesia: pesanan digital dari meja, open bill, dan pembayaran QRIS.',
      url: 'https://santap.app',
      logo: 'https://santap.app/images/logo.png',
      email: 'info@sekeco.id',
      telephone: '+628986606000',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Sleman',
        addressRegion: 'D.I. Yogyakarta',
        addressCountry: 'ID',
      },
      sameAs: [
        'https://play.google.com/store/apps/details?id=com.santap.pos',
      ],
    },
  },

  // PWA — manifest lengkap + matikan service worker di dev agar tidak flood
  // console dengan error precache (manifest.webmanifest 404, dll).
  // vite-pwa otomatis menyuntikkan <link rel="manifest"> sehingga tidak perlu
  // ditambahkan manual di app.head (mencegah duplikasi).
  pwa: {
    devOptions: { enabled: false },
    registerType: "autoUpdate",
    manifest: {
      name: "Santap — Aplikasi Kasir POS Restoran & Cafe",
      short_name: "Santap",
      description:
        "Aplikasi kasir (POS) cloud untuk restoran dan cafe Indonesia: pesanan digital, open bill, dan pembayaran QRIS.",
      lang: "id",
      dir: "ltr",
      start_url: "/",
      scope: "/",
      display: "standalone",
      orientation: "portrait-primary",
      background_color: "#ffffff",
      theme_color: "#ffffff",
      categories: ["business", "food", "productivity"],
      icons: [
        { src: "/pwa-192x192.png", sizes: "192x192", type: "image/png", purpose: "any" },
        { src: "/pwa-512x512.png", sizes: "512x512", type: "image/png", purpose: "any" },
        { src: "/maskable-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      ],
    },
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
      // Disable automatic site name appending by SEO module to prevent duplicate suffixes
      titleTemplate: "%s",
      // Default head — halaman yang tidak override useSeoMeta akan memakai ini.
      // Halaman outlet menggantikan semua ini via useOutletSeo composable.
      htmlAttrs: { lang: "id" },
      // Favicon, icon, dan apple-touch-icon. <link rel="manifest"> disuntikkan
      // otomatis oleh vite-pwa, jadi tidak ditambahkan di sini.
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
        { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
        { rel: "icon", type: "image/png", sizes: "48x48", href: "/favicon-48x48.png" },
        { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
        { rel: "apple-touch-icon", sizes: "167x167", href: "/apple-touch-icon-167x167.png" },
        { rel: "apple-touch-icon", sizes: "152x152", href: "/apple-touch-icon-152x152.png" },
        { rel: "apple-touch-icon", sizes: "120x120", href: "/apple-touch-icon-120x120.png" },
        // Resource hints — percepat koneksi awal ke API publik dan WebSocket Reverb.
        { rel: "preconnect", href: "https://api.santap.app", crossorigin: "" },
        { rel: "dns-prefetch", href: "https://api.santap.app" },
        { rel: "preconnect", href: "https://reverb.santap.app", crossorigin: "" },
        { rel: "dns-prefetch", href: "https://reverb.santap.app" },
      ],
      meta: [
        { name: "theme-color", content: "#ffffff" },
        { name: "msapplication-TileColor", content: "#f95e22" },
        { name: "msapplication-config", content: "/browserconfig.xml" },
        { name: "format-detection", content: "telephone=no" },
      ],
    },
  },
});
