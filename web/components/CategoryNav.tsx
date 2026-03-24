const categories = [
  'AGI',
  '出海',
  '创新场景',
  '深度',
  '港股',
  '焦点',
  '创投',
  '汽车',
  '3C',
  '消费',
  '大健康',
  '金融',
  '产业研究',
  '地产',
  '大公司',
  'IPO',
  '创业家',
  '人文',
  '科普',
  '文娱',
];

export default function CategoryNav() {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 py-3 overflow-x-auto">
          {categories.map((category) => (
            <span key={category} className="category-pill whitespace-nowrap">
              {category}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
