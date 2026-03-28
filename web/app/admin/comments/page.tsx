'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Comment {
  id: number;
  user: {
    username: string;
    avatar?: string;
  };
  article: {
    id: number;
    title: string;
  };
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  publishTime: string;
}

const mockComments: Comment[] = [
  {
    id: 1,
    user: { username: '张三' },
    article: { id: 1, title: 'AI 芯片：回望过去一年，展望 2026' },
    content: '这篇文章写得很好，学到了很多关于 AI 芯片的知识！',
    status: 'pending',
    publishTime: '2026-03-24 10:15',
  },
  {
    id: 2,
    user: { username: '李四' },
    article: { id: 2, title: '芯片 2030 年要国产 80%' },
    content: '国产芯片加油！期待那一天的到来。',
    status: 'pending',
    publishTime: '2026-03-24 09:30',
  },
  {
    id: 3,
    user: { username: '王五' },
    article: { id: 3, title: '9000 万研发费的背后' },
    content: '分析得很到位，宇树科技确实需要加大 AI 方面的投入。',
    status: 'approved',
    publishTime: '2026-03-23 20:45',
  },
  {
    id: 4,
    user: { username: '赵六' },
    article: { id: 1, title: 'AI 芯片：回望过去一年，展望 2026' },
    content: '广告合作请联系微信 xxxxxx',
    status: 'rejected',
    publishTime: '2026-03-23 18:20',
  },
  {
    id: 5,
    user: { username: '小明' },
    article: { id: 4, title: '特斯拉 FSD 入华的影响' },
    content: 'FSD 入华对国内自动驾驶行业是好事，可以促进竞争。',
    status: 'pending',
    publishTime: '2026-03-23 15:10',
  },
];

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingComment, setDeletingComment] = useState<Comment | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const filteredComments = comments.filter(c => filter === 'all' || c.status === filter);
  const pendingCount = comments.filter(c => c.status === 'pending').length;
  const approvedCount = comments.filter(c => c.status === 'approved').length;
  const rejectedCount = comments.filter(c => c.status === 'rejected').length;

  const handleApprove = async (id: number) => {
    setActionLoading(id);
    await new Promise(resolve => setTimeout(resolve, 500));
    setComments(prev => prev.map(c => c.id === id ? { ...c, status: 'approved' as const } : c));
    setActionLoading(null);
  };

  const handleReject = async (id: number) => {
    setActionLoading(id);
    await new Promise(resolve => setTimeout(resolve, 500));
    setComments(prev => prev.map(c => c.id === id ? { ...c, status: 'rejected' as const } : c));
    setActionLoading(null);
  };

  const handleDelete = (comment: Comment) => {
    setDeletingComment(comment);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deletingComment) return;
    
    await new Promise(resolve => setTimeout(resolve, 300));
    setComments(prev => prev.filter(c => c.id !== deletingComment.id));
    setShowDeleteModal(false);
    setDeletingComment(null);
  };

  const handleViewArticle = (articleId: number) => {
    window.open(`/article/${articleId}`, '_blank');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">评论审核</h1>
          <p className="text-gray-600 mt-1">
            管理用户评论
            {pendingCount > 0 && (
              <span className="ml-2 bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-sm font-medium">
                {pendingCount} 条待审核
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2 text-sm text-gray-600">
          <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full">已通过 {approvedCount}</span>
          <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full">已拒绝 {rejectedCount}</span>
        </div>
      </div>

      {/* 筛选器 */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: '全部', count: comments.length },
            { key: 'pending', label: '待审核', count: pendingCount },
            { key: 'approved', label: '已通过', count: approvedCount },
            { key: 'rejected', label: '已拒绝', count: rejectedCount },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setFilter(item.key as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                filter === item.key
                  ? item.key === 'pending'
                    ? 'bg-yellow-600 text-white'
                    : item.key === 'approved'
                    ? 'bg-green-600 text-white'
                    : item.key === 'rejected'
                    ? 'bg-red-600 text-white'
                    : 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {item.label}
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                filter === item.key ? 'bg-white/20' : 'bg-gray-200'
              }`}>
                {item.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 评论列表 */}
      <div className="space-y-4">
        {filteredComments.map((comment) => (
          <div key={comment.id} className={`bg-white rounded-lg shadow-sm p-6 transition-all ${
            actionLoading === comment.id ? 'opacity-50' : ''
          }`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-600 font-bold">{comment?.user?.username?.[0]}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="font-medium text-gray-900">{comment?.user?.username}</span>
                    <span className="text-gray-400">评论了</span>
                    <button
                      onClick={() => handleViewArticle(comment.article.id)}
                      className="text-primary-600 hover:text-primary-800 hover:underline text-sm font-medium"
                    >
                      {comment.article.title}
                    </button>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-500">{comment.publishTime}</span>
                  </div>
                  <p className="text-gray-700 mb-3">{comment.content}</p>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      comment.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                      comment.status === 'approved' ? 'bg-green-100 text-green-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {comment.status === 'pending' ? '待审核' :
                       comment.status === 'approved' ? '已通过' : '已拒绝'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                {comment.status === 'pending' ? (
                  <>
                    <button
                      onClick={() => handleApprove(comment.id)}
                      disabled={actionLoading !== null}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading === comment.id ? (
                        <>
                          <span className="animate-spin">⏳</span> 处理中...
                        </>
                      ) : (
                        <>
                          <span>✓</span> 通过
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleReject(comment.id)}
                      disabled={actionLoading !== null}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading === comment.id ? (
                        <>
                          <span className="animate-spin">⏳</span> 处理中...
                        </>
                      ) : (
                        <>
                          <span>✕</span> 拒绝
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleDelete(comment)}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-1"
                  >
                    <span>🗑️</span> 删除
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredComments.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <div className="text-6xl mb-4">💬</div>
          <p className="text-gray-600 text-lg">暂无评论</p>
        </div>
      )}

      {/* 删除确认模态框 */}
      {showDeleteModal && deletingComment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">确认删除</h2>
            <p className="text-gray-600 mb-2">
              确定要删除这条评论吗？
            </p>
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-sm text-gray-700">{deletingComment.content}</p>
              <p className="text-xs text-gray-500 mt-2">用户：{deletingComment?.user?.username}</p>
            </div>
            <p className="text-sm text-red-600 mb-6">
              ⚠️ 此操作不可恢复！
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingComment(null);
                }}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200"
              >
                取消
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 操作成功提示 */}
      {actionLoading === null && comments.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg transition-opacity duration-300">
          ✓ 操作成功
        </div>
      )}
    </div>
  );
}
