<template>
  <main>
    <!-- ══════════════════════════════════════════════════════
         HERO — Premium Document Header with Curtain Reveal
         ══════════════════════════════════════════════════════ -->
    <section ref="heroRef" class="bg-[var(--color-bg-page)] pt-32 pb-16 md:pt-40 md:pb-24 border-b border-[var(--color-border)]">
      <div class="px-5 md:px-10 lg:px-16 max-w-[1400px] mx-auto">
        <div class="max-w-[800px]">
          <!-- Overline Badge -->
          <div ref="ppBadgeRef" class="pp-badge mb-6">
            <div class="inline-flex items-center gap-3 bg-[var(--color-bg-surface)] px-4 py-2 rounded-md border border-[var(--color-border)]">
              <div class="w-2 h-2 rounded-sm bg-[var(--color-primary)] flex-shrink-0"></div>
              <span class="text-[10.5px] font-bold uppercase tracking-[0.16em]" style="color: var(--color-text-primary);">Dokumen Hukum</span>
            </div>
          </div>

          <!-- Title with curtain reveal -->
          <h1 class="font-medium tracking-[-0.03em] leading-[1.0] mb-6" style="font-size: clamp(40px, 8vw, 96px);">
            <span class="pp-line-wrap block overflow-hidden relative">
              <span ref="ppCurtain1Ref" class="pp-curtain pp-curtain--dark" aria-hidden="true" />
              <span ref="ppText1Ref" class="pp-text block text-[var(--color-text-primary)]">Kebijakan Privasi</span>
            </span>
            <span class="pp-line-wrap block overflow-hidden relative">
              <span ref="ppCurtain2Ref" class="pp-curtain pp-curtain--orange" aria-hidden="true" />
              <span ref="ppText2Ref" class="pp-text block text-[var(--color-text-tertiary)]">Keamanan Data Anda.</span>
            </span>
          </h1>

          <!-- Meta description -->
          <p ref="ppMetaRef" class="pp-meta text-[15px] leading-[1.7] text-[var(--color-text-secondary)] mt-4">
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
            aria-label="Daftar Isi Kebijakan Privasi"
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
                Punya pertanyaan hukum? Hubungi tim Legal kami di:
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
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h3 class="text-[16px] font-semibold text-[var(--color-text-primary)] mb-2">Komitmen Privasi Kami</h3>
                  <p class="text-[14px]">
                    Kami menghargai kepercayaan Anda. <strong>Kami hanya kumpulkan informasi yang dibutuhkan</strong> untuk operasional POS, sinkronisasi pesanan, dan kepatuhan regulasi. <strong>Kami tidak pernah jual data pribadi atau transaksi Anda</strong> ke pihak ketiga.
                  </p>
                </div>
              </div>

              <!-- Section 1 -->
              <section id="pengantar" class="scroll-mt-32 flex flex-col gap-4">
                <div class="flex items-center gap-3">
                  <span class="text-xs font-bold uppercase tracking-[0.1em] text-[var(--color-primary)]">01</span>
                  <h2 class="text-[22px] font-semibold text-[var(--color-text-primary)]">Pengantar</h2>
                </div>
                <p>
                  Kebijakan ini menjelaskan bagaimana PT Santap Teknologi Indonesia mengumpulkan, menggunakan, dan melindungi data pribadi Anda saat menggunakan aplikasi POS, dashboard, dan situs santap.id.
                </p>
                <p>
                  Dengan menggunakan layanan kami, Anda menyetujui kebijakan ini. Kami melindungi privasi pemilik merchant, staf operasional, dan pelanggan Anda.
                </p>
              </section>

              <div class="h-px bg-[var(--color-border)]"></div>

              <!-- Section 2 -->
              <section id="data-dikumpul" class="scroll-mt-32 flex flex-col gap-4">
                <div class="flex items-center gap-3">
                  <span class="text-xs font-bold uppercase tracking-[0.1em] text-[var(--color-primary)]">02</span>
                  <h2 class="text-[22px] font-semibold text-[var(--color-text-primary)]">Data yang Kami Kumpulkan</h2>
                </div>
                <p>
                  Kami mengumpulkan data untuk dapat menyediakan layanan operasional restoran secara handal. Data ini dikelompokkan menjadi:
                </p>
                <ul class="list-disc pl-5 flex flex-col gap-2">
                  <li>
                    <strong>Informasi Akun Merchant:</strong> Nama pemilik, nama restoran/cafe, alamat email bisnis, nomor telepon/WhatsApp aktif, serta alamat fisik outlet.
                  </li>
                  <li>
                    <strong>Data Transaksi & Finansial:</strong> Laporan penjualan harian, menu yang dipesan, harga menu, metode pembayaran yang digunakan (QRIS, Tunai, Kartu), waktu transaksi, dan status rekonsiliasi kas.
                  </li>
                  <li>
                    <strong>Data Pelanggan (Customer Ordering):</strong> Saat pelanggan melakukan scan QR di meja untuk memesan, kami dapat mengumpulkan nama tamu (sesuai input), nomor meja, detail pesanan, dan bukti transfer pembayaran jika melakukan checkout digital.
                  </li>
                  <li>
                    <strong>Data Teknis:</strong> Alamat IP, jenis perangkat seluler/tablet kasir, log aktivitas sistem operasional, dan data diagnosis jika terjadi crash aplikasi untuk membantu perbaikan bug.
                  </li>
                </ul>
              </section>

              <div class="h-px bg-[var(--color-border)]"></div>

              <!-- Section 3 -->
              <section id="penggunaan-data" class="scroll-mt-32 flex flex-col gap-4">
                <div class="flex items-center gap-3">
                  <span class="text-xs font-bold uppercase tracking-[0.1em] text-[var(--color-primary)]">03</span>
                  <h2 class="text-[22px] font-semibold text-[var(--color-text-primary)]">Bagaimana Data Digunakan</h2>
                </div>
                <p>
                  Data yang dikumpulkan diolah untuk keperluan-keperluan berikut:
                </p>
                <ul class="list-disc pl-5 flex flex-col gap-2">
                  <li>Menyediakan, memelihara, dan meningkatkan fungsi aplikasi kasir POS dan KDS dapur secara real-time.</li>
                  <li>Memproses transaksi pembayaran digital QRIS dan e-wallet secara aman serta melakukan rekonsiliasi otomatis.</li>
                  <li>Menghasilkan dashboard analitik penjualan yang akurat agar pemilik restoran dapat melihat laba, menu terlaris, dan performa staff.</li>
                  <li>Mengirimkan notifikasi operasional penting, seperti alert persediaan bahan baku yang menipis atau pembaruan sistem aplikasi kasir.</li>
                  <li>Mencegah penyalahgunaan transaksi keuangan, fraud, atau kegagalan sistem yang merugikan merchant.</li>
                </ul>
              </section>

              <div class="h-px bg-[var(--color-border)]"></div>

              <!-- Section 4 -->
              <section id="keamanan-data" class="scroll-mt-32 flex flex-col gap-4">
                <div class="flex items-center gap-3">
                  <span class="text-xs font-bold uppercase tracking-[0.1em] text-[var(--color-primary)]">04</span>
                  <h2 class="text-[22px] font-semibold text-[var(--color-text-primary)]">Keamanan & Penyimpanan Data</h2>
                </div>
                <p>
                  Seluruh data yang diproses di aplikasi POS cloud Santap dienkripsi secara aman saat dikirim dari perangkat kasir Anda menuju server database kami menggunakan protokol SSL/TLS yang kuat.
                </p>
                <p>
                  Kami menyimpan data Anda di server cloud aman dengan sertifikasi standar internasional. Kami secara berkala melakukan pencadangan otomatis (automated backup) untuk mencegah risiko data hilang akibat bencana fisik. Meskipun kami berusaha maksimal mengamankan sistem, mohon diingat bahwa tidak ada metode transmisi internet yang 100% aman, oleh karena itu kami menyarankan pemilik akun untuk menjaga kerahasiaan kata sandi dan token operasional masing-masing staf.
                </p>
              </section>

              <div class="h-px bg-[var(--color-border)]"></div>

              <!-- Section 5 -->
              <section id="pihak-ketiga" class="scroll-mt-32 flex flex-col gap-4">
                <div class="flex items-center gap-3">
                  <span class="text-xs font-bold uppercase tracking-[0.1em] text-[var(--color-primary)]">05</span>
                  <h2 class="text-[22px] font-semibold text-[var(--color-text-primary)]">Pengungkapan kepada Pihak Ketiga</h2>
                </div>
                <p>
                  Kami tidak membagikan, menyewakan, atau menjual data pribadi Anda kepada perusahaan lain untuk tujuan pemasaran di luar ekosistem Santap. Kami hanya membagikan data Anda dengan mitra tertentu untuk kelancaran layanan, antara lain:
                </p>
                <ul class="list-disc pl-5 flex flex-col gap-2">
                  <li><strong>Gerbang Pembayaran (Payment Gateway):</strong> Untuk memproses verifikasi transaksi digital QRIS dan transfer bank.</li>
                  <li><strong>Penyedia Infrastruktur Cloud:</strong> Server database hosting tempat data operasional terenkripsi disimpan.</li>
                  <li><strong>Kepatuhan Hukum:</strong> Jika diwajibkan oleh regulator, pengadilan, atau otoritas Bank Indonesia sehubungan dengan kepatuhan hukum transaksi perbankan.</li>
                </ul>
              </section>

              <div class="h-px bg-[var(--color-border)]"></div>

              <!-- Section 6 -->
              <section id="hak-pengguna" class="scroll-mt-32 flex flex-col gap-4">
                <div class="flex items-center gap-3">
                  <span class="text-xs font-bold uppercase tracking-[0.1em] text-[var(--color-primary)]">06</span>
                  <h2 class="text-[22px] font-semibold text-[var(--color-text-primary)]">Hak-hak Pengguna</h2>
                </div>
                <p>
                  Sebagai pengguna, Anda memiliki hak penuh untuk mengakses, memperbarui, atau menghapus informasi pribadi Anda yang tersimpan di sistem kami:
                </p>
                <ul class="list-disc pl-5 flex flex-col gap-2">
                  <li>Pemilik restoran dapat memperbarui profil bisnis, daftar menu, harga, dan nomor WhatsApp admin langsung melalui dashboard pengaturan.</li>
                  <li>Anda dapat mengajukan permohonan penutupan akun merchant dan penghapusan data transaksi historis secara permanen dari server database kami dengan menghubungi tim legal/support kami.</li>
                  <li>Pelanggan (customer) yang memesan secara dine-in dapat meminta agar nama guest session dihapus setelah transaksi bill meja diselesaikan di kasir.</li>
                </ul>
              </section>

              <div class="h-px bg-[var(--color-border)]"></div>

              <!-- Section 7 -->
              <section id="perubahan-kebijakan" class="scroll-mt-32 flex flex-col gap-4">
                <div class="flex items-center gap-3">
                  <span class="text-xs font-bold uppercase tracking-[0.1em] text-[var(--color-primary)]">07</span>
                  <h2 class="text-[22px] font-semibold text-[var(--color-text-primary)]">Perubahan Kebijakan</h2>
                </div>
                <p>
                  Kami berhak memperbarui Kebijakan Privasi ini sewaktu-waktu seiring dengan penambahan fitur baru pada aplikasi kasir POS atau penyesuaian aturan hukum di Indonesia. Kami akan memberitahukan pembaruan tersebut melalui pengumuman di aplikasi kasir atau mengirimkan email pemberitahuan ke alamat email Anda sekurang-kurangnya 7 hari sebelum perubahan tersebut berlaku efektif.
                </p>
              </section>

              <div class="h-px bg-[var(--color-border)]"></div>

              <!-- Section 8 -->
              <section id="kontak-legal" class="scroll-mt-32 flex flex-col gap-4">
                <div class="flex items-center gap-3">
                  <span class="text-xs font-bold uppercase tracking-[0.1em] text-[var(--color-primary)]">08</span>
                  <h2 class="text-[22px] font-semibold text-[var(--color-text-primary)]">Hubungi Kami</h2>
                </div>
                <p>
                  Jika Anda memiliki kekhawatiran, pertanyaan, atau keluhan terkait cara kami memperlakukan data pribadi Anda atau perihal Kebijakan Privasi ini, silakan hubungi tim legal kami:
                </p>
                <div class="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] mt-2">
                  <p class="font-semibold text-[var(--color-text-primary)] mb-1">PT Santap Teknologi Indonesia</p>
                  <p class="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">
                    Gedung Graha Kuliner, Lantai 4<br>
                    Kuningan, Jakarta Selatan 12940
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

useHead({
  title: 'Kebijakan Privasi — Santap',
  meta: [
    { name: 'description', content: 'Pelajari bagaimana kami mengumpulkan, mengamankan, dan memperlakukan data transaksi kasir POS serta informasi pribadi pelanggan Anda dengan aman di Santap.' }
  ]
})

const sections = [
  { id: 'pengantar', title: 'Pengantar' },
  { id: 'data-dikumpul', title: 'Data yang Dikumpulkan' },
  { id: 'penggunaan-data', title: 'Penggunaan Data' },
  { id: 'keamanan-data', title: 'Keamanan & Penyimpanan' },
  { id: 'pihak-ketiga', title: 'Pihak Ketiga' },
  { id: 'hak-pengguna', title: 'Hak-hak Pengguna' },
  { id: 'perubahan-kebijakan', title: 'Perubahan Kebijakan' },
  { id: 'kontak-legal', title: 'Hubungi Kami' }
]

const activeSection = ref('pengantar')

const scrollToSection = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
    activeSection.value = id
  }
}

// Curtain reveal refs
const heroRef      = ref<HTMLElement | null>(null)
const ppBadgeRef   = ref<HTMLElement | null>(null)
const ppCurtain1Ref = ref<HTMLElement | null>(null)
const ppCurtain2Ref = ref<HTMLElement | null>(null)
const ppText1Ref   = ref<HTMLElement | null>(null)
const ppText2Ref   = ref<HTMLElement | null>(null)
const ppMetaRef    = ref<HTMLElement | null>(null)

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
      const curtains = [ppCurtain1Ref.value, ppCurtain2Ref.value]
      const texts    = [ppText1Ref.value,    ppText2Ref.value]

      gsap.set(curtains, { position: 'absolute', inset: 0, zIndex: 2, yPercent: 0 })
      gsap.set(texts, { opacity: 0, y: 18 })
      gsap.set(ppBadgeRef.value, { opacity: 0, y: 14 })
      gsap.set(ppMetaRef.value,  { opacity: 0, y: 12 })

      const tl = gsap.timeline({ delay: 0.2 })

      tl.to(ppBadgeRef.value, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })

      curtains.forEach((curtain, i) => {
        const text   = texts[i]
        const offset = 0.25 + i * 0.18

        tl.to(curtain, { yPercent: 110, duration: 1.35, ease: 'power4.out' }, offset)
        tl.to(text,    { opacity: 1, y: 0, duration: 1.1, ease: 'power4.out' }, offset + 0.05)
      })

      tl.to(ppMetaRef.value, { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out' }, '-=0.5')
    })

    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set([ppCurtain1Ref.value, ppCurtain2Ref.value], { display: 'none' })
      gsap.set([ppText1Ref.value, ppText2Ref.value, ppBadgeRef.value, ppMetaRef.value], { opacity: 1, y: 0, clearProps: 'all' })
    })
  }, heroRef.value ?? undefined)
})

onUnmounted(() => {
  if (observer) observer.disconnect()
  ctx?.revert()
})
</script>

<style scoped>
.pp-curtain {
  display: block;
  position: absolute;
  inset: 0;
  z-index: 2;
  transform-origin: top center;
  will-change: transform;
}
.pp-curtain--dark  { background-color: var(--color-bg-page, rgba(12, 9, 6, 1)); }
.pp-curtain--orange { background-color: #E8712A; }
.pp-text {
  position: relative;
  z-index: 1;
  will-change: transform, opacity;
}
.pp-line-wrap {
  position: relative;
  padding-bottom: 0.06em;
}
</style>

