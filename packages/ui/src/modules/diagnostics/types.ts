import type { ActionMap } from '~/types'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DiagnosticsStateState {}

export interface DiagnosticsState {
  state: DiagnosticsStateState
}

export enum DiagnosticsActionTypes {
  UpdateState = 'DIAGNOSTICS_UPDATE_STATE',
}

type DiagnosticsPayload = {
  [DiagnosticsActionTypes.UpdateState]: DiagnosticsStateState
}

export type DiagnosticsActions =
  ActionMap<DiagnosticsPayload>[keyof ActionMap<DiagnosticsPayload>]
