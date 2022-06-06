import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHistory,
  faPowerOff,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons'
import { useModuleProvider } from '~/providers/modules'
import { useConnectionProvider } from '~/providers/connection'
import { classNames } from '~/utils'
import type { PropsWithChildren, HTMLAttributes } from 'react'

export function HeaderComponent({
  className,
  children,
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return <nav className={className}>{children}</nav>
}

export function HeaderNavComponent() {
  const navigate = useNavigate()
  const { state, dispatch, currentModule } = useModuleProvider()

  const onHomeClick = () => {
    if (currentModule?.beforeNavigate) {
      const moduleState = state[currentModule.name]
      currentModule.beforeNavigate(null, moduleState, dispatch)
    }
    navigate('/')
  }

  return (
    <HeaderComponent className="flex items-center">
      <div className="flex items-center space-x-2" onClick={onHomeClick}>
        <span>{currentModule?.route?.title || 'Home'}</span>
      </div>
    </HeaderComponent>
  )
}

export function HeaderStatusComponent() {
  const { connected } = useConnectionProvider()

  return (
    <HeaderComponent className="flex items-center space-x-2">
      <FontAwesomeIcon icon={faHistory} className="opacity-30" />

      <FontAwesomeIcon
        icon={faPowerOff}
        className={classNames(!connected && 'opacity-30')}
      />

      <FontAwesomeIcon icon={faExclamationTriangle} className="opacity-30" />
    </HeaderComponent>
  )
}

export function HeaderClockComponent() {
  const [time, setTime] = useState('00:00')

  useEffect(() => {
    const interval = setInterval(() => {
      const n = new Date()
      const s = [n.getHours(), n.getMinutes()]
        .map((s) => String(s).padStart(2, '0'))
        .join(':')

      setTime(s)
    }, 5000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <HeaderComponent>
      <span>{time}</span>
    </HeaderComponent>
  )
}

export default function Header() {
  return (
    <header className="flex gap-x-2 bg-black p-2 text-white drop-shadow">
      <HeaderNavComponent />
      <div className="ml-auto flex gap-x-4">
        <HeaderStatusComponent />
        <HeaderClockComponent />
      </div>
    </header>
  )
}
