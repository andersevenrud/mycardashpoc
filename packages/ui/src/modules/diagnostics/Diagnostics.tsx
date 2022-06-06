import React from 'react'
import { useToasterErrorHandler, useToaster } from '~/providers/toaster'
import Module from '~/components/Module'
import api from '~/services/obd'
import type { PropsWithChildren, HTMLAttributes } from 'react'

function Button({
  children,
  onClick,
}: PropsWithChildren<HTMLAttributes<HTMLButtonElement>>) {
  return (
    <button
      type="button"
      className="flex items-center justify-center rounded-xl bg-black/50 p-8 font-bold shadow-lg hover:bg-black/80 hover:shadow-sm"
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default function Diagnostics() {
  const wrap = useToasterErrorHandler()
  const { addToast } = useToaster()

  const onViewCodesClick = () =>
    wrap(async () => {
      const result = await api.codes.read()

      if (!result.length) {
        addToast({
          type: 'info',
          message: 'No codes found',
        })
      }
    })

  const onViewMetricsClick = () =>
    wrap(async () => {
      const result = await api.metrics()

      if (!result.length) {
        addToast({
          type: 'warning',
          message: 'Not metrics found',
        })
      }
    })

  const onClearCodesClick = () =>
    wrap(async () => {
      const result = await api.codes.clear()

      addToast({
        type: 'info',
        message: result ? 'Codes cleared' : 'No codes cleared',
      })
    })

  return (
    <Module>
      <div>
        <div className="grid grid-cols-3 gap-4">
          <Button onClick={onViewCodesClick}>View codes</Button>
          <Button onClick={onViewMetricsClick}>View metrics</Button>
          <Button onClick={onClearCodesClick}>Clear Codes</Button>
        </div>
      </div>
    </Module>
  )
}
