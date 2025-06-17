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
const { se } = require('date-fns/locale');

// 初始化Notion客户端
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// 初始化Notion到Markdown转换器
const n2m = new NotionToMarkdown({ notionClient: notion });

// 确保数据目录存在
const DATA_DIR = path.join(__dirname, '..', 'src', 'data');
const CONTENT_DIR = path.join(DATA_DIR, 'content');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(CONTENT_DIR)) {
  fs.mkdirSync(CONTENT_DIR, { recursive: true });
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
    // 移除排序，使脚本更通用
    // sorts: [
    //   {
    //     property: 'Date',
    //     direction: 'descending',
    //   },
    // ],
    // filter: {
    //   property: 'Published',
    //   checkbox: {
    //     equals: true,
    //   },
    // },
  });
  
  return response.results;
}

// 获取单个博客文章内容
async function getPostContent(pageId) {
  console.log(`获取文章 ${pageId} 的内容...`);
  const mdBlocks = await n2m.pageToMarkdown(pageId);
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
function mapNotionPageToPostMeta(page) {

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
      title = value.title[0].plain_text;
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
    // 获取所有标签
    const tags = await getTags();
    fs.writeFileSync(
      path.join(DATA_DIR, 'tags.json'),
      JSON.stringify(tags, null, 2)
    );
    console.log(`保存了 ${tags.length} 个标签到 src/data/tags.json`);
    
    // 获取所有文章列表
    const posts = await getPosts();
    console.log(`找到 ${posts.length} 篇文章`);


    // 处理文章元数据和内容
    const postsMetadata = [];
    
    for (const post of posts) {
      try {
        // 1. 处理文章元数据
        const postMeta = mapNotionPageToPostMeta(post);
        postsMetadata.push(postMeta);
        console.log(`处理文章元数据: ${postMeta.title}`);
        
        // 2. 获取并保存文章内容到单独的文件
        try {
          const content = await getPostContent(post.id);
          const contentFilePath = path.join(CONTENT_DIR, `${postMeta.slug}.md`);
          fs.writeFileSync(contentFilePath, content);
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
    
    // 保存所有文章元数据
    fs.writeFileSync(
      path.join(DATA_DIR, 'posts-meta.json'),
      JSON.stringify(postsMetadata, null, 2)
    );
    console.log(`保存了 ${postsMetadata.length} 篇文章元数据到 src/data/posts-meta.json`);
    
    // 为了向后兼容，也生成合并了内容的完整posts.json文件
    // const postsWithContent = [];
    // for (const meta of postsMetadata) {
    //   try {
    //     const contentPath = path.join(CONTENT_DIR, meta.contentFile);
    //     const content = fs.existsSync(contentPath) 
    //       ? fs.readFileSync(contentPath, 'utf-8')
    //       : '';
        
    //     // 创建包含内容的完整文章对象
    //     const fullPost = {
    //       ...meta,
    //       content: content
    //     };
    //     delete fullPost.contentFile; // 移除内容文件引用
    //     delete fullPost.rawProperties; // 移除原始属性，保持向后兼容
        
    //     postsWithContent.push(fullPost);
    //   } catch (error) {
    //     console.error(`合并文章 ${meta.id} 内容时出错:`, error);
    //     // 如果出错，至少保留元数据
    //     const fallbackPost = { ...meta };
    //     delete fallbackPost.contentFile;
    //     delete fallbackPost.rawProperties;
    //     fallbackPost.content = '';
    //     postsWithContent.push(fallbackPost);
    //   }
    // }
    
    // 保存向后兼容的完整文章数据
    // fs.writeFileSync(
    //   path.join(DATA_DIR, 'posts.json'),
    //   JSON.stringify(postsWithContent, null, 2)
    // );
    // console.log(`保存了 ${postsWithContent.length} 篇完整文章到 src/data/posts.json (向后兼容)`);
    
    // console.log('所有Notion数据获取完成！');
  } catch (error) {
    console.error('获取Notion数据时出错:', error);
    process.exit(1);
  }
}

// 执行主函数
main();