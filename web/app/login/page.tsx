'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { userApi } from '@/lib/api';
import { useStore } from '@/store/useStore';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useStore();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('🔐 登录开始:', formData.username);
      
      // 调用登录 API
      const result: any = await userApi.login({
        username: formData.username,
        password: formData.password,
      });

      console.log('✅ 登录结果:', result);

      // 检查响应结构
      // result 已经是 response.data，所以结构是：
      // { message: "登录成功", data: { user: {...}, token: "..." } }
      
      if (result && result.data && result.data.user && result.data.token) {
        const user = result.data.user;
        const token = result.data.token;
        
        console.log('保存用户信息:', user.username);
        
        // 保存到 localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // 更新 Zustand store
        login(user, token);
        
        console.log('✅ 登录成功，跳转后台');
        alert('登录成功！');
        router.push('/admin');
      } else {
        console.error('响应格式错误:', result);
        setError('登录失败，请检查用户名和密码');
      }
    } catch (err: any) {
      console.error('登录错误:', err);
      setError(err.message || '登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">欢迎回来</h1>
          <p className="text-gray-600 mb-8">登录以继续浏览和互动</p>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">用户名</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500"
                placeholder="请输入用户名"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500"
                placeholder="请输入密码"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? '处理中...' : '登录'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-primary-600 hover:text-primary-700 text-sm">
              返回首页
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
