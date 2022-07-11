import axios from 'axios'
import type { AnyArguments } from '~/types'

export type SongID = number

export type OKResponse = 'OK'

export type PlaybackState = 'play' | 'pause' | 'stop'

export interface AudioFormat {
  sample_rate: number
  bits: number
  channels: number
  original_value: string
  sample_rate_short: {
    value: number
    unit: string
  }
}

export interface Status {
  audio?: AudioFormat
  bitrate?: string
  consume: boolean
  duration?: number
  elapsed?: number
  mixrampdb: number
  partition: string
  playlist?: number
  playlistlength?: number
  random: boolean
  repeat: boolean
  single: boolean
  song?: number
  songid?: SongID
  state: PlaybackState
  time?: {
    elapsed: number
    total: number
  }
}

export interface Song {
  id?: number
  file: string
  album: string
  albumartist: string
  artist: string
  date: string
  duration: number
  title: string
  track: number
  last_modified: string
  format: AudioFormat

  /** @deprecated */
  time: number

  /* custom */
  cover?: string
}

export interface CoverColors {
  DarkMuted: string
  DarkVibrant: string
  LightMuted: string
  LightVibrant: string
  Muted: string
  Vibrant: string
}

/**
 * Client for API
 */
const api = axios.create({
  baseURL: '/api/mpd',
})

/**
 * Wrapper for making a POST request
 */
const post = <T>(endpoint: string, ...data: AnyArguments): Promise<T> =>
  api.post(endpoint, data).then((response) => response.data)

/**
 * Creates URL to generate album art
 */
const cover = (file: string) =>
  `/api/mpd/cover?file=${encodeURIComponent(file)}`

/**
 * Wrapper for handling responses that contains song information
 */
const querySongs = (endpoint: string, ...data: AnyArguments) =>
  post<Song[]>(endpoint, ...data).then((songs) =>
    songs.map((song) => ({
      ...song,
      cover: cover(song.file),
    }))
  )

/**
 * Public MPD API
 */
export default {
  cover,

  colors: (file: string) => post<CoverColors>('/cover-colors', file),

  db: {
    search: (query: string) => querySongs('/db/search', query),
  },

  status: {
    get: () => post<Status>('/status/get'),
  },

  playlists: {
    get: () => querySongs('/playlists/get'),
  },

  queue: {
    info: () => querySongs('/queue/info'),
    addid: (file: string) => post<SongID>('/queue/addid', file),
    id: (id?: SongID): Promise<Song | null> =>
      querySongs('/queue/id', id).then((result) => result[0] || null),
  },

  playback: {
    repeat: (repeat: boolean) =>
      post<OKResponse>('/playback/repeat', repeat ? 1 : 0),
    next: () => post<OKResponse>('/playback/next'),
    prev: () => post<OKResponse>('/playback/prev'),
    play: () => post<OKResponse>('/playback/play'),
    pause: () => post<OKResponse>('/playback/pause'),
    stop: () => post<OKResponse>('/playback/stop'),
    playid: (id: SongID) => post<OKResponse>('/playback/playid', id),
    seekcur: (seek: number) => post<OKResponse>('/playback/seekcur', seek),
  },
}
