// 类型定义
export interface RPCResponse<T = any> {
  status: boolean;
  payload?: T;
  error?: string;
}
