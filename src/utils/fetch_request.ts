import { isEmpty, isObject, transform } from 'lodash'
import { ApiResponseError } from './errors'

export interface RequestConfig {
  params?: Record<string, any>
  headers?: Record<string, string>
  response_type?: 'json' | 'text'
}

function encodeFormData(data: Record<string, any>): string {
  return transform(
    data,
    (result, value, key) => {
      if (isObject(value) && Array.isArray(value)) {
        for (const [nestedKey, nestedValue] of Object.entries(value)) {
          result.push(
            `${encodeURIComponent(key)}[${encodeURIComponent(nestedKey)}]=${encodeURIComponent(nestedValue)}`,
          )
        }
      } else {
        result.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      }
    },
    [] as string[],
  ).join('&')
}

async function request(
  method: 'GET' | 'POST',
  url: string,
  data?: Record<string, any> | FormData,
  config: RequestConfig = {},
): Promise<any> {
  if (!isEmpty(config.params)) {
    const query_str = encodeFormData(config.params)

    if (url.includes('?')) {
      url += `&${query_str}`
    } else {
      url += `?${query_str}`
    }
  }

  const headers = new Headers(config.headers)

  let body: BodyInit | null = null

  if (method === 'POST') {
    if (data instanceof FormData) {
      body = data
    } else if (!isEmpty(data)) {
      if (config.headers && config.headers['content-type'] === 'application/json') {
        body = JSON.stringify(data)
      } else {
        headers.set('Content-Type', 'application/x-www-form-urlencoded')

        body = encodeFormData(data)
      }
    }
  }

  const response = await fetch(url, {
    method,
    headers,
    body,
  })

  if (!response.ok) {
    throw new ApiResponseError(response.statusText, await response.json())
  }

  if (config.response_type === 'text') {
    return await response.text()
  }

  return await response.json()
}

export const httpGet = (url: string, params?: Record<string, any>, headers?: Record<string, any>) =>
  request('GET', url, undefined, { params, headers })

export const httpPost = (
  url: string,
  data?: Record<string, any> | FormData,
  config?: RequestConfig,
) => request('POST', url, data, config)
