export interface Configuration {
  prometheus: {
    endpoint: string
    baseURL: string
  }
}

export default function createConfiguration(): Configuration {
  return {
    prometheus: {
      endpoint: 'http://prometheus:9090',
      baseURL: '/api/v1',
    },
  }
}
