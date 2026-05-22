export default defineNuxtRouteMiddleware(async (to) => {
  const orgSlug = String(to.params.orgSlug || '')

  if (!orgSlug) return

  const api = useApi()

  try {
    await api.getPublicOrg(orgSlug)
  } catch (error) {
    const apiError = normalizeApiError(error)

    throw createError({
      statusCode: apiError.statusCode,
      statusMessage: apiError.message,
      fatal: true
    })
  }
})
