import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Body, Button, Card, Heading, SectionTitle } from '../../components/ui';
import { text } from '../../copy';
import { localizedGame, localizedSubject } from '../../shared/i18n';
import { useLearning } from '../../store';
import { colors, primarySubjects, subjectArt } from '../../theme';

export default function ProgressScreen() {
  const { games, age, language, answers, completions } = useLearning();
  const [unlocked, setUnlocked] = useState(false);
  const [answer, setAnswer] = useState('');
  const [wrong, setWrong] = useState(false);

  const subjects = useMemo(() => primarySubjects.map((subject) => {
    const subjectGames = games.filter((game) => game.subject === subject);
    const attempts = subjectGames.reduce((sum, game) => sum + (answers[game.id]?.attempts ?? 0), 0);
    const correct = subjectGames.reduce((sum, game) => sum + (answers[game.id]?.correct ?? 0), 0);
    const finished = subjectGames.reduce((sum, game) => sum + (completions[game.id] ?? 0), 0);
    const accuracy = attempts ? Math.round(correct / attempts * 100) : 0;
    const practice = attempts >= 3 && accuracy < 60;
    const nextGame = subjectGames.find((game) => game.ageBands.includes(age));
    return { subject, subjectGames, attempts, correct, finished, accuracy, practice, nextGame };
  }), [games, age, answers, completions]);

  const totalAnswers = subjects.reduce((sum, subject) => sum + subject.attempts, 0);
  const totalCorrect = subjects.reduce((sum, subject) => sum + subject.correct, 0);
  const totalGames = subjects.reduce((sum, subject) => sum + subject.finished, 0);
  const practicedCount = subjects.filter((subject) => subject.attempts > 0).length;
  const overallAccuracy = totalAnswers ? Math.round(totalCorrect / totalAnswers * 100) : 0;

  const unlock = () => {
    if (answer.trim() === '12') { setUnlocked(true); setWrong(false); setAnswer(''); }
    else setWrong(true);
  };

  return <SafeAreaView style={styles.safe} edges={['top']}>
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      <View style={styles.header}><Text style={styles.headerIcon}>🌼</Text><View style={{ flex: 1 }}><Text style={styles.kicker}>WONDERSPROUT</Text><Heading>{text(language, 'Your learning garden')}</Heading></View></View>
      {!unlocked ? <Card style={styles.lockCard}>
        <View style={styles.lockIcon}><Text style={{ fontSize: 26 }}>🔐</Text></View>
        <Text style={styles.lockTitle}>{text(language, 'Parent or teacher view')}</Text>
        <Body style={styles.lockCopy}>{text(language, 'A grown-up check keeps this view private.')}</Body>
        <Text style={styles.challenge}>{text(language, 'What is 7 + 5?')}</Text>
        <TextInput value={answer} onChangeText={(value) => { setAnswer(value.replace(/[^0-9]/g, '')); setWrong(false); }} keyboardType="number-pad" maxLength={3} accessibilityLabel={text(language, 'What is 7 + 5?')} placeholder="?" placeholderTextColor="#95A39B" style={[styles.input, wrong && styles.inputWrong]} />
        {wrong ? <Text style={styles.wrongText}>Try once more with a grown-up.</Text> : null}
        <Button title={text(language, 'Unlock progress')} onPress={unlock} disabled={!answer.trim()} style={styles.unlockButton} />
      </Card> : <>
        <View style={styles.parentRow}><View><Text style={styles.parentEyebrow}>{text(language, 'Parent or teacher view')}</Text><Text style={styles.parentTitle}>{text(language, 'Subjects practiced')}</Text></View><Pressable onPress={() => setUnlocked(false)}><Text style={styles.lockAction}>{text(language, 'Lock this view')}</Text></Pressable></View>
        <View style={styles.summaryRow}>
          <Card style={styles.summaryCard}><Text style={styles.summaryNumber}>{practicedCount}</Text><Text style={styles.summaryLabel}>{text(language, 'Subjects practiced')}</Text></Card>
          <Card style={styles.summaryCard}><Text style={styles.summaryNumber}>{totalGames}</Text><Text style={styles.summaryLabel}>{text(language, 'Games finished')}</Text></Card>
          <Card style={styles.summaryCard}><Text style={styles.summaryNumber}>{overallAccuracy}%</Text><Text style={styles.summaryLabel}>{text(language, 'Accuracy')}</Text></Card>
        </View>
        {totalAnswers === 0 ? <Card style={styles.empty}><Text style={{ fontSize: 34 }}>🌱</Text><Text style={styles.emptyTitle}>{text(language, 'No answers yet')}</Text><Body style={{ textAlign: 'center', marginTop: 5 }}>{text(language, 'Keep exploring to see learning progress here.')}</Body></Card> : null}
        <SectionTitle title={text(language, 'Subjects practiced')} />
        <View style={styles.subjectList}>{subjects.map((item) => {
          const art = subjectArt[item.subject];
          const status = item.practice ? text(language, 'Practice together') : item.attempts ? text(language, 'Growing nicely') : text(language, 'Just getting started');
          return <Card key={item.subject} style={styles.subjectCard}>
            <View style={styles.subjectHead}><View style={[styles.subjectIcon, { backgroundColor: art.color }]}><Text style={{ fontSize: 24 }}>{art.icon}</Text></View><View style={{ flex: 1 }}><Text style={styles.subjectName}>{localizedSubject(language, item.subject)}</Text><Text style={styles.subjectMeta}>{item.finished} {text(language, 'games')} · {item.attempts} {text(language, 'answers')}</Text></View><Text style={styles.accuracy}>{item.attempts ? `${item.accuracy}%` : '—'}</Text></View>
            {item.attempts ? <View style={styles.meter}><View style={[styles.meterFill, { width: `${item.accuracy}%`, backgroundColor: item.practice ? colors.gold : colors.leaf }]} /></View> : null}
            <View style={styles.subjectFoot}><Text style={[styles.status, item.practice && styles.statusPractice]}>{status}</Text>{item.practice && item.nextGame ? <Pressable accessibilityRole="button" onPress={() => router.push({ pathname: '/quiz', params: { gameId: item.nextGame.id } })}><Text style={styles.practiceLink}>{text(language, 'Practice together')} →</Text></Pressable> : null}</View>
          </Card>;
        })}</View>
        <Text style={styles.privacyNote}>{text(language, 'Saved on this device')}</Text>
      </>}
    </ScrollView>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream }, content: { padding: 20, paddingBottom: 34 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 13, marginBottom: 18 }, headerIcon: { fontSize: 38 }, kicker: { color: colors.leaf, letterSpacing: 1, fontSize: 10, fontWeight: '900', marginBottom: 5 },
  lockCard: { marginTop: 6, padding: 23, alignItems: 'center' }, lockIcon: { height: 56, width: 56, borderRadius: 20, backgroundColor: colors.leafLight, alignItems: 'center', justifyContent: 'center' }, lockTitle: { color: colors.ink, fontWeight: '900', fontSize: 19, marginTop: 15 }, lockCopy: { textAlign: 'center', marginTop: 5 }, challenge: { color: colors.ink, fontWeight: '800', fontSize: 17, marginTop: 24 },
  input: { width: 108, height: 54, borderWidth: 1.5, borderColor: colors.line, borderRadius: 16, backgroundColor: '#FBFCF8', textAlign: 'center', color: colors.ink, fontSize: 22, fontWeight: '800', marginTop: 10 }, inputWrong: { borderColor: colors.danger }, wrongText: { color: colors.danger, marginTop: 8, fontSize: 12 }, unlockButton: { width: '100%', marginTop: 17 },
  parentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 8 }, parentEyebrow: { fontSize: 11, fontWeight: '700', color: colors.muted }, parentTitle: { fontSize: 19, fontWeight: '900', color: colors.ink, marginTop: 4 }, lockAction: { color: colors.leaf, fontSize: 12, fontWeight: '800', padding: 6 },
  summaryRow: { flexDirection: 'row', gap: 8, marginTop: 16 }, summaryCard: { flex: 1, padding: 12, borderRadius: 19, minHeight: 82 }, summaryNumber: { color: colors.ink, fontWeight: '900', fontSize: 21 }, summaryLabel: { color: colors.muted, fontSize: 10, lineHeight: 13, marginTop: 4, fontWeight: '600' },
  empty: { alignItems: 'center', marginTop: 18, paddingVertical: 21 }, emptyTitle: { color: colors.ink, fontWeight: '800', marginTop: 7 }, subjectList: { gap: 10 }, subjectCard: { padding: 15, borderRadius: 21 }, subjectHead: { flexDirection: 'row', alignItems: 'center', gap: 11 }, subjectIcon: { width: 46, height: 46, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }, subjectName: { color: colors.ink, fontSize: 14, fontWeight: '900' }, subjectMeta: { color: colors.muted, fontSize: 10, marginTop: 3 }, accuracy: { fontSize: 18, color: colors.ink, fontWeight: '900' },
  meter: { height: 7, borderRadius: 5, backgroundColor: '#EEF0E8', marginTop: 13, overflow: 'hidden' }, meterFill: { height: '100%', borderRadius: 5 }, subjectFoot: { marginTop: 9, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, status: { color: colors.leaf, fontSize: 11, fontWeight: '700' }, statusPractice: { color: '#9A6710' }, practiceLink: { color: colors.leaf, fontWeight: '800', fontSize: 11 }, privacyNote: { color: colors.muted, textAlign: 'center', fontSize: 11, marginTop: 22 },
});
