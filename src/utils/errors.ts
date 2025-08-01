import { ApiResponse } from "./request"


export class BusinessError extends Error {
  public code: string | undefined

  constructor(message: string, code?: string) {
    super(message)

    this.name = 'BusinessError'
    this.code = code
  }
}




export class ApiResponseError extends BusinessError {
  public res: ApiResponse

  constructor(message: string, res: ApiResponse) {
    super(message)

    this.name = 'ApiResponseError'
    this.res = res
  }
}

export class FunctionReentryError extends Error {
  constructor() {
    super('Function Reentry Prevented')

    this.name = 'FunctionReentryError'
  }
}
