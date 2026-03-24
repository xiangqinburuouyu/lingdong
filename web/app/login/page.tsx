'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { userApi } from '@/lib/api';
import { useStore } from '@/store/useStore';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useStore();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('Login attempt:', { username: formData.username });

    try {
      if (isLogin) {
        // 使用模拟登录
        const response: any = await userApi.login({
          username: formData.username,
          password: formData.password,
        });
        
        console.log('Login response:', response);
        
        // 保存到 localStorage - 多重备份
        try {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          localStorage.setItem('loginTime', new Date().toISOString());
          localStorage.setItem('lastActiveTime', new Date().toISOString());
          
          // 验证是否保存成功
          const savedToken = localStorage.getItem('token');
          const savedUser = localStorage.getItem('user');
          console.log('Verified save:', { 
            hasToken: !!savedToken, 
            hasUser: !!savedUser 
          });
        } catch (storageError) {
          console.error('Failed to save to localStorage:', storageError);
        }
        
        // 更新 Zustand store
        login(response.user, response.token);
        
        // 验证 Zustand 状态
        console.log('Zustand state after login:', {
          isAuthenticated: true,
          hasToken: !!response.token,
          hasUser: !!response.user,
        });
        
        // 显示成功消息
        alert('登录成功！');
        
        // 使用 router.push 而不是 window.location
        router.push('/admin');
        
      } else {
        await userApi.register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });
        alert('注册成功！请登录');
        setIsLogin(true);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || '操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {isLogin ? '欢迎回来' : '创建账号'}
            </h1>
            <p className="text-gray-600">
              {isLogin ? '登录以继续浏览和互动' : '注册以获取完整体验'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                用户名
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="请输入用户名"
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  邮箱
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="请输入邮箱"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                密码
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="请输入密码"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '处理中...' : isLogin ? '登录' : '注册'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              {isLogin ? '还没有账号？立即注册' : '已有账号？立即登录'}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              登录即表示你同意我们的
              <Link href="/terms" className="text-primary-600 hover:underline">服务条款</Link>
              和
              <Link href="/privacy" className="text-primary-600 hover:underline">隐私政策</Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
