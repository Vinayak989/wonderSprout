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
  'Science wonders': { icon: '🔭', color: '#DFF2E6', short: 'Science' },
  'History & Culture': { icon: '🏛️', color: '#F8E8D9', short: 'History' },
  'Geography & World Explorer': { icon: '🌍', color: '#DBEFF8', short: 'Geography' },
  'English Grammar': { icon: '🔤', color: '#EEE5FA', short: 'English' },
  'Marathi Grammar': { icon: '📖', color: '#F7E3EC', short: 'Marathi' },
  'Word adventures': { icon: '🦊', color: '#FCE6D5', short: 'Words' },
};

export const primarySubjects = Object.keys(subjectArt);
