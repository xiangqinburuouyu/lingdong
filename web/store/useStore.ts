import { create } from 'zustand';

interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  nickname: string;
  role: string;
}

interface AppState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  favorites: number[];
  login: (user: User, token: string) => void;
  logout: () => void;
  checkAuth: () => boolean;
  toggleFavorite: (articleId: number) => void;
}

const defaultState = {
  user: null,
  token: null,
  isAuthenticated: false,
  favorites: [],
};

export const useStore = create<AppState>((set, get) => ({
  ...defaultState,
  
  login: (user, token) => {
    console.log('🔐 Store login 调用:', user?.username);
    if (!user || !token) {
      console.error('登录参数无效');
      return;
    }
    try {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      console.log('✅ 已保存到 localStorage');
    } catch (e) {
      console.error('保存失败:', e);
    }
    set({ user, token, isAuthenticated: true });
    console.log('✅ Store 状态已更新:', get());
  },
  
  logout: () => {
    console.log('🚪 登出');
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (e) {}
    set({ user: null, token: null, isAuthenticated: false });
  },
  
  checkAuth: () => {
    const state = get();
    return state.isAuthenticated && !!state.token && !!state.user;
  },
  
  toggleFavorite: (articleId) => {
    const favorites = get().favorites;
    set({ 
      favorites: favorites.includes(articleId) 
        ? favorites.filter(id => id !== articleId) 
        : [...favorites, articleId] 
    });
  },
}));

// 在客户端恢复状态
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  if (token && userStr) {
    try {
      const user = JSON.parse(userStr);
      console.log('✅ 从 localStorage 恢复用户:', user.username);
      useStore.setState({ user, token, isAuthenticated: true });
    } catch (e) {
      console.error('恢复失败:', e);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
}

// 辅助函数
export const checkLoginStatus = (): boolean => {
  try {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    return !!(token && userStr);
  } catch (e) {
    return false;
  }
};

export const updateActiveTime = () => {
  try {
    localStorage.setItem('lastActiveTime', new Date().toISOString());
  } catch (e) {}
};

export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch (e) {
    return null;
  }
};
