interface HotArticle {
  id: number;
  title: string;
  views: string;
}

interface Props {
  hotArticles: HotArticle[];
}

export default function Sidebar({ hotArticles }: Props) {
  return (
    <aside className="space-y-6">
      {/* 热门排行 */}
      <div className="bg-white rounded-lg shadow-sm p-5">
        <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" />
          </svg>
          24 小时热文
        </h3>
        <div className="space-y-3">
          {hotArticles.map((article, index) => (
            <div key={article.id} className="flex items-start gap-3 group cursor-pointer">
              <span className={`flex-shrink-0 w-5 h-5 rounded flex items-center justify-center text-xs font-bold ${
                index < 3 ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                {index + 1}
              </span>
              <div className="flex-1">
                <h4 className="text-sm text-gray-700 group-hover:text-primary-600 line-clamp-2 transition-colors">
                  {article.title}
                </h4>
                <span className="text-xs text-gray-400">{article.views}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 广告位/专题 */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg shadow-sm p-5 text-white">
        <h3 className="font-bold text-lg mb-2">开通会员</h3>
        <p className="text-sm text-primary-100 mb-4">
          获取深度研报、独家数据和专属投资机会
        </p>
        <button className="w-full bg-white text-primary-600 py-2 rounded-md text-sm font-medium hover:bg-primary-50 transition-colors">
          立即加入
        </button>
      </div>
    </aside>
  );
}
