'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';

interface InteractionButtonsProps {
  articleId: string;
  initialLikes?: number;
  initialFavorites?: number;
}

export default function InteractionButtons({ 
  articleId, 
  initialLikes = 0,
  initialFavorites = 0 
}: InteractionButtonsProps) {
  const { isAuthenticated } = useStore();
  const [likes, setLikes] = useState(initialLikes);
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (!isAuthenticated) {
      alert('请先登录');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/interactions/articles/${articleId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setLikes(data.likes);
      }
    } catch (error) {
      console.error('点赞失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      alert('请先登录');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const url = favorited 
        ? `/api/interactions/articles/${articleId}/favorite`
        : `/api/interactions/articles/${articleId}/favorite`;
      const method = favorited ? 'DELETE' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setFavorited(!favorited);
        alert(favorited ? '已取消收藏' : '收藏成功');
      }
    } catch (error) {
      console.error('操作失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async (platform: string) => {
    const shareUrl = `${window.location.origin}/article/${articleId}`;
    const shareText = document.title;

    if (platform === 'wechat') {
      // 微信分享（需要复制链接）
      await navigator.clipboard.writeText(shareUrl);
      alert('链接已复制，请在微信中粘贴分享');
    } else if (platform === 'weibo') {
      // 微博分享
      const shareLink = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`;
      window.open(shareLink, '_blank');
    } else if (platform === 'qq') {
      // QQ 分享
      const shareLink = `https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`;
      window.open(shareLink, '_blank');
    }

    // 统计分享
    try {
      await fetch(`/api/interactions/articles/${articleId}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ platform }),
      });
    } catch (error) {
      console.error('分享统计失败:', error);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {/* 点赞 */}
      <button
        onClick={handleLike}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:border-primary-500 hover:text-primary-600 transition-colors disabled:opacity-50"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
        </svg>
        <span className="text-sm font-medium">{likes}</span>
      </button>

      {/* 收藏 */}
      <button
        onClick={handleFavorite}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors disabled:opacity-50 ${
          favorited 
            ? 'border-yellow-500 text-yellow-600 bg-yellow-50' 
            : 'border-gray-300 hover:border-primary-500 hover:text-primary-600'
        }`}
      >
        <svg className="w-5 h-5" fill={favorited ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
        <span className="text-sm font-medium">{favorited ? '已收藏' : '收藏'}</span>
      </button>

      {/* 分享 */}
      <div className="relative group">
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:border-primary-500 hover:text-primary-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <span className="text-sm font-medium">分享</span>
        </button>

        {/* 分享菜单 */}
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
          <div className="py-2">
            <button
              onClick={() => handleShare('wechat')}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <span>📱</span> 微信
            </button>
            <button
              onClick={() => handleShare('weibo')}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <span>🌐</span> 微博
            </button>
            <button
              onClick={() => handleShare('qq')}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <span>💬</span> QQ
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('链接已复制');
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <span>🔗</span> 复制链接
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
