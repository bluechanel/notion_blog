import MainLayout from '@/components/layout/MainLayout';
import PostCard from '@/components/blog/PostCard';
import TagButton from '@/components/blog/TagButton';
import TagCloud from '@/components/blog/TagCloud';
import { getPostsMeta, getAllTags } from '@/lib/posts';

export default async function PostGallery() {
  const tags = await getAllTags();
  const postsMeta = await getPostsMeta()

  return (
    <MainLayout activePage="home">
      <div className="relative text-center mb-16">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <TagCloud tags={tags} />
        </div>
        <div className="relative z-10 bg-gray-100/80 dark:bg-gray-900/80 backdrop-blur-sm py-8 rounded-lg">
          <h1 className="text-4xl font-bold text-indigo-600 mb-4">AI & LLM Development Insights</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">Exploring artificial intelligence, large language models, and cutting-edge technology innovations</p>
          <div className="flex justify-center gap-3">
            {tags.map((tag) => (
              <TagButton key={tag.id} tag={tag} />
            ))}
          </div>
        </div>
      </div>
      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {postsMeta.map((post) => (
          <PostCard key={post.id} postMeta={post} />
        ))}
      </div>
    </MainLayout>
  );

}