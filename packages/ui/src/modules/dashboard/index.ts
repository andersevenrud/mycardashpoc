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
    speed: 100,
    rpm: 2500,
    distance: 1234,
    totalDistance: 200000,
    distanceLeft: 123,
    coolantTemp: 90,
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
