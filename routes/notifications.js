const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { authMiddleware } = require('../middleware/auth');

// 获取我的通知列表（需要登录）
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20, unread = false } = req.query;
    
    const query = { user: req.user._id };
    if (unread === 'true') {
      query.read = false;
    }
    
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ 
      user: req.user._id, 
      read: false 
    });
    
    res.json({
      data: notifications,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      },
      unreadCount
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

// 标记为已读（需要登录）
router.put('/:id/read', authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { read: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ message: '通知不存在' });
    }
    
    res.json({ message: '已标记为已读' });
  } catch (error) {
    res.status(500).json({ message: '操作失败', error: error.message });
  }
});

// 全部标记为已读（需要登录）
router.put('/read-all', authMiddleware, async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, read: false },
      { read: true }
    );
    
    res.json({ message: '全部已标记为已读' });
  } catch (error) {
    res.status(500).json({ message: '操作失败', error: error.message });
  }
});

// 删除通知（需要登录）
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!notification) {
      return res.status(404).json({ message: '通知不存在' });
    }
    
    res.json({ message: '删除成功' });
  } catch (error) {
    res.status(500).json({ message: '删除失败', error: error.message });
  }
});

// 创建通知（内部使用或管理员）
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { userId, title, content, type, link } = req.body;
    
    const notification = new Notification({
      user: userId,
      title,
      content,
      type: type || 'system',
      link: link || ''
    });
    
    await notification.save();
    
    res.status(201).json({
      message: '通知创建成功',
      data: notification
    });
  } catch (error) {
    res.status(500).json({ message: '创建失败', error: error.message });
  }
});

module.exports = router;
