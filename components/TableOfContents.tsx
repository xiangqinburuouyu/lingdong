'use client';

import { useState, useEffect } from 'react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  contentRef: React.RefObject<HTMLElement>;
}

export default function TableOfContents({ contentRef }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!contentRef.current) return;

    // 提取标题
    const elements = Array.from(contentRef.current.querySelectorAll('h2, h3'));
    const items: TOCItem[] = elements.map((el) => {
      // 如果没有 id，添加一个
      if (!el.id) {
        el.id = `heading-${el.textContent}`.toLowerCase().replace(/\s+/g, '-');
      }
      
      return {
        id: el.id,
        text: el.textContent || '',
        level: el.tagName === 'H2' ? 2 : 3
      };
    });

    setHeadings(items);

    // 监听滚动
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px' }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [contentRef]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveId(id);
    }
  };

  if (headings.length === 0) return null;

  return (
    <>
      {/* 移动端悬浮按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-6 left-6 bg-white border border-gray-300 text-gray-700 p-3 rounded-full shadow-lg hover:bg-gray-50 z-40"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>

      {/* 目录面板 */}
      <div className={`
        fixed top-20 right-4 w-64 bg-white rounded-lg shadow-lg border border-gray-200 
        max-h-[calc(100vh-8rem)] overflow-y-auto z-40
        lg:block lg:static lg:w-64 lg:max-h-none lg:shadow-none lg:border lg:rounded-lg
        ${isOpen ? 'block' : 'hidden lg:block'}
      `}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900">目录</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-2">
          {headings.map((heading) => (
            <button
              key={heading.id}
              onClick={() => {
                scrollToHeading(heading.id);
                setIsOpen(false);
              }}
              className={`
                w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                ${heading.level === 3 ? 'pl-6' : ''}
                ${activeId === heading.id 
                  ? 'bg-primary-50 text-primary-600' 
                  : 'text-gray-600 hover:bg-gray-50'
                }
              `}
            >
              {heading.text}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
