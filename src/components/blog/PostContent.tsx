'use client';

import Image from 'next/image';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeSlug from 'rehype-slug';
import { PrismAsyncLight  as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { coldarkDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import tsx from 'react-syntax-highlighter/dist/cjs/languages/prism/tsx';
import typescript from 'react-syntax-highlighter/dist/cjs/languages/prism/typescript';
import bash from 'react-syntax-highlighter/dist/cjs/languages/prism/bash';
import python from 'react-syntax-highlighter/dist/cjs/languages/prism/python';
import yaml from 'react-syntax-highlighter/dist/cjs/languages/prism/yaml';
import json from 'react-syntax-highlighter/dist/cjs/languages/prism/json';
import { formatDate } from '../../lib/utils';
import MainLayout from '../layout/MainLayout';
import TagButton from './TagButton';
import TableOfContents from './TableOfContents';
import { Post } from '@/types';

// 注册需要高亮的语言
SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('yaml', yaml);
SyntaxHighlighter.registerLanguage('json', json);

type Props = {
  post: Post;
};

const CustomTable: React.FC<React.TableHTMLAttributes<HTMLTableElement>> = (props) => {
  return (
    <div className="overflow-x-auto">
      <table {...props} className="min-w-full" />
    </div>
  );
};

// const StyledCodeWrapper: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => {
//   return (
//     // 在这里应用你想要的任何 Tailwind 类
//     // rounded-lg: 添加圆角
//     // overflow-hidden: 这是关键！防止内部代码的锐利边角溢出，破坏圆角效果
//     <div {...props} className="rounded-lg overflow-hidden">
//       {children}
//     </div>
//   );
// };

// const CustomCodeComponent: Components['code'] = ({ className, children, ...props }) => {
//   const match = /language-(\w+)/.exec(className || '');
//   const inline = !className || !match;
//   // 如果是行内代码
//   if (inline) {
//     return (
//       <code className="bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-gray-200 rounded px-1 py-0.5" {...props}>
//         {children}
//       </code>
//     );
//   }

//   // 如果是带语言标识的代码块
//   if (match) {
//     return (
//       <SyntaxHighlighter
//         style={coldarkDark}
//         language={match[1]}
//         PreTag={StyledCodeWrapper}
//         {...props}
//       >
//         {String(children).replace(/\n$/, '')}
//       </SyntaxHighlighter>
//     );
//   }
  
//   // 如果是没有语言标识的代码块
//   return (
//     <div className="rounded-lg overflow-hidden">
//         <pre {...props as React.DetailedHTMLProps<React.HTMLAttributes<HTMLPreElement>, HTMLPreElement>} className="bg-gray-900 text-white p-4 rounded-lg">
//             <code>{children}</code>
//         </pre>
//     </div>
//   );
// };

export default function PostContent({ post }: Props) {
  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 flex gap-8">
        <article className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          {post.coverImage && (
            <div className="relative h-64 sm:h-96 w-full">
              <Image 
                src={post.coverImage} 
                alt={post.title} 
                fill 
                className="object-cover"
              />
            </div>
          )}
          
          <div className="p-8">
            <header className="mb-8">
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <TagButton key={tag.id} tag={tag} />
                ))}
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                {post.title}
              </h1>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {formatDate(post.date)}
              </div>
            </header>
            
            <div className="prose prose-base prose-gray dark:prose-invert max-w-none p-6 [&_pre]:bg-transparent [&_pre]:p-0">
              <Markdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[
                  rehypeRaw,
                  rehypeSanitize,
                  rehypeSlug
                ]}
                components={{
                  table: CustomTable,
                  // code: CustomCodeComponent
                  // code: ({ className, children, ...props }: { className?: string; children: React.ReactNode } & React.ComponentPropsWithoutRef<"code">) => {
                  //   const match = /language-(\w+)/.exec(className || '');
                  //   const inline = !className || !match;

                  //   if (inline) {
                  //     return (
                  //       <code className="bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-gray-200 rounded px-1 py-0.5" {...props}>
                  //         {children}
                  //       </code>
                  //     );
                  //   }
                  //   return (
                  //     <SyntaxHighlighter
                  //       style={coldarkDark}
                  //       language={match[1]}
                  //       PreTag={StyledCodeWrapper}
                  //       {...props}
                  //     >
                  //       {String(children).replace(/\n$/, '')}
                  //     </SyntaxHighlighter>
                  //   );
                  // },
                }}
              >
                {post.content}
              </Markdown>
            </div>
          </div>
        </article>
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <TableOfContents />
          </div>
        </aside>
      </div>
    </MainLayout>
  );
}