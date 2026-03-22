/**
 * 文章模型
 */

const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  // 基本信息
  title: {
    type: String,
    required: [true, '文章标题不能为空'],
    trim: true,
    maxlength: [200, '标题不能超过 200 个字符']
  },
  summary: {
    type: String,
    trim: true,
    maxlength: [500, '摘要不能超过 500 个字符']
  },
  content: {
    type: String,
    required: [true, '文章内容不能为空']
  },
  coverImage: {
    type: String,
    default: ''
  },
  
  // 作者信息
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // 分类和标签
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  
  // 统计信息
  viewCount: {
    type: Number,
    default: 0
  },
  likeCount: {
    type: Number,
    default: 0
  },
  commentCount: {
    type: Number,
    default: 0
  },
  bookmarkCount: {
    type: Number,
    default: 0
  },
  
  // 状态
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  price: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // SEO
  seoTitle: { type: String, trim: true },
  seoDescription: { type: String, maxlength: 200 },
  seoKeywords: [{ type: String, trim: true }]
}, {
  timestamps: true
});

// 索引优化查询性能
articleSchema.index({ title: 'text', content: 'text' });
articleSchema.index({ category: 1, createdAt: -1 });
articleSchema.index({ author: 1, createdAt: -1 });
articleSchema.index({ status: 1, isFeatured: 1, createdAt: -1 });

// 实例方法：生成公开文章信息
articleSchema.methods.toPublicJSON = function(populatedData = {}) {
  return {
    id: this._id,
    title: this.title,
    summary: this.summary,
    content: this.content,
    coverImage: this.coverImage,
    author: populatedData.author || this.author,
    category: populatedData.category || this.category,
    tags: this.tags,
    viewCount: this.viewCount,
    likeCount: this.likeCount,
    commentCount: this.commentCount,
    bookmarkCount: this.bookmarkCount,
    status: this.status,
    isFeatured: this.isFeatured,
    isPaid: this.isPaid,
    price: this.price,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

module.exports = mongoose.model('Article', articleSchema);
