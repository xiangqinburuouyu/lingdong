'use client';

import { useState, useEffect } from 'react';

interface ReadingModeProps {
  children: React.ReactNode;
}

export default function ReadingMode({ children }: ReadingModeProps) {
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleReadingMode = () => {
    setIsReadingMode(!isReadingMode);
    if (!isReadingMode) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  };

  if (!mounted) return null;

  if (isReadingMode) {
    return (
      <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
        {/* 顶部工具栏 */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <button
            onClick={toggleReadingMode}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">退出阅读模式</span>
          </button>
        </div>

        {/* 文章内容 */}
        <article className="max-w-3xl mx-auto px-6 py-8">
          <div className="prose prose-lg max-w-none">
            {children}
          </div>
        </article>
      </div>
    );
  }

  return (
    <>
      {children}
      <button
        onClick={toggleReadingMode}
        className="fixed bottom-6 right-6 bg-primary-600 text-white p-3 rounded-full shadow-lg hover:bg-primary-700 transition-colors z-40"
        title="进入阅读模式"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </button>
    </>
  );
}
