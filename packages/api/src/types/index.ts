import type { Router } from 'express'
import type { Application } from 'express-ws'
import type { Configuration } from '../config'

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */

export type WebSocketPacketData = any

export type ShutdownFunction = () => Promise<void>

export type ModuleSubscriber = (data: any) => void

export type ModuleUnsubscriber = () => void

export type ModulePublisher = (packet: string, data?: any) => void

export interface ModuleSubscription {
  index: number
  name: string
  callback: ModuleSubscriber
}

export interface ModuleContext {
  app: Application
  router: Router
  subscribe: (fn: ModuleSubscriber) => ModuleUnsubscriber
  send: ModulePublisher
  config: Configuration
}

export interface Module {
  name: string
  register: (ctx: ModuleContext) => Promise<ShutdownFunction>
}
