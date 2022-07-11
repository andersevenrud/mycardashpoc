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
      className={classNames('flex grow items-center justify-center', className)}
      {...props}
    >
      {children}
    </section>
  )
}
