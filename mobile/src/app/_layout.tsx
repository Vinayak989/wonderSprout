import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { LearningProvider } from '../store';
import { colors } from '../theme';

export default function RootLayout() {
  return <LearningProvider>
    <StatusBar style="dark" />
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.cream } }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="quiz" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
    </Stack>
  </LearningProvider>;
}
