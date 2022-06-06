import express from 'express'
import expressWs from 'express-ws'
import modules from './modules'
import type { Application } from 'express-ws'
import type { Request, Response, NextFunction } from 'express'
import type { Configuration } from './config'
import type {
  ModuleSubscription,
  ModuleSubscriber,
  WebSocketPacketData,
} from './types'

/**
 * Exception abstraction for Express routes.
 */
class RequestError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

/**
 * Creates a new WebSocket server broadcaster.
 */
function createWebsocketServer(app: Application) {
  const ews = expressWs(app)
  const wss = ews.getWss()

  const broadcast = (data: string) =>
    Array.from(wss.clients)
      .filter((client) => client.readyState === 1)
      .forEach((client) => client.send(data))

  const sendMessage =
    (channel: string) => (packet: string, data: WebSocketPacketData) =>
      broadcast(
        JSON.stringify({
          channel,
          packet,
          data,
        })
      )

  return { sendMessage }
}

/**
 * Initializes all modules
 */
async function createModules(app: Application, config: Configuration) {
  const { sendMessage } = createWebsocketServer(app)
  const subscribers: ModuleSubscription[] = []

  const shutdowns = await Promise.all(
    modules.map(({ name, register }, index) => {
      const router = express.Router()
      const send = sendMessage(name)
      const subscribe = (callback: ModuleSubscriber) => {
        subscribers.push({
          index,
          name,
          callback,
        })

        return () => {
          const foundIndex = subscribers.findIndex((s) => s.index === index)
          if (foundIndex !== -1) {
            subscribers.splice(foundIndex, 1)
          }
        }
      }

      app.use(`/${name}`, router)

      return register({ app, config, router, send, subscribe })
    })
  )

  app.ws('/', (ws) => {
    ws.on('message', (msg) => {
      const { channel, data } = JSON.parse(msg.toString())
      subscribers
        .filter((s) => s.name === channel)
        .forEach((s) => s.callback(data))
    })
  })

  return shutdowns
}

/**
 * Creates Express Application.
 */
export async function createApp(config: Configuration) {
  const app = express() as unknown as Application

  app.use(express.json())

  const shutdowns = await createModules(app, config)

  app.use((_, __, next) => {
    next(new RequestError(404, 'Not found'))
  })

  app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
      next(err)
      return
    }

    const { message, stack, ...meta } = err

    res.status((err as RequestError).status || 500)

    res.json({
      message,
      stack,
      meta,
    })
  })

  // FIXME: This is not enough to handle graceful shutdowns in production
  process.on('SIGINT', async () => {
    try {
      await Promise.all(shutdowns.map((s) => s()))
    } catch (e) {
      console.error('Error shutting down', e)
      process.exit(1)
    } finally {
      process.exit(0)
    }
  })

  app.listen(8080, () => console.log('Listening'))
}
