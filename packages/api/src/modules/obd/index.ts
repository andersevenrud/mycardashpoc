import { PrometheusDriver } from 'prometheus-query'
import { random } from 'lodash'
import { wrapped } from '../../utils'
import type { Module } from '../../types'

/**
 * OBD Module
 */
export default {
  name: 'obd',
  async register({ config, router, send, subscribe }) {
    const prom = new PrometheusDriver({
      ...config.prometheus,
    })

    const unsubscribe = subscribe((data) => {
      console.debug('TODO', 'obd subscription', data)
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
    }
  },
} as Module
