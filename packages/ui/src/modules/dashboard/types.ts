import type { ActionMap } from '~/types'

export interface DashboardState {
  speed: number
  rpm: number
  distance: number
  totalDistance: number
  distanceLeft: number
  coolantTemp: number
}

export enum DashboardActionTypes {
  UpdateState = 'DASHBOARD_UPDATE_STATE',
}

type DashboardPayload = {
  [DashboardActionTypes.UpdateState]: Partial<DashboardState>
}

export type DashboardActions =
  ActionMap<DashboardPayload>[keyof ActionMap<DashboardPayload>]
