'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';

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

// 模拟文章数据用于搜索
const mockArticles: Article[] = [
  { id: 1, title: 'AI 芯片：回望过去一年，展望 2026', summary: '从 Nvidia 的 GTC 2026 大会到 Tesla 宣布自建晶圆厂，从 Google TPU 打入外部市场到 AMD 发起正面挑战，过去一年发生的一切，正在重新定义 AI 算力的未来版图。', author: '云石乱笔', publishTime: '2 分钟前', views: 222, category: 'AGI', image: 'https://picsum.photos/800/400?random=1' },
  { id: 2, title: '芯片 2030 年要国产 80%', summary: '到 2030 年，中国 80% 的本土 AI 基础设施都会用上自研 AI 芯片，现在这个比例才刚到 20%。', author: 'AGI-Sig', publishTime: '38 分钟前', views: 12000, category: '芯片', image: 'https://picsum.photos/800/400?random=2' },
  { id: 3, title: '9000 万研发费的背后，宇树科技', summary: '9000 万的研发费用，是宇树科技维持当前产品领先性和市场势头的必要基础。', author: '公司观察', publishTime: '3 月 23 日', views: 240000, category: '机器人', image: 'https://picsum.photos/800/400?random=3' },
  { id: 4, title: '大模型时代的 AI 基础设施', summary: '随着大模型规模不断增长，AI 基础设施面临前所未有的挑战和机遇。', author: '技术组', publishTime: '3 月 22 日', views: 89000, category: 'AGI', image: 'https://picsum.photos/800/400?random=4' },
  { id: 5, title: '自动驾驶商业化落地加速', summary: '多家车企宣布 L3 级自动驾驶即将量产，商业化落地进入加速期。', author: '汽车组', publishTime: '3 月 21 日', views: 67000, category: '汽车', image: 'https://picsum.photos/800/400?random=5' },
  { id: 6, title: '新能源车的下一个战场', summary: '电池技术、智能座舱、自动驾驶，新能源车竞争进入新阶段。', author: '汽车组', publishTime: '3 月 20 日', views: 54000, category: '汽车', image: 'https://picsum.photos/800/400?random=6' },
  { id: 7, title: '元宇宙虚实融合的新进展', summary: '苹果 Vision Pro 发布后，元宇宙概念再次引发关注，虚实融合技术取得突破。', author: '科技组', publishTime: '3 月 19 日', views: 78000, category: '元宇宙', image: 'https://picsum.photos/800/400?random=7' },
  { id: 8, title: 'Web3 应用的探索与实践', summary: '去中心化应用在多个领域取得突破，Web3 正在从概念走向现实。', author: '区块链组', publishTime: '3 月 18 日', views: 45000, category: 'Web3', image: 'https://picsum.photos/800/400?random=8' },
  { id: 9, title: '人形机器人产业化加速', summary: '特斯拉 Optimus、宇树 H1 等人形机器人产品密集发布，产业化进程加速。', author: '机器人组', publishTime: '3 月 17 日', views: 123000, category: '机器人', image: 'https://picsum.photos/800/400?random=9' },
  { id: 10, title: '硬科技投资的新趋势', summary: '半导体、航空航天、新材料等硬科技领域成为投资热点。', author: '创投组', publishTime: '3 月 16 日', views: 34000, category: '创投', image: 'https://picsum.photos/800/400?random=10' },
];

const hotSearches = [
  'AI 芯片',
  '大模型',
  '自动驾驶',
  '新能源',
  '元宇宙',
  'Web3',
  '机器人',
  '硬科技',
];

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const keyword = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(keyword);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchType, setSearchType] = useState<'all' | 'title' | 'author'>('all');

  // 执行搜索（模拟）
  const performSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setHasSearched(true);
    
    // 模拟搜索延迟
    setTimeout(() => {
      const results = mockArticles.filter(article => {
        const matchQuery = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.category.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (searchType === 'title') {
          return article.title.toLowerCase().includes(searchQuery.toLowerCase());
        } else if (searchType === 'author') {
          return article.author.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return matchQuery;
      });
      
      setArticles(results);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    if (keyword) {
      setQuery(keyword);
      performSearch(keyword);
    }
  }, [keyword]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleHotSearch = (term: string) => {
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  const handleClear = () => {
    setQuery('');
    setArticles([]);
    setHasSearched(false);
    router.push('/search');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* 搜索框 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索文章、作者、关键词..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="bg-primary-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              搜索
            </button>
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="bg-gray-100 text-gray-600 px-4 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                清除
              </button>
            )}
          </form>
          
          {/* 搜索类型筛选 */}
          {hasSearched && (
            <div className="flex gap-2 mt-4">
              <span className="text-sm text-gray-600 py-2">搜索范围：</span>
              <button
                onClick={() => { setSearchType('all'); performSearch(query); }}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  searchType === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                全部
              </button>
              <button
                onClick={() => { setSearchType('title'); performSearch(query); }}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  searchType === 'title'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                标题
              </button>
              <button
                onClick={() => { setSearchType('author'); performSearch(query); }}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  searchType === 'author'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                作者
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 搜索结果 */}
          <div className="lg:col-span-2">
            {!hasSearched && (
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-4">热门搜索</h3>
                <div className="flex flex-wrap gap-2">
                  {hotSearches.map((term, index) => (
                    <button
                      key={term}
                      onClick={() => handleHotSearch(term)}
                      className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-full hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-colors flex items-center gap-2"
                    >
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold ${
                        index < 3 ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {index + 1}
                      </span>
                      {term}
                    </button>
                  ))}
                </div>

                {/* 搜索建议 */}
                <div className="mt-8">
                  <h3 className="font-bold text-lg text-gray-900 mb-4">搜索建议</h3>
                  <div className="bg-white rounded-lg shadow-sm p-6 space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="text-primary-600">💡</span>
                      <div>
                        <p className="text-sm text-gray-700">使用空格分隔多个关键词</p>
                        <p className="text-xs text-gray-500">例如：AI 芯片 2026</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-primary-600">💡</span>
                      <div>
                        <p className="text-sm text-gray-700">使用引号精确匹配短语</p>
                        <p className="text-xs text-gray-500">例如："人工智能芯片"</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-primary-600">💡</span>
                      <div>
                        <p className="text-sm text-gray-700">使用减号排除关键词</p>
                        <p className="text-xs text-gray-500">例如：芯片 -美国</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {hasSearched && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    &quot;{keyword}&quot; 的搜索结果
                  </h2>
                  <span className="text-sm text-gray-500">
                    找到 {articles.length} 篇文章
                  </span>
                </div>

                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600">搜索中...</p>
                  </div>
                ) : articles.length > 0 ? (
                  <div className="space-y-4">
                    {articles.map((article) => (
                      <ArticleCard key={article.id} article={article} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-gray-600 text-lg mb-2">未找到相关文章</p>
                    <p className="text-gray-500 mb-4">试试以下建议：</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <button
                        onClick={() => handleHotSearch('AI')}
                        className="text-primary-600 hover:text-primary-700 text-sm"
                      >
                        搜索 "AI"
                      </button>
                      <button
                        onClick={() => handleHotSearch('芯片')}
                        className="text-primary-600 hover:text-primary-700 text-sm"
                      >
                        搜索 "芯片"
                      </button>
                      <button
                        onClick={() => handleHotSearch('机器人')}
                        className="text-primary-600 hover:text-primary-700 text-sm"
                      >
                        搜索 "机器人"
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* 侧边栏 */}
          <aside>
            <div className="bg-white rounded-lg shadow-sm p-5 sticky top-20">
              <h3 className="font-bold text-lg text-gray-900 mb-4">搜索技巧</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 font-bold">•</span>
                  <span>使用关键词搜索，多个关键词用空格分隔</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 font-bold">•</span>
                  <span>搜索作者名可以找到该作者的所有文章</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 font-bold">•</span>
                  <span>使用分类筛选可以缩小搜索范围</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 font-bold">•</span>
                  <span>点击热门搜索快速查找相关内容</span>
                </li>
              </ul>

              {/* 热门标签 */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-bold text-sm text-gray-900 mb-3">热门标签</h4>
                <div className="flex flex-wrap gap-2">
                  {['AI', '芯片', '自动驾驶', '新能源', '5G', '区块链', '云计算', '大数据'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleHotSearch(tag)}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs hover:bg-primary-50 hover:text-primary-600 transition-colors"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
