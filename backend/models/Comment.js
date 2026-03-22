/**
 * 评论模型
 */

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  // 内容
  content: {
    type: String,
    required: [true, '评论内容不能为空'],
    trim: true,
    maxlength: [1000, '评论不能超过 1000 个字符']
  },
  
  // 关联
  article: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null // 如果是回复评论，则指向父评论
  },
  
  // 统计
  likeCount: {
    type: Number,
    default: 0
  },
  
  // 状态
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'deleted'],
    default: 'approved'
  },
  
  // 管理员操作
  isAdminReply: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// 索引
commentSchema.index({ article: 1, createdAt: -1 });
commentSchema.index({ user: 1, createdAt: -1 });
commentSchema.index({ parent: 1 });

// 实例方法：生成公开评论信息
commentSchema.methods.toPublicJSON = function(populatedData = {}) {
  return {
    id: this._id,
    content: this.content,
    article: this.article,
    user: populatedData.user || this.user,
    parent: this.parent,
    likeCount: this.likeCount,
    status: this.status,
    isAdminReply: this.isAdminReply,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

module.exports = mongoose.model('Comment', commentSchema);
