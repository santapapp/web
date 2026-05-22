import { computed, ref } from 'vue'
import { useRoute } from '#imports'
import type { ApiErrorPayload } from '~/types/api'
import type { MenuCategory, MenuItem } from '~/types/menu'
import type { PublicOrg } from '~/types/org'

export const usePublicOrg = (slug?: string) => {
  const route = useRoute()
  const api = useApi()

  const org = ref<PublicOrg | null>(null)
  const categories = ref<MenuCategory[]>([])
  const items = ref<MenuItem[]>([])
  const pending = ref(false)
  const error = ref<ApiErrorPayload | null>(null)

  const orgSlug = computed(() => slug ?? String(route.params.orgSlug || ''))

  const fetchPublicOrg = async () => {
    if (!orgSlug.value) return

    pending.value = true
    error.value = null

    try {
      const [orgResponse, menuResponse] = await Promise.all([
        api.getPublicOrg(orgSlug.value),
        api.getPublicMenus(orgSlug.value)
      ])

      org.value = orgResponse.org
      categories.value = menuResponse.categories
      items.value = menuResponse.items
    } catch (caughtError) {
      error.value = normalizeApiError(caughtError)
    } finally {
      pending.value = false
    }
  }

  return {
    orgSlug,
    org,
    categories,
    items,
    pending,
    error,
    fetchPublicOrg,
    refresh: fetchPublicOrg
  }
}

