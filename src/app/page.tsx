import { getAllPosts } from '../lib/static-data';
import MainLayout from '../components/layout/MainLayout';
import PostCard from '../components/blog/PostCard';

export const revalidate = 3600; // 每小时重新验证一次

export default async function Home() {
  // 获取博客文章
  const posts = await getAllPosts();

  return (
    <MainLayout activePage="home">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-indigo-600 mb-4">探索技术的边界</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">分享前端开发、人工智能、云计算等领域的最新技术见解和实践经验</p>
        <div className="flex justify-center gap-3">
          <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full">React</span>
          <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full">Node.js</span>
          <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full">AI/ML</span>
          <span className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full">云计算</span>
        </div>
      </div>
      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {posts.map((post) => (
          <PostCard key={post.id} postMeta={post} />
        ))}
      </div>
    </MainLayout>
  );
}
