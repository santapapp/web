import { useRuntimeConfig } from '#imports'
import type { CreateOrderPayload } from '~/types/customer-order'
import type { PublicOrgResponse } from '~/types/org'

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
  const baseUrl = String(config.public.apiBaseUrl || 'https://api.santap.app').replace(/\/$/, '')

  const getToken = (): string | null => {
    if (!import.meta.client) return null
    try {
      // persist() menyimpan raw token di 'customer_session' (string, bukan JSON)
      // dan metadata JSON di 'customer_session.meta'.
      // Kita baca dari .meta agar bisa cek sessionType sebelum mengirim token.
      const meta = localStorage.getItem(`${SESSION_STORAGE_KEY}.meta`)
      if (meta) {
        const parsed = JSON.parse(meta)
        // table_order = lokal, tidak perlu token ke backend
        if (parsed.sessionType === 'table_order') return null
        return parsed.sessionToken || null
      }

      // Fallback: baca raw token langsung (format lama / edge case)
      // Ini hanya berlaku jika .meta tidak ada tapi token ada — kirim apa adanya.
      const raw = localStorage.getItem(SESSION_STORAGE_KEY)
      if (!raw) return null

      // Coba parse sebagai JSON (format lama)
      try {
        const parsed = JSON.parse(raw)
        if (typeof parsed === 'object' && parsed !== null) {
          if (parsed.sessionType === 'table_order') return null
          return parsed.sessionToken || null
        }
      } catch {
        // raw adalah string token biasa, bukan JSON — kembalikan langsung
      }

      return raw
    } catch {
      return null
    }
  }

  const buildHeaders = (requiresToken = true): Record<string, string> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }

    if (requiresToken) {
      const token = getToken()
      if (token) {
        headers['X-Public-Token'] = token
        headers['X-Customer-Session'] = token
      }
    }

    return headers
  }

  const request = async <T>(path: string, options: FetchOptions = {}): Promise<T> => {
    try {
      return await $fetch<any>(`${baseUrl}${path}`, {
        method: options.method ?? 'GET',
        headers: {
          ...buildHeaders(true),
          ...(options.headers ?? {})
        },
        body: options.body as BodyInit | Record<string, unknown> | null | undefined
      }) as T
    } catch (error) {
      throw normalizeCustomerApiError(error)
    }
  }

  const publicRequest = async <T>(path: string, options: FetchOptions = {}): Promise<T> => {
    try {
      return await $fetch<any>(`${baseUrl}${path}`, {
        method: options.method ?? 'GET',
        headers: {
          ...buildHeaders(false),
          ...(options.headers ?? {})
        },
        body: options.body as BodyInit | Record<string, unknown> | null | undefined
      }) as T
    } catch (error) {
      throw normalizeCustomerApiError(error)
    }
  }

  const firstSuccessfulPublicRequest = async <T>(paths: string[]): Promise<T> => {
    let lastError: unknown = null

    for (const path of paths) {
      try {
        return await publicRequest<T>(path)
      } catch (error) {
        lastError = error
      }
    }

    throw lastError
  }

  const firstSuccessfulRequest = async <T>(paths: string[]): Promise<T> => {
    let lastError: unknown = null

    for (const path of paths) {
      try {
        return await request<T>(path)
      } catch (error) {
        lastError = error
      }
    }

    throw lastError
  }

  return {
    async getOrganization(orgSlug: string): Promise<PublicOrgResponse> {
      const encodedSlug = encodeURIComponent(orgSlug.trim().toLowerCase())

      return firstSuccessfulPublicRequest<PublicOrgResponse>([
        `/v1/customer/organization/${encodedSlug}`,
        `/api/v1/customer/organization/${encodedSlug}`,
        `/api/public/orgs/${encodedSlug}`
      ])
    },

    async scanTable(qrToken: string): Promise<any> {
      const encodedToken = encodeURIComponent(qrToken)
      return firstSuccessfulPublicRequest<any>([
        `/v1/customer/table/${encodedToken}`,
        `/api/v1/customer/table/${encodedToken}`
      ])
    },

    async validateSession(): Promise<any> {
      return firstSuccessfulRequest<any>([
        '/v1/customer/order'
      ])
    },

    async getMenu(orgId?: number | string, requiresToken = false): Promise<any> {
      const query = orgId ? `?org=${encodeURIComponent(String(orgId))}` : ''

      const paths = [
        `/v1/customer/menu${query}`,
        `/api/v1/customer/menu${query}`
      ]
      let lastError: unknown = null

      for (const path of paths) {
        try {
          return await $fetch<any>(`${baseUrl}${path}`, {
            method: 'GET',
            headers: buildHeaders(requiresToken)
          })
        } catch (error) {
          lastError = normalizeCustomerApiError(error)
        }
      }

      throw lastError
    },

    async getMenuByOrgSlug(orgSlug: string): Promise<any> {
      const orgResponse = await this.getOrganization(orgSlug)
      const org = orgResponse?.data ?? (orgResponse as any)
      const orgId = org?.id
      if (!orgId) {
        throw {
          message: 'ID Outlet tidak ditemukan.',
          statusCode: 422
        }
      }
      return this.getMenu(orgId, false)
    },

    async createOrder(payload: any): Promise<any> {
      return publicRequest<any>('/v1/customer/order', {
        method: 'POST',
        body: payload
      })
    },

    async addItems(payload: CreateOrderPayload): Promise<any> {
      return request<any>('/v1/customer/order/items', {
        method: 'POST',
        body: payload
      })
    },

    async getOrder(): Promise<any> {
      return request<any>('/v1/customer/order')
    },

    async getPublicOrder(orgSlug: string, orderToken: string): Promise<any> {
      const encodedOrg = encodeURIComponent(orgSlug.trim().toLowerCase())
      const encodedOrder = encodeURIComponent(orderToken)

      // Table order tracking bersifat PUBLIK — tidak butuh X-Public-Token / session.
      // Endpoint final: GET /v1/customer/orders/{order_number_or_public_token}
      try {
        return await publicRequest<any>(`/v1/customer/orders/${encodedOrder}`)
      } catch (primaryError) {
        try {
          return await publicRequest<any>(`/api/public/orgs/${encodedOrg}/orders/${encodedOrder}`)
        } catch {
          throw primaryError
        }
      }
    },

    /**
     * Public payment status untuk TABLE ORDER (poll/refresh).
     * Endpoint: GET /v1/customer/orders/{order_number_or_public_token}/payment-status
     *
     * PENTING: publik — tidak mengirim X-Public-Token, tidak butuh session/table token.
     * Jangan gunakan endpoint /v1/customer/order/qris-status (itu khusus open bill).
     */
    async getPublicPaymentStatus(orderToken: string): Promise<any> {
      const encodedOrder = encodeURIComponent(orderToken)
      return publicRequest<any>(`/v1/customer/orders/${encodedOrder}/payment-status`)
    },

    async initiateQris(): Promise<any> {
      return request<any>('/v1/customer/order/pay-qris', {
        method: 'POST'
      })
    },

    async checkQrisStatus(): Promise<any> {
      return request<any>('/v1/customer/order/qris-status')
    },

    async cancelQris(): Promise<any> {
      return request<any>('/v1/customer/order/qris-cancel', {
        method: 'DELETE'
      })
    }
  }
}
