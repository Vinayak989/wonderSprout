export type AgeBand = '3-5' | '6-8' | '9-12';

export type GamePerformance = { attempts: number; correct: number };

export type SavedStory = {
  id: string;
  title: string;
  body: string;
  savedAt: string;
};

export type GalleryArtwork = {
  id: string;
  title: string;
  image: string;
  savedAt: string;
};

export type PlaylistProgress = {
  id: string;
  gameIds: string[];
  index: number;
  waitingFor: string | null;
  startedGames: number;
};

export type ClubData = {
  avatar: string;
  favorites: string[];
  decorations: string[];
  discoveries: string[];
  visitedStops: number[];
  stories: SavedStory[];
  playlist: PlaylistProgress | null;
  weeklyStarted: { key: string; gameId: string } | null;
  weeklyCompleted: string[];
  lastCompletedGameId: string | null;
  coopWins: number;
};

export type ParentPreferences = {
  dailyLimit: number;
  highContrast: boolean;
  dyslexicFont: boolean;
  reduceMotion: boolean;
  readAloud: boolean;
};

export const clubStorageKey = 'wonder-sprout-club-v1';
export const parentStorageKey = 'wonder-sprout-parent-v1';
export const artworkStorageKey = 'wonder-sprout-art-gallery-v1';
export const usageStorageKey = 'wonder-sprout-daily-usage-v1';

export const defaultClubData: ClubData = {
  avatar: '🦊',
  favorites: [],
  decorations: ['tree', 'pond'],
  discoveries: [],
  visitedStops: [],
  stories: [],
  playlist: null,
  weeklyStarted: null,
  weeklyCompleted: [],
  lastCompletedGameId: null,
  coopWins: 0,
};

export const defaultParentPreferences: ParentPreferences = {
  dailyLimit: 30,
  highContrast: false,
  dyslexicFont: false,
  reduceMotion: false,
  readAloud: false,
};

function readStored<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? { ...fallback, ...JSON.parse(value) } : fallback;
  } catch {
    return fallback;
  }
}

export function readClubData(): ClubData {
  const saved = readStored<ClubData>(clubStorageKey, defaultClubData);
  return {
    ...defaultClubData,
    ...saved,
    favorites: Array.isArray(saved.favorites) ? saved.favorites : [],
    decorations: Array.isArray(saved.decorations) ? saved.decorations : defaultClubData.decorations,
    discoveries: Array.isArray(saved.discoveries) ? saved.discoveries : [],
    visitedStops: Array.isArray(saved.visitedStops) ? saved.visitedStops : [],
    stories: Array.isArray(saved.stories) ? saved.stories : [],
    weeklyCompleted: Array.isArray(saved.weeklyCompleted) ? saved.weeklyCompleted : [],
  };
}

export function readParentPreferences(): ParentPreferences {
  const saved = readStored<ParentPreferences>(parentStorageKey, defaultParentPreferences);
  return {
    dailyLimit: [0, 15, 20, 30, 45].includes(saved.dailyLimit) ? saved.dailyLimit : defaultParentPreferences.dailyLimit,
    highContrast: Boolean(saved.highContrast),
    dyslexicFont: Boolean(saved.dyslexicFont),
    reduceMotion: Boolean(saved.reduceMotion),
    readAloud: Boolean(saved.readAloud),
  };
}

export function readArtwork(): GalleryArtwork[] {
  try {
    const saved = localStorage.getItem(artworkStorageKey);
    const parsed = saved ? JSON.parse(saved) as GalleryArtwork[] : [];
    return Array.isArray(parsed) ? parsed.slice(0, 12) : [];
  } catch {
    return [];
  }
}
