/**
 * 文件上传路由
 */

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// 确保上传目录存在
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 配置存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // 生成唯一文件名
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    cb(null, filename);
  },
});

// 文件过滤
const fileFilter = (req, file, cb) => {
  // 允许的图片类型
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('只支持 JPG、PNG、GIF、WEBP 格式的图片'), false);
  }
};

// 上传配置
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

/**
 * POST /api/upload/image
 * 上传图片
 */
router.post('/image', authMiddleware, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: '请上传图片文件',
        code: 'NO_FILE',
      });
    }

    // 构建访问 URL
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    res.json({
      message: '上传成功',
      data: {
        url: imageUrl,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
    });
  } catch (error) {
    console.error('上传失败:', error);
    res.status(500).json({
      message: '上传失败',
      code: 'UPLOAD_ERROR',
    });
  }
});

/**
 * POST /api/upload/multiple
 * 上传多张图片
 */
router.post('/multiple', authMiddleware, upload.array('images', 9), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: '请上传图片文件',
        code: 'NO_FILE',
      });
    }

    const files = req.files.map((file) => ({
      url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`,
      filename: file.filename,
      size: file.size,
      mimetype: file.mimetype,
    }));

    res.json({
      message: '上传成功',
      data: {
        files,
        count: files.length,
      },
    });
  } catch (error) {
    console.error('上传失败:', error);
    res.status(500).json({
      message: '上传失败',
      code: 'UPLOAD_ERROR',
    });
  }
});

// 错误处理中间件
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        message: '文件大小超过限制（5MB）',
        code: 'FILE_TOO_LARGE',
      });
    }
    return res.status(400).json({
      message: `上传错误：${error.message}`,
      code: 'MULTER_ERROR',
    });
  }
  
  if (error.message === '只支持 JPG、PNG、GIF、WEBP 格式的图片') {
    return res.status(400).json({
      message: error.message,
      code: 'INVALID_FILE_TYPE',
    });
  }

  console.error('上传错误:', error);
  res.status(500).json({
    message: '服务器内部错误',
    code: 'SERVER_ERROR',
  });
});

module.exports = router;
