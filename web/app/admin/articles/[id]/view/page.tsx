'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Article {
  id: number;
  title: string;
  summary: string;
  content: string;
  author: string;
  category: string;
  views: number;
  status: 'published' | 'draft' | 'pending';
  publishTime: string;
  createTime: string;
  updateTime: string;
  tags: string[];
  image?: string;
}

const mockArticle: Article = {
  id: 1,
  title: 'AI 芯片：回望过去一年，展望 2026',
  summary: '从 Nvidia 的 GTC 2026 大会到 Tesla 宣布自建晶圆厂，从 Google TPU 打入外部市场到 AMD 发起正面挑战，过去一年发生的一切，正在重新定义 AI 算力的未来版图。',
  content: `# AI 芯片：回望过去一年，展望 2026

## 引言

2026 年，AI 芯片行业经历了前所未有的变革。从 Nvidia 的 GTC 2026 大会到 Tesla 宣布自建晶圆厂，从 Google TPU 打入外部市场到 AMD 发起正面挑战，过去一年发生的一切，正在重新定义 AI 算力的未来版图。

## Nvidia 的统治地位

Nvidia 在 2026 年继续保持着 AI 芯片市场的统治地位。其最新的 H200 GPU 在性能和能效比上都取得了显著突破，成为大模型训练的首选芯片。

### 关键数据

- H200 GPU 性能提升：40%
- 市场份额：85%
- 年收入：$500 亿

## 竞争对手的反击

### AMD 的挑战

AMD 推出了 MI350 系列 AI 加速卡，试图在高端市场与 Nvidia 竞争。虽然性能差距正在缩小，但生态系统仍是 AMD 面临的主要挑战。

### Google TPU 商业化

Google 宣布将其 TPU 芯片对外销售，标志着云服务厂商开始向上游芯片领域延伸。这一举动可能改变整个行业的竞争格局。

### Tesla 自建晶圆厂

Tesla 宣布投资 100 亿美元自建晶圆厂，专门生产其 FSD 和 Optimus 机器人所需的 AI 芯片。这一垂直整合策略可能成为其他厂商的效仿对象。

## 2026 年展望

展望 2026 年，AI 芯片行业将呈现以下趋势：

1. **性能竞赛继续**：各大厂商将继续提升芯片性能
2. **能效比成为关键**：随着模型规模增大，能效比将成为重要指标
3. **专用芯片兴起**：针对特定场景的专用 AI 芯片将增多
4. **国产芯片崛起**：中国芯片厂商将在政策支持下加速发展

## 结语

AI 芯片行业的竞争才刚刚开始，未来几年我们将见证更多创新和变革。对于投资者和从业者来说，把握行业趋势至关重要。`,
  author: '云石乱笔',
  category: 'AGI',
  views: 12580,
  status: 'published',
  publishTime: '2026-03-24 10:30',
  createTime: '2026-03-24 09:00',
  updateTime: '2026-03-24 10:30',
  tags: ['AI', '芯片', 'Nvidia', 'AMD', '科技'],
  image: 'https://picsum.photos/800/400?random=1',
};

export default function ViewArticlePage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟加载
    setTimeout(() => {
      setArticle(mockArticle);
      setLoading(false);
    }, 500);
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl text-gray-600">文章未找到</h2>
        <Link href="/admin/articles" className="text-primary-600 mt-4 inline-block">
          返回列表
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* 顶部操作栏 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/admin/articles')}
            className="text-gray-600 hover:text-gray-900"
          >
            ← 返回列表
          </button>
          <h1 className="text-2xl font-bold text-gray-900">查看文章</h1>
        </div>
        <div className="flex gap-3">
          <Link
            href={`/admin/articles/${article.id}/edit`}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700"
          >
            编辑
          </Link>
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700">
            删除
          </button>
        </div>
      </div>

      {/* 文章信息卡片 */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-500">状态</p>
            <p className="mt-1">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                article.status === 'published' ? 'bg-green-100 text-green-600' :
                article.status === 'draft' ? 'bg-gray-100 text-gray-600' :
                'bg-yellow-100 text-yellow-600'
              }`}>
                {article.status === 'published' ? '已发布' :
                 article.status === 'draft' ? '草稿' : '待审核'}
              </span>
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">浏览量</p>
            <p className="mt-1 text-lg font-bold text-gray-900">{article.views.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">分类</p>
            <p className="mt-1 text-gray-900">{article.category}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">作者</p>
            <p className="mt-1 text-gray-900">{article.author}</p>
          </div>
        </div>
      </div>

      {/* 文章详情 */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        {/* 封面图 */}
        {article.image && (
          <div className="relative w-full h-64 mb-6 rounded-lg overflow-hidden">
            <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* 标题 */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>

        {/* 摘要 */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-gray-700">{article.summary}</p>
        </div>

        {/* 标签 */}
        <div className="flex gap-2 mb-6">
          {article.tags.map((tag) => (
            <span key={tag} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
              #{tag}
            </span>
          ))}
        </div>

        {/* 正文 */}
        <div className="prose prose-lg max-w-none">
          <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
            {article.content}
          </div>
        </div>

        {/* 时间信息 */}
        <div className="border-t border-gray-200 mt-8 pt-6 text-sm text-gray-500">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <span className="font-medium">创建时间：</span>
              {article.createTime}
            </div>
            <div>
              <span className="font-medium">发布时间：</span>
              {article.publishTime}
            </div>
            <div>
              <span className="font-medium">更新时间：</span>
              {article.updateTime}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
