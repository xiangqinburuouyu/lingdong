'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { getSettings } from '@/lib/siteSettings';

const mainNav = [
  { name: '推荐', href: '/' },
  { name: '快报', href: '/newsflash' },
  { name: '广场', href: '/square' },
  { name: '视频', href: '/video' },
  { name: '直播', href: '/live' },
];

export default function Header() {
  const router = useRouter();
  const { isAuthenticated, user } = useStore();
  const [settings, setSettings] = useState(getSettings());

  useEffect(() => {
    const handleSettingsChange = () => {
      setSettings(getSettings());
    };
    window.addEventListener('settingsChanged', handleSettingsChange);
    handleSettingsChange();
    return () => window.removeEventListener('settingsChanged', handleSettingsChange);
  }, []);

  // 调试日志
  useEffect(() => {
    console.log('Header state:', { isAuthenticated, user: user?.username });
  }, [isAuthenticated, user]);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-bold text-primary-600 hover:opacity-80 transition-opacity">
              {settings.siteName}
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {mainNav.map((item) => (
                <Link key={item.name} href={item.href} className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors cursor-pointer">
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/search" className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <Link href="/admin" className="text-primary-600 font-medium text-sm hover:text-primary-700 px-3 py-2 rounded-lg hover:bg-primary-50 transition-colors">
                  后台管理
                </Link>
                <span className="text-gray-600 text-sm">{user?.username || user?.nickname || '用户'}</span>
              </div>
            ) : (
              <Link href="/login" className="text-primary-600 font-medium text-sm hover:text-primary-700 px-3 py-2 rounded-lg hover:bg-primary-50 transition-colors">
                登录
              </Link>
            )}
            <button className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors">
              下载 App
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
