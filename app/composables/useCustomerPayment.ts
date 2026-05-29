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
 * 3. startPolling() → check tiap 3 detik sampai paid/cancelled
 */

import { ref, onUnmounted } from 'vue'
import type { LocalQrisPayment, QrisPaymentStatus } from '~/types/customer-payment'
import type { CustomerApiError } from './useCustomerApi'

const POLL_INTERVAL_MS = 5000 // 5 detik

export const useCustomerPayment = () => {
  const api = useCustomerApi()

  const payment = ref<LocalQrisPayment | null>(null)
  const isPaid = ref(false)
  const isFailed = ref(false)
  const isPolling = ref(false)
  const initiatePending = ref(false)
  const cancelPending = ref(false)
  const paymentError = ref<CustomerApiError | null>(null)

  let pollingInterval: ReturnType<typeof setInterval> | null = null

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
    } else if (status === 'cancelled') {
      isFailed.value = true
      isPaid.value = false
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

      const localPayment: LocalQrisPayment = {
        qr_url: data.qr_url ?? '',
        payment_reference: data.payment_reference,
        status: 'pending',
        expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString() // Estimasi 15 menit
      }

      payment.value = localPayment

      // Reset state sebelumnya
      isPaid.value = false
      isFailed.value = false

      return { success: true, data: localPayment, message: response.message as string }
    } catch (err) {
      paymentError.value = err as CustomerApiError
      return { success: false, error: err as CustomerApiError }
    } finally {
      initiatePending.value = false
    }
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
   * Mulai polling status pembayaran setiap 3 detik.
   * Berhenti otomatis jika paid atau cancelled.
   */
  const startPolling = () => {
    if (pollingInterval) stopPolling()

    isPolling.value = true
    isPaid.value = false
    isFailed.value = false

    pollingInterval = setInterval(async () => {
      try {
        const response = await api.checkQrisStatus()
        const status = response.data?.payment_status as QrisPaymentStatus | undefined
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
  onUnmounted(() => stopPolling())

  return {
    payment,
    isPaid,
    isFailed,
    isPolling,
    initiatePending,
    cancelPending,
    paymentError,

    initiatePayment,
    checkPaymentOnce,
    startPolling,
    stopPolling,
    cancelPayment
  }
}
