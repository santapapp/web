/**
 * useCustomerApi — API client untuk Santap Customer API (Real API)
 *
 * Base URL: http://localhost:8000 (dev) / https://api.santap.id (prod)
 * Auth: X-Customer-Session header (bukan Bearer token)
 *
 * Semua endpoint customer tidak memerlukan login — hanya session token
 * yang didapat setelah scan QR meja.
 */

import { useRuntimeConfig } from '#imports'
import type { StartSessionPayload, StartSessionResponse, CurrentSessionResponse } from '~/types/customer-session'
import type { CustomerMenuResponse } from '~/types/customer-menu'
import type { CreateOrderPayload, CreateOrderResponse, OpenBillResponse, CallCashierResponse } from '~/types/customer-order'
import type {
  InitiatePaymentResponse,
  CheckPaymentResponse,
  CancelPaymentResponse
} from '~/types/customer-payment'

const SESSION_STORAGE_KEY = 'customer_session'

type FetchOptions = {
  method?: 'GET' | 'POST' | 'DELETE'
  body?: unknown
  headers?: Record<string, string>
}

export interface CustomerApiError {
  message: string
  statusCode: number
  errors?: Record<string, string[]>
}

const normalizeCustomerApiError = (error: unknown): CustomerApiError => {
  if (typeof error === 'object' && error !== null) {
    const e = error as {
      data?: { message?: string; errors?: Record<string, string[]> }
      statusCode?: number
      status?: number
      statusMessage?: string
      message?: string
    }

    return {
      message: e.data?.message ?? e.statusMessage ?? e.message ?? 'Terjadi kesalahan.',
      statusCode: e.statusCode ?? e.status ?? 500,
      errors: e.data?.errors
    }
  }

  return {
    message: 'Terjadi kesalahan yang tidak diketahui.',
    statusCode: 500
  }
}

export const useCustomerApi = () => {
  const config = useRuntimeConfig()
  const baseUrl = String(config.public.apiBaseUrl || 'http://localhost:8000').replace(/\/$/, '')

  const getToken = (): string | null => {
    if (!import.meta.client) return null
    return localStorage.getItem(SESSION_STORAGE_KEY)
  }

  const buildHeaders = (requiresSession = true): Record<string, string> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }

    if (requiresSession) {
      const token = getToken()
      if (token) {
        headers['X-Public-Token'] = token
      }
    }

    return headers
  }

  const request = async <T>(path: string, options: FetchOptions = {}): Promise<T> => {
    try {
      const result = await $fetch<T>(`${baseUrl}${path}`, {
        method: options.method ?? 'GET',
        headers: {
          ...buildHeaders(true),
          ...(options.headers ?? {})
        },
        body: options.body as BodyInit | Record<string, unknown> | null | undefined
      })
      return result as T
    } catch (error) {
      throw normalizeCustomerApiError(error)
    }
  }

  return {
    // ─── Session ────────────────────────────────────────────────────────────

    /**
     * Mulai sesi pelanggan setelah scan QR meja.
     * Tidak membutuhkan session token.
     * GET /api/v1/customer/table/{qrToken}
     */
    async startSession(payload: StartSessionPayload): Promise<any> {
      try {
        const result = await $fetch<any>(`${baseUrl}/api/v1/customer/table/${payload.qr_token}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          }
        })
        return result
      } catch (error) {
        throw normalizeCustomerApiError(error)
      }
    },

    /**
     * Cek sesi aktif — validasi token masih valid saat user refresh halaman.
     * GET /api/v1/customer/order
     */
    async getCurrentSession(): Promise<any> {
      return request<any>('/api/v1/customer/order')
    },

    // ─── Menu ───────────────────────────────────────────────────────────────

    /**
     * Ambil semua menu.
     * GET /api/v1/customer/menu?org={orgId}
     */
    async getMenu(orgId: number): Promise<any> {
      return request<any>(`/api/v1/customer/menu?org=${orgId}`)
    },

    // ─── Orders ─────────────────────────────────────────────────────────────

    /**
     * Tambah item ke order (place order/add items).
     * POST /api/v1/customer/order/items
     */
    async createOrder(payload: CreateOrderPayload): Promise<any> {
      return request<any>('/api/v1/customer/order/items', {
        method: 'POST',
        body: payload
      })
    },

    /**
     * Lihat tagihan aktif meja (semua order + pembayaran).
     * GET /api/v1/customer/order
     */
    async getOpenBill(): Promise<any> {
      return request<any>('/api/v1/customer/order')
    },

    /**
     * Kirim notifikasi ke kasir.
     * Mocked - backend tidak memiliki endpoint ini.
     */
    async callCashier(): Promise<any> {
      return { message: 'Kasir dipanggil.' }
    },

    // ─── Payments ───────────────────────────────────────────────────────────

    /**
     * Inisiasi pembayaran QRIS mandiri.
     * POST /api/v1/customer/order/pay-qris
     */
    async initiatePayment(): Promise<any> {
      return request<any>('/api/v1/customer/order/pay-qris', {
        method: 'POST'
      })
    },

    /**
     * Cek status pembayaran (untuk polling).
     * GET /api/v1/customer/order/qris-status
     */
    async checkPayment(paymentId?: string): Promise<any> {
      return request<any>('/api/v1/customer/order/qris-status', {
        method: 'GET'
      })
    },

    /**
     * Batalkan pembayaran yang masih pending.
     * DELETE /api/v1/customer/order/qris-cancel
     */
    async cancelPayment(paymentId?: string): Promise<any> {
      return request<any>('/api/v1/customer/order/qris-cancel', {
        method: 'DELETE'
      })
    }
  }
}

