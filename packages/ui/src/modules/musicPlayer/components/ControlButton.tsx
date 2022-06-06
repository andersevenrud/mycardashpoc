import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { classNames } from '~/utils'
import type { PropsWithChildren, HTMLAttributes } from 'react'
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons'

export default function ControlButton({
  large,
  small,
  icon,
  children,
  className,
  ...props
}: PropsWithChildren<
  HTMLAttributes<HTMLButtonElement> & {
    small?: boolean
    large?: boolean
    icon: IconDefinition
  }
>) {
  return (
    <button
      {...props}
      className={classNames(
        'flex items-center justify-center overflow-hidden rounded-full text-center hover:bg-black/80',
        !small && 'bg-black/50',
        !large && 'h-12 w-12 p-2',
        large && !small && 'h-16 w-16 p-8 text-2xl',
        small && 'h-8 w-8',
        className
      )}
    >
      <FontAwesomeIcon size={small ? 'xs' : large ? 'lg' : '1x'} icon={icon} />
      {children}
    </button>
  )
}
