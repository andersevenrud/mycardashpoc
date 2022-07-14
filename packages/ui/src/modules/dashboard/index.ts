import { faTachometer } from '@fortawesome/free-solid-svg-icons'
import { DashboardActionTypes } from './types'
import Dashboard from './Dashboard'
import type { Module } from '~/types'
import type { DashboardState, DashboardActions } from './types'

export default {
  name: 'dashboard',

  route: {
    title: 'Dashboard',
    path: '/dashboard',
    background: 'from-slate-800 to-slate-900',
    element: Dashboard,
    icon: faTachometer,
  },

  initialState: {
    speed: 0,
    rpm: 0,
    distance: -1,
    totalDistance: -1,
    distanceLeft: -1,
    coolantTemp: -1,
  },

  reducer(state, action) {
    switch (action.type) {
      case DashboardActionTypes.UpdateState:
        return {
          ...state,
          ...action.payload,
        }

      default:
        return state
    }
  },

  listener({ channel, packet, data }, dispatch) {
    switch (`${channel}:${packet}`) {
      case 'obd:data':
        dispatch({
          type: DashboardActionTypes.UpdateState,
          payload: data,
        })
        break
    }
  },
} as Module<DashboardState, DashboardActions>
