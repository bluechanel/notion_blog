"use client";

import { useState, useEffect, JSX } from 'react';
import { Book } from '@/types/t';
import MainLayout from '@/components/layout/MainLayout';
import Link from 'next/link';

// Icons for each status
const statusIcons: { [key: string]: JSX.Element } = {
  Reading: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-5.25-8.494l-1.5 1.5" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m5.25-8.494l1.5 1.5" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 19.5h15" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6.75 16.5h10.5" />
    </svg>
  ),
  'Ready to Start': (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  ),
  Finished: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
};

// Map color names from JSON to Tailwind CSS classes
const tagColorClasses: { [key: string]: string } = {
  brown: 'bg-yellow-200 text-yellow-800',
  gray: 'bg-gray-200 text-gray-800',
  default: 'bg-blue-200 text-blue-800',
  red: 'bg-red-200 text-red-800',
  pink: 'bg-pink-200 text-pink-800',
  orange: 'bg-orange-200 text-orange-800',
  yellow: 'bg-yellow-200 text-yellow-800',
  green: 'bg-green-200 text-green-800',
  blue: 'bg-blue-200 text-blue-800',
  purple: 'bg-purple-200 text-purple-800',
};

const BooksPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getBooks = async () => {
      try {
        const res = await fetch('/books.json');
        if (!res.ok) {
          throw new Error('Failed to fetch books');
        }
        let data: Book[] = await res.json();
        data = data.filter(book => book.name.trim() !== '📄' && book.name.trim() !== '');
        setBooks(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getBooks();
  }, []);

  const groupedBooks: { [key: string]: Book[] } = {
    'Reading': [],
    'Ready to Start': [],
    'Finished': [],
  };

  books.forEach(book => {
    if (groupedBooks[book.status]) {
      groupedBooks[book.status].push(book);
    }
  });

  const statusOrder = ['Reading', 'Ready to Start', 'Finished'];
  const statusMap: { [key: string]: string } = {
    'Finished': '已读完',
    'Reading': '正在读',
    'Ready to Start': '计划读',
  };

  return (
    <MainLayout>
      <div className="p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-8">我的书单</h1>
        {loading ? (
          <p>加载中...</p>
        ) : (
          statusOrder.map(status => (
            <div key={status} className="mb-12">
              <h2 className="text-2xl font-semibold mb-6 border-b-2 border-gray-200 pb-2 flex items-center">
                {statusIcons[status]}
                {statusMap[status] || status}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedBooks[status].map(book => (
                  <Link key={book.name} href={book.link || '#'} target="_blank" rel="noopener noreferrer" className="block">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 h-full hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold mb-2">{book.name}</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">{book.author}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {book.tags.map(tag => (
                          <span key={tag.name} className={`text-sm rounded-full px-3 py-1 ${tagColorClasses[tag.color] || tagColorClasses['default']}`}>
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </MainLayout>
  );
};

export default BooksPage;
