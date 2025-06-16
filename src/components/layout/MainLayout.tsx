import Header from './Header';
import Footer from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
  activePage?: 'home' | 'tags' | 'about';
}

export default function MainLayout({ children, activePage = 'home' }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header activePage={activePage} />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}