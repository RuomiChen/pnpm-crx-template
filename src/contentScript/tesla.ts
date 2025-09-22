console.log('tesla loading...');
import { ElMessage } from 'element-plus';
import 'element-plus/dist/index.css';
import { getChromeStorage } from '../utils/chrome_func';

/**
 * Sleep
 *
 * @param time 秒
 */
export function sleep(time: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, time * 1000));
}

/**
 * 等待元素出现
 * @param selector 元素选择器
 * @param timeout 超时时间，默认 5000ms
 */
function waitForElement(selector: string, timeout = 5000): Promise<Element> {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const timer = setInterval(() => {
      const el = document.querySelector(selector);
      if (el) {
        clearInterval(timer);
        resolve(el);
      } else if (Date.now() - start > timeout) {
        clearInterval(timer);
        reject(new Error(`等待元素超时: ${selector}`));
      }
    }, 200);
  });
}

/**
 * 模拟点击
 */
function simulateClick(el: any) {
  if (!el) return;
  const event = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  el.dispatchEvent(event);
}
/**
 * 勾选复选框/单选框
 */
function checkInput(selector: string) {
  const el = document.querySelector(selector) as HTMLInputElement;
  if (!el) {
    console.warn("未找到 input:", selector);
    return;
  }

  if (!el.checked) {
    el.checked = true; // 设置为选中
    el.dispatchEvent(new Event("change", { bubbles: true }));
    el.dispatchEvent(new Event("input", { bubbles: true }));
  }
}
/**
 * 通用设置值（支持 React/Vue 受控组件）
 */
function setVal(selector: any, value: any) {
  const el = document.querySelector(selector) as any;
  if (!el) {
    console.warn('找不到元素:', selector);
    return;
  }

  el.value = value;
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.dispatchEvent(new Event('change', { bubbles: true }));
}

/**
 * 自动填充 + 点击验证码按钮
 */
async function fillAndSend({ lastName, firstName, email, phone, idCard }: any) {
  await waitForElement('[data-id="last-name-textbox"]');
  await waitForElement('#FIRST_NAME');
  await waitForElement('#EMAIL');
  const phoneEl = await waitForElement('#totp__phone-number-input') as HTMLElement;
  await waitForElement('#IDENTIFICATION_NUMBER');

  setVal('[data-id="last-name-textbox"]', lastName);
  setVal('#FIRST_NAME', firstName);
  setVal('#EMAIL', email);
  setVal('#EMAIL_CONFIRM', email);
  setVal('#totp__phone-number-input', phone);
  setVal('#IDENTIFICATION_NUMBER', idCard);
  console.log(phoneEl.outerHTML)
  // ⚡ 关键：再聚焦 + 点击手机号输入框，触发受控逻辑
  phoneEl.focus();
  phoneEl.click();
  await sleep(0.5);

  // 点击验证码按钮，重试 5 次
  for (let i = 0; i < 5; i++) {
    const btn = document.querySelector('#totp__send-code-btn') as HTMLElement;
    if (btn) {
      btn.focus();
      btn.click();
      ElMessage.success('点击验证码按钮成功');
      return;
    }
    ElMessage.error('验证码按钮没找到，重试中...');
    await sleep(0.3);
  }
  console.error('验证码按钮触发失败');
}


async function main() {
  console.log('开始执行表单填充逻辑...');
  // 打开表单按钮
  const openBtn1 = await waitForElement('.tds-btn.aside-footer--button');
  simulateClick(openBtn1);

  // 打开表单按钮
  const openBtn = await waitForElement('[data-gio-eventname="web_design_payment_place"]');
  simulateClick(openBtn);

  // 获取配置
  const { content } = await getChromeStorage('formConfig');
  const lines = content.trim().split('\n');
  const [lastName, firstName] = lines[0].trim().split(/\s+/);
  const email = lines[1]?.trim() || '';
  const phone = lines[2]?.trim() || '';
  const idCard = lines[3]?.trim() || '';

  // 填充表单并点击验证码
  await fillAndSend({ lastName, firstName, email, phone, idCard });

  // 点击 footer 按钮和支付按钮
  const footerBtn = await waitForElement('.tds-btn.aside-footer--button');
  simulateClick(footerBtn);
  await sleep(0.3);

  // const payBtn = await waitForElement('[data-gio-eventname="web_design_payment_place"]');
  // simulateClick(payBtn);

  // 协议 & 支付方式
  const selectors = [
    "#option-WECHATPAY",
    "#ORDER_CONSENT",
    "#RETURN_POLICY_CONSENT",
    "#VIN_INTERNATIONAL_TRANSFER_CONSENT",
  ];

  for (const sel of selectors) {
    try {
      const el = await waitForElement(sel) as HTMLElement;
      checkInput(sel);
      el.focus();
      el.click();
    } catch (err) {
      console.warn("找不到协议元素", sel);
    }
  }

  // 支付方式：label 绑定 input
  try {
    const wechatLabel = await waitForElement('label[for="option-WECHATPAY"]');
    simulateClick(wechatLabel); // 触发 label 的点击
    checkInput("#option-WECHATPAY"); // 确保 input 真正选中
  } catch (err) {
    console.warn("微信支付选项未找到");
  }

  // 提交按钮
  try {
    const submitBtn = await waitForElement('button.submit-order-only', 5000);
    simulateClick(submitBtn);
  } catch (err) {
    console.error('提交按钮未找到');
  }
}

// 延迟执行，确保 DOM 初始化
setTimeout(main, 500);
