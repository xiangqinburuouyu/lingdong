'use client';

import { useState, useEffect } from 'react';
import { saveSettings, getSettings } from '@/lib/siteSettings';

export default function SettingsPage() {
  const [settings, setSettings] = useState(getSettings());
  const [saved, setSaved] = useState(false);

  // 加载设置
  useEffect(() => {
    const loaded = getSettings();
    setSettings(loaded);
    console.log('Loaded settings:', loaded);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Saving settings:', settings);
    
    // 保存到 localStorage
    saveSettings(settings);
    
    // 显示成功提示
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    alert('设置已保存！刷新页面后生效。');
    
    // 触发设置更新事件
    window.dispatchEvent(new Event('settingsChanged'));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">系统设置</h1>
        <p className="text-gray-600 mt-1">配置网站基本参数</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 基本设置 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">基本设置</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">网站名称</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">网站描述</label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">网站 URL</label>
              <input
                type="url"
                value={settings.siteUrl}
                onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* SEO 设置 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">SEO 设置</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">关键词</label>
              <input
                type="text"
                value={settings.keywords}
                onChange={(e) => setSettings({ ...settings, keywords: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="多个关键词用逗号分隔"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ICP 备案号</label>
              <input
                type="text"
                value={settings.icp}
                onChange={(e) => setSettings({ ...settings, icp: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* 功能开关 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">功能开关</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">开放用户注册</p>
                <p className="text-sm text-gray-500">允许新用户注册账号</p>
              </div>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, enableRegistration: !settings.enableRegistration })}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.enableRegistration ? 'bg-primary-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.enableRegistration ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">启用评论</p>
                <p className="text-sm text-gray-500">允许用户对文章发表评论</p>
              </div>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, enableComment: !settings.enableComment })}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.enableComment ? 'bg-primary-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.enableComment ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">评论审核</p>
                <p className="text-sm text-gray-500">评论需要审核后才能显示</p>
              </div>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, commentAudit: !settings.commentAudit })}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.commentAudit ? 'bg-primary-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.commentAudit ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* 保存按钮 */}
        <div className="flex items-center justify-end gap-4">
          {saved && (
            <span className="text-green-600 text-sm">✓ 设置已保存</span>
          )}
          <button
            type="submit"
            className="bg-primary-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-700"
          >
            保存设置
          </button>
        </div>
      </form>
    </div>
  );
}
