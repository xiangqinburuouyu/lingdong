/**
 * 主题配置 - 支持浅色/深色模式
 */

// 浅色主题（默认）
export const lightTheme = {
  // 颜色
  colors: {
    primary: '#0066FF',
    secondary: '#FF6B35',
    background: '#F5F5F5',
    surface: '#FFFFFF',
    text: '#1A1A1A',
    textSecondary: '#666666',
    textTertiary: '#999999',
    border: '#E8E8E8',
    error: '#FF4D4F',
    success: '#07C160',
    warning: '#FF9500',
    info: '#0066FF',
  },
  
  // 卡片
  card: {
    background: '#FFFFFF',
    shadow: '#000000',
    shadowOpacity: 0.1,
  },
  
  // 导航栏
  navigation: {
    background: '#FFFFFF',
    border: '#E8E8E8',
    active: '#0066FF',
    inactive: '#999999',
  },
  
  // 输入框
  input: {
    background: '#F5F5F5',
    border: '#E8E8E8',
    text: '#1A1A1A',
    placeholder: '#999999',
  },
  
  // 按钮
  button: {
    primary: '#0066FF',
    primaryText: '#FFFFFF',
    secondary: '#F5F5F5',
    secondaryText: '#333333',
  },
};

// 深色主题
export const darkTheme = {
  // 颜色
  colors: {
    primary: '#0066FF',
    secondary: '#FF6B35',
    background: '#0D0D0D',
    surface: '#1A1A1A',
    text: '#FFFFFF',
    textSecondary: '#A0A0A0',
    textTertiary: '#666666',
    border: '#2A2A2A',
    error: '#FF4D4F',
    success: '#07C160',
    warning: '#FF9500',
    info: '#0066FF',
  },
  
  // 卡片
  card: {
    background: '#1A1A1A',
    shadow: '#000000',
    shadowOpacity: 0.3,
  },
  
  // 导航栏
  navigation: {
    background: '#1A1A1A',
    border: '#2A2A2A',
    active: '#0066FF',
    inactive: '#666666',
  },
  
  // 输入框
  input: {
    background: '#2A2A2A',
    border: '#3A3A3A',
    text: '#FFFFFF',
    placeholder: '#666666',
  },
  
  // 按钮
  button: {
    primary: '#0066FF',
    primaryText: '#FFFFFF',
    secondary: '#2A2A2A',
    secondaryText: '#FFFFFF',
  },
};

// 主题切换 Hook
export const useTheme = () => {
  // 实际项目中应使用 Context 或 Zustand 管理主题状态
  // 这里简化处理
  return {
    theme: lightTheme,
    isDark: false,
    toggleTheme: () => {},
  };
};

export default {
  light: lightTheme,
  dark: darkTheme,
};
