'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewArticlePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    author: '',
    category: '',
    image: '',
    tags: '',
  });
  const [publishType, setPublishType] = useState<'draft' | 'publish'>('draft');
  const [submitting, setSubmitting] = useState(false);

  const categories = ['AGI', '出海', '深度', '创投', '汽车', '3C', '消费', '大健康', '金融', '大公司', 'IPO'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // 模拟提交
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert(publishType === 'draft' ? '草稿已保存！' : '文章已发布！');
    router.push('/admin/articles');
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">发布文章</h1>
        <p className="text-gray-600 mt-1">创建新的文章内容</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 基本信息 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">基本信息</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">文章标题 *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="输入文章标题"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">作者 *</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="输入作者名"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">分类 *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="">选择分类</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">封面图 URL</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">标签</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="多个标签用逗号分隔，如：AI，芯片，科技"
              />
            </div>
          </div>
        </div>

        {/* 摘要 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">摘要</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">文章摘要 *</label>
            <textarea
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={3}
              placeholder="简要概括文章内容，200 字以内"
              maxLength={200}
              required
            />
            <p className="text-sm text-gray-500 mt-1">{formData.summary.length}/200</p>
          </div>
        </div>

        {/* 正文 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">正文内容</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">文章内容 *</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={15}
              placeholder="输入文章内容，支持 Markdown 格式"
              required
            />
          </div>
        </div>

        {/* 提交按钮 */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => router.push('/admin/articles')}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
          >
            取消
          </button>
          <button
            type="button"
            onClick={() => setPublishType('draft')}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200"
          >
            保存草稿
          </button>
          <button
            type="submit"
            onClick={() => setPublishType('publish')}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
          >
            立即发布
          </button>
        </div>
      </form>
    </div>
  );
}
