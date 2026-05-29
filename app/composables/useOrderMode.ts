import { computed } from 'vue'
import { useRoute } from '#imports'

export type OrderPageMode = 'empty' | 'table_order' | 'order_detail' | 'invalid'

export type InvalidOrderModeReason =
  | 'mixed_query'
  | 'unsupported_query'
  | 'multiple_query_values'
  | 'empty_query_value'

export interface OrderModeState {
  mode: OrderPageMode
  tableToken?: string
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

  if ((table.isPresent && !table.value) || (order.isPresent && !order.value)) {
    return {
      mode: 'invalid',
      reason: 'empty_query_value'
    }
  }

  if (bill.isPresent || bills.isPresent) {
    return {
      mode: 'invalid',
      reason: 'unsupported_query'
    }
  }

  const activeModes = [table.value, order.value].filter(Boolean)

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
    orderToken: computed(() => state.value.orderToken),
    invalidReason: computed(() => state.value.reason)
  }
}
