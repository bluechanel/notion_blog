#!/usr/bin/env node

/**
 * 此脚本用于在构建前预先获取所有Notion片单数据并保存为静态JSON文件
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { Client, PageObjectResponse } from '@notionhq/client'
import { getPosts }  from './utils.js';
import fs from 'fs'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// blog 内容地址
const PUBLIC_DIR = path.join(__dirname, '..', 'public', 'books.json');

// 初始化Notion客户端
let notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export type Tag = {
    name: string,
    color: string
}


interface Book {
    name: string,
    date: Date,
    status: string,
    tags: Tag[],
    author: string,
    carrier: string,
    link: string
}

export async function mapNotionPageToBook(page: PageObjectResponse): Promise<Book> {
    let emoji = "📄"
    if (page.icon?.type === 'emoji') {
        emoji = page.icon.emoji
    }
    let bookName = ""
    let author = ""
    let tags: Tag[] = []
    let status = ""
    let carrier = ""
    let link = ""
    let date = new Date()

    for (const [key, value] of Object.entries(page.properties)) {
        if (key.toLowerCase() === "book name" && value.type === "title") {
            bookName = value.title[0]? value.title[0].plain_text : ""
        }
        if (key.toLowerCase() === "author" && value.type === "rich_text") {
            author =  value.rich_text[0]? value.rich_text[0].plain_text : ""
        }
        if (key.toLowerCase() === 'tags' && value.type === 'multi_select' && value.multi_select) {
            tags = value.multi_select.map((tag) => ({
                name: tag.name,
                color: tag.color,
            }));
        }
        if (key.toLowerCase() === 'status' && value.type === 'select' && value.select) {
            status = value.select.name
        }
        if (key.toLowerCase() === 'carrier' && value.type === 'select' && value.select) {
            carrier = value.select.name
        }
        if (key.toLowerCase() === 'describe' && value.type === 'rich_text' && value.rich_text) {
            link = value.rich_text[0]? value.rich_text[0].plain_text : ""
        }
        if (key.toLowerCase() === 'date' && value.type === 'date' && value.date) {
            date = new Date(value.date.start)
        }
    }

    return {
        name: `${emoji} ${bookName}`,
        date: date,
        status: status,
        tags: tags,
        author: author,
        carrier: carrier,
        link: link,
    }
}

// 主函数
async function main(databaseId: string) {
    const books: Book[] = []

    try {
        // 获取所有文章列表
        const posts = await getPosts(notion, databaseId);
        console.log(`找到 ${posts.length} 条记录`);

        for (const post of posts) {
            books.push(await mapNotionPageToBook(post))
        }
        fs.writeFileSync(PUBLIC_DIR, JSON.stringify(books));

    } catch (error) {
        console.error('获取Notion数据时出错:', error);
        process.exit(1);
    }
}

main("37c686d6-6383-4241-914a-53c4f259f696")