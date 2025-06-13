import { format } from 'date-fns';

// 格式化日期
export function formatDate(dateString: string): string {
  return format(new Date(dateString), 'MMMM dd, yyyy');
}

// 生成标签颜色类
export function getTagColorClass(color: string): string {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    purple: 'bg-purple-100 text-purple-800',
    pink: 'bg-pink-100 text-pink-800',
    gray: 'bg-gray-100 text-gray-800',
    orange: 'bg-orange-100 text-orange-800',
    default: 'bg-gray-100 text-gray-800',
  };
  
  return colorMap[color] || colorMap.default;
}