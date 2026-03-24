import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
}

interface Article {
  id: number;
  title: string;
  summary: string;
  content: string;
  author: string;
  publishTime: string;
  views: number;
  category: string;
  image: string;
}

interface NewsFlash {
  id: number;
  content: string;
  publishTime: string;
}

interface AppState {
  // 用户状态
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  
  // 数据缓存
  articles: Article[];
  newsFlashes: NewsFlash[];
  favorites: number[];
  
  // 用户操作
  login: (user: User, token: string) => void;
  logout: () => void;
  toggleFavorite: (articleId: number) => void;
  checkAuth: () => boolean;
  
  // 数据更新
  setArticles: (articles: Article[]) => void;
  setNewsFlashes: (newsFlashes: NewsFlash[]) => void;
}

// 自定义存储 - 增强持久化
const createCustomStorage = () => {
  return {
    getItem: (name: string) => {
      try {
        const item = localStorage.getItem(name);
        if (!item) return null;
        return JSON.parse(item);
      } catch (e) {
        console.error('Failed to parse stored item:', name, e);
        return null;
      }
    },
    setItem: (name: string, value: any) => {
      try {
        localStorage.setItem(name, JSON.stringify(value));
      } catch (e) {
        console.error('Failed to store item:', name, e);
      }
    },
    removeItem: (name: string) => {
      try {
        localStorage.removeItem(name);
      } catch (e) {
        console.error('Failed to remove item:', name, e);
      }
    },
  };
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // 初始状态
      user: null,
      token: null,
      isAuthenticated: false,
      articles: [],
      newsFlashes: [],
      favorites: [],
      
      // 检查认证状态
      checkAuth: () => {
        const state = get();
        console.log('Check auth:', {
          hasToken: !!state.token,
          hasUser: !!state.user,
          isAuthenticated: state.isAuthenticated,
          localStorage: {
            hasToken: !!localStorage.getItem('token'),
            hasUser: !!localStorage.getItem('user'),
          }
        });
        return state.isAuthenticated && !!state.token && !!state.user;
      },
      
      // 用户登录
      login: (user, token) => {
        console.log('Login called with:', { user, token });
        
        // 同时保存到 localStorage 和 Zustand
        try {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('loginTime', new Date().toISOString());
          localStorage.setItem('lastActiveTime', new Date().toISOString());
        } catch (e) {
          console.error('Failed to save to localStorage:', e);
        }
        
        set({ 
          user, 
          token, 
          isAuthenticated: true,
        });
        
        console.log('Login completed, state:', get());
      },
      
      // 用户登出
      logout: () => {
        console.log('Logout called');
        
        try {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('loginTime');
          localStorage.removeItem('lastActiveTime');
        } catch (e) {
          console.error('Failed to clear localStorage:', e);
        }
        
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false 
        });
      },
      
      // 收藏功能
      toggleFavorite: (articleId) => {
        const favorites = get().favorites;
        const isFavorited = favorites.includes(articleId);
        set({
          favorites: isFavorited
            ? favorites.filter(id => id !== articleId)
            : [...favorites, articleId],
        });
      },
      
      // 数据更新
      setArticles: (articles) => set({ articles }),
      setNewsFlashes: (newsFlashes) => set({ newsFlashes }),
    }),
    {
      name: 'selfmedia-storage',
      storage: createJSONStorage(() => createCustomStorage()),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        favorites: state.favorites,
      }),
      // 版本控制 - 用于迁移
      version: 1,
      // 迁移函数
      migrate: (persistedState: any, version: number) => {
        console.log('Migrating state from version:', version);
        return persistedState as AppState;
      },
    }
  )
);

// 辅助函数 - 检查登录状态
export const checkLoginStatus = (): boolean => {
  try {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const loginTime = localStorage.getItem('loginTime');
    
    console.log('Check login status:', {
      hasToken: !!token,
      hasUser: !!user,
      loginTime,
    });
    
    return !!(token && user);
  } catch (e) {
    console.error('Failed to check login status:', e);
    return false;
  }
};

// 辅助函数 - 获取当前用户
export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch (e) {
    console.error('Failed to get current user:', e);
    return null;
  }
};

// 辅助函数 - 更新活跃时间
export const updateActiveTime = () => {
  try {
    localStorage.setItem('lastActiveTime', new Date().toISOString());
  } catch (e) {
    console.error('Failed to update active time:', e);
  }
};
