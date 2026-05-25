/**
 * useCustomerPayment — Composable untuk pembayaran QRIS mandiri
 *
 * Endpoints:
 * - POST /api/v1/customer/payments          (inisiasi QRIS)
 * - POST /api/v1/customer/payments/{id}/check (cek status)
 * - POST /api/v1/customer/payments/{id}/cancel (batalkan)
 *
 * Flow:
 * 1. initiatePayment() → dapat qr_string
 * 2. Render QR dari qr_string
 * 3. startPolling(paymentId) → check tiap 3 detik sampai paid/failed
 */

import { ref, onUnmounted } from 'vue'
import type { CustomerPayment } from '~/types/customer-payment'
import type { CustomerApiError } from './useCustomerApi'

const POLL_INTERVAL_MS = 3000 // 3 detik sesuai docs

export const useCustomerPayment = () => {
  const api = useCustomerApi()

  const payment = ref<CustomerPayment | null>(null)
  const isPaid = ref(false)
  const isFailed = ref(false)
  const isPolling = ref(false)
  const initiatePending = ref(false)
  const cancelPending = ref(false)
  const paymentError = ref<CustomerApiError | null>(null)

  let pollingInterval: ReturnType<typeof setInterval> | null = null

  /**
   * Inisiasi pembayaran QRIS.
   * Nominal diambil otomatis dari total_amount open bill.
   * Jika sudah ada transaksi pending, API mengembalikan transaksi yang sudah ada.
   */
  const initiatePayment = async () => {
    initiatePending.value = true
    paymentError.value = null

    try {
      const response = await api.initiatePayment()
      const data = response.data

      const mappedPayment: CustomerPayment = {
        id: data.payment_reference,
        organization_id: 1,
        open_bill_id: '1',
        payment_number: data.payment_reference,
        method: 'qris',
        status: 'pending',
        amount: 0,
        paid_amount: 0,
        reference_number: data.payment_reference,
        void_reason: null,
        metadata: {
          status_code: '',
          status_message: '',
          transaction_id: '',
          order_id: data.payment_reference,
          gross_amount: '',
          qr_string: data.qr_url,
          expiry_time: new Date(Date.now() + 15 * 60 * 1000).toISOString()
        },
        created_at: new Date().toISOString(),
        paid_at: null
      }

      payment.value = mappedPayment

      // Reset status sebelumnya
      isPaid.value = false
      isFailed.value = false

      return { success: true, data: mappedPayment, message: response.message }
    } catch (err) {
      paymentError.value = err as CustomerApiError
      return { success: false, error: err as CustomerApiError }
    } finally {
      initiatePending.value = false
    }
  }

  /**
   * Cek status pembayaran sekali (tanpa polling).
   */
  const checkPaymentOnce = async (paymentId: string) => {
    try {
      const response = await api.checkPayment(paymentId)
      const status = response.data?.payment_status

      if (status === 'paid') {
        isPaid.value = true
        isFailed.value = false
      } else if (status === 'failed' || status === 'cancelled') {
        isFailed.value = true
        isPaid.value = false
      }

      const updatedPayment: any = {
        ...(payment.value || {}),
        status: status
      }
      payment.value = updatedPayment

      return { success: true, data: updatedPayment }
    } catch (err) {
      return { success: false, error: err as CustomerApiError }
    }
  }

  /**
   * Mulai polling status pembayaran setiap 3 detik.
   * Berhenti otomatis jika paid atau failed.
   */
  const startPolling = (paymentId: string) => {
    if (pollingInterval) stopPolling()

    isPolling.value = true
    isPaid.value = false
    isFailed.value = false

    pollingInterval = setInterval(async () => {
      try {
        const response = await api.checkPayment(paymentId)
        const status = response.data?.payment_status

        if (status === 'paid') {
          isPaid.value = true
          stopPolling()
        } else if (status === 'failed' || status === 'cancelled') {
          isFailed.value = true
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
   * Batalkan pembayaran yang masih pending.
   */
  const cancelPayment = async (paymentId: string) => {
    cancelPending.value = true

    try {
      stopPolling()
      await api.cancelPayment(paymentId)
      
      const updatedPayment: any = {
        ...(payment.value || {}),
        status: 'cancelled'
      }
      payment.value = updatedPayment
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
