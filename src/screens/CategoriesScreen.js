/**
 * 分类页面 - 浏览所有分类和分类文章
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
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { categoryAPI, articleAPI } from '../config/api';
import ArticleCard from '../components/ArticleCard';
import NavBar from '../components/NavBar';

const CategoriesScreen = () => {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [articles, setArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingArticles, setLoadingArticles] = useState(false);

  // 加载分类
  const loadCategories = async () => {
    try {
      const response = await categoryAPI.getList();
      const cats = response.data.data.categories;
      setCategories(cats);
      
      // 默认选择第一个分类
      if (cats.length > 0 && !selectedCategory) {
        setSelectedCategory(cats[0].id);
        loadCategoryArticles(cats[0].id);
      }
    } catch (error) {
      console.error('加载分类失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 加载分类文章
  const loadCategoryArticles = async (categoryId) => {
    setLoadingArticles(true);
    try {
      const response = await articleAPI.getList({
        category: categoryId,
        page: 1,
        limit: 20,
      });
      setArticles(response.data.data.articles);
    } catch (error) {
      console.error('加载分类文章失败:', error);
    } finally {
      setLoadingArticles(false);
    }
  };

  // 切换分类
  const selectCategory = (category) => {
    setSelectedCategory(category.id);
    loadCategoryArticles(category.id);
  };

  useFocusEffect(
    useCallback(() => {
      loadCategories();
    }, [])
  );

  // 点击文章
  const handleArticlePress = (article) => {
    navigation.navigate('Article', { article });
  };

  // 渲染分类标签
  const renderCategoryTab = ({ item }) => {
    const isSelected = selectedCategory === item.id;
    return (
      <TouchableOpacity
        style={[styles.categoryTab, isSelected && styles.categoryTabActive]}
        onPress={() => selectCategory(item)}
      >
        {item.icon ? (
          <Image source={{ uri: item.icon }} style={styles.categoryIcon} />
        ) : (
          <Ionicons
            name={isSelected ? 'grid' : 'grid-outline'}
            size={20}
            color={isSelected ? '#fff' : '#666'}
          />
        )}
        <Text
          style={[styles.categoryText, isSelected && styles.categoryTextActive]}
          numberOfLines={1}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  // 渲染文章卡片
  const renderArticle = ({ item }) => (
    <ArticleCard article={item} onPress={handleArticlePress} />
  );

  // 渲染空状态
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="document-text-outline" size={64} color="#CCC" />
      <Text style={styles.emptyText}>该分类下暂无文章</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 分类标签 */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066FF" />
        </View>
      ) : (
        <>
          {/* 分类导航 */}
          <View style={styles.categoryHeader}>
            <FlatList
              data={categories}
              renderItem={renderCategoryTab}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryList}
            />
          </View>

          {/* 分类信息 */}
          {selectedCategory && (
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryTitle}>
                {categories.find((c) => c.id === selectedCategory)?.name || ''}
              </Text>
              <Text style={styles.categoryDesc}>
                {categories.find((c) => c.id === selectedCategory)?.description || ''}
              </Text>
            </View>
          )}

          {/* 文章列表 */}
          {loadingArticles ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0066FF" />
            </View>
          ) : (
            <FlatList
              data={articles}
              renderItem={renderArticle}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={renderEmpty}
              onEndReachedThreshold={0.3}
            />
          )}
        </>
      )}

      {/* 底部导航 */}
      <NavBar activeTab="Categories" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  categoryHeader: {
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E8E8E8',
  },
  categoryList: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryTabActive: {
    backgroundColor: '#0066FF',
  },
  categoryIcon: {
    width: 20,
    height: 20,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  categoryInfo: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E8E8E8',
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  categoryDesc: {
    fontSize: 14,
    color: '#999',
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
});

export default CategoriesScreen;
