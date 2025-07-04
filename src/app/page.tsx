import { Metadata } from 'next';
import { compareDesc} from 'date-fns'
import { allPosts } from "contentlayer/generated";
import MainLayout from '@/components/layout/MainLayout';
import PostCard from '@/components/blog/PostCard';
import ProfileCard from '@/components/layout/ProfileCard';
import TagsCard from '@/components/layout/TagsCard';

export const metadata: Metadata = {
  title: 'Wiley Blog | AI/LLM developer blog',
  description: 'wiley blog - AI/LLM developer blog Prompt, FastChat, Vllm, Docker, Langchain, Langgraph, Airflow, RAG, Notion',
  openGraph: {
    title: 'Wiley Blog | AI/LLM developer blog',
    description: 'wiley blog - AI/LLM developer blog Prompt, FastChat, Vllm, Docker, Langchain, Langgraph, Airflow, RAG, Notion',
    images: [{
      url: '/default-og-image.png',
      width: 1200,
      height: 630,
      alt: 'Wiley Blog'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wiley Blog | AI/LLM developer blog',
    description: 'wiley blog - AI/LLM developer blog Prompt, FastChat, Vllm, Docker, Langchain, Langgraph, Airflow, RAG, Notion',
    images: ['/default-og-image.png']
  }
};


export default function Home() {
  const posts = allPosts.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))

  return (
    <MainLayout activePage="home">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* 右侧文章列表 */}
        <div className="lg:w-3/4">
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
        {/* 左侧边栏 */}

        <div className="lg:w-1/4 space-y-8">
          <div className='sticky top-30 gap-4 flex flex-col'>
            <ProfileCard />
            <TagsCard />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}