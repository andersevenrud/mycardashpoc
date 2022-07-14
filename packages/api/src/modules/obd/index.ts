import { PrometheusDriver } from 'prometheus-query'
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
      wrapped(async ({ req, res }) => {
        const { startsAt, endsAt, name, step } = req.body
        const q = `${name}{job="obd"}`
        const start = new Date(startsAt)
        const end = new Date(endsAt)
        const { result } = await prom.rangeQuery(q, start, end, step)
        res.json(result)
      })
    )

    // TODO: Implement
    router.post(
      '/codes/read',
      wrapped(async ({ res }) => {
        res.json([])
      })
    )

    // TODO: Implement
    router.post(
      '/codes/clear',
      wrapped(async ({ res }) => {
        res.json(true)
      })
    )

    // TODO: Find a way to stream the changes instead
    const interval = setInterval(async () => {
      try {
        const {
          result: [speed],
        } = await prom.instantQuery('obd_speed{job="obd"}')

        const {
          result: [rpm],
        } = await prom.instantQuery('obd_rpm{job="obd"}')

        send('data', {
          speed: parseInt(speed.value.value),
          rpm: parseInt(rpm.value.value),
        })
      } catch (e) {
        console.error(e)
      }
    }, 1000)

    return async () => {
      clearInterval(interval)
      unsubscribe()
    }
  },
} as Module
