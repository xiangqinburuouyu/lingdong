'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Article {
  id: number;
  title: string;
  author: string;
  category: string;
  views: number;
  status: 'published' | 'draft' | 'pending';
  publishTime: string;
}

const mockArticles: Article[] = [
  { id: 1, title: 'AI 芯片：回望过去一年，展望 2026', author: '云石乱笔', category: 'AGI', views: 222, status: 'published', publishTime: '2026-03-24 10:30' },
  { id: 2, title: '芯片 2030 年要国产 80%', author: 'AGI-Sig', category: '硬科技', views: 12000, status: 'published', publishTime: '2026-03-24 09:45' },
  { id: 3, title: '9000 万研发费的背后', author: '公司观察', category: '机器人', views: 240000, status: 'draft', publishTime: '2026-03-23 15:20' },
  { id: 4, title: '宇树科技靠"小脑"赢当下', author: '公司观察', category: '机器人', views: 0, status: 'pending', publishTime: '2026-03-23 14:00' },
  { id: 5, title: '特斯拉 FSD 入华的影响', author: '汽车组', category: '汽车', views: 89000, status: 'published', publishTime: '2026-03-22 11:30' },
];

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>(mockArticles);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; title: string } | null>(null);

  const handleDelete = (id: number, title: string) => {
    setDeleteTarget({ id, title });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    
    // 模拟删除
    await new Promise(resolve => setTimeout(resolve, 500));
    setArticles(prev => prev.filter(a => a.id !== deleteTarget.id));
    setShowDeleteModal(false);
    setDeleteTarget(null);
    alert('文章已删除');
  };

  const filteredArticles = articles.filter(article => {
    const matchStatus = selectedStatus === 'all' || article.status === selectedStatus;
    const matchSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       article.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">文章管理</h1>
          <p className="text-gray-600 mt-1">管理所有文章内容</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="btn-primary"
        >
          <span>➕</span> 发布文章
        </Link>
      </div>

      {/* 筛选器 */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索文章标题或作者..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'published', 'draft', 'pending'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedStatus === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? '全部' :
                 status === 'published' ? '已发布' :
                 status === 'draft' ? '草稿' : '待审核'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 文章列表 */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">标题</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">作者</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">分类</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">浏览量</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">时间</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredArticles.map((article) => (
              <tr key={article.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900 line-clamp-1">{article.title}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{article.author}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">{article.category}</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{article.views.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    article.status === 'published' ? 'bg-green-100 text-green-600' :
                    article.status === 'draft' ? 'bg-gray-100 text-gray-600' :
                    'bg-yellow-100 text-yellow-600'
                  }`}>
                    {article.status === 'published' ? '已发布' :
                     article.status === 'draft' ? '草稿' : '待审核'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{article.publishTime}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/articles/${article.id}/view`}
                      className="table-action-btn table-action-view"
                    >
                      <span>👁️</span> 查看
                    </Link>
                    <Link
                      href={`/admin/articles/${article.id}/edit`}
                      className="table-action-btn table-action-edit"
                    >
                      <span>✏️</span> 编辑
                    </Link>
                    <button
                      onClick={() => handleDelete(article.id, article.title)}
                      className="table-action-btn table-action-delete"
                    >
                      <span>🗑️</span> 删除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 分页 */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-gray-600">显示 {filteredArticles.length} 篇文章</p>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50" disabled>
            上一页
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
            下一页
          </button>
        </div>
      </div>

      {/* 删除确认对话框 */}
      {showDeleteModal && deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">确认删除</h2>
            <p className="text-gray-600 mb-6">
              确定要删除文章 <span className="font-bold text-gray-900">&quot;{deleteTarget.title}&quot;</span> 吗？
              <br />
              <span className="text-sm text-red-600">此操作不可恢复！</span>
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteTarget(null);
                }}
                className="btn-secondary flex-1"
              >
                取消
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="btn-danger flex-1"
              >
                <span>⚠️</span> 确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
