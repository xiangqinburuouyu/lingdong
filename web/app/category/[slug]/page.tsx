'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';
import { categoryApi } from '@/lib/api';
import { formatTime } from '@/lib/utils';

interface Article {
  id: number;
  title: string;
  summary: string;
  author: string;
  publishTime: string;
  views: number;
  category: string;
  image: string;
}

const categoryNames: Record<string, string> = {
  'agi': 'AGI',
  'chuhai': '出海',
  'shendu': '深度',
  'chuangtou': '创投',
  'qiche': '汽车',
  '3c': '3C',
  'xiaofei': '消费',
  'jinkang': '大健康',
  'jinrong': '金融',
  'dagonmsi': '大公司',
  'ipo': 'IPO',
};

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadArticles();
  }, [slug, page]);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const response: any = await categoryApi.getArticles(slug, { page, limit: 20 });
      const data: Article[] = Array.isArray(response) ? response : [];
      setArticles(prev => page === 1 ? data : [...prev, ...data]);
      setHasMore(data.length === 20);
    } catch (error) {
      console.error('Failed to load articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const categoryName = categoryNames[slug] || slug.toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <CategoryBanner name={categoryName} slug={slug} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 文章列表 */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {categoryName} · 最新文章
              </h2>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-primary-600 text-white rounded text-sm">
                  最新
                </button>
                <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm hover:bg-gray-200">
                  最热
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            {loading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
              </div>
            )}

            {!loading && hasMore && (
              <div className="text-center py-8">
                <button
                  onClick={() => setPage(p => p + 1)}
                  className="bg-white border border-gray-300 text-gray-700 px-8 py-2 rounded-md hover:bg-gray-50"
                >
                  加载更多
                </button>
              </div>
            )}

            {!loading && !hasMore && articles.length > 0 && (
              <div className="text-center py-8 text-gray-500">
                没有更多文章了
              </div>
            )}

            {!loading && articles.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg mb-2">该分类下暂无文章</p>
                <Link href="/" className="text-primary-600">返回首页</Link>
              </div>
            )}
          </div>

          {/* 侧边栏 */}
          <aside className="space-y-6">
            <CategoryList currentSlug={slug} />
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function CategoryBanner({ name, slug }: { name: string; slug: string }) {
  return (
    <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-2">{name}</h1>
        <p className="text-primary-100">
          探索{name}领域的最新资讯与深度分析
        </p>
      </div>
    </div>
  );
}

function CategoryList({ currentSlug }: { currentSlug: string }) {
  const categories = [
    { name: 'AGI', slug: 'agi' },
    { name: '出海', slug: 'chuhai' },
    { name: '深度', slug: 'shendu' },
    { name: '创投', slug: 'chuangtou' },
    { name: '汽车', slug: 'qiche' },
    { name: '3C', slug: '3c' },
    { name: '消费', slug: 'xiaofei' },
    { name: '大健康', slug: 'jinkang' },
    { name: '金融', slug: 'jinrong' },
    { name: '大公司', slug: 'dagonmsi' },
    { name: 'IPO', slug: 'ipo' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <h3 className="font-bold text-lg text-gray-900 mb-4">全部分类</h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}`}
            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
              currentSlug === cat.slug
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-primary-50 hover:text-primary-600'
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
