export type OrgStatus = 'active' | 'inactive'

export type RestaurantOpenStatus = 'open' | 'closed' | 'unavailable'

export interface BusinessHour {
  day: string
  open: string
  close: string
  is_closed: boolean
}

export interface PublicOrg {
  id: string
  slug: string
  name: string
  description: string
  logo_url: string
  cover_image_url: string
  status: OrgStatus
  open_status: RestaurantOpenStatus
  timezone: string
  address: string
  business_hours: BusinessHour[]
}

export interface PublicOrgResponse {
  org: PublicOrg
}

