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
        <SongList list={list} currentId={currentTrackId} onClick={onClick} />
      </div>
    </MusicPlayerModal>
  )
}

function MusicPlayerSearchModal() {
  const { dispatch } = useModuleProvider()
  const [query, setQuery] = useState<string>('')
  const [list, setList] = useState<Song[]>([])
  const wrap = useToasterErrorHandler()

  const onClose = () =>
    dispatch({ type: MusicPlayerActionTypes.ToggleSearch, payload: false })

  const onClick = async (track: Song) =>
    wrap(async () => {
      const song = await api.queue.addid(track.file)
      await api.playback.playid(song)
      onClose()
    })

  const onSearch = debounce(
    async (q: string) =>
      wrap(async () => {
        const s = ['artist', 'album', 'title']
          .map((k) => {
            return `(${k} contains "${q}")`
          })
          .map((a) => api.db.search(a))

        const result = await Promise.all(s)
        setList(uniqBy(result.flat(), 'file'))
      }),
    200
  )

  useEffect(() => {
    onSearch(query)
  }, [query])

  return (
    <MusicPlayerModal>
      <div className="flex space-x-2">
        <SearchInput focus className="grow" onChange={setQuery} />

        <div
          className="flex cursor-pointer items-center justify-center px-2"
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faX} />
        </div>
      </div>

      <div className="grow overflow-auto">
        <SongList list={list} onClick={onClick} />
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
  const { dispatch } = useModuleProvider()
  const { status, song, playlistOpen, searchOpen } = useModuleState()
  const wrap = useToasterErrorHandler()
  const songid = useRef(status.songid)

  const onOpenSearch = () =>
    dispatch({ type: MusicPlayerActionTypes.ToggleSearch, payload: true })

  const updateSong = async (s: Status) =>
    wrap(async () => {
      dispatch({
        type: MusicPlayerActionTypes.SetSong,
        payload: await api.queue.id(s.songid),
      })
    })

  useEffect(() => {
    const id = status.songid || -1
    if (id !== -1) {
      updateSong(status)
    }
    songid.current = id
  }, [status.songid])

  return (
    <Module className="overflow-hidden">
      <div className="grow overflow-hidden">
        <SearchInput onOpen={onOpenSearch} />

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
