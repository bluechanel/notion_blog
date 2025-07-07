"use client";
import { compareDesc} from 'date-fns'
import { allPosts, Post } from "contentlayer/generated";
import MainLayout from '@/components/layout/MainLayout';
import PostCard from '@/components/blog/PostCard';
import ProfileCard from '@/components/layout/ProfileCard';
import TagsCard from '@/components/layout/TagsCard';
import { useState } from 'react';

export default function Home() {
  const posts = allPosts.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const handleSelectTag = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag(null);
    } else {
      setSelectedTag(tag);
    }
  };

  const filteredPosts = selectedTag
    ? posts.filter(post => post.tags?.split(',').some(t => t.split(':')[1] === selectedTag))
    : posts;

  const tagsMap = new Map<string, { name: string; color: string }>();
  allPosts.forEach(post => {
    post.tags?.split(',').forEach(tag => {
      const [color, name] = tag.split(':');
      if (name && !tagsMap.has(name)) {
        tagsMap.set(name, { name, color });
      }
    });
  });
  const tags = Array.from(tagsMap.values());

  return (
    <MainLayout activePage="home">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* 右侧文章列表 */}
        <div className="lg:w-3/4">
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post: Post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
        {/* 左侧边栏 */}

        <div className="lg:w-1/4 space-y-8">
          <div className='sticky top-30 gap-4 flex flex-col'>
            <ProfileCard />
            <TagsCard tags={tags} selectedTag={selectedTag} onSelectTag={handleSelectTag} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
