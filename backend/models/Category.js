/**
 * 分类模型
 */

const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '分类名称不能为空'],
    unique: true,
    trim: true,
    maxlength: [50, '分类名称不能超过 50 个字符']
  },
  slug: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true
  },
  description: {
    type: String,
    maxlength: [200, '描述不能超过 200 个字符']
  },
  icon: {
    type: String,
    default: ''
  },
  coverImage: {
    type: String,
    default: ''
  },
  // 父分类（支持多级分类）
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  // 排序
  order: {
    type: Number,
    default: 0
  },
  // 状态
  isActive: {
    type: Boolean,
    default: true
  },
  // 文章数量（自动更新）
  articleCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// 生成 slug
categorySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

module.exports = mongoose.model('Category', categorySchema);
