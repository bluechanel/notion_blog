export interface LinkPreviewMeta {
  title: string;
  description: string;
  favicon: string;
}

export interface Book {
  name: string;
  date: string;
  status: string;
  tags: { name: string; color: string }[];
  author: string;
  carrier: string;
  link: string;
}
