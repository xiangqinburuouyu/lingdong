'use client';

import { useState } from 'react';

interface Category {
  id: number;
  name: string;
  slug: string;
  articleCount: number;
  description: string;
}

const mockCategories: Category[] = [
  { id: 1, name: 'AGI', slug: 'agi', articleCount: 45, description: '人工智能相关内容' },
  { id: 2, name: '出海', slug: 'chuhai', articleCount: 32, description: '企业出海动态' },
  { id: 3, name: '深度', slug: 'shendu', articleCount: 28, description: '深度报道与分析' },
  { id: 4, name: '创投', slug: 'chuangtou', articleCount: 56, description: '创投圈动态' },
  { id: 5, name: '汽车', slug: 'qiche', articleCount: 41, description: '汽车行业动态' },
  { id: 6, name: '3C', slug: '3c', articleCount: 38, description: '数码科技产品' },
  { id: 7, name: '消费', slug: 'xiaofei', articleCount: 29, description: '消费领域观察' },
  { id: 8, name: '大健康', slug: 'jinkang', articleCount: 22, description: '医疗健康领域' },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  
  // 表单数据
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
  });

  // 打开编辑弹窗
  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
    });
    setShowEditModal(true);
  };

  // 保存编辑
  const handleSaveEdit = async () => {
    if (!editingCategory) return;
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setCategories(prev => prev.map(cat => 
      cat.id === editingCategory.id 
        ? { ...cat, ...formData }
        : cat
    ));
    
    setShowEditModal(false);
    setEditingCategory(null);
    setFormData({ name: '', slug: '', description: '' });
    alert('分类已更新！');
  };

  // 打开删除确认
  const handleDelete = (category: Category) => {
    setDeletingCategory(category);
    setShowDeleteModal(true);
  };

  // 确认删除
  const confirmDelete = async () => {
    if (!deletingCategory) return;
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setCategories(prev => prev.filter(cat => cat.id !== deletingCategory.id));
    setShowDeleteModal(false);
    setDeletingCategory(null);
    alert(`分类"${deletingCategory.name}"已删除！`);
  };

  // 添加分类
  const handleAdd = async () => {
    if (!formData.name || !formData.slug) {
      alert('请填写分类名称和 Slug');
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newCategory: Category = {
      id: categories.length + 1,
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      articleCount: 0,
    };
    
    setCategories(prev => [...prev, newCategory]);
    setShowAddModal(false);
    setFormData({ name: '', slug: '', description: '' });
    alert('分类已添加！');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">分类管理</h1>
          <p className="text-gray-600 mt-1">管理网站内容分类</p>
        </div>
        <button
          onClick={() => {
            setFormData({ name: '', slug: '', description: '' });
            setShowAddModal(true);
          }}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 flex items-center gap-2"
        >
          <span>➕</span> 添加分类
        </button>
      </div>

      {/* 分类列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:border-primary-300 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{category.name}</h3>
                <p className="text-sm text-gray-500">/{category.slug}</p>
              </div>
              <span className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm font-medium">
                {category.articleCount} 篇
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4">{category.description}</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(category)}
                className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
              >
                编辑
              </button>
              <button
                onClick={() => handleDelete(category)}
                className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
              >
                删除
              </button>
            </div>
          </div>
        ))}

        {/* 添加分类卡片 */}
        <button
          onClick={() => {
            setFormData({ name: '', slug: '', description: '' });
            setShowAddModal(true);
          }}
          className="bg-gray-50 rounded-lg shadow-sm p-6 border-2 border-dashed border-gray-300 hover:border-primary-400 hover:bg-primary-50 transition-colors flex flex-col items-center justify-center min-h-[200px]"
        >
          <span className="text-4xl mb-2">➕</span>
          <span className="text-gray-600 font-medium">添加新分类</span>
        </button>
      </div>

      {/* 添加分类模态框 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">添加新分类</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">分类名称</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="如：人工智能"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s/g, '-') })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="如：ai"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={3}
                  placeholder="分类描述..."
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setFormData({ name: '', slug: '', description: '' });
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleAdd}
                  className="flex-1 bg-primary-600 text-white py-2 rounded-lg font-medium hover:bg-primary-700"
                >
                  添加
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 编辑分类模态框 */}
      {showEditModal && editingCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">编辑分类</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">分类名称</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s/g, '-') })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingCategory(null);
                    setFormData({ name: '', slug: '', description: '' });
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="flex-1 bg-primary-600 text-white py-2 rounded-lg font-medium hover:bg-primary-700"
                >
                  保存修改
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 删除确认模态框 */}
      {showDeleteModal && deletingCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">确认删除</h2>
            <p className="text-gray-600 mb-2">
              确定要删除分类 <span className="font-bold text-gray-900">&quot;{deletingCategory.name}&quot;</span> 吗？
            </p>
            <p className="text-sm text-red-600 mb-6">
              ⚠️ 此操作不可恢复！该分类下的 {deletingCategory.articleCount} 篇文章将被移至未分类。
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingCategory(null);
                }}
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
    </div>
  );
}
