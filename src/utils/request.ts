import axios, { type AxiosRequestConfig } from 'axios'
import stores from '../stores/'

// import { useAuthStore } from '../stores/auth'
import { useLoadingStore } from '../stores/loading'

import { ApiResponseError } from './errors'

// const authStore = useAuthStore(stores)
const loadingStore = useLoadingStore(stores)

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: import.meta.env.VITE_API_TIMEOUT,
  withCredentials: true,
})

/**
 * 拦截请求
 */
instance.interceptors.request.use((config) => {
  if ((config as AxiosRequestConfigEx).showLoading !== false) {
    loadingStore.begin()
  }

//   if (authStore.token) {
//     config.headers.Authorization = `Bearer ${authStore.token}`
//   }

//   config.headers['Client-ID'] = authStore.clientID

  return config
})

/**
 * 拦截响应
 */
instance.interceptors.response.use(
  (response) => {
    if ((response.config as AxiosRequestConfigEx).showLoading !== false) {
      loadingStore.end()
    }

    const res = response.data

    if (res.status === 'failed' && !(response.config as AxiosRequestConfigEx).respondFailed) {
      throw new ApiResponseError(res.msg || '', res)
    }

    return res
  },
  (error) => {
    loadingStore.clear()

    throw error
  },
)

export default instance

export const httpGet = <T = any, R = ApiResponse<T>, D = any>(
  url: string,
  config?: AxiosRequestConfigEx<D>,
): Promise<R> => {
  return instance(url, { ...config, method: 'GET' })
}

export const httpPost = <T = any, R = ApiResponse<T>, D = any>(
  url: string,
  config?: AxiosRequestConfigEx<D>,
): Promise<R> => {
  return instance(url, { ...config, method: 'POST' })
}

export interface ApiResponse<T = any> {
  status: 'success' | 'failed'
  msg: string | null
  error_code?: string | null
  data: T
}

export interface AxiosRequestConfigEx<D = any> extends AxiosRequestConfig<D> {
  respondFailed?: boolean
  showLoading?: boolean
}
