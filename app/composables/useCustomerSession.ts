/**
 * useCustomerSession — Composable untuk mengelola Customer Session
 *
 * Flow:
 * 1. User scan QR → URL mengandung ?table={code}&qr={token}
 * 2. Panggil startSession() → dapat session_token
 * 3. Simpan token → digunakan oleh semua API call berikutnya via X-Customer-Session
 */

import { storeToRefs } from 'pinia'
import type { CustomerApiError } from './useCustomerApi'

export const useCustomerSession = () => {
  const api = useCustomerApi()
  const store = useCustomerSessionStore()
  const refs = storeToRefs(store)

  /**
   * Mulai sesi baru setelah scan QR meja.
   * Dipanggil saat ada query param ?table=... & ?qr=... di URL.
   */
  const startSession = async (orgSlug: string, tableCode: string, qrToken: string) => {
    try {
      const response = await api.startSession({
        organization_slug: orgSlug,
        table_code: tableCode,
        qr_token: qrToken
      })

      const data = response.data
      store.setSession({
        session_token: data.order.public_token,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Sesi berlaku 24 jam secara virtual
        organization: {
          id: data.organization.id,
          uuid: String(data.organization.id),
          name: data.organization.name,
          slug: data.organization.slug
        },
        table: {
          id: data.table.id,
          name: data.table.name,
          code: data.table.name
        },
        open_bill: {
          id: data.order.public_token,
          bill_number: data.order.order_number,
          status: 'open',
          total_amount: 0
        }
      })

      return { success: true, data: response }
    } catch (error) {
      return { success: false, error: error as CustomerApiError }
    }
  }

  /**
   * Restore session dari localStorage dan validasi ke server.
   * Dipanggil saat user refresh halaman.
   * Returns true jika sesi masih valid, false jika perlu start ulang.
   */
  const restoreAndValidate = async (): Promise<boolean> => {
    store.restore()

    if (!store.hasSession) return false
    if (store.isExpired) {
      store.clear()
      return false
    }

    // Validasi ke server
    try {
      await api.getCurrentSession()
      return true
    } catch {
      store.clear()
      return false
    }
  }

  /**
   * Restore session dari localStorage tanpa validasi ke server.
   * Lebih cepat — gunakan ini di halaman yang tidak kritis.
   */
  const restoreLocal = (): boolean => {
    store.restore()
    if (!store.hasSession || store.isExpired) {
      store.clear()
      return false
    }
    return true
  }

  const clearSession = () => store.clear()

  return {
    // State refs
    ...refs,

    // Actions
    startSession,
    restoreAndValidate,
    restoreLocal,
    clearSession
  }
}
