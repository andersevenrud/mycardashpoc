import { faCog } from '@fortawesome/free-solid-svg-icons'
import { DiagnosticsActionTypes } from './types'
import Diagnostics, {
  DiagnosticsHome,
  DiagnosticsCodes,
  DiagnosticsMetrics,
} from './Diagnostics'
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
    routes: [
      {
        index: true,
        element: DiagnosticsHome,
      },
      {
        path: 'codes',
        element: DiagnosticsCodes,
      },
      {
        path: 'metrics',
        element: DiagnosticsMetrics,
      },
    ],
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

  beforeNavigate(action, state, dispatch) {
    // TODO: Check current route and navigate back instead of globally
    return true
  },
} as Module<DiagnosticsState, DiagnosticsActions>
