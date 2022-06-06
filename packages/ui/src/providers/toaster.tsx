import React, { createContext, useEffect, useContext, useState } from 'react'
import { ToasterConfiguration } from '~/config'
import type { PropsWithChildren } from 'react'

export interface Toast {
  message: string
  type: string
}

/**
 * Toaster Context.
 */
export const ToastContext = createContext<{
  toasts: Toast[]
  addToast: (toast: Toast) => void
}>({
  toasts: [],
  addToast: () => null,
})

/**
 * Toaster Context.
 * Provides a basic context to manipulate toaster messages.
 */
export function ToastProvider({
  configuration,
  children,
}: PropsWithChildren<{
  configuration: ToasterConfiguration
}>) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const addToast = (t: Toast) => setToasts([t, ...toasts])

  useEffect(() => {
    const interval = setInterval(() => {
      setToasts(toasts.slice(0, -1))
    }, configuration.duration)

    return () => {
      clearInterval(interval)
    }
  }, [toasts])

  return (
    <ToastContext.Provider value={{ toasts, addToast }}>
      {children}
    </ToastContext.Provider>
  )
}

/**
 * Toaster Hook.
 */
export const useToaster = () => useContext(ToastContext)

/**
 * Wrapper Toaster Hook for handling errors.
 */
export const useToasterErrorHandler = () => {
  const { addToast } = useToaster()

  return async (fn: () => Promise<void> | void) => {
    try {
      await fn()
    } catch (e) {
      console.error(e)

      addToast({
        type: 'error',
        message: (e as Error).message,
      })
    }
  }
}
