// 博客文章元数据
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
// 文章全部信息
export interface Post extends PostMeta{
  content: string;
}