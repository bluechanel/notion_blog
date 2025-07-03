import { Metadata } from 'next';
import { compareDesc} from 'date-fns'
import { allPosts } from "contentlayer/generated";
import PostGallery from '@/components/layout/PostGallery';

export const metadata: Metadata = {
  title: '探索技术的边界 | 我的博客',
  description: '分享前端开发、人工智能、云计算等领域的最新技术见解和实践经验，帮助开发者提升技术能力',
  openGraph: {
    title: '探索技术的边界 | 我的博客',
    description: '分享前端开发、人工智能、云计算等领域的最新技术见解和实践经验，帮助开发者提升技术能力',
    images: [{
      url: '/default-og-image.jpg',
      width: 1200,
      height: 630,
      alt: '我的博客首页'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: '探索技术的边界 | 我的博客',
    description: '分享前端开发、人工智能、云计算等领域的最新技术见解和实践经验，帮助开发者提升技术能力',
    images: ['/default-og-image.jpg']
  }
};


export default function Home() {
  const posts = allPosts.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))

  return (
    <PostGallery posts={posts} />
  );
}