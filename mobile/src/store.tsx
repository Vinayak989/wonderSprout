import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { AgeBand } from './types';
import type { Language } from './shared/i18n';

export const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? 'https://wonder-sprout.onrender.com/api';
const STORAGE_KEY = 'wondersprout-mobile-progress-v1';
const playableModes = new Set(['quiz', 'bubble', 'spell', 'match', 'adventure', 'puzzle', 'scavenger', 'emotion', 'readaloud']);

export type Game = {
  id: string;
  title: string;
  subject: string;
  mode: string;
  description: string;
  icon: string;
  theme: string;
  minutes: number;
  ageBands: AgeBand[];
};

export type Question = {
  id: string;
  prompt: string;
  hint: string;
  choices: string[];
  answerValue?: string;
  lesson?: string;
};

type Performance = { attempts: number; correct: number };
type SavedState = {
  age: AgeBand;
  language: Language;
  answers: Record<string, Performance>;
  completions: Record<string, number>;
  lastGameId: string | null;
};

const initial: SavedState = { age: '6-8', language: 'en', answers: {}, completions: {}, lastGameId: null };

type LearningContext = {
  games: Game[];
  age: AgeBand;
  language: Language;
  answers: Record<string, Performance>;
  completions: Record<string, number>;
  lastGameId: string | null;
  isLoaded: boolean;
  loadError: boolean;
  refreshGames: () => Promise<void>;
  setAge: (age: AgeBand) => void;
  setLanguage: (language: Language) => void;
  recordAnswer: (gameId: string, correct: boolean) => void;
  finishGame: (gameId: string) => void;
};

const Context = createContext<LearningContext | null>(null);

export function LearningProvider({ children }: React.PropsWithChildren) {
  const [saved, setSaved] = useState<SavedState>(initial);
  const [games, setGames] = useState<Game[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY).then((value) => {
      if (!active) return;
      if (value) {
        try { setSaved({ ...initial, ...JSON.parse(value) }); } catch { setSaved(initial); }
      }
      setIsLoaded(true);
    }).catch(() => setIsLoaded(true));
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (isLoaded) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(saved)).catch(() => undefined);
  }, [saved, isLoaded]);

  const refreshGames = useCallback(async () => {
    setLoadError(false);
    try {
      const response = await fetch(`${API_BASE}/games`);
      if (!response.ok) throw new Error(`Games request failed: ${response.status}`);
      setGames((await response.json()) as Game[]);
    } catch {
      setLoadError(true);
    }
  }, []);

  useEffect(() => { void refreshGames(); }, [refreshGames]);

  const value = useMemo<LearningContext>(() => ({
    games: games.filter((game) => playableModes.has(game.mode)),
    age: saved.age,
    language: saved.language,
    answers: saved.answers,
    completions: saved.completions,
    lastGameId: saved.lastGameId,
    isLoaded,
    loadError,
    refreshGames,
    setAge: (age) => setSaved((current) => ({ ...current, age })),
    setLanguage: (language) => setSaved((current) => ({ ...current, language })),
    recordAnswer: (gameId, correct) => setSaved((current) => {
      const performance = current.answers[gameId] ?? { attempts: 0, correct: 0 };
      return { ...current, lastGameId: gameId, answers: { ...current.answers, [gameId]: { attempts: performance.attempts + 1, correct: performance.correct + Number(correct) } } };
    }),
    finishGame: (gameId) => setSaved((current) => ({ ...current, lastGameId: gameId, completions: { ...current.completions, [gameId]: (current.completions[gameId] ?? 0) + 1 } })),
  }), [games, saved, isLoaded, loadError, refreshGames]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useLearning() {
  const value = useContext(Context);
  if (!value) throw new Error('useLearning must be used inside LearningProvider');
  return value;
}
