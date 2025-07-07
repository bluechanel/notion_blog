export type ReadTimeData = {
    minutes: number,
    time: number,
    words: number
}

export type Tag = {
    id: string,
    name: string,
    color: string
}

export interface PostMeta {
    id: string,
    title: string,
    slug: string,
    excerpt: string | null,
    date: Date,
    tags: Tag[] | [],
    coverImage: string | null,
    select: string | null,
    lastUpdated: Date
}

export interface Post extends PostMeta {
    readTime: ReadTimeData,
    content: string
}
