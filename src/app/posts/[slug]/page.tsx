import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { getPosts, getPost } from '../../../lib/notion';
import { mapNotionPageToPost, formatDate, getTagColorClass } from '../../../lib/utils';
import MainLayout from '../../../components/layout/MainLayout';

export const revalidate = 3600; // 每小时重新验证一次

// 生成静态路径
export async function generateStaticParams() {
  const posts = await getPosts();
  
  return posts.map((post) => {
    const properties = post.properties as any;
    const slug = properties.Slug?.rich_text[0]?.plain_text || post.id;
    
    return {
      slug,
    };
  });
}

// 生成元数据
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const posts = await getPosts();
  const post = posts.find((p) => {
    const properties = p.properties as any;
    const slug = properties.Slug?.rich_text[0]?.plain_text || p.id;
    return slug === params.slug;
  });
  
  if (!post) {
    return {
      title: '文章未找到',
    };
  }
  
  const properties = post.properties as any;
  const title = properties.Title.title[0]?.plain_text || 'Untitled';
  const excerpt = properties.Excerpt?.rich_text[0]?.plain_text || '';
  
  return {
    title: `${title} | 我的博客`,
    description: excerpt,
  };
}

// 文章详情页面
export default async function PostPage({ params }: { params: { slug: string } }) {
  const posts = await getPosts();
  const postData = posts.find((p) => {
    const properties = p.properties as any;
    const slug = properties.Slug?.rich_text[0]?.plain_text || p.id;
    return slug === params.slug;
  });
  
  if (!postData) {
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
  
  // 获取文章内容
  const { page, markdown } = await getPost(postData.id);
  const post = mapNotionPageToPost(page, markdown);
  
  return (
    <MainLayout>
      <article className="max-w-3xl mx-auto">
        <header className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span 
                key={tag.id} 
                className={`text-xs px-2 py-1 rounded-full ${getTagColorClass(tag.color)}`}
              >
                {tag.name}
              </span>
            ))}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            {post.title}
          </h1>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {formatDate(post.date)}
          </div>
          {post.coverImage && (
            <div className="relative h-64 sm:h-96 w-full mb-8 rounded-lg overflow-hidden">
              <Image 
                src={post.coverImage} 
                alt={post.title} 
                fill 
                className="object-cover"
              />
            </div>
          )}
        </header>
        
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </article>
    </MainLayout>
  );
}