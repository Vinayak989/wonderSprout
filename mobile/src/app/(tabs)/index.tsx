import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { text } from '../../copy';
import { useLearning } from '../../store';
import { colors, primarySubjects, subjectArt } from '../../theme';
import type { AgeBand } from '../../types';
import { localizedAgeCopy, localizedGame, localizedSubject } from '../../shared/i18n';
import { Button, Card, Heading, Pill, SectionTitle } from '../../components/ui';

const bands: AgeBand[] = ['3-5', '6-8', '9-12'];
const bandNames: Record<AgeBand, [string, string]> = {
  '3-5': ['Little explorers', 'Ages 3–5'],
  '6-8': ['Curious minds', 'Ages 6–8'],
  '9-12': ['Big thinkers', 'Ages 9–12'],
};

export default function HomeScreen() {
  const { games, age, language, answers, completions, lastGameId, loadError, refreshGames, setAge, setLanguage } = useLearning();
  const ageGames = games.filter((game) => game.ageBands.includes(age));
  const featured = ageGames.find((game) => game.id === lastGameId) ?? ageGames.find((game) => game.subject === 'Math magic') ?? ageGames[0];
  const answerCount = Object.values(answers).reduce((sum, row) => sum + row.attempts, 0);
  const completedCount = Object.values(completions).reduce((sum, count) => sum + count, 0);

  const openExplore = (subject?: string) => router.push(subject ? { pathname: '/explore', params: { subject } } : '/explore');
  const ageLabel = localizedAgeCopy(language, bandNames[age][1]);
  return <SafeAreaView style={styles.safe} edges={['top']}>
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.topline}>
        <View style={styles.brand}><Text style={styles.brandIcon}>🌱</Text><Text style={styles.brandName}>WonderSprout</Text></View>
        <View style={styles.languages}>{(['en', 'hi', 'mr'] as const).map((item) => <Pressable key={item} onPress={() => setLanguage(item)} style={[styles.language, language === item && styles.languageActive]}><Text style={[styles.languageText, language === item && styles.languageTextActive]}>{item.toUpperCase()}</Text></Pressable>)}</View>
      </View>

      <View style={styles.hero}>
        <View style={styles.heroBubble}><Text style={styles.heroEmoji}>🦊</Text><Text style={styles.heroSparkle}>✦</Text></View>
        <Text style={styles.eyebrow}>{text(language, 'A little wonder every day')}</Text>
        <Text style={styles.heroTitle}>{text(language, 'Ready for an adventure?')}</Text>
        <Text style={styles.heroCaption}>{ageLabel} · {completedCount} {text(language, 'games')} · {answerCount} {text(language, 'answers')}</Text>
        {featured ? <Pressable onPress={() => router.push({ pathname: '/quiz', params: { gameId: featured.id } })} style={({ pressed }) => [styles.heroPlay, pressed && styles.pressed]}>
          <View style={styles.playIcon}><Text style={styles.playEmoji}>{featured.icon}</Text></View>
          <View style={styles.playCopy}><Text style={styles.playKicker}>{text(language, lastGameId === featured.id ? 'Pick up where you left off' : 'Play a quick round')}</Text><Text numberOfLines={1} style={styles.playTitle}>{localizedGame(language, featured).title}</Text></View>
          <Text style={styles.arrow}>→</Text>
        </Pressable> : null}
      </View>

      {loadError ? <Card style={styles.connectionCard}><Text style={styles.connectionTitle}>{text(language, 'Could not load games. Check your internet and try again.')}</Text><Button title={text(language, 'Try again')} secondary onPress={() => void refreshGames()} style={{ marginTop: 11 }} /></Card> : null}

      <SectionTitle title={text(language, 'Choose your age group')} />
      <View style={styles.ageChoices}>{bands.map((band) => <Pressable key={band} onPress={() => setAge(band)} style={[styles.ageCard, age === band && styles.ageSelected]}>
        <Text style={styles.ageIcon}>{band === '3-5' ? '🐣' : band === '6-8' ? '🦋' : '🚀'}</Text>
        <Text style={[styles.ageName, age === band && styles.ageNameSelected]}>{localizedAgeCopy(language, bandNames[band][0])}</Text>
        <Text style={[styles.ageNumber, age === band && styles.ageNumberSelected]}>{localizedAgeCopy(language, bandNames[band][1])}</Text>
      </Pressable>)}</View>

      <SectionTitle title={text(language, 'Explore subjects')} trailing={`${primarySubjects.length}`} />
      <View style={styles.subjectGrid}>{primarySubjects.map((subject) => {
        const art = subjectArt[subject];
        const count = ageGames.filter((game) => game.subject === subject).length;
        return <Pressable key={subject} onPress={() => openExplore(subject)} style={({ pressed }) => [styles.subjectTile, { backgroundColor: art.color }, pressed && styles.pressed]}>
          <Text style={styles.subjectIcon}>{art.icon}</Text><Text numberOfLines={1} style={styles.subjectName}>{localizedSubject(language, subject)}</Text><Text style={styles.subjectMeta}>{count} {text(language, 'games')}</Text>
        </Pressable>;
      })}</View>

      <Card style={styles.gardenCard}>
        <View style={styles.gardenIcon}><Text style={{ fontSize: 24 }}>🌷</Text></View>
        <View style={{ flex: 1 }}><Text style={styles.gardenTitle}>{text(language, 'Your learning garden')}</Text><Text style={styles.gardenCopy}>{answerCount ? `${answerCount} ${text(language, 'answers')} · ${completedCount} ${text(language, 'games')}` : text(language, 'Find a game to begin your learning garden.')}</Text></View>
      </Card>
      <Button title={text(language, 'Explore')} secondary onPress={() => openExplore()} style={styles.bottomButton} />
    </ScrollView>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  content: { padding: 20, paddingBottom: 30 },
  topline: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  brandIcon: { fontSize: 24 }, brandName: { fontWeight: '900', color: colors.ink, fontSize: 16 },
  languages: { flexDirection: 'row', borderRadius: 18, padding: 3, backgroundColor: '#EEF0E6', gap: 2 },
  language: { borderRadius: 14, paddingHorizontal: 9, paddingVertical: 6 }, languageActive: { backgroundColor: '#fff' },
  languageText: { fontWeight: '800', color: colors.muted, fontSize: 10 }, languageTextActive: { color: colors.ink },
  hero: { backgroundColor: colors.ink, borderRadius: 30, padding: 21, paddingTop: 19, overflow: 'hidden' },
  heroBubble: { position: 'absolute', top: 0, right: 10, width: 116, height: 116, borderRadius: 58, backgroundColor: '#285844', alignItems: 'center', justifyContent: 'center' },
  heroEmoji: { fontSize: 65, marginTop: 17 }, heroSparkle: { position: 'absolute', color: colors.lime, fontSize: 21, right: 19, top: 18 },
  eyebrow: { color: colors.lime, fontSize: 12, fontWeight: '800', letterSpacing: 0.3 },
  heroTitle: { maxWidth: '76%', marginTop: 9, color: '#fff', fontSize: 27, lineHeight: 32, fontWeight: '900' },
  heroCaption: { color: '#B6CDBA', fontSize: 12, marginTop: 8, fontWeight: '600' },
  heroPlay: { marginTop: 18, borderRadius: 19, padding: 12, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', gap: 12 },
  playIcon: { width: 47, height: 47, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF0CF' },
  playEmoji: { fontSize: 25 }, playCopy: { flex: 1 }, playKicker: { color: colors.muted, fontSize: 10, fontWeight: '700' }, playTitle: { marginTop: 2, color: colors.ink, fontSize: 14, fontWeight: '900' }, arrow: { color: colors.leaf, fontSize: 24, fontWeight: '800', paddingHorizontal: 5 },
  ageChoices: { flexDirection: 'row', gap: 8 },
  ageCard: { flex: 1, minHeight: 118, padding: 12, borderRadius: 21, backgroundColor: '#F0EFE5', borderWidth: 1.5, borderColor: 'transparent' },
  ageSelected: { backgroundColor: colors.leafLight, borderColor: '#89B891' }, ageIcon: { fontSize: 24, marginBottom: 7 },
  ageName: { color: colors.ink, fontSize: 12, fontWeight: '800' }, ageNameSelected: { color: colors.leaf }, ageNumber: { marginTop: 3, fontSize: 10, color: colors.muted }, ageNumberSelected: { color: colors.leaf },
  subjectGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  subjectTile: { width: '48%', minHeight: 116, padding: 14, borderRadius: 22, justifyContent: 'space-between' }, subjectIcon: { fontSize: 26 }, subjectName: { marginTop: 8, color: colors.ink, fontWeight: '800', fontSize: 13 }, subjectMeta: { color: colors.muted, fontSize: 10, marginTop: 3 },
  gardenCard: { marginTop: 20, flexDirection: 'row', alignItems: 'center', gap: 13 }, gardenIcon: { width: 46, height: 46, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F6ECD6' }, gardenTitle: { color: colors.ink, fontWeight: '800', fontSize: 14 }, gardenCopy: { color: colors.muted, fontSize: 12, marginTop: 3 }, bottomButton: { marginTop: 12 }, pressed: { opacity: 0.8 },
  connectionCard: { marginTop: 12 }, connectionTitle: { color: colors.ink, fontWeight: '700', fontSize: 13, lineHeight: 18 },
});
