import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

let echoInstance: Echo<any> | null = null

export const useEcho = () => {
  const config = useRuntimeConfig()

  const initEcho = (publicToken: string) => {
    if (import.meta.server) return null

    // Clean up existing instance before recreating to avoid memory leaks or duplicate connections
    if (echoInstance) {
      echoInstance.disconnect()
    }

    if (typeof window !== 'undefined') {
      ;(window as any).Pusher = Pusher
    }

    const appKey = config.public.reverbAppKey
    const host = config.public.reverbHost || window.location.hostname
    const portStr = config.public.reverbPort
    const scheme = config.public.reverbScheme || 'https'

    const isHttps = scheme === 'https' || window.location.protocol === 'https:'
    const forceTLS = isHttps

    // Determine the port based on Reverb configuration or scheme defaults
    const port = portStr ? Number(portStr) : (isHttps ? 443 : 8080)

    echoInstance = new Echo({
      broadcaster: 'reverb',
      key: appKey,
      wsHost: host,
      wsPort: port,
      wssPort: port,
      forceTLS,
      enabledTransports: ['ws', 'wss'],
      authEndpoint: `${config.public.apiBaseUrl}/broadcasting/auth`,
      auth: {
        headers: {
          'X-Public-Token': publicToken
        }
      }
    })

    return echoInstance
  }

  const getEcho = () => echoInstance

  const disconnectEcho = () => {
    if (echoInstance) {
      echoInstance.disconnect()
      echoInstance = null
    }
  }

  return {
    initEcho,
    getEcho,
    disconnectEcho
  }
}
