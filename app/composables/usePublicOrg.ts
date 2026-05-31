import type { MaybeRefOrGetter } from 'vue'
import { computed, onMounted, ref, toValue } from 'vue'
import type { OpeningStatus, PublicOrg } from '~/types/org'

type OpeningDay = {
  is_open?: boolean
  open?: string
  close?: string
}

const readTimeInMinutes = (value?: string): number | null => {
  if (!value || typeof value !== 'string') return null

  const parts = value.split(':').map(Number)
  const hour = parts[0]
  const minute = parts[1]

  if (hour === undefined || minute === undefined) return null
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null

  return hour * 60 + minute
}

const resolveOpeningStatus = (org: PublicOrg | null): OpeningStatus | null => {
  const openingHours = org?.opening_hours
  if (!org || !openingHours || Array.isArray(openingHours)) return null

  try {
    const now = new Date()
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: org.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })

    const parts = formatter.formatToParts(now)
    const dayName = parts.find((part) => part.type === 'weekday')?.value.toLowerCase()
    const hour = Number(parts.find((part) => part.type === 'hour')?.value ?? 0)
    const minute = Number(parts.find((part) => part.type === 'minute')?.value ?? 0)
    const currentMinutes = hour * 60 + minute

    if (!dayName || !(dayName in openingHours)) return null

    const day = openingHours[dayName] as OpeningDay | null
    if (!day || typeof day !== 'object') return null

    if (day.is_open === false) {
      return { open: false, label: 'Tutup hari ini', color: 'red' }
    }

    const openMinutes = readTimeInMinutes(day.open)
    const closeMinutes = readTimeInMinutes(day.close)
    if (openMinutes === null || closeMinutes === null) return null

    const isOpen = currentMinutes >= openMinutes && currentMinutes < closeMinutes

    return {
      open: isOpen,
      label: isOpen ? `Buka sampai ${day.close}` : `Tutup, buka ${day.open}`,
      color: isOpen ? 'green' : 'red'
    }
  } catch {
    return null
  }
}

export const formatOrgAddress = (org: PublicOrg | null) =>
  [org?.address, org?.city, org?.province].filter(Boolean).join(', ')

export const usePublicOrg = (orgSlug: MaybeRefOrGetter<string>) => {
  const api = useCustomerApi()
  const normalizedSlug = computed(() => String(toValue(orgSlug) || '').trim())

  const {
    data: org,
    error,
    refresh,
    status
  } = useAsyncData<PublicOrg | null>(
    () => `public-org-${normalizedSlug.value}`,
    async () => {
      if (!normalizedSlug.value) return null

      const response = await api.getOrganization(normalizedSlug.value)

      return response.data ?? (response as unknown as PublicOrg)
    },
    {
      watch: [normalizedSlug]
    }
  )

  const openingStatus = computed(() => resolveOpeningStatus(org.value ?? null))
  const fullAddress = computed(() => formatOrgAddress(org.value ?? null))
  const isLoading = computed(() => status.value === 'pending' || status.value === 'idle')
  const isNotFound = computed(() => Boolean(error.value) || (status.value === 'success' && !org.value))

  // Table order BUKAN session — landing tidak boleh menawarkan "lanjutkan sesi meja".
  // Sebagai gantinya, kita hanya menandai apakah ada RIWAYAT pesanan tersimpan untuk org ini.
  const hasOrderHistory = ref(false)

  onMounted(() => {
    if (!normalizedSlug.value) return
    const history = useOrderHistory(normalizedSlug.value)
    hasOrderHistory.value = history.items.value.length > 0
  })

  return {
    org,
    openingStatus,
    fullAddress,
    hasOrderHistory,
    isLoading,
    isNotFound,
    error,
    refresh
  }
}
