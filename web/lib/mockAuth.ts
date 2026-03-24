// 模拟认证系统 - 用于演示

interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
}

interface LoginResponse {
  user: User;
  token: string;
}

// 模拟用户数据库
const users: (User & { password: string })[] = [
  { id: 1, username: 'admin', email: 'admin@example.com', password: '123456', role: 'admin' },
  { id: 2, username: 'user', email: 'user@example.com', password: '123456', role: 'user' },
];

// 模拟 token 数据库
const tokens: Map<string, User> = new Map();

// 生成 token
function generateToken(): string {
  return 'mock_token_' + Math.random().toString(36).substring(2, 15);
}

// 延迟函数
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const mockAuth = {
  // 登录
  login: async (data: { username: string; password: string }): Promise<LoginResponse> => {
    await delay(500); // 模拟网络延迟
    
    const user = users.find(u => u.username === data.username && u.password === data.password);
    
    if (!user) {
      throw new Error('用户名或密码错误');
    }
    
    const token = generateToken();
    tokens.set(token, user);
    
    const { password, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      token,
    };
  },

  // 注册
  register: async (data: { username: string; email: string; password: string }): Promise<void> => {
    await delay(500);
    
    const existingUser = users.find(u => u.username === data.username || u.email === data.email);
    
    if (existingUser) {
      throw new Error('用户名或邮箱已被使用');
    }
    
    const newUser: User & { password: string } = {
      id: users.length + 1,
      username: data.username,
      email: data.email,
      password: data.password,
      role: 'user',
    };
    
    users.push(newUser);
  },

  // 获取用户信息
  getProfile: async (token: string): Promise<User> => {
    await delay(300);
    
    const user = tokens.get(token);
    
    if (!user) {
      throw new Error('未登录');
    }
    
    const { password, ...userWithoutPassword } = user as any;
    return userWithoutPassword;
  },

  // 收藏文章
  favorite: async (articleId: number): Promise<void> => {
    await delay(300);
    console.log(`Favorited article ${articleId}`);
  },

  // 取消收藏
  unfavorite: async (articleId: number): Promise<void> => {
    await delay(300);
    console.log(`Unfavorited article ${articleId}`);
  },

  // 获取评论
  getComments: async (articleId: number): Promise<any[]> => {
    await delay(300);
    return [
      { id: 1, user: { username: '张三', avatar: '' }, content: '写得很好！', publishTime: new Date().toISOString() },
      { id: 2, user: { username: '李四', avatar: '' }, content: '学到了很多', publishTime: new Date().toISOString() },
    ];
  },

  // 发表评论
  comment: async (articleId: number, content: string): Promise<void> => {
    await delay(300);
    console.log(`Comment on article ${articleId}: ${content}`);
  },
};
