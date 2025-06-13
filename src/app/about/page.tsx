import { Metadata } from 'next';
import MainLayout from '../../components/layout/MainLayout';

export const metadata: Metadata = {
  title: '关于 | 我的博客',
  description: '了解更多关于我和我的博客',
};

export default function AboutPage() {
  return (
    <MainLayout activePage="about">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">关于我的博客</h2>
        
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p>
            欢迎来到我的个人博客！这是一个使用 Next.js、Tailwind CSS 和 Notion API 构建的极简风格博客。
          </p>
          
          <h3>技术栈</h3>
          <ul>
            <li><strong>Next.js</strong> - React 框架，提供服务端渲染和静态生成</li>
            <li><strong>Tailwind CSS</strong> - 实用优先的 CSS 框架</li>
            <li><strong>Notion API</strong> - 使用 Notion 数据库作为内容管理系统</li>
            <li><strong>TypeScript</strong> - 类型安全的 JavaScript 超集</li>
          </ul>
          
          <h3>为什么选择 Notion 作为 CMS？</h3>
          <p>
            Notion 提供了一个灵活且用户友好的界面来管理内容。通过使用 Notion 作为 CMS，我可以：
          </p>
          <ul>
            <li>轻松创建和编辑博客文章</li>
            <li>使用 Notion 强大的编辑器功能</li>
            <li>组织和分类内容</li>
            <li>无需额外的 CMS 服务</li>
          </ul>
          
          <h3>关于我</h3>
          <p>
            我是一名热爱技术和写作的开发者。通过这个博客，我希望分享我的知识、经验和想法。
          </p>
          <p>
            如果你有任何问题或建议，欢迎联系我！
          </p>
          
          <h3>联系方式</h3>
          <ul>
            <li>邮箱：your.email@example.com</li>
            <li>GitHub：<a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">github.com/yourusername</a></li>
            <li>Twitter：<a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer">@yourusername</a></li>
          </ul>
        </div>
      </div>
    </MainLayout>
  );
}