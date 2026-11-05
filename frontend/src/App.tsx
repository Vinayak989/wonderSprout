import { lazy, Suspense, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { ageCopyHi, hindiQuestionRound, localizedGame, localizedLesson, localizedQuestion, localizedSubject, subjectsHi, tr, type Language } from './i18n';

const ThreeArcade = lazy(() => import('./ThreeArcade'));

type AgeBand = '3-5' | '6-8' | '9-12';
type Page = 'welcome' | 'games' | 'game';
type Subject = 'all' | 'Math magic' | 'Word adventures' | 'Science wonders' | 'Adventure & Treasure Hunt' | 'Memory Games' | 'Puzzle & Logic' | 'Art & Creativity' | 'Geography & World Explorer' | 'Animals & Nature' | 'Music & Rhythm' | 'Coding & Computational Thinking' | 'Life Skills & Good Habits' | 'Emotions & Social Skills' | 'Time & Calendar' | 'History & Culture' | 'Money & Financial Literacy' | 'Sports & Movement' | 'Interactive Stories & Reading';
type GameMode = 'quiz' | 'bubble' | 'spell' | 'match' | 'adventure' | 'memory' | 'puzzle' | 'creative' | 'scavenger' | 'coding' | 'sequence' | 'missing' | 'sudoku' | 'monster' | 'pixel' | 'piano' | 'rhythm' | 'sound' | 'sort' | 'clock' | 'shop' | 'balance' | 'emotion' | 'loop' | 'readaloud' | 'maze3d' | 'space3d';

type AdventureScene = { place: string; story: string; landmark: string; reward: string; node: string };

const adventureStories: Record<string, AdventureScene[]> = {
  'moon-meadow-quest': [
    { place: 'Glowgrass Gate', story: 'Luna’s Moonstone rolled off the sky tree. Help her open the glowing gate and follow its trail.', landmark: '🌙', reward: 'Moon compass', node: '🌾' },
    { place: 'Sparkle Stream', story: 'A bright stream cuts across the meadow path. Work out a safe way across the stepping stones.', landmark: '💧', reward: 'Stream pebble', node: '🌊' },
    { place: 'Whispering Ferns', story: 'The ferns are rustling a secret clue. Listen closely and help Luna read the trail.', landmark: '🌿', reward: 'Fern ribbon', node: '🍃' },
    { place: 'Crystal Cave', story: 'A sleepy star owl guards the cave. Use your science smarts to wake the crystals.', landmark: '💎', reward: 'Owl feather', node: '🦉' },
    { place: 'The Sky Tree', story: 'You found the Moonstone! Solve the final trail puzzle to return it to its home in the sky.', landmark: '🌳', reward: 'Moonstone', node: '✨' },
  ],
  'jungle-treasure': [
    { place: 'Lost Map Lookout', story: 'A toucan found an old treasure map, but the first turn is missing. Help choose the way into the jungle.', landmark: '🗺️', reward: 'Explorer map', node: '🧭' },
    { place: 'Vine Gate', story: 'A tangle of friendly vines blocks the trail. Solve their word clue to find the way through.', landmark: '🌱', reward: 'Vine key', node: '🌿' },
    { place: 'Mango River', story: 'The toucan is hungry for the next leg of the journey. Count out just enough fruit for the trip.', landmark: '🦜', reward: 'Golden mango', node: '🌊' },
    { place: 'Canopy Camp', story: 'High in the leafy treetops, the forest friends share a secret about what keeps their home healthy.', landmark: '🌴', reward: 'Canopy badge', node: '🪺' },
    { place: 'Hidden Temple', story: 'The treasure is almost yours! Use the map clues to open the old jungle chest.', landmark: '🛕', reward: 'Jungle treasure', node: '💛' },
  ],
};

const genericAdventurePlaces = [
  { place: 'Trailhead', landmark: '🗺️', node: '🧭', reward: 'Explorer map' },
  { place: 'Clue Garden', landmark: '🌿', node: '🌱', reward: 'Clue leaf' },
  { place: 'River Crossing', landmark: '🌊', node: '🐚', reward: 'River pebble' },
  { place: 'Wonder Cave', landmark: '💎', node: '🔦', reward: 'Cave crystal' },
  { place: 'Treasure Clearing', landmark: '🎁', node: '✨', reward: 'Quest treasure' },
];

function adventureFor(game: Game, language: Language): AdventureScene[] {
  const story = adventureStories[game.id];
  if (story) return story.map((scene) => ({ ...scene, place: tr(language, scene.place), story: tr(language, scene.story), reward: tr(language, scene.reward) }));
  const title = localizedGame(language, game).title;
  return genericAdventurePlaces.map((place, index) => ({
    ...place,
    place: tr(language, place.place),
    reward: tr(language, place.reward),
    story: language === 'hi'
      ? index === 0 ? `तुम्हारा ${title} यहाँ से शुरू होता है। ध्यान से देखो और पहला संकेत खोजो।` : `${title} में आगे बढ़ते रहो। पिछली जगह सीखी बात से अगला संकेत ढूँढ़ो।`
      : index === 0 ? `Your ${title} begins here. Look carefully and follow the first clue.` : `Keep exploring ${title}. Use what you learned at the last stop to find the next clue.`,
  }));
}

type Game = {
  id: string;
  title: string;
  subject: string;
  mode: GameMode;
  description: string;
  icon: string;
  theme: string;
  minutes: number;
  ageBands: AgeBand[];
};

type Question = {
  id: string;
  prompt: string;
  hint: string;
  choices: string[];
  answerIndex?: number;
  answerValue?: string;
  lesson?: string;
  localized?: boolean;
};

type AnswerResult = {
  correct: boolean;
  correctAnswer: string;
  lesson: string;
  encouragement: string;
};

type Progress = { stars: number; games: number };
type MemoryCard = { id: string; pairKey: string; face: string; label: string; fact: string };
type Point = [number, number];
type CodingLevel = { size: number; start: Point; goal: Point; walls: string[]; maxBlocks: number };

const codingLevels: Record<AgeBand, CodingLevel> = {
  '3-5': { size: 4, start: [0, 3], goal: [3, 3], walls: [], maxBlocks: 6 },
  '6-8': { size: 5, start: [0, 4], goal: [4, 0], walls: ['1,4', '1,3', '3,2'], maxBlocks: 12 },
  '9-12': { size: 6, start: [0, 5], goal: [5, 0], walls: ['1,5', '1,4', '3,4', '3,3', '2,1', '4,1'], maxBlocks: 14 },
};

const codingCommands = [
  { id: 'up', icon: '↑', name: 'Up', dx: 0, dy: -1 },
  { id: 'right', icon: '→', name: 'Right', dx: 1, dy: 0 },
  { id: 'down', icon: '↓', name: 'Down', dx: 0, dy: 1 },
  { id: 'left', icon: '←', name: 'Left', dx: -1, dy: 0 },
];

const artPrompts: Record<AgeBand, string[]> = {
  '3-5': ['Draw a happy flower friend.', 'Make a rainbow home for an animal.', 'Draw a silly creature with a funny hat.'],
  '6-8': ['Design a garden for butterflies.', 'Draw a rocket with a pet passenger.', 'Create a cozy jungle treehouse.'],
  '9-12': ['Invent a planet and design its habitat.', 'Draw a creature adapted to its climate.', 'Create a picture showing a food web.'],
};

const ageBands: { id: AgeBand; name: string; label: string; icon: string }[] = [
  { id: '3-5', name: 'Little explorers', label: 'Ages 3–5', icon: '🌱' },
  { id: '6-8', name: 'Curious minds', label: 'Ages 6–8', icon: '🦋' },
  { id: '9-12', name: 'Big thinkers', label: 'Ages 9–12', icon: '🚀' },
];

const categories: { id: Subject; label: string; icon: string }[] = [
  { id: 'all', label: 'All games', icon: '✨' },
  { id: 'Math magic', label: 'Math', icon: '🔢' },
  { id: 'Word adventures', label: 'Words', icon: '📚' },
  { id: 'Science wonders', label: 'Science', icon: '🔭' },
  { id: 'Adventure & Treasure Hunt', label: 'Adventure & Treasure Hunt', icon: '🧭' },
  { id: 'Memory Games', label: 'Memory Games', icon: '🃏' },
  { id: 'Puzzle & Logic', label: 'Puzzle & Logic', icon: '🧩' },
  { id: 'Art & Creativity', label: 'Art & Creativity', icon: '🎨' },
  { id: 'Geography & World Explorer', label: 'Geography & World Explorer', icon: '🌍' },
  { id: 'Animals & Nature', label: 'Animals & Nature', icon: '🐾' },
  { id: 'Music & Rhythm', label: 'Music & Rhythm', icon: '🎵' },
  { id: 'Coding & Computational Thinking', label: 'Coding & Computational Thinking', icon: '🤖' },
  { id: 'Life Skills & Good Habits', label: 'Life Skills & Good Habits', icon: '🌞' },
  { id: 'Emotions & Social Skills', label: 'Emotions & Social Skills', icon: '💛' },
  { id: 'Time & Calendar', label: 'Time & Calendar', icon: '📅' },
  { id: 'History & Culture', label: 'History & Culture', icon: '🏛️' },
  { id: 'Money & Financial Literacy', label: 'Money & Financial Literacy', icon: '🪙' },
  { id: 'Sports & Movement', label: 'Sports & Movement', icon: '⚽' },
  { id: 'Interactive Stories & Reading', label: 'Interactive Stories & Reading', icon: '📖' },
];

const progressKey = 'wonder-sprout-progress-v1';
const preferenceKey = 'wonder-sprout-preferences-v1';

function categorySlug(category: string) {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function subjectFromPath(path: string): Subject {
  const match = path.match(/^\/games\/category\/([^/?#]+)/);
  if (!match) return 'all';
  let slug = match[1];
  try { slug = decodeURIComponent(slug); } catch { /* Keep the route segment as-is. */ }
  return categories.find((category) => category.id !== 'all' && categorySlug(category.id) === slug)?.id ?? 'all';
}

function readPreferences(): { age: AgeBand; language: Language } | null {
  try {
    const saved = localStorage.getItem(preferenceKey);
    if (!saved) return null;
    const value = JSON.parse(saved) as { age?: AgeBand; language?: Language };
    if (!['3-5', '6-8', '9-12'].includes(value.age ?? '') || !['en', 'hi'].includes(value.language ?? '')) return null;
    return { age: value.age!, language: value.language! };
  } catch { return null; }
}

function pageFromPath(path: string): Page {
  if (path === '/games' || path.startsWith('/games/category/')) return 'games';
  return path.startsWith('/games/') ? 'game' : 'welcome';
}

function readProgress(): Progress {
  try {
    const saved = localStorage.getItem(progressKey);
    if (!saved) return { stars: 0, games: 0 };
    const parsed = JSON.parse(saved) as Partial<Progress>;
    return {
      stars: Math.max(0, Number(parsed.stars) || 0),
      games: Math.max(0, Number(parsed.games) || 0),
    };
  } catch {
    return { stars: 0, games: 0 };
  }
}

async function readJson<T>(response: Response): Promise<T> {
  const body = (await response.json()) as T & { message?: string };
  if (!response.ok) {
    throw new Error(body.message || 'Something went wobbly. Please try again.');
  }
  return body;
}

function badgeFor(stars: number) {
  if (stars >= 30) return { icon: '🌟', title: 'Superstar Scholar', next: null, target: 30 };
  if (stars >= 15) return { icon: '🌠', title: 'Shooting Star', next: 'Superstar Scholar', target: 30 };
  if (stars >= 5) return { icon: '🐛', title: 'Curious Caterpillar', next: 'Shooting Star', target: 15 };
  return { icon: '🌱', title: 'Little Sprout', next: 'Curious Caterpillar', target: 5 };
}

function emotionFace(prompt: string) {
  const clue = prompt.toLowerCase();
  if (clue.includes('teary')) return '😢';
  if (clue.includes('jumping') || clue.includes('smiling')) return '😄';
  if (clue.includes('loud bang')) return '😮';
  if (clue.includes('slow breath')) return '😌';
  if (clue.includes('busy place')) return '😟';
  return '💛';
}

export default function App() {
  const [page, setPage] = useState<Page>(() => !readPreferences() && window.location.pathname !== '/' ? 'welcome' : pageFromPath(window.location.pathname));
  const [language, setLanguage] = useState<Language>(() => readPreferences()?.language ?? 'en');
  const [setupAge, setSetupAge] = useState<AgeBand | ''>(() => readPreferences()?.age ?? '');
  const [games, setGames] = useState<Game[]>([]);
  const [gamesLoading, setGamesLoading] = useState(true);
  const [gamesError, setGamesError] = useState('');
  const [age, setAge] = useState<AgeBand>(() => readPreferences()?.age ?? '6-8');
  const [subject, setSubject] = useState<Subject>(() => subjectFromPath(window.location.pathname));
  const [showMoreGames, setShowMoreGames] = useState(false);
  const [progress, setProgress] = useState<Progress>(readProgress);
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [memoryCards, setMemoryCards] = useState<MemoryCard[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [answerResult, setAnswerResult] = useState<AnswerResult | null>(null);
  const [checkingAnswer, setCheckingAnswer] = useState(false);
  const [answerError, setAnswerError] = useState('');
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizError, setQuizError] = useState('');
  const [roundComplete, setRoundComplete] = useState(false);
  const [roundStars, setRoundStars] = useState(0);
  const [selectedTiles, setSelectedTiles] = useState<number[]>([]);
  const [adventureItems, setAdventureItems] = useState<string[]>([]);
  const answerLock = useRef(false);
  const roundRecorded = useRef(false);
  const cataloguePath = useRef('/games');

  function navigate(path: string, replace = false) {
    if (replace) window.history.replaceState({}, '', path);
    else if (window.location.pathname !== path) window.history.pushState({}, '', path);
    const nextPage = pageFromPath(path);
    setPage(nextPage);
    if (nextPage === 'games') {
      setSubject(subjectFromPath(path));
      setShowMoreGames(false);
    }
  }

  function choosePreferences() {
    if (!setupAge) return;
    const preferences = { age: setupAge, language };
    try { localStorage.setItem(preferenceKey, JSON.stringify(preferences)); } catch { /* Selection still works for this visit. */ }
    setAge(setupAge);
    navigate('/games');
  }

  useEffect(() => {
    const onPopState = () => {
      const nextPage = pageFromPath(window.location.pathname);
      setPage(nextPage);
      if (nextPage === 'games') setSubject(subjectFromPath(window.location.pathname));
      if (nextPage !== 'game') setActiveGame(null);
    };
    window.addEventListener('popstate', onPopState);
    if (!readPreferences() && window.location.pathname !== '/') {
      window.history.replaceState({}, '', '/');
      setPage('welcome');
    }
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === 'hi' ? 'hi' : 'en';
    const title = page === 'game' && activeGame
      ? localizedGame(language, activeGame).title
      : page === 'games' && subject !== 'all'
        ? `${localizedSubject(language, subject)} · WonderSprout`
        : language === 'hi' ? 'WonderSprout — खेलो, सीखो, बढ़ो!' : 'WonderSprout — Play, discover, grow!';
    document.title = title;
    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute('content', language === 'hi'
      ? '3 से 12 साल के बच्चों के लिए मज़ेदार खेल, पहेलियाँ और सीखने के रोमांच।'
      : 'A playful learning arcade with games and adventures for curious kids ages 3 to 12.');
  }, [language, page, activeGame, subject]);

  useEffect(() => {
    if (page === 'welcome') return undefined;
    let cancelled = false;
    fetch('/api/games')
      .then(readJson<Game[]>)
      .then((data) => {
        if (!cancelled) {
          setGames(data);
          setGamesLoading(false);
        }
      })
      .catch((error: Error) => {
        if (!cancelled) {
          setGamesError(error.message || 'The adventure map could not load.');
          setGamesLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [page]);

  useEffect(() => {
    if (!activeGame) return undefined;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeGame();
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [activeGame]);

  const filteredGames = games.filter((game) => (subject === 'all' || game.subject === subject) && game.ageBands.includes(age));
  const visibleGames = showMoreGames ? filteredGames : filteredGames.slice(0, 12);
  const rawCurrentQuestion = questions[questionIndex];
  const currentQuestion = rawCurrentQuestion && activeGame
    ? localizedQuestion(language, activeGame.subject, activeGame.id, rawCurrentQuestion)
    : rawCurrentQuestion;
  const usedTiles = new Set(selectedTiles);
  const currentAdventure = activeGame?.mode === 'adventure' ? adventureFor(activeGame, language) : undefined;
  const adventureScene = currentAdventure?.[questionIndex];
  const matchInstruction = tr(language, activeGame?.subject === 'Animals & Nature' ? 'Match the clue to the right home or nature answer.' : 'Read the clue, then tap or drag it to the matching card.');
  const searchInstruction = tr(language, activeGame?.subject === 'Animals & Nature' ? 'Look closely through the nature scene and tap what the clue describes.' : activeGame?.subject === 'Geography & World Explorer' ? 'Explore the travel scene and tap the place that fits the clue.' : activeGame?.subject === 'Life Skills & Good Habits' ? 'Look closely and tap the safe, helpful choice.' : 'Search the explorer scene and tap the answer to the clue.');
  const gentleRetryMode = activeGame?.mode === 'adventure' || activeGame?.mode === 'scavenger' || activeGame?.mode === 'puzzle';
  const currentAge = ageBands.find((band) => band.id === age)!;
  const badge = badgeFor(progress.stars);
  const priorMilestone = progress.stars >= 15 ? 15 : progress.stars >= 5 ? 5 : 0;
  const nextMilestone = badge.target;
  const badgeProgress = badge.next
    ? Math.min(100, ((progress.stars - priorMilestone) / (nextMilestone - priorMilestone)) * 100)
    : 100;
  const starsToNext = badge.next ? Math.max(0, badge.target - progress.stars) : 0;

  function updateProgress(transform: (previous: Progress) => Progress) {
    setProgress((previous) => {
      const next = transform(previous);
      try {
        localStorage.setItem(progressKey, JSON.stringify(next));
      } catch {
        // The game stays playable if this browser does not allow local storage.
      }
      return next;
    });
  }

  function finishSpecialGame() {
    if (roundRecorded.current) return;
    roundRecorded.current = true;
    setRoundStars(1);
    setRoundComplete(true);
    updateProgress((previous) => ({ ...previous, stars: previous.stars + 1, games: previous.games + 1 }));
  }

  function finishMemoryGame() {
    if (roundRecorded.current) return;
    roundRecorded.current = true;
    setRoundComplete(true);
    updateProgress((previous) => ({ ...previous, games: previous.games + 1 }));
  }

  async function startGame(game: Game, openRoute = true) {
    if (openRoute) {
      if (page !== 'game') cataloguePath.current = window.location.pathname;
      navigate(`/games/${game.id}`);
    }
    setActiveGame(game);
    setQuestions([]);
    setMemoryCards([]);
    setQuestionIndex(0);
    setSelectedChoice(null);
    setAnswerResult(null);
    setCheckingAnswer(false);
    setAnswerError('');
    setQuizError('');
    setQuizLoading(true);
    setRoundComplete(false);
    setRoundStars(0);
    setSelectedTiles([]);
    setAdventureItems([]);
    answerLock.current = false;
    roundRecorded.current = false;
    try {
      const localModes: GameMode[] = ['creative', 'coding', 'loop', 'sequence', 'missing', 'sudoku', 'monster', 'pixel', 'piano', 'rhythm', 'sound', 'sort', 'clock', 'shop', 'balance', 'maze3d', 'space3d'];
      if (localModes.includes(game.mode)) {
        setQuizLoading(false);
        return;
      }
      if (game.mode === 'memory') {
        const response = await fetch(`/api/games/${game.id}/memory-cards?ageBand=${age}`);
        setMemoryCards(await readJson<MemoryCard[]>(response));
      } else if (language === 'hi') {
        setQuestions(hindiQuestionRound(game.subject, game.id, age));
      } else {
        const response = await fetch(`/api/games/${game.id}/questions?ageBand=${age}`);
        setQuestions(await readJson<Question[]>(response));
      }
      setQuizLoading(false);
    } catch (error) {
      setQuizError(error instanceof Error ? error.message : 'This quest is taking a little nap.');
      setQuizLoading(false);
    }
  }

  useEffect(() => {
    if (page !== 'game' || activeGame || games.length === 0) return;
    const gameId = window.location.pathname.split('/')[2];
    const game = games.find((candidate) => candidate.id === gameId);
    if (game) void startGame(game, false);
    else navigate('/games', true);
  }, [page, games, activeGame]);

  function closeGame() {
    answerLock.current = false;
    setActiveGame(null);
    setQuestions([]);
    setMemoryCards([]);
    setAnswerResult(null);
    setSelectedChoice(null);
    setSelectedTiles([]);
    setQuizLoading(false);
    setRoundComplete(false);
    if (page === 'game') navigate(cataloguePath.current);
  }

  async function chooseAnswer(choice: string, originalChoice?: string) {
    if (!activeGame || !currentQuestion || answerLock.current || answerResult) return;
    answerLock.current = true;
    setSelectedChoice(choice);
    setCheckingAnswer(true);
    setAnswerError('');
    if (rawCurrentQuestion?.localized) {
      const selectedIndex = currentQuestion.choices.indexOf(choice);
      const correct = rawCurrentQuestion.answerValue !== undefined
        ? choice === rawCurrentQuestion.answerValue
        : selectedIndex === rawCurrentQuestion.answerIndex;
      setAnswerResult({
        correct,
        correctAnswer: rawCurrentQuestion.answerValue ?? currentQuestion.choices[rawCurrentQuestion.answerIndex ?? 0] ?? '',
        lesson: rawCurrentQuestion.lesson ?? '',
        encouragement: correct ? 'बहुत बढ़िया सोच!' : 'अच्छी कोशिश!',
      });
      setCheckingAnswer(false);
      if (correct) {
        setRoundStars((value) => value + 1);
        updateProgress((previous) => ({ ...previous, stars: previous.stars + 1 }));
      }
      return;
    }
    try {
      const displayChoiceIndex = currentQuestion.choices.indexOf(choice);
      const submittedChoice = originalChoice ?? (language === 'hi' && displayChoiceIndex >= 0
        ? rawCurrentQuestion?.choices[displayChoiceIndex] ?? choice
        : choice);
      const response = await fetch(`/api/games/${activeGame.id}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ageBand: age, questionId: currentQuestion.id, choice: submittedChoice }),
      });
      const result = await readJson<AnswerResult>(response);
      const answerIndex = rawCurrentQuestion?.choices.indexOf(result.correctAnswer) ?? -1;
      setAnswerResult({
        ...result,
        correctAnswer: answerIndex >= 0 && currentQuestion.choices[answerIndex] ? currentQuestion.choices[answerIndex] : tr(language, result.correctAnswer),
        lesson: localizedLesson(language, activeGame.subject, currentQuestion.id, result.lesson),
        encouragement: language === 'hi' ? result.correct ? 'बहुत बढ़िया सोच!' : 'अच्छी कोशिश!' : result.encouragement,
      });
      setCheckingAnswer(false);
      if (result.correct) {
        setRoundStars((value) => value + 1);
        updateProgress((previous) => ({ ...previous, stars: previous.stars + 1 }));
      }
    } catch (error) {
      setAnswerError(error instanceof Error ? error.message : 'Your answer could not be checked.');
      setCheckingAnswer(false);
      answerLock.current = false;
    }
  }

  function continueRound() {
    if (!activeGame) return;
    if (gentleRetryMode && answerResult && !answerResult.correct) {
      setSelectedChoice(null);
      setAnswerResult(null);
      setAnswerError('');
      answerLock.current = false;
      return;
    }
    if (activeGame.mode === 'adventure' && answerResult?.correct && adventureScene) {
      setAdventureItems((previous) => [...previous, adventureScene.reward]);
    }
    if (questionIndex + 1 >= questions.length) {
      setRoundComplete(true);
      if (!roundRecorded.current) {
        roundRecorded.current = true;
        updateProgress((previous) => ({ ...previous, games: previous.games + 1 }));
      }
      return;
    }
    setQuestionIndex((value) => value + 1);
    setSelectedChoice(null);
    setSelectedTiles([]);
    setAnswerResult(null);
    setCheckingAnswer(false);
    setAnswerError('');
    answerLock.current = false;
  }

  function retryAnswer() {
    if (selectedChoice) {
      const choice = selectedChoice;
      setSelectedChoice(null);
      answerLock.current = false;
      void chooseAnswer(choice);
    }
  }

  function chooseLetter(index: number) {
    if (checkingAnswer || answerResult || usedTiles.has(index)) return;
    setSelectedTiles((previous) => [...previous, index]);
  }

  function removeLetter(index: number) {
    if (checkingAnswer || answerResult) return;
    setSelectedTiles((previous) => previous.filter((tileIndex) => tileIndex !== index));
  }

  function submitWord() {
    if (!currentQuestion || selectedTiles.length !== currentQuestion.choices.length) return;
    const word = selectedTiles.map((index) => currentQuestion.choices[index]).join('');
    const originalWord = selectedTiles.map((index) => rawCurrentQuestion?.choices[index] ?? '').join('');
    void chooseAnswer(word, originalWord);
  }

  if (page === 'welcome') return <WelcomePage language={language} age={setupAge} onAge={setSetupAge} onLanguage={setLanguage} onContinue={choosePreferences} />;

  return (
    <>
      <a className="skip-link" href="#main" hidden={page === 'game'}>{tr(language, 'Skip to games')}</a>
      <header className="site-header" hidden={page === 'game'}>
        <a className="brand" href="#top" aria-label={tr(language, 'WonderSprout home')}>
          <span className="brand-mark" aria-hidden="true">✿</span>
          <span className="brand-name">wonder<span>sprout</span></span>
        </a>
        <nav className="main-nav" aria-label={tr(language, 'Main navigation')}>
          <a href="#adventures">{tr(language, 'Play zone')}</a>
          <a href="#rewards">{tr(language, 'My rewards')}</a>
          <a href="#grownups">{tr(language, 'For grown-ups')}</a>
          <a href="/" onClick={(event) => { event.preventDefault(); setSetupAge(age); navigate('/'); }}>{tr(language, 'Change age or language')}</a>
        </nav>
        <a className="header-stars" href="#rewards" aria-label={`${progress.stars} ${tr(language, 'stars collected')}`}>
          <span aria-hidden="true">⭐</span> {progress.stars} <span className="star-word">{language === 'hi' ? 'सितारे' : 'stars'}</span>
        </a>
      </header>

      <main id="main" hidden={page === 'game'}>
        <section className="hero section-wrap" id="top" hidden={subject !== 'all'}>
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> {tr(language, 'A happy place to learn')}</div>
            <h1>{tr(language, 'Big imaginations.')}<br /><span>{tr(language, 'Brilliant little wins.')}</span></h1>
            <p className="hero-description">{tr(language, 'Pick an age, choose an adventure, and let curiosity do the rest. Every little answer helps a big brain grow.')}</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#adventures">{tr(language, 'Let’s play')} <span aria-hidden="true">↗</span></a>
              <a className="text-link" href="#rewards">{tr(language, 'See my star garden')} <span aria-hidden="true">↓</span></a>
            </div>
            <div className="hero-footnote"><span aria-hidden="true">🌈</span> {tr(language, 'Made for curious kids ages 3–12')}</div>
          </div>
          <div className="hero-visual" aria-label="A friendly fox mascot surrounded by stars and flowers">
            <div className="hero-sun" />
            <div className="hero-orbit hero-orbit-one" />
            <div className="hero-orbit hero-orbit-two" />
            <div className="hero-character">🦊</div>
            <div className="floaty floaty-star">✦</div>
            <div className="floaty floaty-flower">🌼</div>
            <div className="floaty floaty-sparkle">✧</div>
            <div className="floaty floaty-leaf">🍃</div>
            <div className="hero-note"><span>{tr(language, 'Little steps')}</span><strong>{tr(language, 'BIG magic')}</strong><i>✦ ✦ ✦</i></div>
          </div>
        </section>

        <section className="adventures section-wrap" id="adventures">
          <div className="section-heading">
            <div>
              {subject !== 'all' && <a className="category-back-link" href="/games" onClick={(event) => { event.preventDefault(); navigate('/games'); }}>← {tr(language, 'All games')}</a>}
              <div className="eyebrow eyebrow-lilac"><span className="eyebrow-dot" /> {tr(language, 'Choose your quest')}</div>
              <h2>{subject === 'all' ? <>{tr(language, 'Where shall we')} <span>{tr(language, 'explore?')}</span></> : localizedSubject(language, subject)}</h2>
            </div>
            <p>{tr(language, 'Short, cheerful games made to match your growing brain.')}</p>
          </div>

          <div className="age-picker" role="group" aria-label="Choose an age group">
            <span className="picker-label">{tr(language, 'I’m in the')}</span>
            {ageBands.map((band) => (
              <button
                className={`age-option ${age === band.id ? 'selected' : ''}`}
                type="button"
                key={band.id}
                onClick={() => { setAge(band.id); setSetupAge(band.id); setShowMoreGames(false); try { localStorage.setItem(preferenceKey, JSON.stringify({ age: band.id, language })); } catch { /* The in-memory choice still applies. */ } }}
                aria-pressed={age === band.id}
              >
                <span aria-hidden="true">{band.icon}</span>
                <span className="age-option-copy"><strong>{language === 'hi' ? ageCopyHi[band.name] : band.name}</strong><small>{language === 'hi' ? ageCopyHi[band.label] : band.label}</small></span>
                {age === band.id && <span className="age-check" aria-hidden="true">✓</span>}
              </button>
            ))}
          </div>

          <aside className="game-toolbar category-sidebar" aria-label={tr(language, 'Game categories')}>
            <h3 className="category-sidebar-title">{tr(language, 'Game categories')}</h3>
            <nav className="category-tabs" aria-label={tr(language, 'Filter by subject')}>
              {categories.map((category) => (
                <a
                  href={category.id === 'all' ? '/games' : `/games/category/${categorySlug(category.id)}`}
                  key={category.id}
                  className={`category-tab ${subject === category.id ? 'active' : ''}`}
                  onClick={(event) => {
                    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                    event.preventDefault();
                    navigate(category.id === 'all' ? '/games' : `/games/category/${categorySlug(category.id)}`);
                  }}
                  aria-current={subject === category.id ? 'page' : undefined}
                >
                  <span aria-hidden="true">{category.icon}</span> {language === 'hi' ? subjectsHi[category.id] ?? category.label : category.label}
                </a>
              ))}
            </nav>
            <span className="round-length"><span aria-hidden="true">⏱</span> {language === 'hi' ? 'हर खेल 8–10 मिनट' : '8–10 min each'}</span>
          </aside>

          {gamesLoading && <div className="state-card" role="status"><span className="loading-sparkle">✦</span> {tr(language, 'Finding your adventures…')}</div>}
          {!gamesLoading && gamesError && (
            <div className="state-card state-error" role="alert">
              <span aria-hidden="true">🧭</span><div><strong>{tr(language, 'We can’t reach the adventure map yet.')}</strong><p>{gamesError} {tr(language, 'Start the Java API, then refresh the page.')}</p></div>
            </div>
          )}
          {!gamesLoading && !gamesError && (
            <div className="game-grid">
              {visibleGames.map((game, index) => (
                <article className={`game-card ${game.theme}`} key={game.id}>
                  <div className="card-topline"><span className="card-number">{language === 'hi' ? `खेल ${String(index + 1).padStart(2, '0')}` : `QUEST ${String(index + 1).padStart(2, '0')}`}</span><span className="card-age">{language === 'hi' ? ageCopyHi[currentAge.label] : currentAge.label}</span></div>
                  <div className="game-art" aria-hidden="true">
                    <span className="art-halo" />
                    <span className="game-icon">{game.icon}</span>
                    <span className="art-sparkle art-sparkle-a">✦</span>
                    <span className="art-sparkle art-sparkle-b">✧</span>
                  </div>
                  <div className="game-info">
                    <span className="game-subject">{localizedSubject(language, game.subject)}</span>
                    <h3>{localizedGame(language, game).title}</h3>
                    <p>{localizedGame(language, game).description}</p>
                    <div className="card-bottom">
                      <span className="game-time"><span aria-hidden="true">◷</span> {language === 'hi' ? '8–10 मिनट' : '8–10 min'}</span>
                      <button className="play-button" type="button" onClick={() => void startGame(game)} aria-label={`${tr(language, 'Play')} ${localizedGame(language, game).title}`}>
                        {tr(language, 'Play')} <span aria-hidden="true">→</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
              {filteredGames.length === 0 && <div className="state-card">{tr(language, 'There are no games in this category for this age band yet. Choose another age group or category.')} 🌱</div>}
            </div>
          )}
          {!gamesLoading && !gamesError && filteredGames.length > 12 && (
            <div className="show-games-wrap"><button className="show-games-button" type="button" onClick={() => setShowMoreGames((value) => !value)}>{showMoreGames ? `${tr(language, 'Show fewer games')} ↑` : language === 'hi' ? `सभी ${filteredGames.length} खेल देखें ↓` : `Browse all ${filteredGames.length} games ↓`}</button></div>
          )}
        </section>

        <section className="rewards-section section-wrap" id="rewards">
          <div className="rewards-card">
            <div className="rewards-copy">
              <div className="eyebrow eyebrow-mint"><span className="eyebrow-dot" /> {tr(language, 'Your own little wins')}</div>
              <h2>{tr(language, 'Look how you’re')} <span>{tr(language, 'growing!')}</span></h2>
              <p>{tr(language, 'Every correct answer adds a star. Keep exploring to unlock your next garden badge.')}</p>
              <div className="reward-stats">
                <div className="reward-stat"><span className="stat-icon star-icon">⭐</span><span><strong>{progress.stars}</strong><small>{tr(language, 'stars collected')}</small></span></div>
                <div className="stat-divider" />
                <div className="reward-stat"><span className="stat-icon game-icon-small">🎮</span><span><strong>{progress.games}</strong><small>{tr(language, 'quests finished')}</small></span></div>
              </div>
            </div>
            <div className="badge-panel">
              <div className="badge-orbit"><span className="badge-icon" aria-hidden="true">{badge.icon}</span><span className="badge-spark badge-spark-one">✦</span><span className="badge-spark badge-spark-two">✧</span></div>
              <div className="badge-caption"><span>{tr(language, 'Your garden badge')}</span><strong>{language === 'hi' ? ({ 'Superstar Scholar': 'सुपरस्टार विद्वान', 'Shooting Star': 'टूटता सितारा', 'Curious Caterpillar': 'जिज्ञासु इल्ली', 'Little Sprout': 'नन्हा अंकुर' } as Record<string, string>)[badge.title] : badge.title}</strong></div>
              <div className="badge-progress" aria-label={badge.next ? `${starsToNext} more stars until ${badge.next}` : 'All badges unlocked'}>
                <div className="badge-progress-track"><span style={{ width: `${badgeProgress}%` }} /></div>
                <small>{badge.next ? language === 'hi' ? `अगले ${tr(language, badge.next)} बैज के लिए ${starsToNext} सितारे और चाहिए` : `${starsToNext} more ${starsToNext === 1 ? 'star' : 'stars'} to ${badge.next}` : tr(language, 'All badges unlocked — amazing!')}</small>
              </div>
            </div>
          </div>
        </section>

        <section className="grownups section-wrap" id="grownups">
          <div className="grownup-icon" aria-hidden="true">💛</div>
          <div className="grownup-copy"><span className="grownup-kicker">{tr(language, 'A note for grown-ups')}</span><p>{tr(language, 'WonderSprout keeps play simple: no account needed, and your child’s stars stay in this browser.')}</p></div>
          <span className="grownup-sprout" aria-hidden="true">🌿</span>
        </section>
      </main>

      <footer className="site-footer section-wrap" hidden={page === 'game'}>
        <a className="brand footer-brand" href="#top"><span className="brand-mark" aria-hidden="true">✿</span><span className="brand-name">wonder<span>sprout</span></span></a>
        <span>{tr(language, 'Play a little. Learn a lot.')} <span aria-hidden="true">✦</span></span>
        <a href="#top" className="back-top">{tr(language, 'Back to top')} ↑</a>
      </footer>

      {page === 'game' && !activeGame && <div className="game-page-loading"><span>{tr(language, 'Opening your game…')}</span><button type="button" onClick={closeGame}>{tr(language, 'Back to games')}</button></div>}
      {activeGame && (
        <div className={page === 'game' ? 'game-page-screen' : 'modal-backdrop'} onMouseDown={(event) => { if (page !== 'game' && event.target === event.currentTarget) closeGame(); }}>
          <section className="game-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
            {page === 'game' && <button className="game-back-button" type="button" onClick={closeGame}>← {tr(language, 'Back to games')}</button>}
            <button className="dialog-close" type="button" onClick={closeGame} aria-label={tr(language, 'Close game')}>×</button>
            <div className="dialog-heading">
              <span className={`dialog-game-icon ${activeGame.theme}`} aria-hidden="true">{activeGame.icon}</span>
              <div><span className="dialog-kicker">{localizedSubject(language, activeGame.subject)} · {tr(language, currentAge.label)}</span><h2 id="dialog-title">{roundComplete ? tr(language, 'Quest complete!') : localizedGame(language, activeGame).title}</h2></div>
            </div>

            {quizLoading && <div className="quiz-message" role="status"><span className="loading-sparkle">✦</span> {tr(language, 'Getting your questions ready…')}</div>}
            {!quizLoading && quizError && <div className="quiz-message quiz-error" role="alert"><span aria-hidden="true">🌧️</span><p>{quizError}</p><button type="button" className="button button-primary" onClick={() => void startGame(activeGame)}>{tr(language, 'Try again')}</button></div>}

            {!quizLoading && !quizError && roundComplete && (
              <div className="finish-screen">
                <div className="finish-confetti" aria-hidden="true">✨ 🌼 🎉 ⭐ ✨</div>
                <div className="finish-score">⭐ <strong>{roundStars}</strong></div>
                <h3>{tr(language, 'Wonderful work, explorer!')}</h3>
                <p>{activeGame.mode === 'adventure' ? language === 'hi' ? `तुमने ${questions.length} जगहें देखीं और ${adventureItems.length} खज़ाने पाए। हर संकेत से कुछ नया सीखा।` : `You explored all ${questions.length} places and collected ${adventureItems.length} treasures. Every clue helped you learn.` : activeGame.mode === 'memory' ? language === 'hi' ? `तुमने ${memoryCards.length / 2} जोड़े ढूँढ़े। तुम्हारी याददाश्त कमाल की है!` : `You found every pair in ${memoryCards.length / 2} matches. Your memory did a great job!` : activeGame.mode === 'creative' || activeGame.mode === 'monster' || activeGame.mode === 'pixel' ? tr(language, 'Your imagination made something wonderful. Come back and create something new!') : activeGame.mode === 'coding' || activeGame.mode === 'loop' ? tr(language, 'Your command sequence guided the critter all the way home. Nice debugging!') : language === 'hi' ? `तुमने ${localizedGame(language, activeGame).title} चुनौती पूरी की। हर कोशिश से कुछ नया सीखा।` : `You finished your ${activeGame.title} challenge. Every try helped you learn.`}</p>
                <div className="finish-actions"><button className="button button-primary" type="button" onClick={() => void startGame(activeGame)}>{tr(language, 'Play again')} <span aria-hidden="true">↻</span></button><button className="button button-quiet" type="button" onClick={closeGame}>{tr(language, 'Choose another quest')}</button></div>
              </div>
            )}

            {!quizLoading && !quizError && !roundComplete && activeGame.mode === 'memory' && (
              <MemoryBoard
                cards={memoryCards}
                age={age}
                language={language}
                onPairFound={() => {
                  setRoundStars((value) => value + 1);
                  updateProgress((previous) => ({ ...previous, stars: previous.stars + 1 }));
                }}
                onFinish={finishMemoryGame}
              />
            )}

            {!quizLoading && !quizError && !roundComplete && activeGame.mode === 'creative' && (
              <DoodleStudio age={age} language={language} onFinish={finishSpecialGame} />
            )}

            {!quizLoading && !quizError && !roundComplete && activeGame.mode === 'coding' && (
              <CodeCritters age={age} language={language} onFinish={finishSpecialGame} loopMode={false} />
            )}

            {!quizLoading && !quizError && !roundComplete && activeGame.mode === 'loop' && (
              <CodeCritters age={age} language={language} onFinish={finishSpecialGame} loopMode />
            )}

            {!quizLoading && !quizError && !roundComplete && activeGame.mode === 'sequence' && (
              <SequenceGame title={activeGame.title} age={age} language={language} onFinish={finishSpecialGame} />
            )}

            {!quizLoading && !quizError && !roundComplete && activeGame.mode === 'missing' && (
              <MissingObjectGame age={age} language={language} onFinish={finishSpecialGame} />
            )}

            {!quizLoading && !quizError && !roundComplete && activeGame.mode === 'sudoku' && (
              <SudokuGame language={language} onFinish={finishSpecialGame} />
            )}

            {!quizLoading && !quizError && !roundComplete && activeGame.mode === 'monster' && (
              <MonsterStudio language={language} onFinish={finishSpecialGame} />
            )}

            {!quizLoading && !quizError && !roundComplete && activeGame.mode === 'pixel' && (
              <PixelArt language={language} onFinish={finishSpecialGame} />
            )}

            {!quizLoading && !quizError && !roundComplete && activeGame.mode === 'piano' && (
              <MiniPiano language={language} onFinish={finishSpecialGame} />
            )}

            {!quizLoading && !quizError && !roundComplete && activeGame.mode === 'rhythm' && (
              <RhythmGame age={age} language={language} onFinish={finishSpecialGame} />
            )}

            {!quizLoading && !quizError && !roundComplete && activeGame.mode === 'sound' && (
              <SoundGuessGame title={activeGame.title} age={age} language={language} onFinish={finishSpecialGame} />
            )}

            {!quizLoading && !quizError && !roundComplete && activeGame.mode === 'sort' && (
              <SortGame title={activeGame.title} language={language} onFinish={finishSpecialGame} />
            )}

            {!quizLoading && !quizError && !roundComplete && activeGame.mode === 'clock' && (
              <ClockGame age={age} language={language} onFinish={finishSpecialGame} />
            )}

            {!quizLoading && !quizError && !roundComplete && activeGame.mode === 'shop' && (
              <ShopGame age={age} title={activeGame.title} language={language} onFinish={finishSpecialGame} />
            )}

            {!quizLoading && !quizError && !roundComplete && activeGame.mode === 'balance' && (
              <BalanceGame language={language} onFinish={finishSpecialGame} />
            )}

            {!quizLoading && !quizError && !roundComplete && (activeGame.mode === 'maze3d' || activeGame.mode === 'space3d') && (
              <Suspense fallback={<div className="quiz-message" role="status">{tr(language, 'Loading your 3D adventure…')}</div>}>
                <ThreeArcade mode={activeGame.mode} age={age} language={language} onFinish={finishSpecialGame} />
              </Suspense>
            )}

            {!quizLoading && !quizError && !roundComplete && currentQuestion && (
              <>
                <div className="question-progress">
                  <div className="question-progress-track"><span style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }} /></div>
                <span>{tr(language, activeGame.mode === 'adventure' ? 'Trail stop' : 'Question')} {questionIndex + 1} / {questions.length}</span>
                </div>
                {activeGame.mode === 'adventure' && adventureScene && currentAdventure && (
                  <div className={`adventure-panel ${activeGame.id}`}>
                    <div className="adventure-trail" aria-label={`Adventure progress: stop ${questionIndex + 1} of ${currentAdventure.length}`}>
                      {currentAdventure.map((scene, index) => (
                        <span className={`adventure-node ${index < questionIndex ? 'node-done' : ''} ${index === questionIndex ? 'node-active' : ''}`} key={scene.place} aria-current={index === questionIndex ? 'step' : undefined}>
                          <span>{scene.node}</span>
                        </span>
                      ))}
                    </div>
                    <div className="adventure-vignette">
                      <span className="adventure-landmark" aria-hidden="true">{adventureScene.landmark}</span>
                      <div><span className="adventure-location">{language === 'hi' ? `पड़ाव ${questionIndex + 1} · ${tr(language, adventureScene.place)}` : `STOP ${questionIndex + 1} · ${adventureScene.place}`}</span><p>{tr(language, adventureScene.story)}</p></div>
                    </div>
                    <div className="adventure-backpack"><span className="backpack-label">🎒 {tr(language, 'Backpack')}</span>{adventureItems.length ? adventureItems.map((item) => <span className="backpack-item" key={item}>{tr(language, item)}</span>) : <span className="backpack-empty">{tr(language, 'Ready for treasures!')}</span>}</div>
                  </div>
                )}
                <div className="question-box">
                  <span className="question-spark" aria-hidden="true">✦</span>
                  <p className="question-prompt">{currentQuestion.prompt}</p>
                  <p className="question-hint"><span aria-hidden="true">💡</span> {currentQuestion.hint}</p>
                </div>
                {activeGame.mode === 'emotion' && (
                  <div className="emotion-prompt" aria-label={tr(language, 'Friendly feelings clue')}><span aria-hidden="true">{emotionFace(currentQuestion.prompt)}</span><p>{tr(language, 'Feelings can look different for everyone. Pick the answer that best fits the clue.')}</p></div>
                )}
                {activeGame.mode === 'readaloud' && (
                  <div className="readaloud-card"><span aria-hidden="true">📖</span><p>{language === 'hi' ? 'मीना ने छाता लिया क्योंकि आसमान में काले बादल छाए थे। उसने हाथ हिलाकर विदा कहा और बस स्टॉप की ओर जल्दी चली।' : 'Mina packed an umbrella because dark clouds filled the sky. She waved goodbye and hurried to the bus stop.'}</p><button type="button" className="small-game-button" onClick={() => { if ('speechSynthesis' in window) { window.speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(language === 'hi' ? 'मीना ने छाता लिया क्योंकि आसमान में काले बादल छाए थे। उसने हाथ हिलाकर विदा कहा और बस स्टॉप की ओर जल्दी चली।' : 'Mina packed an umbrella because dark clouds filled the sky. She waved goodbye and hurried to the bus stop.'); utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US'; window.speechSynthesis.speak(utterance); } }}>{tr(language, 'Read the story aloud')}</button></div>
                )}
                {activeGame.mode === 'spell' && (
                  <div className="word-builder" aria-label={tr(language, 'Build the word from letter tiles')}>
                    <div className="word-slots" aria-label={language === 'hi' ? `तुम्हारा शब्द: ${selectedTiles.map((index) => currentQuestion.choices[index]).join('') || 'खाली'}` : `Your word so far: ${selectedTiles.map((index) => currentQuestion.choices[index]).join('') || 'empty'}`}>
                      {currentQuestion.choices.map((_, index) => {
                        const tileIndex = selectedTiles[index];
                        return tileIndex === undefined
                          ? <span className="word-slot" key={`slot-${index}`} aria-hidden="true">·</span>
                          : <button className="word-slot filled" type="button" key={`slot-${index}`} onClick={() => removeLetter(tileIndex)} disabled={checkingAnswer || !!answerResult} aria-label={language === 'hi' ? `${currentQuestion.choices[tileIndex]} हटाएँ` : `Remove ${currentQuestion.choices[tileIndex]}`}>
                              {currentQuestion.choices[tileIndex]}
                            </button>;
                      })}
                    </div>
                    <div className="letter-tiles" role="group" aria-label={tr(language, 'Letter tiles')}>
                      {currentQuestion.choices.map((letter, index) => (
                        <button className={`letter-tile ${usedTiles.has(index) ? 'tile-used' : ''}`} key={`tile-${index}`} type="button" onClick={() => chooseLetter(index)} disabled={usedTiles.has(index) || checkingAnswer || !!answerResult} aria-label={language === 'hi' ? `${letter} अक्षर चुनें` : `Use letter ${letter}`}>
                          {letter}
                        </button>
                      ))}
                    </div>
                    <div className="word-actions">
                      <button className="word-reset" type="button" onClick={() => setSelectedTiles([])} disabled={selectedTiles.length === 0 || checkingAnswer || !!answerResult}>{tr(language, 'Start over')}</button>
                      <button className="button button-primary word-check" type="button" onClick={submitWord} disabled={selectedTiles.length !== currentQuestion.choices.length || checkingAnswer || !!answerResult}>{tr(language, 'Check my word')} <span aria-hidden="true">✓</span></button>
                    </div>
                  </div>
                )}

                {activeGame.mode === 'bubble' && (
                  <div className="bubble-game">
                    <p className="mini-game-instruction">{tr(language, 'Tap the right answer bubble to pop it!')}</p>
                    <div className="bubble-board" role="group" aria-label="Answer bubbles">
                      {currentQuestion.choices.map((choice, index) => (
                        <button className={`answer-bubble ${answerResult && selectedChoice === choice ? (answerResult.correct ? 'bubble-popped' : 'bubble-missed') : ''}`} key={`${choice}-${index}`} type="button" disabled={checkingAnswer || !!answerResult} onClick={() => void chooseAnswer(choice)} aria-label={`Pop answer ${choice}`}>
                          <span>{choice}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {activeGame.mode === 'match' && (
                  <div className="habitat-game">
                    <p className="mini-game-instruction">{matchInstruction}</p>
                    <div className="creature-launchpad">
                      <div className="creature-token" draggable={!answerResult && !checkingAnswer} onDragStart={(event) => event.dataTransfer.setData('text/plain', currentQuestion.id)} aria-label={`Draggable clue: ${currentQuestion.prompt}`}>
                        🔎
                      </div>
                      <span>{tr(language, 'Find the match!')}</span>
                      <span className="creature-arrow" aria-hidden="true">→</span>
                    </div>
                    <div className="habitat-list" role="group" aria-label="Choose a matching card">
                      {currentQuestion.choices.map((choice, index) => {
                        const [icon, ...words] = choice.split(' ');
                        return (
                          <button className={`habitat-card habitat-${index + 1} ${answerResult && selectedChoice === choice ? (answerResult.correct ? 'habitat-right' : 'habitat-wrong') : ''}`} key={choice} type="button" disabled={checkingAnswer || !!answerResult} onClick={() => void chooseAnswer(choice)} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); void chooseAnswer(choice); }}>
                            <span className="habitat-icon" aria-hidden="true">{icon}</span>
                            <strong>{words.join(' ')}</strong>
                            <span className="habitat-drop">{tr(language, 'Drop here')}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activeGame.mode === 'puzzle' && (
                  <div className="pattern-puzzle">
                    <p className="mini-game-instruction">{tr(language, 'Find the missing piece and complete the pattern!')}</p>
                    <div className="puzzle-piece-slot" aria-label="Missing pattern piece"><span>?</span></div>
                    <div className="puzzle-choices" role="group" aria-label="Choose a puzzle piece">
                      {currentQuestion.choices.map((choice, index) => (
                        <button className={`puzzle-piece puzzle-piece-${index + 1} ${answerResult && selectedChoice === choice ? (answerResult.correct ? 'piece-right' : 'piece-wrong') : ''}`} key={`${choice}-${index}`} type="button" disabled={checkingAnswer || !!answerResult} onClick={() => void chooseAnswer(choice)}>
                          <span className="piece-number">{String.fromCharCode(65 + index)}</span>{choice}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {activeGame.mode === 'scavenger' && (
                  <div className="wildlife-game">
                    <p className="mini-game-instruction">{searchInstruction}</p>
                    <div className="wildlife-scene" role="group" aria-label="Search the scene">
                      <span className="wildlife-scene-label">🌿 {language === 'hi' ? activeGame.subject === 'Animals & Nature' ? `प्रकृति की बातें · ${age === '3-5' ? 'बगीचा' : age === '6-8' ? 'जंगल' : 'वन्यजीव अभयारण्य'}` : activeGame.subject === 'Geography & World Explorer' ? 'यात्रा की बातें · दुनिया की खोज' : activeGame.subject === 'Life Skills & Good Habits' ? 'सुरक्षा की बातें · रोज़मर्रा के विकल्प' : 'खोजकर्ता की बातें · ध्यान से देखो' : activeGame.subject === 'Animals & Nature' ? `NATURE NOTES · ${age === '3-5' ? 'GARDEN' : age === '6-8' ? 'WOODLAND' : 'WILDLIFE RESERVE'}` : activeGame.subject === 'Geography & World Explorer' ? 'TRAVEL NOTES · WORLD EXPLORER' : activeGame.subject === 'Life Skills & Good Habits' ? 'SAFETY NOTES · EVERYDAY CHOICES' : 'EXPLORER NOTES · LOOK CLOSELY'}</span>
                      <div className="wildlife-animals">
                        {currentQuestion.choices.map((choice, index) => {
                          const [icon, ...words] = choice.split(' ');
                          return (
                            <button className={`wildlife-animal wildlife-animal-${index + 1} ${answerResult && selectedChoice === choice ? (answerResult.correct ? 'animal-found' : 'animal-missed') : ''}`} key={choice} type="button" disabled={checkingAnswer || !!answerResult} onClick={() => void chooseAnswer(choice)} aria-label={`Search ${words.join(' ')}`}>
                              <span>{icon}</span><strong>{words.join(' ')}</strong>
                            </button>
                          );
                        })}
                      </div>
                      <span className="wildlife-grass" aria-hidden="true">🌱　🍃　🌿　🍀　🌱</span>
                    </div>
                  </div>
                )}

                {(activeGame.mode === 'quiz' || activeGame.mode === 'adventure' || activeGame.mode === 'emotion' || activeGame.mode === 'readaloud') && (
                  <div className="answer-options" role="group" aria-label="Choose an answer">
                    {currentQuestion.choices.map((choice, index) => (
                      <button
                        className={`answer-option ${selectedChoice === choice ? 'chosen' : ''} ${answerResult && selectedChoice === choice ? (answerResult.correct ? 'is-correct' : 'is-incorrect') : ''}`}
                        key={`${choice}-${index}`}
                        type="button"
                        disabled={checkingAnswer || !!answerResult}
                        onClick={() => void chooseAnswer(choice)}
                      >
                        <span className="answer-letter">{String.fromCharCode(65 + index)}</span>{choice}
                        {answerResult && selectedChoice === choice && <span className="answer-mark" aria-hidden="true">{answerResult.correct ? '✓' : '↻'}</span>}
                      </button>
                    ))}
                  </div>
                )}
                {checkingAnswer && <p className="checking-note" role="status">{tr(language, 'Checking your answer…')}</p>}
                {answerError && <div className="answer-feedback feedback-wrong" role="alert"><span aria-hidden="true">🌱</span><div><strong>{tr(language, 'Let’s try that again.')}</strong><p>{answerError}</p></div><button className="feedback-continue" type="button" onClick={retryAnswer}>{tr(language, 'Retry')}</button></div>}
                {answerResult && (
                  <div className={`answer-feedback ${answerResult.correct ? 'feedback-right' : 'feedback-wrong'}`} role="status" aria-live="polite">
                    <span aria-hidden="true">{answerResult.correct ? '🎉' : '🌱'}</span>
                    <div><strong>{gentleRetryMode && !answerResult.correct ? tr(language, activeGame.mode === 'adventure' ? 'Not quite, adventurer—have another try!' : 'Good try! Take another look at the clue.') : answerResult.encouragement}</strong><p>{answerResult.correct ? answerResult.lesson : gentleRetryMode ? tr(language, 'You can try again. Use the clue above and keep exploring.') : <>{tr(language, 'The answer is')} <b>{answerResult.correctAnswer}</b>. {answerResult.lesson}</>}</p></div>
                    {answerResult.correct && <span className="feedback-star" aria-label="One star earned">+1 ⭐</span>}
                    <button className="feedback-continue" type="button" onClick={continueRound}>{gentleRetryMode && !answerResult.correct ? tr(language, 'Try again') : questionIndex + 1 === questions.length ? tr(language, activeGame.mode === 'adventure' ? 'Finish quest' : 'Finish') : tr(language, activeGame.mode === 'adventure' ? 'Go onward' : 'Next')} <span aria-hidden="true">→</span></button>
                  </div>
                )}
                <div className="dialog-footer"><span><span aria-hidden="true">⭐</span> {roundStars} {language === 'hi' ? 'सितारे' : roundStars === 1 ? 'star' : 'stars'} {tr(language, 'this quest')}</span><span>{tr(language, 'Keep trying — that’s how brains grow!')}</span></div>
              </>
            )}
          </section>
        </div>
      )}
    </>
  );
}

function MemoryBoard({ cards, age, language, onPairFound, onFinish }: { cards: MemoryCard[]; age: AgeBand; language: Language; onPairFound: () => void; onFinish: () => void }) {
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [fact, setFact] = useState(tr(language, 'Find two cards with the same picture.'));
  const locked = useRef(false);
  const timeout = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timeout.current), []);

  function flip(card: MemoryCard) {
    if (locked.current || flipped.includes(card.id) || matched.includes(card.pairKey)) return;
    const next = [...flipped, card.id];
    setFlipped(next);
    if (next.length < 2) return;
    setMoves((value) => value + 1);
    const first = cards.find((candidate) => candidate.id === next[0]);
    const second = cards.find((candidate) => candidate.id === next[1]);
    if (!first || !second) return;
    locked.current = true;
    if (first.pairKey === second.pairKey) {
      const nextMatched = [...matched, first.pairKey];
      timeout.current = window.setTimeout(() => {
        setMatched(nextMatched);
        setFlipped([]);
        setFact(`${tr(language, first.label)}: ${tr(language, first.fact)}`);
        onPairFound();
        locked.current = false;
        if (nextMatched.length === cards.length / 2) onFinish();
      }, 350);
    } else {
      timeout.current = window.setTimeout(() => {
        setFlipped([]);
        locked.current = false;
      }, 800);
    }
  }

  return (
    <div className="memory-game">
      <div className="memory-heading"><div><strong>{tr(language, 'Flip & Find')}</strong><p>{tr(language, 'Turn over two cards and remember what you see.')}</p></div><span className="memory-moves">🔄 {moves} {tr(language, moves === 1 ? 'move' : 'moves')}</span></div>
      <div className={`memory-grid memory-grid-${age.replace('-', '')}`} role="group" aria-label="Memory cards">
        {cards.map((card) => {
          const faceUp = flipped.includes(card.id) || matched.includes(card.pairKey);
          const isMatched = matched.includes(card.pairKey);
          return (
            <button className={`memory-card ${faceUp ? 'memory-face-up' : ''} ${isMatched ? 'memory-matched' : ''}`} key={card.id} type="button" onClick={() => flip(card)} disabled={isMatched || (flipped.length >= 2 && !faceUp)} aria-label={faceUp ? `${tr(language, card.label)}${isMatched ? `, ${tr(language, 'matched')}` : `, ${tr(language, 'revealed')}`}` : tr(language, 'Face-down memory card')} aria-pressed={faceUp}>
              {faceUp ? <><span className="memory-face">{card.face}</span><small>{tr(language, card.label)}</small></> : <span className="memory-back" aria-hidden="true">✿</span>}
            </button>
          );
        })}
      </div>
      <div className="memory-fact" role="status"><span aria-hidden="true">💡</span><span>{fact}</span><strong>{matched.length} / {cards.length / 2} {tr(language, 'pairs')}</strong></div>
    </div>
  );
}

function DoodleStudio({ age, language, onFinish }: { age: AgeBand; language: Language; onFinish: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [color, setColor] = useState('#fa765e');
  const [brush, setBrush] = useState(9);
  const [promptIndex, setPromptIndex] = useState(0);
  const prompts = artPrompts[age];
  const colors = ['#fa765e', '#f3bb44', '#55a67f', '#5c9bd4', '#9772d4', '#293b59', '#f397ba', '#ffffff'];

  function canvasPoint(event: ReactPointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!;
    const bounds = canvas.getBoundingClientRect();
    return { x: (event.clientX - bounds.left) * canvas.width / bounds.width, y: (event.clientY - bounds.top) * canvas.height / bounds.height };
  }

  function startDrawing(event: ReactPointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!;
    const context = canvas.getContext('2d');
    if (!context) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drawing.current = true;
    const point = canvasPoint(event);
    context.beginPath();
    context.moveTo(point.x, point.y);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = color;
    context.lineWidth = brush;
    context.lineTo(point.x + .1, point.y + .1);
    context.stroke();
  }

  function draw(event: ReactPointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const canvas = canvasRef.current!;
    const context = canvas.getContext('2d');
    if (!context) return;
    const point = canvasPoint(event);
    context.strokeStyle = color;
    context.lineWidth = brush;
    context.lineTo(point.x, point.y);
    context.stroke();
  }

  function stopDrawing() {
    drawing.current = false;
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (canvas && context) context.clearRect(0, 0, canvas.width, canvas.height);
  }

  function savePicture() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'my-wondersprout-art.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  return (
    <div className="doodle-studio">
      <div className="art-prompt"><span aria-hidden="true">✨</span><div><small>{tr(language, 'YOUR CREATIVE MISSION')}</small><strong>{tr(language, prompts[promptIndex % prompts.length])}</strong></div><button type="button" onClick={() => setPromptIndex((value) => value + 1)} aria-label={tr(language, 'Get a different drawing idea')}>{tr(language, 'New idea')} ↻</button></div>
      <canvas ref={canvasRef} className="doodle-canvas" width={900} height={470} aria-label={tr(language, 'Drawing canvas. Use a mouse, finger, or stylus to draw.')} onPointerDown={startDrawing} onPointerMove={draw} onPointerUp={stopDrawing} onPointerCancel={stopDrawing} />
      <div className="art-tools">
        <div className="color-palette" role="group" aria-label={tr(language, 'Choose a drawing color')}>{colors.map((choice) => <button className={`color-dot ${color === choice ? 'color-selected' : ''}`} key={choice} type="button" style={{ backgroundColor: choice }} onClick={() => setColor(choice)} aria-label={choice === '#ffffff' ? tr(language, 'Eraser') : `${tr(language, 'Color')} ${choice}`} aria-pressed={color === choice} />)}</div>
        <label className="brush-control">{tr(language, 'Brush')} <input type="range" min="3" max="24" value={brush} onChange={(event) => setBrush(Number(event.target.value))} aria-label={tr(language, 'Brush size')} /></label>
        <button className="art-utility" type="button" onClick={clearCanvas}>{tr(language, 'Clear')}</button>
      </div>
      <div className="art-actions"><span>{tr(language, 'Draw with a mouse, finger, or stylus. Your picture stays on this device.')}</span><div><button className="button button-quiet" type="button" onClick={savePicture}>{tr(language, 'Save picture ↓')}</button><button className="button button-primary" type="button" onClick={onFinish}>{tr(language, 'I’m finished')} <span aria-hidden="true">✓</span></button></div></div>
    </div>
  );
}

function CodeCritters({ age, language, onFinish, loopMode = false }: { age: AgeBand; language: Language; onFinish: () => void; loopMode?: boolean }) {
  const level = codingLevels[age];
  const [program, setProgram] = useState<string[]>([]);
  const [position, setPosition] = useState<Point>(level.start);
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState('Add arrow blocks, then run your program.');
  const runLock = useRef(false);

  function addCommand(id: string) {
    if (running || program.length >= level.maxBlocks) return;
    setProgram((previous) => [...previous, id]);
  }

  function addLoop() {
    if (running || program.length === 0 || program.length >= level.maxBlocks || program[program.length - 1] === 'loop') return;
    setProgram((previous) => [...previous, 'loop']);
  }

  function resetProgram() {
    if (running) return;
    setProgram([]);
    setPosition(level.start);
    setMessage('Add arrow blocks, then run your program.');
  }

  async function runProgram() {
    if (running || runLock.current || program.length === 0) {
      if (program.length === 0) setMessage('Add at least one arrow block first.');
      return;
    }
    runLock.current = true;
    setRunning(true);
    setPosition(level.start);
    setMessage('Running your instructions…');
    let nextPosition: Point = [...level.start];
    const expandedProgram = program.flatMap((commandId, index) => commandId === 'loop' ? [program[index - 1], program[index - 1]] : [commandId]).filter((id): id is string => !!id && id !== 'loop');
    for (const commandId of expandedProgram) {
      await new Promise((resolve) => window.setTimeout(resolve, 360));
      const command = codingCommands.find((candidate) => candidate.id === commandId)!;
      const [x, y] = nextPosition;
      const next: Point = [x + command.dx, y + command.dy];
      if (next[0] < 0 || next[1] < 0 || next[0] >= level.size || next[1] >= level.size) {
        setMessage('Oops, that step went off the path. Edit your blocks and try again!');
        setRunning(false);
        runLock.current = false;
        return;
      }
      if (level.walls.includes(`${next[0]},${next[1]}`)) {
        setMessage('A rock is in the way. Change your instructions and try a new route!');
        setRunning(false);
        runLock.current = false;
        return;
      }
      nextPosition = next;
      setPosition(next);
      if (next[0] === level.goal[0] && next[1] === level.goal[1]) {
        setMessage('You found the snack! Your sequence worked!');
        setRunning(false);
        runLock.current = false;
        onFinish();
        return;
      }
    }
    setMessage('The critter is safe, but not home yet. Change or add a block and try again.');
    setRunning(false);
    runLock.current = false;
  }

  const cells = Array.from({ length: level.size * level.size }, (_, index) => {
    const x = index % level.size;
    const y = Math.floor(index / level.size);
    const isStart = x === level.start[0] && y === level.start[1];
    const isGoal = x === level.goal[0] && y === level.goal[1];
    const isWall = level.walls.includes(`${x},${y}`);
    const hasCritter = x === position[0] && y === position[1];
    return <div className={`code-cell ${isWall ? 'cell-wall' : ''} ${isGoal ? 'cell-goal' : ''} ${hasCritter ? 'cell-critter' : ''}`} key={`${x}-${y}`} aria-label={isWall ? 'Rock' : isGoal ? 'Goal' : isStart ? 'Start' : 'Path'}>{hasCritter ? '🐛' : isGoal ? '🍓' : isWall ? '🪨' : isStart ? '🏁' : ''}</div>;
  });

  return (
    <div className="coding-game">
      <div className="coding-intro"><span className="coding-mascot" aria-hidden="true">🐛</span><div><strong>{tr(language, 'Help the critter reach the berry!')}</strong><p>{tr(language, 'A program is a list of steps. Put the arrows in order, then press Run.')}</p></div></div>
      <div className="coding-play-area">
        <div className="code-grid" style={{ gridTemplateColumns: `repeat(${level.size}, minmax(0, 1fr))` }} role="img" aria-label={`Maze. Critter at column ${position[0] + 1}, row ${position[1] + 1}. Berry is the goal.`}>{cells}</div>
        <div className="coding-controls">
          <span className="code-label">{tr(language, '1 · Choose an instruction')}</span>
          <div className="command-picker">{codingCommands.map((command) => <button key={command.id} className="command-button" type="button" onClick={() => addCommand(command.id)} disabled={running || program.length >= level.maxBlocks} aria-label={`${tr(language, 'Add')} ${tr(language, command.name)}`}><span>{command.icon}</span><small>{tr(language, command.name)}</small></button>)}</div>
          {loopMode && <button className="loop-block-button" type="button" onClick={addLoop} disabled={running || program.length === 0 || program.length >= level.maxBlocks}>↻ {tr(language, 'Repeat the previous arrow 2 times')}</button>}
          <span className="code-label">{tr(language, '2 · Your program')} <small>({program.length}/{level.maxBlocks})</small></span>
          <div className="program-line" aria-live="polite">{program.length ? program.map((id, index) => {
            if (id === 'loop') return <button className="program-block program-loop" type="button" key={`loop-${index}`} onClick={() => !running && setProgram((previous) => previous.filter((_, blockIndex) => blockIndex !== index))} disabled={running} aria-label="Remove repeat block">↻</button>;
            const command = codingCommands.find((candidate) => candidate.id === id)!;
            return <button className="program-block" type="button" key={`${id}-${index}`} onClick={() => !running && setProgram((previous) => previous.filter((_, blockIndex) => blockIndex !== index))} disabled={running} aria-label={`Remove command ${index + 1}, ${command.name}`}>{command.icon}</button>;
          }) : <span className="program-empty">{tr(language, 'Your arrows will appear here')}</span>}</div>
          <div className="coding-actions"><button className="button button-quiet" type="button" onClick={resetProgram} disabled={running || program.length === 0}>{tr(language, 'Reset')}</button><button className="button button-primary run-button" type="button" onClick={() => void runProgram()} disabled={running}>{running ? tr(language, 'Running…') : tr(language, 'Run program')} <span aria-hidden="true">▶</span></button></div>
          <p className="coding-message" role="status">{tr(language, message)}</p>
        </div>
      </div>
    </div>
  );
}

function SequenceGame({ title, age, language, onFinish }: { title: string; age: AgeBand; language: Language; onFinish: () => void }) {
  const isMemory = title === 'Remember the Sequence';
  const sequence = title === 'Arrange the Days'
    ? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    : title === 'Morning Routine'
      ? ['🌞 Wake up', '🪥 Brush teeth', '👕 Get dressed', '🥣 Eat breakfast']
      : title === 'Follow the Movement'
        ? ['🙌 Clap', '🦶 Stomp', '👏 Clap twice', '🌀 Turn around']
          : title === 'Arrange Story Pictures'
            ? ['🌱 Plant a seed', '💧 Water it', '🌿 A sprout grows', '🌼 A flower blooms']
            : ['🎈', '⭐', '🍎', '🐸'];
  const options = isMemory ? [...sequence, '🐠', '🌈'].slice(0, age === '3-5' ? 5 : 6) : sequence;
  const [showing, setShowing] = useState(isMemory);
  const [picked, setPicked] = useState<string[]>([]);
  const [message, setMessage] = useState(tr(language, isMemory ? 'Look closely and remember the order!' : 'Tap each tile in the right order.'));
  useEffect(() => {
    if (!showing) return;
    const timer = window.setTimeout(() => setShowing(false), 2300);
    return () => window.clearTimeout(timer);
  }, [showing]);
  function choose(item: string) {
    if (showing) return;
    const nextIndex = picked.length;
    if (item !== sequence[nextIndex]) {
      setPicked([]);
      setMessage(tr(language, 'Good try! Start the order again.'));
      return;
    }
    const next = [...picked, item];
    setPicked(next);
    if (next.length === sequence.length) onFinish();
    else setMessage(language === 'hi' ? `${sequence.length} में से ${next.length} सही क्रम में!` : `${next.length} of ${sequence.length} in the right order!`);
  }
  function replay() {
    setPicked([]);
    setShowing(true);
    setMessage(tr(language, 'Look closely and remember the order!'));
  }
  return <div className="activity-card sequence-activity">
    <div className="activity-heading"><span aria-hidden="true">{isMemory ? '💡' : '🧩'}</span><div><strong>{tr(language, isMemory ? 'Watch, remember, repeat!' : 'Put the steps in order!')}</strong><small>{tr(language, isMemory ? 'The sequence will hide in a moment.' : 'Tap a tile to add it to your sequence.')}</small></div></div>
    <div className="sequence-preview" aria-label={tr(language, showing ? 'Sequence to remember' : 'Sequence hidden')}>{sequence.map((item, index) => <span key={item} className={showing ? '' : 'sequence-hidden'}>{showing ? tr(language, item) : picked[index] ? tr(language, picked[index]) : '·'}</span>)}</div>
    <div className="sequence-tiles">{options.map((item) => <button type="button" key={item} onClick={() => choose(item)} disabled={showing || picked.length === sequence.length}>{tr(language, item)}</button>)}</div>
    <p className="activity-message" role="status">{message}</p>
    {isMemory && <button className="small-game-button" type="button" onClick={replay} disabled={showing}>{tr(language, 'Show sequence again')}</button>}
  </div>;
}

function MissingObjectGame({ age, language, onFinish }: { age: AgeBand; language: Language; onFinish: () => void }) {
  const [showing, setShowing] = useState(true);
  const [message, setMessage] = useState(tr(language, 'Look carefully at every picture!'));
  useEffect(() => {
    const timer = window.setTimeout(() => { setShowing(false); setMessage(tr(language, 'Which picture disappeared?')); }, age === '3-5' ? 3000 : 2200);
    return () => window.clearTimeout(timer);
  }, [age]);
  const items = ['🐻', '🍎', '🚂', '🌙', '🧁', '🐠', '🌈'];
  return <div className="activity-card">
    <div className="activity-heading"><span aria-hidden="true">🔍</span><div><strong>{tr(language, 'Can you spot what is missing?')}</strong><small>{tr(language, 'Look at the picture row, then choose the one that vanished.')}</small></div></div>
    <div className="missing-scene" aria-label="Picture memory scene">{items.map((item) => <span key={item} className={!showing && item === '🍎' ? 'missing-hidden' : ''}>{!showing && item === '🍎' ? '❔' : item}</span>)}</div>
    <p className="activity-message" role="status">{message}</p>
    <div className="activity-choices">{[['🍎', 'Apple'], ['🍓', 'Strawberry'], ['🍋', 'Lemon']].map(([icon, label]) => <button key={label} type="button" disabled={showing} onClick={() => label === 'Apple' ? onFinish() : setMessage(tr(language, 'Not that one. Take another look at the row!'))}>{icon} {tr(language, label)}</button>)}</div>
  </div>;
}

function SudokuGame({ language, onFinish }: { language: Language; onFinish: () => void }) {
  const solution = [[1, 2, 3, 4], [3, 4, 1, 2], [2, 1, 4, 3], [4, 3, 2, 1]];
  const blanks = new Set(['0-0', '0-2', '1-1', '1-3', '2-0', '2-2', '3-1', '3-3']);
  const [grid, setGrid] = useState(() => solution.map((row, r) => row.map((value, c) => blanks.has(`${r}-${c}`) ? 0 : value)));
  const [message, setMessage] = useState(tr(language, 'Each row and column needs 1, 2, 3, and 4. Tap a blank square to change it.'));
  function check() {
    const correct = grid.every((row, r) => row.every((value, c) => value === solution[r][c]));
    if (correct) onFinish();
    else setMessage(tr(language, 'Some squares need another look. Try counting across each row!'));
  }
  return <div className="activity-card sudoku-activity"><div className="activity-heading"><span aria-hidden="true">🔢</span><div><strong>{tr(language, 'Little number Sudoku')}</strong><small>{tr(language, 'Every row and column uses each number once.')}</small></div></div>
    <div className="sudoku-grid" role="group" aria-label={tr(language, 'Four by four Sudoku grid')}>{grid.map((row, r) => row.map((value, c) => {
      const editable = blanks.has(`${r}-${c}`);
      return <button key={`${r}-${c}`} type="button" disabled={!editable} className={editable ? 'sudoku-blank' : ''} aria-label={`${tr(language, 'Row')} ${r + 1}, ${tr(language, 'column')} ${c + 1}${editable ? `, ${value || tr(language, 'blank')}` : `, ${value}`}`} onClick={() => setGrid((previous) => previous.map((line, rowIndex) => line.map((cell, colIndex) => rowIndex === r && colIndex === c ? cell % 4 + 1 : cell)))}>{value || '·'}</button>;
    }))}</div>
    <p className="activity-message" role="status">{message}</p><button className="button button-primary" type="button" onClick={check}>{tr(language, 'Check my grid')} ✓</button>
  </div>;
}

function MonsterStudio({ language, onFinish }: { language: Language; onFinish: () => void }) {
  const [color, setColor] = useState('#ffe4a8');
  const [eyes, setEyes] = useState('👀');
  const [mouth, setMouth] = useState('😄');
  const [horns, setHorns] = useState('✨');
  return <div className="activity-card monster-studio"><div className="activity-heading"><span aria-hidden="true">🎨</span><div><strong>{tr(language, 'Build a brand-new monster friend!')}</strong><small>{tr(language, 'Pick its color, eyes, smile, and special top.')}</small></div></div>
    <div className="monster-preview" style={{ backgroundColor: color }} aria-label={tr(language, 'Your monster preview')}><span>{horns}</span><strong>{eyes}</strong><b>{mouth}</b></div>
    <div className="studio-row"><span>{tr(language, 'Color')}</span>{[['#ffe4a8', 'Sunny'], ['#c8f0d1', 'Mint'], ['#d9ccff', 'Lavender'], ['#ffc9dc', 'Pink']].map(([tone, name]) => <button key={tone} type="button" className="studio-color" style={{ backgroundColor: tone }} onClick={() => setColor(tone)} aria-label={`${tr(language, name)} ${tr(language, 'monster')}`} />)}</div>
    <div className="studio-row"><span>{tr(language, 'Eyes')}</span>{['👀', '🥽', '🤩'].map((item) => <button key={item} type="button" onClick={() => setEyes(item)}>{item}</button>)}</div>
    <div className="studio-row"><span>{tr(language, 'Smile')}</span>{['😄', '😋', '😺'].map((item) => <button key={item} type="button" onClick={() => setMouth(item)}>{item}</button>)}</div>
    <div className="studio-row"><span>{tr(language, 'Top')}</span>{['✨', '🌼', '🦄'].map((item) => <button key={item} type="button" onClick={() => setHorns(item)}>{item}</button>)}</div>
    <button className="button button-primary" type="button" onClick={onFinish}>{tr(language, 'My monster is ready!')}</button>
  </div>;
}

function PixelArt({ language, onFinish }: { language: Language; onFinish: () => void }) {
  const palette = ['#e86f72', '#f4bd55', '#74bd8c', '#5f9ed2', '#9c7bd3', '#303852', '#fff'];
  const [color, setColor] = useState(palette[0]);
  const [pixels, setPixels] = useState<Record<number, string>>({});
  return <div className="activity-card pixel-activity"><div className="activity-heading"><span aria-hidden="true">🟪</span><div><strong>{tr(language, 'Make a tiny pixel picture!')}</strong><small>{tr(language, 'Choose a color, then tap squares to paint.')}</small></div></div>
    <div className="pixel-grid" role="group" aria-label={tr(language, 'Eight by eight pixel art canvas')}>{Array.from({ length: 64 }, (_, index) => <button key={index} type="button" aria-label={`${tr(language, 'Pixel')} ${index + 1}`} style={{ backgroundColor: pixels[index] ?? '#fffdf9' }} onClick={() => setPixels((previous) => ({ ...previous, [index]: color }))} />)}</div>
    <div className="pixel-tools"><div className="color-palette">{palette.map((tone) => <button type="button" key={tone} className={`color-dot ${color === tone ? 'color-selected' : ''}`} style={{ backgroundColor: tone }} onClick={() => setColor(tone)} aria-label={`${tr(language, 'Choose color')} ${tone}`} />)}</div><button className="small-game-button" type="button" onClick={() => setPixels({})}>{tr(language, 'Clear picture')}</button></div>
    <button className="button button-primary" type="button" disabled={Object.keys(pixels).length < 6} onClick={onFinish}>{tr(language, 'Save my pixel art')}</button>
  </div>;
}

function playNote(frequency: number, duration = 0.18) {
  try {
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.08, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);
    oscillator.connect(gain); gain.connect(context.destination);
    oscillator.start(); oscillator.stop(context.currentTime + duration);
    oscillator.onended = () => void context.close();
  } catch { /* Sound is an optional extra; the visual game still works. */ }
}

function MiniPiano({ language, onFinish }: { language: Language; onFinish: () => void }) {
  const [played, setPlayed] = useState(0);
  const notes = [262, 294, 330, 349, 392, 440, 494];
  return <div className="activity-card piano-activity"><div className="activity-heading"><span aria-hidden="true">🎹</span><div><strong>{tr(language, 'Make a little tune!')}</strong><small>{tr(language, 'Tap any keys to hear notes. Play five keys to complete your mini concert.')}</small></div></div>
    <div className="piano-keys" role="group" aria-label={tr(language, 'Piano keys')}>{notes.map((note, index) => <button type="button" key={note} onClick={() => { playNote(note); setPlayed((value) => Math.min(5, value + 1)); }} aria-label={`${tr(language, 'Play note')} ${index + 1}`}><span>{(language === 'hi' ? ['सा', 'रे', 'ग', 'म', 'प', 'ध', 'नि'] : ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Ti'])[index]}</span></button>)}</div>
    <p className="activity-message" role="status">{played < 5 ? language === 'hi' ? `5 में से ${played} सुर बजे` : `${played} of 5 notes played` : tr(language, 'Lovely tune! You can finish your concert.')}</p><button className="button button-primary" type="button" disabled={played < 5} onClick={onFinish}>{tr(language, 'Finish my mini concert')} ♪</button>
  </div>;
}

function RhythmGame({ language, onFinish }: { age: AgeBand; language: Language; onFinish: () => void }) {
  const rhythm = ['clap', 'tap', 'clap', 'stomp'];
  const [entered, setEntered] = useState<string[]>([]);
  const [message, setMessage] = useState(tr(language, 'Listen to the pattern, then tap it back.'));
  async function playRhythm() {
    setMessage(tr(language, 'Listen closely…'));
    for (const note of [330, 220, 330, 165]) { playNote(note, 0.13); await new Promise((resolve) => window.setTimeout(resolve, 350)); }
    setMessage(tr(language, 'Your turn! Tap the same rhythm.'));
  }
  function tapBeat(beat: string) {
    const index = entered.length;
    if (beat !== rhythm[index]) { setEntered([]); setMessage(tr(language, 'Almost! Listen once more, then try again.')); return; }
    const next = [...entered, beat]; setEntered(next);
    if (next.length === rhythm.length) onFinish();
    else setMessage(language === 'hi' ? `${rhythm.length} में से ${next.length} ताल — जारी रखो!` : `Beat ${next.length} of ${rhythm.length} — keep going!`);
  }
  return <div className="activity-card rhythm-activity"><div className="activity-heading"><span aria-hidden="true">🥁</span><div><strong>{tr(language, 'Listen and tap the beat!')}</strong><small>{tr(language, 'Copy the four-beat rhythm in the same order.')}</small></div></div>
    <div className="rhythm-display" aria-label={language === 'hi' ? `चार में से ${entered.length} ताल दोहराईं` : `${entered.length} of four beats copied`}>{rhythm.map((_, index) => <span key={index} className={entered[index] ? 'rhythm-done' : ''}>{entered[index] ? '●' : '·'}</span>)}</div>
    <button type="button" className="small-game-button rhythm-listen" onClick={() => void playRhythm()}>🔊 {tr(language, 'Play the rhythm')}</button>
    <div className="rhythm-buttons"><button type="button" onClick={() => tapBeat('clap')}>👏 {tr(language, 'Clap')}</button><button type="button" onClick={() => tapBeat('tap')}>👆 {tr(language, 'Tap')}</button><button type="button" onClick={() => tapBeat('stomp')}>🦶 {tr(language, 'Stomp')}</button></div><p className="activity-message" role="status">{tr(language, message)}</p>
  </div>;
}

function SoundGuessGame({ title, language, onFinish }: { title: string; age: AgeBand; language: Language; onFinish: () => void }) {
  const instruments = title === 'Guess the Instrument';
  const rounds = instruments
    ? [{ answer: 'Flute', icon: '🪈', sound: 660, choices: ['Flute', 'Drum', 'Guitar'], fact: 'A flute makes music when air moves across its opening.' }, { answer: 'Drum', icon: '🥁', sound: 220, choices: ['Piano', 'Drum', 'Flute'], fact: 'A drum skin vibrates when you tap it.' }, { answer: 'Guitar', icon: '🎸', sound: 392, choices: ['Guitar', 'Trumpet', 'Drum'], fact: 'A guitar uses vibrating strings to make sound.' }]
    : [{ answer: 'Cow', icon: '🐮', sound: 'Moo!', choices: ['Cow', 'Duck', 'Sheep'], fact: 'Cows make a lowing sound, often written as “moo”.' }, { answer: 'Duck', icon: '🦆', sound: 'Quack!', choices: ['Horse', 'Duck', 'Dog'], fact: 'Ducks make a quacking sound.' }, { answer: 'Sheep', icon: '🐑', sound: 'Baa!', choices: ['Sheep', 'Cat', 'Cow'], fact: 'Sheep make a bleating sound, often written as “baa”.' }];
  const [round, setRound] = useState(0);
  const [chosen, setChosen] = useState('');
  const [message, setMessage] = useState(tr(language, 'Tap the speaker, listen, and guess!'));
  const clue = rounds[round];
  function playClue() {
    if (typeof clue.sound === 'number') playNote(clue.sound, 0.42);
    else if ('speechSynthesis' in window) { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance(clue.sound)); }
  }
  function choose(choice: string) {
    setChosen(choice);
    if (choice === clue.answer) setMessage(`${tr(language, 'That’s right!')} ${tr(language, clue.fact)}`);
    else setMessage(tr(language, 'Not quite. Listen again and try another one!'));
  }
  function next() { if (round === rounds.length - 1) onFinish(); else { setRound((value) => value + 1); setChosen(''); setMessage(tr(language, 'Tap the speaker, listen, and guess!')); } }
  return <div className="activity-card sound-activity"><div className="activity-heading"><span aria-hidden="true">{instruments ? '🎼' : '🐾'}</span><div><strong>{tr(language, instruments ? 'Which instrument do you hear?' : 'Who made that sound?')}</strong><small>{language === 'hi' ? `${rounds.length} में से दौर ${round + 1} · संकेत सुनो।` : `Round ${round + 1} of ${rounds.length} · listen for the clue.`}</small></div></div>
    <button className="sound-button" type="button" onClick={playClue} aria-label={tr(language, 'Play sound clue')}>🔊<span>{tr(language, 'Play sound')}</span></button>
    <div className="activity-choices">{clue.choices.map((choice) => <button key={choice} type="button" className={chosen === choice ? choice === clue.answer ? 'choice-correct' : 'choice-wrong' : ''} onClick={() => choose(choice)}>{tr(language, choice)}</button>)}</div>
    <p className="activity-message" role="status">{message}</p>{chosen === clue.answer && <button className="button button-primary" type="button" onClick={next}>{tr(language, round === rounds.length - 1 ? 'Finish game ✓' : 'Next sound →')}</button>}
  </div>;
}

function SortGame({ title, language, onFinish }: { title: string; language: Language; onFinish: () => void }) {
  const isNeeds = title === 'Needs vs Wants';
  const isRoom = title === 'Clean Your Room';
  const tasks = isNeeds
    ? [{ icon: '💧', name: 'Clean water', group: 'Need' }, { icon: '🧸', name: 'Extra toy', group: 'Want' }, { icon: '🥣', name: 'Healthy food', group: 'Need' }, { icon: '🎮', name: 'New game', group: 'Want' }, { icon: '🏠', name: 'Safe home', group: 'Need' }]
    : isRoom
      ? [{ icon: '🧸', name: 'Teddy bear', group: 'Toy box' }, { icon: '📚', name: 'Story books', group: 'Bookshelf' }, { icon: '👕', name: 'Clean shirt', group: 'Drawer' }, { icon: '🚗', name: 'Toy car', group: 'Toy box' }, { icon: '📕', name: 'Picture book', group: 'Bookshelf' }]
      : [{ icon: '🍎', name: 'Apple', group: 'Everyday food' }, { icon: '🍬', name: 'Candy', group: 'Sometimes food' }, { icon: '🥕', name: 'Carrot', group: 'Everyday food' }, { icon: '🍪', name: 'Cookie', group: 'Sometimes food' }, { icon: '🍌', name: 'Banana', group: 'Everyday food' }];
  const groups = isNeeds ? ['Need', 'Want'] : isRoom ? ['Toy box', 'Bookshelf', 'Drawer'] : ['Everyday food', 'Sometimes food'];
  const [index, setIndex] = useState(0);
  const [message, setMessage] = useState(tr(language, 'Choose a picture, then pick the right group.'));
  const [selected, setSelected] = useState('');
  function place(group: string) {
    if (group !== tasks[index].group) { setMessage(tr(language, 'Try another group. You can do it!')); setSelected(''); return; }
    if (index === tasks.length - 1) onFinish();
    else { setIndex((value) => value + 1); setSelected(''); setMessage(tr(language, 'Nice sorting! Choose the next picture.')); }
  }
  return <div className="activity-card sort-activity"><div className="activity-heading"><span aria-hidden="true">🧺</span><div><strong>{tr(language, isNeeds ? 'Need or want?' : isRoom ? 'Tidy-up sort!' : 'Everyday or sometimes?')}</strong><small>{language === 'hi' ? `${tasks.length} में से चित्र ${index + 1}` : `Picture ${index + 1} of ${tasks.length}`}</small></div></div>
    <button type="button" className={`sort-item ${selected ? 'sort-selected' : ''}`} onClick={() => setSelected(tasks[index].name)}><span>{tasks[index].icon}</span><strong>{tr(language, tasks[index].name)}</strong><small>{tr(language, 'Tap to pick up')}</small></button>
    <p className="activity-message" role="status">{message}</p><div className="sort-bins">{groups.map((group) => <button type="button" key={group} onClick={() => selected && place(group)} disabled={!selected}>{group === 'Need' ? '💧 ' : group === 'Want' ? '🎁 ' : '📦 '}{tr(language, group)}</button>)}</div>
  </div>;
}

function ClockGame({ age, language, onFinish }: { age: AgeBand; language: Language; onFinish: () => void }) {
  const target = age === '3-5' ? { hour: 4, minute: 0 } : age === '6-8' ? { hour: 10, minute: 15 } : { hour: 11, minute: 40 };
  const [hour, setHour] = useState(12);
  const [minute, setMinute] = useState(0);
  const [message, setMessage] = useState(tr(language, 'Move the hands to show the time.'));
  const hourAngle = (hour % 12) * 30 + minute / 2;
  const minuteAngle = minute * 6;
  function check() { if (hour % 12 === target.hour % 12 && minute === target.minute) onFinish(); else setMessage(tr(language, 'Keep adjusting the clock hands and try again.')); }
  return <div className="activity-card clock-activity"><div className="activity-heading"><span aria-hidden="true">🕒</span><div><strong>{tr(language, 'Set the clock to')} {target.hour}:{String(target.minute).padStart(2, '0')}</strong><small>{tr(language, 'Use the arrows to move the hour and minute hands.')}</small></div></div>
    <div className="clock-face" aria-label={`${tr(language, 'Clock showing')} ${hour}:${String(minute).padStart(2, '0')}`}>{Array.from({ length: 12 }, (_, i) => <span key={i} style={{ top: `${50 - 40 * Math.cos(i * Math.PI / 6)}%`, left: `${50 + 40 * Math.sin(i * Math.PI / 6)}%` }}>{i === 0 ? 12 : i}</span>)}<i className="clock-hour-hand" style={{ transform: `rotate(${hourAngle}deg)` }} /><i className="clock-minute-hand" style={{ transform: `rotate(${minuteAngle}deg)` }} /><b /></div>
    <div className="clock-adjust"><div><span>{tr(language, 'Hour')}</span><button type="button" onClick={() => setHour((value) => value % 12 + 1)} aria-label={tr(language, 'Add one hour')}>＋</button><strong>{hour}</strong><button type="button" onClick={() => setHour((value) => (value + 10) % 12 + 1)} aria-label={tr(language, 'Subtract one hour')}>−</button></div><div><span>{tr(language, 'Minutes')}</span><button type="button" onClick={() => setMinute((value) => (value + 55) % 60)} aria-label={tr(language, 'Subtract five minutes')}>−</button><strong>{String(minute).padStart(2, '0')}</strong><button type="button" onClick={() => setMinute((value) => (value + 5) % 60)} aria-label={tr(language, 'Add five minutes')}>＋</button></div></div>
    <p className="activity-message" role="status">{message}</p><button className="button button-primary" type="button" onClick={check}>{tr(language, 'Check the clock')} ✓</button>
  </div>;
}

function ShopGame({ age, title, language, onFinish }: { age: AgeBand; title: string; language: Language; onFinish: () => void }) {
  const target = age === '3-5' ? 5 : age === '6-8' ? 12 : 23;
  const [saved, setSaved] = useState(0);
  const [message, setMessage] = useState(tr(language, 'Add coins until you reach your goal exactly.'));
  function add(value: number) {
    const next = saved + value;
    if (next > target) { setMessage(tr(language, 'That is a little too much. Start over and try a new coin plan!')); return; }
    setSaved(next);
    if (next === target) setMessage(tr(language, 'You reached your goal! Great planning.'));
  }
  const reached = saved === target;
  return <div className="activity-card shop-activity"><div className="activity-heading"><span aria-hidden="true">{title === 'Save for a Toy' ? '🐷' : '🛒'}</span><div><strong>{tr(language, title === 'Save for a Toy' ? 'Save up for a toy!' : 'Coin-counting shop')}</strong><small>{tr(language, 'Goal')}: ₹{target} · {tr(language, 'Current savings')}: ₹{saved}</small></div></div>
    <div className="shop-goal">{title === 'Save for a Toy' ? '🧸' : '🎁'}<span>₹{target}</span></div><div className="coin-buttons">{[1, 2, 5].map((coin) => <button type="button" key={coin} onClick={() => add(coin)} disabled={reached}>🪙 ₹{coin}</button>)}</div>
    <div className="savings-track"><span style={{ width: `${Math.min(100, saved / target * 100)}%` }} /></div><p className="activity-message" role="status">{message}</p>{reached && <button className="button button-primary" type="button" onClick={onFinish}>{tr(language, 'Goal reached! ✓')}</button>}
  </div>;
}

function BalanceGame({ language, onFinish }: { language: Language; onFinish: () => void }) {
  const [position, setPosition] = useState(20);
  const [message, setMessage] = useState(tr(language, 'Move the slider near the middle to balance the seesaw.'));
  function nudge(direction: number) { setPosition((value) => Math.min(100, Math.max(0, value + direction * 5))); }
  function balance() { if (position >= 45 && position <= 55) onFinish(); else setMessage(tr(language, position < 45 ? 'A little to the right!' : 'A little to the left!')); }
  return <div className="activity-card balance-activity"><div className="activity-heading"><span aria-hidden="true">⚖️</span><div><strong>{tr(language, 'Balance the seesaw!')}</strong><small>{tr(language, 'Use the buttons to bring the marker close to the middle.')}</small></div></div>
    <div className="balance-scene"><span className="balance-kid">🐻</span><div className="balance-beam" style={{ transform: `rotate(${(50 - position) / 7}deg)` }}><span className="balance-marker" style={{ left: `${position}%` }} /></div><span className="balance-base">▲</span><span className="balance-kid">🐰</span></div>
    <div className="balance-controls"><button type="button" onClick={() => nudge(-1)} aria-label={tr(language, 'Move balance left')}>← {tr(language, 'Left')}</button><input type="range" min="0" max="100" value={position} onChange={(event) => setPosition(Number(event.target.value))} aria-label={tr(language, 'Balance position')} /><button type="button" onClick={() => nudge(1)} aria-label={tr(language, 'Move balance right')}>{tr(language, 'Right')} →</button></div>
    <p className="activity-message" role="status">{message}</p><button className="button button-primary" type="button" onClick={balance}>{tr(language, 'Hold it steady!')}</button>
  </div>;
}

function WelcomePage({ language, age, onAge, onLanguage, onContinue }: { language: Language; age: AgeBand | ''; onAge: (age: AgeBand) => void; onLanguage: (language: Language) => void; onContinue: () => void }) {
  return <main className="welcome-page">
    <a className="brand welcome-brand" href="/" aria-label="WonderSprout">
      <span className="brand-mark" aria-hidden="true">✿</span><span className="brand-name">wonder<span>sprout</span></span>
    </a>
    <section className="welcome-card">
      <div className="welcome-decor" aria-hidden="true"><span>🌈</span><span>⭐</span><span>🦊</span><span>🌼</span></div>
      <div className="eyebrow eyebrow-lilac"><span className="eyebrow-dot" /> WonderSprout</div>
      <h1>{tr(language, 'First, tell us your age group')}</h1>
      <p className="welcome-description">{tr(language, 'Your games will be picked just for your age and shown in your chosen language.')}</p>
      <h2>{tr(language, 'Choose your age group')}</h2>
      <div className="welcome-age-options" role="group" aria-label={tr(language, 'Choose your age group')}>
        {ageBands.map((band) => <button key={band.id} type="button" className={`welcome-age-option ${age === band.id ? 'selected' : ''}`} onClick={() => onAge(band.id)} aria-pressed={age === band.id}>
          <span className="welcome-age-icon" aria-hidden="true">{band.icon}</span><strong>{language === 'hi' ? ageCopyHi[band.name] : band.name}</strong><small>{language === 'hi' ? ageCopyHi[band.label] : band.label}</small>
        </button>)}
      </div>
      <h2>{tr(language, 'Choose a language')}</h2>
      <div className="welcome-language-options" role="group" aria-label={tr(language, 'Choose a language')}>
        <button type="button" className={language === 'en' ? 'selected' : ''} onClick={() => onLanguage('en')} aria-pressed={language === 'en'}><span>🇬🇧</span> English</button>
        <button type="button" className={language === 'hi' ? 'selected' : ''} onClick={() => onLanguage('hi')} aria-pressed={language === 'hi'}><span>🇮🇳</span> हिन्दी</button>
      </div>
      <button className="button button-primary welcome-continue" type="button" disabled={!age} onClick={onContinue}>{tr(language, 'Continue to games')} <span aria-hidden="true">→</span></button>
      {!age && <small className="welcome-hint">{tr(language, 'Select an age group to continue.')}</small>}
      <p className="welcome-privacy">{tr(language, 'Your choice can be changed later.')}</p>
    </section>
  </main>;
}
