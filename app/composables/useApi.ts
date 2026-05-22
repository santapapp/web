import { useRuntimeConfig } from '#imports'
import { isMockApiError, mockSantapApi } from '~/mocks/santapApi'
import type { AddBillOrderPayload, AddBillOrderResponse, BillDetailResponse } from '~/types/bill'
import type { ApiErrorPayload, GuestSessionResponse } from '~/types/api'
import type { CreateTableOrderPayload, CreateTableOrderResponse, OrderDetailResponse } from '~/types/order'
import type { PaymentDetailResponse, PayOrderResponse } from '~/types/payment'
import type { PublicMenuResponse } from '~/types/menu'
import type { PublicOrgResponse } from '~/types/org'
import type { ValidateTableResponse } from '~/types/table'

type FetchOptions = {
  method?: 'GET' | 'POST'
  body?: unknown
  query?: Record<string, string>
}

const trimSlash = (value: string) => value.replace(/\/$/, '')

export const normalizeApiError = (error: unknown): ApiErrorPayload => {
  if (isMockApiError(error)) {
    return {
      code: error.code as ApiErrorPayload['code'],
      message: error.message,
      statusCode: error.statusCode
    }
  }

  if (typeof error === 'object' && error !== null) {
    const record = error as {
      data?: Partial<ApiErrorPayload>
      statusCode?: number
      status?: number
      statusMessage?: string
      message?: string
    }

    return {
      code: record.data?.code ?? 'unknown_error',
      message: record.data?.message ?? record.statusMessage ?? record.message ?? 'Terjadi kesalahan.',
      statusCode: record.statusCode ?? record.status ?? 500,
      details: record.data?.details
    }
  }

  return {
    code: 'unknown_error',
    message: 'Terjadi kesalahan.',
    statusCode: 500
  }
}

export const useApi = () => {
  const config = useRuntimeConfig()
  const apiBaseUrl = trimSlash(String(config.public.apiBaseUrl || ''))
  const mockFlag = config.public.useMockApi
  const useMockApi = mockFlag === true || String(mockFlag) === 'true' || !apiBaseUrl

  const request = async <T>(path: string, options: FetchOptions = {}) => {
    try {
      return await $fetch<T>(`${apiBaseUrl}${path}`, {
        method: options.method ?? 'GET',
        body: options.body as BodyInit | Record<string, any> | null | undefined,
        query: options.query
      })
    } catch (error) {
      throw normalizeApiError(error)
    }
  }

  return {
    apiBaseUrl,
    useMockApi,

    async getPublicOrg(orgSlug: string) {
      if (useMockApi) return mockSantapApi.getPublicOrg(orgSlug)
      return request<PublicOrgResponse>(`/api/public/orgs/${encodeURIComponent(orgSlug)}`)
    },

    async getPublicMenus(orgSlug: string) {
      if (useMockApi) return mockSantapApi.getPublicMenus(orgSlug)
      return request<PublicMenuResponse>(`/api/public/orgs/${encodeURIComponent(orgSlug)}/menus`)
    },

    async createGuestSession(payload?: { org_slug?: string }): Promise<GuestSessionResponse> {
      if (useMockApi) return mockSantapApi.createGuestSession(payload)
      return request<GuestSessionResponse>('/api/public/guest-sessions', {
        method: 'POST',
        body: payload
      })
    },

    async validateTable(orgSlug: string, tableToken: string) {
      if (useMockApi) return mockSantapApi.validateTable(orgSlug, tableToken)
      return request<ValidateTableResponse>(`/api/public/orgs/${encodeURIComponent(orgSlug)}/tables/validate`, {
        query: { table: tableToken }
      })
    },

    async createTableOrder(orgSlug: string, payload: CreateTableOrderPayload) {
      if (useMockApi) return mockSantapApi.createTableOrder(orgSlug, payload)
      return request<CreateTableOrderResponse>(`/api/public/orgs/${encodeURIComponent(orgSlug)}/orders`, {
        method: 'POST',
        body: payload
      })
    },

    async getOrderDetail(orgSlug: string, orderToken: string) {
      if (useMockApi) return mockSantapApi.getOrderDetail(orgSlug, orderToken)
      return request<OrderDetailResponse>(
        `/api/public/orgs/${encodeURIComponent(orgSlug)}/orders/${encodeURIComponent(orderToken)}`
      )
    },

    async getPaymentDetail(orgSlug: string, orderToken: string) {
      if (useMockApi) return mockSantapApi.getPaymentDetail(orgSlug, orderToken)
      return request<PaymentDetailResponse>(
        `/api/public/orgs/${encodeURIComponent(orgSlug)}/payments/order/${encodeURIComponent(orderToken)}`
      )
    },

    async payOrder(orgSlug: string, orderToken: string) {
      if (useMockApi) return mockSantapApi.payOrder(orgSlug, orderToken)
      return request<PayOrderResponse>(
        `/api/public/orgs/${encodeURIComponent(orgSlug)}/payments/order/${encodeURIComponent(orderToken)}/pay`,
        { method: 'POST' }
      )
    },

    async getBillDetail(orgSlug: string, billToken: string) {
      if (useMockApi) return mockSantapApi.getBillDetail(orgSlug, billToken)
      return request<BillDetailResponse>(
        `/api/public/orgs/${encodeURIComponent(orgSlug)}/bills/${encodeURIComponent(billToken)}`
      )
    },

    async addOrderToBill(orgSlug: string, billToken: string, payload: AddBillOrderPayload) {
      if (useMockApi) return mockSantapApi.addOrderToBill(orgSlug, billToken, payload)
      return request<AddBillOrderResponse>(
        `/api/public/orgs/${encodeURIComponent(orgSlug)}/bills/${encodeURIComponent(billToken)}/orders`,
        {
          method: 'POST',
          body: payload
        }
      )
    }
  }
}
