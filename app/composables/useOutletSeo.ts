/**
 * useOutletSeo
 *
 * Composable SEO terpusat untuk semua halaman customer outlet (/o/[orgSlug]/**).
 *
 * Menangani 4 SEO state:
 *   - loading   → noindex, title minimal
 *   - success   → full dynamic SEO, canonical, JSON-LD (outlet-index only)
 *   - not-found → noindex, "Outlet tidak ditemukan"
 *   - error     → noindex, "Terjadi kesalahan"
 *
 * Karena semua title/description/robots/og dihitung dari computed state terbaru,
 * tidak ada risiko metadata stale saat user berpindah antar slug outlet.
 */

import type { MaybeRefOrGetter } from 'vue'
import type { PublicOrg } from '~/types/org'

export type OutletRouteType = 'outlet-index' | 'orders' | 'payment' | 'menu'

export interface UseOutletSeoOptions {
  org: Ref<PublicOrg | null | undefined>
  isLoading: MaybeRefOrGetter<boolean>
  isNotFound: MaybeRefOrGetter<boolean>
  isServerError: MaybeRefOrGetter<boolean>
  routeType?: OutletRouteType
}

const SITE_NAME = 'Santap'
const SITE_URL = 'https://santap.app'
const DEFAULT_OG_IMAGE = 'https://santap.app/og-default.png'

export function useOutletSeo(
  orgSlug: MaybeRefOrGetter<string>,
  options: UseOutletSeoOptions,
) {
  const {
    org,
    isLoading,
    isNotFound,
    isServerError,
    routeType = 'outlet-index',
  } = options

  const slug = computed(() => String(toValue(orgSlug) || ''))

  // ── Single source of truth untuk semua keputusan SEO ────────────────────────
  // Urutan prioritas: loading → error → not-found → success
  // Ini mencegah flash "success" saat data lama masih ada tapi slug sudah berubah.
  const seoStatus = computed(() => {
    if (toValue(isLoading)) return 'loading' as const
    if (toValue(isServerError)) return 'error' as const
    if (toValue(isNotFound) || !org.value) return 'not-found' as const
    return 'success' as const
  })

  // ── Title ────────────────────────────────────────────────────────────────────
  const seoTitle = computed(() => {
    switch (seoStatus.value) {
      case 'loading':
        return SITE_NAME
      case 'not-found':
        return `Outlet tidak ditemukan | ${SITE_NAME}`
      case 'error':
        return `Terjadi kesalahan | ${SITE_NAME}`
      case 'success': {
        const name = org.value!.name
        if (routeType === 'outlet-index') return `${name} | ${SITE_NAME}`
        if (routeType === 'menu') return `Daftar Menu ${name} | ${SITE_NAME}`
        if (routeType === 'orders') return `Pesan Menu di ${name} | ${SITE_NAME}`
        if (routeType === 'payment') return `Pembayaran — ${name} | ${SITE_NAME}`
        return `${name} | ${SITE_NAME}`
      }
    }
  })

  // ── Description ──────────────────────────────────────────────────────────────
  const seoDescription = computed(() => {
    switch (seoStatus.value) {
      case 'loading':
        return 'Santap membantu restoran menerima pesanan digital dari meja, open bill, dan pembayaran QRIS secara praktis.'
      case 'not-found':
        return 'Link outlet tidak valid atau outlet sedang tidak tersedia. Coba kembali ke beranda atau minta link baru dari restoran.'
      case 'error':
        return 'Ada gangguan saat memuat halaman Santap. Silakan coba lagi beberapa saat.'
      case 'success': {
        const o = org.value!
        if (routeType === 'outlet-index') {
          const addr = [o.address, o.city].filter(Boolean).join(', ')
          if (addr) {
            return `Pesan makanan dan minuman dari ${o.name} di ${addr}. Lihat menu dan buat pesanan melalui Santap.`
          }
          return `Lihat menu, pesan makanan, dan kelola pesanan Anda di ${o.name} melalui Santap.`
        }
        if (routeType === 'menu') {
          return `Lihat daftar menu lengkap ${o.name}, pilihan kategori, harga, dan ketersediaan terbaru melalui Santap.`
        }
        // orders dan payment: halaman ini noindex, description tidak kritis
        return `Pesan menu di ${o.name} melalui Santap.`
      }
    }
  })

  // ── Robots ───────────────────────────────────────────────────────────────────
  // Hanya halaman outlet publik (outlet-index) dengan data valid yang boleh di-index.
  // Halaman orders/payment/not-found/error selalu noindex.
  const seoRobots = computed(() => {
    if (seoStatus.value === 'success' && (routeType === 'outlet-index' || routeType === 'menu')) {
      return 'index, follow'
    }
    return 'noindex, nofollow'
  })

  // ── OG Image ─────────────────────────────────────────────────────────────────
  // Prioritas: banner outlet → logo outlet → default Santap OG
  // Jika status bukan success, gunakan default agar tidak bocor data outlet lama.
  const seoOgImage = computed(() => {
    if (seoStatus.value !== 'success') return DEFAULT_OG_IMAGE
    return org.value?.banner || org.value?.logo || DEFAULT_OG_IMAGE
  })

  // ── Canonical URL ────────────────────────────────────────────────────────────
  // Canonical hanya di-set saat data valid dan merupakan halaman publik.
  // Query params sensitif (?table=, ?bill=, ?order=) tidak masuk ke canonical.
  const canonicalUrl = computed(() => {
    if (seoStatus.value !== 'success') return undefined
    const base = `${SITE_URL}/o/${slug.value}`
    if (routeType === 'outlet-index') return `${base}/index`
    if (routeType === 'menu') return `${base}/menu`
    if (routeType === 'orders') return `${base}/orders`
    if (routeType === 'payment') return `${base}/payments`
    return undefined
  })

  const ogUrl = computed(() => canonicalUrl.value ?? `${SITE_URL}/o/${slug.value}`)

  // ── Apply SEO meta ───────────────────────────────────────────────────────────
  useSeoMeta({
    title: () => seoTitle.value,
    description: () => seoDescription.value,
    ogTitle: () => seoTitle.value,
    ogDescription: () => seoDescription.value,
    ogType: 'website',
    ogImage: () => seoOgImage.value,
    ogUrl: () => ogUrl.value,
    ogSiteName: SITE_NAME,
    ogLocale: 'id_ID',
    twitterCard: 'summary_large_image',
    twitterTitle: () => seoTitle.value,
    twitterDescription: () => seoDescription.value,
    twitterImage: () => seoOgImage.value,
  })

  // robots meta + canonical link + JSON-LD (semua reaktif)
  useHead(() => {
    const meta = [{ name: 'robots', content: seoRobots.value }]

    const link = canonicalUrl.value
      ? [{ rel: 'canonical', href: canonicalUrl.value }]
      : []

    const script: object[] = []

    // JSON-LD hanya untuk halaman outlet publik yang valid
    if (seoStatus.value === 'success' && routeType === 'outlet-index' && org.value) {
      const o = org.value
      const jsonLd: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'Restaurant',
        name: o.name,
        url: `${SITE_URL}/o/${slug.value}/index`,
      }

      if (o.logo) jsonLd.image = o.logo
      if (o.phone) jsonLd.telephone = o.phone
      if (o.description) jsonLd.description = o.description

      const hasAddress = o.address || o.city || o.province
      if (hasAddress) {
        jsonLd.address = {
          '@type': 'PostalAddress',
          ...(o.address ? { streetAddress: o.address } : {}),
          ...(o.city ? { addressLocality: o.city } : {}),
          ...(o.province ? { addressRegion: o.province } : {}),
          addressCountry: 'ID',
        }
      }

      script.push({
        type: 'application/ld+json',
        innerHTML: JSON.stringify(jsonLd),
      })
    }

    return { meta, link, script }
  })
}
