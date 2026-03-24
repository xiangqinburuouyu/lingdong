'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getSettings } from '@/lib/siteSettings';

const footerLinks = {
  '关于我们': [
    { name: '公司介绍', href: '/about' },
    { name: '团队介绍', href: '/team' },
    { name: '加入我们', href: '/careers' },
    { name: '联系方式', href: '/contact' },
  ],
  '产品服务': [
    { name: '科股宝', href: '/keguvip' },
    { name: 'PRO 会员', href: '/pro' },
    { name: '企业服', href: '/enterprise' },
    { name: '活动', href: '/events' },
  ],
  '合作洽谈': [
    { name: '广告合作', href: '/ads' },
    { name: '内容合作', href: '/content' },
    { name: '媒体合作', href: '/media' },
  ],
};

export default function Footer() {
  const [settings, setSettings] = useState(getSettings());

  // 监听设置变化
  useEffect(() => {
    const handleSettingsChange = () => {
      const newSettings = getSettings();
      setSettings(newSettings);
      console.log('Footer settings updated:', newSettings);
    };

    window.addEventListener('settingsChanged', handleSettingsChange);
    
    // 初始加载时也更新一次
    handleSettingsChange();

    return () => {
      window.removeEventListener('settingsChanged', handleSettingsChange);
    };
  }, []);

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Logo 和简介 */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-2xl font-bold text-white mb-4">{settings.siteName}</h3>
            <p className="text-sm text-gray-400 mb-4">
              {settings.siteDescription}
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">微信</span>
                📱
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">微博</span>
                🌐
              </a>
            </div>
          </div>

          {/* 链接列 */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-medium mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-gray-400">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p>&copy; 2026 {settings.siteName}。All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-white">隐私政策</Link>
              <Link href="/terms" className="hover:text-white">服务条款</Link>
              <span>{settings.icp}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
