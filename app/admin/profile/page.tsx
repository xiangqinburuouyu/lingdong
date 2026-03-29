'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';

export default function UserProfilePage() {
  const router = useRouter();
  const { isAuthenticated, user } = useStore();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchProfile();
  }, [isAuthenticated]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch('/api/user-profile/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setProfile(data.data);
    } catch (error) {
      console.error('获取用户画像失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mx-auto"></div>
          <p className="text-gray-500 mt-4">加载中...</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">个人中心</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* 用户信息卡片 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-3xl text-primary-600 font-bold">
                {profile.user.username?.[0]?.toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{profile.user.username}</h2>
              <p className="text-gray-500">{profile.user.email}</p>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                profile.activityLevel === '非常活跃' ? 'bg-red-100 text-red-600' :
                profile.activityLevel === '活跃' ? 'bg-green-100 text-green-600' :
                profile.activityLevel === '一般' ? 'bg-yellow-100 text-yellow-600' :
                'bg-gray-100 text-gray-600'
              }`}>
                {profile.activityLevel}
              </span>
            </div>
          </div>
        </div>

        {/* 统计数据 */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <StatCard label="文章数" value={profile.stats.articleCount} icon="📝" />
          <StatCard label="评论数" value={profile.stats.commentCount} icon="💬" />
          <StatCard label="关注数" value={profile.stats.followingCount} icon="👤" />
          <StatCard label="粉丝数" value={profile.stats.followerCount} icon="👥" />
          <StatCard label="30 天文章" value={profile.stats.recentArticlesCount} icon="📅" />
          <StatCard label="30 天评论" value={profile.stats.recentCommentsCount} icon="💭" />
        </div>

        {/* 阅读偏好 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">📚 阅读偏好</h3>
          {profile.readingPreference.length > 0 ? (
            <div className="space-y-3">
              {profile.readingPreference.map((pref, index) => {
                const maxCount = profile.readingPreference[0]?.count || 1;
                const percentage = (pref.count / maxCount) * 100;
                return (
                  <div key={index} className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 w-24">{pref.name}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                      <div 
                        className="bg-primary-500 h-full rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 w-12 text-right">{pref.count}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">暂无数据</p>
          )}
        </div>

        {/* 账号信息 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">🔐 账号信息</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">用户名</span>
              <span className="text-gray-900 font-medium">{profile.user.username}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">邮箱</span>
              <span className="text-gray-900 font-medium">{profile.user.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">角色</span>
              <span className="text-gray-900 font-medium">
                {profile.user.role === 'admin' ? '管理员' : '普通用户'}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">注册时间</span>
              <span className="text-gray-900 font-medium">
                {new Date(profile.user.createdAt).toLocaleDateString('zh-CN')}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// 统计卡片组件
function StatCard({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 text-center">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}
