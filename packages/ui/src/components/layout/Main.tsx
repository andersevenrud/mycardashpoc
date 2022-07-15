import React from 'react'
import { classNames } from '~/utils'
import { useModuleProvider } from '~/providers/modules'
import { useStoreProvider } from '~/providers/store'
import NavigationGesture from '~/components/animations/NavigationGesture'
import type { PropsWithChildren, HTMLAttributes } from 'react'

export default function Main({
  children,
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  const { state } = useStoreProvider()
  const { currentModule } = useModuleProvider()
  const defaultColors = 'from-zinc-800 to-zinc-900'
  const colors = currentModule?.route?.background || defaultColors

  return (
    <main
      className={classNames(
        'relative grow overflow-hidden bg-gradient-to-br text-white transition-all',
        colors
      )}
      style={{ background: state.background || undefined }}
    >
      <NavigationGesture>{children}</NavigationGesture>
    </main>
  )
}
