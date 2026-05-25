/**
 * useCustomerMenu — Composable untuk mengambil data menu dari real API
 *
 * Data dikembalikan dalam format terkategori (nested):
 * categories[] → menus[] (langsung dalam category)
 */

import { ref, computed } from 'vue'
import type { CustomerMenuCategory, CustomerMenuItem } from '~/types/customer-menu'
import type { CustomerApiError } from './useCustomerApi'

export const useCustomerMenu = () => {
  const api = useCustomerApi()

  const categories = ref<CustomerMenuCategory[]>([])
  const pending = ref(false)
  const error = ref<CustomerApiError | null>(null)

  /**
   * Flat list semua menu dari semua kategori.
   * Berguna untuk search, cart lookup, dll.
   */
  const allMenus = computed<CustomerMenuItem[]>(() =>
    categories.value.flatMap((cat) => cat.menus)
  )

  /**
   * Menu yang masih tersedia (status = 'active').
   */
  const availableMenus = computed<CustomerMenuItem[]>(() =>
    allMenus.value.filter((menu) => menu.status === 'active')
  )

  /**
   * Ambil data menu dari API.
   * Membutuhkan session token yang sudah tersimpan di localStorage.
   */
  const fetchMenu = async () => {
    pending.value = true
    error.value = null

    try {
      const sessionStore = useCustomerSessionStore()
      const orgId = sessionStore.organization?.id

      if (!orgId) {
        throw new Error('Sesi organisasi tidak ditemukan.')
      }

      const response = await api.getMenu(orgId)
      const rawMenus = response.data || []
      const mappedMenus: CustomerMenuItem[] = rawMenus.map((menu: any) => ({
        id: menu.id,
        name: menu.name,
        slug: menu.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: null,
        price: Number(menu.price),
        sku: null,
        status: menu.is_available ? 'active' : 'out_of_stock',
        sort_order: menu.sort_order ?? 0,
        image_url: null
      }))

      categories.value = [
        {
          id: 1,
          name: 'Semua Menu',
          description: 'Daftar menu lezat pilihan kami',
          sort_order: 1,
          menus: mappedMenus
        }
      ]
    } catch (err) {
      error.value = err as CustomerApiError
    } finally {
      pending.value = false
    }
  }

  /**
   * Cari menu berdasarkan ID.
   */
  const findMenuById = (id: number): CustomerMenuItem | undefined =>
    allMenus.value.find((menu) => menu.id === id)

  return {
    categories,
    allMenus,
    availableMenus,
    pending,
    error,
    fetchMenu,
    findMenuById
  }
}
