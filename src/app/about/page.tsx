import { Metadata } from 'next';
import MainLayout from '../../components/layout/MainLayout';

export const metadata: Metadata = {
  title: '关于 | 我的博客',
  description: '了解更多关于我和我的博客',
};

export default function AboutPage() {
  return (
    <MainLayout activePage="about">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">关于我的博客</h2>
        
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p>
            内容暂未开通，请稍后！
          </p>
        </div>
      </div>
    </MainLayout>
  );
}