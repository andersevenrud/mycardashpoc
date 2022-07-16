import axios from 'axios'

export type OBDErrorCode = [string, string]

export interface OBDResponse<T> {
  result: T
}

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
    read: () =>
      post<OBDResponse<OBDErrorCode[]>>('/codes/read').then(
        ({ result }) => result
      ),

    clear: () =>
      post<OBDResponse<boolean>>('/codes/clear').then(({ result }) => result),
  },
}
