/**
 * seo-global.ts
 *
 * Plugin Nuxt yang menyuntikkan SEO global di setiap halaman:
 *   1. JSON-LD SoftwareApplication — memberitahu Google bahwa Santap adalah SaaS POS
 *   2. Geo meta tags — menandai lokasi perusahaan (Sleman, D.I. Yogyakarta)
 *
 * Node Organization TIDAK di-emit di sini. Sumber tunggalnya ada di nuxt.config
 * `schemaOrg.identity` yang di-link ke WebSite/WebPage oleh @nuxtjs/seo. Ini
 * mencegah duplikasi structured data (dua node Organization).
 *
 * Tag ini di-inject sekali di level plugin (bukan per-halaman) agar konsisten.
 * Halaman outlet punya SEO tambahan sendiri via useOutletSeo composable.
 */
export default defineNuxtPlugin(() => {
  useHead({
    meta: [
      // ── Geo meta tags ─────────────────────────────────────────────────────
      // Menandai lokasi kantor pusat Santap di Sleman, Yogyakarta.
      { name: 'geo.region', content: 'ID-YO' },
      { name: 'geo.placename', content: 'Sleman, D.I. Yogyakarta' },
      { name: 'geo.position', content: '-7.7167;110.3558' },
      { name: 'ICBM', content: '-7.7167, 110.3558' },

      // ── Verification & general ─────────────────────────────────────────────
      { name: 'author', content: 'Santap' },
      { name: 'publisher', content: 'PT Sarwa Kalyana Cara' },
      { name: 'keywords', content: 'aplikasi kasir, pos online, pos cloud, qris restoran, point of sale indonesia, kasir mobile, kasir cafe, aplikasi restoran, sekeco' },
      { name: 'application-name', content: 'Santap' },
    ],
    script: [
      // ── JSON-LD: SoftwareApplication ───────────────────────────────────────
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Santap',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Android',
          description:
            'Aplikasi kasir (POS) mobile berbasis cloud untuk restoran dan cafe Indonesia. Kelola pesanan, pembayaran QRIS, dan laporan penjualan.',
          url: 'https://santap.app',
          installUrl:
            'https://play.google.com/store/apps/details?id=com.santap.pos',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'IDR',
            description: 'Gratis 14 hari trial, tanpa kartu kredit.',
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            ratingCount: '1000',
            bestRating: '5',
          },
          publisher: {
            '@type': 'Organization',
            name: 'PT Sarwa Kalyana Cara',
            alternateName: 'Sekeco',
            url: 'https://santap.app',
          },
        }),
      },
    ],
  })
})
