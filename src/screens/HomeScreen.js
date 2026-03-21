/**
 * 首页 - 文章列表
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import ArticleCard from '../components/ArticleCard';
import SearchBar from '../components/SearchBar';
import { articleAPI, categoryAPI } from '../config/api';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // 加载文章
  const loadArticles = async (pageNum = 1, refresh = false) => {
    try {
      const params = {
        page: pageNum,
        limit: 10,
      };

      if (selectedCategory) {
        params.category = selectedCategory;
      }

      const response = await articleAPI.getList(params);
      const { articles: newArticles, pagination } = response.data.data;

      if (refresh) {
        setArticles(newArticles);
      } else {
        setArticles((prev) => [...prev, ...newArticles]);
      }

      setHasMore(pageNum < pagination.pages);
      setPage(pageNum);
    } catch (error) {
      console.error('加载文章失败:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 加载分类
  const loadCategories = async () => {
    try {
      const response = await categoryAPI.getList();
      setCategories(response.data.data.categories);
    } catch (error) {
      console.error('加载分类失败:', error);
    }
  };

  // 初始加载
  useEffect(() => {
    loadCategories();
    loadArticles();
  }, []);

  // 刷新
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadArticles(1, true);
  }, []);

  // 加载更多
  const loadMore = () => {
    if (!loading && hasMore) {
      loadArticles(page + 1);
    }
  };

  // 切换分类
  const selectCategory = (categoryId) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryId);
      setArticles([]);
      loadArticles(1, true);
    }
  };

  // 搜索
  const handleSearch = (query) => {
    console.log('搜索:', query);
    // TODO: 跳转到搜索页
  };

  // 点击文章
  const handleArticlePress = (article) => {
    navigation.navigate('Article', { article });
  };

  // 渲染分类标签
  const renderCategoryTab = () => (
    <View style={styles.categoryContainer}>
      <FlatList
        data={[{ id: null, name: '推荐' }, ...categories]}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id || 'all'}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryTab,
              selectedCategory === item.id && styles.categoryTabActive,
            ]}
            onPress={() => selectCategory(item.id)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === item.id && styles.categoryTextActive,
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  // 渲染文章卡片
  const renderArticle = ({ item }) => (
    <ArticleCard article={item} onPress={handleArticlePress} />
  );

  // 渲染空状态
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="document-text-outline" size={64} color="#CCC" />
      <Text style={styles.emptyText}>暂无文章</Text>
    </View>
  );

  // 渲染底部加载
  const renderFooter = () => {
    if (!hasMore) {
      return (
        <View style={styles.footer}>
          <Text style={styles.footerText}>没有更多了</Text>
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
    <View style={styles.container}>
      {/* 搜索栏 */}
      <SearchBar onSearch={handleSearch} />

      {/* 分类标签 */}
      {renderCategoryTab()}

      {/* 文章列表 */}
      <FlatList
        data={articles}
        renderItem={renderArticle}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={!loading ? renderEmpty : null}
        ListFooterComponent={renderFooter}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#0066FF']}
          />
        }
      />

      {/* 加载状态 */}
      {loading && articles.length === 0 && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066FF" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  categoryContainer: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E8E8E8',
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginLeft: 8,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
  },
  categoryTabActive: {
    backgroundColor: '#0066FF',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  categoryTextActive: {
    color: '#fff',
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
  footer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  footerText: {
    color: '#999',
    fontSize: 14,
  },
});

export default HomeScreen;
