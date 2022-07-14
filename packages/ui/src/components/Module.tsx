import React from 'react'
import { classNames } from '~/utils'
import type { PropsWithChildren, HTMLAttributes } from 'react'

export default function Module({
  className,
  children,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <section
      className={classNames(
        'absolute inset-0 flex max-h-full items-center justify-center overflow-hidden p-4',
        className
      )}
      {...props}
    >
      {children}
    </section>
  )
}
