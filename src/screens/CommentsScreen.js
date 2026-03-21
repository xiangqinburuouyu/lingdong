/**
 * 评论页面 - 文章评论列表和发表评论
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { commentAPI } from '../config/api';
import useAuthStore from '../store/authStore';

const CommentsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { articleId } = route.params;
  const { isAuthenticated, user } = useAuthStore();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 加载评论
  const loadComments = async (pageNum = 1, refresh = false) => {
    try {
      const response = await commentAPI.getList({
        article: articleId,
        page: pageNum,
        limit: 20,
      });
      
      const { comments: newComments, pagination } = response.data.data;
      
      if (refresh) {
        setComments(newComments);
      } else {
        setComments((prev) => [...prev, ...newComments]);
      }
      
      setHasMore(pageNum < pagination.pages);
      setPage(pageNum);
    } catch (error) {
      console.error('加载评论失败:', error);
      Alert.alert('错误', '加载评论失败');
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useFocusEffect(
    useCallback(() => {
      loadComments(1, true);
    }, [articleId])
  );

  // 发表评论
  const submitComment = async () => {
    if (!isAuthenticated) {
      Alert.alert('提示', '请先登录后再评论', [
        { text: '取消' },
        { text: '去登录', onPress: () => navigation.navigate('Login') },
      ]);
      return;
    }

    if (!commentText.trim()) {
      Alert.alert('提示', '请输入评论内容');
      return;
    }

    setSubmitting(true);
    try {
      const response = await commentAPI.create({
        content: commentText.trim(),
        articleId,
      });
      
      // 添加到列表顶部
      setComments((prev) => [response.data.data.comment, ...prev]);
      setCommentText('');
      Alert.alert('成功', '评论已发表');
    } catch (error) {
      console.error('发表评论失败:', error);
      Alert.alert('错误', error.response?.data?.message || '发表评论失败');
    } finally {
      setSubmitting(false);
    }
  };

  // 点赞评论
  const handleLike = async (commentId) => {
    try {
      await commentAPI.like(commentId);
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId ? { ...c, likeCount: c.likeCount + 1 } : c
        )
      );
    } catch (error) {
      console.error('点赞失败:', error);
    }
  };

  // 回复评论
  const handleReply = (comment) => {
    // TODO: 实现回复功能
    Alert.alert('提示', '回复功能开发中');
  };

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

  // 渲染评论项
  const renderComment = ({ item }) => (
    <View style={styles.commentItem}>
      {/* 用户头像 */}
      {item.user?.avatar ? (
        <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Ionicons name="person" size={20} color="#fff" />
        </View>
      )}

      {/* 评论内容 */}
      <View style={styles.commentContent}>
        {/* 用户信息 */}
        <View style={styles.commentHeader}>
          <Text style={styles.username}>
            {item.user?.nickname || item.user?.username || '匿名用户'}
          </Text>
          <Text style={styles.commentTime}>{formatTime(item.createdAt)}</Text>
        </View>

        {/* 评论文本 */}
        <Text style={styles.commentText}>{item.content}</Text>

        {/* 操作栏 */}
        <View style={styles.commentActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleReply(item)}
          >
            <Ionicons name="chatbubble-outline" size={16} color="#999" />
            <Text style={styles.actionText}>回复</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleLike(item.id)}
          >
            <Ionicons name="heart-outline" size={16} color="#999" />
            <Text style={styles.actionText}>{item.likeCount || 0}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // 渲染空状态
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="chatbubbles-outline" size={64} color="#CCC" />
      <Text style={styles.emptyText}>暂无评论</Text>
      <Text style={styles.emptySubText}>快来发表第一条评论吧</Text>
    </View>
  );

  // 渲染底部加载
  const renderFooter = () => {
    if (!hasMore) {
      return (
        <View style={styles.footer}>
          <Text style={styles.footerText}>没有更多评论了</Text>
        </View>
      );
    }
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#0066FF" />
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={88}
    >
      {/* 评论列表 */}
      <FlatList
        data={comments}
        renderItem={renderComment}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={!loading ? renderEmpty : null}
        ListFooterComponent={renderFooter}
        onEndReached={() => !loading && hasMore && loadComments(page + 1)}
        onEndReachedThreshold={0.3}
      />

      {/* 发表评论输入框 */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="写下你的评论..."
          placeholderTextColor="#999"
          value={commentText}
          onChangeText={setCommentText}
          multiline
          maxLength={500}
          editable={!submitting}
        />
        
        <TouchableOpacity
          style={[styles.submitButton, (!commentText.trim() || submitting) && styles.submitButtonDisabled]}
          onPress={submitComment}
          disabled={!commentText.trim() || submitting}
        >
          {submitting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>发表</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  commentItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E8E8E8',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0066FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  username: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  commentTime: {
    fontSize: 12,
    color: '#999',
  },
  commentText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginBottom: 12,
  },
  commentActions: {
    flexDirection: 'row',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  actionText: {
    fontSize: 13,
    color: '#999',
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    paddingBottom: 100,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#999',
  },
  emptySubText: {
    marginTop: 8,
    fontSize: 14,
    color: '#CCC',
  },
  footer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  footerText: {
    color: '#999',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E8E8E8',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 20 : 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: '#333',
    maxHeight: 100,
    minHeight: 40,
  },
  submitButton: {
    backgroundColor: '#0066FF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 40,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default CommentsScreen;
