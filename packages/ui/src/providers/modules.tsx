import React, {
  createContext,
  useContext,
  useReducer,
  useState,
  useEffect,
} from 'react'
import { useLocation } from 'react-router-dom'
import { reducerLogger } from '~/utils'
import { ee } from '~/providers/events'
import dashboard from '~/modules/dashboard'
import diagnostics from '~/modules/diagnostics'
import musicPlayer from '~/modules/musicPlayer'
import type { Dispatch, PropsWithChildren } from 'react'
import type { ModulesConfiguration } from '~/config'
import type {
  AnyState,
  AnyAction,
  AnyModule,
  WebsocketMessage,
} from '~/types'
import type {
  DashboardActions,
  DashboardState,
} from '~/modules/dashboard/types'
import type {
  MusicPlayerActions,
  MusicPlayerState,
} from '~/modules/musicPlayer/types'
import type {
  DiagnosticsActions,
  DiagnosticsState,
} from '~/modules/diagnostics/types'

type DispatchTypes = Dispatch<
  DashboardActions | DiagnosticsActions | MusicPlayerActions
>

export interface ModuleState extends Record<string, AnyState> {
  dashboard: DashboardState
  diagnostics: DiagnosticsState
  musicPlayer: MusicPlayerState
}

/**
 * Expose modules  to UI
 */
export const modules = [dashboard, musicPlayer, diagnostics]

/**
 * Initial state for all modules, namespaced
 */
const initialState: ModuleState = {
  dashboard: dashboard.initialState,
  diagnostics: diagnostics.initialState,
  musicPlayer: musicPlayer.initialState,
}

/**
 * Initial context for modules
 */
export const ModuleContext = createContext<{
  state: ModuleState
  dispatch: DispatchTypes
  currentModule: AnyModule | null
}>({
  currentModule: null,
  state: initialState,
  dispatch: () => ({}),
})

/**
 * All reducers, namespaced
 */
const mainReducer = (state: ModuleState, action: AnyAction) => ({
  dashboard: dashboard.reducer(state.dashboard, action),
  diagnostics: diagnostics.reducer(state.diagnostics, action),
  musicPlayer: musicPlayer.reducer(state.musicPlayer, action),
})

/**
 * Get current module based on location
 */
const findCurrentModule = (pathname: string) =>
  modules.find(({ route: { path } }) => path === pathname) || null

/**
 * Trigger all module listeners with following message
 */
const broadcastMessage =
  (dispatch: DispatchTypes) => (message: WebsocketMessage) =>
    modules.forEach(({ listener }) => listener(message, dispatch))

/**
 * Provides module interaction facilities
 */
export function ModuleProvider({
  configuration,
  children,
}: PropsWithChildren<{
  configuration: ModulesConfiguration
}>) {
  const reducer = configuration.state.log
    ? reducerLogger(mainReducer)
    : mainReducer

  const location = useLocation()
  const [state, dispatch] = useReducer(reducer, initialState)
  const [currentModule, setCurrentModule] = useState<AnyModule | null>(null)

  useEffect(() => {
    const found = findCurrentModule(location.pathname)
    setCurrentModule(found)
  }, [location.pathname])

  useEffect(() => {
    const onMessage = broadcastMessage(dispatch)

    ee.on('message', onMessage)

    return () => {
      ee.off('message', onMessage)
    }
  }, [])

  return (
    <ModuleContext.Provider value={{ currentModule, state, dispatch }}>
      {children}
    </ModuleContext.Provider>
  )
}

/**
 * Hook for using module context
 */
export const useModuleProvider = () => useContext(ModuleContext)

/**
 * Hook for using module context states only
 * FIXME: Infer return type instead of relying on a input Generic
 */
export const useModuleProviderState = <T,>(k: keyof ModuleState) => {
  const { state } = useContext(ModuleContext)
  return state[k] as T
}
