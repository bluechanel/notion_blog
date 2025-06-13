/**
 * 此文件用于从静态JSON文件中读取数据，而不是直接从Notion API获取
 * 这些数据是通过 scripts/fetch-notion-data.js 脚本预先获取并保存的
 */

import fs from 'fs';
import path from 'path';
import { PostMeta, Tag } from '../types';

// 数据文件路径
const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const POSTS_FILE = path.join(DATA_DIR, 'posts-meta.json');
const TAGS_FILE = path.join(DATA_DIR, 'tags.json');

// 缓存
let postsCache: PostMeta[] | null = null;
let tagsCache: Tag[] | null = null;

/**
 * 从静态JSON文件中读取所有文章
 */
export function getAllPosts(): PostMeta[] {
  // 如果已经缓存了文章，直接返回
  if (postsCache) {
    return postsCache;
  }

  try {
    // 检查文件是否存在
    if (!fs.existsSync(POSTS_FILE)) {
      console.warn('文章数据文件不存在，请先运行 scripts/fetch-notion-data.js');
      return [];
    }

    // 读取文件内容
    const data = fs.readFileSync(POSTS_FILE, 'utf8');
    postsCache = JSON.parse(data) as PostMeta[];
    return postsCache;
  } catch (error) {
    console.error('读取文章数据文件时出错:', error);
    return [];
  }
}

/**
 * 从静态JSON文件中读取所有标签
 */
export function getAllTags(): Tag[] {
  // 如果已经缓存了标签，直接返回
  if (tagsCache) {
    return tagsCache;
  }

  try {
    // 检查文件是否存在
    if (!fs.existsSync(TAGS_FILE)) {
      console.warn('标签数据文件不存在，请先运行 scripts/fetch-notion-data.js');
      return [];
    }

    // 读取文件内容
    const data = fs.readFileSync(TAGS_FILE, 'utf8');
    tagsCache = JSON.parse(data) as Tag[];
    return tagsCache;
  } catch (error) {
    console.error('读取标签数据文件时出错:', error);
    return [];
  }
}

/**
 * 根据slug获取单个文章
 */
export function getPostBySlug(slug: string): PostMeta | null {
  const posts = getAllPosts();
  return posts.find(post => post.slug === slug) || null;
}

/**
 * 根据标签名获取文章
 */
export function getPostsByTag(tagName: string): PostMeta[] {
  const posts = getAllPosts();
  return posts.filter(post => post.tags.some(tag => tag.name === tagName));
}