export function getChromeStorage<T = any>(key: string): Promise<T> {
  return new Promise<T>((resolve) => {
    chrome.storage.local.get([key], (res) => resolve(res[key]));
  });
}
/**
 * 设置扩展存储
 *
 * @param key
 * @param data
 * @returns
 */
export function setChromeStorage(key: string, data: any) {
  return chrome.storage.local.set({ [key]: data })
}
