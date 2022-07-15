import React from 'react'
import { motion } from 'framer-motion'
import { classNames } from '~/utils'
import { useModuleProvider } from '~/providers/modules'
import { useStoreProvider } from '~/providers/store'
import { useDragNavigation } from '~/providers/gestures'
import type { PropsWithChildren, HTMLAttributes } from 'react'

export default function Main({
  children,
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  const { state } = useStoreProvider()
  const { currentModule } = useModuleProvider()
  const { onPanEnd, onPanStart, controls } = useDragNavigation()
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
      <motion.div
        className="absolute inset-0 touch-none"
        onPanStart={onPanStart}
        onPanEnd={onPanEnd}
        drag={true}
        dragSnapToOrigin={true}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.05}
        dragControls={controls}
        dragListener={false}
        dragDirectionLock
      >
        {children}
      </motion.div>
    </main>
  )
}
