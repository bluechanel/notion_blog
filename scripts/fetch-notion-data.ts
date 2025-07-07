#!/usr/bin/env node

/**
 * 此脚本用于在构建前预先获取所有Notion数据并保存为静态JSON文件
 * 运行方式：node scripts/fetch-notion-data.js
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import yargs from 'yargs';
import { Client, PageObjectResponse } from '@notionhq/client'
import { getPosts, mapNotionPageToPostMeta, getPostContent, savePage, readTime }  from './utils.js';

// 初始化Notion客户端
let notion = new Client({
  auth: process.env.NOTION_API_KEY,
});


async function mergePost(post: PageObjectResponse) {
  // 1. 处理文章元数据
  const postMeta = await mapNotionPageToPostMeta(post);
  console.log(`处理文章元数据: ${postMeta.title}`);
  
  // 2. 获取并保存文章内容到单独的文件
  let content = await getPostContent(notion, post.id);
  savePage({...postMeta, readTime: readTime(content), content: content})
}

// 主函数
async function main(pageId: string) {
  if (pageId === "all") {
    try {
      const databaseID = process.env.NOTION_DATABASE_ID;
      if (!databaseID) {
        throw new Error('未找到数据库ID, 检查.env文件');
      }
      // 获取所有文章列表
      const posts = await getPosts(notion, databaseID);
      console.log(`找到 ${posts.length} 篇文章`);

      for (const post of posts) {
        try {
          await mergePost(post)
        } catch (contentError) {
          console.error(`获取文章 ${post.id} 内容时出错:`, contentError);
        }
      }
      
    } catch (error) {
      console.error('获取Notion数据时出错:', error);
      process.exit(1);
    }
  } else {
    // 单页面信息获取 
    // 获取数据库信息并查看文章是否存在
      const databaseID = process.env.NOTION_DATABASE_ID;
      if (!databaseID) {
        throw new Error('未找到数据库ID, 检查.env文件');
      }
      // 获取所有文章列表
      const posts = await getPosts(notion, databaseID);
      for (const post of posts) {
        if (post.id === pageId) {
          await mergePost(post)
          break
        }
      }
  }
}

const argv = yargs(process.argv.slice(2))
  .option('id', {
    type: 'string',
    description: '文章id，all表示全部',
    demandOption: true
  })
  .help()
  .parse();

main(argv.id)