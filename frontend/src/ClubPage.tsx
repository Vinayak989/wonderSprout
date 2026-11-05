import { useEffect, useMemo, useState } from 'react';
import type { AgeBand, ClubData, GalleryArtwork, ParentPreferences, SavedStory } from './club';
import type { GamePerformance } from './club';
import { localizedPair, localizedText, tr, type Language } from './i18n';

export type ClubGame = {
  id: string;
  title: string;
  localizedTitle?: string;
  subject: string;
  localizedSubject?: string;
  mode: string;
  description: string;
  localizedDescription?: string;
  icon: string;
  minutes: number;
  ageBands: AgeBand[];
};

type ClubProgress = { stars: number; games: number; performance?: Record<string, GamePerformance> };

type Props = {
  age: AgeBand;
  language: Language;
  games: ClubGame[];
  progress: ClubProgress;
  data: ClubData;
  onDataChange: (next: ClubData) => void;
  preferences: ParentPreferences;
  onPreferencesChange: (next: ParentPreferences) => void;
  artworks: GalleryArtwork[];
  onRemoveArtwork: (id: string) => void;
  minutesToday: number;
  online: boolean;
  onPlay: (game: ClubGame) => void;
  onCoopComplete: () => void;
  onWeeklyComplete: () => void;
  onBack: () => void;
};

const phrases: Record<string, [string, string]> = {
  'Wonder Club': ['Wonder Club', 'वंडर क्लब'], 'Back to games': ['Back to games', 'खेलों पर लौटें'],
  'Your adventure map': ['Your adventure map', 'तुम्हारा रोमांचक नक्शा'], 'Five story chapters. One big adventure.': ['Five story chapters. One big adventure.', 'पाँच अध्याय, एक बड़ा रोमांच।'], 'Follow Pip through five story chapters. Each stop opens a new little mission.': ['Follow Pip through five story chapters. Each stop opens a new little mission.', 'पाँच कहानी पड़ावों में पिप के साथ चलो। हर पड़ाव पर एक नया मिशन मिलेगा।'],
  'games played': ['games played', 'खेल खेले'],
  'Start this mission': ['Start this mission', 'यह मिशन शुरू करो'], 'Chapter': ['Chapter', 'अध्याय'], 'Complete a game to open more stops.': ['Complete a game to open more stops.', 'और पड़ाव खोलने के लिए एक खेल पूरा करो।'],
  'Make a story': ['Make a story', 'कहानी बनाओ'], 'Pick a hero, a place, and a kind mission.': ['Pick a hero, a place, and a kind mission.', 'एक किरदार, जगह और प्यारा मिशन चुनो।'],
  'Hero': ['Hero', 'किरदार'], 'Place': ['Place', 'जगह'], 'Mission': ['Mission', 'मिशन'], 'Create my story': ['Create my story', 'मेरी कहानी बनाओ'], 'Read aloud': ['Read aloud', 'कहानी सुनो'], 'Save to story shelf': ['Save to story shelf', 'कहानी सहेजो'], 'Your story shelf': ['Your story shelf', 'तुम्हारी कहानियाँ'],
  'Build a wonder world': ['Build a wonder world', 'अपनी जादुई दुनिया बनाओ'], 'Pick decorations to make a home for your explorer. New decorations unlock as you play.': ['Pick decorations to make a home for your explorer. New decorations unlock as you play.', 'अपने खोजी दोस्त का घर सजाओ। खेलते रहने पर नई सजावट खुलेगी।'], 'Tap to add or remove': ['Tap to add or remove', 'जोड़ने या हटाने के लिए दबाओ'], 'Need': ['Need', 'चाहिए'], 'stars': ['stars', 'सितारे'],
  'Team trail': ['Team trail', 'दोस्तों का रास्ता'], 'Two players, one device, one shared mission. Take turns reading the clue and choosing a path.': ['Two players, one device, one shared mission. Take turns reading the clue and choosing a path.', 'दो खिलाड़ी, एक डिवाइस और एक साझा मिशन। बारी-बारी से संकेत पढ़ो और रास्ता चुनो।'], 'Player': ['Player', 'खिलाड़ी'], 'Read the clue together, then pass the device to your teammate.': ['Read the clue together, then pass the device to your teammate.', 'संकेत साथ पढ़ो, फिर डिवाइस अपने साथी को दो।'], 'Pass the device': ['Pass the device', 'डिवाइस साथी को दो'], 'Start team trail': ['Start team trail', 'टीम मिशन शुरू करो'], 'Next clue': ['Next clue', 'अगला संकेत'], 'Team treasure found!': ['Team treasure found!', 'टीम ने खज़ाना खोज लिया!'], 'Try another team trail': ['Try another team trail', 'एक और टीम मिशन खेलो'],
  'Choose a playlist': ['Choose a playlist', 'खेलों की सूची चुनो'], 'A little themed trail of games. Finish one and come back for the next.': ['A little themed trail of games. Finish one and come back for the next.', 'एक विषय पर छोटे खेल। एक पूरा करके अगला खेल चुनो।'], 'Start playlist': ['Start playlist', 'खेलों की सूची शुरू करो'], 'Play next game': ['Play next game', 'अगला खेल खेलो'], 'Trail complete! Pick another playlist.': ['Trail complete! Pick another playlist.', 'यात्रा पूरी! अब दूसरी सूची चुनो।'],
  'Discovery field guide': ['Discovery field guide', 'खोज की किताब'], 'Collect a new animal, place, or big idea after finishing games.': ['Collect a new animal, place, or big idea after finishing games.', 'खेल पूरे करके जानवर, जगह और नई बातें इकट्ठा करो।'], 'Collect discovery': ['Collect discovery', 'खोज इकट्ठा करो'], 'Collected': ['Collected', 'मिल गया'], 'Finish': ['Finish', 'खेल पूरे करो'], 'games to unlock': ['games to unlock', 'खेल खोलने के लिए'],
  'This week in WonderSprout': ['This week in WonderSprout', 'इस हफ्ते का खास मिशन'], 'A fresh little quest arrives every week. Finish the featured game to earn a special field-guide stamp.': ['A fresh little quest arrives every week. Finish the featured game to earn a special field-guide stamp.', 'हर हफ्ते नया मिशन आता है। खास किताब की मुहर पाने के लिए यह खेल पूरा करो।'], 'Weekly stamp earned!': ['Weekly stamp earned!', 'इस हफ्ते की मुहर मिल गई!'], 'Play this week’s quest': ['Play this week’s quest', 'इस हफ्ते का खेल खेलो'],
  'My art gallery': ['My art gallery', 'मेरी कला गैलरी'], 'Drawings saved on this device will show up here.': ['Drawings saved on this device will show up here.', 'इस डिवाइस पर सहेजी गई तस्वीरें यहाँ दिखेंगी।'], 'Remove artwork': ['Remove artwork', 'तस्वीर हटाओ'],
  'Explorer avatar': ['Explorer avatar', 'खोजी किरदार'], 'Pick a friendly face for your adventures.': ['Pick a friendly face for your adventures.', 'अपने रोमांच के लिए प्यारा चेहरा चुनो।'], 'Favorite games': ['Favorite games', 'पसंदीदा खेल'], 'Remove favorite': ['Remove favorite', 'पसंदीदा से हटाओ'], 'No favorites yet. Tap the heart on a game card to save one.': ['No favorites yet. Tap the heart on a game card to save one.', 'अभी पसंदीदा खेल नहीं हैं। खेल के दिल पर दबाकर सहेजो।'],
  'Grown-up corner': ['Grown-up corner', 'बड़ों का कोना'], 'A quick grown-up check keeps settings away from little hands.': ['A quick grown-up check keeps settings away from little hands.', 'छोटा-सा बड़ों का सवाल सेटिंग्स को सुरक्षित रखता है।'], 'Solve 7 + 5 to open settings.': ['Solve 7 + 5 to open settings.', 'सेटिंग्स खोलने के लिए 7 + 5 हल करें।'], 'Check': ['Check', 'जाँचें'], 'That answer needs a grown-up. Try again.': ['That answer needs a grown-up. Try again.', 'यह जवाब सही नहीं है। फिर से कोशिश करें।'], 'Parent dashboard': ['Parent dashboard', 'अभिभावक डैशबोर्ड'], 'Progress on this device': ['Progress on this device', 'इस डिवाइस की प्रगति'], 'Finished games': ['Finished games', 'पूरे किए खेल'], 'Today’s play time': ['Today’s play time', 'आज खेलने का समय'], 'Daily play reminder': ['Daily play reminder', 'रोज़ खेलने की सीमा'], 'No limit': ['No limit', 'कोई सीमा नहीं'], 'minutes': ['minutes', 'मिनट'], 'Accessibility': ['Accessibility', 'सुगमता'], 'High contrast': ['High contrast', 'गहरा कंट्रास्ट'], 'Easy-read font': ['Easy-read font', 'आसानी से पढ़ने वाला फ़ॉन्ट'], 'Reduce motion': ['Reduce motion', 'कम गति वाले प्रभाव'], 'Read game clues aloud': ['Read game clues aloud', 'खेल के संकेत बोलकर सुनाएँ'], 'Your choices and creations stay in this browser. No account or child profile is sent anywhere.': ['Your choices and creations stay in this browser. No account or child profile is sent anywhere.', 'तुम्हारी पसंद और बनाई चीज़ें इसी ब्राउज़र में रहती हैं। कोई खाता या बच्चों की जानकारी कहीं नहीं भेजी जाती।'],
  'Offline ready': ['Offline ready', 'ऑफ़लाइन खेलने के लिए तैयार'], 'Some games need an internet connection the first time you open them.': ['Some games need an internet connection the first time you open them.', 'कुछ खेल पहली बार खोलने के लिए इंटरनेट चाहते हैं।'], 'Take a little screen break. Your games and progress will be here when you come back.': ['Take a little screen break. Your games and progress will be here when you come back.', 'थोड़ा आराम कर लो। लौटने पर तुम्हारे खेल और प्रगति यहीं मिलेंगे।'], 'Choose a game': ['Choose a game', 'खेल चुनो'],
  'Smart next step': ['Smart next step', 'तुम्हारा अगला कदम'], 'Practice pick': ['Practice pick', 'अभ्यास का खेल'], 'Ready for a twist?': ['Ready for a twist?', 'नई चुनौती के लिए तैयार?'], 'A gentle retry and a familiar game can help build confidence.': ['A gentle retry and a familiar game can help build confidence.', 'धीरे से फिर कोशिश करना और जाना-पहचाना खेल आत्मविश्वास बढ़ाते हैं।'], 'You are doing great. Try a new kind of challenge next.': ['You are doing great. Try a new kind of challenge next.', 'तुम बहुत अच्छा कर रहे हो। अब एक नई तरह की चुनौती आज़माओ।'], 'Keep exploring. Your next game is picked for your age.': ['Keep exploring. Your next game is picked for your age.', 'खोजते रहो। तुम्हारा अगला खेल तुम्हारी उम्र के हिसाब से चुना गया है।'], 'Answer a few questions to get a practice pick.': ['Answer a few questions to get a practice pick.', 'अभ्यास का खेल पाने के लिए कुछ सवालों के जवाब दो।'],
};

function t(language: Language, key: string) {
  if (key === 'Online (offline ready)') return localizedText(language, 'Online (offline ready)', 'ऑनलाइन (ऑफ़लाइन के लिए तैयार)');
  const phrase = phrases[key];
  return phrase ? localizedPair(language, phrase) : tr(language, key);
}
function gameTitle(game: ClubGame) { return game.localizedTitle ?? game.title; }
function gameTitleForId(games: ClubGame[], id: string, language: Language) {
  const game = games.find((candidate) => candidate.id === id);
  return game ? gameTitle(game) : t(language, 'Choose a game');
}

const journeyStops = [
  { title: ['The Sprout Gate', 'अंकुर द्वार'], icon: '🌱', story: ['Pip finds a tiny map tucked under a leaf. Your first clue is waiting.', 'पिप को पत्ते के नीचे छोटा नक्शा मिलता है। पहला संकेत तुम्हारा इंतज़ार कर रहा है।'], gameId: 'word-safari', after: 0 },
  { title: ['Bubble Brook', 'बुलबुला धारा'], icon: '🫧', story: ['Bouncy bubbles hide a number path across the stream.', 'उछलते बुलबुलों में धारा पार करने का अंकों वाला रास्ता छिपा है।'], gameId: 'bubble-pop', after: 1 },
  { title: ['Whisper Woods', 'फुसफुसाता जंगल'], icon: '🌳', story: ['A shy forest friend needs help finding the right home.', 'जंगल के एक दोस्त को अपना सही घर ढूँढ़ने में मदद चाहिए।'], gameId: 'habitat-match', after: 3 },
  { title: ['Cloudtop Lab', 'बादलों वाली प्रयोगशाला'], icon: '☁️', story: ['A cloud scientist left a curious puzzle among the stars.', 'बादल वैज्ञानिक ने तारों के बीच मज़ेदार पहेली छोड़ी है।'], gameId: 'wonder-lab', after: 5 },
  { title: ['The Sky Tree', 'आकाश का पेड़'], icon: '🌈', story: ['All the clues lead to a bright treasure above the clouds.', 'सारे संकेत बादलों के ऊपर चमकते खज़ाने तक ले जाते हैं।'], gameId: 'moon-meadow-quest', after: 7 },
];

const heroes = [['a fox', 'लोमड़ी'], ['a brave rabbit', 'बहादुर खरगोश'], ['a tiny turtle', 'छोटा कछुआ'], ['a curious robot', 'जिज्ञासु रोबोट']];
const places = [['a moonlit garden', 'चाँदनी बगीचा'], ['a cloud castle', 'बादलों का महल'], ['a friendly jungle', 'प्यारा जंगल'], ['an underwater city', 'पानी के नीचे का शहर']];
const missions = [['find a missing star', 'खोया हुआ तारा ढूँढ़ना'], ['help a new friend', 'नए दोस्त की मदद करना'], ['grow a magical garden', 'जादुई बगीचा उगाना'], ['bring music back to the valley', 'घाटी में संगीत लौटाना']];

const discoveries = [
  { id: 'honeybee', icon: '🐝', title: ['Honeybee', 'मधुमक्खी'], fact: ['Bees carry pollen between flowers and help plants make seeds.', 'मधुमक्खियाँ फूलों के बीच पराग ले जाकर पौधों को बीज बनाने में मदद करती हैं।'], after: 0 },
  { id: 'octopus', icon: '🐙', title: ['Octopus', 'ऑक्टोपस'], fact: ['An octopus has three hearts and can squeeze through tiny spaces.', 'ऑक्टोपस के तीन दिल होते हैं और वह छोटी जगहों से निकल सकता है।'], after: 1 },
  { id: 'turtle', icon: '🐢', title: ['Turtle', 'कछुआ'], fact: ['Sea turtles travel far and return to beaches to lay eggs.', 'समुद्री कछुए दूर तक जाते हैं और अंडे देने के लिए समुद्र तट पर लौटते हैं।'], after: 2 },
  { id: 'rainforest', icon: '🌳', title: ['Rainforest', 'वर्षावन'], fact: ['Rainforests are home to more than half of Earth’s known plant and animal species.', 'पृथ्वी के आधे से अधिक ज्ञात पौधे और जानवर वर्षावनों में रहते हैं।'], after: 3 },
  { id: 'moon', icon: '🌙', title: ['The Moon', 'चाँद'], fact: ['The Moon shines by reflecting sunlight back toward Earth.', 'चाँद सूरज की रोशनी को धरती की ओर लौटाकर चमकता है।'], after: 4 },
  { id: 'taj', icon: '🕌', title: ['Taj Mahal', 'ताजमहल'], fact: ['The Taj Mahal is a marble monument in Agra, India.', 'ताजमहल भारत के आगरा शहर में संगमरमर से बना स्मारक है।'], after: 5 },
  { id: 'inventor', icon: '💡', title: ['Bright ideas', 'नई खोज'], fact: ['Many inventions begin with noticing a small everyday problem.', 'कई आविष्कार रोज़मर्रा की छोटी समस्या को देखकर शुरू होते हैं।'], after: 6 },
  { id: 'coral', icon: '🪸', title: ['Coral reef', 'मूँगे की चट्टान'], fact: ['Coral reefs shelter many ocean animals and need clean water to thrive.', 'मूँगे की चट्टानें समुद्री जीवों को घर देती हैं और साफ पानी में फलती हैं।'], after: 7 },
];

const decorations = [
  { id: 'tree', icon: '🌳', title: ['Tree', 'पेड़'], after: 0 }, { id: 'pond', icon: '💧', title: ['Pond', 'तालाब'], after: 0 },
  { id: 'flower', icon: '🌼', title: ['Flower patch', 'फूलों की क्यारी'], after: 1 }, { id: 'bridge', icon: '🌉', title: ['Rainbow bridge', 'इंद्रधनुष पुल'], after: 2 },
  { id: 'rocket', icon: '🚀', title: ['Rocket', 'रॉकेट'], after: 4 }, { id: 'castle', icon: '🏰', title: ['Cloud castle', 'बादलों का महल'], after: 6 },
];

const playlistOptions = [
  { id: 'wild-world', title: ['Wild World', 'जंगली दुनिया'], icon: '🦋', subjects: ['Animals & Nature', 'Science wonders', 'Life Skills & Good Habits'] },
  { id: 'space-makers', title: ['Space Makers', 'अंतरिक्ष खोजी'], icon: '🚀', subjects: ['Science wonders', 'Geography & World Explorer', 'Coding & Computational Thinking'] },
  { id: 'story-studio', title: ['Story Studio', 'कहानी की दुनिया'], icon: '📚', subjects: ['Interactive Stories & Reading', 'Art & Creativity', 'Adventure & Treasure Hunt'] },
];

const coopRounds: Record<AgeBand, { clue: [string, string]; choices: [string, string][]; answer: number }[]> = {
  '3-5': [
    { clue: ['Which animal lives in a nest?', 'कौन-सा जानवर घोंसले में रहता है?'], choices: [['Bird', 'चिड़िया'], ['Fish', 'मछली'], ['Cat', 'बिल्ली']], answer: 0 },
    { clue: ['What helps a plant grow?', 'पौधे को बढ़ने में क्या मदद करता है?'], choices: [['Sunlight', 'धूप'], ['Shoes', 'जूते'], ['A pillow', 'तकिया']], answer: 0 },
    { clue: ['Which shape has three sides?', 'किस आकार की तीन भुजाएँ हैं?'], choices: [['Triangle', 'त्रिकोण'], ['Circle', 'गोला'], ['Square', 'वर्ग']], answer: 0 },
  ],
  '6-8': [
    { clue: ['Which habitat is home to a camel?', 'ऊँट का घर कौन-सा पर्यावरण है?'], choices: [['Desert', 'रेगिस्तान'], ['Coral reef', 'मूँगे की चट्टान'], ['Tundra', 'टुंड्रा']], answer: 0 },
    { clue: ['What is 6 × 4?', '6 × 4 कितना होता है?'], choices: [['24', '24'], ['20', '20'], ['28', '28']], answer: 0 },
    { clue: ['Which direction is opposite to east?', 'पूर्व दिशा के उलट कौन-सी दिशा है?'], choices: [['West', 'पश्चिम'], ['North', 'उत्तर'], ['South', 'दक्षिण']], answer: 0 },
  ],
  '9-12': [
    { clue: ['Which process lets plants use sunlight to make food?', 'पौधे सूरज की रोशनी से भोजन किस प्रक्रिया द्वारा बनाते हैं?'], choices: [['Photosynthesis', 'प्रकाश संश्लेषण'], ['Evaporation', 'वाष्पीकरण'], ['Gravity', 'गुरुत्वाकर्षण']], answer: 0 },
    { clue: ['What is 15% of 200?', '200 का 15% कितना है?'], choices: [['30', '30'], ['15', '15'], ['45', '45']], answer: 0 },
    { clue: ['Which is the largest ocean?', 'सबसे बड़ा महासागर कौन-सा है?'], choices: [['Pacific', 'प्रशांत'], ['Indian', 'हिंद'], ['Arctic', 'आर्कटिक']], answer: 0 },
  ],
};

function getWeekKey() {
  const date = new Date();
  const first = new Date(date.getFullYear(), 0, 1);
  const week = Math.ceil((((date.getTime() - first.getTime()) / 86400000) + first.getDay() + 1) / 7);
  return `${date.getFullYear()}-W${String(week).padStart(2, '0')}`;
}

function speak(text: string, language: Language) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-US';
  window.speechSynthesis.speak(utterance);
}

export default function ClubPage({ age, language, games, progress, data, onDataChange, preferences, onPreferencesChange, artworks, onRemoveArtwork, minutesToday, online, onPlay, onCoopComplete, onWeeklyComplete, onBack }: Props) {
  const [activeSection, setActiveSection] = useState('journey');
  const [storyChoices, setStoryChoices] = useState([0, 0, 0]);
  const [newStory, setNewStory] = useState<SavedStory | null>(null);
  const [coopRound, setCoopRound] = useState(-1);
  const [coopReady, setCoopReady] = useState(false);
  const [coopFinished, setCoopFinished] = useState(false);
  const [coopMessage, setCoopMessage] = useState('');
  const [parentAnswer, setParentAnswer] = useState('');
  const [parentUnlocked, setParentUnlocked] = useState(false);
  const [parentError, setParentError] = useState(false);
  const [selectedStop, setSelectedStop] = useState(0);
  const weekKey = getWeekKey();
  const ageGames = useMemo(() => games.filter((game) => game.ageBands.includes(age)), [games, age]);
  const weeklyCandidates = ageGames.filter((game) => ['Adventure & Treasure Hunt', 'Animals & Nature', 'Science wonders', 'Puzzle & Logic'].includes(game.subject));
  const weeklyGame = weeklyCandidates.length ? weeklyCandidates[(Number(weekKey.slice(-2)) || 1) % weeklyCandidates.length] : ageGames[0];
  const activeCoopRounds = coopRounds[age];
  const currentCoop = activeCoopRounds[Math.max(0, coopRound)];
  const gamePerformance = Object.values(progress.performance ?? {});
  const totalAttempts = gamePerformance.reduce((sum, item) => sum + item.attempts, 0);
  const totalCorrect = gamePerformance.reduce((sum, item) => sum + item.correct, 0);
  const accuracy = totalAttempts ? Math.round(totalCorrect / totalAttempts * 100) : 0;
  const weakestGame = Object.entries(progress.performance ?? {}).filter(([, score]) => score.attempts >= 3).sort((a, b) => a[1].correct / a[1].attempts - b[1].correct / b[1].attempts)[0];
  const focusSubject = games.find((game) => game.id === weakestGame?.[0])?.subject;
  const recommendedGame = accuracy < 55
    ? ageGames.find((game) => game.subject === focusSubject && ['memory', 'match', 'sequence'].includes(game.mode)) ?? ageGames[0]
    : accuracy >= 80
      ? ageGames.find((game) => ['maze3d', 'space3d', 'adventure', 'puzzle'].includes(game.mode)) ?? ageGames[0]
      : ageGames.find((game) => game.subject === focusSubject) ?? ageGames[0];
  const hero = heroes[storyChoices[0]];
  const place = places[storyChoices[1]];
  const mission = missions[storyChoices[2]];
  const heroName = localizedPair(language, hero);
  const placeName = localizedPair(language, place);
  const missionName = localizedPair(language, mission);
  const tstory = language === 'mr' ? `${heroName} ला ${placeName} येथे एक चमकता नकाशा सापडतो. ${missionName} करण्यासाठी तुमची मदत हवी आहे. वाटेत नवीन मित्र भेटतील, एक मजेदार कोडे सोडवा आणि मिळून छोटासा खजिना शोधा.` : language === 'hi'
    ? `${hero[1]} ${place[1]} में एक चमकता नक्शा पाती है। उसे ${mission[1]} के लिए तुम्हारी मदद चाहिए। रास्ते में एक नए दोस्त से मिलो, मज़ेदार पहेली सुलझाओ और मिलकर एक छोटा खज़ाना ढूँढ़ो।`
    : `${hero[0]} discovers a glowing map in ${place[0]}. Together, you set out to ${mission[0]}. Along the way, meet a new friend, solve a playful puzzle, and find a little treasure to share.`;
  const storyTitle = language === 'mr' ? `${heroName} आणि ${placeName}` : language === 'hi' ? `${hero[1]} और ${place[1]}` : `${hero[0][0].toUpperCase()}${hero[0].slice(1)} and ${place[0]}`;

  useEffect(() => {
    const playlist = data.playlist;
    if (!playlist?.waitingFor || progress.games <= playlist.startedGames || data.lastCompletedGameId !== playlist.waitingFor) return;
    onDataChange({ ...data, playlist: { ...playlist, index: playlist.index + 1, waitingFor: null, startedGames: progress.games } });
  }, [data, onDataChange, progress.games]);

  useEffect(() => {
    const started = data.weeklyStarted;
    if (!weeklyGame || !started || started.key !== weekKey || data.weeklyCompleted.includes(weekKey) || data.lastCompletedGameId !== started.gameId) return;
    onDataChange({ ...data, weeklyStarted: null, weeklyCompleted: [...data.weeklyCompleted, weekKey] });
    onWeeklyComplete();
  }, [data, onDataChange, onWeeklyComplete, weekKey, weeklyGame]);

  function update(partial: Partial<ClubData>) { onDataChange({ ...data, ...partial }); }
  function play(game?: ClubGame) { if (game) onPlay(game); }
  function startPlaylist(id: string, playlistGames: ClubGame[]) {
    if (!playlistGames.length) return;
    onDataChange({ ...data, playlist: { id, gameIds: playlistGames.map((game) => game.id), index: 0, waitingFor: playlistGames[0].id, startedGames: progress.games } });
    play(playlistGames[0]);
  }
  function continuePlaylist(playlistGames: ClubGame[]) {
    const playlist = data.playlist;
    if (!playlist || playlist.index >= playlist.gameIds.length || playlist.waitingFor) return;
    const nextGame = playlistGames.find((game) => game.id === playlist.gameIds[playlist.index]);
    if (!nextGame) return;
    onDataChange({ ...data, playlist: { ...playlist, waitingFor: nextGame.id, startedGames: progress.games } });
    play(nextGame);
  }
  function chooseJourneyStop(index: number) {
    const unlocked = index === 0 || progress.games >= journeyStops[index].after;
    if (!unlocked) return;
    setSelectedStop(index);
    if (!data.visitedStops.includes(index)) update({ visitedStops: [...data.visitedStops, index] });
  }
  function beginWeeklyQuest() {
    if (!weeklyGame) return;
    update({ weeklyStarted: { key: weekKey, gameId: weeklyGame.id } });
    play(weeklyGame);
  }
  function answerCoop(index: number) {
    if (!currentCoop || coopFinished) return;
    if (index === currentCoop.answer) {
      if (coopRound + 1 >= activeCoopRounds.length) {
        setCoopFinished(true);
        setCoopMessage('');
        onCoopComplete();
      } else {
        setCoopMessage(localizedText(language, 'Nice teamwork! You found the right path.', 'शाबाश, टीम! सही रास्ता मिला।'));
        setCoopRound((value) => value + 1);
        setCoopReady(false);
      }
    } else {
      setCoopMessage(localizedText(language, 'That path is a dead end. Read the clue again and think together.', 'कोई बात नहीं। संकेत फिर से पढ़ो और मिलकर सोचो।'));
    }
  }
  function beginCoop() {
    setCoopRound(0);
    setCoopReady(false);
    setCoopFinished(false);
    setCoopMessage('');
  }
  function createStory() {
    setNewStory({ id: crypto.randomUUID(), title: storyTitle, body: tstory, savedAt: new Date().toISOString() });
  }
  function saveStory() {
    if (!newStory) return;
    if (!data.stories.some((story) => story.id === newStory.id)) update({ stories: [newStory, ...data.stories].slice(0, 10) });
  }
  function saveWeeklyDiscovery() {
    if (!data.discoveries.includes(`weekly-${weekKey}`)) update({ discoveries: [...data.discoveries, `weekly-${weekKey}`] });
  }
  function checkParent() {
    if (parentAnswer.trim() === '12') { setParentUnlocked(true); setParentError(false); }
    else setParentError(true);
  }

  return (
    <main className="club-page">
      <header className="club-topbar"><button className="club-back" type="button" onClick={onBack}>← {t(language, 'Back to games')}</button><span className="club-brand">🌿 WonderSprout</span><span className={`club-connection ${online ? 'is-online' : 'is-offline'}`}>{online ? `☁ ${t(language, 'Online (offline ready)')}` : `● ${localizedText(language, 'Offline', 'ऑफ़लाइन')}`}</span></header>
      {!online && <div className="club-offline-note">{t(language, 'Some games need an internet connection the first time you open them.')}</div>}
      {minutesToday >= preferences.dailyLimit && preferences.dailyLimit > 0 && <div className="club-break-note">🌱 {t(language, 'Take a little screen break. Your games and progress will be here when you come back.')}</div>}

      <section className="club-hero">
        <div><span className="club-kicker">{t(language, 'Wonder Club')}</span><h1>{localizedText(language, 'Your next big little adventure!', 'और खेलो, दुनिया बनाओ!')}</h1><p>{localizedText(language, 'Make stories, team up, and build a world from everything you discover.', 'कहानियाँ बनाओ, टीम बनकर खेलो और अपनी खोजों से नई दुनिया सजाओ।')}</p><div className="club-hero-stats"><span>⭐ {progress.stars} {t(language, 'stars')}</span><span>🎮 {progress.games} {t(language, 'games played')}</span><span>{data.avatar} {t(language, 'Explorer avatar')}</span></div></div>
        <div className="club-hero-art" aria-hidden="true"><span>{data.avatar}</span><i>✨</i><b>🌈</b></div>
      </section>

      <section className="club-smart-pick" aria-label={t(language, 'Smart next step')}><span className="smart-pick-icon">{accuracy >= 80 ? '🚀' : accuracy < 55 && totalAttempts >= 3 ? '🌱' : '🧠'}</span><div><span className="club-kicker">{t(language, 'Smart next step')}</span><h2>{accuracy >= 80 ? t(language, 'Ready for a twist?') : accuracy < 55 && totalAttempts >= 3 ? t(language, 'Practice pick') : localizedText(language, 'A good game for right now', 'उम्र के हिसाब से चुना गया खेल')}</h2><p>{totalAttempts < 3 ? t(language, 'Answer a few questions to get a practice pick.') : accuracy < 55 ? t(language, 'A gentle retry and a familiar game can help build confidence.') : accuracy >= 80 ? t(language, 'You are doing great. Try a new kind of challenge next.') : t(language, 'Keep exploring. Your next game is picked for your age.')}</p></div>{recommendedGame && <button className="club-secondary" type="button" onClick={() => play(recommendedGame)}>{recommendedGame.icon} {gameTitle(recommendedGame)} →</button>}</section>

      <nav className="club-jump-nav" aria-label={localizedText(language, 'Wonder Club sections', 'वंडर क्लब के हिस्से')}>
        {[
          ['journey', '🗺️', localizedText(language, 'Journey', 'यात्रा')], ['playlist', '🎒', localizedText(language, 'Playlists', 'सूचियाँ')], ['story', '📖', localizedText(language, 'Story', 'कहानी')], ['world', '🏡', localizedText(language, 'World', 'दुनिया')], ['collection', '🔎', localizedText(language, 'Discover', 'खोज')], ['team', '🤝', localizedText(language, 'Co-op', 'टीम')], ['grownup', '🛡️', localizedText(language, 'Parents', 'बड़े')],
        ].map(([id, icon, label]) => <a key={id} className={activeSection === id ? 'club-jump-active' : ''} href={`#club-${id}`} onClick={() => setActiveSection(id)}><span>{icon}</span>{label}</a>)}
      </nav>

      <section className="club-section journey-section" id="club-journey">
        <div className="club-section-heading"><div><span className="club-kicker">{t(language, 'Your adventure map')}</span><h2>{t(language, 'Five story chapters. One big adventure.')}</h2><p>{t(language, 'Follow Pip through five story chapters. Each stop opens a new little mission.')}</p></div><span className="club-heading-emoji">🧭</span></div>
        <div className="journey-map">
          {journeyStops.map((stop, index) => {
            const unlocked = index === 0 || progress.games >= stop.after;
            const done = data.visitedStops.includes(index);
            return <button key={index} type="button" className={`journey-stop ${unlocked ? '' : 'journey-locked'} ${selectedStop === index ? 'journey-selected' : ''} ${done ? 'journey-visited' : ''}`} onClick={() => chooseJourneyStop(index)} disabled={!unlocked} aria-label={`${t(language, 'Chapter')} ${index + 1}: ${localizedPair(language, stop.title)}${unlocked ? '' : `, ${t(language, 'Finish')} ${stop.after} ${t(language, 'games to unlock')}`}`}><span className="journey-stop-icon">{unlocked ? stop.icon : '🔒'}</span><small>{t(language, 'Chapter')} {index + 1}</small><strong>{localizedPair(language, stop.title)}</strong><i>{done ? '✓' : index === selectedStop ? '●' : '○'}</i></button>;
          })}
        </div>
        <div className="journey-mission"><span>{journeyStops[selectedStop].icon}</span><div><strong>{localizedPair(language, journeyStops[selectedStop].title)}</strong><p>{localizedPair(language, journeyStops[selectedStop].story)}</p></div><button className="club-primary" type="button" onClick={() => play(ageGames.find((game) => game.id === journeyStops[selectedStop].gameId) ?? ageGames.find((game) => game.subject === 'Adventure & Treasure Hunt'))}>{t(language, 'Start this mission')} →</button></div>
        {progress.games < 7 && <small className="club-section-note">{t(language, 'Complete a game to open more stops.')}</small>}
      </section>

      <section className="club-section weekly-section" id="club-weekly">
        <div className="weekly-emblem">🎉</div><div className="weekly-copy"><span className="club-kicker">{t(language, 'This week in WonderSprout')}</span><h2>{localizedText(language, 'A new wonder every week', 'सप्ताह का चमकता मिशन')}</h2><p>{t(language, 'A fresh little quest arrives every week. Finish the featured game to earn a special field-guide stamp.')}</p><div className="weekly-game-name">{weeklyGame?.icon} {weeklyGame ? gameTitle(weeklyGame) : (localizedText(language, 'A new game is on its way', 'नया खेल जल्द आएगा'))}</div></div><div className="weekly-action">{data.weeklyCompleted.includes(weekKey) ? <><strong>🏅 {t(language, 'Weekly stamp earned!')}</strong><button className="club-secondary" type="button" onClick={saveWeeklyDiscovery}>{t(language, 'Collect discovery')}</button></> : <button className="club-primary" type="button" disabled={!weeklyGame} onClick={beginWeeklyQuest}>{t(language, 'Play this week’s quest')} →</button>}</div>
      </section>

      <section className="club-section playlist-section" id="club-playlist">
        <div className="club-section-heading"><div><span className="club-kicker">{t(language, 'Choose a playlist')}</span><h2>{localizedText(language, 'Follow a theme from game to game', 'एक विषय, कई खेल!')}</h2><p>{t(language, 'A little themed trail of games. Finish one and come back for the next.')}</p></div><span className="club-heading-emoji">🎒</span></div>
        <div className="playlist-grid">{playlistOptions.map((option, index) => {
          const playlistGames = ageGames.filter((game) => option.subjects.includes(game.subject)).slice(0, 3);
          const active = data.playlist?.id === option.id ? data.playlist : null;
          const completed = Boolean(active && active.index >= active.gameIds.length);
          return <article className={`playlist-card playlist-card-${index + 1}`} key={option.id}><span className="playlist-icon">{option.icon}</span><div><h3>{localizedPair(language, option.title)}</h3><p>{playlistGames.map(gameTitle).join(' · ') || (localizedText(language, 'Games are getting ready', 'खेल तैयार हो रहे हैं'))}</p></div>{completed ? <strong className="playlist-done">✓ {t(language, 'Trail complete! Pick another playlist.')}</strong> : active && active.index > 0 && !active.waitingFor ? <button className="club-primary" type="button" onClick={() => continuePlaylist(playlistGames)}>{t(language, 'Play next game')} ({active.index + 1}/{active.gameIds.length})</button> : <button className="club-secondary" type="button" disabled={!playlistGames.length || Boolean(active?.waitingFor)} onClick={() => startPlaylist(option.id, playlistGames)}>{active?.waitingFor ? `${gameTitleForId(games, active.waitingFor, language)}…` : t(language, 'Start playlist')} →</button>}</article>;
        })}</div>
      </section>

      <section className="club-section story-section" id="club-story">
        <div className="club-section-heading"><div><span className="club-kicker">{t(language, 'Make a story')}</span><h2>{localizedText(language, 'A story with you in it', 'तुम कहानी के लेखक हो')}</h2><p>{t(language, 'Pick a hero, a place, and a kind mission.')}</p></div><span className="club-heading-emoji">🪄</span></div>
        <div className="story-maker"><div className="story-pickers">{[
          { label: t(language, 'Hero'), values: heroes, value: storyChoices[0] }, { label: t(language, 'Place'), values: places, value: storyChoices[1] }, { label: t(language, 'Mission'), values: missions, value: storyChoices[2] },
        ].map((picker, pickerIndex) => <label key={picker.label}>{picker.label}<select value={picker.value} onChange={(event) => setStoryChoices((old) => old.map((value, index) => index === pickerIndex ? Number(event.target.value) : value))}>{picker.values.map((value, index) => <option key={value[0]} value={index}>{localizedPair(language, value)}</option>)}</select></label>)}</div><button className="club-primary story-create" type="button" onClick={createStory}>{t(language, 'Create my story')} ✨</button>
          {newStory && <article className="story-preview"><span className="story-preview-icon">📜</span><div><h3>{newStory.title}</h3><p>{newStory.body}</p></div><div className="story-preview-actions"><button type="button" className="club-secondary" onClick={() => speak(newStory.body, language)}>🔊 {t(language, 'Read aloud')}</button><button type="button" className="club-secondary" onClick={saveStory}>{t(language, 'Save to story shelf')} ♡</button></div></article>}
        </div>
        {data.stories.length > 0 && <div className="story-shelf"><h3>{t(language, 'Your story shelf')}</h3><div>{data.stories.map((story) => <article key={story.id}><span>📖</span><strong>{story.title}</strong><p>{story.body}</p><button type="button" className="club-text-button" onClick={() => speak(story.body, language)}>🔊 {t(language, 'Read aloud')}</button></article>)}</div></div>}
      </section>

      <section className="club-section world-section" id="club-world">
        <div className="club-section-heading"><div><span className="club-kicker">{t(language, 'Build a wonder world')}</span><h2>{localizedText(language, 'Make a home for your explorer', 'तुम्हारा छोटा-सा संसार')}</h2><p>{t(language, 'Pick decorations to make a home for your explorer. New decorations unlock as you play.')}</p></div><span className="club-heading-emoji">🏡</span></div>
        <div className="world-builder"><div className="world-stage" aria-label={localizedText(language, 'Your decorated wonder world', 'तुम्हारी सजाई हुई दुनिया')}><span className="world-cloud world-cloud-one">☁️</span><span className="world-cloud world-cloud-two">☁️</span><span className="world-avatar">{data.avatar}</span>{decorations.filter((item) => data.decorations.includes(item.id)).map((item) => <span className={`world-decor world-decor-${item.id}`} key={item.id}>{item.icon}</span>)}<span className="world-stage-label">{localizedText(language, 'Pip’s wonder home', 'पिप का घर')}</span></div><div className="world-decor-list"><h3>{t(language, 'Tap to add or remove')}</h3>{decorations.map((item) => { const unlocked = progress.stars >= item.after; const selected = data.decorations.includes(item.id); return <button key={item.id} type="button" disabled={!unlocked} className={`world-decor-choice ${selected ? 'decor-selected' : ''} ${!unlocked ? 'decor-locked' : ''}`} onClick={() => update({ decorations: selected ? data.decorations.filter((id) => id !== item.id) : [...data.decorations, item.id] })}><span>{unlocked ? item.icon : '🔒'}</span><strong>{localizedPair(language, item.title)}</strong>{unlocked ? <small>{selected ? '✓' : '+'}</small> : <small>{t(language, 'Need')} {item.after} ⭐</small>}</button>; })}</div></div>
      </section>

      <section className="club-section collection-section" id="club-collection">
        <div className="club-section-heading"><div><span className="club-kicker">{t(language, 'Discovery field guide')}</span><h2>{localizedText(language, 'Little discoveries, big world', 'हर खोज एक नया पन्ना')}</h2><p>{t(language, 'Collect a new animal, place, or big idea after finishing games.')}</p></div><span className="club-heading-emoji">🔎</span></div>
        <div className="discovery-grid">{discoveries.map((item) => {
          const unlocked = progress.games >= item.after;
          const collected = data.discoveries.includes(item.id);
          return <article key={item.id} className={`discovery-card ${unlocked ? '' : 'discovery-locked'} ${collected ? 'discovery-collected' : ''}`}><span className="discovery-icon">{unlocked ? item.icon : '🔒'}</span><div><h3>{unlocked ? localizedPair(language, item.title) : `???`}</h3><p>{unlocked ? localizedPair(language, item.fact) : `${t(language, 'Finish')} ${item.after} ${t(language, 'games to unlock')}`}</p></div>{unlocked && <button type="button" disabled={collected} onClick={() => update({ discoveries: [...data.discoveries, item.id] })}>{collected ? `✓ ${t(language, 'Collected')}` : t(language, 'Collect discovery')}</button>}</article>;
        })}{data.weeklyCompleted.map((key) => <article key={key} className="discovery-card discovery-collected"><span className="discovery-icon">🏅</span><div><h3>{t(language, 'Weekly stamp earned!')}</h3><p>{key}</p></div><strong>✓ {t(language, 'Collected')}</strong></article>)}</div>
      </section>

      <section className="club-section team-section" id="club-team">
        <div className="club-section-heading"><div><span className="club-kicker">{t(language, 'Team trail')}</span><h2>{localizedText(language, 'Better together', 'मिलकर सबसे अच्छा!')}</h2><p>{t(language, 'Two players, one device, one shared mission. Take turns reading the clue and choosing a path.')}</p></div><span className="club-heading-emoji">🤝</span></div>
        <div className="coop-card">{coopRound < 0 || coopFinished ? <div className="coop-intro"><div className="coop-players"><span>🧑‍🚀</span><span>🤝</span><span>🦊</span></div><p>{t(language, 'Read the clue together, then pass the device to your teammate.')}</p><button className="club-primary" type="button" onClick={beginCoop}>{t(language, coopFinished ? 'Try another team trail' : 'Start team trail')} →</button>{coopFinished && <strong className="coop-win">🏆 {t(language, 'Team treasure found!')}</strong>}</div> : <div className="coop-play"><div className="coop-progress">{activeCoopRounds.map((_, index) => <span key={index} className={index < coopRound ? 'coop-dot-done' : index === coopRound ? 'coop-dot-now' : ''} />)}</div><span className="coop-player-label">{t(language, 'Player')} {coopRound % 2 + 1}</span><h3>{localizedPair(language, currentCoop.clue)}</h3>{!coopReady ? <button className="club-primary" type="button" onClick={() => setCoopReady(true)}>{t(language, 'Pass the device')} →</button> : <div className="coop-answers">{currentCoop.choices.map((choice, index) => <button key={choice[0]} type="button" onClick={() => answerCoop(index)}>{localizedPair(language, choice)}</button>)}</div>}<p className="coop-message" aria-live="polite">{coopMessage}</p></div>}</div>
      </section>

      <section className="club-section collection-tools">
        <div className="club-tool-card avatar-card"><span className="club-kicker">{t(language, 'Explorer avatar')}</span><h2>{t(language, 'Pick a friendly face for your adventures.')}</h2><div className="avatar-picker">{['🦊', '🐰', '🐢', '🐼', '🦄', '🐸', '🐯', '🤖'].map((avatar) => <button type="button" key={avatar} className={data.avatar === avatar ? 'avatar-selected' : ''} onClick={() => update({ avatar })} aria-label={avatar} aria-pressed={data.avatar === avatar}>{avatar}</button>)}</div></div>
        <div className="club-tool-card favorites-card"><span className="club-kicker">{t(language, 'Favorite games')}</span><h2>{localizedText(language, 'Keep your best-loved games close', 'फिर से खेलने के लिए सहेजो')}</h2>{data.favorites.length ? <div className="favorite-list">{data.favorites.map((id) => { const game = ageGames.find((item) => item.id === id) ?? games.find((item) => item.id === id); return game && <div key={id}><span>{game.icon}</span><button type="button" onClick={() => play(game)}>{gameTitle(game)} →</button><button type="button" className="favorite-remove" onClick={() => update({ favorites: data.favorites.filter((favorite) => favorite !== id) })} aria-label={t(language, 'Remove favorite')}>×</button></div>; })}</div> : <p className="club-section-note">{t(language, 'No favorites yet. Tap the heart on a game card to save one.')}</p>}</div>
      </section>

      <section className="club-section gallery-section">
        <div className="club-section-heading"><div><span className="club-kicker">{t(language, 'My art gallery')}</span><h2>{localizedText(language, 'Made by you, saved here', 'तुम्हारी बनाई हुई दुनिया')}</h2><p>{t(language, 'Drawings saved on this device will show up here.')}</p></div><span className="club-heading-emoji">🎨</span></div>
        {artworks.length ? <div className="gallery-grid">{artworks.map((artwork) => <article key={artwork.id}><img src={artwork.image} alt={artwork.title} /><div><strong>{artwork.title}</strong><button type="button" onClick={() => onRemoveArtwork(artwork.id)} aria-label={t(language, 'Remove artwork')}>×</button></div></article>)}</div> : <div className="gallery-empty"><span>🖍️</span>{t(language, 'Drawings saved on this device will show up here.')}</div>}
      </section>

      <section className="club-section grownup-section" id="club-grownup">
        <div className="grownup-lock-icon">🛡️</div><div className="grownup-gate"><span className="club-kicker">{t(language, 'Grown-up corner')}</span><h2>{parentUnlocked ? t(language, 'Parent dashboard') : t(language, 'A little control for grown-ups')}</h2><p>{t(language, 'A quick grown-up check keeps settings away from little hands.')}</p>{!parentUnlocked ? <form className="parent-gate-form" onSubmit={(event) => { event.preventDefault(); checkParent(); }}><label>{t(language, 'Solve 7 + 5 to open settings.')}<input inputMode="numeric" value={parentAnswer} onChange={(event) => setParentAnswer(event.target.value)} aria-label={t(language, 'Solve 7 + 5 to open settings.')} /></label><button type="submit" className="club-secondary">{t(language, 'Check')}</button>{parentError && <small role="alert">{t(language, 'That answer needs a grown-up. Try again.')}</small>}</form> : <div className="parent-dashboard"><div className="parent-stats"><span>⭐ <strong>{progress.stars}</strong> {t(language, 'stars')}</span><span>🎮 <strong>{progress.games}</strong> {t(language, 'Finished games')}</span><span>🧠 <strong>{accuracy}%</strong> {localizedText(language, 'answer accuracy', 'सही जवाब')}</span><span>⏱️ <strong>{minutesToday}</strong> {t(language, 'minutes')}</span></div><label className="parent-limit">{t(language, 'Daily play reminder')}<select value={preferences.dailyLimit} onChange={(event) => onPreferencesChange({ ...preferences, dailyLimit: Number(event.target.value) })}>{[15, 20, 30, 45, 0].map((value) => <option key={value} value={value}>{value ? `${value} ${t(language, 'minutes')}` : t(language, 'No limit')}</option>)}</select></label><div className="accessibility-options"><strong>{t(language, 'Accessibility')}</strong>{([
            ['highContrast', 'High contrast'], ['dyslexicFont', 'Easy-read font'], ['reduceMotion', 'Reduce motion'], ['readAloud', 'Read game clues aloud'],
          ] as const).map(([key, label]) => <label key={key}><span>{t(language, label)}</span><input type="checkbox" checked={preferences[key]} onChange={(event) => onPreferencesChange({ ...preferences, [key]: event.target.checked })} /></label>)}</div><p className="parent-privacy">🔒 {t(language, 'Your choices and creations stay in this browser. No account or child profile is sent anywhere.')}</p><button className="club-text-button" type="button" onClick={() => setParentUnlocked(false)}>{localizedText(language, 'Lock parent corner', 'बंद करें')}</button></div>}</div>
      </section>

      <footer className="club-footer"><span>{data.avatar} {localizedText(language, 'Play, discover, be kind!', 'खेलो, खोजो, दयालु बनो!')}</span><span>{t(language, 'Progress on this device')} · {t(language, 'Today’s play time')}: {minutesToday} {t(language, 'minutes')}</span></footer>
    </main>
  );
}
