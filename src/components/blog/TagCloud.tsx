// import { Tag } from '../../types';
// import Link from 'next/link';
// import { useMemo } from 'react';

// interface TagCloudProps {
//   tags: Tag[];
//   className?: string;
// }

// const getTagColorClass = (color: string) => {
//   const colorMap: Record<string, { bg: string; text: string }> = {
//     blue: { bg: 'bg-blue-100', text: 'text-blue-800' },
//     green: { bg: 'bg-green-100', text: 'text-green-800' },
//     purple: { bg: 'bg-purple-100', text: 'text-purple-800' },
//     orange: { bg: 'bg-orange-100', text: 'text-orange-800' },
//     red: { bg: 'bg-red-100', text: 'text-red-800' },
//     yellow: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
//     default: { bg: 'bg-gray-100', text: 'text-gray-800' }
//   };

//   return colorMap[color] || colorMap.default;
// };

// const getRandomPosition = () => {
//   return {
//     top: `${Math.random() * 70}%`,
//     left: `${Math.random() * 80}%`,
//     transform: `rotate(${Math.random() * 30 - 15}deg)`,
//     fontSize: `${Math.random() * 0.5 + 0.8}rem`
//   };
// };

// export default function TagCloud({ tags, className = '' }: TagCloudProps) {
//   const tagElements = useMemo(() => {
//     return tags.map((tag) => {
//       const { bg, text } = getTagColorClass(tag.color);
//       const style = getRandomPosition();
      
//       return (
//         <Link
//           key={tag.id}
//           href={`/tags/${tag.name}`}
//           className={`absolute px-3 py-1 rounded-full ${bg} ${text} opacity-30 hover:opacity-100 transition-opacity cursor-pointer`}
//           style={style}
//         >
//           {tag.name}
//         </Link>
//       );
//     });
//   }, [tags]);

//   return (
//     <div className={`relative w-full h-full ${className}`}>
//       {tagElements}
//     </div>
//   );
// }