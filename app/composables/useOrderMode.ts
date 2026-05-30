import { computed } from 'vue'
import { useRoute } from '#imports'

export type OrderPageMode = 'empty' | 'table_order' | 'open_bill' | 'order_detail' | 'invalid'

export type InvalidOrderModeReason =
  | 'mixed_query'
  | 'unsupported_query'
  | 'multiple_query_values'
  | 'empty_query_value'

export interface OrderModeState {
  mode: OrderPageMode
  tableToken?: string
  billToken?: string
  orderToken?: string
  reason?: InvalidOrderModeReason
}

type QueryRecord = Record<string, unknown>

const readQueryValue = (query: QueryRecord, key: string) => {
  const isPresent = Object.prototype.hasOwnProperty.call(query, key)
  const value = query[key]

  if (Array.isArray(value)) {
    const compactValue = value
      .filter((item): item is string => typeof item === 'string')
      .map((item) => item.trim())
      .filter(Boolean)

    if (compactValue.length > 1) {
      return {
        value: String(compactValue[0]),
        isPresent,
        hasMultipleValues: true
      }
    }

    return {
      value: compactValue[0] ? String(compactValue[0]) : undefined,
      isPresent,
      hasMultipleValues: false
    }
  }

  const normalizedValue = typeof value === 'string' ? value.trim() : undefined

  return {
    value: normalizedValue || undefined,
    isPresent,
    hasMultipleValues: false
  }
}

export const resolveOrderMode = (query: QueryRecord): OrderModeState => {
  const table = readQueryValue(query, 'table')
  const order = readQueryValue(query, 'order')
  const bill = readQueryValue(query, 'bill')
  const bills = readQueryValue(query, 'bills')

  if (table.hasMultipleValues || order.hasMultipleValues || bill.hasMultipleValues || bills.hasMultipleValues) {
    return {
      mode: 'invalid',
      reason: 'multiple_query_values'
    }
  }

  if ((table.isPresent && !table.value) || (order.isPresent && !order.value) || (bill.isPresent && !bill.value)) {
    return {
      mode: 'invalid',
      reason: 'empty_query_value'
    }
  }

  // Treat 'bills' as alias for 'bill' if needed, or block it. We'll block bills if we only want 'bill'
  if (bills.isPresent) {
    return {
      mode: 'invalid',
      reason: 'unsupported_query'
    }
  }

  const activeModes = [table.value, order.value, bill.value].filter(Boolean)

  if (activeModes.length > 1) {
    return {
      mode: 'invalid',
      reason: 'mixed_query'
    }
  }

  if (table.value) {
    return {
      mode: 'table_order',
      tableToken: table.value
    }
  }

  if (bill.value) {
    return {
      mode: 'open_bill',
      billToken: bill.value
    }
  }

  if (order.value) {
    return {
      mode: 'order_detail',
      orderToken: order.value
    }
  }

  return {
    mode: 'empty'
  }
}

export const useOrderMode = () => {
  const route = useRoute()

  const state = computed(() => resolveOrderMode(route.query))

  return {
    state,
    mode: computed(() => state.value.mode),
    tableToken: computed(() => state.value.tableToken),
    billToken: computed(() => state.value.billToken),
    orderToken: computed(() => state.value.orderToken),
    invalidReason: computed(() => state.value.reason)
  }
}
