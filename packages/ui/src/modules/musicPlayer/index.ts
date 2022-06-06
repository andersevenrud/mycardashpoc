import { faMusic } from '@fortawesome/free-solid-svg-icons'
import { MusicPlayerActionTypes } from './types'
import MusicPlayer from './MusicPlayer'
import type { Module } from '~/types'
import type { MusicPlayerState, MusicPlayerActions } from './types'

const initialState = {
  searchOpen: false,
  playlistOpen: false,
  song: null,
  status: {
    bitrate: '',
    consume: false,
    duration: 0,
    elapsed: 0,
    mixrampdb: 0,
    partition: '',
    playlist: -1,
    playlistLength: -1,
    random: false,
    repeat: false,
    single: false,
    song: -1,
    songid: -1,
    state: 'stop',
  },
}

export default {
  name: 'musicPlayer',

  initialState,

  route: {
    title: 'Music Player',
    path: '/music',
    background: 'from-emerald-800 to-emerald-900',
    element: MusicPlayer,
    icon: faMusic,
  },

  reducer(state, action) {
    const apply = (s: Partial<MusicPlayerState>) => ({
      ...state,
      ...s,
    })

    switch (action.type) {
      case MusicPlayerActionTypes.SetStatus:
        return apply({
          status: {
            ...initialState.status,
            ...action.payload,
          },
        })

      case MusicPlayerActionTypes.AppendStatus:
        return apply({
          status: {
            ...state.status,
            ...action.payload,
          },
        })

      case MusicPlayerActionTypes.SetSong:
        return apply({
          song: action.payload || null,
        })

      case MusicPlayerActionTypes.TogglePlaylist:
        return apply({
          playlistOpen: action.payload,
        })

      case MusicPlayerActionTypes.ToggleSearch:
        return apply({
          searchOpen: action.payload,
        })

      default:
        return state
    }
  },

  listener({ channel, packet, data }, dispatch) {
    switch (`${channel}:${packet}`) {
      case 'mpd:status':
        dispatch({
          type: MusicPlayerActionTypes.SetStatus,
          payload: data,
        })
        break
    }
  },

  beforeNavigate(action, state, dispatch) {
    const isOpen = state.searchOpen || state.playlistOpen

    if (!['up', 'down'].includes(action || '')) {
      if (isOpen) {
        dispatch({
          type: MusicPlayerActionTypes.ToggleSearch,
          payload: false,
        })

        dispatch({
          type: MusicPlayerActionTypes.TogglePlaylist,
          payload: false,
        })

        return false
      }
    }

    return !isOpen
  },
} as Module<MusicPlayerState, MusicPlayerActions>
