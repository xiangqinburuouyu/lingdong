/**
 * 自媒体博客 APP - 入口文件
 */

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// 导入页面
import HomeScreen from './src/screens/HomeScreen';
import ArticleScreen from './src/screens/ArticleScreen';
import LoginScreen from './src/screens/LoginScreen';
import ProfileScreen from './src/screens/ProfileScreen';

// 导入状态管理
import useAuthStore from './src/store/authStore';

const Stack = createStackNavigator();

// 主导航
const AppNavigator = () => {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // 检查登录状态
    checkAuth().finally(() => {
      setInitializing(false);
    });
  }, []);

  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066FF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* 首页 */}
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: '首页' }}
        />
        
        {/* 文章详情 */}
        <Stack.Screen 
          name="Article" 
          component={ArticleScreen}
          options={{ 
            title: '文章详情',
            headerShown: true,
          }}
        />
        
        {/* 登录页 */}
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ 
            title: '登录',
            headerShown: true,
          }}
        />
        
        {/* 注册页 */}
        <Stack.Screen 
          name="Register" 
          component={LoginScreen}
          options={{ 
            title: '注册',
            headerShown: true,
          }}
        />
        
        {/* 个人中心 */}
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen}
          options={{ 
            title: '我的',
            headerShown: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// APP 根组件
export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <AppNavigator />
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
