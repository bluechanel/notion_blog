import { Metadata } from 'next';
import { getAllPosts, getPostBySlug } from '../../../lib/static-data';
import  PostContent from '../../../components/blog/PostContent';
import Link from 'next/link';

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

  const ogImage = post.coverImage || '/default-og-image.jpg';
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: ['你的名字'],
      tags: post.tags.map(tag => tag.name),
      images: [{
        url: ogImage,
        width: 1200,
        height: 630,
        alt: post.title
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [ogImage]
    },
    alternates: {
      canonical: `https://your-domain.com/posts/${post.slug}`
    }
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
  
  return <PostContent post={post} />;
}