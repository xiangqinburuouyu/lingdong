'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';

interface Stats {
  totalArticles: number;
  totalUsers: number;
  totalViews: number;
  todayViews: number;
  totalComments: number;
  pendingComments: number;
}

const mockStats: Stats = {
  totalArticles: 156,
  totalUsers: 2340,
  totalViews: 1250000,
  todayViews: 8500,
  totalComments: 3420,
  pendingComments: 12,
};

const recentArticles = [
  { id: 1, title: 'AI 芯片：回望过去一年，展望 2026', author: '云石乱笔', views: 222, status: 'published', time: '2 分钟前' },
  { id: 2, title: '芯片 2030 年要国产 80%', author: 'AGI-Sig', views: 12000, status: 'published', time: '38 分钟前' },
  { id: 3, title: '9000 万研发费的背后', author: '公司观察', views: 240000, status: 'draft', time: '1 小时前' },
  { id: 4, title: '宇树科技靠"小脑"赢当下', author: '公司观察', views: 0, status: 'pending', time: '2 小时前' },
];

export default function DashboardPage() {
  const { user } = useStore();
  const [stats, setStats] = useState<Stats>(mockStats);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">欢迎回来，{user?.username}！</h1>
        <p className="text-gray-600 mt-1">这是你的网站数据概览</p>
      </div>

      {/* 数据卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="总文章数"
          value={stats.totalArticles}
          icon="📝"
          trend="+12%"
          trendUp={true}
        />
        <StatCard
          title="总用户数"
          value={stats.totalUsers}
          icon="👥"
          trend="+8.2%"
          trendUp={true}
        />
        <StatCard
          title="总浏览量"
          value={stats.totalViews}
          icon="👁️"
          trend="+25%"
          trendUp={true}
          formatNumber
        />
        <StatCard
          title="今日浏览"
          value={stats.todayViews}
          icon="📈"
          trend="+15%"
          trendUp={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 最新评论 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">评论动态</h2>
            <span className="text-sm text-gray-500">待审核：{stats.pendingComments}</span>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-600 text-sm font-medium">U</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">这篇文章写得很好，学到了很多！</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <span>用户{i * 23}</span>
                    <span>•</span>
                    <span>{i}小时前</span>
                    <span className="text-yellow-600">• 待审核</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="text-green-600 hover:text-green-700 text-sm">✓</button>
                  <button className="text-red-600 hover:text-red-700 text-sm">✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 最近文章 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">最近文章</h2>
            <a href="/admin/articles" className="text-sm text-primary-600 hover:underline">查看全部</a>
          </div>
          <div className="space-y-4">
            {recentArticles.map((article) => (
              <div key={article.id} className="flex items-start justify-between pb-3 border-b border-gray-100 last:border-0">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{article.title}</h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <span>{article.author}</span>
                    <span>•</span>
                    <span>{article.time}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    article.status === 'published' ? 'bg-green-100 text-green-600' :
                    article.status === 'draft' ? 'bg-gray-100 text-gray-600' :
                    'bg-yellow-100 text-yellow-600'
                  }`}>
                    {article.status === 'published' ? '已发布' :
                     article.status === 'draft' ? '草稿' : '待审核'}
                  </span>
                  <span className="text-xs text-gray-500">{article.views.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 快捷操作 */}
      <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">快捷操作</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickAction icon="➕" label="发布文章" href="/admin/articles?action=new" />
          <QuickAction icon="⚡" label="发布快讯" href="/admin/newsflash?action=new" />
          <QuickAction icon="🏷️" label="管理分类" href="/admin/categories" />
          <QuickAction icon="💬" label="审核评论" href="/admin/comments" />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  trend,
  trendUp,
  formatNumber,
}: {
  title: string;
  value: number;
  icon: string;
  trend: string;
  trendUp: boolean;
  formatNumber?: boolean;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {formatNumber ? value.toLocaleString() : value}
          </p>
          <p className={`text-sm mt-2 ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
            {trend} 较上月
          </p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
}

function QuickAction({ icon, label, href }: { icon: string; label: string; href: string }) {
  return (
    <a
      href={href}
      className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
    >
      <span className="text-2xl mb-2">{icon}</span>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </a>
  );
}
