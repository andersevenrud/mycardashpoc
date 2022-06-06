import { faCog } from '@fortawesome/free-solid-svg-icons'
import { DiagnosticsActionTypes } from './types'
import Diagnostics from './Diagnostics'
import type { Module } from '~/types'
import type { DiagnosticsState, DiagnosticsActions } from './types'

export default {
  name: 'diagnostics',

  route: {
    title: 'Diagnostics',
    path: '/diagnostics',
    background: 'from-red-800 to-red-900',
    element: Diagnostics,
    icon: faCog,
  },

  initialState: {
    state: {},
  },

  reducer(state, action) {
    switch (action.type) {
      case DiagnosticsActionTypes.UpdateState:
        return {
          ...state,
          state: {
            ...state.state,
            ...action.payload,
          },
        }

      default:
        return state
    }
  },

  // eslint-disable-next-line
  listener(message, dispatch) {},
} as Module<DiagnosticsState, DiagnosticsActions>
