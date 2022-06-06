import React from 'react'
import { classNames } from '~/utils'
import type { HTMLAttributes } from 'react'

export default function AlbumArt({
  className,
  image,
}: HTMLAttributes<HTMLDivElement> & { image?: string }) {
  const style = {
    backgroundImage: image && `url("${image}")`,
  }

  return (
    <div>
      <div
        className={classNames('rounded-xl bg-white bg-cover', className)}
        style={style}
      ></div>
    </div>
  )
}
