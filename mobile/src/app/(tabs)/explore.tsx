import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Body, Card, Heading, Pill, SectionTitle } from '../../components/ui';
import { text } from '../../copy';
import { localizedGame, localizedSubject } from '../../shared/i18n';
import { useLearning, type Game } from '../../store';
import { colors, primarySubjects, subjectArt } from '../../theme';

function GameCard({ game, language, count }: { game: Game; language: 'en' | 'hi' | 'mr'; count: number }) {
  const localized = localizedGame(language, game);
  const art = subjectArt[game.subject] ?? { icon: game.icon || '✨', color: colors.paper, short: game.subject };
  return <Pressable accessibilityRole="button" onPress={() => router.push({ pathname: '/quiz', params: { gameId: game.id } })} style={({ pressed }) => [styles.gameCard, pressed && styles.pressed]}>
    <View style={[styles.gameIcon, { backgroundColor: art.color }]}><Text style={{ fontSize: 27 }}>{game.icon || art.icon}</Text></View>
    <View style={styles.gameCopy}><Text style={styles.gameTitle}>{localized.title}</Text><Text numberOfLines={2} style={styles.gameDescription}>{localized.description}</Text><Text style={styles.gameMeta}>⏱ {game.minutes} min{count ? `  ·  ${count} ${text(language, 'rounds played')}` : ''}</Text></View>
    <Text style={styles.gameArrow}>›</Text>
  </Pressable>;
}

export default function ExploreScreen() {
  const { games, age, language, completions, loadError, refreshGames } = useLearning();
  const params = useLocalSearchParams<{ subject?: string }>();
  const initialSubject = typeof params.subject === 'string' && primarySubjects.includes(params.subject) ? params.subject : 'all';
  const [subject, setSubject] = useState(initialSubject);
  useEffect(() => { setSubject(initialSubject); }, [initialSubject]);
  const filtered = useMemo(() => games.filter((game) => game.ageBands.includes(age) && (subject === 'all' || game.subject === subject)), [games, age, subject]);
  const subjectOptions = ['all', ...primarySubjects];

  return <SafeAreaView style={styles.safe} edges={['top']}>
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}><View><Text style={styles.kicker}>WONDERSPROUT</Text><Heading>{text(language, 'Explore')}</Heading><Body style={{ marginTop: 5 }}>{text(language, 'Choose a subject')}</Body></View><View style={styles.compass}><Text style={{ fontSize: 28 }}>🧭</Text></View></View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
        {subjectOptions.map((option) => <Pill key={option} selected={subject === option} onPress={() => setSubject(option)}>{option === 'all' ? text(language, 'All subjects') : localizedSubject(language, option)}</Pill>)}
      </ScrollView>
      <SectionTitle title={subject === 'all' ? text(language, 'Choose a subject') : localizedSubject(language, subject)} trailing={`${filtered.length} ${text(language, 'games')}`} />
      {filtered.length ? <View style={styles.list}>{filtered.map((game) => <GameCard key={game.id} game={game} language={language} count={completions[game.id] ?? 0} />)}</View> : <Card style={styles.empty}><Text style={{ fontSize: 34 }}>{loadError ? '🌐' : '🪴'}</Text><Text style={styles.emptyTitle}>{text(language, loadError ? 'Could not load games. Check your internet and try again.' : 'Loading games…')}</Text>{loadError ? <Pressable onPress={() => void refreshGames()}><Text style={styles.retry}>{text(language, 'Try again')}</Text></Pressable> : null}</Card>}
    </ScrollView>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream }, content: { padding: 20, paddingBottom: 30 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  kicker: { color: colors.leaf, letterSpacing: 1.1, fontSize: 10, fontWeight: '900', marginBottom: 6 },
  compass: { width: 54, height: 54, borderRadius: 20, backgroundColor: colors.sky, alignItems: 'center', justifyContent: 'center' },
  filters: { gap: 8, paddingRight: 12 },
  list: { gap: 11 }, gameCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 13, backgroundColor: '#fff', borderRadius: 22, borderWidth: 1, borderColor: colors.line },
  gameIcon: { width: 55, height: 55, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }, gameCopy: { flex: 1 }, gameTitle: { color: colors.ink, fontSize: 14, fontWeight: '900' }, gameDescription: { color: colors.muted, fontSize: 11, lineHeight: 15, marginTop: 3 }, gameMeta: { color: colors.leaf, fontWeight: '700', fontSize: 10, marginTop: 5 }, gameArrow: { color: colors.leaf, fontSize: 25, fontWeight: '700' },
  empty: { alignItems: 'center', paddingVertical: 34 }, emptyTitle: { color: colors.ink, fontWeight: '700', marginTop: 10 }, pressed: { opacity: 0.8 },
  retry: { color: colors.leaf, fontWeight: '800', padding: 12 },
});
