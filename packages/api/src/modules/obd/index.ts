import OBDReader from 'obd2-over-serial'
import { random } from 'lodash'
import { wrapped } from '../../utils'
import type { Module } from '../../types'

/**
 * OBD Module
 */
export default {
  name: 'obd',
  async register({ config, router, send, subscribe }) {
    const reader = new OBDReader('/dev/rfcomm0', {})

    const unsubscribe = subscribe((data) => {
      console.debug('TODO', 'obd subscription', data)
    })

    reader.on(
      'dataReceived',
      (data: Record<string, string | number | boolean>) => {
        send('data', data)
      }
    )

    reader.on('connected', () => {
      send('connected')

      config.obd.pollers.forEach((poller) => {
        reader.addPoller(poller)
      })

      reader.startPolling(config.obd.pollFreq)
    })

    router.post(
      '/metrics',
      wrapped(async ({ res }) => {
        res.json([])
      })
    )

    router.post(
      '/codes/read',
      wrapped(async ({ res }) => {
        res.json([])
      })
    )

    router.post(
      '/codes/clear',
      wrapped(async ({ res }) => {
        res.json(true)
      })
    )

    reader.connect()

    // FIXME: This is just for debug purposes
    const interval = setInterval(() => {
      send('data', {
        speed: random(60, 65),
        rpm: random(4000, 4100),
      })
    }, 1000)

    return async () => {
      clearInterval(interval)
      unsubscribe()
      reader.removeAllPollers()
      reader.disconnect()
    }
  },
} as Module
