import React, { createContext, useEffect, useContext, useState } from 'react'
import type { AnyPropsWithChildren } from '~/types'

/**
 * Keyboarder Context.
 */
export const KeyboardContext = createContext<{
  input: HTMLInputElement | null
  setInput: (input: HTMLInputElement | null) => void
}>({
  input: null,
  setInput: () => null,
})

/**
 * Creates an observer to detect if an input is lost from DOM.
 */
function createObserver(el: HTMLElement | null, callback: () => void) {
  if (el) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          if (
            Array.from(mutation.removedNodes).find((pel) => pel.contains(el))
          ) {
            callback()
          }
        }
      })
    })

    return observer
  }

  return null
}

/**
 * Keyboarder Context.
 */
export function KeyboardProvider({ children }: AnyPropsWithChildren) {
  const [input, setInput] = useState<HTMLInputElement | null>(null)

  const onFocus = (ev: FocusEvent) => {
    const target = ev.target as HTMLInputElement | null

    if (!target || ['text', 'number'].includes(target.type)) {
      setInput(target)
    }
  }

  const onBlur = () => {} //setInput(null)

  useEffect(() => {
    document.addEventListener('focusin', onFocus)
    document.addEventListener('focusout', onBlur)

    return () => {
      document.removeEventListener('focusin', onFocus)
      document.removeEventListener('focusout', onBlur)
    }
  }, [])

  useEffect(() => {
    const observer = createObserver(input, () => {
      setInput(null)
    })

    if (observer) {
      observer.observe(document.body, { childList: true, subtree: true })
    }

    return () => {
      if (observer) {
        observer.disconnect()
      }
    }
  }, [input])

  return (
    <KeyboardContext.Provider value={{ input, setInput }}>
      {children}
    </KeyboardContext.Provider>
  )
}

/**
 * Keyboarder Hook.
 */
export const useKeyboard = () => useContext(KeyboardContext)
