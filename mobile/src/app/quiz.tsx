import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Body, Button, Card, Heading } from '../components/ui';
import { text } from '../copy';
import { localizedGame, localizedLesson, localizedQuestion } from '../shared/i18n';
import { API_BASE, useLearning, type Game, type Question } from '../store';
import { colors } from '../theme';
import NativeActivityScreen, { nativeActivityModes } from '../components/NativeActivity';

type AnswerResult = { correct: boolean; correctAnswer: string; lesson: string; encouragement: string };

export default function QuizScreen() {
  const { gameId } = useLocalSearchParams<{ gameId: string }>();
  const { games, age, language, recordAnswer, finishGame } = useLearning();
  const game = games.find((candidate) => candidate.id === gameId);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState<AnswerResult | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const [error, setError] = useState(false);

  const loadQuestions = useCallback(async () => {
    if (!game || nativeActivityModes.has(game.mode)) {
      setLoading(false);
      setError(false);
      return;
    }
    setLoading(true); setError(false); setQuestions([]); setIndex(0); setFeedback(null); setSelectedChoice(null); setFinished(false);
    try {
      const response = await fetch(`${API_BASE}/games/${encodeURIComponent(game.id)}/questions?ageBand=${age}`);
      if (!response.ok) throw new Error(`Question request failed: ${response.status}`);
      setQuestions((await response.json()) as Question[]);
    } catch {
      setError(true);
    } finally { setLoading(false); }
  }, [game, age]);

  useEffect(() => { void loadQuestions(); }, [loadQuestions]);

  const rawQuestion = questions[index];
  const question = useMemo(() => rawQuestion && game ? localizedQuestion(language, game.subject, game.id, rawQuestion) : null, [rawQuestion, language, game]);
  const localizedGameCopy = game ? localizedGame(language, game) : null;

  const choose = async (choiceIndex: number) => {
    if (!game || !rawQuestion || feedback || busy) return;
    setSelectedChoice(choiceIndex);
    setBusy(true);
    try {
      const response = await fetch(`${API_BASE}/games/${encodeURIComponent(game.id)}/answer`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ageBand: age, questionId: rawQuestion.id, choice: rawQuestion.choices[choiceIndex] }),
      });
      if (!response.ok) throw new Error(`Answer request failed: ${response.status}`);
      const result = await response.json() as AnswerResult;
      setFeedback(result);
      recordAnswer(game.id, result.correct);
    } catch {
      setError(true);
    } finally { setBusy(false); }
  };

  const next = () => {
    setHintVisible(false);
    if (index + 1 >= questions.length) {
      if (game) finishGame(game.id);
      setFinished(true);
      return;
    }
    setIndex((current) => current + 1);
    setFeedback(null);
    setSelectedChoice(null);
  };

  const closeToExplore = () => router.replace('/explore');

  if (game && nativeActivityModes.has(game.mode)) return <NativeActivityScreen game={game} />;

  return <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.topbar}><Pressable onPress={() => router.back()} style={styles.backButton}><Text style={styles.backText}>‹</Text></Pressable><Text numberOfLines={1} style={styles.topTitle}>{localizedGameCopy?.title ?? 'WonderSprout'}</Text><Text style={styles.ageTag}>{age}</Text></View>
      {loading ? <View style={styles.center}><Text style={{ fontSize: 43 }}>✨</Text><Body style={{ marginTop: 12 }}>{text(language, 'Loading games…')}</Body></View> : null}
      {!loading && error ? <Card style={styles.errorCard}><Text style={{ fontSize: 34 }}>🌐</Text><Body style={{ textAlign: 'center', marginTop: 10 }}>{text(language, 'Could not load games. Check your internet and try again.')}</Body><Button title={text(language, 'Try again')} onPress={() => void loadQuestions()} style={{ alignSelf: 'stretch', marginTop: 16 }} /></Card> : null}
      {!loading && !error && finished ? <Card style={styles.finishedCard}><Text style={styles.finishedEmoji}>🎉</Text><Heading style={{ textAlign: 'center', fontSize: 25 }}>{text(language, 'Round complete!')}</Heading><Body style={{ textAlign: 'center', marginTop: 9 }}>{text(language, 'You learned something new.')}</Body><View style={styles.finishedStat}><Text style={styles.finishedStatNumber}>{questions.length}</Text><Text style={styles.finishedStatLabel}>{text(language, 'Answers')}</Text></View><Button title={text(language, 'Start another game')} onPress={closeToExplore} style={{ alignSelf: 'stretch', marginTop: 23 }} /></Card> : null}
      {!loading && !error && !finished && !game ? <Card style={styles.errorCard}><Heading>{text(language, 'No games in this subject yet.')}</Heading><Button title={text(language, 'Explore')} onPress={closeToExplore} style={{ alignSelf: 'stretch', marginTop: 18 }} /></Card> : null}
      {!loading && !error && !finished && game && question ? <>
        <View style={styles.progressMeta}><Text style={styles.progressLabel}>{index + 1} / {questions.length}</Text><Text style={styles.progressSubject}>{game.subject}</Text></View>
        <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${(index / questions.length) * 100}%` }]} /></View>
        <Card style={styles.questionCard}>
          <View style={styles.questionBadge}><Text style={{ fontSize: 20 }}>{game.icon || '🌟'}</Text><Text style={styles.badgeText}>{localizedGameCopy?.title}</Text></View>
          <Heading style={styles.prompt}>{question.prompt}</Heading>
          {hintVisible ? <View style={styles.hintBox}><Text style={styles.hintLabel}>{text(language, 'Hint')}</Text><Text style={styles.hintText}>{question.hint}</Text></View> : null}
          <View style={styles.choices}>{question.choices.map((choice, choiceIndex) => {
            const correctIndex = feedback ? rawQuestion.choices.findIndex((rawChoice) => rawChoice === feedback.correctAnswer) : -1;
            const correctChoice = feedback && choiceIndex === correctIndex;
            const selectedWrong = feedback && !feedback.correct && choiceIndex === selectedChoice;
            return <Pressable key={`${rawQuestion.id}-${choiceIndex}`} accessibilityRole="button" disabled={Boolean(feedback) || busy} onPress={() => void choose(choiceIndex)} style={({ pressed }) => [styles.choice, correctChoice && styles.choiceCorrect, selectedWrong && styles.choiceWrong, pressed && !feedback && styles.pressed]}>
            <Text style={styles.choiceLetter}>{String.fromCharCode(65 + choiceIndex)}</Text><Text style={styles.choiceText}>{choice}</Text><Text style={styles.choiceMark}>{correctChoice ? '✓' : selectedWrong ? '↻' : ''}</Text>
          </Pressable>;
          })}</View>
          {feedback ? <View style={[styles.feedbackBox, feedback.correct ? styles.feedbackCorrect : styles.feedbackTry]}><Text style={styles.feedbackTitle}>{text(language, feedback.correct ? 'You got it!' : 'Nice try!')}</Text><Text style={styles.feedbackCopy}>{localizedLesson(language, game.subject, rawQuestion.id, feedback.lesson)}</Text></View> : null}
          {!feedback ? <Pressable accessibilityRole="button" onPress={() => setHintVisible((visible) => !visible)} style={styles.hintToggle}><Text style={styles.hintToggleText}>{hintVisible ? '✦  ' : '💡  '}{text(language, 'Hint')}</Text></Pressable> : null}
        </Card>
        {feedback ? <Button title={text(language, index + 1 === questions.length ? 'Finish round' : 'Next question')} onPress={next} style={styles.nextButton} /> : null}
        {busy ? <Text style={styles.checking}>{text(language, 'Checking your answer…')}</Text> : null}
      </> : null}
    </ScrollView>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream }, content: { flexGrow: 1, padding: 20, paddingBottom: 26 },
  topbar: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 }, backButton: { width: 42, height: 42, borderRadius: 15, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.line }, backText: { fontSize: 34, lineHeight: 37, color: colors.ink, marginTop: -4 }, topTitle: { flex: 1, color: colors.ink, fontWeight: '900', fontSize: 16 }, ageTag: { borderRadius: 20, backgroundColor: colors.leafLight, color: colors.leaf, paddingHorizontal: 11, paddingVertical: 7, fontSize: 11, fontWeight: '800' },
  center: { flex: 1, minHeight: 250, alignItems: 'center', justifyContent: 'center' }, errorCard: { marginTop: 45, alignItems: 'center', padding: 23 }, progressMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, progressLabel: { color: colors.ink, fontSize: 12, fontWeight: '900' }, progressSubject: { color: colors.leaf, fontSize: 11, fontWeight: '800' }, progressTrack: { height: 8, borderRadius: 8, backgroundColor: '#E9EDE2', overflow: 'hidden', marginTop: 9, marginBottom: 17 }, progressFill: { height: '100%', backgroundColor: colors.leaf, borderRadius: 8 },
  questionCard: { borderRadius: 27, padding: 18 }, questionBadge: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 10, paddingVertical: 7, backgroundColor: '#F3F0E7', borderRadius: 16 }, badgeText: { color: colors.muted, fontSize: 11, fontWeight: '800' }, prompt: { fontSize: 22, lineHeight: 29, marginTop: 17, marginBottom: 17 }, choices: { gap: 9 }, choice: { minHeight: 55, flexDirection: 'row', alignItems: 'center', gap: 11, paddingHorizontal: 12, borderRadius: 17, borderWidth: 1.3, borderColor: colors.line, backgroundColor: '#fff' }, choiceCorrect: { borderColor: '#86B99A', backgroundColor: '#EDF7EF' }, choiceWrong: { borderColor: '#E5A99D', backgroundColor: '#FFF0ED' }, choiceLetter: { width: 29, height: 29, borderRadius: 10, overflow: 'hidden', textAlign: 'center', textAlignVertical: 'center', backgroundColor: '#F2F3EC', color: colors.leaf, fontWeight: '900' }, choiceText: { flex: 1, color: colors.ink, fontSize: 14, lineHeight: 20, fontWeight: '700' }, choiceMark: { width: 18, color: colors.success, fontSize: 18, fontWeight: '900' },
  hintToggle: { alignSelf: 'center', padding: 11, marginTop: 8 }, hintToggleText: { color: colors.leaf, fontSize: 12, fontWeight: '800' }, hintBox: { backgroundColor: '#FFF5D9', borderRadius: 15, padding: 12, marginBottom: 14 }, hintLabel: { color: '#9A6710', fontSize: 10, fontWeight: '900', marginBottom: 3 }, hintText: { color: colors.ink, fontSize: 13, lineHeight: 18 },
  feedbackBox: { borderRadius: 16, padding: 13, marginTop: 13 }, feedbackCorrect: { backgroundColor: '#E7F3E9' }, feedbackTry: { backgroundColor: '#FFF1DC' }, feedbackTitle: { color: colors.ink, fontWeight: '900', fontSize: 14 }, feedbackCopy: { color: colors.ink, fontSize: 12, lineHeight: 17, marginTop: 4 }, nextButton: { marginTop: 13 }, checking: { textAlign: 'center', color: colors.muted, fontSize: 12, marginTop: 12 },
  finishedCard: { marginTop: 20, alignItems: 'center', padding: 24 }, finishedEmoji: { fontSize: 57, marginBottom: 9 }, finishedStat: { alignItems: 'center', marginTop: 20 }, finishedStatNumber: { color: colors.leaf, fontWeight: '900', fontSize: 30 }, finishedStatLabel: { color: colors.muted, fontWeight: '700', marginTop: 2 }, pressed: { opacity: 0.8 },
});

