export interface PublicOrg {
  id: number
  name: string
  slug: string
  is_active: boolean
  logo: string | null
  banner: string | null
  phone: string | null
  email: string | null
  address: string | null
  city: string | null
  province: string | null
  timezone: string | null
  currency: string
  tax_enabled: boolean
  tax_rate: number
  service_charge_enabled: boolean
  service_charge_rate: number
  opening_hours: Record<string, any> | null
  description?: string | null
}

export interface OpeningStatus {
  open: boolean
  label: string
  color: 'green' | 'red' | 'neutral'
}

export interface PublicOrgResponse {
  data: PublicOrg
}
