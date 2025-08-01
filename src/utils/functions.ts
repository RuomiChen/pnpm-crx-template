import { RPCResponse } from "../types";
import { BusinessError } from "./errors";



/**
 * RPC 分发器
 */
export async function dispatch<
  T extends Record<string, (...args: any[]) => any>,
  K extends keyof T
>(
  registerCenter: T,
  method: K,
  ...args: Parameters<T[K]>
): Promise<RPCResponse<Awaited<ReturnType<T[K]>>>> {
  const handler = registerCenter[method];

  if (!handler) {
    return {
      status: false,
      error: `method [${String(method)}] not found`,
    };
  }

  try {
    const res = await handler(...args);
    return {
      status: true,
      payload: res,
    };
  } catch (error: any) {
    return {
      status: false,
      error: error.message || String(error),
    };
  }
}

/**
 * 远程调用
 *
 * @param method
 * @param args
 * @returns
 */
export function chromeRPC(method: string, ...args: any) {
  return new Promise<any>((resolve, reject) => {
    chrome.runtime.sendMessage({ method, args }, (res) => {
      if (res.status === true) {
        resolve(res.payload)
      } else {
        reject(new BusinessError(res.error))
      }
    })
  })
}
/**
 * 裁剪图片
 *
 * @param url
 * @param width
 * @param height
 * @returns
 */
export function cutImage(url: string, width = 800, height = 800) {
  return new Promise<Blob | null>((resolve, reject) => {
    const img = new Image()

    img.crossOrigin = 'Anonymous'

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')

        if (ctx === null) {
          return reject('画布创建失败')
        }

        const origWidth = img.naturalWidth || img.width
        const origHeight = img.naturalHeight || img.height

        const scale = Math.min(width / origWidth, height / origHeight)

        const newWidth = origWidth * scale
        const newHeight = origHeight * scale

        const x = (width - newWidth) / 2
        const y = (height - newHeight) / 2

        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, width, height)

        ctx.imageSmoothingQuality = 'high'
        ctx.imageSmoothingEnabled = true

        ctx.drawImage(img, x, y, newWidth, newHeight)

        canvas.toBlob(resolve, 'image/jpeg', 0.9)
      } catch (error: any) {
        reject(`图片处理失败: ${error.message || error}`)
      }
    }

    img.onerror = (
      event: Event | string,
      source?: string,
      lineno?: number,
      colno?: number,
      error?: Error,
    ) => reject('图片加载失败：' + error?.message || error || '未知错误')

    img.src = url
  })
}