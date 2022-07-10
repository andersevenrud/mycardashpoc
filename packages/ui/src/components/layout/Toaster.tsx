import React from 'react'
import { useToaster } from '~/providers/toaster'
import { classNames } from '~/utils'
import type { Toast } from '~/providers/toaster'

const toastClassNames = (t: Toast) =>
  classNames(
    'rounded px-2 py-1 text-center shadow',
    t.type === 'info' && 'bg-green-700/80',
    t.type === 'warning' && 'bg-yellow-700/80',
    t.type === 'error' && 'bg-red-700/80'
  )

export default function Toaster() {
  const { toasts } = useToaster()

  return (
    <div className="absolute bottom-0 right-0 z-40 m-2 space-y-2">
      {toasts.map((toast, index) => (
        <div className={classNames(toastClassNames(toast))} key={index}>
          {toast.message}
        </div>
      ))}
    </div>
  )
}
