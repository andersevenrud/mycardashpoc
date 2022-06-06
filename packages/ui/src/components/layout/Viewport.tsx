import React from 'react'
import type { PropsWithChildren, HTMLAttributes } from 'react'

export default function Viewport({
  children,
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return <div className="flex h-screen w-screen flex-col">{children}</div>
}
