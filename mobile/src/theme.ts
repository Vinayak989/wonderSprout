export const colors = {
  ink: '#163D32',
  leaf: '#2B7557',
  leafLight: '#E7F2E7',
  lime: '#D4E875',
  cream: '#FBF8EE',
  paper: '#FFFFFF',
  muted: '#6E8077',
  line: '#E6E9DD',
  peach: '#FFE4D2',
  sky: '#DDEFFA',
  gold: '#F2B94B',
  danger: '#B44A3D',
  success: '#297450',
};

export const subjectArt: Record<string, { icon: string; color: string; short: string }> = {
  'Math magic': { icon: '🔢', color: '#FFF0CF', short: 'Math' },
  'Science wonders': { icon: '🔬', color: '#DFF2E6', short: 'Science' },
  'History & Culture': { icon: '🏛️', color: '#F8E8D9', short: 'History' },
  'Geography & World Explorer': { icon: '🌍', color: '#DBEFF8', short: 'Geography' },
  'English Grammar': { icon: '🔤', color: '#EEE5FA', short: 'English' },
  'Marathi Grammar': { icon: '📖', color: '#F7E3EC', short: 'Marathi' },
  'Word adventures': { icon: '🦊', color: '#FCE6D5', short: 'Words' },
  'Adventure & Treasure Hunt': { icon: '🧭', color: '#E7E9FA', short: 'Adventure' },
  'Animals & Nature': { icon: '🐾', color: '#E1F0DF', short: 'Nature' },
  'Art & Creativity': { icon: '🎨', color: '#F8E4F0', short: 'Art' },
  'Coding & Computational Thinking': { icon: '🤖', color: '#E0EAF5', short: 'Coding' },
  'Emotions & Social Skills': { icon: '💛', color: '#FFF0D9', short: 'Feelings' },
  'Interactive Stories & Reading': { icon: '📚', color: '#F3E5D9', short: 'Stories' },
  'Life Skills & Good Habits': { icon: '🌱', color: '#E8F0D9', short: 'Life skills' },
  'Memory Games': { icon: '🧠', color: '#E6E2F8', short: 'Memory' },
  'Money & Financial Literacy': { icon: '🪙', color: '#F9EBCB', short: 'Money' },
  'Music & Rhythm': { icon: '🎵', color: '#F7E1E5', short: 'Music' },
  'Puzzle & Logic': { icon: '🧩', color: '#E2ECF7', short: 'Puzzles' },
  'Sports & Movement': { icon: '⚽', color: '#E0F1E9', short: 'Sports' },
  'Time & Calendar': { icon: '🕒', color: '#E7EDF7', short: 'Time' },
};

export const primarySubjects = Object.keys(subjectArt);
export type AgeBand = '3-5' | '6-8' | '9-12';

