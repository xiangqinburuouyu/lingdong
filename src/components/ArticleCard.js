/**
 * 文章卡片组件 - 参考钛媒体风格
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ArticleCard = ({ article, onPress }) => {
  const {
    title,
    summary,
    coverImage,
    author,
    viewCount,
    commentCount,
    createdAt,
  } = article;

  // 格式化时间
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return '刚刚';
    if (hours < 24) return `${hours}小时前`;
    if (hours < 48) return '昨天';
    
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  // 格式化阅读量
  const formatCount = (count) => {
    if (count >= 10000) {
      return `${(count / 10000).toFixed(1)}万`;
    }
    return count.toString();
  };

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => onPress(article)}
      activeOpacity={0.7}
    >
      {/* 封面图 */}
      {coverImage && (
        <View style={styles.coverContainer}>
          <Image 
            source={{ uri: coverImage }} 
            style={styles.coverImage}
            resizeMode="cover"
          />
        </View>
      )}

      {/* 内容区域 */}
      <View style={styles.content}>
        {/* 标题 */}
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>

        {/* 摘要 */}
        {summary && (
          <Text style={styles.summary} numberOfLines={2}>
            {summary}
          </Text>
        )}

        {/* 底部信息 */}
        <View style={styles.footer}>
          {/* 作者信息 */}
          <View style={styles.authorInfo}>
            {author?.avatar && (
              <Image 
                source={{ uri: author.avatar }} 
                style={styles.avatar}
              />
            )}
            <Text style={styles.authorName} numberOfLines={1}>
              {author?.nickname || author?.username || '未知作者'}
            </Text>
          </View>

          {/* 统计数据 */}
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Ionicons name="eye-outline" size={14} color="#999" />
              <Text style={styles.statText}>{formatCount(viewCount || 0)}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="chatbubble-outline" size={14} color="#999" />
              <Text style={styles.statText}>{formatCount(commentCount || 0)}</Text>
            </View>
            <Text style={styles.timeText}>{formatTime(createdAt)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  coverContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    lineHeight: 24,
    marginBottom: 8,
  },
  summary: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  authorName: {
    fontSize: 13,
    color: '#666',
    flex: 1,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  statText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
  timeText: {
    fontSize: 12,
    color: '#999',
  },
});

export default ArticleCard;
