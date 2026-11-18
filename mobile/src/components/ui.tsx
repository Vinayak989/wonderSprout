import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, type PressableProps, type TextProps, type ViewProps } from 'react-native';
import { colors } from '../theme';

export function Screen({ children, style, ...props }: ViewProps) {
  return <View style={[styles.screen, style]} {...props}>{children}</View>;
}

export function Heading({ children, style, ...props }: TextProps) {
  return <Text style={[styles.heading, style]} {...props}>{children}</Text>;
}

export function Body({ children, style, ...props }: TextProps) {
  return <Text style={[styles.body, style]} {...props}>{children}</Text>;
}

export function Card({ children, style, ...props }: ViewProps) {
  return <View style={[styles.card, style]} {...props}>{children}</View>;
}

export function Pill({ children, selected, onPress, style }: { children: React.ReactNode; selected?: boolean; onPress?: () => void; style?: object }) {
  return <Pressable onPress={onPress} disabled={!onPress} style={({ pressed }) => [styles.pill, selected && styles.pillSelected, pressed && styles.pressed, style]}><Text style={[styles.pillText, selected && styles.pillTextSelected]}>{children}</Text></Pressable>;
}

export function Button({ title, onPress, disabled, secondary, loading, style, ...props }: PressableProps & { title: string; secondary?: boolean; loading?: boolean; style?: object }) {
  return <Pressable accessibilityRole="button" onPress={onPress} disabled={disabled || loading} style={({ pressed }) => [styles.button, secondary && styles.buttonSecondary, (disabled || loading) && styles.buttonDisabled, pressed && styles.pressed, style]} {...props}>
    {loading ? <ActivityIndicator color={secondary ? colors.leaf : '#fff'} /> : <Text style={[styles.buttonText, secondary && styles.buttonTextSecondary]}>{title}</Text>}
  </Pressable>;
}

export function SectionTitle({ title, trailing }: { title: string; trailing?: string }) {
  return <View style={styles.sectionTitle}><Text style={styles.sectionTitleText}>{title}</Text>{trailing ? <Text style={styles.sectionTrailing}>{trailing}</Text> : null}</View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  heading: { color: colors.ink, fontSize: 29, lineHeight: 35, fontWeight: '800', letterSpacing: -0.5 },
  body: { color: colors.muted, fontSize: 15, lineHeight: 22 },
  card: { backgroundColor: colors.paper, borderRadius: 24, borderWidth: 1, borderColor: colors.line, padding: 18 },
  pill: { minHeight: 40, justifyContent: 'center', paddingHorizontal: 16, borderRadius: 24, backgroundColor: colors.paper, borderColor: colors.line, borderWidth: 1 },
  pillSelected: { backgroundColor: colors.ink, borderColor: colors.ink },
  pillText: { color: colors.ink, fontWeight: '700', fontSize: 13 },
  pillTextSelected: { color: colors.paper },
  button: { minHeight: 52, borderRadius: 17, paddingHorizontal: 20, backgroundColor: colors.leaf, alignItems: 'center', justifyContent: 'center' },
  buttonSecondary: { backgroundColor: colors.leafLight, borderWidth: 1, borderColor: '#CFE3D1' },
  buttonDisabled: { opacity: 0.55 },
  buttonText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  buttonTextSecondary: { color: colors.leaf },
  pressed: { opacity: 0.78, transform: [{ scale: 0.985 }] },
  sectionTitle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 26, marginBottom: 12 },
  sectionTitleText: { color: colors.ink, fontWeight: '800', fontSize: 19 },
  sectionTrailing: { color: colors.muted, fontWeight: '600', fontSize: 12 },
});
