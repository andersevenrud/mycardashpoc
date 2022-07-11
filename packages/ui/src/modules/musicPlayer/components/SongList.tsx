import React, { useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import { classNames } from '~/utils'
import AlbumArt from './AlbumArt'
import TimeStamp from '~/components/TimeStamp'
import type { Song } from '~/services/mpd'

function TrackListItem({
  track,
  currentId,
}: {
  track: Song
  currentId?: number
}) {
  return (
    <>
      <div className="relative">
        <AlbumArt className="h-12 w-12" image={track.cover} />
        <div
          className={classNames(
            'flex items-center justify-center',
            (!currentId || track.id !== currentId) && 'opacity-40'
          )}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <FontAwesomeIcon size="2x" icon={faPlay} />
          </div>
        </div>
      </div>
      <div className="grow">
        <div className="text-lg font-bold">{track.title}</div>
        <div>
          {track.artist} ({track.album}) (Track {track.track})
        </div>
      </div>
      <div className="flex items-center justify-center">
        <TimeStamp value={track.duration} />
      </div>
    </>
  )
}

function ArtistListItem({
  track,
  currentId,
}: {
  track: Song
  currentId?: number
}) {
  return (
    <>
      <div className="relative">
        <AlbumArt className="h-12 w-12" image={track.cover} />
        <div
          className={classNames(
            'flex items-center justify-center',
            (!currentId || track.id !== currentId) && 'opacity-40'
          )}
        />
      </div>
      <div className="grow">
        <div className="text-lg font-bold">{track.artist}</div>
      </div>
    </>
  )
}

function AlbumListItem({
  track,
  currentId,
}: {
  track: Song
  currentId?: number
}) {
  return (
    <>
      <div className="relative">
        <AlbumArt className="h-12 w-12" image={track.cover} />
        <div
          className={classNames(
            'flex items-center justify-center',
            (!currentId || track.id !== currentId) && 'opacity-40'
          )}
        />
      </div>
      <div className="grow">
        <div className="text-lg font-bold">{track.album}</div>
        <div>{track.artist}</div>
      </div>
    </>
  )
}

export default function SongList({
  type = 'song',
  list,
  loading,
  currentId,
  onClick,
}: {
  type: string
  list: Song[]
  loading?: boolean
  currentId?: number
  onClick: (song: Song) => void
}) {
  const current = useRef<HTMLDivElement>(null)

  const lists: Record<string, any> = {
    song: TrackListItem,
    artist: ArtistListItem,
    album: AlbumListItem,
  }

  const ListItem = lists[type] || lists.song

  const label = loading ? 'Loading...' : 'No results'

  useEffect(() => {
    if (current.current) {
      current.current.scrollIntoView({
        behavior: 'smooth',
      })
    }
  }, [current.current])

  return (
    <div>
      {list.length ? (
        <>
          {list.map((track) => (
            <div
              className="cursor-pointer hover:bg-black"
              key={`${track.id}-${track.file}`}
              ref={currentId && track.id === currentId ? current : null}
              onClick={() => onClick(track)}
            >
              <div className="flex items-center space-x-4 p-2">
                <ListItem track={track} currentId={currentId} />
              </div>
            </div>
          ))}
        </>
      ) : (
        <div className="p-4 text-center opacity-50">{label}</div>
      )}
    </div>
  )
}
