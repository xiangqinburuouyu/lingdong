/**
 * 底部导航栏组件
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const NavBar = ({ activeTab }) => {
  const navigation = useNavigation();

  const tabs = [
    {
      name: '首页',
      icon: 'home-outline',
      activeIcon: 'home',
      route: 'Home',
    },
    {
      name: '分类',
      icon: 'grid-outline',
      activeIcon: 'grid',
      route: 'Categories',
    },
    {
      name: '发现',
      icon: 'compass-outline',
      activeIcon: 'compass',
      route: 'Discover',
    },
    {
      name: '我的',
      icon: 'person-outline',
      activeIcon: 'person',
      route: 'Profile',
    },
  ];

  const navigateTo = (route) => {
    if (activeTab !== route) {
      navigation.navigate(route);
    }
  };

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.route;
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => navigateTo(tab.route)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isActive ? tab.activeIcon : tab.icon}
              size={24}
              color={isActive ? '#0066FF' : '#999'}
            />
            <Text
              style={[
                styles.tabText,
                { color: isActive ? '#0066FF' : '#999' },
              ]}
            >
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E8E8E8',
    paddingBottom: 8,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default NavBar;
