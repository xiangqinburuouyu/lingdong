/**
 * 搜索页面 - 搜索文章、作者、话题
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { articleAPI } from '../config/api';
import ArticleCard from '../components/ArticleCard';

const SearchScreen = () => {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // 热门搜索（示例数据）
  const hotSearches = [
    { id: '1', text: '人工智能', count: '10.2 万' },
    { id: '2', text: '新能源汽车', count: '8.5 万' },
    { id: '3', text: '元宇宙', count: '6.3 万' },
    { id: '4', text: '芯片', count: '5.1 万' },
    { id: '5', text: '区块链', count: '4.8 万' },
    { id: '6', text: '5G', count: '3.9 万' },
  ];

  // 搜索历史（本地存储，示例用内存存储）
  const [searchHistory, setSearchHistory] = useState([
    'React Native',
    'Node.js',
    'MongoDB',
  ]);

  // 执行搜索
  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setHasSearched(true);
    
    try {
      const response = await articleAPI.getList({
        search: searchQuery.trim(),
        page: 1,
        limit: 20,
      });
      
      setSearchResults(response.data.data.articles);
      
      // 添加到搜索历史
      if (!searchHistory.includes(searchQuery.trim())) {
        setSearchHistory((prev) => [searchQuery.trim(), ...prev.slice(0, 9)]);
      }
    } catch (error) {
      console.error('搜索失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 清除搜索
  const clearSearch = () => {
    setQuery('');
    setSearchResults([]);
    setHasSearched(false);
  };

  // 清除搜索历史
  const clearHistory = () => {
    setSearchHistory([]);
  };

  // 点击文章
  const handleArticlePress = (article) => {
    navigation.navigate('Article', { article });
  };

  // 渲染搜索结果
  const renderResult = ({ item }) => (
    <ArticleCard article={item} onPress={handleArticlePress} />
  );

  // 渲染空状态
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={64} color="#CCC" />
      <Text style={styles.emptyText}>未找到相关内容</Text>
      <Text style={styles.emptySubText}>换个关键词试试吧</Text>
    </View>
  );

  // 渲染搜索历史项
  const renderHistoryItem = (item, index) => (
    <TouchableOpacity
      key={index}
      style={styles.historyItem}
      onPress={() => {
        setQuery(item);
        performSearch(item);
      }}
    >
      <Ionicons name="time-outline" size={18} color="#999" />
      <Text style={styles.historyText}>{item}</Text>
    </TouchableOpacity>
  );

  // 渲染热门搜索项
  const renderHotItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.hotItem}
      onPress={() => {
        setQuery(item.text);
        performSearch(item.text);
      }}
    >
      <View style={styles.hotRank}>
        <Text style={[
          styles.hotRankText,
          parseInt(item.id) <= 3 && styles.hotRankTop,
        ]}>
          {item.id}
        </Text>
      </View>
      <Text style={styles.hotText}>{item.text}</Text>
      <Text style={styles.hotCount}>{item.count}热度</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* 搜索框 */}
      <View style={styles.searchHeader}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="搜索文章、作者、话题"
            placeholderTextColor="#999"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => performSearch(query)}
            returnKeyType="search"
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={18} color="#999" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>取消</Text>
        </TouchableOpacity>
      </View>

      {hasSearched ? (
        // 搜索结果
        <>
          {loading && searchResults.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0066FF" />
            </View>
          ) : (
            <FlatList
              data={searchResults}
              renderItem={renderResult}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={renderEmpty}
              onEndReachedThreshold={0.3}
            />
          )}
        </>
      ) : (
        // 搜索首页
        <FlatList
          data={[]}
          ListHeaderComponent={
            <>
              {/* 搜索历史 */}
              {searchHistory.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>搜索历史</Text>
                    <TouchableOpacity onPress={clearHistory}>
                      <Ionicons name="trash-outline" size={18} color="#999" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.historyList}>
                    {searchHistory.map(renderHistoryItem)}
                  </View>
                </View>
              )}

              {/* 热门搜索 */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>热门搜索</Text>
                </View>
                <View style={styles.hotList}>
                  {hotSearches.map(renderHotItem)}
                </View>
              </View>
            </>
          }
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
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E8E8E8',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    paddingVertical: 10,
  },
  clearButton: {
    padding: 4,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
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
  emptySubText: {
    marginTop: 8,
    fontSize: 14,
    color: '#CCC',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 12,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  historyList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  historyText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 6,
  },
  hotList: {
    flexDirection: 'column',
  },
  hotItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F5F5F5',
  },
  hotRank: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  hotRankText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#999',
  },
  hotRankTop: {
    color: '#FF4D4F',
  },
  hotText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  hotCount: {
    fontSize: 13,
    color: '#999',
  },
});

export default SearchScreen;
