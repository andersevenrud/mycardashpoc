import React, { useEffect } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { useToasterErrorHandler, useToaster } from '~/providers/toaster'
import Module from '~/components/Module'
import api from '~/services/obd'
import type { PropsWithChildren } from 'react'

function Button({
  to,
  onClick,
  children,
}: PropsWithChildren<{ to?: string; onClick?: () => void }>) {
  const classNames =
    'flex items-center justify-center rounded-xl bg-black/50 p-8 font-bold shadow-lg hover:bg-black/80 hover:shadow-sm'

  if (to) {
    return (
      <Link className={classNames} to={to}>
        {children}
      </Link>
    )
  }

  return (
    <button type="button" className={classNames} onClick={onClick}>
      {children}
    </button>
  )
}

export function DiagnosticsCodes() {
  const wrap = useToasterErrorHandler()
  const { addToast } = useToaster()

  useEffect(() => {
    wrap(async () => {
      const result = await api.codes.read()

      if (!result.length) {
        addToast({
          type: 'info',
          message: 'No codes found',
        })
      }
    })
  }, [])

  return (
    <div>
      <Button to="/diagnostics">Back</Button>
    </div>
  )
}

export function DiagnosticsMetrics() {
  const wrap = useToasterErrorHandler()
  const { addToast } = useToaster()

  useEffect(() => {
    wrap(async () => {
      const result = await api.metrics()

      if (!result.length) {
        addToast({
          type: 'warning',
          message: 'Not metrics found',
        })
      }
    })
  }, [])

  return (
    <div>
      <Button to="/diagnostics">Back</Button>
    </div>
  )
}

export function DiagnosticsHome() {
  const wrap = useToasterErrorHandler()
  const { addToast } = useToaster()

  const onClearCodesClick = () =>
    wrap(async () => {
      const result = await api.codes.clear()

      addToast({
        type: 'info',
        message: result ? 'Codes cleared' : 'No codes cleared',
      })
    })

  return (
    <div className="grid grid-cols-3 gap-4">
      <Button to="/diagnostics/codes">View codes</Button>
      <Button to="/diagnostics/metrics">View metrics</Button>
      <Button onClick={onClearCodesClick}>Clear Codes</Button>
    </div>
  )
}

export default function Diagnostics() {
  return (
    <Module>
      <div>
        <Outlet />
      </div>
    </Module>
  )
}
