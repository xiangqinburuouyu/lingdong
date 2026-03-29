const nodemailer = require('nodemailer');
require('dotenv').config();

// 配置邮件发送器
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.qq.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

// 发送通知邮件
async function sendNotificationEmail(to, subject, html) {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.SMTP_FROM || '自媒体通知 <noreply@example.com>',
      to,
      subject,
      html
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('邮件发送成功:', info.messageId);
    
    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error) {
    console.error('邮件发送失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 发送评论通知
async function sendCommentNotification(to, articleTitle, commentContent) {
  const subject = '📝 您的文章收到了新评论';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">新评论通知</h2>
      <p>您的文章 <strong>${articleTitle}</strong> 收到了新评论：</p>
      <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <p style="color: #666;">${commentContent}</p>
      </div>
      <p style="color: #999; font-size: 12px;">此邮件由自媒体系统自动发送，请勿回复。</p>
    </div>
  `;
  
  return await sendNotificationEmail(to, subject, html);
}

// 发送点赞通知
async function sendLikeNotification(to, articleTitle) {
  const subject = '❤️ 您的文章收到了新点赞';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">新点赞通知</h2>
      <p>您的文章 <strong>${articleTitle}</strong> 收到了新点赞！</p>
      <p style="color: #999; font-size: 12px;">此邮件由自媒体系统自动发送，请勿回复。</p>
    </div>
  `;
  
  return await sendNotificationEmail(to, subject, html);
}

// 发送系统通知
async function sendSystemNotification(to, title, content) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">${title}</h2>
      <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <p style="color: #666;">${content}</p>
      </div>
      <p style="color: #999; font-size: 12px;">此邮件由自媒体系统自动发送，请勿回复。</p>
    </div>
  `;
  
  return await sendNotificationEmail(to, title, html);
}

module.exports = {
  sendNotificationEmail,
  sendCommentNotification,
  sendLikeNotification,
  sendSystemNotification
};
