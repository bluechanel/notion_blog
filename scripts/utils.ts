import path from 'path';
import { fileURLToPath } from 'url';
import { Post, PostMeta, ReadTimeData, Tag } from './types.js';
import { Client, PageObjectResponse } from '@notionhq/client'
import { NotionToMarkdown } from 'notion-to-md'
import axios from 'axios'
import crypto from 'crypto'
import fs from 'fs'
import readingTime from 'reading-time'

// 2. 使用新的方法来定义 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// blog 内容地址
const BLOG_CONTENT_DIR = path.join(__dirname, '..', 'posts');
// blog 图片地址
const IMAGE_DIR = path.join(__dirname, '..', 'public', 'images');

// 计算阅读时间
export function readTime(text: string): ReadTimeData{
    const stats = readingTime(text);
    return {
      minutes: stats.minutes,
      time: stats.time,
      words: stats.words
    }
}


// 将Notion页面转换为博客文章元数据格式
export async function mapNotionPageToPostMeta(page: PageObjectResponse): Promise<PostMeta> {
  // 提取emoji
  let emoji = "📄"
  if (page.icon?.type === 'emoji') {
    emoji = page.icon.emoji
  }
  
  let coverImage = ""
  if (page.cover?.type === "external") {
    coverImage = page.cover.external.url;
  } else if (page.cover?.type === "file") {
    coverImage = page.cover.file.url;
  }
  
  // 更新时间
  let lastUpdated = new Date(page.last_edited_time);
  // 提取属性参数
  let title = 'Untitled';
  let slug = page.id;
  let excerpt = '';
  let date: Date = new Date();
  let tags: Tag[] = [];
  let select = '';
  for (const [key, value] of Object.entries(page.properties)) {
    // 提取文章标题
    if (value.type === "title" ) {
      title = `${emoji} ${value.title[0].plain_text}`;
    }
    // 提取日期 - 尝试查找日期类型的属性
    if (value.type === 'date' && value.date?.start) {
      if (key.toLowerCase() === 'created time') {
        date = new Date(value.date.start);
      }
    }

    // 提取摘要 - 尝试查找名为Excerpt的rich_text属性
    if (key.toLowerCase() === 'description' && value.type === 'rich_text' && value.rich_text[0]) {
      excerpt = value.rich_text[0].plain_text
    }

    // 提取标签 - 尝试查找multi_select类型的属性
    if (key.toLowerCase() === 'tags' && value.type === 'multi_select' && value.multi_select) {
      tags = value.multi_select.map((tag) => ({
        id: tag.id,
        name: tag.name,
        color: tag.color,
      }));
    }
    // 提取分类
    if (key.toLowerCase() === 'select' && value.type === 'select' && value.select) {
      if (value.select !== null) {
        select = value.select.name;
      }
    }
  }
    // 下载封面图片
  coverImage = await downloadImage(coverImage, page.id);
  return {
    id: page.id,
    title: title,
    slug: slug,
    excerpt: excerpt,
    date: date,
    tags: tags,
    coverImage: coverImage,
    select: select,
    lastUpdated: lastUpdated
  };
}


// 下载图片并保存到本地
async function downloadImage(imageUrl: string, postId: string) {
  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);
    const imageType = (await import('image-type')).default;
    const type = await imageType(buffer);
    if (!type) {
      throw new Error('无法确定图片类型');
    }
    // 计算图片哈希值
    const hash = crypto.createHash('md5').update(buffer).digest('hex');

    
    // 生成图片文件名，使用postId和原始图片名称
    const imageName = `${postId}_${hash}.${type.ext}`;
    const imagePath = path.join(IMAGE_DIR, imageName);
    
    // 判断图片是否已经存在，存在则跳过，不存在则写入
    if (fs.existsSync(imagePath)) {
      console.log(`图片 ${imageName} 已存在，跳过下载`);
      return `/images/${imageName}`;
    }
    // 保存图片
    fs.writeFileSync(imagePath, buffer);
    
    // 返回相对路径
    return `/images/${imageName}`;
  } catch (error) {
    console.error(`下载图片失败: ${imageUrl}`, error);
    return imageUrl; // 如果下载失败，返回原始URL
  }
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 获取单个博客文章内容
export async function getPostContent(notion: Client, pageId: string): Promise<string> {
  // 初始化Notion到Markdown转换器
  const n2m = new NotionToMarkdown({ notionClient: notion });
  console.log(`获取文章 ${pageId} 的内容...`);
  const mdBlocks = await n2m.pageToMarkdown(pageId);
  
  // 处理所有图片块
  for (const block of mdBlocks) {
    if (block.type === 'image') {
      const imageUrl = block.parent.match(/\]\(([^\)]+)\)/)?.[1];
      if (imageUrl) {
        const localImagePath = await downloadImage(imageUrl, pageId);
        block.parent = block.parent.replace(imageUrl, localImagePath);
        await sleep(1000); // 等待1秒，防止被封
      }
    }
    // 本页面链接 修改
    if (block.type == 'link_to_page') {
      block.parent = block.parent.replace("www.notion.so", `${process.env.BLOG_BASE_URL}/posts`);;
    }
  }
  const mdString = n2m.toMarkdownString(mdBlocks);
  return mdString.parent;
}

// 获取所有标签
export async function getTags(notion: Client, databaseId: string) {

  if (!databaseId) {
    throw new Error('NOTION_DATABASE_ID is not defined');
  }

  console.log('获取所有标签...');
  const response = await notion.databases.retrieve({
    database_id: databaseId,
  });

  // 假设标签是多选属性
  const tagsProperty = Object.values(response.properties).find(
    (property) => property.type === 'multi_select'
  );

  return tagsProperty?.multi_select?.options || [];
}


// 获取博客文章列表
export async function getPosts(notion: Client, databaseId: string): Promise<PageObjectResponse[]> {


  if (!databaseId) {
    throw new Error('NOTION_DATABASE_ID is not defined');
  }

  console.log('获取文章列表...');
  const response = await notion.databases.query({
    database_id: databaseId,
  });

  if (response.results) {
    return response.results as PageObjectResponse[];
  }
  return [];
}


// 报错文章到本地
export async function savePage(post: Post) {
  const full_md = `---
id: ${post.id}
title: ${post.title}
slug: ${post.slug}
excerpt: ${post.excerpt}
date: ${post.date}
coverImage: ${post.coverImage}
lastUpdated: ${post.lastUpdated}
tags: ${post.tags.map(tag => tag.color?`${tag.color}:${tag.name}`:tag.name).join(',')}
readTime: ${post.readTime.minutes}
---
${post.content}`
  const contentFilePath = path.join(BLOG_CONTENT_DIR, `${post.slug}.md`);
  fs.writeFileSync(contentFilePath, full_md);
  console.log(`保存文章内容到: ${contentFilePath}`);
}