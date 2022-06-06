import React, { useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import { classNames, secondsToTime } from '~/utils'
import AlbumArt from './AlbumArt'
import type { Song } from '~/services/mpd'

export default function SongList({
  list,
  currentId,
  onClick,
}: {
  list: Song[]
  currentId?: number
  onClick: (song: Song) => void
}) {
  const current = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (current.current) {
      current.current.scrollIntoView({
        behavior: 'smooth',
      })
    }
  }, [current.current])

  return (
    <div>
      {list.map((track) => (
        <div
          className="cursor-pointer hover:bg-black"
          key={`${track.id}-${track.file}`}
          ref={currentId && track.id === currentId ? current : null}
          onClick={() => onClick(track)}
        >
          <div className="flex items-center space-x-4 p-2">
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
              <span>{secondsToTime(track.duration)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
