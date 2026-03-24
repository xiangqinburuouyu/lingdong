import Image from 'next/image';
import Link from 'next/link';

interface Article {
  id: number;
  title: string;
  summary: string;
  author: string;
  publishTime: string;
  views: number | string;
  category: string;
  image: string;
}

interface Props {
  article: Article;
  featured?: boolean;
}

export default function ArticleCard({ article, featured = false }: Props) {
  if (featured) {
    return (
      <article className="article-card group cursor-pointer">
        <Link href={`/article/${article.id}`}>
          <div className="relative h-64 w-full">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>
          <div className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-primary-100 text-primary-600 px-2 py-0.5 rounded text-xs font-medium">
                {article.category}
              </span>
              <span className="text-gray-400 text-xs">{article.publishTime}</span>
            </div>
            <h3 className="article-title text-2xl mb-3 line-clamp-2">
              {article.title}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
              {article.summary}
            </p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{article.author}</span>
              <span>{typeof article.views === 'number' ? article.views.toLocaleString() : article.views} 阅读</span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="article-card group cursor-pointer">
      <Link href={`/article/${article.id}`} className="flex">
        <div className="flex-1 p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-primary-100 text-primary-600 px-2 py-0.5 rounded text-xs font-medium">
              {article.category}
            </span>
            <span className="text-gray-400 text-xs">{article.publishTime}</span>
          </div>
          <h3 className="article-title text-lg mb-2 line-clamp-2">
            {article.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {article.summary}
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{article.author}</span>
            <span>{typeof article.views === 'number' ? article.views.toLocaleString() : article.views} 阅读</span>
          </div>
        </div>
        <div className="relative w-48 h-32 flex-shrink-0">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover"
          />
        </div>
      </Link>
    </article>
  );
}
