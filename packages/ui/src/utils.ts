import { useCallback } from 'react'
import { differenceWith, isEqual, fromPairs, toPairs } from 'lodash-es'
import type { AnyAction, AnyState, AnyReducer, AnyArguments } from '~/types'

/**
 * Create a string of classnames based on anything
 */
export const classNames = (...args: AnyArguments) =>
  args.filter(Boolean).flat().join(' ')

/**
 * Formats a number to browser locale.
 */
export const formatNumber = (number: number) =>
  number.toLocaleString(undefined, {
    minimumFractionDigits: 0,
  })

/**
 * Formats seconds timespan into a human readable time string.
 */
export const spanToIntervals = (time: number, duration: number) =>
  [secondsToTime(time), secondsToTime(duration)].join(' / ')

/**
 * Formats seconds into a human readable time string.
 */
export function secondsToTime(input: number | string) {
  const seconds = parseInt(input as string)
  const minutes = Math.floor(seconds / 60)
  const secs = String(seconds % 60).padStart(2, '0')
  return `${minutes}:${secs}`
}

/**
 * Basic wrapper for logging dispatches and state changes
 * This is only for debugging purposes
 */
export const reducerLogger = (reducer: AnyReducer) =>
  useCallback(
    (state: AnyState, action: AnyAction) => {
      const next = reducer(state, action)
      const changes = fromPairs(
        differenceWith(toPairs(next), toPairs(state), isEqual)
      )

      console.group(action.type)
      console.debug('Payload', action.payload)
      console.debug('State diff', changes)
      console.groupEnd()

      return next
    },
    [reducer]
  )

/**
 * Checks if given element is an input element
 */
export const isInputElement = (el: HTMLElement) =>
  ['INPUT', 'TEXTAREA'].includes(el?.tagName) || el?.dataset.input === 'true'

/**
 * Checks if target is inside some kind of scrollable
 */
export function isInsideScrollable(target: HTMLElement) {
  let el: HTMLElement | null = target
  while (el) {
    if (el.scrollHeight > el.offsetHeight || el.scrollWidth > el.offsetWidth) {
      // FIXME: This is just because in certain cases using truncate will squash a box slightly
      if (!el.classList.contains('truncate')) {
        return true
      }
    }

    el = el.parentNode as HTMLElement
  }

  return false
}
