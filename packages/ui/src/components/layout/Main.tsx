import React from 'react'
import { useDrag } from '@use-gesture/react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useModuleProvider } from '~/providers/modules'
import { createRoutes } from '~/providers/routes'
import { classNames } from '~/utils'
import type { PropsWithChildren, HTMLAttributes } from 'react'
import type { NavigationDirection } from '~/types'

// TODO: Animations via Spring
function useDragNavigation() {
  const { state, dispatch, currentModule } = useModuleProvider()
  const location = useLocation()
  const navigate = useNavigate()
  const routes = createRoutes()

  // TODO: Add values based on aspect ratio or corners ?
  const thresholdX = window.innerWidth / 4
  const thresholdY = window.innerHeight / 4

  return useDrag(({ down, event, cancel, canceled, movement: [mx, my] }) => {
    const target = event.target as HTMLElement
    if (
      ['INPUT', 'TEXTAREA'].includes(target?.tagName) ||
      target?.dataset.input === 'true'
    ) {
      return
    }

    //event.preventDefault()

    let direction: NavigationDirection | null = null

    if (!down && !canceled) {
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
        cancel()

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
  })
}

export default function Main({
  children,
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  const { currentModule } = useModuleProvider()
  const bind = useDragNavigation()
  const defaultColors = 'from-zinc-800 to-zinc-900'
  const colors = currentModule?.route?.background || defaultColors

  return (
    <main
      {...bind()}
      style={{ touchAction: 'none' }}
      className={classNames(
        'relative flex flex-grow items-center overflow-hidden bg-gradient-to-br p-4 text-white transition-all',
        colors
      )}
    >
      {children}
    </main>
  )
}
