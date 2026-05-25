/**
 * validate-order-query middleware
 *
 * Validasi halaman /orders hanya bisa diakses jika ada query param yang valid:
 * - ?table={tableCode}&qr={qrToken}   → start session via QR
 *
 * Tanpa query param apapun masih diizinkan (tampil pesan "scan QR dulu").
 */
export default defineNuxtRouteMiddleware((to) => {
  if (!to.path.endsWith('/orders')) return

  const { table, qr, bill, order } = to.query

  // Jika ada konflik query params (mixed mode), redirect ke path bersih
  const hasTable = Boolean(table)
  const hasBill = Boolean(bill)
  const hasOrder = Boolean(order)

  const activeModes = [hasTable, hasBill, hasOrder].filter(Boolean).length

  if (activeModes > 1) {
    return navigateTo({ path: to.path }, { replace: true })
  }

  // Jika ada table tapi tidak ada qr token, itu oke — akan ditangani di page
})
