'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { articleApi, userApi } from '@/lib/api';
import { useStore } from '@/store/useStore';
import { formatTime, formatViews } from '@/lib/utils';

interface Comment {
  id: number;
  user: {
    username: string;
    avatar?: string;
  };
  content: string;
  publishTime: string;
}

export default function ArticlePage() {
  const params = useParams();
  const articleId = parseInt(params.id as string);
  
  const { isAuthenticated, toggleFavorite, favorites } = useStore();
  const [article, setArticle] = useState<any>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const isFavorited = favorites.includes(articleId);

  useEffect(() => {
    loadArticle();
    loadComments();
  }, [articleId]);

  const loadArticle = async () => {
    try {
      const data = await articleApi.getDetail(articleId);
      setArticle(data);
    } catch (error) {
      console.error('Failed to load article:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const response: any = await userApi.getComments(articleId);
      setComments(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Failed to load comments:', error);
    }
  };

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    
    try {
      if (isFavorited) {
        await userApi.unfavorite(articleId);
      } else {
        await userApi.favorite(articleId);
      }
      toggleFavorite(articleId);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !isAuthenticated) return;
    
    setSubmitting(true);
    try {
      await userApi.comment(articleId, commentText);
      setCommentText('');
      loadComments();
    } catch (error) {
      console.error('Failed to post comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl text-gray-600">文章未找到</h1>
          <Link href="/" className="text-primary-600 mt-4 inline-block">返回首页</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 文章头部 */}
        <article className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm font-medium">
              {article.category}
            </span>
            <span className="text-gray-400 text-sm">{formatTime(article.publishTime)}</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {article.title}
          </h1>
          
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-600 font-bold">{article.author[0]}</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{article.author}</p>
                <p className="text-sm text-gray-500">{formatViews(article.views)} 阅读</p>
              </div>
            </div>
            
            <button
              onClick={handleFavorite}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                isFavorited
                  ? 'bg-primary-50 text-primary-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <svg className="w-5 h-5" fill={isFavorited ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {isFavorited ? '已收藏' : '收藏'}
            </button>
          </div>
        </article>

        {/* 文章封面图 */}
        {article.image && (
          <div className="relative w-full h-96 mb-6">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        )}

        {/* 文章内容 */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        {/* 标签 */}
        {article.tags && (
          <div className="flex gap-2 mb-6">
            {article.tags.map((tag: string) => (
              <span key={tag} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* 评论区 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            评论 ({comments.length})
          </h3>
          
          {/* 发表评论 */}
          {isAuthenticated ? (
            <form onSubmit={handleComment} className="mb-6">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="写下你的评论..."
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={3}
              />
              <div className="mt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting || !commentText.trim()}
                  className="bg-primary-600 text-white px-6 py-2 rounded-md font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? '发表中...' : '发表评论'}
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 text-center mb-6">
              <p className="text-gray-600 mb-2">登录后才能发表评论</p>
              <Link href="/login" className="text-primary-600 font-medium">
                立即登录
              </Link>
            </div>
          )}
          
          {/* 评论列表 */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 border-b border-gray-100 pb-4 last:border-0">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-600 font-medium">{comment?.user?.username?.[0]}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">{comment?.user?.username}</span>
                    <span className="text-sm text-gray-400">{formatTime(comment.publishTime)}</span>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
