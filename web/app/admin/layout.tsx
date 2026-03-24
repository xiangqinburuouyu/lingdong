'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useStore, checkLoginStatus, updateActiveTime } from '@/store/useStore';
import './globals.css';

const menuItems = [
  { name: '仪表盘', icon: '📊', href: '/admin' },
  { name: '文章管理', icon: '📝', href: '/admin/articles' },
  { name: '分类管理', icon: '🏷️', href: '/admin/categories' },
  { name: '快讯管理', icon: '⚡', href: '/admin/newsflash' },
  { name: '用户管理', icon: '👥', href: '/admin/users' },
  { name: '评论审核', icon: '💬', href: '/admin/comments' },
  { name: '系统设置', icon: '⚙️', href: '/admin/settings' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, isAuthenticated, login, checkAuth } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isChecking, setIsChecking] = useState(true);

  // 检查登录状态并定期更新活跃时间
  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      console.log('Checking login status:', {
        hasToken: !!token,
        hasUser: !!storedUser,
        isAuthenticated,
      });
      
      if (token && storedUser && !isAuthenticated) {
        try {
          const userObj = JSON.parse(storedUser);
          login(userObj, token);
          console.log('Restored login from localStorage');
        } catch (e) {
          console.error('Failed to restore login:', e);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      
      setIsChecking(false);
    };
    
    checkLogin();
    
    // 定期更新活跃时间（每 5 分钟）
    const interval = setInterval(() => {
      if (isAuthenticated) {
        updateActiveTime();
      }
    }, 5 * 60 * 1000); // 5 minutes
    
    return () => clearInterval(interval);
  }, [isAuthenticated, login]);

  // 如果需要强制登录检查
  useEffect(() => {
    if (!isChecking && !isAuthenticated) {
      const isValid = checkAuth();
      console.log('Auth check result:', isValid);
      
      if (!isValid) {
        console.log('Not authenticated, redirecting to login');
        router.push('/login');
      }
    }
  }, [isChecking, isAuthenticated, checkAuth, router]);

  const handleNavClick = (href: string) => {
    console.log('Navigating to:', href);
    router.push(href);
  };

  const toggleSidebar = () => {
    console.log('Toggling sidebar, current:', sidebarOpen);
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 顶部导航栏 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title={sidebarOpen ? '收起菜单' : '展开菜单'}
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link href="/" className="text-xl font-bold text-primary-600 hover:text-primary-700 transition-colors">
              自媒体后台
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              返回前台
            </Link>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-600 font-bold text-sm">
                  {user?.username?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-700">
                {user?.username || '未登录'}
              </span>
            </div>
            <button
              onClick={() => {
                logout();
                router.push('/login');
              }}
              className="text-gray-600 hover:text-red-600 text-sm font-medium transition-colors"
            >
              退出
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* 侧边栏 */}
        <aside
          className={`bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out ${
            sidebarOpen ? 'w-64' : 'w-0'
          } overflow-hidden`}
        >
          <nav className="p-4 space-y-1 min-w-[256px]">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/admin' && pathname.startsWith(item.href));
              
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary-50 text-primary-600 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm'
                  }`}
                >
                  <span className="text-lg flex-shrink-0">{item.icon}</span>
                  <span className="truncate">{item.name}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* 主内容区 */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
