<script setup lang="ts">
import jsQR from 'jsqr'

/**
 * OrdersQrScanner — Komponen scan QR kamera untuk halaman orders
 *
 * Strategi:
 * 1. Cek dukungan kamera & BarcodeDetector API (Chrome/Edge/Safari iOS 17+)
 * 2. Jika supported: buka kamera, detect QR via BarcodeDetector (lebih cepat & hemat resource)
 * 3. Jika tidak supported BarcodeDetector tapi ada kamera: detect QR via jsQR fallback (Firefox, Safari dll.)
 * 4. Jika kamera tidak ada: tampilkan fallback input URL manual
 *
 * Event emit:
 * - scanned: { table: string, qr: string } saat QR valid terdeteksi
 * - cancel: saat user tutup scanner
 */

interface ScanResult {
  table: string
  qr: string
}

const emit = defineEmits<{
  scanned: [result: ScanResult]
  cancel: []
}>()

// ── State ──────────────────────────────────────────────────
type ScannerPhase =
  | 'idle'           // Belum mulai
  | 'requesting'     // Sedang minta izin kamera
  | 'scanning'       // Kamera aktif, sedang detect
  | 'denied'         // Izin ditolak
  | 'unsupported'    // Browser tidak support kamera
  | 'error'          // Error lain
  | 'fallback'       // Mode input manual

const phase = ref<ScannerPhase>('idle')
const errorMsg = ref('')
const manualUrl = ref('')
const manualError = ref('')
const isDetecting = ref(false)
const scanSuccess = ref(false)

// Ref untuk video dan canvas
const videoRef = ref<HTMLVideoElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

let stream: MediaStream | null = null
let detector: any = null
let animFrameId: number | null = null

// ── BarcodeDetector & Camera support check ─────────────────
const isBarcodeSupported = computed(() => {
  if (!import.meta.client) return false
  return 'BarcodeDetector' in window
})

const isCameraSupported = computed(() => {
  if (!import.meta.client) return false
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
})

// ── Parse URL dari QR ──────────────────────────────────────
/**
 * QR Santap berisi URL seperti:
 * https://santap.id/o/resto-abc/orders?table=KB-03&qr=abc123token
 *
 * Atau bisa juga format rawstring: KB-03|abc123token
 */
const parseQrContent = (rawValue: string): ScanResult | null => {
  try {
    // Coba parse sebagai URL
    const url = new URL(rawValue)
    const table = url.searchParams.get('table')
    const qr = url.searchParams.get('qr')

    if (table && qr) {
      return { table, qr }
    }
  } catch {
    // Bukan URL yang valid
  }

  // Coba format pipe-separated: TABLE_CODE|QR_TOKEN
  const pipeParts = rawValue.split('|')
  if (pipeParts.length === 2 && pipeParts[0] && pipeParts[1]) {
    return { table: pipeParts[0].trim(), qr: pipeParts[1].trim() }
  }

  return null
}

// ── Mulai kamera ──────────────────────────────────────────
const startCamera = async () => {
  if (!isCameraSupported.value) {
    phase.value = 'unsupported'
    return
  }

  phase.value = 'requesting'

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment', // Kamera belakang (scan mode)
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    })

    phase.value = 'scanning'

    // Tunggu video element mount
    await nextTick()

    if (videoRef.value) {
      videoRef.value.srcObject = stream
      await videoRef.value.play()
    }

    // Init BarcodeDetector jika supported
    if (isBarcodeSupported.value) {
      try {
        // @ts-ignore — BarcodeDetector tidak ada di TS lib standar
        detector = new window.BarcodeDetector({ formats: ['qr_code'] })
      } catch (detectorErr) {
        console.warn('BarcodeDetector found but failed to initialize, using jsQR fallback', detectorErr)
        detector = null
      }
    } else {
      detector = null
    }

    startDetectionLoop()
  } catch (err: any) {
    stopCamera()

    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
      phase.value = 'denied'
    } else if (err.name === 'NotFoundError') {
      phase.value = 'error'
      errorMsg.value = 'Kamera tidak ditemukan di perangkat ini.'
    } else {
      phase.value = 'error'
      errorMsg.value = `Gagal membuka kamera: ${err.message ?? err.name}`
    }
  }
}

// ── Detection loop ─────────────────────────────────────────
const startDetectionLoop = () => {
  const detect = async () => {
    if (phase.value !== 'scanning' || !videoRef.value) return
    if (isDetecting.value) {
      animFrameId = requestAnimationFrame(detect)
      return
    }

    const video = videoRef.value

    if (video.readyState < 2) {
      animFrameId = requestAnimationFrame(detect)
      return
    }

    isDetecting.value = true

    try {
      let raw: string | null = null

      if (isBarcodeSupported.value && detector) {
        const barcodes = await detector.detect(video)
        if (barcodes.length > 0) {
          raw = barcodes[0].rawValue as string
        }
      } else if (canvasRef.value) {
        // Fallback ke jsQR via canvas buffer
        const canvas = canvasRef.value
        const ctx = canvas.getContext('2d', { willReadFrequently: true })
        if (ctx) {
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const code = jsQR(imageData.data, imageData.width, imageData.height)
          if (code) {
            raw = code.data
          }
        }
      }

      if (raw) {
        const result = parseQrContent(raw)

        if (result) {
          scanSuccess.value = true
          stopCamera()

          // Brief delay untuk visual feedback
          setTimeout(() => {
            emit('scanned', result)
          }, 400)
          return
        }
      }
    } catch (err) {
      // Ignore detection errors (terjadi saat video belum siap)
    }

    isDetecting.value = false
    animFrameId = requestAnimationFrame(detect)
  }

  animFrameId = requestAnimationFrame(detect)
}

// ── Stop kamera ───────────────────────────────────────────
const stopCamera = () => {
  if (animFrameId) {
    cancelAnimationFrame(animFrameId)
    animFrameId = null
  }

  if (stream) {
    stream.getTracks().forEach((track) => track.stop())
    stream = null
  }

  if (videoRef.value) {
    videoRef.value.srcObject = null
  }
}

// ── Fallback: manual URL input ─────────────────────────────
const submitManualUrl = () => {
  manualError.value = ''

  const result = parseQrContent(manualUrl.value.trim())

  if (!result) {
    manualError.value =
      'URL tidak valid. Salin URL dari QR meja Anda lalu tempel di sini.'
    return
  }

  emit('scanned', result)
}

// ── Lifecycle ──────────────────────────────────────────────
onMounted(() => {
  // Auto-start kamera jika kamera didukung
  if (isCameraSupported.value) {
    startCamera()
  } else {
    phase.value = 'unsupported'
  }
})

onUnmounted(() => {
  stopCamera()
})
</script>

<template>
  <div class="qr-scanner-overlay" role="dialog" aria-modal="true" aria-label="Scan QR meja">

    <!-- ── Idle: tombol mulai (tidak tampil karena auto-start) ── -->

    <!-- ── Requesting permission ─────────────────────────── -->
    <div v-if="phase === 'requesting'" class="scanner-state">
      <div class="scanner-spinner" />
      <p class="scanner-label">Meminta izin kamera...</p>
    </div>

    <!-- ── Scanning: live camera ─────────────────────────── -->
    <div v-else-if="phase === 'scanning'" class="scanner-live" :class="{ 'scan-success': scanSuccess }">
      <!-- Video feed -->
      <video
        ref="videoRef"
        class="scanner-video"
        playsinline
        muted
        autoplay
        aria-label="Tampilan kamera untuk scan QR"
      />

      <!-- Canvas tersembunyi untuk fallback jsQR -->
      <canvas
        ref="canvasRef"
        class="scanner-canvas-hidden"
        aria-hidden="true"
      />

      <!-- Viewfinder overlay -->
      <div class="scanner-viewfinder" aria-hidden="true">
        <div class="viewfinder-box">
          <!-- Corner brackets -->
          <span class="corner tl" />
          <span class="corner tr" />
          <span class="corner bl" />
          <span class="corner br" />

          <!-- Scan line animation -->
          <div v-if="!scanSuccess" class="scan-line" />

          <!-- Success flash -->
          <div v-if="scanSuccess" class="success-flash">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 13l4 4L19 7" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>

        <!-- Instruction text -->
        <p class="scanner-instruction">
          {{ scanSuccess ? 'QR terdeteksi! 🎉' : 'Arahkan kamera ke QR meja Anda' }}
        </p>
      </div>
    </div>

    <!-- ── Permission denied ──────────────────────────────── -->
    <div v-else-if="phase === 'denied'" class="scanner-state">
      <div class="state-icon-lg">🔒</div>
      <h3>Izin kamera diperlukan</h3>
      <p>
        Anda perlu mengizinkan akses kamera agar bisa scan QR meja.
        Buka pengaturan browser dan izinkan kamera untuk situs ini.
      </p>

      <div class="scanner-actions">
        <button class="btn-scan-retry" @click="startCamera">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M1 4v6h6M23 20v-6h-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          Coba Lagi
        </button>

        <button class="btn-scan-fallback" @click="phase = 'fallback'">
          Masukkan URL Manual
        </button>
      </div>

      <!-- Tips -->
      <div class="permission-tips">
        <p class="tips-title">💡 Cara mengizinkan kamera:</p>
        <ul>
          <li>Chrome: Klik ikon kunci 🔒 di address bar → Kamera → Izinkan</li>
          <li>Safari: Pengaturan → Safari → Kamera → Izinkan</li>
        </ul>
      </div>
    </div>

    <!-- ── Unsupported browser ────────────────────────────── -->
    <div v-else-if="phase === 'unsupported'" class="scanner-state">
      <div class="state-icon-lg">📱</div>
      <h3>Kamera tidak didukung</h3>
      <p>
        Browser Anda tidak mendukung akses kamera untuk memindai QR.
        Gunakan Chrome/Safari/Edge terbaru, atau masukkan URL QR secara manual.
      </p>

      <div class="scanner-actions">
        <button class="btn-scan-primary" @click="phase = 'fallback'">
          📋 Masukkan URL Manual
        </button>
      </div>
    </div>

    <!-- ── Error lain ─────────────────────────────────────── -->
    <div v-else-if="phase === 'error'" class="scanner-state">
      <div class="state-icon-lg">⚠️</div>
      <h3>Gagal membuka kamera</h3>
      <p>{{ errorMsg }}</p>

      <div class="scanner-actions">
        <button class="btn-scan-retry" @click="startCamera">Coba Lagi</button>
        <button class="btn-scan-fallback" @click="phase = 'fallback'">Input Manual</button>
      </div>
    </div>

    <!-- ── Fallback: manual URL ───────────────────────────── -->
    <div v-else-if="phase === 'fallback'" class="scanner-state">
      <div class="state-icon-lg">🔗</div>
      <h3>Masukkan URL QR</h3>
      <p>
        Salin URL dari QR meja menggunakan kamera HP, lalu tempel di sini.
      </p>

      <div class="manual-input-group">
        <input
          v-model="manualUrl"
          id="qr-manual-url"
          type="url"
          class="manual-input"
          placeholder="https://santap.id/o/resto/orders?table=..."
          @keydown.enter="submitManualUrl"
        />
        <p v-if="manualError" class="manual-error">{{ manualError }}</p>
        <button class="btn-scan-primary" @click="submitManualUrl">
          Gunakan URL ini
        </button>
      </div>

      <button
        v-if="isCameraSupported"
        class="btn-scan-fallback"
        @click="startCamera"
      >
        ← Kembali ke Kamera
      </button>
    </div>

    <!-- ── Close button (selalu ada) ─────────────────────── -->
    <button
      class="scanner-close-btn"
      aria-label="Tutup scanner"
      @click="emit('cancel')"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </button>
  </div>
</template>

<style scoped>
.scanner-canvas-hidden {
  display: none;
}

/* ── Overlay fullscreen ───────────────────────────────────── */
.qr-scanner-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: #0D0B09;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: overlayIn 0.25s cubic-bezier(0, 0, 0.2, 1);
}

@keyframes overlayIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* ── State views (non-camera states) ─────────────────────── */
.scanner-state {
  width: 100%;
  max-width: 400px;
  padding: 32px 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  animation: stateIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes stateIn {
  from { opacity: 0; transform: scale(0.95) translateY(12px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

.state-icon-lg {
  font-size: 52px;
  line-height: 1;
  margin-bottom: 4px;
}

.scanner-state h3 {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  margin: 0;
  letter-spacing: -0.02em;
}

.scanner-state p {
  font-size: 14px;
  color: rgba(255,255,255,0.6);
  line-height: 1.6;
  margin: 0;
  max-width: 320px;
}

.scanner-label {
  font-size: 14px;
  color: rgba(255,255,255,0.6);
  margin: 8px 0 0;
}

/* ── Spinner ──────────────────────────────────────────────── */
.scanner-spinner {
  width: 44px;
  height: 44px;
  border: 3px solid rgba(255,255,255,0.1);
  border-top-color: #E87722;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ── Live camera ─────────────────────────────────────────── */
.scanner-live {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scanner-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ── Viewfinder overlay ──────────────────────────────────── */
.scanner-viewfinder {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

/* Dark vignette around the viewfinder */
.scanner-live::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  background: radial-gradient(
    ellipse 60% 55% at 50% 48%,
    transparent 0%,
    rgba(0,0,0,0.65) 100%
  );
  pointer-events: none;
}

.viewfinder-box {
  position: relative;
  width: min(72vw, 280px);
  height: min(72vw, 280px);
}

/* Corner brackets */
.corner {
  position: absolute;
  width: 28px;
  height: 28px;
  border-color: #E87722;
  border-style: solid;
}

.corner.tl { top: 0; left: 0;  border-width: 3px 0 0 3px; border-radius: 6px 0 0 0; }
.corner.tr { top: 0; right: 0; border-width: 3px 3px 0 0; border-radius: 0 6px 0 0; }
.corner.bl { bottom: 0; left: 0;  border-width: 0 0 3px 3px; border-radius: 0 0 0 6px; }
.corner.br { bottom: 0; right: 0; border-width: 0 3px 3px 0; border-radius: 0 0 6px 0; }

/* Scan line */
.scan-line {
  position: absolute;
  left: 6px;
  right: 6px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #E87722, transparent);
  border-radius: 1px;
  animation: scanMove 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  box-shadow: 0 0 8px rgba(232, 119, 34, 0.8);
}

@keyframes scanMove {
  0%   { top: 8px; opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { top: calc(100% - 10px); opacity: 0; }
}

/* Success flash */
.success-flash {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(34, 197, 94, 0.25);
  border-radius: 8px;
  animation: successPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes successPop {
  from { opacity: 0; transform: scale(0.7); }
  to   { opacity: 1; transform: scale(1); }
}

.scanner-live.scan-success .corner {
  border-color: #22c55e;
  transition: border-color 0.2s;
}

.scanner-instruction {
  font-size: 14px;
  font-weight: 600;
  color: white;
  text-align: center;
  text-shadow: 0 1px 4px rgba(0,0,0,0.5);
  margin: 0;
  background: rgba(0,0,0,0.35);
  padding: 8px 20px;
  border-radius: 999px;
  backdrop-filter: blur(8px);
}

/* ── Buttons ─────────────────────────────────────────────── */
.scanner-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 280px;
  margin-top: 8px;
}

.btn-scan-primary {
  width: 100%;
  background: #E87722;
  color: white;
  border: none;
  border-radius: 14px;
  padding: 14px 20px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s, transform 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 16px rgba(232, 119, 34, 0.35);
}

.btn-scan-primary:hover {
  background: #C45E0F;
}

.btn-scan-primary:active {
  transform: scale(0.98);
}

.btn-scan-retry {
  width: 100%;
  background: rgba(255,255,255,0.1);
  color: white;
  border: 1.5px solid rgba(255,255,255,0.2);
  border-radius: 14px;
  padding: 13px 20px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-scan-retry:hover {
  background: rgba(255,255,255,0.15);
}

.btn-scan-fallback {
  background: transparent;
  border: none;
  color: rgba(255,255,255,0.5);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
  padding: 6px 0;
  transition: color 0.15s;
}

.btn-scan-fallback:hover {
  color: rgba(255,255,255,0.8);
}

/* ── Manual input ────────────────────────────────────────── */
.manual-input-group {
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 4px;
}

.manual-input {
  width: 100%;
  background: rgba(255,255,255,0.08);
  border: 1.5px solid rgba(255,255,255,0.15);
  border-radius: 12px;
  padding: 13px 16px;
  font-size: 13px;
  color: white;
  font-family: inherit;
  transition: border-color 0.15s;
  box-sizing: border-box;
}

.manual-input::placeholder {
  color: rgba(255,255,255,0.3);
}

.manual-input:focus {
  outline: none;
  border-color: #E87722;
  background: rgba(255,255,255,0.1);
}

.manual-error {
  font-size: 13px !important;
  color: #ff7b7b !important;
  text-align: center;
  margin: 0 !important;
}

/* ── Permission tips ─────────────────────────────────────── */
.permission-tips {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 14px 16px;
  text-align: left;
  max-width: 320px;
  margin-top: 4px;
}

.tips-title {
  font-size: 13px !important;
  color: rgba(255,255,255,0.7) !important;
  font-weight: 600 !important;
  margin: 0 0 8px !important;
}

.permission-tips ul {
  margin: 0;
  padding-left: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.permission-tips li {
  font-size: 12px;
  color: rgba(255,255,255,0.45);
  line-height: 1.4;
}

/* ── Close button ─────────────────────────────────────────── */
.scanner-close-btn {
  position: fixed;
  top: max(env(safe-area-inset-top, 0px) + 16px, 16px);
  right: 20px;
  z-index: 110;
  width: 38px;
  height: 38px;
  background: rgba(255,255,255,0.12);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: background 0.15s, transform 0.15s;
}

.scanner-close-btn:hover {
  background: rgba(255,255,255,0.2);
}

.scanner-close-btn:active {
  transform: scale(0.92);
}
</style>
