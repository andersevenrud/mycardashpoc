import { useCallback, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDragControls } from 'framer-motion'
import { useModuleProvider } from '~/providers/modules'
import { createRoutes } from '~/providers/routes'
import { isInputElement, isInsideScrollable } from '~/utils'
import type { PanInfo } from 'framer-motion'
import type { NavigationDirection } from '~/types'

export function useDragNavigation() {
  const { state, dispatch, currentModule } = useModuleProvider()
  const location = useLocation()
  const navigate = useNavigate()
  const routes = createRoutes()
  const controls = useDragControls()
  const [dragging, setDragging] = useState(false)

  // TODO: Add values based on aspect ratio or corners ?
  const thresholdX = window.innerWidth / 4
  const thresholdY = window.innerHeight / 4

  const onPanStart = (ev: MouseEvent) => {
    const target = ev.target as HTMLElement
    const skip = isInputElement(target) || isInsideScrollable(target)

    setDragging(!skip)

    if (skip) {
      return
    }

    controls.start(ev)
  }

  const onPanEnd = useCallback(
    (_: MouseEvent, { offset: { x: mx, y: my } }: PanInfo) => {
      if (!dragging) return

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
    },
    [dragging, location]
  )

  return {
    onPanStart,
    onPanEnd,
    controls,
  }
}
