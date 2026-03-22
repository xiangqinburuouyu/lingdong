/**
 * 分享组件 - 支持微信、微博、QQ、复制链接等
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import * as Clipboard from 'expo-clipboard';

const ShareModal = ({ visible, onClose, article }) => {
  const [sharing, setSharing] = useState(false);

  if (!article) return null;

  // 分享链接
  const shareLink = async (platform) => {
    setSharing(true);
    try {
      const shareUrl = `https://your-app.com/article/${article.id}`;
      const message = `${article.title} - ${shareUrl}`;

      if (platform === 'copy') {
        // 复制链接
        await Clipboard.setStringAsync(shareUrl);
        Alert.alert('成功', '链接已复制到剪贴板');
      } else if (platform === 'more') {
        // 系统分享
        const available = await Sharing.isAvailableAsync();
        if (available) {
          await Sharing.shareAsync(shareUrl, {
            dialogTitle: '分享文章',
            UTI: 'public.text',
          });
        } else {
          Alert.alert('提示', '当前设备不支持分享功能');
        }
      } else {
        // 其他平台（实际项目中需要接入各平台 SDK）
        // 这里使用系统分享作为备选
        const available = await Sharing.isAvailableAsync();
        if (available) {
          await Sharing.shareAsync(shareUrl, {
            dialogTitle: `分享到${platform}`,
            UTI: 'public.text',
          });
        }
      }

      onClose();
    } catch (error) {
      console.error('分享失败:', error);
      Alert.alert('错误', '分享失败，请重试');
    } finally {
      setSharing(false);
    }
  };

  // 生成分享海报（简化版）
  const generatePoster = async () => {
    Alert.alert('提示', '海报生成功能开发中');
    // TODO: 使用 react-native-view-shot 生成海报
  };

  const shareOptions = [
    {
      id: 'wechat',
      name: '微信',
      icon: 'logo-wechat',
      color: '#07C160',
    },
    {
      id: 'moments',
      name: '朋友圈',
      icon: 'logo-wechat',
      color: '#07C160',
    },
    {
      id: 'weibo',
      name: '微博',
      icon: 'logo-weibo',
      color: '#E6162D',
    },
    {
      id: 'qq',
      name: 'QQ',
      icon: 'logo-qq',
      color: '#12B7F5',
    },
    {
      id: 'qzone',
      name: 'QQ 空间',
      icon: 'star',
      color: '#FECE00',
    },
    {
      id: 'copy',
      name: '复制链接',
      icon: 'link-outline',
      color: '#666',
    },
    {
      id: 'poster',
      name: '生成海报',
      icon: 'image-outline',
      color: '#0066FF',
    },
    {
      id: 'more',
      name: '更多',
      icon: 'ellipsis-horizontal-outline',
      color: '#666',
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* 背景遮罩 */}
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      />

      {/* 分享面板 */}
      <View style={styles.container}>
        {/* 拖动手柄 */}
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>

        {/* 文章信息 */}
        <View style={styles.articleInfo}>
          <Text style={styles.articleTitle} numberOfLines={2}>
            {article.title}
          </Text>
          <Text style={styles.articleSummary} numberOfLines={2}>
            {article.summary || '点击分享这篇文章'}
          </Text>
        </View>

        {/* 分享选项 */}
        <ScrollView
          style={styles.optionsContainer}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.optionsContent}
        >
          {shareOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.optionButton}
              onPress={() => shareLink(option.id)}
              disabled={sharing}
            >
              <View
                style={[
                  styles.optionIcon,
                  { backgroundColor: `${option.color}15` },
                ]}
              >
                <Ionicons
                  name={option.icon}
                  size={28}
                  color={option.color}
                />
              </View>
              <Text style={styles.optionText}>{option.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 取消按钮 */}
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onClose}
          disabled={sharing}
        >
          <Text style={styles.cancelButtonText}>取消</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#E8E8E8',
    borderRadius: 2,
  },
  articleInfo: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F5F5F5',
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  articleSummary: {
    fontSize: 14,
    color: '#999',
    lineHeight: 20,
  },
  optionsContainer: {
    maxHeight: 160,
  },
  optionsContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  optionButton: {
    alignItems: 'center',
    marginRight: 20,
    width: 70,
  },
  optionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionText: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
  },
  cancelButton: {
    marginTop: 12,
    marginHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

export default ShareModal;
