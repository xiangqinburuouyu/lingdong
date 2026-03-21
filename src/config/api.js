/**
 * API 配置
 */

import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// API 基础 URL - 根据环境修改
const API_BASE_URL = 'http://localhost:3000/api';

// 创建 axios 实例
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 自动添加 token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('获取 token 失败:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      // 401 - 未认证，清除 token 并跳转登录
      if (status === 401) {
        SecureStore.deleteItemAsync('auth_token');
        // TODO: 导航到登录页
      }
      
      console.error('API 错误:', status, data);
    }
    
    return Promise.reject(error);
  }
);

// API 服务
export const authAPI = {
  // 注册
  register: (data) => api.post('/auth/register', data),
  // 登录
  login: (data) => api.post('/auth/login', data),
  // 登出
  logout: () => api.post('/auth/logout'),
  // 获取当前用户
  getMe: () => api.get('/auth/me'),
};

export const articleAPI = {
  // 获取文章列表
  getList: (params) => api.get('/articles', { params }),
  // 获取文章详情
  getDetail: (id) => api.get(`/articles/${id}`),
  // 创建文章
  create: (data) => api.post('/articles', data),
  // 更新文章
  update: (id, data) => api.put(`/articles/${id}`, data),
  // 删除文章
  delete: (id) => api.delete(`/articles/${id}`),
  // 点赞
  like: (id) => api.post(`/articles/${id}/like`),
  // 收藏
  bookmark: (id) => api.post(`/articles/${id}/bookmark`),
};

export const categoryAPI = {
  // 获取全部分类
  getList: () => api.get('/categories'),
  // 获取分类详情
  getDetail: (id) => api.get(`/categories/${id}`),
  // 获取分类文章
  getArticles: (id, params) => api.get(`/categories/${id}/articles`, { params }),
};

export const commentAPI = {
  // 获取评论列表
  getList: (params) => api.get('/comments', { params }),
  // 获取回复列表
  getReplies: (id, params) => api.get(`/comments/${id}/replies`, { params }),
  // 发表评论
  create: (data) => api.post('/comments', data),
  // 删除评论
  delete: (id) => api.delete(`/comments/${id}`),
  // 点赞评论
  like: (id) => api.post(`/comments/${id}/like`),
};

export const userAPI = {
  // 获取用户信息
  getProfile: (id) => api.get(`/users/${id}`),
  // 更新用户信息
  updateProfile: (id, data) => api.put(`/users/${id}`, data),
  // 获取用户文章
  getArticles: (id, params) => api.get(`/users/${id}/articles`, { params }),
};

export const uploadAPI = {
  // 上传图片
  uploadImage: (formData) => {
    return api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  // 上传多张图片
  uploadMultiple: (formData) => {
    return api.post('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default api;
