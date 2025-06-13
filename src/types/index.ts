// 博客文章类型定义
export interface PostMeta {
  id: string;
  title: string;
  slug: string;
  coverImage?: string;
  excerpt?: string;
  date: string;
  tags: Tag[];
  lastUpdated: Date;
}

// 标签类型定义
export interface Tag {
  id: string;
  name: string;
  color: string;
}

// Notion页面属性类型
export interface NotionPageProperties {
  Title: {
    title: Array<{
      plain_text: string;
    }>;
  };
  Slug: {
    rich_text: Array<{
      plain_text: string;
    }>;
  };
  Excerpt: {
    rich_text: Array<{
      plain_text: string;
    }>;
  };
  Date: {
    date: {
      start: string;
    };
  };
  Tags: {
    multi_select: Array<{
      id: string;
      name: string;
      color: string;
    }>;
  };
  Cover: {
    files: Array<{
      file?: {
        url: string;
      };
      external?: {
        url: string;
      };
    }>;
  };
}