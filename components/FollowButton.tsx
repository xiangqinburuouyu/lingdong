'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';

interface FollowButtonProps {
  authorId: string;
  initialFollowing?: boolean;
}

export default function FollowButton({ authorId, initialFollowing = false }: FollowButtonProps) {
  const { isAuthenticated } = useStore();
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);

  useEffect(() => {
    checkFollowStatus();
  }, [authorId]);

  const checkFollowStatus = async () => {
    if (!isAuthenticated) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/follows/check/${authorId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setFollowing(data.following || false);
    } catch (error) {
      console.error('检查关注状态失败:', error);
    }
  };

  const handleFollow = async () => {
    if (!isAuthenticated) {
      alert('请先登录');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const url = following 
        ? `/api/follows/${authorId}` 
        : `/api/follows/${authorId}`;
      const method = following ? 'DELETE' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setFollowing(!following);
        alert(following ? '已取消关注' : '关注成功');
      } else {
        alert(data.message || '操作失败');
      }
    } catch (error) {
      console.error('操作失败:', error);
      alert('操作失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
        following
          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          : 'bg-primary-600 text-white hover:bg-primary-700'
      }`}
    >
      {loading 
        ? '处理中...' 
        : following 
          ? '✓ 已关注' 
          : '+ 关注作者'
      }
    </button>
  );
}
