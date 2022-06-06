import type { ActionMap } from '~/types'
import type { Status, Song } from '~/services/mpd'

export interface MusicPlayerState {
  searchOpen: boolean
  playlistOpen: boolean
  song: Song | null
  status: Status
}

export enum MusicPlayerActionTypes {
  SetSong = 'MUSICPLAYER_SET_SONG',
  SetStatus = 'MUSICPLAYER_UPDATE_STATUS',
  AppendStatus = 'MUSICPLAYER_APPEND_STATUS',
  TogglePlaylist = 'MUSICPLAYER_TOGGLE_PLAYLIST',
  ToggleSearch = 'MUSICPLAYER_TOGGLE_SEARCH',
}

type MusicPlayerPayload = {
  [MusicPlayerActionTypes.SetSong]: Song | null
  [MusicPlayerActionTypes.SetStatus]: Status
  [MusicPlayerActionTypes.AppendStatus]: Partial<Status>
  [MusicPlayerActionTypes.TogglePlaylist]: boolean
  [MusicPlayerActionTypes.ToggleSearch]: boolean
}

export type MusicPlayerActions =
  ActionMap<MusicPlayerPayload>[keyof ActionMap<MusicPlayerPayload>]
