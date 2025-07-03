import Image from 'next/image';
import Link from 'next/link';
import { Post } from 'contentlayer/generated';
import { formatDate, getTagColorClass } from '../../lib/utils';


export default function PostCard({ post }: {post: Post}) {

  const tags = post.tags?.split(",").map((tag) => {
    return {"color": tag.split(":")[0], "name": tag.split(":")[1]}
  }) ?? [];

  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out">
      {post.coverImage && (
        <div className="relative h-48 w-full">
          <Image 
            src={post.coverImage} 
            alt={post.title} 
            fill 
            className="object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag) => (
            <span 
              key={tag.name} 
              className={`text-xs px-2 py-1 rounded-full ${getTagColorClass(tag.color)}`}
            >
              {tag.name}
            </span>
          ))}
        </div>
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
          <Link href={`/posts/${post.slug}`} className="hover:underline">
            {post.title}
          </Link>
        </h2>
        {post.excerpt && (
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
            {post.excerpt}
          </p>
        )}
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {formatDate(post.date)}
        </div>
      </div>
    </article>
  );
}