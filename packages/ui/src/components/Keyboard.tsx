import React, { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import Keyboard from 'react-simple-keyboard'
import { useKeyboard } from '~/providers/keyboard'
import type { SimpleKeyboard } from 'react-simple-keyboard'
import 'react-simple-keyboard/build/css/index.css'

const layout = {
  default: [
    'q w e r t y u i o p',
    'a s d f g h j k l',
    '{shift} z x c v b n m {backspace}',
    '{numbers} {close} {space} {ent}',
  ],
  shift: [
    'Q W E R T Y U I O P',
    'A S D F G H J K L',
    '{shift} Z X C V B N M {backspace}',
    '{numbers} {close} {space} {ent}',
  ],
  numbers: ['1 2 3', '4 5 6', '7 8 9', '{abc} 0 {backspace}'],
}

const display = {
  '{numbers}': '123',
  '{ent}': 'return',
  '{escape}': 'esc ⎋',
  '{tab}': 'tab ⇥',
  '{backspace}': '⌫',
  '{capslock}': 'caps lock ⇪',
  '{shift}': '⇧',
  '{controlleft}': 'ctrl ⌃',
  '{controlright}': 'ctrl ⌃',
  '{altleft}': 'alt ⌥',
  '{altright}': 'alt ⌥',
  '{metaleft}': 'cmd ⌘',
  '{metaright}': 'cmd ⌘',
  '{abc}': 'ABC',
  '{close}': 'Close',
}

export default function KeyboardWrapper() {
  const location = useLocation()
  const { input, setInput } = useKeyboard()
  const keyboard = useRef<SimpleKeyboard>()

  function handleShift() {
    const currentLayout = keyboard.current?.options?.layoutName
    const shiftToggle = currentLayout === 'default' ? 'shift' : 'default'

    keyboard.current?.setOptions?.({
      layoutName: shiftToggle,
    })
  }

  function handleNumbers() {
    const currentLayout = keyboard.current?.options?.layoutName
    const numbersToggle = currentLayout !== 'numbers' ? 'numbers' : 'default'

    keyboard.current?.setOptions({
      layoutName: numbersToggle,
    })
  }

  function onChange(value: string) {
    if (input) {
      input.value = value
      input.dispatchEvent(new Event('input', { bubbles: true }))
    }
  }

  function onKeyPress(button: string) {
    switch (button) {
      case '{shift}':
      case '{lock}':
        handleShift()
        break

      case '{numbers}':
      case '{abc}':
        handleNumbers()
        break

      case '{close}':
        setInput(null)
        break
    }
  }

  useEffect(() => {
    if (input) {
      keyboard.current?.setInput(input.value)
    }
  }, [keyboard, input])

  useEffect(() => {
    setInput(null)
  }, [location.key])

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 text-black">
      {!!input && (
        <Keyboard
          keyboardRef={(r) => (keyboard.current = r)}
          onChange={onChange}
          onKeyPress={onKeyPress}
          mergeDisplay={true}
          layoutName="default"
          layout={layout}
          display={display}
        />
      )}
    </div>
  )
}
