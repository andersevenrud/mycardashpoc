import React, { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { uniqBy, debounce } from 'lodash-es'
import {
  faStepBackward,
  faStepForward,
  faPlay,
  faPause,
  faX,
  faList,
  faRepeat,
} from '@fortawesome/free-solid-svg-icons'
import { MusicPlayerActionTypes } from './types'
import { useModuleProviderState, useModuleProvider } from '~/providers/modules'
import { useToasterErrorHandler } from '~/providers/toaster'
import { useStoreProvider, StoreActionTypes } from '~/providers/store'
import { classNames } from '~/utils'
import api from '~/services/mpd'
import Module from '~/components/Module'
import TimeInterval from '~/components/TimeInterval'
import ControlButton from './components/ControlButton'
import ControlSlider from './components/ControlSlider'
import SearchInput from './components/SearchInput'
import AlbumArt from './components/AlbumArt'
import SongList from './components/SongList'
import type { MusicPlayerState } from './types'
import type { Song, Status } from '~/services/mpd'
import type { AnyPropsWithChildren } from '~/types'

interface SearchCategory {
  type: string
  label: string
  keys: string[]
  filter?: (song: Song[]) => Song[]
}

const categories: SearchCategory[] = [
  {
    type: 'song',
    label: 'Songs',
    keys: ['title'],
  },
  {
    type: 'artist',
    label: 'Artists',
    keys: ['artist'],
    filter: (songs) => uniqBy(songs, 'artist'),
  },
  {
    type: 'album',
    label: 'Albums',
    keys: ['album'],
    filter: (songs) => uniqBy(songs, 'album'),
  },
  {
    type: 'playlist',
    label: 'Playlists',
    keys: ['playlist'],
  },
]

const useModuleState = () =>
  useModuleProviderState<MusicPlayerState>('musicPlayer')

function MusicPlayerModal({ children }: AnyPropsWithChildren) {
  return (
    <div className="absolute inset-0 z-30 flex flex-col space-y-4 bg-black/90 p-2">
      {children}
    </div>
  )
}

function MusicPlayerPlaylistModal() {
  const { dispatch } = useModuleProvider()
  const [list, setList] = useState<Song[]>([])
  const musicPlayer = useModuleState()
  const wrap = useToasterErrorHandler()

  const currentTrackId = musicPlayer.status.songid

  const onClose = () =>
    dispatch({ type: MusicPlayerActionTypes.TogglePlaylist, payload: false })

  const onClick = async (track: Song) =>
    wrap(async () => {
      if (track.id) {
        await api.playback.playid(track.id)
      }
      onClose()
    })

  const onLoad = () =>
    wrap(async () => {
      const result = await api.queue.info()
      setList(result)
    })

  useEffect(() => {
    onLoad()
  }, [])

  return (
    <MusicPlayerModal>
      <div className="flex justify-end">
        <div
          className="flex cursor-pointer items-center justify-center px-2"
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faX} />
        </div>
      </div>

      <div className="grow overflow-auto">
        <SongList
          type="song"
          list={list}
          currentId={currentTrackId}
          onClick={onClick}
        />
      </div>
    </MusicPlayerModal>
  )
}

function MusicPlayerSearchModal() {
  const { dispatch } = useModuleProvider()
  const [category, setCategory] = useState<SearchCategory>(categories[0])
  const [query, setQuery] = useState<string>('')
  const [filters, setFilters] = useState<string[]>([])
  const [list, setList] = useState<Song[]>([])
  const wrap = useToasterErrorHandler()

  const onClose = () =>
    dispatch({ type: MusicPlayerActionTypes.ToggleSearch, payload: false })

  const onClick = async (track: Song) =>
    wrap(async () => {
      if (category.type === 'artist') {
        setQuery('')
        setFilters([`(artist == "${track.artist}")`])
        setCategory(categories[2])
      } else if (category.type === 'album') {
        setQuery('')
        setFilters([...filters, `(album == "${track.album}")`])
        setCategory(categories[0])
      } else {
        const song = await api.queue.addid(track.file)
        await api.playback.playid(song)
        onClose()
      }
    })

  // TODO: Loading
  const onSearch = debounce(
    async (q: string, f?: string[]) =>
      wrap(async () => {
        const t = category.type === 'song' ? 'title' : category.type
        const fs = f || filters
        const qs = fs.length
          ? [...fs, `(${t} contains "${q}")`]
          : category.keys.map((k) => {
              return `(${k} contains "${q}")`
            })

        const s = qs.filter((s) => !!s).join(' AND ')
        const result = await api.db.search(`(${s})`)
        const uniq = uniqBy(result.flat(), 'file')
        setList(category.filter ? category.filter(uniq) : uniq)
      }),
    200
  )

  const onSetType = (t: SearchCategory) => () => {
    setFilters([])

    if (category.type === t.type) {
      if (query === '') {
        onSearch('', [])
      } else {
        setQuery('')
      }
    } else {
      setCategory(t)
    }
  }

  useEffect(() => {
    onSearch(query)
  }, [query])

  useEffect(() => {
    setList([])

    if (query === '') {
      onSearch('')
    } else {
      setQuery('')
    }
  }, [category])

  return (
    <MusicPlayerModal>
      <div className="space-x-2">
        {categories.map((button, index) => (
          <button
            key={index}
            onClick={onSetType(button)}
            className={classNames(
              'px-2',
              button.type !== category.type && 'opacity-50'
            )}
          >
            {button.label}
          </button>
        ))}
      </div>
      <div className="flex space-x-2">
        <SearchInput
          focus
          className="grow"
          placeholder="Search..."
          value={query}
          onChange={setQuery}
        />

        <div
          className="flex cursor-pointer items-center justify-center px-2"
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faX} />
        </div>
      </div>

      <div className="grow overflow-auto">
        <SongList
          list={list}
          type={category.type}
          loading={false}
          onClick={onClick}
        />
      </div>
    </MusicPlayerModal>
  )
}

function MusicPlayerInfo() {
  const musicPlayer = useModuleState()

  const detail = [musicPlayer.song?.artist, musicPlayer.song?.album]
    .filter((s) => typeof s === 'string')
    .map((s, i) => (i > 0 ? `(${s})` : s))
    .join(' ')

  return (
    <div
      className={classNames(
        'space-y-2 text-center',
        !musicPlayer.song && 'opacity-30'
      )}
    >
      <h1 className="truncate text-4xl font-bold">
        {musicPlayer.song?.title || 'No song'}
      </h1>
      <h2 className="truncate text-2xl">{detail || 'No song'}</h2>
    </div>
  )
}

function MusicPlayerControls() {
  const wrap = useToasterErrorHandler()
  const musicPlayer = useModuleState()
  const { dispatch } = useModuleProvider()

  const action = async (fn: () => Promise<any>, status?: Partial<Status>) =>
    wrap(async () => {
      if (status) {
        dispatch({
          type: MusicPlayerActionTypes.AppendStatus,
          payload: status,
        })
      }

      await fn()
    })

  const onTogglePlaylist = () =>
    dispatch({ type: MusicPlayerActionTypes.TogglePlaylist, payload: true })

  const onToggleRepeat = () => {
    const val = !musicPlayer.status.repeat
    action(() => api.playback.repeat(val), { repeat: val })
  }

  const onBackClick = () => action(() => api.playback.prev())
  const onFormwardClick = () => action(() => api.playback.next())
  const onPlayClick = () => action(() => api.playback.play(), { state: 'play' })
  const onPauseClick = () =>
    action(() => api.playback.pause(), { state: 'pause' })

  const onSeek = (value: number) =>
    action(() => api.playback.seekcur(value), {
      elapsed: value,
    })

  const playlistCount = musicPlayer.status.playlistlength || 0
  const playlistCurrent = musicPlayer.status.songid || 0
  const elapsed = musicPlayer.status.time?.elapsed || 0
  const duration = musicPlayer.status.time?.total || 0
  const isPlaying = musicPlayer.status.state === 'play'
  const mainIcon = isPlaying ? faPause : faPlay
  const mainAction = isPlaying ? onPauseClick : onPlayClick

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <ControlSlider
          elapsed={elapsed}
          duration={duration}
          onChange={onSeek}
        />

        <h3 className="space-x-1 text-center text-sm">
          <TimeInterval elapsed={elapsed} duration={duration} />
        </h3>
      </div>

      <div className="flex items-center justify-center space-x-2">
        <ControlButton
          small
          icon={faRepeat}
          onClick={onToggleRepeat}
          className={musicPlayer.status.repeat ? '' : 'opacity-20'}
        />

        <div className="flex grow items-center justify-center space-x-2">
          <ControlButton icon={faStepBackward} onClick={onBackClick} />
          <ControlButton large icon={mainIcon} onClick={mainAction} />
          <ControlButton icon={faStepForward} onClick={onFormwardClick} />
        </div>

        <div className="text-xs">
          {playlistCurrent} / {playlistCount}
        </div>

        <ControlButton small icon={faList} onClick={onTogglePlaylist} />
      </div>
    </div>
  )
}

export default function MusicPlayer() {
  const store = useStoreProvider()
  const { dispatch } = useModuleProvider()
  const { status, song, playlistOpen, searchOpen } = useModuleState()
  const wrap = useToasterErrorHandler()
  const songid = useRef(status.songid)

  const onOpenSearch = () =>
    dispatch({ type: MusicPlayerActionTypes.ToggleSearch, payload: true })

  const updateSong = async (s: Status) =>
    wrap(async () =>
      dispatch({
        type: MusicPlayerActionTypes.SetSong,
        payload: await api.queue.id(s.songid),
      })
    )

  const updateBackground = async (name: string | null) =>
    wrap(async () => {
      let payload = null
      if (name) {
        const { DarkVibrant: from, DarkMuted: to } = await api.colors(name)
        payload = `linear-gradient(to right, ${from}, ${to})`
      }

      store.dispatch({
        type: StoreActionTypes.SetBackground,
        payload,
      })
    })

  useEffect(() => {
    const id = status.songid || -1
    if (id !== -1) {
      updateSong(status)
    }
    songid.current = id
  }, [status.songid])

  useEffect(() => {
    updateBackground(song?.file || null)
  }, [song])

  return (
    <Module className="overflow-hidden">
      <div className="grow overflow-hidden">
        <SearchInput
          placeholder="Click to open browser..."
          onOpen={onOpenSearch}
        />

        {searchOpen && <MusicPlayerSearchModal />}
        {playlistOpen && <MusicPlayerPlaylistModal />}

        <div className="mt-4 flex shrink grow items-stretch space-x-8 overflow-hidden">
          <div className="flex items-center">
            <AlbumArt className="h-64 w-64 shadow " image={song?.cover} />
          </div>

          <div className="flex grow flex-col items-stretch justify-center space-y-4 overflow-hidden">
            <MusicPlayerInfo />
            <MusicPlayerControls />
          </div>
        </div>
      </div>
    </Module>
  )
}
