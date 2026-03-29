'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';

interface Comment {
  id: string;
  content: string;
  user: {
    username: string;
    avatar?: string;
  };
  likes: number;
  replies: number;
  createdAt: string;
}

interface CommentListProps {
  articleId: string;
  commentCount?: number;
}

export default function CommentList({ articleId, commentCount = 0 }: CommentListProps) {
  const { isAuthenticated } = useStore();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [articleId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/comments/article/${articleId}?page=1&limit=50`);
      const data = await res.json();
      setComments(data.data || []);
    } catch (error) {
      console.error('获取评论失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      alert('请输入评论内容');
      return;
    }

    if (!isAuthenticated) {
      alert('请先登录');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          articleId,
          content,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('评论成功');
        setContent('');
        fetchComments();
      } else {
        alert(data.message || '评论失败');
      }
    } catch (error) {
      console.error('评论失败:', error);
      alert('评论失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (commentId: string) => {
    if (!isAuthenticated) {
      alert('请先登录');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/comments/${commentId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setComments(comments.map(c => 
          c.id === commentId ? { ...c, likes: data.likes } : c
        ));
      }
    } catch (error) {
      console.error('点赞失败:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* 评论数统计 */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">
          评论 ({comments.length})
        </h3>
        <span className="text-sm text-gray-500">
          共 {commentCount} 条评论
        </span>
      </div>

      {/* 发表评论 */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="写下你的评论..."
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            rows={4}
            maxLength={1000}
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-sm text-gray-500">
              {content.length}/1000
            </span>
            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? '提交中...' : '发表评论'}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 rounded-lg p-6 text-center mb-8">
          <p className="text-gray-600 mb-4">登录后才能发表评论</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700"
          >
            立即登录
          </button>
        </div>
      )}

      {/* 评论列表 */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent mx-auto"></div>
            <p className="text-gray-500 mt-4">加载中...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            暂无评论，快来抢沙发吧！
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-100 pb-6 last:border-0">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  {comment.user.avatar ? (
                    <img src={comment.user.avatar} alt={comment.user.username} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="text-gray-600 font-bold">
                      {comment.user.username?.[0]?.toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        {comment.user.username}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(comment.createdAt).toLocaleString('zh-CN')}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3">{comment.content}</p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLike(comment.id)}
                      className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                      {comment.likes}
                    </button>
                    <button className="text-sm text-gray-500 hover:text-primary-600">
                      回复
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
