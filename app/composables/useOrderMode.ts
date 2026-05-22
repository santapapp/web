import { computed } from 'vue'
import { useRoute } from '#imports'

export type OrderPageMode = 'empty' | 'table_order' | 'order_detail' | 'open_bill' | 'invalid'

export type InvalidOrderModeReason =
  | 'mixed_query'
  | 'bill_open_attempt'
  | 'multiple_query_values'

export interface OrderModeState {
  mode: OrderPageMode
  tableToken?: string
  orderToken?: string
  billToken?: string
  reason?: InvalidOrderModeReason
}

type QueryRecord = Record<string, unknown>

const readQueryValue = (query: QueryRecord, key: string) => {
  const value = query[key]

  if (Array.isArray(value)) {
    const compactValue = value.filter(Boolean)

    if (compactValue.length > 1) {
      return {
        value: String(compactValue[0]),
        hasMultipleValues: true
      }
    }

    return {
      value: compactValue[0] ? String(compactValue[0]) : undefined,
      hasMultipleValues: false
    }
  }

  return {
    value: value ? String(value) : undefined,
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

  if (bill.value === 'open' || bills.value === 'open') {
    return {
      mode: 'invalid',
      reason: 'bill_open_attempt'
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

  if (order.value) {
    return {
      mode: 'order_detail',
      orderToken: order.value
    }
  }

  if (bill.value) {
    return {
      mode: 'open_bill',
      billToken: bill.value
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
    billToken: computed(() => state.value.billToken),
    invalidReason: computed(() => state.value.reason)
  }
}

