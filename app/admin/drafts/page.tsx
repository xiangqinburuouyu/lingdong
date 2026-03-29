'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';

interface Draft {
  id: string;
  title: string;
  summary: string;
  updatedAt: string;
}

export default function DraftsPage() {
  const router = useRouter();
  const { isAuthenticated } = useStore();
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchDrafts();
  }, [page, isAuthenticated]);

  const fetchDrafts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/drafts/my-drafts?page=${page}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setDrafts(data.data || []);
      setTotal(data.pagination?.total || 0);
    } catch (error) {
      console.error('获取草稿失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这篇草稿吗？')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        alert('删除成功');
        fetchDrafts();
      } else {
        alert('删除失败');
      }
    } catch (error) {
      console.error('删除失败:', error);
      alert('删除失败');
    }
  };

  const handlePublish = async (id: string) => {
    if (!confirm('确定要发布这篇草稿吗？')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/drafts/${id}/publish`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        alert('发布成功');
        router.push('/admin/articles');
      } else {
        const data = await res.json();
        alert(data.message || '发布失败');
      }
    } catch (error) {
      console.error('发布失败:', error);
      alert('发布失败');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">草稿箱</h1>
            <button
              onClick={() => router.push('/admin/articles/new')}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
            >
              + 新建文章
            </button>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* 统计信息 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">草稿数量</div>
              <div className="text-2xl font-bold text-gray-900 mt-2">{total} 篇</div>
            </div>
            <div className="text-sm text-gray-500">
              草稿会自动保存，7 天后未编辑的草稿将被归档
            </div>
          </div>
        </div>

        {/* 草稿列表 */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="divide-y divide-gray-200">
            {loading ? (
              <div className="px-6 py-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent mx-auto"></div>
                <p className="text-gray-500 mt-4">加载中...</p>
              </div>
            ) : drafts.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500 mb-4">暂无草稿</p>
                <button
                  onClick={() => router.push('/admin/articles/new')}
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
                >
                  创建第一篇文章
                </button>
              </div>
            ) : (
              drafts.map((draft) => (
                <div key={draft.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {draft.title || '无标题草稿'}
                      </h3>
                      <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                        {draft.summary || '暂无摘要'}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>
                          最后编辑：{new Date(draft.updatedAt).toLocaleString('zh-CN')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => router.push(`/admin/articles/new?edit=true&id=${draft.id}`)}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium px-3 py-1.5 rounded hover:bg-primary-50"
                      >
                        继续编辑
                      </button>
                      <button
                        onClick={() => handlePublish(draft.id)}
                        className="text-green-600 hover:text-green-700 text-sm font-medium px-3 py-1.5 rounded hover:bg-green-50"
                      >
                        发布
                      </button>
                      <button
                        onClick={() => handleDelete(draft.id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium px-3 py-1.5 rounded hover:bg-red-50"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 分页 */}
          {total > 0 && (
            <div className="border-t border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  共 {total} 篇草稿，第 {page} 页
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    上一页
                  </button>
                  <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={page * 10 >= total}
                    className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    下一页
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
