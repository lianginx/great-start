# AGENTS.md

## 项目概述

Nuxt 4 个人主页项目，包含时钟、搜索引擎切换、书签管理功能。

## 技术栈

- Nuxt 4.4.5 + Vue 3.5 + TypeScript
- Tailwind CSS 6.x（通过 @nuxtjs/tailwindcss 模块）
- pnpm 包管理器

## 开发命令

```bash
pnpm dev          # 启动开发服务器
pnpm build        # 构建生产版本
pnpm generate     # 生成静态站点
```

## 项目结构

```
app/
├── app.vue              # 入口组件
├── assets/main.css      # 全局样式（CSS 变量）
├── components/          # 自动导入的组件
│   ├── DateTime.vue     # 时钟组件
│   ├── SearchBox.vue    # 搜索引擎切换
│   └── BookmarkBox.vue  # 书签管理
└── composables/         # 自动导入的组合式函数
    └── useConfig.ts     # 配置管理（localStorage）
```

## 关键约定

### SSR 兼容

- 使用 `import.meta.client` 检查客户端环境（不要用 `process.client`，Nuxt 4 已废弃）
- localStorage 操作必须包裹在 `import.meta.client` 检查中
- watch 在服务端也会执行，需要添加客户端检查

### Tailwind CSS

- VSCode IntelliSense 配置指向 `.nuxt/tailwind/postcss.mjs`
- 全局样式使用 CSS 变量定义在 `app/assets/main.css`
- 不要用 Tailwind 类覆盖全局样式（如 `bg-gray-100`）

### 状态管理

- `useConfig()` 是全局单例，多个组件共享同一个 config ref
- 配置自动同步到 localStorage（通过 watch）
- 不要在 useConfig() 内部创建 watch，会导致重复创建

### 组件设计

- 使用 `<script setup lang="ts">` 语法
- 使用 Tailwind CSS 类进行样式设计
- 时钟使用 `font-mono` 等宽字体
