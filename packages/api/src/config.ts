export interface OBDConfiguration {
  pollFreq: number
  pollers: string[]
}

export interface Configuration {
  obd: OBDConfiguration
}

export default function createConfiguration(): Configuration {
  return {
    obd: {
      pollFreq: 2000,
      pollers: [
        // 'vss'
        // 'rpm'
        // 'temp'
        // 'load_pct'
        // 'map'
        // 'frp'
      ],
    },
  }
}
