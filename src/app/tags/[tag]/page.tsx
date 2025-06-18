import { Metadata } from 'next';
import { getAllTags, getPostsByTag } from '../../../lib/static-data';
import MainLayout from '../../../components/layout/MainLayout';
import PostCard from '../../../components/blog/PostCard';


// 生成静态路径
export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((tag) => ({
    tag: tag.name
  }));
}

type Props = {
  params: { tag: string }
}

// 生成元数据
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = params;
  const posts = getPostsByTag(tag);
  const tagInfo = (await getAllTags()).find(t => t.name === tag);
  
  if (!tagInfo) {
    return {
      title: '标签未找到'
    };
  }

  const title = `${tag} - 相关文章 | 我的博客`;
  const description = `浏览所有关于 ${tag} 的文章，共 ${posts.length} 篇文章`;
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: [{
        url: '/default-og-image.jpg',
        width: 1200,
        height: 630,
        alt: `${tag} 标签页面`
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/default-og-image.jpg']
    },
    alternates: {
      canonical: `https://wielyzhang.com/tags/${tag}`
    }
  };
}

// 标签页面
export default async function TagPage({ params }: Props) {
  const { tag } = params;
  const posts = getPostsByTag(tag);
  const tagInfo = (await getAllTags()).find(t => t.name === tag);

  if (!tagInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">标签未找到</h1>
          <p className="mb-6">抱歉，您请求的标签不存在。</p>
          <a href="/" className="text-blue-600 hover:underline">
            返回首页
          </a>
        </div>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4">
        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {tag}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            共找到 {posts.length} 篇相关文章
          </p>
        </header>

        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {posts.map((post) => (
            <PostCard key={post.id} postMeta={post} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}