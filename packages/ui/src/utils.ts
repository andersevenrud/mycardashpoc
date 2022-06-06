import type { AnyArguments } from '~/types'

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
