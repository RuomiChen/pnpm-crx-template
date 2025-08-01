export interface ApiResponse<T = any> {
  status: 'success' | 'failed'
  msg: string | null
  error_code?: string | null
  data: T
}