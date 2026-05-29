export default defineNuxtRouteMiddleware((to) => {
  if (!to.path.endsWith('/orders')) return

  const hasQuery = (key: string) => Object.prototype.hasOwnProperty.call(to.query, key)
  const readQuery = (key: string) => {
    const value = to.query[key]

    if (Array.isArray(value)) {
      const compactValue = value
        .filter((item): item is string => typeof item === 'string')
        .map((item) => item.trim())
        .filter(Boolean)

      return {
        isPresent: hasQuery(key),
        hasValue: compactValue.length > 0,
        hasMultipleValues: compactValue.length > 1
      }
    }

    return {
      isPresent: hasQuery(key),
      hasValue: typeof value === 'string' && value.trim().length > 0,
      hasMultipleValues: false
    }
  }

  const table = readQuery('table')
  const order = readQuery('order')
  const bill = readQuery('bill')
  const bills = readQuery('bills')

  const hasMultipleValues = [table, order, bill, bills].some((value) => value.hasMultipleValues)
  const hasUnsupportedBillQuery = bill.isPresent || bills.isPresent
  const hasEmptyAllowedQuery =
    (table.isPresent && !table.hasValue) || (order.isPresent && !order.hasValue)
  const hasMixedAllowedQuery = [table.hasValue, order.hasValue].filter(Boolean).length > 1

  if (hasMultipleValues || hasUnsupportedBillQuery || hasEmptyAllowedQuery || hasMixedAllowedQuery) {
    return navigateTo({ path: to.path }, { replace: true })
  }
})
