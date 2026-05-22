export type ApiErrorCode =
  | 'not_found'
  | 'invalid_org'
  | 'inactive_org'
  | 'invalid_table_token'
  | 'invalid_order_token'
  | 'invalid_bill_token'
  | 'invalid_query'
  | 'bill_open_attempt'
  | 'validation_error'
  | 'payment_error'
  | 'unknown_error'

export interface ApiErrorPayload {
  code: ApiErrorCode
  message: string
  statusCode: number
  details?: Record<string, unknown>
}

export interface GuestSession {
  id: string
  token: string
  org_slug?: string
  expires_at: string
}

export interface GuestSessionResponse {
  guest_session: GuestSession
}

export interface ApiListResponse<T> {
  data: T[]
}

export interface ApiSuccessResponse {
  message: string
}

