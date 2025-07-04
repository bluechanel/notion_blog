import Link from 'next/link';

interface Tag {
  name: string;
  color: string;
}

export default function TagsCard() {
  // 热门标签数据
  const popularTags: Tag[] = [
    { name: 'AI', color: 'default' },
    { name: 'RAG', color: 'blue' },
    { name: 'LMM', color: 'orange' },
    { name: 'Vector Store', color: 'purple' },
    { name: 'Prompt', color: 'green' },
    { name: 'MongoDB', color: 'green' },
    { name: 'MCP', color: 'red' },
    { name: 'LangChain', color: 'cyan' },
    { name: 'LangGraph', color: 'indigo' },
    { name: 'Notion', color: 'rose' },
  ];

  const getTagColorClass = (color: string) => {
    const colorMap: Record<string, { bg: string; text: string }> = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-800' },
      green: { bg: 'bg-green-100', text: 'text-green-800' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-800' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-800' },
      red: { bg: 'bg-red-100', text: 'text-red-800' },
      yellow: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      cyan: { bg: 'bg-cyan-100', text: 'text-cyan-800' },
      indigo: { bg: 'bg-indigo-100', text: 'text-indigo-800' },
      rose: { bg: 'bg-rose-100', text: 'text-rose-800' },
      default: { bg: 'bg-gray-100', text: 'text-gray-800' }
    };
  
    return colorMap[color] || colorMap.default;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">热门标签</h2>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => {
            const { bg, text } = getTagColorClass(tag.color);
            return (
              <Link 
                key={tag.name}
                href={`/tags/${tag.name}`}
                className={`px-3 py-1 rounded-full ${bg} ${text} text-sm hover:opacity-80 transition-opacity`}
              >
                {tag.name}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}