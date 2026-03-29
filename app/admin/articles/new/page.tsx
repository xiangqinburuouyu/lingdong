'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStore } from '@/store/useStore';

export default function ArticleEditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useStore();
  const isEdit = searchParams.get('edit') === 'true';
  const articleId = searchParams.get('id');

  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    cover: '',
    status: 'draft' as 'draft' | 'published',
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
    if (isEdit && articleId) {
      fetchArticle(articleId);
    }
  }, [isEdit, articleId, isAuthenticated]);

  const fetchArticle = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/articles/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.data) {
        setFormData({
          title: data.data.title || '',
          summary: data.data.summary || '',
          content: data.data.content || '',
          cover: data.data.cover || '',
          status: data.data.status || 'draft',
        });
      }
    } catch (error) {
      console.error('获取文章失败:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const url = isEdit && articleId ? `/api/articles/${articleId}` : '/api/articles';
      const method = isEdit && articleId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert(isEdit ? '文章更新成功' : '文章创建成功');
        router.push('/admin/articles');
      } else {
        alert(data.message || '操作失败');
      }
    } catch (error) {
      console.error('提交失败:', error);
      alert('操作失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataUpload,
      });

      const data = await res.json();
      if (data.url) {
        setFormData(prev => ({ ...prev, cover: data.url }));
        alert('封面上传成功');
      } else {
        alert('上传失败');
      }
    } catch (error) {
      console.error('上传失败:', error);
      alert('上传失败');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit ? '编辑文章' : '新建文章'}
            </h1>
            <button
              onClick={() => router.push('/admin/articles')}
              className="text-gray-600 hover:text-gray-700"
            >
              返回列表
            </button>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          {/* 标题 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              文章标题 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="请输入文章标题"
              required
              maxLength={200}
            />
          </div>

          {/* 摘要 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              文章摘要
            </label>
            <textarea
              value={formData.summary}
              onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="请输入文章摘要（可选，500 字以内）"
              rows={3}
              maxLength={500}
            />
          </div>

          {/* 封面图片 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              封面图片
            </label>
            <div className="flex items-center gap-4">
              {formData.cover && (
                <div className="relative w-48 h-32 rounded-lg overflow-hidden border border-gray-200">
                  <img src={formData.cover} alt="封面" className="w-full h-full object-cover" />
                </div>
              )}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  disabled={uploading}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
                {uploading && <p className="text-sm text-gray-500 mt-2">上传中...</p>}
              </div>
            </div>
          </div>

          {/* 内容 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              文章内容 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="请输入文章内容"
              rows={20}
              required
            />
            <p className="text-sm text-gray-500 mt-2">
              提示：支持 Markdown 语法
            </p>
          </div>

          {/* 状态 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              文章状态
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="draft"
                  checked={formData.status === 'draft'}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' }))}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">草稿</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="published"
                  checked={formData.status === 'published'}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' }))}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">立即发布</span>
              </label>
            </div>
          </div>

          {/* 提交按钮 */}
          <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '提交中...' : isEdit ? '更新文章' : '创建文章'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/articles')}
              className="text-gray-600 hover:text-gray-700"
            >
              取消
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
