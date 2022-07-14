export interface Configuration {
  prometheus: {
    endpoint: string
    baseURL: string
  }
}

export default function createConfiguration(): Configuration {
  return {
    prometheus: {
      endpoint: 'https://prometheus',
      baseURL: '/api/v1',
    },
  }
}
