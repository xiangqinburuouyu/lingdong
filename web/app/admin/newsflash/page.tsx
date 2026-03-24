'use client';

import { useState } from 'react';

interface NewsFlash {
  id: number;
  content: string;
  publishTime: string;
  tags: string[];
  views: number;
}

const mockNewsFlashes: NewsFlash[] = [
  { id: 1, content: '央行行长潘功胜：构建科学稳健的货币政策体系，继续实施好适度宽松的货币政策', publishTime: '2026-03-24 10:30', tags: ['金融', '央行'], views: 12500 },
  { id: 2, content: '工信部：到 2026 年底培育一批行业数据合作联合体，建设重点行业数据可信互联平台', publishTime: '2026-03-24 09:45', tags: ['政策', '工信部'], views: 8900 },
  { id: 3, content: '广东：到 2030 年力争培育形成万亿元级赛道 3 个以上', publishTime: '2026-03-24 09:15', tags: ['地方', '广东'], views: 6700 },
  { id: 4, content: '国家对成品油价格采取临时调控措施：平均每升少涨约 0.85 元', publishTime: '2026-03-24 08:30', tags: ['能源', '油价'], views: 15600 },
  { id: 5, content: '马斯克宣布将在美国建设芯片制造中心，目标是量产 2 纳米工艺芯片', publishTime: '2026-03-23 20:00', tags: ['芯片', '马斯克'], views: 23400 },
];

export default function NewsFlashPage() {
  const [newsFlashes, setNewsFlashes] = useState<NewsFlash[]>(mockNewsFlashes);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsFlash | null>(null);
  const [deletingItem, setDeletingItem] = useState<NewsFlash | null>(null);
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('');

  // 打开编辑弹窗
  const handleEdit = (item: NewsFlash) => {
    setEditingItem(item);
    setNewContent(item.content);
    setNewTags(item.tags.join(', '));
    setShowEditModal(true);
  };

  // 保存编辑
  const handleSaveEdit = async () => {
    if (!editingItem) return;
    
    // 模拟保存
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setNewsFlashes(prev => prev.map(item => 
      item.id === editingItem.id 
        ? { 
            ...item, 
            content: newContent,
            tags: newTags.split(',').map(t => t.trim()).filter(t => t),
          }
        : item
    ));
    
    setShowEditModal(false);
    setEditingItem(null);
    alert('快讯已更新！');
  };

  // 确认删除
  const handleDelete = (item: NewsFlash) => {
    setDeletingItem(item);
    setShowDeleteModal(true);
  };

  // 执行删除
  const confirmDelete = async () => {
    if (!deletingItem) return;
    
    // 模拟删除
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setNewsFlashes(prev => prev.filter(item => item.id !== deletingItem.id));
    setShowDeleteModal(false);
    setDeletingItem(null);
    alert('快讯已删除！');
  };

  // 发布新快讯
  const handlePublish = async () => {
    if (!newContent.trim()) {
      alert('请输入快讯内容');
      return;
    }

    // 模拟发布
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newItem: NewsFlash = {
      id: newsFlashes.length + 1,
      content: newContent,
      publishTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
      tags: newTags.split(',').map(t => t.trim()).filter(t => t),
      views: 0,
    };
    
    setNewsFlashes(prev => [newItem, ...prev]);
    setShowAddModal(false);
    setNewContent('');
    setNewTags('');
    alert('快讯已发布！');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">快讯管理</h1>
          <p className="text-gray-600 mt-1">发布和管理 7x24 小时快讯</p>
        </div>
        <button
          onClick={() => {
            setNewContent('');
            setNewTags('');
            setShowAddModal(true);
          }}
          className="btn-primary"
        >
          <span>⚡</span> 发布快讯
        </button>
      </div>

      {/* 快讯列表 */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-200">
          {newsFlashes.map((item) => (
            <div key={item.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
                    {item.tags.map((tag) => (
                      <span key={tag} className="bg-primary-50 text-primary-600 px-2 py-0.5 rounded text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                    <span className="text-sm text-gray-500 ml-auto">{item.publishTime}</span>
                  </div>
                  <p className="text-gray-900">{item.content}</p>
                  <p className="text-sm text-gray-500 mt-2">{item.views.toLocaleString()} 次阅读</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(item)}
                    className="btn-ghost btn-sm"
                  >
                    <span>✏️</span> 编辑
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="btn-ghost btn-sm text-red-600 hover:text-red-800 hover:bg-red-50"
                  >
                    <span>🗑️</span> 删除
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 发布快讯模态框 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">发布快讯</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">快讯内容</label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={4}
                  placeholder="输入快讯内容，200 字以内..."
                  maxLength={200}
                />
                <p className="text-sm text-gray-500 mt-1">{newContent.length}/200</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">标签</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="如：金融，央行（多个标签用逗号分隔）"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setNewContent('');
                    setNewTags('');
                  }}
                  className="btn-secondary flex-1"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handlePublish}
                  className="btn-primary flex-1"
                >
                  <span>⚡</span> 立即发布
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 编辑快讯模态框 */}
      {showEditModal && editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">编辑快讯</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">快讯内容</label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={4}
                  maxLength={200}
                />
                <p className="text-sm text-gray-500 mt-1">{newContent.length}/200</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">标签</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="如：金融，央行（多个标签用逗号分隔）"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingItem(null);
                  }}
                  className="btn-secondary flex-1"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="btn-primary flex-1"
                >
                  <span>💾</span> 保存修改
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 删除确认模态框 */}
      {showDeleteModal && deletingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">确认删除</h2>
            <p className="text-gray-600 mb-6">
              确定要删除这条快讯吗？
              <br />
              <span className="text-sm text-red-600">此操作不可恢复！</span>
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingItem(null);
                }}
                className="btn-secondary flex-1"
              >
                取消
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="btn-danger flex-1"
              >
                <span>⚠️</span> 确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
