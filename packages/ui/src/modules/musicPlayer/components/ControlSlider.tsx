import React, { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'

export function useSlider({
  knob,
  progress,
  duration,
  elapsed,
  onChange,
}: {
  knob: RefObject<HTMLDivElement>
  progress: RefObject<HTMLDivElement>
  duration: number
  elapsed: number
  onChange?: (value: number) => void
}) {
  const [dragging, setDragging] = useState(false)

  const applyPositionFromValue = (val: number) => {
    const { current: knobEl } = knob
    const { current: progressEl } = progress

    const parentNode = knobEl?.parentNode as HTMLDivElement

    if (knobEl && progressEl && parentNode) {
      const h = knobEl.offsetWidth
      const d = (parentNode.offsetWidth - h) / duration
      const newX = Math.round(val * d)
      knobEl.style.left = `${newX}px`
      progressEl.style.width = `${(val / duration) * 100}%`
    }
  }

  useEffect(() => {
    const { current: knobEl } = knob
    const { current: progressEl } = progress
    const parentNode = knobEl?.parentNode as HTMLDivElement

    let active = false
    let posX = 0
    let newX = -1
    let sliderWidth = 0
    let knobWidth = 0

    const onMouseDown = (ev: MouseEvent) => {
      ev.preventDefault()
      ev.stopPropagation()
      setDragging(true)

      if (knobEl) {
        const box = parentNode.getBoundingClientRect()
        active = true
        sliderWidth = parentNode.offsetWidth
        knobWidth = knobEl.offsetWidth
        posX = box.x
      }
    }

    const onMouseUp = (ev: MouseEvent) => {
      ev.preventDefault()
      ev.stopPropagation()
      setDragging(false)

      if (active && knobEl && progressEl) {
        if (newX !== -1) {
          const maxX = sliderWidth - knobWidth
          const p = newX / maxX
          const v = Math.round(duration * p)

          knobEl.style.left = `${newX}px`
          progressEl.style.width = `${(v / duration) * 100}%`

          onChange?.(v)
        }
      }

      active = false
    }

    const onMouseMove = (ev: MouseEvent) => {
      ev.preventDefault()
      ev.stopPropagation()

      if (active && knobEl && progressEl) {
        const relX = ev.clientX - posX
        const maxX = sliderWidth - knobWidth
        newX = Math.max(0, Math.min(maxX, relX))

        const p = newX / maxX
        const v = Math.round(duration * p)

        knobEl.style.left = `${newX}px`
        progressEl.style.width = `${(v / duration) * 100}%`
      }
    }

    knobEl?.addEventListener('pointerdown', onMouseDown)
    window?.addEventListener('pointerup', onMouseUp)
    window?.addEventListener('pointermove', onMouseMove)

    return () => {
      knobEl?.removeEventListener('pointerdown', onMouseDown)
      window?.removeEventListener('pointerup', onMouseUp)
      window?.removeEventListener('pointermove', onMouseMove)
    }
  }, [duration])

  useEffect(() => {
    if (!dragging) {
      const { current } = knob
      if (current) {
        applyPositionFromValue(elapsed)
      }
    }
  }, [dragging, elapsed])

  return {
    dragging,
    applyPositionFromValue,
  }
}

export default function ControlSlider({
  elapsed,
  duration,
  onChange,
}: {
  elapsed: number
  duration: number
  onChange?: (value: number) => void
}) {
  const knob = useRef<HTMLDivElement>(null)
  const progress = useRef<HTMLDivElement>(null)

  useSlider({
    knob,
    progress,
    duration,
    elapsed,
    onChange,
  })

  return (
    <div className="space-y-2">
      <div className="flex h-5 items-center">
        <div className="relative h-2 grow rounded bg-white">
          <div
            className="absolute inset-0 z-10 rounded-l bg-blue-500"
            ref={progress}
          />
          <div
            data-input="true"
            className="absolute z-20 h-5 w-5 -translate-y-1.5 cursor-pointer rounded-full bg-blue-500 outline outline-1 outline-blue-300"
            ref={knob}
          />
        </div>
      </div>
    </div>
  )
}
