import type { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import type { Dispatch, Reducer, PropsWithChildren } from 'react'

/* eslint-disable @typescript-eslint/no-explicit-any */

export type NavigationDirection = 'up' | 'down' | 'left' | 'right'

export type AnyPropsWithChildren = PropsWithChildren<any>

export type AnyArguments = any[]

export type AnyState = any
export type AnyAction = any
export type AnyReducer = Reducer<AnyState, AnyAction>
export type AnyModule = Module<AnyState, AnyAction>

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object
    ? RecursivePartial<T[P]>
    : T[P]
}

export type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key
      }
    : {
        type: Key
        payload: M[Key]
      }
}

export interface WebsocketMessage<T = any> {
  channel: string
  packet: string
  data: T
}

export interface ModuleRoute {
  path: string
  title: string
  background: string
  icon: IconDefinition
  element: () => JSX.Element
}

export interface Module<S, A> {
  name: string
  route: ModuleRoute
  initialState: S
  reducer: (state: S, action: A) => S
  listener: (msg: WebsocketMessage, dispatch: Dispatch<A>) => void
  beforeNavigate?: (
    action: NavigationDirection | null,
    state: S,
    dispatch: Dispatch<A>
  ) => boolean
}
