/**
 * 通知中心页面
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

// 示例通知数据（实际应从 API 获取）
const mockNotifications = [
  {
    id: '1',
    type: 'like',
    title: '点赞通知',
    content: '科技前沿 点赞了你的文章《AI 技术最新进展》',
    avatar: 'https://via.placeholder.com/100',
    time: '10 分钟前',
    read: false,
    articleId: '1',
  },
  {
    id: '2',
    type: 'comment',
    title: '评论通知',
    content: '张三 评论了你的文章：'写得很好，学习了！'',
    avatar: 'https://via.placeholder.com/100',
    time: '1 小时前',
    read: false,
    articleId: '1',
  },
  {
    id: '3',
    type: 'follow',
    title: '关注通知',
    content: '李四 关注了你',
    avatar: 'https://via.placeholder.com/100',
    time: '2 小时前',
    read: true,
    userId: '1',
  },
  {
    id: '4',
    type: 'system',
    title: '系统通知',
    content: '欢迎使用自媒体博客 APP！',
    avatar: null,
    icon: 'notifications',
    time: '昨天',
    read: true,
  },
  {
    id: '5',
    type: 'like',
    title: '点赞通知',
    content: '王五 点赞了你的评论',
    avatar: 'https://via.placeholder.com/100',
    time: '2 天前',
    read: true,
  },
];

const NotificationsScreen = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // all, unread, read

  // 获取通知列表
  const loadNotifications = async () => {
    setLoading(true);
    // TODO: 从 API 获取通知
    // const response = await notificationAPI.getList();
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [])
  );

  // 标记为已读
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // 清空通知
  const clearNotifications = () => {
    setNotifications([]);
  };

  // 过滤通知
  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'unread') return !n.read;
    if (activeTab === 'read') return n.read;
    return true;
  });

  // 获取通知图标
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return { name: 'heart', color: '#FF4D4F' };
      case 'comment':
        return { name: 'chatbubble', color: '#0066FF' };
      case 'follow':
        return { name: 'person-add', color: '#07C160' };
      case 'system':
        return { name: 'notifications', color: '#FF9500' };
      default:
        return { name: 'notifications', color: '#999' };
    }
  };

  // 渲染通知项
  const renderNotification = ({ item }) => {
    const iconConfig = getNotificationIcon(item.type);
    
    return (
      <TouchableOpacity
        style={[styles.notificationItem, !item.read && styles.unreadItem]}
        onPress={() => {
          markAsRead(item.id);
          // TODO: 跳转到对应页面
        }}
      >
        {/* 图标/头像 */}
        <View style={styles.avatarContainer}>
          {item.avatar ? (
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.iconCircle, { backgroundColor: `${iconConfig.color}15` }]}>
              <Ionicons name={iconConfig.name} size={20} color={iconConfig.color} />
            </View>
          )}
          {!item.read && <View style={styles.unreadDot} />}
        </View>

        {/* 内容 */}
        <View style={styles.content}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.contentText} numberOfLines={2}>
            {item.content}
          </Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>

        {/* 操作 */}
        {!item.read && (
          <TouchableOpacity
            style={styles.markReadButton}
            onPress={() => markAsRead(item.id)}
          >
            <Text style={styles.markReadText}>标记</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  // 渲染空状态
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="notifications-off-outline" size={64} color="#CCC" />
      <Text style={styles.emptyText}>暂无通知</Text>
    </View>
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <View style={styles.container}>
      {/* 头部 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>通知中心</Text>
        {unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
          </View>
        )}
        <TouchableOpacity onPress={clearNotifications}>
          <Ionicons name="trash-outline" size={22} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Tab 切换 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.tabActive]}
          onPress={() => setActiveTab('all')}
        >
          <Text
            style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}
          >
            全部
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'unread' && styles.tabActive]}
          onPress={() => setActiveTab('unread')}
        >
          <Text
            style={[styles.tabText, activeTab === 'unread' && styles.tabTextActive]}
          >
            未读
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'read' && styles.tabActive]}
          onPress={() => setActiveTab('read')}
        >
          <Text
            style={[styles.tabText, activeTab === 'read' && styles.tabTextActive]}
          >
            已读
          </Text>
        </TouchableOpacity>
      </View>

      {/* 通知列表 */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066FF" />
        </View>
      ) : (
        <FlatList
          data={filteredNotifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={renderEmpty}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E8E8E8',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  unreadBadge: {
    backgroundColor: '#FF4D4F',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 8,
  },
  unreadBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    marginTop: 12,
  },
  tab: {
    paddingVertical: 12,
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#0066FF',
  },
  tabText: {
    fontSize: 15,
    color: '#666',
  },
  tabTextActive: {
    color: '#0066FF',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#999',
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F5F5F5',
  },
  unreadItem: {
    backgroundColor: '#F8FBFF',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    backgroundColor: '#FF4D4F',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#fff',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  contentText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 6,
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
  markReadButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  markReadText: {
    fontSize: 13,
    color: '#0066FF',
  },
});

export default NotificationsScreen;
