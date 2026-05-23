# AGENTS.md

## 项目概述

Nuxt 4 个人主页项目，包含时钟、天气、搜索引擎切换、书签管理、YAML 配置编辑、Gist 远程备份功能。

## 技术栈

- Nuxt 4.4.x + Vue 3.5 + TypeScript
- Tailwind CSS 6.x（通过 @nuxtjs/tailwindcss 模块）
- pnpm 包管理器
- CodeMirror 6（YAML 编辑器）
- js-yaml（YAML 解析/序列化）
- 高德地图开放平台 API（天气）

## 开发命令

```bash
pnpm dev          # 启动开发服务器
pnpm build        # 构建生产版本
pnpm generate     # 生成静态站点到 dist/
pnpm preview      # 预览构建结果
pnpm lint         # ESLint 检查
pnpm lint:fix     # ESLint 自动修复
pnpm postinstall  # 安装后自动运行 nuxt prepare（通常无需手动执行）
```

## 项目结构

```
app/
├── app.vue              # 入口组件（组装所有部件，onMounted 自动恢复 Gist）
├── assets/main.css      # 全局样式（CSS 变量定义终端风格深色主题）
├── components/          # 自动导入的组件
│   ├── DateTime.vue     # 时钟组件（每秒更新，中文日期，闪烁光标动画）
│   ├── WeatherBox.vue   # 天气组件（高德 API，hover 弹出详情，30 分钟缓存）
│   ├── SearchBox.vue    # 搜索引擎切换（多引擎，{keyword} 模板跳转）
│   ├── BookmarkBox.vue  # 书签管理（分组显示，响应式网格）
│   ├── ConfigEditor.vue # 配置编辑器（YAML 编辑、校验、导入/导出、自动 Gist 同步）
│   ├── GistBackup.vue   # Gist 备份 UI（Token 管理、备份/恢复/断开）
│   └── YamlEditor.vue   # CodeMirror 6 YAML 编辑器（语法高亮、one-dark 主题）
├── .opencode/
│   └── opencode.json   # OpenCode 项目配置（Nuxt MCP Server 启用）
├── .vscode/
│   └── settings.json   # VSCode IntelliSense 配置
└── composables/         # 自动导入的组合式函数
    ├── useConfig.ts     # 配置管理（全局单例，localStorage 持久化）
    ├── useGistBackup.ts # Gist 备份逻辑（GitHub API 同步/恢复/搜索）
    └── useWeather.ts    # 天气 API 逻辑（高德地图地理编码 + 天气查询）
```

## 关键约定

### LLM

- LLM 思考、回答尽量使用简体中文
- 遇到不清楚的问题，多使用 tools、mcp 查阅资料，规划执行方案，然后向用户确认后再执行

### 客户端环境

- 项目已禁用 SSR（`ssr: false`），所有代码仅在浏览器运行

### Tailwind CSS

- VSCode IntelliSense 配置指向 `.nuxt/tailwind/postcss.mjs`
- 全局样式使用 CSS 变量定义在 `app/assets/main.css`
- 不要用 Tailwind 类覆盖全局样式（如 `bg-gray-100`）

### 状态管理

- `useConfig()` 是全局单例，多个组件共享同一个 config ref
- 配置自动同步到 localStorage（通过 watch `{ deep: true }`）
- 不要在 useConfig() 内部创建 watch，会导致重复创建

### 组件设计

- 使用 `<script setup lang="ts">` 语法
- 使用 Tailwind CSS 类进行样式设计
- 时钟使用 `font-mono` 等宽字体

### Gist 备份

- `useGistBackup()` 状态定义在函数内部，每次调用创建独立的响应式实例（`app.vue`、`ConfigEditor`、`GistBackup.vue` 各持一份），但均从同一 localStorage 数据源读取
- 同步策略：比对 `lastSyncDump` 避免重复推送；推送前检查远程是否有更新，如有则拒绝并提示用户刷新
- `ConfigEditor` 保存时自动调用 `gist.sync()`
- `app.vue` 的 `onMounted` 中自动从 Gist 恢复配置

### 配置编辑器

- 使用 js-yaml 的 `dump`/`load` 进行序列化/反序列化
- 保存时校验 `config.search` 和 `config.bookmark` 必须为数组
- 导出为 `.yaml` 文件下载，导入从 `.yaml/.yml` 文件读取

### YAML 编辑器

- 基于 CodeMirror 6，使用 `@codemirror/lang-yaml` 和 `@codemirror/theme-one-dark`
- `v-model` 双向绑定通过 `EditorView.updateListener` 实现
- 组件挂载时创建 EditorView，卸载时 destroy

### 天气

- 通过高德地图 Web 服务 API 获取实况天气
- 三级获取 adcode：浏览器定位 → 逆地理编码 → 地理编码（回退到鹤壁）
- 30 分钟本地缓存（localStorage），`WeatherBox` 支持点击刷新
- 需要在配置的 `weather.amapKey` 中设置高德 API Key

### Docker 部署

- `Dockerfile` 使用多阶段构建：pnpm generate → nginx:alpine 提供静态文件
- `docker-compose.yml` 映射宿主机 `3080` 端口到容器 `80`
- 部署命令：`docker compose up -d --build`
