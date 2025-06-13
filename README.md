# Notion 博客

一个使用 Next.js、Tailwind CSS 和 Notion API 构建的极简风格个人博客。

## 功能特点

- 使用 Notion 数据库作为 CMS
- 响应式设计，适配各种设备
- 暗色/亮色模式自动切换
- 按标签分类文章
- Markdown 内容渲染
- 极简风格设计

## 技术栈

- [Next.js](https://nextjs.org/) - React 框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Notion API](https://developers.notion.com/) - 内容管理系统
- [TypeScript](https://www.typescriptlang.org/) - 类型安全的 JavaScript 超集

## 开始使用

### 前提条件

- Node.js 18.0.0 或更高版本
- Notion 账户和 API 密钥
- Notion 数据库（用于存储博客文章）

### 安装

1. 克隆仓库

```bash
git clone https://github.com/yourusername/notion-blog.git
cd notion-blog
```

2. 安装依赖

```bash
npm install
```

3. 配置环境变量

创建 `.env.local` 文件，并添加以下内容：

```
NOTION_API_KEY=your_notion_api_key_here
NOTION_DATABASE_ID=your_notion_database_id_here
```

4. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看你的博客。

## Notion 数据库设置

你需要在 Notion 中创建一个数据库，包含以下属性：

- `Title` (标题) - 文章标题
- `Slug` (文本) - 文章 URL 路径
- `Date` (日期) - 发布日期
- `Tags` (多选) - 文章标签
- `Excerpt` (文本) - 文章摘要
- `Cover` (文件) - 封面图片
- `Published` (复选框) - 是否发布

## 部署

你可以使用 [Vercel](https://vercel.com/) 一键部署此项目：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/yourusername/notion-blog)

## 许可证

此项目采用 MIT 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件。
