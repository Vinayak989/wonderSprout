import { Tabs } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';
import { text } from '../../copy';
import { useLearning } from '../../store';
import { colors } from '../../theme';

const icons: Record<string, string> = { index: '🌱', explore: '🧭', progress: '🌼' };

export default function TabLayout() {
  const { language } = useLearning();
  return <Tabs screenOptions={({ route }) => ({
    headerShown: false,
    tabBarActiveTintColor: colors.leaf,
    tabBarInactiveTintColor: '#809087',
    tabBarStyle: { height: 78, paddingTop: 9, paddingBottom: 13, backgroundColor: '#fff', borderTopColor: colors.line },
    tabBarLabelStyle: { fontWeight: '700', fontSize: 11 },
    tabBarIcon: ({ focused }) => <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.68 }}>{icons[route.name] ?? '🌱'}</Text>,
  })}>
    <Tabs.Screen name="index" options={{ title: text(language, 'Home') }} />
    <Tabs.Screen name="explore" options={{ title: text(language, 'Explore') }} />
    <Tabs.Screen name="progress" options={{ title: text(language, 'Progress') }} />
  </Tabs>;
}
