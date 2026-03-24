// 网站设置管理

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  logo: string;
  favicon: string;
  icp: string;
  keywords: string;
  enableRegistration: boolean;
  enableComment: boolean;
  commentAudit: boolean;
  articlesPerPage: number;
}

const defaultSettings: SiteSettings = {
  siteName: '自媒体',
  siteDescription: '专注科技、财经、创投领域的深度媒体平台',
  siteUrl: 'https://example.com',
  logo: '',
  favicon: '',
  icp: '京 ICP 备 XXXXXXXX 号',
  keywords: '科技，财经，创投，AI，芯片，互联网',
  enableRegistration: true,
  enableComment: true,
  commentAudit: true,
  articlesPerPage: 20,
};

const STORAGE_KEY = 'site_settings';

// 保存设置
export const saveSettings = (settings: SiteSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    console.log('Settings saved:', settings);
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
};

// 获取设置
export const getSettings = (): SiteSettings => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load settings:', e);
  }
  return defaultSettings;
};

// 重置为默认设置
export const resetSettings = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to reset settings:', e);
  }
};

// 获取单个设置项
export const getSetting = <K extends keyof SiteSettings>(key: K): SiteSettings[K] => {
  const settings = getSettings();
  return settings[key];
};

// 更新单个设置项
export const updateSetting = <K extends keyof SiteSettings>(
  key: K,
  value: SiteSettings[K]
): void => {
  const settings = getSettings();
  settings[key] = value;
  saveSettings(settings);
};

// 初始化设置（用于页面加载时更新 DOM）
export const applySettings = (): void => {
  if (typeof window === 'undefined') return;
  
  const settings = getSettings();
  
  // 更新页面标题
  document.title = settings.siteName + ' - 打开科技 打开财富';
  
  // 更新 meta description
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute('content', settings.siteDescription);
  }
  
  // 更新 meta keywords
  const metaKeywords = document.querySelector('meta[name="keywords"]');
  if (metaKeywords) {
    metaKeywords.setAttribute('content', settings.keywords);
  }
  
  // 更新网站名称显示
  const siteNameElements = document.querySelectorAll('[data-setting="siteName"]');
  siteNameElements.forEach(el => {
    el.textContent = settings.siteName;
  });
  
  // 更新 ICP 备案号
  const icpElements = document.querySelectorAll('[data-setting="icp"]');
  icpElements.forEach(el => {
    el.textContent = settings.icp;
  });
  
  console.log('Settings applied:', settings);
};

// 监听设置变化
export const setupSettingsListener = (): void => {
  if (typeof window === 'undefined') return;
  
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      console.log('Settings changed, applying...');
      applySettings();
    }
  });
};
