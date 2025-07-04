#!/usr/bin/env node

/**
 * 此脚本用于在构建前预先获取所有Notion数据并保存为静态JSON文件
 * 运行方式：node scripts/fetch-notion-data.js
 * 
 * 修改：将文章列表和文章内容分开获取和存储，提高维护性
 */
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { Client } = require('@notionhq/client');
const { NotionToMarkdown } = require('notion-to-md');
const axios = require('axios');
const crypto = require('crypto');

// 初始化Notion客户端
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// 初始化Notion到Markdown转换器
const n2m = new NotionToMarkdown({ notionClient: notion });

// 确保数据目录存在
const BLOG_CONTENT_DIR = path.join(__dirname, '..', 'posts');
const IMAGE_DIR = path.join(__dirname, '..', 'public', 'images');

if (!fs.existsSync(BLOG_CONTENT_DIR)) {
  fs.mkdirSync(BLOG_CONTENT_DIR, { recursive: true });
}
if (!fs.existsSync(IMAGE_DIR)) {
  fs.mkdirSync(IMAGE_DIR, { recursive: true });
}


// 获取博客文章列表
async function getPosts() {
  const databaseId = process.env.NOTION_DATABASE_ID;
  
  if (!databaseId) {
    throw new Error('NOTION_DATABASE_ID is not defined');
  }

  console.log('获取文章列表...');
  const response = await notion.databases.query({
    database_id: databaseId,
  });
  
  return response.results;
}

// 下载图片并保存到本地
async function downloadImage(imageUrl, postId) {
  const { default: imageType } = await import('image-type');
  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);
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

// 获取单个博客文章内容
async function getPostContent(pageId) {
  console.log(`获取文章 ${pageId} 的内容...`);
  const mdBlocks = await n2m.pageToMarkdown(pageId);
  
  // 处理所有图片块
  for (const block of mdBlocks) {
    if (block.type === 'image') {
      const imageUrl = block.parent.match(/\]\(([^\)]+)\)/)?.[1];
      if (imageUrl) {
        const localImagePath = await downloadImage(imageUrl, pageId);
        block.parent = block.parent.replace(imageUrl, localImagePath);
      }
    }
  }
  const mdString = n2m.toMarkdownString(mdBlocks);
  return mdString.parent;
}

// 获取所有标签
async function getTags() {
  const databaseId = process.env.NOTION_DATABASE_ID;
  
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

// 将Notion页面转换为博客文章元数据格式
async function mapNotionPageToPostMeta(page) {

  // 提取emoji
  let emoji = page.icon.emoji || "📄"

  // 提取封面
  let coverImage = ""
  if (page.cover.type === "external") {
    coverImage = page.cover.external.url;
  } else {
    coverImage = page.cover.file.url;
  }
  
  // 更新时间
  let lastUpdated = page.last_edited_time;
  // 提取属性参数
  let title = 'Untitled';
  let slug = page.id;
  let excerpt = '';
  let date = '';
  let tags = [];
  let select = '';
  for (const [key, value] of Object.entries(page.properties)) {
    if (key.toLowerCase() === 'name') {
      title = `${emoji} ${value.title[0].plain_text}`;
    }
    // 提取摘要 - 尝试查找名为Excerpt的rich_text属性
    if (key.toLowerCase() === 'description') {
      excerpt = value.rich_text[0].plain_text;
    }
    // 提取日期 - 尝试查找日期类型的属性
    if (key.toLowerCase() === 'created time') {
      date = new Date(value.date.start).toISOString().split('T')[0];
    }
    // 提取标签 - 尝试查找multi_select类型的属性
    if (key.toLowerCase() === 'tags') {
      tags = value.multi_select.map((tag) => ({
        id: tag.id,
        name: tag.name,
        color: tag.color,
      }));
    }
    // 提取分类
    if (key.toLowerCase() === 'select') {
      if (value.select !== null) {
        select = value.select.name;
      }
    }
  }
    // 下载封面图片
  coverImage = await downloadImage(coverImage, page.id);
  return {
    id: page.id,
    title,
    slug,
    excerpt,
    date,
    tags,
    coverImage,
    select,
    lastUpdated: lastUpdated
  };
}

// 主函数
async function main() {

  try {

    // 获取所有文章列表
    const posts = await getPosts();
    console.log(`找到 ${posts.length} 篇文章`);


    // 处理文章元数据和内容
    const postsMetadata = [];
    
    for (const post of posts) {
      try {
        // 1. 处理文章元数据
        const postMeta = await mapNotionPageToPostMeta(post);
        postsMetadata.push(postMeta);
        console.log(`处理文章元数据: ${postMeta.title}`);
        
        // 2. 获取并保存文章内容到单独的文件
        try {
          const content = await getPostContent(post.id);
          // 修改content 符合标准
          const full_md = `---
id: ${postMeta.id}
title: ${postMeta.title}
slug: ${postMeta.slug}
excerpt: ${postMeta.excerpt}
date: ${postMeta.date}
coverImage: ${postMeta.coverImage}
lastUpdated: ${postMeta.lastUpdated}
tags: ${postMeta.tags.map(tag => tag.color?`${tag.color}:${tag.name}`:tag.name).join(',')}  
---
${content}`
          const contentFilePath = path.join(BLOG_CONTENT_DIR, `${postMeta.slug}.md`);
          fs.writeFileSync(contentFilePath, full_md);
          console.log(`保存文章内容到: ${contentFilePath}`);
        } catch (contentError) {
          console.error(`获取文章 ${post.id} 内容时出错:`, contentError);
          // 创建一个空的内容文件，以保持一致性
          fs.writeFileSync(
            path.join(CONTENT_DIR, `${postMeta.slug}.md`),
            `# ${postMeta.title}\n\n*内容获取失败*`
          );
        }
      } catch (error) {
        console.error(`处理文章 ${post.id} 时出错:`, error);
      }
    }
    
  } catch (error) {
    console.error('获取Notion数据时出错:', error);
    process.exit(1);
  }
}

// 执行主函数
main()