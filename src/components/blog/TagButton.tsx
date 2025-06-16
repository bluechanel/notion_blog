import Link from 'next/link';
import { Tag } from '../../types';

interface TagButtonProps {
  tag: Tag;
  className?: string;
}

const getTagColorClass = (color: string) => {
  const colorMap: Record<string, { bg: string; text: string }> = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-800' },
    green: { bg: 'bg-green-100', text: 'text-green-800' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-800' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-800' },
    red: { bg: 'bg-red-100', text: 'text-red-800' },
    yellow: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    default: { bg: 'bg-gray-100', text: 'text-gray-800' }
  };

  return colorMap[color] || colorMap.default;
};

export default function TagButton({ tag, className = '' }: TagButtonProps) {
  const { bg, text } = getTagColorClass(tag.color);
  
  return (
    <Link 
      href={`/tags/${tag.name}`}
      className={`px-4 py-2 rounded-full ${bg} ${text} hover:opacity-80 transition-opacity ${className}`}
    >
      {tag.name}
    </Link>
  );
}