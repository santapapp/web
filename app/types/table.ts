export type TableStatus = 'available' | 'occupied' | 'inactive'

export interface PublicTable {
  token: string
  number: string
  label: string
  status: TableStatus
}

export interface ValidateTableResponse {
  valid: boolean
  table?: PublicTable
  message?: string
}

