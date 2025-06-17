import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeSlug from 'rehype-slug';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import tsx from 'react-syntax-highlighter/dist/cjs/languages/prism/tsx';
import typescript from 'react-syntax-highlighter/dist/cjs/languages/prism/typescript';
import javascript from 'react-syntax-highlighter/dist/cjs/languages/prism/javascript';
import python from 'react-syntax-highlighter/dist/cjs/languages/prism/python';

// 注册需要高亮的语言
SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('python', python);
import { formatDate } from '../../../lib/utils';
import MainLayout from '../../../components/layout/MainLayout';
import { getAllPosts, getPostBySlug } from '../../../lib/static-data';
import TagButton from '../../../components/blog/TagButton';
import TableOfContents from '../../../components/blog/TableOfContents';

export const revalidate = 3600; // 每小时重新验证一次

// 生成静态路径
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug
  }));
}

type Props = {
  params: { slug: string }
}

// 生成元数据
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const param = await params;
  const post = await getPostBySlug(param.slug);
  
  if (!post) {
    return {
      title: '文章未找到'
    };
  }
  
  return {
    title: `${post.title} | 我的博客`,
    description: post.excerpt
  };
}

// 文章详情页面
export default async function PostPage({ params }: Props) {
  const param = await params;
  const post = await getPostBySlug(param.slug);
  
  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">文章未找到</h1>
          <p className="mb-6">抱歉，您请求的文章不存在。</p>
          <Link href="/" className="text-blue-600 hover:underline">
            返回首页
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 flex gap-8">
        <article className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        {post.coverImage && (
          <div className="relative h-64 sm:h-96 w-full">
            <Image 
              src={post.coverImage} 
              alt={post.title} 
              fill 
              className="object-cover"
            />
          </div>
        )}
        
        <div className="p-8 ">
          <header className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <TagButton key={tag.id} tag={tag} />
              ))}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              {post.title}
            </h1>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(post.date)}
            </div>
          </header>
          
          <div className="prose prose-base prose-gray dark:prose-invert max-w-none">
            <Markdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[
                rehypeRaw,
                rehypeSanitize,
                rehypeSlug
              ]}
            >
              {post.content}
            </Markdown>
          </div>
        </div>
      </article>
      <aside className="hidden lg:block w-64">
        <TableOfContents />
      </aside>
      </div>
    </MainLayout>
  );
}