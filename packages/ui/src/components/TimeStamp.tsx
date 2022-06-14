import React from 'react'
import { secondsToTime } from '~/utils'

export default function TimeSpan({ value }: { value: number }) {
  return <time>{secondsToTime(value)}</time>
}
