# 🚀 Vue3 Chrome Extension Template

基于 `Vue3 + TypeScript + Vite + Pinia + Element Plus` 构建的 Chrome 扩展开发模板，内置开发、构建、打包、代码混淆支持，适合快速启动高质量插件项目。

## 🧱 技术栈

| 技术         | 描述                                     |
|--------------|------------------------------------------|
| [Vue 3](https://vuejs.org/) | 主框架，使用 Composition API |
| [TypeScript](https://www.typescriptlang.org/) | 类型系统 |
| [Pinia](https://pinia.vuejs.org/) | 轻量状态管理 |
| [Element Plus](https://element-plus.org/) | UI 组件库 |
| [Axios](https://axios-http.com/) | 网络请求 |
| [Lodash](https://lodash.com/) | 常用函数工具库 |
| [Vite](https://vitejs.dev/) | 构建工具，极速热更新 |
| [crxjs](https://github.com/crxjs/chrome-extension-tools) | Chrome 插件构建支持 |
| [Gulp](https://gulpjs.com/) + `gulp-zip` | 插件打包产物压缩 |
| [vite-plugin-javascript-obfuscator](https://github.com/javascript-obfuscator/javascript-obfuscator) | JS 代码混淆插件 |

## 📦 安装

使用 [pnpm](https://pnpm.io/)：

```bash
pnpm install
```

🧪 开发模式
启动开发环境并监听文件更改（支持自动刷新 popup / options 页面）：
```bash
pnpm dev
```

🚀 构建扩展
构建生产版 Chrome 扩展：
```bash
pnpm build
```
产物位于 dist/ 文件夹，可直接加载至 Chrome 浏览器的扩展页面。

📦 打包 ZIP 文件（可上传 Chrome Web Store）
```bash
pnpm zip
```
🔒 混淆配置
构建时 JS 会自动使用 vite-plugin-javascript-obfuscator 进行混淆，可在 vite.config.ts 中自定义配置。

🧩 支持的页面类型
✅ popup 页面

✅ options 设置页面

✅ background 脚本

✅ content script 注入页面脚本

✅ 动态消息通信（chrome.runtime.sendMessage 封装）

📄 License
MIT - 项目可自由用于商业和开源用途。