export default defineNuxtRouteMiddleware((to) => {
  if (!to.path.endsWith('/orders')) return

  const orderMode = resolveOrderMode(to.query)

  if (orderMode.mode !== 'invalid') return

  return navigateTo({ path: to.path }, { replace: true })
})

