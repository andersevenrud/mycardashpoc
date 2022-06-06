import ReconnectingWebSocket from 'reconnecting-websocket'
import React, { createContext, useContext, useState, useEffect } from 'react'
import { ee } from './events'
import type { PropsWithChildren } from 'react'
import type { WebsocketMessage } from '~/types'
import type { ConnectionConfiguration } from '~/config'

/**
 * Connection Context.
 */
export const ConnectionContext = createContext<{
  connected: boolean
}>({
  connected: false,
})

/**
 * Connection Provider.
 * Handles WebSocket connections.
 */
export function ConnectionProvider({
  connection,
  children,
}: PropsWithChildren<{ connection: ConnectionConfiguration }>) {
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const ws = new ReconnectingWebSocket(connection.uri)

    const onConnected = () => setConnected(true)

    const onDisconnected = () => setConnected(false)

    const onMessage = (ev: MessageEvent) => {
      const message = JSON.parse(ev.data) as WebsocketMessage
      ee.emit('message', message)
    }

    ws.addEventListener('open', onConnected)
    ws.addEventListener('close', onDisconnected)
    ws.addEventListener('message', onMessage)

    return () => {
      ws.removeEventListener('open', onConnected)
      ws.removeEventListener('close', onDisconnected)
      ws.removeEventListener('message', onMessage)
      ws.close()
    }
  }, [])

  return (
    <ConnectionContext.Provider value={{ connected }}>
      {children}
    </ConnectionContext.Provider>
  )
}

/**
 * Connection Hook.
 */
export const useConnectionProvider = () => useContext(ConnectionContext)
