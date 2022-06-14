import React from 'react'
import { spanToIntervals } from '~/utils'

export default function TimeInterval({
  elapsed,
  duration,
}: {
  elapsed: number
  duration: number
}) {
  return <time>{spanToIntervals(elapsed, duration)}</time>
}
