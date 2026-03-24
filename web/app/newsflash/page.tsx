'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { newsFlashApi } from '@/lib/api';
import { formatTime } from '@/lib/utils';

interface NewsFlash {
  id: number;
  content: string;
  publishTime: string;
  tags?: string[];
}

export default function NewsFlashPage() {
  const [newsFlashes, setNewsFlashes] = useState<NewsFlash[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNewsFlashes();
  }, []);

  const loadNewsFlashes = async () => {
    try {
      const response: any = await newsFlashApi.getList(50);
      setNewsFlashes(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Failed to load news flashes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            7x24 小时快讯
          </h1>
          <p className="text-gray-600 mt-2">
            实时追踪科技、财经、创投领域最新动态
          </p>
        </div>

        <div className="space-y-4">
          {loading ? (
            // 加载骨架屏
            Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-20 h-6 bg-gray-200 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            newsFlashes.map((item, index) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-20">
                    <span className="text-gray-400 text-sm">
                      {formatTime(item.publishTime)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
                      {item.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="bg-primary-50 text-primary-600 px-2 py-0.5 rounded text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-900 leading-relaxed">{item.content}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <button className="text-gray-400 hover:text-primary-600 text-sm flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        收藏
                      </button>
                      <button className="text-gray-400 hover:text-primary-600 text-sm flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        分享
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {!loading && newsFlashes.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            暂无快讯
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
