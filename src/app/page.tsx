import { getAllPosts, getAllTags } from '../lib/static-data';
import MainLayout from '../components/layout/MainLayout';
import PostCard from '../components/blog/PostCard';
import TagButton from '../components/blog/TagButton';
import TagCloud from '../components/blog/TagCloud';

export const revalidate = 3600; // 每小时重新验证一次

export default async function Home() {
  // 获取博客文章和标签
  const posts = await getAllPosts();
  const tags = await getAllTags();

  return (
    <MainLayout activePage="home">
      <div className="relative text-center mb-16">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <TagCloud tags={tags} />
        </div>
        <div className="relative z-10 bg-gray-100/80 dark:bg-gray-900/80 backdrop-blur-sm py-8 rounded-lg">
          <h1 className="text-4xl font-bold text-indigo-600 mb-4">探索技术的边界</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">分享前端开发、人工智能、云计算等领域的最新技术见解和实践经验</p>
          <div className="flex justify-center gap-3">
            {tags.map((tag) => (
              <TagButton key={tag.id} tag={tag} />
            ))}
          </div>
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
