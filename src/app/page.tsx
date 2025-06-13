import { getAllPosts } from '../lib/static-data';
import MainLayout from '../components/layout/MainLayout';
import PostCard from '../components/blog/PostCard';

export const revalidate = 3600; // 每小时重新验证一次

export default async function Home() {
  // 获取博客文章
  const posts = await getAllPosts();

  return (
    <MainLayout activePage="home">
      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {posts.map((post) => (
          <PostCard key={post.id} postMeta={post} />
        ))}
      </div>
    </MainLayout>
  );
}
