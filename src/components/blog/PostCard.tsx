import Image from 'next/image';
import Link from 'next/link';
import { PostMeta } from '../../types';
import { formatDate, getTagColorClass } from '../../lib/utils';

interface PostCardProps {
  postMeta: PostMeta;
}

export default function PostCard({ postMeta }: PostCardProps) {
  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      {postMeta.coverImage && (
        <div className="relative h-48 w-full">
          <Image 
            src={postMeta.coverImage} 
            alt={postMeta.title} 
            fill 
            className="object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {postMeta.tags.map((tag) => (
            <span 
              key={tag.id} 
              className={`text-xs px-2 py-1 rounded-full ${getTagColorClass(tag.color)}`}
            >
              {tag.name}
            </span>
          ))}
        </div>
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
          <Link href={`/posts/${postMeta.slug}`} className="hover:underline">
            {postMeta.title}
          </Link>
        </h2>
        {postMeta.excerpt && (
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
            {postMeta.excerpt}
          </p>
        )}
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {formatDate(postMeta.date)}
        </div>
      </div>
    </article>
  );
}