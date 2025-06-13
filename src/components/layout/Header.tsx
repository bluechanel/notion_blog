import Link from 'next/link';

interface HeaderProps {
  activePage?: 'home' | 'tags' | 'about';
}

export default function Header({ activePage = 'home' }: HeaderProps) {
  return (
    <header className="py-8 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between sm:flex-row">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">
            <Link href="/" className="hover:text-gray-600 dark:hover:text-gray-300">
              我的博客
            </Link>
          </h1>
          <nav className="flex space-x-4">
            <Link 
              href="/" 
              className={`${activePage === 'home' ? 'font-medium' : ''} text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white`}
            >
              首页
            </Link>
            <Link 
              href="/tags" 
              className={`${activePage === 'tags' ? 'font-medium' : ''} text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white`}
            >
              标签
            </Link>
            <Link 
              href="/about" 
              className={`${activePage === 'about' ? 'font-medium' : ''} text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white`}
            >
              关于
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}