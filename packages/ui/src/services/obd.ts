import axios from 'axios'

export interface OBDMetric {
  metric: {
    name: string
    labels: Record<string, string>
  }
  values: {
    time: string
    value: number
  }[]
}

export interface OBDErrorCode {
  name: string
}

export interface OBDMetricBody {
  startsAt: string
  endsAt: string
  name: string
  step: number
}

/**
 * Client for API
 */
const api = axios.create({
  baseURL: '/api/obd',
})

/**
 * Wrapper for making a POST request
 */
const post = <T>(endpoint: string, data?: any): Promise<T> =>
  api.post(endpoint, data).then((response) => response.data)

/**
 * Public OBD API
 */
export default {
  metrics: (body: OBDMetricBody) => post<OBDMetric[]>('/metrics', body),

  codes: {
    read: () => post<OBDErrorCode[]>('/codes/read'),
    clear: () => post<boolean>('/codes/clear'),
  },
}
