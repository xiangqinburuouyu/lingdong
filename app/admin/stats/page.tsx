'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';

export default function StatsPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useStore();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalUsers: 0,
    totalViews: 0,
    dailyTrend: []
  });

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login');
      return;
    }
    fetchStats();
  }, [isAuthenticated, user]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const [overviewRes, trendRes] = await Promise.all([
        fetch('/api/stats/overview?days=30', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/stats/daily-trend?days=30', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const overview = await overviewRes.json();
      const trend = await trendRes.json();

      setStats({
        totalArticles: overview.data?.totalArticles || 0,
        totalUsers: overview.data?.totalUsers || 0,
        totalViews: overview.data?.totalViews || 0,
        dailyTrend: trend.data || []
      });
    } catch (error) {
      console.error('获取统计失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">数据统计</h1>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent mx-auto"></div>
            <p className="text-gray-500 mt-4">加载中...</p>
          </div>
        ) : (
          <>
            {/* 统计卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600">总文章数</div>
                    <div className="text-3xl font-bold text-gray-900 mt-2">
                      {stats.totalArticles}
                    </div>
                  </div>
                  <div className="text-4xl">📝</div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600">总用户数</div>
                    <div className="text-3xl font-bold text-gray-900 mt-2">
                      {stats.totalUsers}
                    </div>
                  </div>
                  <div className="text-4xl">👥</div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600">总浏览量</div>
                    <div className="text-3xl font-bold text-gray-900 mt-2">
                      {stats.totalViews.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-4xl">👁️</div>
                </div>
              </div>
            </div>

            {/* 趋势图表 */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                30 天访问趋势
              </h2>
              {stats.dailyTrend.length > 0 ? (
                <div className="h-64 flex items-end gap-2">
                  {stats.dailyTrend.map((day: any, index: number) => {
                    const maxViews = Math.max(...stats.dailyTrend.map((d: any) => d.views));
                    const height = maxViews > 0 ? (day.views / maxViews) * 100 : 0;
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div 
                          className="w-full bg-primary-500 rounded-t transition-all hover:bg-primary-600"
                          style={{ height: `${height}%` }}
                          title={`${new Date(day._id).toLocaleDateString('zh-CN')}: ${day.views} 次浏览`}
                        />
                        <span className="text-xs text-gray-500 rotate-45 origin-left">
                          {new Date(day._id).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  暂无数据
                </div>
              )}
            </div>

            {/* 热门文章 */}
            <HotArticles />
          </>
        )}
      </main>
    </div>
  );
}

// 热门文章组件
function HotArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHotArticles();
  }, []);

  const fetchHotArticles = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/stats/articles/hot?limit=10&days=7', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setArticles(data.data || []);
    } catch (error) {
      console.error('获取热门文章失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">
        🔥 7 天热门文章
      </h2>
      {loading ? (
        <div className="text-center py-8 text-gray-500">加载中...</div>
      ) : articles.length > 0 ? (
        <div className="space-y-4">
          {articles.map((article: any, index: number) => (
            <div key={article.id} className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-600 font-bold">{index + 1}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 line-clamp-1">{article.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                  <span>{article.author?.username}</span>
                  <span>👁️ {article.views?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">暂无数据</div>
      )}
    </div>
  );
}
