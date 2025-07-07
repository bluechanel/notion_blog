interface Tag {
  name: string;
  color: string;
}

interface TagsCardProps {
  tags: Tag[];
  selectedTag: string | null;
  onSelectTag: (tag: string) => void;
}

export default function TagsCard({ tags, selectedTag, onSelectTag }: TagsCardProps) {
  const getTagColorClass = (color: string, isSelected: boolean) => {
    const colorMap: Record<string, { bg: string; text: string, selectedBg: string }> = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-800', selectedBg: 'bg-blue-500' },
      green: { bg: 'bg-green-100', text: 'text-green-800', selectedBg: 'bg-green-500' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-800', selectedBg: 'bg-purple-500' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-800', selectedBg: 'bg-orange-500' },
      red: { bg: 'bg-red-100', text: 'text-red-800', selectedBg: 'bg-red-500' },
      yellow: { bg: 'bg-yellow-100', text: 'text-yellow-800', selectedBg: 'bg-yellow-500' },
      cyan: { bg: 'bg-cyan-100', text: 'text-cyan-800', selectedBg: 'bg-cyan-500' },
      indigo: { bg: 'bg-indigo-100', text: 'text-indigo-800', selectedBg: 'bg-indigo-500' },
      rose: { bg: 'bg-rose-100', text: 'text-rose-800', selectedBg: 'bg-rose-500' },
      default: { bg: 'bg-gray-100', text: 'text-gray-800', selectedBg: 'bg-gray-500' }
    };
  
    const { bg, text, selectedBg } = colorMap[color] || colorMap.default;
    return isSelected ? `${selectedBg} text-white` : `${bg} ${text}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">标签</h2>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => {
            const isSelected = selectedTag === tag.name;
            const colorClass = getTagColorClass(tag.color, isSelected);
            return (
              <button
                key={tag.name}
                onClick={() => onSelectTag(tag.name)}
                className={`px-3 py-1 rounded-full ${colorClass} text-sm hover:opacity-80 transition-opacity`}
              >
                {tag.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
