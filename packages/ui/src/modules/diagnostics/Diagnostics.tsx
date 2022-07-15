import React, { useEffect, useRef, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { subMinutes } from 'date-fns'
import { Sparklines, SparklinesLine } from 'react-sparklines-typescript'
import { useToasterErrorHandler, useToaster } from '~/providers/toaster'
import { classNames } from '~/utils'
import Module from '~/components/Module'
import api from '~/services/obd'
import type { PropsWithChildren } from 'react'
import type { OBDMetric } from '~/services/obd'

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

  const load = () =>
    wrap(async () => {
      const result = await api.codes.read()
      setTable(result)
    })

  const onClearCodesClick = () =>
    wrap(async () => {
      const result = await api.codes.clear()

      addToast({
        type: 'info',
        message: result ? 'Codes cleared' : 'No codes cleared',
      })
    })

  const onRefresh = () => load()

  useEffect(() => {
    load()
  }, [])

  return (
    <div className="flex h-full shrink grow flex-col space-y-4 overflow-hidden">
      <div className="flex justify-end space-x-2">
        <Button onClick={onRefresh}>Refresh</Button>
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
  const pause = useRef(false)
  const { addToast } = useToaster()
  const [table, setTable] = useState<OBDMetric[]>([])

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

      const tableValues = result.filter(({ metric }) => {
        return metric.name.startsWith('obd_')
      })

      setTable(tableValues)
    })

  const initialize = () => {
    let loaded = false

    const interval = setInterval(() => {
      if (!pause.current && loaded) {
        load()
      }
    }, 2500)

    load().then(() => (loaded = true))

    return interval
  }

  const onTogglePause = () => (pause.current = !pause.current)

  useEffect(() => {
    const interval = initialize()

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="flex h-full shrink grow flex-col space-y-4 overflow-hidden">
      <div className="flex justify-end space-x-2">
        <Button onClick={onTogglePause}>
          {pause.current ? 'Resume' : 'Pause'}
        </Button>
        <Button to="/diagnostics">Back</Button>
      </div>
      <div className="shrink grow overflow-auto">
        {table.length === 0 && (
          <div className="pt-12 text-center font-bold">No metrics</div>
        )}

        {table.map(({ metric: { name }, values }) => (
          <div key={name} className="space-y-2 p-2">
            <div className="flex justify-between">
              <div>{name.replace('obd_', '').replace(/_/g, ' ')}</div>
              <div>{values[values.length - 1].value}</div>
            </div>
            <div className="h-8">
              <Sparklines
                data={values.map(({ value }) => value)}
                limit={Math.min(values.length, 50)}
                height={20}
                width={1000}
                style={{ width: '100%' }}
              >
                <SparklinesLine color="white" />
              </Sparklines>
            </div>
          </div>
        ))}
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
