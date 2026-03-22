/**
 * 发现页面 - 推荐内容、热门作者、专题
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { articleAPI } from '../config/api';
import ArticleCard from '../components/ArticleCard';
import NavBar from '../components/NavBar';

const DiscoverScreen = () => {
  const navigation = useNavigation();
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [hotArticles, setHotArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // 示例热门作者数据
  const hotAuthors = [
    {
      id: '1',
      nickname: '科技前沿',
      avatar: 'https://via.placeholder.com/100',
      bio: '关注科技前沿动态',
      articleCount: 128,
      followerCount: 10200,
    },
    {
      id: '2',
      nickname: '财经观察',
      avatar: 'https://via.placeholder.com/100',
      bio: '深度财经分析',
      articleCount: 96,
      followerCount: 8500,
    },
    {
      id: '3',
      nickname: 'AI 实验室',
      avatar: 'https://via.placeholder.com/100',
      bio: '人工智能研究',
      articleCount: 75,
      followerCount: 6800,
    },
    {
      id: '4',
      nickname: '创业笔记',
      avatar: 'https://via.placeholder.com/100',
      bio: '创业经验分享',
      articleCount: 52,
      followerCount: 5200,
    },
  ];

  // 示例专题数据
  const topics = [
    {
      id: '1',
      title: '人工智能专题',
      cover: 'https://via.placeholder.com/300x150',
      description: '探索 AI 技术的最新进展',
      articleCount: 256,
    },
    {
      id: '2',
      title: '新能源汽车',
      cover: 'https://via.placeholder.com/300x150',
      description: '关注新能源汽车行业动态',
      articleCount: 189,
    },
    {
      id: '3',
      title: '数字经济',
      cover: 'https://via.placeholder.com/300x150',
      description: '数字化转型的深度观察',
      articleCount: 145,
    },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // 加载推荐文章
      const featuredResponse = await articleAPI.getList({ page: 1, limit: 5 });
      setFeaturedArticles(featuredResponse.data.data.articles);

      // 加载热门文章（按阅读量排序）
      const hotResponse = await articleAPI.getList({ 
        page: 1, 
        limit: 5, 
        sort: '-viewCount' 
      });
      setHotArticles(hotResponse.data.data.articles);
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 点击文章
  const handleArticlePress = (article) => {
    navigation.navigate('Article', { article });
  };

  // 点击作者
  const handleAuthorPress = (author) => {
    navigation.navigate('Profile', { userId: author.id });
  };

  // 渲染推荐文章
  const renderFeatured = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>编辑推荐</Text>
        <TouchableOpacity>
          <Text style={styles.seeMore}>查看更多</Text>
        </TouchableOpacity>
      </View>
      {featuredArticles.map((article) => (
        <ArticleCard 
          key={article.id} 
          article={article} 
          onPress={handleArticlePress} 
        />
      ))}
    </View>
  );

  // 渲染热门文章
  const renderHot = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>热门阅读</Text>
        <Ionicons name="fire" size={20} color="#FF4D4F" />
      </View>
      {hotArticles.map((article, index) => (
        <TouchableOpacity
          key={article.id}
          style={styles.hotItem}
          onPress={() => handleArticlePress(article)}
        >
          <View style={[styles.hotRank, index < 3 && styles.hotRankTop]}>
            <Text style={[styles.hotRankText, index < 3 && styles.hotRankTextTop]}>
              {index + 1}
            </Text>
          </View>
          <View style={styles.hotContent}>
            <Text style={styles.hotTitle} numberOfLines={2}>
              {article.title}
            </Text>
            <View style={styles.hotMeta}>
              <Text style={styles.hotMetaText}>
                {article.author?.nickname || '未知作者'}
              </Text>
              <Text style={styles.hotMetaDot}>·</Text>
              <Text style={styles.hotMetaText}>
                {article.viewCount} 阅读
              </Text>
            </View>
          </View>
          {article.coverImage && (
            <Image
              source={{ uri: article.coverImage }}
              style={styles.hotImage}
            />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  // 渲染热门作者
  const renderHotAuthors = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>热门作者</Text>
        <TouchableOpacity>
          <Text style={styles.seeMore}>查看更多</Text>
        </TouchableOpacity>
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.authorList}
      >
        {hotAuthors.map((author) => (
          <TouchableOpacity
            key={author.id}
            style={styles.authorCard}
            onPress={() => handleAuthorPress(author)}
          >
            <Image source={{ uri: author.avatar }} style={styles.authorAvatar} />
            <Text style={styles.authorName} numberOfLines={1}>
              {author.nickname}
            </Text>
            <Text style={styles.authorBio} numberOfLines={2}>
              {author.bio}
            </Text>
            <Text style={styles.authorStats}>
              {author.articleCount} 文章 · {author.followerCount} 关注
            </Text>
            <TouchableOpacity style={styles.followButton}>
              <Text style={styles.followButtonText}>关注</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  // 渲染专题
  const renderTopics = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>精选专题</Text>
        <TouchableOpacity>
          <Text style={styles.seeMore}>查看更多</Text>
        </TouchableOpacity>
      </View>
      {topics.map((topic) => (
        <TouchableOpacity key={topic.id} style={styles.topicCard}>
          <Image source={{ uri: topic.cover }} style={styles.topicCover} />
          <View style={styles.topicContent}>
            <Text style={styles.topicTitle}>{topic.title}</Text>
            <Text style={styles.topicDesc} numberOfLines={2}>
              {topic.description}
            </Text>
            <Text style={styles.topicCount}>{topic.articleCount} 篇文章</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderFeatured()}
        {renderHot()}
        {renderHotAuthors()}
        {renderTopics()}
        
        {/* 底部占位，避免被导航栏遮挡 */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* 底部导航 */}
      <NavBar activeTab="Discover" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 12,
    paddingBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F5F5F5',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  seeMore: {
    fontSize: 14,
    color: '#0066FF',
  },
  hotItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  hotRank: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  hotRankTop: {
    backgroundColor: '#FF4D4F',
  },
  hotRankText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#999',
  },
  hotRankTextTop: {
    color: '#fff',
  },
  hotContent: {
    flex: 1,
  },
  hotTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    lineHeight: 22,
    marginBottom: 6,
  },
  hotMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hotMetaText: {
    fontSize: 13,
    color: '#999',
  },
  hotMetaDot: {
    marginHorizontal: 6,
    color: '#CCC',
  },
  hotImage: {
    width: 80,
    height: 60,
    borderRadius: 8,
    marginLeft: 12,
  },
  authorList: {
    paddingHorizontal: 16,
  },
  authorCard: {
    width: 120,
    alignItems: 'center',
    marginRight: 16,
  },
  authorAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 8,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  authorBio: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginBottom: 6,
  },
  authorStats: {
    fontSize: 12,
    color: '#CCC',
    marginBottom: 8,
  },
  followButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#0066FF',
    borderRadius: 16,
  },
  followButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  topicCard: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    overflow: 'hidden',
  },
  topicCover: {
    width: 120,
    height: 90,
  },
  topicContent: {
    flex: 1,
    padding: 12,
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  topicDesc: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  topicCount: {
    fontSize: 12,
    color: '#999',
  },
});

export default DiscoverScreen;
