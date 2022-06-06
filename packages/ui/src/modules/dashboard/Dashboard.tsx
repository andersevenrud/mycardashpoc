import React from 'react'
import { useModuleProvider } from '~/providers/modules'
import { formatNumber } from '~/utils'
import Module from '~/components/Module'

function Gauge({
  percent = 0,
  radius,
  ...rest
}: {
  percent: number
  radius: number
}) {
  const strokeWidth = radius * 0.2
  const innerRadius = radius - strokeWidth
  const circumference = innerRadius * 2 * Math.PI
  const arc = circumference * 0.75
  const dashArray = `${arc} ${circumference}`
  const transform = `rotate(135, ${radius}, ${radius})`
  const offset = arc - (percent / 100) * arc

  return (
    <svg height={radius * 2} width={radius * 2} {...rest}>
      <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="15%" stopColor="#aa4444" stopOpacity="1" />
        <stop offset="85%" stopColor="#44aa44" stopOpacity="1" />
      </linearGradient>

      <circle
        cx={radius}
        cy={radius}
        fill="transparent"
        r={innerRadius}
        stroke="#000000aa"
        strokeDasharray={dashArray}
        strokeWidth={strokeWidth}
        transform={transform}
      />

      <circle
        cx={radius}
        cy={radius}
        fill="transparent"
        r={innerRadius}
        stroke="url(#grad)"
        strokeDasharray={dashArray}
        strokeDashoffset={offset}
        strokeWidth={strokeWidth}
        style={{
          transition: 'stroke-dashoffset 0.3s',
        }}
        transform={transform}
      />
    </svg>
  )
}

function NumberGauge({
  min,
  max,
  value,
  unit,
}: {
  min: number
  max: number
  value: number
  unit: string
}) {
  const percent = ((value - min) / (max - min)) * 100

  return (
    <div className="relative">
      <Gauge percent={percent} radius={120} />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="font-mono text-5xl">{value}</div>
          <div>{unit}</div>
        </div>
      </div>
    </div>
  )
}

function DistanceMeter({
  label,
  value,
  unit,
}: {
  label: string
  value: number
  unit: string
}) {
  return (
    <div className="text-center">
      <div className="font-bold">{label}</div>
      <div className="font-mono">{`${formatNumber(value)}${unit}`}</div>
    </div>
  )
}

export default function Dashboard() {
  const {
    state: { dashboard },
  } = useModuleProvider()
  return (
    <Module>
      <div className="flex flex-col items-center justify-center">
        <div className="inline-flex space-x-8">
          <DistanceMeter
            value={dashboard.coolantTemp}
            label="Coolant temp"
            unit="°C"
          />
        </div>
        <div className="flex space-x-8">
          <NumberGauge min={0} max={200} value={dashboard.speed} unit="km/h" />
          <NumberGauge min={0} max={5000} value={dashboard.rpm} unit="RPM" />
        </div>
        <div className="inline-flex space-x-8">
          <DistanceMeter
            value={dashboard.distance}
            label="Current distance"
            unit="km"
          />
          <DistanceMeter
            value={dashboard.totalDistance}
            label="Total distance"
            unit="km"
          />
          <DistanceMeter
            value={dashboard.distanceLeft}
            label="Approx fuel left"
            unit="km"
          />
        </div>
      </div>
    </Module>
  )
}
