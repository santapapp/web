/**
 * org-exists middleware
 *
 * Dengan real API, org divalidasi melalui session saat start session.
 * Middleware ini hanya memastikan orgSlug ada di route params.
 * Validasi org yang sebenarnya dilakukan saat startSession() atau getCurrentSession().
 */
export default defineNuxtRouteMiddleware((to) => {
  const orgSlug = String(to.params.orgSlug || '')

  if (!orgSlug) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Halaman tidak ditemukan.',
      fatal: true
    })
  }
})
