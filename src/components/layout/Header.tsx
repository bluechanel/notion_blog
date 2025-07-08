import Link from 'next/link';
import Image from 'next/image';

interface LinkItem {
  name: string;
  url: string;
}

const linkItems: LinkItem[] = [
  { name: '首页', url: '/' },
  { name: '书单', url: '/books' },
  { name: '关于', url: 'https://about.wileyzhang.com/' }
];

interface HeaderProps {
  activePage?: 'home' | 'tags' | 'about';
}

export default function Header({ activePage = 'home' }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-4 backdrop-blur-md bg-gray-100/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between sm:flex-row">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0 flex flex-row gap-4">
            <Image 
                src="/favicon.png" 
                alt="Wiley Zhang" 
                width={32}
                height={32}
                className="object-cover"
            />
            <Link href="/" className="hover:text-gray-600 dark:hover:text-gray-300">
              Wiley Blog | AI/LLM developer blog
            </Link>
          </h1>
          <nav className="flex space-x-4">
            {linkItems.map(link => (
              <Link 
                key={link.name}
                href={link.url}
                target={link.url === "/" ? "_self" : "_blank"}
                rel="noopener noreferrer"
                className={`${activePage === 'home' ? 'font-medium' : ''} text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}