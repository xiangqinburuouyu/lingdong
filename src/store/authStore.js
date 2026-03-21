/**
 * 认证状态管理 (Zustand)
 */

import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { authAPI } from '../config/api';

const useAuthStore = create((set, get) => ({
  // 状态
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  // 行动
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await authAPI.login({ email, password });
      const { user, token } = response.data.data;
      
      // 保存 token
      await SecureStore.setItemAsync('auth_token', token);
      
      set({
        user,
        token,
        isAuthenticated: true,
        loading: false,
      });
      
      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.message || '登录失败';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await authAPI.register(userData);
      const { user, token } = response.data.data;
      
      await SecureStore.setItemAsync('auth_token', token);
      
      set({
        user,
        token,
        isAuthenticated: true,
        loading: false,
      });
      
      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.message || '注册失败';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  logout: async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('登出 API 错误:', error);
    }
    
    await SecureStore.deleteItemAsync('auth_token');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  // 检查登录状态
  checkAuth: async () => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (!token) {
        set({ isAuthenticated: false });
        return false;
      }

      const response = await authAPI.getMe();
      const user = response.data.data.user;
      
      set({
        user,
        token,
        isAuthenticated: true,
      });
      
      return true;
    } catch (error) {
      await SecureStore.deleteItemAsync('auth_token');
      set({ isAuthenticated: false });
      return false;
    }
  },

  // 更新用户信息
  updateUser: (userData) => {
    set((state) => ({
      user: { ...state.user, ...userData },
    }));
  },

  // 清除错误
  clearError: () => set({ error: null }),
}));

export default useAuthStore;
