# Data × AI · 技术笔记

这是一个用 VitePress 构建的中文技术学习博客，主题围绕 Python、SQL、数据工程与 Data Agent。内容以可复现实例、问题诊断和学习计划为主；计划中的实验会明确标注状态，不把未完成内容写成经历或成果。

- [GitHub 仓库](https://github.com/hfg369/tech-notes)
- [在线网站](https://hfg369.github.io/tech-notes/)

## 本地运行

需要 Node.js 20 或更高版本。首次安装依赖并启动开发服务器：

```bash
npm ci
npm run docs:dev
```

浏览器打开终端提示的本地地址。修改 `docs/` 下的 Markdown 或主题文件后，页面会自动刷新。

生产构建与本地预览：

```bash
npm run docs:build
npm run docs:preview
```

构建输出位于 `docs/.vitepress/dist/`，该目录已加入 `.gitignore`。

## BLOG_BASE

站点默认配置为仓库 Pages 项目站点：`/tech-notes/`。构建配置会读取环境变量 `BLOG_BASE`：

```bash
BLOG_BASE=/tech-notes/ npm run docs:build
```

如果改用用户站点或其他仓库名，构建时传入对应的 base 路径，例如 `BLOG_BASE=/my-repo/`。本地开发通常可以直接使用默认值。

## 发布到 GitHub Pages

仓库已经包含 `.github/workflows/deploy.yml`。发布前：

1. 在 GitHub 创建名为 `tech-notes` 的新仓库。
2. 将本目录内容推送到该仓库的 `main` 分支。
3. 在仓库的 **Settings → Pages → Build and deployment** 中，将来源设为 **GitHub Actions**。
4. 等待 `Deploy VitePress site to GitHub Pages` 工作流完成。

仓库名为 `tech-notes` 时，预期站点地址是：`https://hfg369.github.io/tech-notes/`。工作流中的 `BLOG_BASE` 已设置为 `/tech-notes/`；若仓库名改变，需要同步修改它。

工作流使用 GitHub 官方 Pages actions，并通过 `npm ci` 按锁文件安装固定版本依赖。

新增文章时，在 `docs/notes/` 创建 Markdown 文件，然后在 `docs/.vitepress/config.ts` 的 `nav` 和 `sidebar` 中各增加一个链接；本地运行 `npm run docs:build` 检查链接与构建结果，再提交到 `main`。

## 示例

验证 SQL 一对多示例：

```bash
python3 examples/sql/verify_one_to_many.py
```

预期输出包含：

```text
SQLite example passed: naive=400, order_total=300, item_total=300
```

## 目录

```text
docs/
  index.md                         # 首页
  about.md                         # 关于本站
  roadmap.md                       # 学习路线（计划）
  notes/                           # 技术笔记
  .vitepress/                      # VitePress 配置与主题
examples/sql/                      # 可运行示例
.github/workflows/deploy.yml      # GitHub Pages 部署工作流
```

## 内容边界

文章中的示例数据均为虚构或最小复现数据。Spark 实验页面目前是计划稿，只有在实际完成基线、观察指标、改动并核对结果之后，才应改写为实验复盘。
