/**
 * 个人中心页面
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import useAuthStore from '../store/authStore';
import NavBar from '../components/NavBar';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { user, isAuthenticated, logout } = useAuthStore();

  const menuItems = [
    {
      icon: 'document-text-outline',
      title: '我的文章',
      badge: user?.articleCount || 0,
    },
    {
      icon: 'bookmark-outline',
      title: '我的收藏',
      badge: null,
    },
    {
      icon: 'heart-outline',
      title: '我的点赞',
      badge: null,
    },
    {
      icon: 'chatbubble-outline',
      title: '我的评论',
      badge: null,
    },
    {
      icon: 'settings-outline',
      title: '设置',
      badge: null,
    },
  ];

  const handleLogout = async () => {
    await logout();
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const renderMenuItem = (item, index) => (
    <TouchableOpacity 
      key={index} 
      style={styles.menuItem}
      onPress={() => console.log('点击:', item.title)}
    >
      <Ionicons name={item.icon} size={22} color="#333" />
      <Text style={styles.menuItemText}>{item.title}</Text>
      {item.badge !== null && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.badge}</Text>
        </View>
      )}
      <Ionicons name="chevron-forward" size={20} color="#CCC" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 用户信息卡片 */}
        <View style={styles.header}>
          {isAuthenticated && user ? (
            <>
              <View style={styles.userInfo}>
                {user.avatar ? (
                  <Image source={{ uri: user.avatar }} style={styles.avatar} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Ionicons name="person" size={32} color="#fff" />
                  </View>
                )}
                <View style={styles.info}>
                  <Text style={styles.nickname}>
                    {user.nickname || user.username}
                  </Text>
                  <Text style={styles.bio}>
                    {user.bio || '这个人很懒，什么都没写'}
                  </Text>
                  <Text style={styles.stats}>
                    {user.articleCount} 文章 · {user.followerCount} 关注
                  </Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => console.log('编辑资料')}
              >
                <Text style={styles.editButtonText}>编辑资料</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={48} color="#fff" />
              </View>
              <Text style={styles.guestText}>登录以享受更多功能</Text>
              <TouchableOpacity 
                style={styles.loginButton}
                onPress={handleLogin}
              >
                <Text style={styles.loginButtonText}>立即登录</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* 功能菜单 */}
        <View style={styles.menuContainer}>
          {menuItems.map(renderMenuItem)}
        </View>

        {/* 退出登录 */}
        {isAuthenticated && (
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={22} color="#FF4D4F" />
            <Text style={styles.logoutText}>退出登录</Text>
          </TouchableOpacity>
        )}

        {/* 版本信息 */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
          <Text style={styles.copyrightText}>
            © 2026 自媒体博客 APP
          </Text>
        </View>
      </ScrollView>

      {/* 底部导航 */}
      <NavBar activeTab="Profile" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#0066FF',
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#fff',
  },
  avatarPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginLeft: 16,
  },
  nickname: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  bio: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  stats: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
  },
  editButton: {
    alignSelf: 'flex-start',
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  guestText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 16,
    textAlign: 'center',
  },
  loginButton: {
    marginTop: 16,
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 24,
    alignSelf: 'center',
  },
  loginButtonText: {
    color: '#0066FF',
    fontSize: 15,
    fontWeight: '600',
  },
  menuContainer: {
    backgroundColor: '#fff',
    marginTop: 12,
    borderRadius: 12,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F5F5F5',
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  badge: {
    backgroundColor: '#FF4D4F',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginTop: 12,
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
  },
  logoutText: {
    color: '#FF4D4F',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  versionText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  copyrightText: {
    fontSize: 13,
    color: '#CCC',
  },
});

export default ProfileScreen;
