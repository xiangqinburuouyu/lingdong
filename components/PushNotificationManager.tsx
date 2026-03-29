'use client';

import { useState, useEffect } from 'react';

export default function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<'default' | 'granted' | 'denied'>('default');
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  useEffect(() => {
    // 检查浏览器支持
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      
      // 检查当前权限状态
      Notification.requestPermission().then((perm) => {
        setPermission(perm as 'default' | 'granted' | 'denied');
      });
      
      // 检查是否已订阅
      checkSubscription();
    }
  }, []);

  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const existingSubscription = await registration.pushManager.getSubscription();
      setSubscription(existingSubscription);
    } catch (error) {
      console.error('检查订阅失败:', error);
    }
  };

  const requestPermission = async () => {
    if (!isSupported) return;

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission as 'default' | 'granted' | 'denied');

      if (permission === 'granted') {
        await subscribeToPush();
      }
    } catch (error) {
      console.error('请求权限失败:', error);
    }
  };

  const subscribeToPush = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      // 订阅推送（使用 VAPID 公钥）
      const vapidPublicKey = 'YOUR_VAPID_PUBLIC_KEY'; // 需要替换为实际的 VAPID 公钥
      const convertedKey = urlBase64ToUint8Array(vapidPublicKey);
      
      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedKey
      });
      
      setSubscription(newSubscription);
      
      // TODO: 将订阅信息发送到后端保存
      console.log('推送订阅成功:', newSubscription);
      
      alert('推送通知已启用！');
    } catch (error) {
      console.error('订阅失败:', error);
    }
  };

  const unsubscribeFromPush = async () => {
    if (!subscription) return;

    try {
      await subscription.unsubscribe();
      setSubscription(null);
      alert('推送通知已禁用！');
    } catch (error) {
      console.error('取消订阅失败:', error);
    }
  };

  const testNotification = () => {
    if (permission === 'granted') {
      new Notification('测试通知', {
        body: '这是一条测试推送通知！',
        icon: '/favicon.ico'
      });
    } else {
      alert('请先允许通知权限');
    }
  };

  if (!isSupported) {
    return (
      <div className="p-4 bg-yellow-50 rounded-lg">
        <p className="text-yellow-800">您的浏览器不支持推送通知</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 mb-4">🔔 推送通知设置</h3>
      
      <div className="space-y-4">
        {/* 权限状态 */}
        <div className="flex items-center justify-between">
          <span className="text-gray-700">通知权限</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            permission === 'granted' ? 'bg-green-100 text-green-600' :
            permission === 'denied' ? 'bg-red-100 text-red-600' :
            'bg-yellow-100 text-yellow-600'
          }`}>
            {permission === 'granted' ? '已允许' :
             permission === 'denied' ? '已拒绝' : '未设置'}
          </span>
        </div>

        {/* 订阅状态 */}
        <div className="flex items-center justify-between">
          <span className="text-gray-700">推送订阅</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            subscription ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
          }`}>
            {subscription ? '已订阅' : '未订阅'}
          </span>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-2 pt-4 border-t border-gray-200">
          {permission !== 'granted' ? (
            <button
              onClick={requestPermission}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
            >
              允许通知
            </button>
          ) : (
            <>
              <button
                onClick={testNotification}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                测试通知
              </button>
              <button
                onClick={unsubscribeFromPush}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                取消订阅
              </button>
            </>
          )}
        </div>

        {/* 提示信息 */}
        <p className="text-sm text-gray-500">
          {permission === 'granted' 
            ? '✅ 您已启用推送通知，重要消息将实时推送给您'
            : '开启推送通知后，您将在浏览器中收到实时消息提醒'}
        </p>
      </div>
    </div>
  );
}

// VAPID 密钥转换工具函数
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray;
}
