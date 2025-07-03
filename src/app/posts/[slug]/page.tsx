import  PostContent from '../../../components/blog/PostContent';
import { allPosts } from "contentlayer/generated";

export const generateStaticParams = async () => allPosts.map((post) => ({ slug: post._raw.flattenedPath }))

export const generateMetadata = async ({ params }: { params: Promise<{ slug: string }> }) => {

  const param = await params;
  const post = allPosts.find((post) => post._raw.flattenedPath === param.slug)
  if (!post) throw new Error(`Post not found for slug: ${param.slug}`)
  return { title: post.title }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const param = await params;
  const post = allPosts.find((post) => post._raw.flattenedPath === param.slug)
  
  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">文章未找到</h1>
          <p className="mb-6">抱歉，您请求的文章不存在。</p>
      </div>
      </div>
    );
  }
  
  return <PostContent post={post} />;
}