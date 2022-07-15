export interface Configuration {
  obd: {
    endpoint: string
  }
  prometheus: {
    endpoint: string
    baseURL: string
  }
}

export default function createConfiguration(): Configuration {
  return {
    obd: {
      endpoint: 'http://obd_exporter:8080',
    },
    prometheus: {
      endpoint: 'http://prometheus:9090',
      baseURL: '/api/v1',
    },
  }
}
