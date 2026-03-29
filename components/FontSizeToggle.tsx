'use client';

import { useState, useEffect } from 'react';

export default function FontSizeToggle() {
  const [fontSize, setFontSize] = useState('normal');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('fontSize');
    if (saved) {
      setFontSize(saved);
      applyFontSize(saved);
    }
  }, []);

  const applyFontSize = (size: string) => {
    const root = document.documentElement;
    switch (size) {
      case 'small':
        root.style.setProperty('--text-base', '12px');
        break;
      case 'normal':
        root.style.setProperty('--text-base', '16px');
        break;
      case 'large':
        root.style.setProperty('--text-base', '18px');
        break;
      case 'xlarge':
        root.style.setProperty('--text-base', '20px');
        break;
    }
  };

  const handleSizeChange = (size: string) => {
    setFontSize(size);
    localStorage.setItem('fontSize', size);
    applyFontSize(size);
  };

  if (!mounted) return null;

  return (
    <div className="relative group">
      <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>

      {/* 字体大小菜单 */}
      <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        <div className="py-2">
          {['small', 'normal', 'large', 'xlarge'].map((size) => (
            <button
              key={size}
              onClick={() => handleSizeChange(size)}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between ${
                fontSize === size ? 'text-primary-600 bg-primary-50' : 'text-gray-700'
              }`}
            >
              <span className={
                size === 'small' ? 'text-xs' :
                size === 'normal' ? 'text-sm' :
                size === 'large' ? 'text-base' : 'text-lg'
              }>
                {size === 'small' ? '小' :
                 size === 'normal' ? '标准' :
                 size === 'large' ? '大' : '超大'}
              </span>
              {fontSize === size && <span>✓</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
