import React from 'react'
import { motion } from 'framer-motion'
import { useDragNavigation } from '~/providers/gestures'
import type { AnyPropsWithChildren } from '~/types'

export default function NavigationGesture({ children }: AnyPropsWithChildren) {
  const { onPanEnd, onPanStart, controls } = useDragNavigation()

  const constraint = { left: 0, right: 0, top: 0, bottom: 0 }
  const elastic = 0.05

  return (
    <motion.div
      className="absolute inset-0 touch-none"
      drag
      dragDirectionLock
      dragSnapToOrigin
      dragConstraints={constraint}
      dragControls={controls}
      dragElastic={elastic}
      dragListener={false}
      onPanStart={onPanStart}
      onPanEnd={onPanEnd}
    >
      {children}
    </motion.div>
  )
}
