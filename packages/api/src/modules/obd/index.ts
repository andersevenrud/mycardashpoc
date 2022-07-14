import { PrometheusDriver } from 'prometheus-query'
import { wrapped } from '../../utils'
import type { Module } from '../../types'

const pollers = [
  {
    name: 'speed',
    query: 'obd_speed{job="obd"}',
  },
  {
    name: 'rpm',
    query: 'obd_rpm{job="obd"}',
  },
  {
    name: 'coolantTemp',
    query: 'obd_coolant_temp{job="obd"}',
  },
]

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
        const results = await Promise.all(
          pollers.map(async ({ name, query }) => {
            const {
              result: [result],
            } = await prom.instantQuery(query)

            return [name, parseInt(result.value.value)]
          })
        )

        const data = Object.fromEntries(results)

        send('data', data)
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
