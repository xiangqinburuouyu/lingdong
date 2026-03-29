'use client';

import { useState, useEffect } from 'react';

interface ReadingProgressProps {
  articleId: string;
}

export default function ReadingProgress({ articleId }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);
  const [hasRead, setHasRead] = useState(false);

  useEffect(() => {
    // 从 localStorage 读取阅读进度
    const saved = localStorage.getItem(`reading_progress_${articleId}`);
    if (saved) {
      const data = JSON.parse(saved);
      setProgress(data.progress || 0);
      setHasRead(data.hasRead || false);
    }

    // 监听滚动
    const handleScroll = () => {
      const article = document.querySelector('article');
      if (!article) return;

      const rect = article.getBoundingClientRect();
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const articleHeight = article.offsetHeight;
      
      const scrolled = scrollTop - rect.top + windowHeight;
      const total = articleHeight;
      
      const newProgress = Math.min(100, Math.max(0, (scrolled / total) * 100));
      setProgress(newProgress);

      // 如果阅读超过 90%，标记为已读
      if (newProgress >= 90 && !hasRead) {
        setHasRead(true);
        localStorage.setItem(`reading_progress_${articleId}`, JSON.stringify({
          progress: 100,
          hasRead: true,
          completedAt: new Date().toISOString()
        }));
      } else if (newProgress > 0) {
        localStorage.setItem(`reading_progress_${articleId}`, JSON.stringify({
          progress: newProgress,
          hasRead,
          lastRead: new Date().toISOString()
        }));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [articleId, hasRead]);

  if (progress === 0) return null;

  return (
    <div className="fixed top-16 left-0 right-0 h-1 bg-gray-200 z-40">
      <div 
        className="h-full bg-primary-600 transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
      {progress >= 100 && (
        <div className="absolute right-4 top-2 text-xs text-white bg-green-600 px-2 py-1 rounded">
          ✓ 已读完
        </div>
      )}
    </div>
  );
}
