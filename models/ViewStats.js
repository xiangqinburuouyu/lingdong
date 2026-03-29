const mongoose = require('mongoose');

const viewStatsSchema = new mongoose.Schema({
  article: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: () => new Date().setHours(0, 0, 0, 0)
  },
  views: {
    type: Number,
    default: 0
  },
  uniqueVisitors: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// 唯一索引：每天每篇文章一条记录
viewStatsSchema.index({ article: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('ViewStats', viewStatsSchema);
