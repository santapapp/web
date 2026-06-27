<template>
  <main>
    <!-- ══════════════════════════════════════════════════════
         HERO — Premium Document Header with Curtain Reveal
         ══════════════════════════════════════════════════════ -->
    <section ref="heroRef" class="bg-[var(--color-bg-page)] pt-32 pb-16 md:pt-40 md:pb-24 border-b border-[var(--color-border)]">
      <div class="px-5 md:px-10 lg:px-16 max-w-[1400px] mx-auto">
        <div class="max-w-[800px]">
          <!-- Overline Badge -->
          <div ref="tBadgeRef" class="t-badge mb-6">
            <div class="inline-flex items-center gap-3 bg-[var(--color-bg-surface)] px-4 py-2 rounded-md border border-[var(--color-border)]">
              <div class="w-2 h-2 rounded-sm bg-[var(--color-primary)] flex-shrink-0"></div>
              <span class="text-[10.5px] font-bold uppercase tracking-[0.16em]" style="color: var(--color-text-primary);">Dokumen Hukum</span>
            </div>
          </div>

          <!-- Title with curtain reveal -->
          <h1 class="font-medium tracking-[-0.03em] leading-[1.0] mb-6" style="font-size: clamp(40px, 8vw, 96px);">
            <span class="t-line-wrap block overflow-hidden relative">
              <span ref="tCurtain1Ref" class="t-curtain t-curtain--dark" aria-hidden="true" />
              <span ref="tText1Ref" class="t-text block text-[var(--color-text-primary)]">Syarat &amp; Ketentuan</span>
            </span>
            <span class="t-line-wrap block overflow-hidden relative">
              <span ref="tCurtain2Ref" class="t-curtain t-curtain--orange" aria-hidden="true" />
              <span ref="tText2Ref" class="t-text block text-[var(--color-text-tertiary)]">Aturan Main Kami.</span>
            </span>
          </h1>

          <!-- Meta description -->
          <p ref="tMetaRef" class="t-meta text-[15px] leading-[1.7] text-[var(--color-text-secondary)] mt-4">
            Pembaruan Terakhir: <span class="font-medium text-[var(--color-text-primary)]">23 Mei 2026</span> &bull; Versi 1.1
          </p>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════
         DOCUMENT LAYOUT — Split grid (TOC sidebar + Body)
         ══════════════════════════════════════════════════════ -->
    <section class="bg-[var(--color-bg-page)] py-16 md:py-24">
      <div class="px-5 md:px-10 lg:px-16 max-w-[1400px] mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          <!-- LEFT COLUMN: Sticky Table of Contents (TOC) -->
          <nav 
            class="lg:col-span-4 lg:sticky lg:top-28 bg-[var(--color-bg-surface)] border border-[var(--color-border)] p-6 rounded-2xl hidden lg:block"
            aria-label="Daftar Isi Syarat dan Ketentuan"
          >
            <p class="text-[11px] font-extrabold uppercase tracking-[0.15em] text-[var(--color-text-tertiary)] mb-5">
              Daftar Isi
            </p>
            <ul class="flex flex-col gap-1.5">
              <li v-for="(section, i) in sections" :key="section.id">
                <button
                  @click="scrollToSection(section.id)"
                  class="w-full text-left py-2 px-3 rounded-md text-[13px] font-medium transition-all duration-200 cursor-pointer flex gap-3 items-baseline"
                  :class="activeSection === section.id
                    ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)] font-semibold'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-black/[0.03]'"
                >
                  <span class="text-[10px] opacity-60 tabular-nums">0{{ i + 1 }}.</span>
                  <span>{{ section.title }}</span>
                </button>
              </li>
            </ul>

            <div class="h-px bg-[var(--color-border)] my-6"></div>

            <div class="flex flex-col gap-3">
              <p class="text-[12px] text-[var(--color-text-secondary)] leading-relaxed">
                Punya pertanyaan mengenai syarat ini? Hubungi Legal kami:
              </p>
              <a href="mailto:legal@santap.id" class="text-[13px] font-semibold text-[var(--color-primary)] hover:underline">
                legal@santap.id
              </a>
            </div>
          </nav>

          <!-- RIGHT COLUMN: Document Prose -->
          <div class="lg:col-span-8">
            <div class="document-content flex flex-col gap-14 text-[15px] leading-[1.8] text-[var(--color-text-secondary)]">
              
              <!-- Quick Highlight Summary Card -->
              <div class="card p-6 md:p-8 rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border)] flex gap-5 items-start">
                <div class="w-10 h-10 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h3 class="text-[16px] font-semibold text-[var(--color-text-primary)] mb-2">Ringkasan Syarat</h3>
                  <p class="text-[14px]">
                    <strong>Tidak ada biaya tersembunyi</strong>. Batalkan kapan saja. Anda tanggung jawab menjaga akun staf. Kami pastikan sistem andal, tapi tidak bertanggung jawab atas gangguan koneksi eksternal.
                  </p>
                </div>
              </div>

              <!-- Section 1 -->
              <section id="ketentuan-umum" class="scroll-mt-32 flex flex-col gap-4">
                <div class="flex items-center gap-3">
                  <span class="text-xs font-bold uppercase tracking-[0.1em] text-[var(--color-primary)]">01</span>
                  <h2 class="text-[22px] font-semibold text-[var(--color-text-primary)]">Ketentuan Umum</h2>
                </div>
                <p>
                  Syarat ini adalah perjanjian antara Anda sebagai pemilik bisnis kuliner (merchant) dan PT Sarwa Kalyana Cara (Sekeco) mengenai penggunaan aplikasi POS, kitchen display system (KDS), dan layanan terkait.
                </p>
                <p>
                  Dengan mendaftar atau menggunakan layanan kami, Anda setuju dengan syarat ini. Jika Anda tidak setuju, jangan menggunakan layanan kami.
                </p>
              </section>

              <div class="h-px bg-[var(--color-border)]"></div>

              <!-- Section 2 -->
              <section id="akun-merchant" class="scroll-mt-32 flex flex-col gap-4">
                <div class="flex items-center gap-3">
                  <span class="text-xs font-bold uppercase tracking-[0.1em] text-[var(--color-primary)]">02</span>
                  <h2 class="text-[22px] font-semibold text-[var(--color-text-primary)]">Akun & Keanggotaan Merchant</h2>
                </div>
                <p>
                  Untuk menggunakan layanan POS Cloud Santap, Anda wajib mendaftarkan akun merchant dengan mengisi informasi identitas bisnis secara jujur dan akurat.
                </p>
                <ul class="list-disc pl-5 flex flex-col gap-2">
                  <li><strong>Kerahasiaan Akun:</strong> Anda bertanggung jawab penuh untuk menjaga kerahasiaan kata sandi masuk admin, pin kasir, serta token autentikasi yang diberikan kepada staf.</li>
                  <li><strong>Tanggung Jawab Aktivitas:</strong> Setiap transaksi, edit menu, atau perubahan stok bahan baku yang tercatat di bawah kredensial akun Anda akan dianggap sepenuhnya sebagai instruksi resmi dari Anda.</li>
                  <li><strong>Verifikasi:</strong> Kami berhak meminta dokumen tambahan (seperti KTP pemilik atau NIB) untuk tujuan kepatuhan registrasi metode pembayaran QRIS.</li>
                </ul>
              </section>

              <div class="h-px bg-[var(--color-border)]"></div>

              <!-- Section 3 -->
              <section id="penggunaan-pos" class="scroll-mt-32 flex flex-col gap-4">
                <div class="flex items-center gap-3">
                  <span class="text-xs font-bold uppercase tracking-[0.1em] text-[var(--color-primary)]">03</span>
                  <h2 class="text-[22px] font-semibold text-[var(--color-text-primary)]">Penggunaan Layanan POS Cloud</h2>
                </div>
                <p>
                  Layanan Santap disediakan bagi merchant untuk mendukung transaksi operasional yang sah. Pengguna dilarang keras untuk:
                </p>
                <ul class="list-disc pl-5 flex flex-col gap-2">
                  <li>Menggunakan platform Santap untuk memproses transaksi barang ilegal, narkotika, perjudian, pencucian uang, atau aktivitas melanggar hukum lainnya.</li>
                  <li>Melakukan tindakan reverse engineering, mendekompilasi, menyalin arsitektur kode API, atau merusak sistem keamanan server cloud kami.</li>
                  <li>Mengirimkan data fiktif secara sengaja dalam jumlah besar (DDOS) yang dapat menurunkan performa sinkronisasi transaksi merchant lain.</li>
                </ul>
              </section>

              <div class="h-px bg-[var(--color-border)]"></div>

              <!-- Section 4 -->
              <section id="langganan-uji" class="scroll-mt-32 flex flex-col gap-4">
                <div class="flex items-center gap-3">
                  <span class="text-xs font-bold uppercase tracking-[0.1em] text-[var(--color-primary)]">04</span>
                  <h2 class="text-[22px] font-semibold text-[var(--color-text-primary)]">Skema Langganan & Uji Coba Gratis</h2>
                </div>
                <p>
                  Santap menawarkan uji coba gratis (free trial) selama 14 hari saat pendaftaran awal untuk semua tipe paket berbayar (Starter atau Pro).
                </p>
                <p>
                  Setelah masa uji coba berakhir, Anda harus memilih paket berlangganan bulanan atau tahunan aktif untuk terus dapat menggunakan database pencatatan POS kami. Biaya berlangganan dihitung flat per outlet (cabang) per bulan. Pembayaran tahunan mendapatkan diskon sebesar 20% dari total nilai langganan bulanan standar.
                </p>
              </section>

              <div class="h-px bg-[var(--color-border)]"></div>

              <!-- Section 5 -->
              <section id="qris-pembatalan" class="scroll-mt-32 flex flex-col gap-4">
                <div class="flex items-center gap-3">
                  <span class="text-xs font-bold uppercase tracking-[0.1em] text-[var(--color-primary)]">05</span>
                  <h2 class="text-[22px] font-semibold text-[var(--color-text-primary)]">Ketentuan Pembayaran QRIS & Pembatalan</h2>
                </div>
                <p>
                  Santap mengintegrasikan pembayaran digital QRIS melalui gerbang pembayaran (payment gateway) berlisensi resmi Bank Indonesia.
                </p>
                <p>
                  Santap tidak mengambil komisi transaksi penjualan kasir (0% tambahan komisi). Potongan MDR (Merchant Discount Rate) merupakan potongan murni dari penyedia payment gateway sesuai regulasi Bank Indonesia.
                </p>
                <p>
                  <strong>Pembatalan Layanan:</strong> Anda berhak menonaktifkan langganan kapan saja tanpa dikenakan biaya denda pembatalan. Tagihan pro-rata akan disesuaikan otomatis pada sisa hari masa aktif berjalan jika Anda melakukan downgrade paket.
                </p>
              </section>

              <div class="h-px bg-[var(--color-border)]"></div>

              <!-- Section 6 -->
              <section id="kekayaan-intelektual" class="scroll-mt-32 flex flex-col gap-4">
                <div class="flex items-center gap-3">
                  <span class="text-xs font-bold uppercase tracking-[0.1em] text-[var(--color-primary)]">06</span>
                  <h2 class="text-[22px] font-semibold text-[var(--color-text-primary)]">Kepemilikan Kekayaan Intelektual</h2>
                </div>
                <p>
                  Seluruh hak kekayaan intelektual atas logo brand Santap, arsitektur aplikasi, tampilan antarmuka (UI/UX), grafik, ikon, dan dokumen tertulis di situs ini sepenuhnya adalah hak milik eksklusif PT Sarwa Kalyana Cara (Sekeco).
                </p>
                <p>
                  Anda tetap memiliki hak milik penuh atas data data menu kuliner, nama restoran, data transaksi penjualan, dan database inventaris stok yang Anda masukkan ke platform kami. Kami hanya diberikan hak terbatas untuk menyimpan dan mengolah data tersebut demi berjalannya fungsi sistem cloud POS Anda.
                </p>
              </section>

              <div class="h-px bg-[var(--color-border)]"></div>

              <!-- Section 7 -->
              <section id="pembatasan-tanggungjawab" class="scroll-mt-32 flex flex-col gap-4">
                <div class="flex items-center gap-3">
                  <span class="text-xs font-bold uppercase tracking-[0.1em] text-[var(--color-primary)]">07</span>
                  <h2 class="text-[22px] font-semibold text-[var(--color-text-primary)]">Pembatasan Tanggung Jawab</h2>
                </div>
                <p>
                  Santap berkomitmen untuk menjaga keandalan operasional POS cloud dengan Service Level Agreement (SLA) uptime 99.99%. Namun, kami tidak bertanggung jawab atas kerugian finansial, penurunan omzet, atau hilangnya kesempatan bisnis secara tidak langsung yang disebabkan oleh:
                </p>
                <ul class="list-disc pl-5 flex flex-col gap-2">
                  <li>Kegagalan koneksi jaringan internet di wilayah outlet merchant Anda.</li>
                  <li>Kerusakan perangkat keras (smartphone/tablet kasir) milik merchant.</li>
                  <li>Gangguan teknis eksternal berskala nasional dari server gerbang pembayaran (payment gateway) atau server bank.</li>
                </ul>
              </section>

              <div class="h-px bg-[var(--color-border)]"></div>

              <!-- Section 8 -->
              <section id="hukum-kontak" class="scroll-mt-32 flex flex-col gap-4">
                <div class="flex items-center gap-3">
                  <span class="text-xs font-bold uppercase tracking-[0.1em] text-[var(--color-primary)]">08</span>
                  <h2 class="text-[22px] font-semibold text-[var(--color-text-primary)]">Hukum yang Mengatur & Kontak</h2>
                </div>
                <p>
                  Syarat dan Ketentuan ini diatur dan ditafsirkan sepenuhnya berdasarkan hukum Negara Republik Indonesia. Setiap perselisihan yang timbul dari Syarat ini akan diupayakan diselesaikan terlebih dahulu secara musyawarah mufakat.
                </p>
                <p>
                  Jika Anda memiliki pertanyaan mengenai implementasi atau persetujuan dokumen Syarat & Ketentuan Penggunaan ini, silakan hubungi tim legal kami:
                </p>
                <div class="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] mt-2">
                  <p class="font-semibold text-[var(--color-text-primary)] mb-1">PT Sarwa Kalyana Cara (Sekeco)</p>
                  <p class="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">
                    Sleman, D.I. Yogyakarta<br>
                    Indonesia
                  </p>
                  <p class="text-sm">
                    Email: <a href="mailto:legal@santap.id" class="text-[var(--color-primary)] font-semibold hover:underline">legal@santap.id</a>
                  </p>
                </div>
              </section>

            </div>
          </div>

        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

useSeoMeta({
  title: 'Syarat & Ketentuan Layanan Aplikasi Kasir Santap',
  description: 'Bacalah syarat dan ketentuan penggunaan aplikasi kasir mobile POS Santap, aturan berlangganan, ketentuan pembayaran QRIS, dan batas tanggung jawab.',
  ogTitle: 'Syarat & Ketentuan — Santap',
  ogDescription: 'Syarat penggunaan aplikasi POS Santap: aturan berlangganan, pembayaran QRIS, dan ketentuan layanan.',
  ogImage: '/images/og-image.jpg',
  ogType: 'website',
  twitterCard: 'summary',
  twitterTitle: 'Syarat & Ketentuan — Santap',
  twitterDescription: 'Syarat dan ketentuan penggunaan aplikasi POS Santap.',
})

// Breadcrumb JSON-LD — jejak navigasi untuk rich result + konteks AI crawler.
usePageSeo({
  breadcrumbs: [
    { name: 'Beranda', item: '/' },
    { name: 'Syarat & Ketentuan', item: '/terms' },
  ],
})

const sections = [
  { id: 'ketentuan-umum', title: 'Ketentuan Umum' },
  { id: 'akun-merchant', title: 'Akun & Keanggotaan' },
  { id: 'penggunaan-pos', title: 'Penggunaan POS' },
  { id: 'langganan-uji', title: 'Langganan & Uji Coba' },
  { id: 'qris-pembatalan', title: 'QRIS & Pembatalan' },
  { id: 'kekayaan-intelektual', title: 'Kekayaan Intelektual' },
  { id: 'pembatasan-tanggungjawab', title: 'Pembatasan Tanggung Jawab' },
  { id: 'hukum-kontak', title: 'Hukum & Kontak' }
]

const activeSection = ref('ketentuan-umum')

const scrollToSection = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
    activeSection.value = id
  }
}

// Curtain reveal refs
const heroRef       = ref<HTMLElement | null>(null)
const tBadgeRef     = ref<HTMLElement | null>(null)
const tCurtain1Ref  = ref<HTMLElement | null>(null)
const tCurtain2Ref  = ref<HTMLElement | null>(null)
const tText1Ref     = ref<HTMLElement | null>(null)
const tText2Ref     = ref<HTMLElement | null>(null)
const tMetaRef      = ref<HTMLElement | null>(null)

let ctx: any = null

// Track active section on scroll
let observer: IntersectionObserver | null = null

onMounted(async () => {
  // ── Intersection Observer for TOC ───────────────────────
  const options = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  }

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        activeSection.value = entry.target.id
      }
    })
  }, options)

  sections.forEach((sec) => {
    const el = document.getElementById(sec.id)
    if (el && observer) observer.observe(el)
  })

  // ── GSAP Curtain Reveal ─────────────────────────────────
  const { gsap } = await import('gsap')

  ctx = gsap.context(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const curtains = [tCurtain1Ref.value, tCurtain2Ref.value].filter((c): c is HTMLElement => !!c)
      const texts    = [tText1Ref.value,    tText2Ref.value].filter((t): t is HTMLElement => !!t)

      gsap.set(curtains, { position: 'absolute', inset: 0, zIndex: 2, yPercent: 0 })
      gsap.set(texts, { opacity: 0, y: 18 })
      if (tBadgeRef.value) gsap.set(tBadgeRef.value, { opacity: 0, y: 14 })
      if (tMetaRef.value) gsap.set(tMetaRef.value,  { opacity: 0, y: 12 })

      const tl = gsap.timeline({ delay: 0.2 })

      if (tBadgeRef.value) {
        tl.to(tBadgeRef.value, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
      }

      curtains.forEach((curtain, i) => {
        const text   = texts[i]
        const offset = 0.25 + i * 0.18

        if (curtain) {
          tl.to(curtain, { yPercent: 110, duration: 1.35, ease: 'power4.out' }, offset)
        }
        if (text) {
          tl.to(text,    { opacity: 1, y: 0, duration: 1.1, ease: 'power4.out' }, offset + 0.05)
        }
      })

      if (tMetaRef.value) {
        tl.to(tMetaRef.value, { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out' }, '-=0.5')
      }
    })

    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set([tCurtain1Ref.value, tCurtain2Ref.value], { display: 'none' })
      gsap.set([tText1Ref.value, tText2Ref.value, tBadgeRef.value, tMetaRef.value], { opacity: 1, y: 0, clearProps: 'all' })
    })
  }, heroRef.value ?? undefined)
})

onUnmounted(() => {
  if (observer) observer.disconnect()
  ctx?.revert()
})
</script>

<style scoped>
.t-curtain {
  display: block;
  position: absolute;
  inset: 0;
  z-index: 2;
  transform-origin: top center;
  will-change: transform;
}
.t-curtain--dark  { background-color: var(--color-bg-page, rgba(12, 9, 6, 1)); }
.t-curtain--orange { background-color: #E8712A; }
.t-text {
  position: relative;
  z-index: 1;
  will-change: transform, opacity;
}
.t-line-wrap {
  position: relative;
  padding-bottom: 0.06em;
}
</style>

