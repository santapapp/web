// Types untuk Customer Session API (Real API)
// Endpoint: POST /api/v1/customer/sessions/start
// Endpoint: GET /api/v1/customer/sessions/current

export interface StartSessionPayload {
  organization_slug: string
  table_code: string
  qr_token: string
  client_label?: string
}

export interface CustomerSessionOrg {
  id: number
  uuid: string
  name: string
  slug: string
}

export interface CustomerSessionTable {
  id: number
  name: string
  code: string
}

export interface CustomerSessionOpenBill {
  id: string
  bill_number: string
  status: 'open' | 'locked' | 'closed'
  total_amount: number
}

export interface CustomerSession {
  session_token: string
  expires_at: string
  organization: CustomerSessionOrg
  table: CustomerSessionTable
  open_bill: CustomerSessionOpenBill
}

// Response dari POST /sessions/start
export interface StartSessionResponse extends CustomerSession {}

// Response dari GET /sessions/current
export interface CurrentSessionResponse {
  data: {
    id: string
    session_token: string
    client_label: string | null
    status: 'active' | 'expired'
    expires_at: string
    table: CustomerSessionTable
    open_bill: CustomerSessionOpenBill
  }
}
