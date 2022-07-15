import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, useDragControls } from 'framer-motion'
import { useModuleProvider } from '~/providers/modules'
import { useStoreProvider } from '~/providers/store'
import { createRoutes } from '~/providers/routes'
import { isInputElement, isInsideScrollable, classNames } from '~/utils'
import type { PropsWithChildren, HTMLAttributes } from 'react'
import type { PanInfo } from 'framer-motion'
import type { NavigationDirection } from '~/types'

function useDragNavigation() {
  const { state, dispatch, currentModule } = useModuleProvider()
  const location = useLocation()
  const navigate = useNavigate()
  const routes = createRoutes()
  const controls = useDragControls()

  // TODO: Add values based on aspect ratio or corners ?
  const thresholdX = window.innerWidth / 4
  const thresholdY = window.innerHeight / 4

  const onPanStart = (ev: MouseEvent) => {
    const target = ev.target as HTMLElement
    if (isInputElement(target) || isInsideScrollable(target)) {
      return
    }

    controls.start(ev)
  }

  const onPanEnd = (_: MouseEvent, { offset: { x: mx, y: my } }: PanInfo) => {
    let direction: NavigationDirection | null = null

    const currentIndex =
      routes.slice(1).findIndex((r) => r.path === location.pathname) + 1

    let result
    if (my < -thresholdY || my > thresholdY) {
      if (currentIndex !== 0) {
        direction = my < -thresholdY ? 'up' : 'down'
        result = '/'
      }
    } else if (mx > thresholdX) {
      const newIndex = Math.max(0, currentIndex - 1)
      if (newIndex !== currentIndex) {
        result = routes[newIndex].path
        direction = 'left'
      }
    } else if (mx < -thresholdX) {
      const newIndex = Math.min(routes.length - 1, currentIndex + 1)
      if (newIndex !== currentIndex) {
        result = routes[newIndex].path
        direction = 'right'
      }
    }

    if (result && direction) {
      if (currentModule?.beforeNavigate) {
        const moduleState = state[currentModule.name]
        const aborter = currentModule.beforeNavigate(
          direction,
          moduleState,
          dispatch
        )

        if (aborter === false) {
          return
        }
      }

      navigate(result)
    }
  }

  return {
    onPanStart,
    onPanEnd,
    controls,
  }
}

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
