import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts, getPostBySlug } from '../../../lib/static-data';
import PostContent from '../../../components/blog/PostContent';


export const revalidate = 3600;

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// ✅ 新写法：接收整个 props 对象
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: '文章未找到' };
  }

  const ogImage = post.coverImage || '/default-og-image.jpg';

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `https://wileyzhang.com/posts/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://wileyzhang.com/posts/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
      authors: ['wiley'],
      tags: post.tags?.map(tag => tag.name),
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [ogImage],
    },
  };
}

// ✅ 新写法：接收整个 props 对象
export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; // ✅ 在函数内部解构
  const post = await getPostBySlug(slug);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center" role="main">
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