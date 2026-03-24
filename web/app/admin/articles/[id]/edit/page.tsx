'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Article {
  id: number;
  title: string;
  summary: string;
  content: string;
  author: string;
  category: string;
  image: string;
  tags: string[];
}

const mockArticle: Article = {
  id: 1,
  title: 'AI 芯片：回望过去一年，展望 2026',
  summary: '从 Nvidia 的 GTC 2026 大会到 Tesla 宣布自建晶圆厂，从 Google TPU 打入外部市场到 AMD 发起正面挑战，过去一年发生的一切，正在重新定义 AI 算力的未来版图。',
  content: `# AI 芯片：回望过去一年，展望 2026

## 引言

2026 年，AI 芯片行业经历了前所未有的变革...

## Nvidia 的统治地位

Nvidia 在 2026 年继续保持着 AI 芯片市场的统治地位...

## 竞争对手的反击

AMD 推出了 MI350 系列 AI 加速卡...

## 2026 年展望

展望 2026 年，AI 芯片行业将呈现以下趋势...

## 结语

AI 芯片行业的竞争才刚刚开始...`,
  author: '云石乱笔',
  category: 'AGI',
  image: 'https://picsum.photos/800/400?random=1',
  tags: ['AI', '芯片', 'Nvidia', 'AMD', '科技'],
};

export default function EditArticlePage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<Article>({
    id: 0,
    title: '',
    summary: '',
    content: '',
    author: '',
    category: '',
    image: '',
    tags: [],
  });

  const categories = ['AGI', '出海', '深度', '创投', '汽车', '3C', '消费', '大健康', '金融', '大公司', 'IPO'];

  useEffect(() => {
    // 模拟加载文章数据
    setTimeout(() => {
      setFormData(mockArticle);
      setLoading(false);
    }, 500);
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent, action: 'save' | 'publish') => {
    e.preventDefault();
    setSubmitting(true);
    
    // 模拟提交
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert(action === 'save' ? '修改已保存！' : '文章已更新发布！');
    router.push('/admin/articles');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/admin/articles')}
            className="text-gray-600 hover:text-gray-900"
          >
            ← 返回列表
          </button>
          <h1 className="text-2xl font-bold text-gray-900">编辑文章</h1>
        </div>
      </div>

      <form className="space-y-6">
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
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">作者 *</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                value={formData.tags.join(', ')}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()) })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="多个标签用逗号分隔"
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
              required
            />
            <p className="text-sm text-gray-500 mt-1">支持 Markdown 格式</p>
          </div>
        </div>

        {/* 提交按钮 */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => router.push('/admin/articles')}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
            disabled={submitting}
          >
            取消
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'save')}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50"
            disabled={submitting}
          >
            保存修改
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'publish')}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50"
            disabled={submitting}
          >
            更新发布
          </button>
        </div>
      </form>
    </div>
  );
}
