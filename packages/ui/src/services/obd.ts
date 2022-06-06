import axios from 'axios'
import type { AnyArguments } from '~/types'

export interface OBDMetric {
  name: string
}

export interface OBDErrorCode {
  name: string
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
const post = <T>(endpoint: string, ...data: AnyArguments): Promise<T> =>
  api.post(endpoint, data).then((response) => response.data)

/**
 * Public OBD API
 */
export default {
  metrics: () => post<OBDMetric[]>('/metrics'),

  codes: {
    read: () => post<OBDErrorCode[]>('/codes/read'),
    clear: () => post<boolean>('/codes/clear'),
  },
}
