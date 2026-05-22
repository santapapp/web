import { storeToRefs } from 'pinia'

export const useGuestSession = () => {
  const api = useApi()
  const store = useGuestSessionStore()
  const refs = storeToRefs(store)

  const ensureGuestSession = async (
    orgSlug: string,
    context: { tableToken?: string | null; billToken?: string | null } = {}
  ) => {
    store.restore()

    if (!store.hasSession || store.isExpired || store.orgSlug !== orgSlug) {
      const response = await api.createGuestSession({ org_slug: orgSlug })
      store.setSession(response.guest_session)
    }

    store.bindContext({
      orgSlug,
      tableToken: context.tableToken,
      billToken: context.billToken
    })

    return store.id
  }

  return {
    ...refs,
    ensureGuestSession,
    clearGuestSession: store.clear,
    restoreGuestSession: store.restore
  }
}

