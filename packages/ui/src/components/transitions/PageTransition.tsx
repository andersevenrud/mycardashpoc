import React from 'react'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { useLocation } from 'react-router-dom'
import type { AnyPropsWithChildren } from '~/types'

export default function PageTransition({ children }: AnyPropsWithChildren) {
  const location = useLocation()

  return (
    <TransitionGroup component={null}>
      <CSSTransition key={location.key} timeout={300} classNames="page">
        {children}
      </CSSTransition>
    </TransitionGroup>
  )
}
