import { defineDocumentType, makeSource } from 'contentlayer2/source-files'

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `**/*.md`,
  fields: {
    id: { type: 'string', required: true },
    title: { type: 'string', required: true },
    slug: { type: 'string', required: true },
    excerpt: { type: 'string', required: true },
    date: { type: 'date', required: true },
    coverImage: { type: 'string', required: true },
    lastUpdated: { type: 'date', required: true },
    tags: { type: 'string', required: false },
    readTime: { type: 'number', required: false },
  },
  computedFields: {
    url: { type: 'string', resolve: (post) => `/posts/${post._raw.flattenedPath}` },
  },
}))

export default makeSource({ contentDirPath: 'posts', documentTypes: [Post] })