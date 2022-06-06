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

export interface Configuration {
  connection: ConnectionConfiguration
  toaster: ToasterConfiguration
  modules: ModulesConfiguration
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
