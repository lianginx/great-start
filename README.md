# great-start

一个简约的浏览器起始页，包含时钟、搜索引擎切换和书签管理。

## 功能

- **时钟** — 实时显示当前日期和时间
- **搜索引擎切换** — 快速切换 Google / Bing 等搜索引擎
- **书签管理** — 按分组管理常用链接，支持 YAML 编辑
- **GitHub Gist 远程备份** — 配置自动备份到 Gist，多端同步

## 使用

```bash
pnpm dev      # 启动开发服务器
pnpm build    # 构建生产版本
pnpm generate # 生成静态站点
```

### Gist 备份

1. 在 [GitHub Settings > Tokens](https://github.com/settings/tokens) 创建一个 classic token，勾选 `gist` 权限
2. 打开页面，点底部 `[~]` 输入 token 保存
3. 之后每次在 `[config]` 中编辑保存时，配置会自动推送到 Gist
4. 打开新页面时自动从 Gist 恢复

## 技术栈

- Nuxt 4 + Vue 3 + TypeScript
- Tailwind CSS 6
- js-yaml（YAML 配置编辑）
- GitHub Gist API（远程备份）
- localStorage（本地持久化）

## 截图

<!-- 此处放一张页面截图，建议 1280x800 -->
<!-- screenshot.png -->
