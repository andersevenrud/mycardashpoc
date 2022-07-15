import React, { useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { subMinutes } from 'date-fns'
import { useToasterErrorHandler, useToaster } from '~/providers/toaster'
import { classNames } from '~/utils'
import Module from '~/components/Module'
import api from '~/services/obd'
import type { PropsWithChildren } from 'react'

function Button({
  large,
  to,
  onClick,
  children,
}: PropsWithChildren<{ large?: boolean; to?: string; onClick?: () => void }>) {
  const classes = classNames(
    'flex items-center justify-center rounded-xl bg-black/50 font-bold shadow-lg hover:bg-black/80 hover:shadow-sm',
    large ? 'p-8' : 'px-4 py-2'
  )

  if (to) {
    return (
      <Link className={classes} to={to}>
        {children}
      </Link>
    )
  }

  return (
    <button type="button" className={classes} onClick={onClick}>
      {children}
    </button>
  )
}

export function DiagnosticsCodes() {
  const wrap = useToasterErrorHandler()
  const { addToast } = useToaster()
  const [table, setTable] = useState<any[]>([])

  const onClearCodesClick = () =>
    wrap(async () => {
      const result = await api.codes.clear()

      addToast({
        type: 'info',
        message: result ? 'Codes cleared' : 'No codes cleared',
      })
    })

  useEffect(() => {
    wrap(async () => {
      const result = await api.codes.read()
      setTable(result)
    })
  }, [])

  return (
    <div className="flex h-full shrink grow flex-col space-y-4 overflow-hidden">
      <div className="flex justify-end space-x-2">
        <Button onClick={onClearCodesClick}>Clear Codes</Button>
        <Button to="/diagnostics">Back</Button>
      </div>
      <div className="shrink grow overflow-auto">
        {table.length > 0 ? (
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
        ) : (
          <div className="pt-12 text-center font-bold">No codes</div>
        )}
      </div>
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
  return (
    <div className="flex justify-center space-x-4">
      <Button large to="/diagnostics/codes">
        View codes
      </Button>
      <Button large to="/diagnostics/metrics">
        View metrics
      </Button>
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
