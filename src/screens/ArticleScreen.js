/**
 * 文章详情页
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { articleAPI } from '../config/api';
import ShareModal from '../components/ShareModal';

const ArticleScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { article: initialArticle } = route.params || {};
  
  const [article, setArticle] = useState(initialArticle);
  const [loading, setLoading] = useState(!initialArticle);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    if (!initialArticle && route.params?.articleId) {
      loadArticle(route.params.articleId);
    }
  }, []);

  const loadArticle = async (id) => {
    try {
      const response = await articleAPI.getDetail(id);
      setArticle(response.data.data.article);
    } catch (error) {
      console.error('加载文章失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      await articleAPI.like(article.id);
      setArticle({ ...article, likeCount: article.likeCount + 1 });
      setIsLiked(true);
    } catch (error) {
      console.error('点赞失败:', error);
    }
  };

  const handleBookmark = async () => {
    try {
      await articleAPI.bookmark(article.id);
      setArticle({ ...article, bookmarkCount: article.bookmarkCount + 1 });
      setIsBookmarked(true);
    } catch (error) {
      console.error('收藏失败:', error);
    }
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleAuthorPress = () => {
    navigation.navigate('Profile', { userId: article.author.id });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066FF" />
      </View>
    );
  }

  if (!article) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="document-outline" size={64} color="#CCC" />
        <Text style={styles.errorText}>文章不存在</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 封面图 */}
      {article.coverImage && (
        <Image
          source={{ uri: article.coverImage }}
          style={styles.coverImage}
          resizeMode="cover"
        />
      )}

      {/* 文章内容 */}
      <View style={styles.content}>
        {/* 标题 */}
        <Text style={styles.title}>{article.title}</Text>

        {/* 摘要 */}
        {article.summary && (
          <Text style={styles.summary}>{article.summary}</Text>
        )}

        {/* 作者信息 */}
        <TouchableOpacity 
          style={styles.authorCard}
          onPress={handleAuthorPress}
        >
          {article.author?.avatar && (
            <Image
              source={{ uri: article.author.avatar }}
              style={styles.authorAvatar}
            />
          )}
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>
              {article.author?.nickname || article.author?.username}
            </Text>
            <Text style={styles.authorBio}>
              {article.author?.bio || '这个人很懒，什么都没写'}
            </Text>
          </View>
          <TouchableOpacity style={styles.followButton}>
            <Text style={styles.followText}>关注</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        {/* 正文 */}
        <View style={styles.articleBody}>
          <Text style={styles.bodyText}>{article.content}</Text>
        </View>

        {/* 标签 */}
        {article.tags && article.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {article.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {/* 发布信息 */}
        <View style={styles.metaInfo}>
          <Text style={styles.metaText}>
            发布于 {new Date(article.createdAt).toLocaleDateString('zh-CN')}
          </Text>
          <Text style={styles.metaText}>
            阅读 {article.viewCount} · 评论 {article.commentCount}
          </Text>
        </View>
      </View>

      {/* 底部操作栏 */}
      <View style={styles.actionBar}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleLike}
        >
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={24}
            color={isLiked ? '#FF4D4F' : '#666'}
          />
          <Text style={[
            styles.actionText,
            isLiked && styles.actionTextActive
          ]}>
            {article.likeCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Comments', { articleId: article.id })}
        >
          <Ionicons name="chatbubble-outline" size={24} color="#666" />
          <Text style={styles.actionText}>{article.commentCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleBookmark}
        >
          <Ionicons
            name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={24}
            color={isBookmarked ? '#0066FF' : '#666'}
          />
          <Text style={[
            styles.actionText,
            isBookmarked && styles.actionTextActive
          ]}>
            {article.bookmarkCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleShare}
        >
          <Ionicons name="share-outline" size={24} color="#666" />
          <Text style={styles.actionText}>分享</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#999',
  },
  coverImage: {
    width: '100%',
    height: 240,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    lineHeight: 32,
    marginBottom: 12,
  },
  summary: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  authorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  authorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  authorInfo: {
    flex: 1,
    marginLeft: 12,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  authorBio: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
  },
  followButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#0066FF',
    borderRadius: 16,
  },
  followText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  articleBody: {
    marginBottom: 24,
  },
  bodyText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 28,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tag: {
    backgroundColor: '#F0F7FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 13,
    color: '#0066FF',
  },
  metaInfo: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E8E8E8',
    paddingTop: 16,
  },
  metaText: {
    fontSize: 13,
    color: '#999',
    marginBottom: 4,
  },
  actionBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    backgroundColor: '#fff',
    paddingBottom: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  actionText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#666',
  },
  actionTextActive: {
    color: '#0066FF',
    fontWeight: '600',
  },
});

export default ArticleScreen;
