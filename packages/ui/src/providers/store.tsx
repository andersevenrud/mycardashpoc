import React, { createContext, useEffect, useContext, useReducer } from 'react'
import { useLocation } from 'react-router-dom'
import { reducerLogger } from '~/utils'
import type { PropsWithChildren, Dispatch } from 'react'
import type { AnyAction, ActionMap } from '~/types'
import type { StoreConfiguration } from '~/config'

export interface StoreState {
  background: string | null
}

export enum StoreActionTypes {
  SetBackground = 'SET_BACKGROUND',
}

type StorePayload = {
  [StoreActionTypes.SetBackground]: string | null
}

export type StoreActions =
  ActionMap<StorePayload>[keyof ActionMap<StorePayload>]

const initialState: StoreState = {
  background: null,
}

function storeReducer(state: StoreState, action: AnyAction) {
  switch (action.type) {
    case StoreActionTypes.SetBackground:
      return {
        ...state,
        background: action.payload,
      }
    default:
      return state
  }
}

export const StoreContext = createContext<{
  state: StoreState
  dispatch: Dispatch<StoreActions>
}>({
  state: initialState,
  dispatch: () => ({}),
})

export function StoreProvider({
  configuration,
  children,
}: PropsWithChildren<{
  configuration: StoreConfiguration
}>) {
  const reducer = configuration.state.log
    ? reducerLogger(storeReducer)
    : storeReducer

  const location = useLocation()
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    dispatch({
      type: StoreActionTypes.SetBackground,
      payload: null,
    })
  }, [location.key])

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  )
}

export const useStoreProvider = () => useContext(StoreContext)
