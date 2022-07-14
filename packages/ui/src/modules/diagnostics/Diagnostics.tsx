import React, { useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { subMinutes } from 'date-fns'
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
  const [table, setTable] = useState<[string, number][]>([])

  const load = () =>
    wrap(async () => {
      const now = new Date()
      const result = await api.metrics({
        startsAt: subMinutes(now, 1).toISOString(),
        endsAt: now.toISOString(),
        step: 1,
        name: '',
      })

      if (!result.length) {
        addToast({
          type: 'warning',
          message: 'Not metrics found',
        })
      }

      const tableValues = result
        .filter(({ metric }) => {
          return metric.name.startsWith('obd_')
        })
        .map(({ metric, values }) => {
          return [
            metric.name.replace('obd_', ''),
            values[values.length - 1].value,
          ]
        })

      setTable(tableValues as [string, number][])
    })

  const onRefresh = () => load()

  useEffect(() => {
    load()
  }, [])

  return (
    <div className="flex h-full shrink grow flex-col space-y-4 overflow-hidden">
      <div className="flex justify-end space-x-2">
        <Button onClick={onRefresh}>Refresh</Button>
        <Button to="/diagnostics">Back</Button>
      </div>
      <div className="shrink grow overflow-auto">
        <table className="w-full">
          <tbody>
            {table.map(([name, value]) => (
              <tr key={name}>
                <td>{name}</td>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
      <Outlet />
    </Module>
  )
}
