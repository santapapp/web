import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useCustomerSessionStore } from './customer-session.store'
import { useCustomerApi } from '~/composables/useCustomerApi'

export const useWaiterCallStore = defineStore('waiter-call', () => {
  const api = useCustomerApi()
  const sessionStore = useCustomerSessionStore()

  const waiterCallStatus = ref<'idle' | 'pending' | 'success'>('idle')
  const waiterCallMessage = ref('')
  const cashierCallStatus = ref<'idle' | 'pending' | 'success'>('idle')
  const cashierCallMessage = ref('')

  const hasActiveRequests = computed(() => {
    return waiterCallStatus.value === 'pending' || cashierCallStatus.value === 'pending'
  })

  const callWaiter = () => {
    if (waiterCallStatus.value === 'pending') return

    waiterCallStatus.value = 'pending'
    waiterCallMessage.value = 'Memanggil pelayan ke Meja ' + (sessionStore.tableName || 'Anda')

    // Simulate waiter response
    setTimeout(() => {
      waiterCallStatus.value = 'success'
      waiterCallMessage.value = 'Pelayan telah dikonfirmasi dan sedang menuju meja Anda.'
    }, 2500)
  }

  const callCashier = async () => {
    if (cashierCallStatus.value === 'pending') return { success: true }

    cashierCallStatus.value = 'pending'
    cashierCallMessage.value = 'Menghubungi kasir...'

    try {
      const response = await api.callCashier()
      cashierCallStatus.value = 'success'
      cashierCallMessage.value = response.message || 'Panggilan kasir terkirim.'
      return { success: true }
    } catch (err: any) {
      cashierCallStatus.value = 'idle'
      return { success: false, error: err }
    }
  }

  const resetCalls = () => {
    waiterCallStatus.value = 'idle'
    waiterCallMessage.value = ''
    cashierCallStatus.value = 'idle'
    cashierCallMessage.value = ''
  }

  return {
    waiterCallStatus,
    waiterCallMessage,
    cashierCallStatus,
    cashierCallMessage,
    hasActiveRequests,
    callWaiter,
    callCashier,
    resetCalls
  }
})
