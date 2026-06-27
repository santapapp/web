/**
 * usePageSeo
 *
 * Composable ringan untuk halaman statik (landing, legal, company). Tugasnya
 * HANYA menyuntikkan structured data tambahan yang tidak di-handle otomatis oleh
 * @nuxtjs/seo:
 *
 *   - BreadcrumbList  → jejak navigasi untuk rich result + konteks AI crawler
 *   - FAQPage         → opsional, untuk halaman dengan akordion FAQ (mis. pricing)
 *
 * Metadata dasar (title, description, OG, Twitter, canonical) tetap di-set per
 * halaman via useSeoMeta, dan node WebPage/WebSite/Organization sudah di-emit
 * otomatis oleh @nuxtjs/seo. Composable ini sengaja TIDAK menyentuh hal itu agar
 * tidak terjadi duplikasi structured data atau metadata.
 *
 * Semua JSON-LD di sini bertipe node unik (BreadcrumbList, FAQPage) sehingga aman
 * dari duplikasi dengan graph milik modul.
 */

import type { MaybeRefOrGetter } from 'vue'

const SITE_URL = 'https://santap.app'

export interface PageBreadcrumb {
  /** Label yang tampil, mis. "Fitur" */
  name: string
  /** Path absolut situs, mis. "/features" (atau URL penuh) */
  item: string
}

export interface PageFaqItem {
  question: string
  answer: string
}

export interface UsePageSeoOptions {
  /**
   * Jejak breadcrumb dari root. Item pertama biasanya "Beranda" → "/".
   * Kosongkan untuk halaman beranda (tidak perlu breadcrumb).
   */
  breadcrumbs?: PageBreadcrumb[]
  /**
   * Daftar FAQ. Boleh berupa array langsung atau getter (untuk const yang
   * dideklarasi setelah pemanggilan). Hanya di-emit jika ada isinya.
   */
  faq?: MaybeRefOrGetter<PageFaqItem[] | undefined>
}

function toAbsolute(path: string): string {
  return path.startsWith('http') ? path : `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`
}

export function usePageSeo(options: UsePageSeoOptions = {}) {
  const { breadcrumbs, faq } = options

  useHead(() => {
    const script: Array<{ type: string; innerHTML: string }> = []

    // ── BreadcrumbList ──────────────────────────────────────────────────────
    if (breadcrumbs && breadcrumbs.length > 0) {
      script.push({
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbs.map((b, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: b.name,
            item: toAbsolute(b.item),
          })),
        }),
      })
    }

    // ── FAQPage ─────────────────────────────────────────────────────────────
    const faqItems = toValue(faq)
    if (faqItems && faqItems.length > 0) {
      script.push({
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqItems.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: f.answer,
            },
          })),
        }),
      })
    }

    return { script }
  })
}
