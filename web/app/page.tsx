import Header from '@/components/Header';
import CategoryNav from '@/components/CategoryNav';
import ArticleCard from '@/components/ArticleCard';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';

// 模拟数据 - 后续会替换为 API 调用
const featuredArticles = [
  {
    id: 1,
    title: 'AI 芯片：回望过去一年，展望 2026',
    summary: '从 Nvidia 的 GTC 2026 大会到 Tesla 宣布自建晶圆厂，从 Google TPU 打入外部市场到 AMD 发起正面挑战，过去一年发生的一切，正在重新定义 AI 算力的未来版图。',
    author: '云石乱笔',
    publishTime: '2 分钟前',
    views: 222,
    category: 'AGI',
    image: 'https://picsum.photos/800/400?random=1',
  },
  {
    id: 2,
    title: '芯片 2030 年要国产 80%，但眼下 AI 安全投入竟不足 5%：Gartner 2026 拉响 CIO 警报',
    summary: '到 2030 年，中国 80% 的本土 AI 基础设施都会用上自研 AI 芯片，现在这个比例才刚到 20%。',
    author: 'AGI-Sig',
    publishTime: '38 分钟前',
    views: 12000,
    category: '芯片',
    image: 'https://picsum.photos/800/400?random=2',
  },
  {
    id: 3,
    title: '9000 万研发费的背后，宇树科技靠"小脑"赢当下，能靠 42 亿补"大脑"短板吗？',
    summary: '9000 万的研发费用，是宇树科技维持当前产品领先性和市场势头的必要基础，但远不足以帮助其构建应对下一阶段全球竞争所需的、以高级别 AI 和通用智能为核心的决定性行业壁垒。',
    author: '公司观察',
    publishTime: '3 月 23 日',
    views: 240000,
    category: '机器人',
    image: 'https://picsum.photos/800/400?random=3',
  },
];

const newsFlash = [
  { id: 1, content: '央行行长潘功胜：构建科学稳健的货币政策体系，继续实施好适度宽松的货币政策', time: '10:30' },
  { id: 2, content: '工信部：到 2026 年底培育一批行业数据合作联合体，建设重点行业数据可信互联平台', time: '09:45' },
  { id: 3, content: '广东：到 2030 年力争培育形成万亿元级赛道 3 个以上', time: '09:15' },
  { id: 4, content: '国家对成品油价格采取临时调控措施：平均每升少涨约 0.85 元', time: '08:30' },
];

const hotArticles = [
  { id: 1, title: '中微半导 1.6 亿"捡漏"IPO 折戟标的，MCU 龙头开启存储芯片补位战', views: '24.0 万' },
  { id: 2, title: '停牌前暴涨 12%！机器人概念股拟收购曾瑞智控', views: '18.5 万' },
  { id: 3, title: '台积电 2 纳米制程产能严重供不应求，排单到 2028 年以后', views: '15.2 万' },
  { id: 4, title: '北京三部门约谈 12 家平台企业，通报"内卷式"竞争第一批问题', views: '12.8 万' },
  { id: 5, title: '电视销量大涨，液晶电视面板涨价', views: '10.3 万' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <CategoryNav />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* 快讯栏 */}
        <section className="mb-6 bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-4 mb-3">
            <span className="text-primary-600 font-bold text-sm">快讯</span>
            <span className="text-gray-300">|</span>
            <div className="flex-1 overflow-hidden">
              <div className="flex gap-8 text-sm text-gray-600">
                {newsFlash.map((item) => (
                  <span key={item.id} className="whitespace-nowrap">
                    <span className="text-gray-400 mr-2">{item.time}</span>
                    {item.content}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧文章列表 */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">推荐</h2>
            {featuredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} featured />
            ))}
            
            {/* 更多文章 */}
            <div className="space-y-4 mt-6">
              {featuredArticles.map((article) => (
                <ArticleCard key={`list-${article.id}`} article={article} />
              ))}
            </div>
          </div>

          {/* 右侧边栏 */}
          <Sidebar hotArticles={hotArticles} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
