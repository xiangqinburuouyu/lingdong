'use client';

import { useState } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'banned';
  registerTime: string;
  lastLogin: string;
}

const mockUsers: User[] = [
  { id: 1, username: 'admin', email: 'admin@example.com', role: 'admin', status: 'active', registerTime: '2026-01-01', lastLogin: '2026-03-24 10:30' },
  { id: 2, username: '张三', email: 'zhangsan@example.com', role: 'user', status: 'active', registerTime: '2026-01-15', lastLogin: '2026-03-24 09:15' },
  { id: 3, username: '李四', email: 'lisi@example.com', role: 'user', status: 'active', registerTime: '2026-02-01', lastLogin: '2026-03-23 20:45' },
  { id: 4, username: '王五', email: 'wangwu@example.com', role: 'user', status: 'banned', registerTime: '2026-02-10', lastLogin: '2026-03-20 14:20' },
  { id: 5, username: '赵六', email: 'zhaoliu@example.com', role: 'user', status: 'active', registerTime: '2026-02-20', lastLogin: '2026-03-24 08:00' },
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [showUserDetail, setShowUserDetail] = useState<User | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // 查看用户详情
  const handleViewDetail = (user: User) => {
    console.log('View user:', user);
    setShowUserDetail(user);
  };

  // 禁用/启用用户
  const handleToggleStatus = async (id: number) => {
    const user = users.find(u => u.id === id);
    if (!user) {
      console.error('User not found:', id);
      return;
    }
    
    const action = user.status === 'active' ? '禁用' : '启用';
    const confirmed = window.confirm(`确定要${action}用户"${user.username}"吗？`);
    if (!confirmed) {
      console.log('Cancelled');
      return;
    }
    
    console.log('Toggling status for user:', id);
    setActionLoading(id);
    
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setUsers(prev => {
      const updated = prev.map(u => 
        u.id === id ? { ...u, status: u.status === 'active' ? 'banned' : 'active' as 'active' | 'banned' } : u
      );
      console.log('Updated users:', updated);
      return updated;
    });
    
    setActionLoading(null);
    setToastMessage(`用户"${user.username}"已${action}`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // 删除用户
  const handleDelete = (user: User) => {
    console.log('Delete user:', user);
    setDeletingUser(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deletingUser) return;
    
    console.log('Confirming delete for user:', deletingUser.id);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setUsers(prev => prev.filter(u => u.id !== deletingUser.id));
    setShowDeleteModal(false);
    setDeletingUser(null);
    setToastMessage(`用户"${deletingUser.username}"已删除`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = users.filter(u => u.status === 'active').length;
  const bannedCount = users.filter(u => u.status === 'banned').length;
  const adminCount = users.filter(u => u.role === 'admin').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">用户管理</h1>
          <p className="text-gray-600 mt-1">管理系统用户</p>
        </div>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 flex items-center gap-2">
          <span>➕</span> 添加用户
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <StatCard title="总用户数" value={users.length} icon="👥" />
        <StatCard title="活跃用户" value={activeCount} icon="✅" />
        <StatCard title="已禁用" value={bannedCount} icon="🚫" />
        <StatCard title="管理员" value={adminCount} icon="👨‍💼" />
      </div>

      {/* 搜索框 */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="搜索用户名或邮箱..."
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* 用户列表 */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">用户</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">角色</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">状态</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">注册时间</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">最后登录</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className={`hover:bg-gray-50 transition-colors ${
                actionLoading === user.id ? 'opacity-50' : ''
              }`}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-600 font-bold">{user.username[0]}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.username}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {user.role === 'admin' ? '管理员' : '普通用户'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    user.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {user.status === 'active' ? '正常' : '已禁用'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{user.registerTime}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{user.lastLogin}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleViewDetail(user)}
                      disabled={actionLoading !== null}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                      <span>👁️</span> 查看
                    </button>
                    {user.status === 'active' ? (
                      <button 
                        onClick={() => handleToggleStatus(user.id)}
                        disabled={actionLoading !== null}
                        className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1 rounded hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                      >
                        {actionLoading === user.id ? (
                          <><span className="animate-spin">⏳</span> 处理中...</>
                        ) : (
                          <><span>🚫</span> 禁用</>
                        )}
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleToggleStatus(user.id)}
                        disabled={actionLoading !== null}
                        className="text-green-600 hover:text-green-800 text-sm font-medium px-3 py-1 rounded hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                      >
                        {actionLoading === user.id ? (
                          <><span className="animate-spin">⏳</span> 处理中...</>
                        ) : (
                          <><span>✅</span> 启用</>
                        )}
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(user)}
                      disabled={actionLoading !== null}
                      className="text-gray-600 hover:text-gray-800 text-sm font-medium px-3 py-1 rounded hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                      <span>🗑️</span> 删除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm mt-6">
          <div className="text-6xl mb-4">👥</div>
          <p className="text-gray-600 text-lg">未找到用户</p>
        </div>
      )}

      {/* 用户详情模态框 */}
      {showUserDetail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowUserDetail(null)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 m-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">用户详情</h2>
              <button
                onClick={() => setShowUserDetail(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-600 font-bold text-2xl">{showUserDetail.username[0]}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{showUserDetail.username}</h3>
                  <p className="text-sm text-gray-500">{showUserDetail.email}</p>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">角色</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    showUserDetail.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {showUserDetail.role === 'admin' ? '管理员' : '普通用户'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">状态</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    showUserDetail.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {showUserDetail.status === 'active' ? '正常' : '已禁用'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">注册时间</span>
                  <span className="text-sm text-gray-900">{showUserDetail.registerTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">最后登录</span>
                  <span className="text-sm text-gray-900">{showUserDetail.lastLogin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">账号 ID</span>
                  <span className="text-sm text-gray-900">#{showUserDetail.id}</span>
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    handleToggleStatus(showUserDetail.id);
                    setShowUserDetail(null);
                  }}
                  disabled={actionLoading !== null}
                  className={`flex-1 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                    showUserDetail.status === 'active'
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {actionLoading === showUserDetail.id ? (
                    <><span className="animate-spin">⏳</span> 处理中...</>
                  ) : (
                    <>{showUserDetail.status === 'active' ? '🚫 禁用用户' : '✅ 启用用户'}</>
                  )}
                </button>
                <button
                  onClick={() => setShowUserDetail(null)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 删除确认模态框 */}
      {showDeleteModal && deletingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowDeleteModal(false)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 m-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-gray-900 mb-4">确认删除</h2>
            <p className="text-gray-600 mb-2">
              确定要删除用户 <span className="font-bold text-gray-900">&quot;{deletingUser.username}&quot;</span> 吗？
            </p>
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-600 font-bold">{deletingUser.username[0]}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{deletingUser.username}</p>
                  <p className="text-xs text-gray-500">{deletingUser.email}</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-red-600 mb-6">
              ⚠️ 此操作不可恢复！该用户的所有数据将被删除。
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200"
              >
                取消
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast 提示 */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse">
          ✓ {toastMessage}
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: number; icon: string }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
}
