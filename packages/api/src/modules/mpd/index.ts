import mpdapi from 'mpd-api'
import sharp from 'sharp'
import vibrant from 'node-vibrant'
import { createCacheFilename, cacheFile, wrapped } from '../../utils'
import type { Module } from '../../types'

// FIXME: Types are not correctly exported from mpd-api
type AnyClient = any

/**
 * MPD Module
 */
export default {
  name: 'mpd',
  async register({ router, subscribe, send }) {
    const client = await mpdapi.connect({
      host: 'mpd',
      port: 6600,
    })

    const unsubscribe = subscribe((data) => {
      console.debug('TODO', 'mpd subscription', data)
    })

    // Push mpd player state
    const statusInterval = setInterval(async () => {
      const data = await client.api.status.get()
      send('status', data)
    }, 1000)

    // Reduces all client.api.* functions to a list of names
    const names = Object.keys(client.api).flatMap((ns) => {
      return Object.keys((client.api as AnyClient)[ns]).map((name) => [
        ns,
        name,
      ])
    })

    // Maps all client.api.* methods to the router
    names.forEach(([ns, name]) => {
      const route = `/${ns}/${name}`

      router.post(
        route,
        wrapped(async ({ req, res }) => {
          const args = req.body || []
          const fn = (client.api as AnyClient)[ns][name]
          const result = await fn(...args)
          res.json(result)
        })
      )
    })

    // Custom route to handle album art
    router.get(
      '/cover',
      wrapped(async ({ req, res }) => {
        const name = req.query.file as string

        const stream = await cacheFile(name, async () => {
          const result = (await client.api.db.albumartWhole(name)) as any

          if (!result?.buffer) {
            throw new Error('No cover found')
          }

          return sharp(result.buffer).resize(300).toFormat('png').toBuffer()
        })

        stream.pipe(res)
      })
    )

    // Custom route to get prominent colors from cover
    router.post(
      '/cover-colors',
      wrapped(async ({ req, res }) => {
        const [name] = req.body as string[]
        const filename = createCacheFilename(name)
        const palette = await vibrant.from(filename).getPalette()
        const newEntries = Object.entries(palette).map(([k, v]) => [
          k,
          v?.getHex(),
        ])

        res.json(Object.fromEntries(newEntries))
      })
    )

    return async () => {
      clearInterval(statusInterval)
      unsubscribe()
      await client.api.connection.close()
    }
  },
} as Module
