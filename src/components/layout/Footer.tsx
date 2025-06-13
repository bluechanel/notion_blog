export default function Footer() {
  return (
    <footer className="py-8 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 dark:text-gray-400">
        <p>© {new Date().getFullYear()} 我的博客. 基于 Notion 数据库构建.</p>
      </div>
    </footer>
  );
}