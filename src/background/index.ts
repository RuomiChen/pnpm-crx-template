import { getChromeStorage } from "../utils/chrome_func";
import { dispatch } from "../utils/functions";

console.log('background is running')

const REGISTER_CENTER: Record<string, (...args: any) => any> = {
  GET_CHROME_STORAGE: getChromeStorage,
}
chrome.runtime.onMessage.addListener(
  (
    request: { method: keyof typeof REGISTER_CENTER; args: any[] },
    _,
    response
  ) => {
    dispatch(REGISTER_CENTER, request.method, ...request.args).then(response);

    return true; // 表示异步响应
  }
);


