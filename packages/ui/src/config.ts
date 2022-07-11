import { merge } from 'lodash-es'
import type { RecursivePartial } from './types'

export interface ConnectionConfiguration {
  uri: string
}

export interface ToasterConfiguration {
  duration: number
}

export interface ModulesConfiguration {
  state: {
    /** Toggling this in a dev environment will lead to crashing */
    log: boolean
  }
}

export interface StoreConfiguration {
  state: {
    /** Toggling this in a dev environment will lead to crashing */
    log: boolean
  }
}

export interface Configuration {
  keyboard: boolean
  connection: ConnectionConfiguration
  toaster: ToasterConfiguration
  modules: ModulesConfiguration
  store: StoreConfiguration
}

export type PartialConfiguration = RecursivePartial<Configuration>

/**
 * Create new configuration set from environment
 */
export default function createConfiguration(
  defaults: PartialConfiguration = {}
): Configuration {
  const base = window.location.origin.replace(/^http/, 'ws')
  const uri = `${base}/api/`

  return merge(
    {
      keyboard: true,
      store: {
        state: {
          log: false,
        },
      },
      modules: {
        state: {
          log: false,
        },
      },
      connection: {
        uri,
      },
      toaster: {
        duration: 2000,
      },
    },
    defaults
  )
}
