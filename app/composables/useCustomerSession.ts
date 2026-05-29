import { storeToRefs } from 'pinia'
import type {
  CustomerSessionOrg,
  CustomerSessionTable,
  StoredSessionOpenBill
} from '~/types/customer-session'
import type { CustomerApiError } from './useCustomerApi'

type StartSessionOptions = {
  orgSlug?: string
}

type NormalizedSession = {
  session_token: string
  expires_at: string
  organization: CustomerSessionOrg
  table: CustomerSessionTable
  open_bill: StoredSessionOpenBill
}

const DEFAULT_SESSION_HOURS = 24

const normalizeSlug = (value?: string | null) =>
  String(value || '').trim().toLowerCase()

const isObject = (value: unknown): value is Record<string, any> =>
  typeof value === 'object' && value !== null

const unwrapData = (response: any) => {
  if (!isObject(response)) return response

  const data = response.data
  if (isObject(data)) return data

  return response
}

const fallbackExpiresAt = () =>
  new Date(Date.now() + DEFAULT_SESSION_HOURS * 60 * 60 * 1000).toISOString()

const isValidTokenFormat = (token: string): boolean => {
  if (token.length > 512) return false
  return /^[a-zA-Z0-9._~:=+-]+$/.test(token)
}

export const extractQrToken = (rawInput: string): string | null => {
  const trimmed = rawInput.trim()
  if (!trimmed) return null

  try {
    const url = new URL(trimmed)

    for (const key of ['table', 'qr', 'token', 'session']) {
      const value = url.searchParams.get(key)
      if (value?.trim()) return value.trim()
    }

    if (url.searchParams.has('order') || url.searchParams.has('bill') || url.searchParams.has('bills')) {
      return null
    }
  } catch {
    // Not a URL, continue with supported compact formats.
  }

  const pipeParts = trimmed.split('|')
  if (pipeParts.length === 2 && pipeParts[0]?.trim() && pipeParts[1]?.trim()) {
    return pipeParts[1].trim()
  }

  return trimmed
}

const normalizeBillStatus = (status: unknown): StoredSessionOpenBill['status'] => {
  const value = String(status || '').toLowerCase()
  if (value === 'locked') return 'locked'
  if (['closed', 'cancelled', 'paid', 'expired'].includes(value)) return 'closed'
  return 'open'
}

const normalizeOrg = (raw: any): CustomerSessionOrg | null => {
  if (!isObject(raw) || raw.id === undefined || !raw.name || !raw.slug) return null

  return {
    id: Number(raw.id),
    uuid: raw.uuid ? String(raw.uuid) : String(raw.id),
    name: String(raw.name),
    slug: String(raw.slug)
  }
}

const normalizeTable = (raw: any): CustomerSessionTable | null => {
  if (!isObject(raw) || raw.id === undefined) return null

  const name = raw.name ?? raw.label ?? raw.code
  const code = raw.code ?? raw.table_code ?? raw.token ?? raw.name
  if (!name || !code) return null

  return {
    id: Number(raw.id),
    name: String(name),
    code: String(code),
    location: raw.location ?? null
  }
}

const normalizeSessionResponse = (response: any): NormalizedSession | null => {
  const root = unwrapData(response)
  if (!isObject(root)) return null

  const order = root.order ?? root.open_bill ?? root.bill ?? root.active_order
  const organization = normalizeOrg(root.organization ?? root.org ?? order?.organization)
  const table = normalizeTable(root.table ?? root.dining_table ?? order?.dining_table ?? order?.table)

  const sessionToken =
    root.session_token ??
    root.sessionToken ??
    root.public_token ??
    root.token ??
    order?.public_token ??
    order?.session_token

  if (!sessionToken || !organization || !table) return null

  const billSource = root.open_bill ?? root.bill ?? order ?? {}

  return {
    session_token: String(sessionToken),
    expires_at: String(root.expires_at ?? root.expiresAt ?? order?.expires_at ?? fallbackExpiresAt()),
    organization,
    table,
    open_bill: {
      id: String(billSource.id ?? billSource.public_token ?? sessionToken),
      bill_number: String(billSource.bill_number ?? billSource.order_number ?? billSource.number ?? '-'),
      status: normalizeBillStatus(billSource.status ?? billSource.bill_status),
      total_amount: Number(billSource.total_amount ?? billSource.total ?? 0)
    }
  }
}

const syncValidationResponse = (response: any) => {
  const store = useCustomerSessionStore()
  const normalized = normalizeSessionResponse(response)

  if (normalized) {
    store.setSession(normalized)
    return normalized.organization.slug
  }

  const root = unwrapData(response)
  if (!isObject(root)) return null

  const order = root.order ?? root.open_bill ?? root.bill ?? root
  const organization = normalizeOrg(root.organization ?? root.org ?? order?.organization)
  const table = normalizeTable(root.table ?? root.dining_table ?? order?.dining_table ?? order?.table)

  if (organization) store.organization = organization
  if (table) store.table = table
  if (root.expires_at || root.expiresAt) {
    store.expiresAt = String(root.expires_at ?? root.expiresAt)
  }

  if (isObject(order) && (order.order_number || order.bill_number || order.public_token)) {
    store.setOpenBill({
      id: String(order.id ?? order.public_token ?? store.sessionToken ?? ''),
      bill_number: String(order.bill_number ?? order.order_number ?? '-'),
      status: normalizeBillStatus(order.status ?? order.bill_status),
      total_amount: Number(order.total_amount ?? order.total ?? 0)
    })
  }

  return organization?.slug ?? null
}

export const useCustomerSession = () => {
  const api = useCustomerApi()
  const store = useCustomerSessionStore()
  const refs = storeToRefs(store)

  const startSession = async (qrToken: string, options: StartSessionOptions = {}) => {
    try {
      const response = await api.scanTable(qrToken)
      const normalized = normalizeSessionResponse(response)

      if (!normalized) {
        store.clear()
        return {
          success: false,
          error: {
            message: 'Response session tidak valid.',
            statusCode: 502
          } satisfies CustomerApiError
        }
      }

      if (
        options.orgSlug &&
        normalizeSlug(normalized.organization.slug) !== normalizeSlug(options.orgSlug)
      ) {
        store.clear()
        return {
          success: false,
          correctSlug: normalized.organization.slug,
          error: {
            message: 'Kode meja tidak cocok dengan outlet ini.',
            statusCode: 403
          } satisfies CustomerApiError
        }
      }

      store.setSession(normalized)
      return { success: true, data: response }
    } catch (error) {
      return { success: false, error: error as CustomerApiError }
    }
  }

  const startSessionFromToken = async (
    rawInput: string,
    options: StartSessionOptions | string = {}
  ): Promise<{ success: boolean; error?: string; correctSlug?: string }> => {
    const expectedOrgSlug = typeof options === 'string' ? options : options.orgSlug
    const trimmed = rawInput.trim()

    if (!trimmed) {
      return { success: false, error: 'Masukkan kode meja terlebih dahulu.' }
    }

    const extracted = extractQrToken(trimmed)
    if (!extracted || !isValidTokenFormat(extracted)) {
      return { success: false, error: 'Format kode meja tidak valid.' }
    }

    const result = await startSession(extracted, { orgSlug: expectedOrgSlug })
    if (!result.success) {
      store.clear()

      const error = result.error as CustomerApiError
      if (error?.statusCode === 403) {
        return {
          success: false,
          correctSlug: (result as any).correctSlug,
          error: 'Kode meja tidak cocok dengan outlet ini.'
        }
      }

      if (error?.statusCode === 404 || error?.statusCode === 400) {
        return { success: false, error: 'Kode meja tidak valid atau sudah tidak tersedia.' }
      }

      return { success: false, error: 'Gagal memulai session. Coba lagi sebentar.' }
    }

    return { success: true }
  }

  const restoreAndValidate = async (): Promise<boolean> => {
    store.restore()

    if (!store.hasSession || store.isExpired) {
      store.clear()
      return false
    }

    try {
      const response = await api.validateSession()
      syncValidationResponse(response)
      return true
    } catch {
      store.clear()
      return false
    }
  }

  const restoreAndValidateForOrg = async (orgSlug: string): Promise<boolean> => {
    store.restore()

    if (!store.hasSession || store.isExpired || !store.organization?.slug) {
      store.clear()
      return false
    }

    if (normalizeSlug(store.organization.slug) !== normalizeSlug(orgSlug)) {
      store.clear()
      return false
    }

    try {
      const response = await api.validateSession()
      const backendOrgSlug = syncValidationResponse(response)

      if (backendOrgSlug && normalizeSlug(backendOrgSlug) !== normalizeSlug(orgSlug)) {
        store.clear()
        return false
      }

      return true
    } catch {
      store.clear()
      return false
    }
  }

  const restoreLocal = (): boolean => {
    store.restore()
    if (!store.hasSession || store.isExpired) {
      store.clear()
      return false
    }
    return true
  }

  const clearSession = () => store.clear()

  /**
   * Mode sesi saat ini: 'table' untuk table_order, 'open_bill' untuk open bill.
   * null jika tidak ada sesi aktif.
   */
  const sessionMode = computed<'table' | 'open_bill' | null>(() => {
    if (!store.hasSession) return null
    // open_bill ditandai dengan adanya bill_number yang bukan '-'
    if (store.openBill?.bill_number && store.openBill.bill_number !== '-') {
      // Cek apakah ini benar-benar open bill mode berdasarkan bill_number format
      return 'open_bill'
    }
    return 'table'
  })

  /**
   * Label singkat untuk sesi aktif:
   * - table mode: nama/kode meja
   * - open_bill mode: nomor bill
   */
  const sessionLabel = computed<string | null>(() => {
    if (!store.hasSession) return null
    if (sessionMode.value === 'open_bill') {
      return store.openBill?.bill_number ?? null
    }
    return store.table?.name ?? store.table?.code ?? null
  })

  /**
   * true jika cart saat ini memiliki item (table_order atau open_bill).
   * Digunakan untuk menampilkan warning saat customer ingin keluar sesi.
   * SSR-safe: cart store hanya diakses di client.
   */
  const hasCart = computed<boolean>(() => {
    if (!import.meta.client) return false
    try {
      const cartStore = useCartStore()
      const tableItems = cartStore.items('table_order')
      const billItems = cartStore.items('open_bill')
      return tableItems.length > 0 || billItems.length > 0
    } catch {
      return false
    }
  })

  return {
    ...refs,
    startSession,
    startSessionFromToken,
    restoreAndValidate,
    restoreAndValidateForOrg,
    restoreLocal,
    clearSession,
    sessionMode,
    sessionLabel,
    hasCart
  }
}
