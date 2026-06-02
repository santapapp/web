/**
 * useCustomerPayment — Composable untuk pembayaran QRIS mandiri
 *
 * Endpoints:
 * - POST   /v1/customer/order/pay-qris    → inisiasi QRIS (X-Public-Token)
 * - GET    /v1/customer/order/qris-status → cek status (X-Public-Token)
 * - DELETE /v1/customer/order/qris-cancel → batalkan (X-Public-Token)
 *
 * Flow:
 * 1. initiatePayment() → dapat qr_url dan payment_reference
 * 2. Render QR dari qr_url
 * 3. startPolling() → check tiap 5 detik sampai paid/cancelled
 * 4. Countdown berjalan paralel. Saat habis TIDAK langsung menandai gagal —
 *    melakukan satu FINAL CHECK ke Laravel (gateway = source of truth). Status
 *    final (paid/cancelled/expired) hanya diputuskan dari response API.
 */

import { ref, onUnmounted } from 'vue'
import type { LocalQrisPayment, QrisPaymentStatus } from '~/types/customer-payment'
import type { CustomerApiError } from './useCustomerApi'

const POLL_INTERVAL_MS = 5000  // 5 detik

/**
 * Timeout pembayaran QRIS — 15 menit.
 *
 * Ini adalah UX frontend sementara karena backend belum mengembalikan expires_at.
 * Jika backend suatu saat mengembalikan expires_at di response pay-qris,
 * gunakan nilai tersebut menggantikan konstanta ini.
 */
const PAYMENT_TIMEOUT_MS = 15 * 60 * 1000  // 15 menit

export const useCustomerPayment = () => {
  const api = useCustomerApi()

  const payment = ref<LocalQrisPayment | null>(null)
  const isPaid = ref(false)
  const isFailed = ref(false)
  const isExpired = ref(false)  // payment expired (dikonfirmasi API setelah final check)
  const isPolling = ref(false)
  const isChecking = ref(false) // sedang melakukan final check ke API saat timeout
  const initiatePending = ref(false)
  const cancelPending = ref(false)
  const paymentError = ref<CustomerApiError | null>(null)

  // Countdown dalam detik tersisa (0 = waktu habis)
  const countdown = ref(0)

  // Offset waktu antara server dan client
  const timeOffset = ref(0)

  let pollingInterval: ReturnType<typeof setInterval> | null = null
  let countdownInterval: ReturnType<typeof setInterval> | null = null
  // Fungsi cek status aktif (custom utk table order, default utk open bill).
  // Dipakai ulang oleh final check saat countdown habis.
  let activeCheckFn: (() => Promise<QrisPaymentStatus | undefined>) | null = null
  let finalizing = false
  
  const setServerTime = (serverTimeStr?: string | null) => {
    if (serverTimeStr) {
      timeOffset.value = new Date(serverTimeStr).getTime() - Date.now()
    }
  }

  /**
   * Update local state berdasarkan status dari API.
   * Status dari GET /v1/customer/order/qris-status → data.payment_status
   */
  const applyStatus = (status: QrisPaymentStatus | undefined | null) => {
    if (!status) return
    if (payment.value) {
      payment.value = { ...payment.value, status }
    }
    if (status === 'paid') {
      isPaid.value = true
      isFailed.value = false
      stopCountdown()
    } else if (status === 'cancelled' || status === 'failed') {
      isFailed.value = true
      isPaid.value = false
      stopCountdown()
    }
  }

  /**
   * Mulai countdown timer.
   * Saat habis: isExpired = true, isFailed = true, polling berhenti.
   */
  const startCountdown = (expiresAt: string | null) => {
    stopCountdown()

    if (!expiresAt) {
      console.warn('[useCustomerPayment] payment_expires_at is null or empty, cannot start timer.')
      paymentError.value = {
        message: 'Data waktu pembayaran tidak tersedia.',
        statusCode: 422
      }
      return
    }

    const expiresDate = new Date(expiresAt)
    if (isNaN(expiresDate.getTime())) {
      console.warn('[useCustomerPayment] payment_expires_at is invalid date:', expiresAt)
      paymentError.value = {
        message: 'Data waktu pembayaran tidak valid.',
        statusCode: 422
      }
      return
    }

    const tick = () => {
      const currentServerTime = Date.now() + timeOffset.value
      const remaining = Math.max(0, expiresDate.getTime() - currentServerTime)
      countdown.value = Math.floor(remaining / 1000)

      if (remaining <= 0) {
        // Waktu habis — JANGAN langsung tandai gagal. Konfirmasi dulu ke API
        // (gateway = source of truth) lewat final check.
        stopCountdown()
        void finalizeOnTimeout()
      }
    }

    tick()  // jalankan sekali langsung
    countdownInterval = setInterval(tick, 1000)
  }

  /**
   * Cek status default ke API (open bill — token di header).
   */
  const defaultCheck = async (): Promise<QrisPaymentStatus | undefined> => {
    const response = await api.checkQrisStatus()
    return response.data?.payment_status as QrisPaymentStatus | undefined
  }

  /**
   * Final check saat countdown habis. Status final hanya diputuskan dari
   * response Laravel: kalau paid → sukses; selain itu baru expired.
   * Jika API tak terjangkau, fallback ke expired agar UI tidak menggantung.
   */
  const finalizeOnTimeout = async () => {
    if (finalizing) return
    finalizing = true
    isChecking.value = true

    try {
      const check = activeCheckFn ?? defaultCheck
      const status = await check()
      applyStatus(status)
    } catch (err) {
      console.warn('[useCustomerPayment] Final check error:', err)
    } finally {
      isChecking.value = false
      finalizing = false
    }

    if (isPaid.value) {
      stopPolling()
      return
    }

    // Belum paid setelah konfirmasi API → baru tandai expired.
    isExpired.value = true
    isFailed.value = true
    stopPolling()
  }

  /**
   * Hentikan countdown timer.
   */
  const stopCountdown = () => {
    if (countdownInterval) {
      clearInterval(countdownInterval)
      countdownInterval = null
    }
  }

  /**
   * Inisiasi pembayaran QRIS.
   * Nominal diambil otomatis dari total_amount order aktif di backend.
   * Response: { data: { qr_url, payment_reference }, message }
   */
  const initiatePayment = async () => {
    initiatePending.value = true
    paymentError.value = null

    try {
      const response = await api.initiateQris()
      const data = response.data

      setServerTime(data.server_time)
      const expiresAt = data.payment_expires_at ?? data.expires_at
        ? String(data.payment_expires_at ?? data.expires_at)
        : new Date(Date.now() + PAYMENT_TIMEOUT_MS).toISOString()

      const localPayment: LocalQrisPayment = {
        qr_url: data.qr_url ?? '',
        payment_reference: data.payment_reference,
        status: 'pending',
        expires_at: expiresAt
      }

      payment.value = localPayment

      // Reset state sebelumnya
      isPaid.value = false
      isFailed.value = false
      isExpired.value = false

      // Mulai countdown 5 menit saat payment diinisiasi
      startCountdown(expiresAt)

      return { success: true, data: localPayment, message: response.message as string }
    } catch (err) {
      paymentError.value = err as CustomerApiError
      return { success: false, error: err as CustomerApiError }
    } finally {
      initiatePending.value = false
    }
  }

  /**
   * Set data QRIS dari response external (misal dari Create Order atomic checkout).
   */
  const setExternalPayment = (
    qrUrl: string,
    paymentReference: string | null,
    expiresAt: string | null,
    serverTime?: string | null
  ) => {
    setServerTime(serverTime)
    const localPayment: LocalQrisPayment = {
      qr_url: qrUrl,
      payment_reference: paymentReference ?? '',
      status: 'pending',
      expires_at: expiresAt
    }
    
    payment.value = localPayment
    isPaid.value = false
    isFailed.value = false
    isExpired.value = false
    
    startCountdown(expiresAt)
  }

  /**
   * Cek status pembayaran sekali (tanpa polling).
   * Response: { data: { payment_status: 'unpaid' | 'pending' | 'paid' | 'cancelled' } }
   */
  const checkPaymentOnce = async () => {
    try {
      const response = await api.checkQrisStatus()
      const status = response.data?.payment_status as QrisPaymentStatus | undefined
      applyStatus(status)
      return { success: true, status }
    } catch (err) {
      return { success: false, error: err as CustomerApiError }
    }
  }

  /**
   * Mulai polling status pembayaran setiap 5 detik.
   * Berhenti otomatis jika paid, cancelled, atau countdown expired.
   */
  const startPolling = (customCheckFn?: () => Promise<QrisPaymentStatus | undefined>) => {
    if (pollingInterval) stopPolling()

    isPolling.value = true
    isPaid.value = false
    isFailed.value = false
    // Simpan fungsi cek aktif agar final check saat timeout memakai endpoint yang sama.
    activeCheckFn = customCheckFn ?? defaultCheck

    pollingInterval = setInterval(async () => {
      // Stop hanya jika status final sudah dikonfirmasi.
      if (isExpired.value || isPaid.value || isFailed.value) {
        stopPolling()
        return
      }

      try {
        const status = await (activeCheckFn ?? defaultCheck)()
        applyStatus(status)

        if (isPaid.value || isFailed.value) {
          stopPolling()
        }
      } catch (err) {
        // Jangan stop polling karena network error sementara
        console.warn('[useCustomerPayment] Polling error:', err)
      }
    }, POLL_INTERVAL_MS)
  }

  /**
   * Hentikan polling.
   */
  const stopPolling = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval)
      pollingInterval = null
    }
    isPolling.value = false
  }

  /**
   * Batalkan pembayaran QRIS yang masih pending.
   * DELETE /v1/customer/order/qris-cancel
   */
  const cancelPayment = async () => {
    cancelPending.value = true

    try {
      stopPolling()
      stopCountdown()
      await api.cancelQris()

      if (payment.value) {
        payment.value = { ...payment.value, status: 'cancelled' }
      }
      isFailed.value = true

      return { success: true, message: 'Pembayaran dibatalkan.' }
    } catch (err) {
      return { success: false, error: err as CustomerApiError }
    } finally {
      cancelPending.value = false
    }
  }

  // Cleanup saat component unmounted
  onUnmounted(() => {
    stopPolling()
    stopCountdown()
  })

  return {
    payment,
    isPaid,
    isFailed,
    isExpired,
    countdown,
    isPolling,
    isChecking,
    initiatePending,
    cancelPending,
    paymentError,

    initiatePayment,
    setExternalPayment,
    checkPaymentOnce,
    startPolling,
    stopPolling,
    cancelPayment
  }
}
