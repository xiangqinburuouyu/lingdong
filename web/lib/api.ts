import axios from 'axios';
import { mockAuth } from './mockAuth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const USE_MOCK = true; // 使用模拟数据

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加 token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API 接口定义
export const articleApi = {
  // 获取文章列表
  getList: (params?: { page?: number; limit?: number; category?: string }) =>
    api.get('/articles', { params }),
  
  // 获取文章详情
  getDetail: (id: number) =>
    api.get(`/articles/${id}`),
  
  // 获取热门文章
  getHot: (limit?: number) =>
    api.get('/articles/hot', { params: { limit } }),
  
  // 搜索文章
  search: (keyword: string, page?: number) =>
    api.get('/articles/search', { params: { keyword, page } }),
};

export const categoryApi = {
  // 获取所有分类
  getAll: () =>
    api.get('/categories'),
  
  // 获取分类下的文章
  getArticles: (slug: string, params?: { page?: number; limit?: number }) =>
    api.get(`/categories/${slug}/articles`, { params }),
};

export const newsFlashApi = {
  // 获取快讯列表
  getList: (limit?: number) =>
    api.get('/newsflash', { params: { limit } }),
};

export const userApi = {
  // 登录
  login: async (data: { username: string; password: string }) => {
    if (USE_MOCK) {
      return mockAuth.login(data);
    }
    return api.post('/auth/login', data);
  },
  
  // 注册
  register: async (data: { username: string; email: string; password: string }) => {
    if (USE_MOCK) {
      return mockAuth.register(data);
    }
    return api.post('/auth/register', data);
  },
  
  // 获取用户信息
  getProfile: async () => {
    if (USE_MOCK) {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('未登录');
      return mockAuth.getProfile(token);
    }
    return api.get('/user/profile');
  },
  
  // 收藏文章
  favorite: async (articleId: number) => {
    if (USE_MOCK) {
      return mockAuth.favorite(articleId);
    }
    return api.post(`/user/favorites/${articleId}`);
  },
  
  // 取消收藏
  unfavorite: async (articleId: number) => {
    if (USE_MOCK) {
      return mockAuth.unfavorite(articleId);
    }
    return api.delete(`/user/favorites/${articleId}`);
  },
  
  // 获取收藏列表
  getFavorites: (page?: number) =>
    api.get('/user/favorites', { params: { page } }),
  
  // 发表评论
  comment: async (articleId: number, content: string) => {
    if (USE_MOCK) {
      return mockAuth.comment(articleId, content);
    }
    return api.post(`/articles/${articleId}/comments`, { content });
  },
  
  // 获取评论列表
  getComments: async (articleId: number, page?: number) => {
    if (USE_MOCK) {
      return mockAuth.getComments(articleId);
    }
    return api.get(`/articles/${articleId}/comments`, { params: { page } });
  },
};

export default api;
