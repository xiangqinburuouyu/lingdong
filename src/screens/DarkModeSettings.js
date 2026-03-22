/**
 * 深色模式设置页面
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as AppTheme from 'expo-system-ui';

const DarkModeSettings = () => {
  const navigation = useNavigation();
  const [darkMode, setDarkMode] = useState(false);
  const [followSystem, setFollowSystem] = useState(true);

  // 切换深色模式
  const toggleDarkMode = async () => {
    try {
      const newMode = !darkMode;
      setDarkMode(newMode);
      setFollowSystem(false);
      
      // 设置系统 UI 颜色
      await AppTheme.setBackgroundColorAsync(newMode ? '#0D0D0D' : '#F5F5F5');
      
      // TODO: 保存到 AsyncStorage
      // await AsyncStorage.setItem('darkMode', JSON.stringify(newMode));
      // await AsyncStorage.setItem('followSystem', JSON.stringify(false));
      
      // TODO: 通知其他组件主题已更改
      // themeStore.setDarkMode(newMode);
    } catch (error) {
      console.error('切换主题失败:', error);
    }
  };

  // 跟随系统
  const toggleFollowSystem = async () => {
    try {
      const newFollow = !followSystem;
      setFollowSystem(newFollow);
      
      if (newFollow) {
        // 恢复跟随系统
        await AppTheme.setBackgroundColorAsync(undefined);
        setDarkMode(false);
      }
      
      // TODO: 保存到 AsyncStorage
      // await AsyncStorage.setItem('followSystem', JSON.stringify(newFollow));
    } catch (error) {
      console.error('设置跟随系统失败:', error);
    }
  };

  const settingsItems = [
    {
      icon: 'moon-outline',
      iconColor: '#6B7280',
      title: '深色模式',
      subtitle: '在暗光环境下保护眼睛',
      type: 'switch',
      value: darkMode,
      onToggle: toggleDarkMode,
      disabled: followSystem,
    },
    {
      icon: 'phone-portrait-outline',
      iconColor: '#0066FF',
      title: '跟随系统',
      subtitle: '自动匹配系统深色/浅色模式',
      type: 'switch',
      value: followSystem,
      onToggle: toggleFollowSystem,
    },
  ];

  const renderSettingItem = (item) => (
    <View key={item.title} style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, { backgroundColor: `${item.iconColor}15` }]}>
          <Ionicons name={item.icon} size={24} color={item.iconColor} />
        </View>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{item.title}</Text>
          <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
        </View>
      </View>
      {item.type === 'switch' && (
        <Switch
          value={item.value}
          onValueChange={item.onToggle}
          disabled={item.disabled}
          trackColor={{ false: '#E8E8E8', true: '#0066FF' }}
          thumbColor="#FFFFFF"
          style={item.disabled && styles.switchDisabled}
        />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 头部 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>显示设置</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 预览卡片 */}
        <View style={[styles.previewCard, darkMode && styles.previewCardDark]}>
          <Text style={[styles.previewText, darkMode && styles.previewTextDark]}>
            {darkMode ? '深色模式预览' : '浅色模式预览'}
          </Text>
          <View style={[styles.previewButton, darkMode && styles.previewButtonDark]}>
            <Text style={[styles.previewButtonText, darkMode && styles.previewButtonTextDark]}>
              按钮
            </Text>
          </View>
        </View>

        {/* 设置项 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>外观</Text>
          {settingsItems.map(renderSettingItem)}
        </View>

        {/* 说明 */}
        <View style={styles.tipCard}>
          <Ionicons name="information-circle-outline" size={20} color="#0066FF" />
          <Text style={styles.tipText}>
            深色模式可以减少在低光环境下的眼睛疲劳，但可能在明亮环境下降低可读性。
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E8E8E8',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#F5F5F5',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 13,
    color: '#999',
  },
  switchDisabled: {
    opacity: 0.5,
  },
  previewCard: {
    margin: 16,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  previewCardDark: {
    backgroundColor: '#1A1A1A',
  },
  previewText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  previewTextDark: {
    color: '#FFFFFF',
  },
  previewButton: {
    backgroundColor: '#0066FF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  previewButtonDark: {
    backgroundColor: '#0066FF',
  },
  previewButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  previewButtonTextDark: {
    color: '#FFFFFF',
  },
  tipCard: {
    flexDirection: 'row',
    margin: 16,
    padding: 16,
    backgroundColor: '#F0F7FF',
    borderRadius: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
    marginLeft: 8,
  },
});

export default DarkModeSettings;
