<template>
  <main>

    <!-- ── HERO — Curtain Reveal ──────────────────────────── -->
    <AppPageHeroCurtain
      badge="Tentang Kami"
      line1="Cerita Kami."
      line2="Visi Kuliner."
      aria-label="Tentang Kami"
      scroll-target="about-overview"
    >
      Kami percaya teknologi kasir harusnya menyederhanakan operasional harian,
      <span style="color: var(--color-text-primary); font-weight: 500;">bukan menambah kerumitan</span> di restoran atau cafe Anda.
    </AppPageHeroCurtain>

    <!-- ══════════════════════════════════════════════════════
         IMMERSIVE DARK SECTION — warm kitchen visual + large white text overlay
         ══════════════════════════════════════════════════════ -->
    <section
      id="about-overview"
      class="relative mx-3 my-6 md:mx-5 rounded-2xl overflow-hidden"
      style="min-height: 55vh; display: flex; flex-direction: column; justify-content: center;"
      aria-label="Visi Santap"
    >
      <!-- Background image -->
      <img
        src="https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1800&q=80&fit=crop"
        alt="Interior restoran yang hangat dan nyaman"
        class="absolute inset-0 w-full h-full object-cover object-center"
        loading="eager"
      />
      <!-- Dark overlay -->
      <div
        class="absolute inset-0"
        style="background: linear-gradient(to bottom right, rgba(8,6,4,0.72) 0%, rgba(8,6,4,0.55) 50%, rgba(8,6,4,0.80) 100%);"
      ></div>

      <!-- Content -->
      <div class="relative z-10 px-5 md:px-10 lg:px-16 max-w-[1400px] mx-auto py-20 md:py-28 w-full">
        <!-- Badge -->
        <div class="mb-10">
          <div
            class="inline-flex items-center gap-3 px-4 py-2 rounded-md border"
            style="background-color: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.15);"
          >
            <div class="w-1.5 h-1.5 rounded-full flex-shrink-0" style="background-color: var(--color-primary);"></div>
            <span class="text-[10px] font-bold uppercase tracking-[0.18em]" style="color: rgba(255,255,255,0.75);">Filosofi Produk</span>
          </div>
        </div>

        <!-- Large descriptive text -->
        <AppTextWordReveal
          class="font-medium leading-[1.12] tracking-tight max-w-[950px]"
          style="font-size: clamp(26px, 4vw, 52px); color: #FFFFFF;"
          text="Santap lahir dari satu misi sederhana: memerdekakan pelaku usaha kuliner Indonesia melalui teknologi POS cloud yang handal, cepat, dan terjangkau bagi siapa saja."
        />
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════
         STORY & VISION SECTION — premium split layout
         ══════════════════════════════════════════════════════ -->
    <section
      id="about-content"
      class="bg-[var(--color-bg-page)] px-5 md:px-10 lg:px-16 py-20 md:py-28 max-w-[1400px] mx-auto"
      aria-label="Visi Misi & Sejarah"
    >
      <!-- Top Divider -->
      <div class="h-px bg-[var(--color-border)] mb-16"></div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        
        <!-- Left Column: Heading -->
        <div class="lg:col-span-4 lg:sticky lg:top-28 self-start">
          <p class="text-[11px] font-bold uppercase tracking-[0.18em] mb-4" style="color: var(--color-text-tertiary);">Kilas Balik</p>
          <h2
            class="font-medium tracking-tight leading-[1.1] mb-8"
            style="font-size: clamp(28px, 3.5vw, 42px); color: var(--color-text-primary);"
          >
            Bagaimana Santap Dimulai
          </h2>
          <p class="text-[14.5px] leading-[1.7] text-[var(--color-text-secondary)] mb-12 max-w-sm">
            Sebuah solusi teknologi yang lahir dari empati mendalam terhadap perjuangan operasional harian cafe dan restoran lokal.
          </p>
        </div>

        <!-- Right Column: Story Narration -->
        <div class="lg:col-span-8">
          <div class="flex flex-col gap-10 text-[15px] leading-[1.8] text-[var(--color-text-secondary)]">
            <div>
              <h3 class="text-[20px] font-semibold text-[var(--color-text-primary)] mb-4">Mengatasi Hambatan Operasional F&B</h3>
              <p class="mb-4">
                Pada awalnya, kami melihat banyak pemilik cafe dan restoran lokal menghabiskan terlalu banyak waktu untuk mengelola hal-hal administratif: menyinkronkan menu antara pelayan dan dapur, mencatat stok bahan baku secara manual di buku log, hingga menyusun rekonsiliasi kasir di akhir shift yang seringkali selisih.
              </p>
              <p>
                Aplikasi kasir yang ada di pasaran seringkali terlalu mahal bagi kedai kecil, memerlukan kontrak panjang, atau terlalu rumit untuk digunakan oleh staf kasir harian. Dari kegelisahan inilah, Santap dirancang sebagai jembatan teknologi yang menjangkau seluruh lini operasional F&B dengan sederhana dan efisien.
              </p>
            </div>

            <div class="h-px bg-[var(--color-border)]"></div>

            <div>
              <h3 class="text-[20px] font-semibold text-[var(--color-text-primary)] mb-4">Membangun Masa Depan Restoran Indonesia</h3>
              <p class="mb-4">
                Santap bukan sekadar aplikasi kasir biasa. Kami mengembangkan platform point-of-sale berbasis cloud yang menyatukan pencatatan order (POS), sinkronisasi layar dapur (KDS), kelola persediaan (Inventory), pembayaran multi-metode, hingga analitik penjualan tersentralisasi.
              </p>
              <p>
                Dengan platform ini, kami berkomitmen untuk terus berinovasi mendampingi ribuan kedai kecil, kafe estetis, hingga jaringan franchise nasional agar mereka bisa melayani pelanggan lebih cepat, mengurangi limbah bahan makanan, dan meningkatkan profitabilitas usaha.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════
         CORE PILLARS SECTION — 3 Columns Grid
         ══════════════════════════════════════════════════════ -->
    <section
      class="bg-[var(--color-bg-page)] px-5 md:px-10 lg:px-16 py-20 md:py-28 max-w-[1400px] mx-auto"
      aria-label="Pilar Utama"
    >
      <!-- Top Divider -->
      <div class="h-px bg-[var(--color-border)] mb-16"></div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        <!-- Left title -->
        <div class="lg:col-span-4">
          <p class="text-[11px] font-bold uppercase tracking-[0.18em] mb-4" style="color: var(--color-text-tertiary);">Prinsip Kerja</p>
          <h2
            class="font-medium tracking-tight leading-[1.1] mb-6"
            style="font-size: clamp(28px, 3.5vw, 42px); color: var(--color-text-primary);"
          >
            Pilar Utama Kami
          </h2>
          <p class="text-[14.5px] leading-[1.7] text-[var(--color-text-secondary)] max-w-sm">
            Nilai-nilai dasar yang selalu mendasari setiap baris kode yang kami tulis dan setiap keputusan layanan yang kami buat.
          </p>
        </div>

        <!-- Right: Pillars list -->
        <div class="lg:col-span-8">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div v-for="pillar in pillars" :key="pillar.title" class="flex flex-col gap-4 p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] transition-all duration-300 hover:shadow-md">
              <div class="w-10 h-10 rounded-xl bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path :d="pillar.icon" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <h3 class="text-[18px] font-medium text-[var(--color-text-primary)] mt-2">{{ pillar.title }}</h3>
              <p class="text-[13.5px] leading-relaxed text-[var(--color-text-secondary)]">
                {{ pillar.desc }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════
         MILESTONES TIMELINE SECTION — premium interactive timeline
         ══════════════════════════════════════════════════════ -->
    <section
      class="bg-[var(--color-bg-page)] px-5 md:px-10 lg:px-16 py-20 md:py-28 max-w-[1400px] mx-auto"
      aria-label="Milestone Perusahaan"
    >
      <!-- Top Divider -->
      <div class="h-px bg-[var(--color-border)] mb-16"></div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        <!-- Left: description -->
        <div class="lg:col-span-4 lg:sticky lg:top-28 self-start">
          <p class="text-[11px] font-bold uppercase tracking-[0.18em] mb-4" style="color: var(--color-text-tertiary);">Perjalanan</p>
          <h2
            class="font-medium tracking-tight leading-[1.1] mb-6"
            style="font-size: clamp(28px, 3.5vw, 42px); color: var(--color-text-primary);"
          >
            Milestone Kami
          </h2>
          <p class="text-[14.5px] leading-[1.7] text-[var(--color-text-secondary)] max-w-sm">
            Bagaimana Santap tumbuh cepat dari sebuah ideasi kecil hingga dipercaya oleh ribuan mitra merchant di seluruh Indonesia.
          </p>
        </div>

        <!-- Right: Milestones timeline -->
        <div class="lg:col-span-8 relative">
          <!-- Central timeline line -->
          <div class="absolute left-4 md:left-8 top-4 bottom-4 w-[1.5px] bg-[var(--color-border)] pointer-events-none"></div>

          <div class="flex flex-col gap-12">
            <div 
              v-for="(milestone, i) in milestones" 
              :key="i"
              class="relative pl-12 md:pl-20 group"
            >
              <!-- Timeline node circle -->
              <div class="absolute left-2.5 md:left-6.5 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-[var(--color-border)] bg-[var(--color-bg-page)] group-hover:border-[var(--color-primary)] group-hover:bg-[var(--color-primary)] transition-all duration-300 z-10"></div>

              <!-- Content card -->
              <div class="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] transition-all duration-300 group-hover:border-[var(--color-border-strong)] group-hover:shadow-[var(--shadow-1)]">
                <span class="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold bg-[var(--color-primary-light)] text-[var(--color-primary)] tracking-wide mb-3">
                  {{ milestone.year }}
                </span>
                <h3 class="text-[18px] font-semibold text-[var(--color-text-primary)] mb-2">{{ milestone.title }}</h3>
                <p class="text-[13.5px] leading-relaxed text-[var(--color-text-secondary)]">
                  {{ milestone.desc }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════
         CTA SECTION — Dark theme above footer
         ══════════════════════════════════════════════════════ -->
    <section
      id="about-cta"
      class="relative overflow-hidden"
      style="background-color: #111009;"
      aria-label="Bergabung bersama Santap"
    >
      <!-- Subtle background texture (glow) -->
      <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          class="absolute"
          style="width: 60%; height: 60%; top: -20%; left: -10%; background: radial-gradient(circle, rgba(232,119,34,0.06) 0%, transparent 70%); border-radius: 50%;"
        ></div>
        <div
          class="absolute"
          style="width: 50%; height: 50%; bottom: -15%; right: -5%; background: radial-gradient(circle, rgba(232,119,34,0.04) 0%, transparent 70%); border-radius: 50%;"
        ></div>
      </div>

      <div class="relative z-10 px-5 md:px-10 lg:px-16 py-24 md:py-32 max-w-[1400px] mx-auto text-center flex flex-col items-center">
        <span
          class="inline-flex items-center gap-3 px-4 py-2 rounded-md border mb-8"
          style="background-color: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1);"
        >
          <div class="w-2 h-2 rounded-sm flex-shrink-0" style="background-color: var(--color-primary);"></div>
          <span class="text-[10.5px] font-bold uppercase tracking-[0.16em]" style="color: rgba(255,255,255,0.8);">Mulai Langkah Anda</span>
        </span>

        <h2
          class="font-medium leading-[1.08] tracking-tight mb-6 max-w-2xl text-center"
          style="font-size: clamp(32px, 5vw, 56px); color: #FFFFFF;"
        >
          Mari sederhanakan bisnis kuliner Anda bersama kami.
        </h2>
        
        <p class="text-[14.5px] leading-[1.75] max-w-md mb-12 text-white/55">
          Lebih dari sekadar aplikasi point-of-sale. Santap siap menjadi partner terpercaya bagi kesuksesan operasional restoran Anda setiap hari.
        </p>

        <div class="flex flex-wrap justify-center gap-4">
          <NuxtLink
            to="/#"
            class="inline-flex items-center justify-center py-3.5 px-8 rounded-full text-[11px] font-bold uppercase tracking-[0.08em] no-underline transition-all hover:-translate-y-px bg-white text-[#111009] hover:bg-white/95"
          >
            Mulai Uji Coba Gratis
          </NuxtLink>
          <NuxtLink
            to="/contact"
            class="inline-flex items-center justify-center py-3.5 px-8 rounded-full text-[11px] font-bold uppercase tracking-[0.08em] no-underline transition-all hover:-translate-y-px text-white border border-white/20 hover:bg-white/5"
          >
            Hubungi Perwakilan Kami
          </NuxtLink>
        </div>
      </div>
    </section>

  </main>
</template>

<script setup lang="ts">
useHead({
  title: 'Tentang Kami — Santap',
  meta: [
    { name: 'description', content: 'Kenali kisah berdirinya, misi utama, dan perjalanan tim Santap dalam menghadirkan solusi teknologi POS cloud untuk ekosistem kuliner di Indonesia.' }
  ]
})
const pillars = [
  {
    title: 'Merchant-First',
    desc: 'Semua pengembangan fitur dirancang berdasarkan umpan balik langsung dari kasir, koki, pelayan, hingga pemilik restoran.',
    icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m16-10a4 4 0 11-8 0 4 4 0 018 0z'
  },
  {
    title: 'Keandalan POS',
    desc: 'Kami menjamin sistem POS cloud kami bekerja dengan uptime 99.99% dan mode offline yang tangguh tanpa kehilangan data.',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
  },
  {
    title: 'Ketulusan Layanan',
    desc: 'Kami sadar operasional restoran tidak pernah tidur. Dukungan chat WhatsApp kami siap sedia mendampingi Anda.',
    icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
  }
]

const milestones = [
  {
    year: '2024',
    title: 'Ideasi & Tim Pertama',
    desc: 'Santap didirikan oleh sekelompok teknolog dan pelaku bisnis kuliner di Jakarta untuk memetakan tantangan nyata di lapangan dan merancang prototipe kasir mobile.'
  },
  {
    year: '2025',
    title: 'Peluncuran POS Versi Awal',
    desc: 'Meluncurkan platform POS Cloud Santap versi pertama yang mendukung sinkronisasi meja ke KDS dapur dan multi pembayaran e-wallet QRIS.'
  },
  {
    year: '2026',
    title: 'Kepercayaan 10.000+ Merchant',
    desc: 'Dipercaya oleh lebih dari 10.000 outlet kuliner aktif di 50+ kota di Indonesia, memproses volume transaksi penjualan real-time bernilai tinggi.'
  }
]
</script>
