import { promises as fs } from 'fs';
import path from 'path';
import { PostMeta, Post, Tag } from '@/types';

// posts 文件夹的路径
const postsDirectory = path.join(process.cwd(), 'data');
const postsContentDirectory = path.join(process.cwd(), 'data', 'posts');

export async function getPostsMeta(): Promise<PostMeta[]> {
  const fileContents = await fs.readFile(path.join(postsDirectory, 'posts-meta.json'), 'utf8');
  const postsMeta: PostMeta[] = JSON.parse(fileContents);
  return postsMeta
}


/**
 * 获取所有tag
 */
export async function getAllTags() {

  const fileContents = await fs.readFile(path.join(postsDirectory, 'tags.json'), 'utf8');
  const tags: Tag[] = JSON.parse(fileContents);
  return tags
}

/**
 * 获取所有文章的 id (slugs)，用于 generateStaticParams
 */
export async function getAllPostIds() {

  const postsMeta = await getPostsMeta();
  return postsMeta.map((post) => {
    return {
      slug: post.id,
    };
  });
}

/**
 * 根据 id (slug) 获取单篇文章的完整数据，包括转换后的 HTML 内容
 */
export async function getPostData(slug: string):  Promise<Post | null> {
  // 文章元数据
  const postsMeta = await getPostsMeta();
  const post = postsMeta.find(post => post.slug === slug) || null;
  if (!post) {
    return null;
  }
  const fullPath = path.join(postsContentDirectory, `${slug}.md`);
  const fileContents = fs.readFile(fullPath, 'utf8');

  // 返回 id, HTML 内容, 和元数据
  return {
    ...post,
    content: await fileContents
  };
}