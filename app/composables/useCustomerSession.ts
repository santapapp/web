import { storeToRefs } from 'pinia'
import type {
  CustomerSessionOrg,
  CustomerSessionTable,
  StoredSessionOpenBill,
  NormalizedSession
} from '~/types/customer-session'
import type { CustomerApiError } from './useCustomerApi'

type StartSessionOptions = {
  orgSlug?: string
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
  if (['closed', 'cancelled', 'failed', 'paid', 'expired'].includes(value)) return 'closed'
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

/**
 * Normalisasi response dari backend menjadi NormalizedSession.
 *
 * ATURAN PENTING:
 * - sessionType = 'table_order' jika response hanya punya field 'order' (dari scan QR meja)
 * - sessionType = 'open_bill' HANYA jika response punya field 'open_bill' atau 'bill' secara eksplisit
 *
 * Jangan pernah menetapkan sessionType 'open_bill' berdasarkan:
 * - keberadaan order_number
 * - keberadaan public_token
 * - keberadaan active order
 * - input manual nomor meja
 */
const normalizeSessionResponse = (response: any, fallbackToken?: string): NormalizedSession | null => {
  const root = unwrapData(response)
  if (!isObject(root)) return null

  // open bill HANYA dari key eksplisit 'open_bill' atau 'bill'
  const openBillData = root.open_bill ?? root.bill ?? null

  const organization = normalizeOrg(
    root.organization ?? root.org ?? openBillData?.organization
  )
  const table = normalizeTable(
    root.table ?? root.dining_table ?? openBillData?.dining_table
  )

  if (!organization || !table) return null

  // sessionType ditentukan HANYA dari response — tidak ada heuristik frontend
  const sessionType: NormalizedSession['session_type'] = openBillData
    ? 'open_bill'
    : 'table_order'

  // session token fallback:
  // 1. root.session_token / root.public_token / root.token
  // 2. openBillData?.public_token
  // 3. qrToken (dikirim via arg fallbackToken)
  // JANGAN ambil dari root.order karena kita tidak membuat order di awal
  const sessionToken =
    root.session_token ??
    root.sessionToken ??
    root.public_token ??
    root.token ??
    openBillData?.public_token ??
    fallbackToken

  if (!sessionToken) return null

  // open_bill: null untuk table order, objek untuk open bill session
  const normalizedOpenBill: StoredSessionOpenBill | null = openBillData
    ? {
        id: String(openBillData.id ?? openBillData.public_token ?? sessionToken),
        bill_number: String(openBillData.bill_number ?? openBillData.order_number ?? openBillData.number ?? '-'),
        status: normalizeBillStatus(openBillData.status ?? openBillData.bill_status),
        total_amount: Number(openBillData.total_amount ?? openBillData.total ?? 0)
      }
    : null

  return {
    session_token: String(sessionToken),
    expires_at: String(root.expires_at ?? root.expiresAt ?? fallbackExpiresAt()),
    organization,
    table,
    session_type: sessionType,
    open_bill: normalizedOpenBill
  }
}

/**
 * Sync response dari GET /v1/customer/order ke session store.
 *
 * Response ini adalah OrderDetailResource yang mengandung order_type.
 * order_type adalah sumber kebenaran untuk menentukan tipe session:
 * - 'table_order' → session table biasa, jangan isi openBill
 * - 'open_bill'   → update openBill di store
 */
const syncValidationResponse = (response: any) => {
  const store = useCustomerSessionStore()
  const root = unwrapData(response)
  if (!isObject(root)) return null

  const organization = normalizeOrg(root.organization ?? root.org ?? root.dining_table?.organization)
  const table = normalizeTable(root.dining_table ?? root.table)

  if (organization) store.organization = organization
  if (table) store.table = table
  if (root.expires_at || root.expiresAt) {
    store.expiresAt = String(root.expires_at ?? root.expiresAt)
  }

  // Gunakan order_type dari backend sebagai penentu tipe session
  const orderType = String(root.order_type ?? root.type ?? 'table_order')
  const isOpenBill = orderType === 'open_bill'

  if (isOpenBill) {
    store.sessionType = 'open_bill'
    // Update openBill hanya untuk open bill session
    if (root.order_number || root.public_token) {
      store.setOpenBill({
        id: String(root.id ?? root.public_token ?? store.sessionToken ?? ''),
        bill_number: String(root.order_number ?? root.bill_number ?? '-'),
        status: normalizeBillStatus(root.bill_status),
        total_amount: Number(root.total_amount ?? root.total ?? 0)
      })
    }
  } else {
    // Table order → pastikan sessionType benar
    // Jangan ubah openBill (tetap null untuk table order)
    if (!store.sessionType) {
      store.sessionType = 'table_order'
    } else if (store.sessionType !== 'table_order') {
      // Koreksi jika sessionType sebelumnya salah
      store.sessionType = 'table_order'
      store.openBill = null
    }
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
      const normalized = normalizeSessionResponse(response, qrToken)

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

  const startSessionForOpenBill = async (billToken: string, options: StartSessionOptions = {}) => {
    // Inject token to localStorage manually so validateSession can use it
    store.sessionToken = billToken
    store.sessionType = 'open_bill'
    store.persist()

    try {
      const response = await api.validateSession()
      const root = unwrapData(response)
      
      if (!isObject(root) || (root.order_type !== 'open_bill' && root.type !== 'open_bill')) {
         store.clear()
         return {
           success: false,
           error: 'Token bukan merupakan Open Bill yang valid.'
         }
      }

      if (
        options.orgSlug &&
        root.dining_table?.organization?.slug &&
        normalizeSlug(root.dining_table.organization.slug) !== normalizeSlug(options.orgSlug)
      ) {
        store.clear()
        return {
          success: false,
          correctSlug: root.dining_table.organization.slug,
          error: 'Bill tidak cocok dengan outlet ini.'
        }
      }

      syncValidationResponse(response)
      return { success: true, data: response }
    } catch (error) {
      store.clear()
      const apiErr = error as CustomerApiError
      if (apiErr?.statusCode === 404 || apiErr?.statusCode === 401) {
          return { success: false, error: 'Bill tidak valid atau sudah kedaluwarsa.' }
      }
      return { success: false, error: 'Gagal memuat Open Bill.' }
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

    // Untuk table_order, session bersifat lokal, tidak perlu divalidasi ke backend.
    if (store.sessionType === 'table_order') {
      return true
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

    // Untuk table_order, session bersifat lokal, tidak perlu divalidasi ke backend.
    if (store.sessionType === 'table_order') {
      return true
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
   * Mode sesi saat ini.
   *
   * Ditentukan HANYA dari store.sessionType yang di-set dari response backend.
   * Tidak ada heuristik — tidak ada pengecekan bill_number atau openBill.
   *
   * - 'table': table order biasa (scan QR meja / input manual)
   * - 'open_bill': open bill dari kasir
   * - null: tidak ada session aktif
   */
  const sessionMode = computed<'table' | 'open_bill' | 'tracking_order' | null>(() => {
    if (!store.hasSession) return null
    if (store.sessionType === 'open_bill') return 'open_bill'
    if (store.sessionType === 'tracking_order') return 'tracking_order'
    if (store.sessionType === 'table_order') return 'table'
    // Fallback: ada session tapi sessionType belum di-set (data lama dari localStorage)
    // Default ke 'table' karena table order jauh lebih umum
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
    startSessionForOpenBill,
    restoreAndValidate,
    restoreAndValidateForOrg,
    restoreLocal,
    clearSession,
    sessionMode,
    sessionLabel,
    hasCart
  }
}
