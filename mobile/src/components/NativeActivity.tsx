import { router } from 'expo-router';
import { useAudioPlayer } from 'expo-audio';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Body, Button, Card, Heading } from './ui';
import { localizedGame } from '../shared/i18n';
import { API_BASE, useLearning, type Game } from '../store';
import { colors } from '../theme';

export const nativeActivityModes = new Set([
  'memory', 'sequence', 'missing', 'coding', 'loop', 'maze3d', 'space3d',
  'creative', 'monster', 'pixel', 'sudoku', 'piano', 'rhythm', 'sound',
  'sort', 'clock', 'shop', 'balance', 'racing', 'shooting',
]);

type Props = { game: Game };
type ActivityProps = Props & {
  age: string;
  onAnswer: (correct: boolean) => void;
  onFinish: () => void;
};
type MemoryCard = { id: string; pairKey: string; face: string; label: string; fact: string };

export default function NativeActivityScreen({ game }: Props) {
  const { age, language, recordAnswer, finishGame } = useLearning();
  const [finished, setFinished] = useState(false);
  const copy = localizedGame(language, game);
  const artIcon = game.icon || '✨';

  const answer = (correct: boolean) => recordAnswer(game.id, correct);
  const complete = () => {
    if (finished) return;
    finishGame(game.id);
    setFinished(true);
  };

  return <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
    <View style={styles.topbar}>
      <Pressable accessibilityRole="button" accessibilityLabel="Back to games" onPress={() => router.back()} style={styles.backButton}><Text style={styles.backText}>‹</Text></Pressable>
      <Text numberOfLines={1} style={styles.topTitle}>{copy.title}</Text>
      <Text style={styles.ageTag}>{age}</Text>
    </View>
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <View style={styles.heroIcon}><Text style={{ fontSize: 31 }}>{artIcon}</Text></View>
        <View style={styles.heroCopy}><Text style={styles.eyebrow}>TOUCH & PLAY</Text><Heading style={styles.title}>{copy.title}</Heading></View>
        <Body style={styles.description}>{copy.description}</Body>
      </View>
      {finished ? <Card style={styles.finished}><Text style={styles.finishEmoji}>🌟</Text><Heading style={styles.finishTitle}>Wonderful work!</Heading><Body style={styles.finishText}>You finished this activity. Choose another game to keep exploring.</Body><Button title="Explore more games" onPress={() => router.replace('/explore')} style={{ alignSelf: 'stretch', marginTop: 20 }} /></Card> : <ActivityRenderer game={game} age={age} onAnswer={answer} onFinish={complete} />}
    </ScrollView>
  </SafeAreaView>;
}

function ActivityRenderer(props: ActivityProps) {
  switch (props.game.mode) {
    case 'memory': return <MemoryActivity {...props} />;
    case 'sequence': return <SequenceActivity {...props} />;
    case 'missing': return <MissingActivity {...props} />;
    case 'coding': case 'loop': case 'maze3d': case 'space3d': return <MazeActivity {...props} />;
    case 'creative': case 'monster': case 'pixel': return <CreativeActivity {...props} />;
    case 'sudoku': return <SudokuActivity {...props} />;
    case 'piano': return <PianoActivity {...props} />;
    case 'rhythm': return <RhythmActivity {...props} />;
    case 'sound': return <SoundActivity {...props} />;
    case 'sort': return <SortActivity {...props} />;
    case 'clock': return <ClockActivity {...props} />;
    case 'shop': return <ShopActivity {...props} />;
    case 'balance': return <BalanceActivity {...props} />;
    case 'racing': return <RaceActivity {...props} />;
    case 'shooting': return <TargetActivity {...props} />;
    default: return <Card><Body>This activity is ready to play in WonderSprout.</Body></Card>;
  }
}

function ActivityCard({ title, instruction, children }: { title: string; instruction: string; children: React.ReactNode }) {
  return <Card style={styles.activityCard}><Text style={styles.activityEyebrow}>YOUR CHALLENGE</Text><Heading style={styles.activityTitle}>{title}</Heading><Body style={styles.instruction}>{instruction}</Body>{children}</Card>;
}

function Tile({ label, onPress, selected, disabled, tone }: { label: string; onPress: () => void; selected?: boolean; disabled?: boolean; tone?: string }) {
  return <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.tile, selected && styles.tileSelected, disabled && styles.tileDisabled, tone ? { backgroundColor: tone } : null, pressed && !disabled && styles.pressed]}><Text style={[styles.tileText, selected && styles.tileTextSelected]}>{label}</Text></Pressable>;
}

function Progress({ value, total }: { value: number; total: number }) {
  return <View style={styles.progressWrap}><View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${Math.min(100, (value / total) * 100)}%` }]} /></View><Text style={styles.progressLabel}>{Math.min(value, total)} / {total}</Text></View>;
}

function MemoryActivity({ game, age, onAnswer, onFinish }: ActivityProps) {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let active = true;
    fetch(`${API_BASE}/games/${encodeURIComponent(game.id)}/memory-cards?ageBand=${age}`)
      .then((response) => { if (!response.ok) throw new Error('Memory cards unavailable'); return response.json() as Promise<MemoryCard[]>; })
      .then((rows) => { if (active) setCards(shuffle(rows.flatMap((card) => [{ ...card, id: `${card.id}-a` }, { ...card, id: `${card.id}-b` }]))); })
      .catch(() => { if (active) setCards(shuffle([
        { id: 'bee-a', pairKey: 'bee', face: '🐝', label: 'Bee', fact: 'Bees carry pollen between flowers.' },
        { id: 'bee-b', pairKey: 'bee', face: '🐝', label: 'Bee', fact: 'Bees carry pollen between flowers.' },
        { id: 'leaf-a', pairKey: 'leaf', face: '🍃', label: 'Leaf', fact: 'Leaves help a plant use sunlight.' },
        { id: 'leaf-b', pairKey: 'leaf', face: '🍃', label: 'Leaf', fact: 'Leaves help a plant use sunlight.' },
        { id: 'moon-a', pairKey: 'moon', face: '🌙', label: 'Moon', fact: 'The Moon travels around Earth.' },
        { id: 'moon-b', pairKey: 'moon', face: '🌙', label: 'Moon', fact: 'The Moon travels around Earth.' },
        { id: 'frog-a', pairKey: 'frog', face: '🐸', label: 'Frog', fact: 'Frogs begin life as tadpoles.' },
        { id: 'frog-b', pairKey: 'frog', face: '🐸', label: 'Frog', fact: 'Frogs begin life as tadpoles.' },
      ])); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; if (timer.current) clearTimeout(timer.current); };
  }, [age, game.id]);

  const flip = (index: number) => {
    if (open.includes(index) || matched.includes(index) || open.length === 2) return;
    const next = [...open, index];
    setOpen(next);
    if (next.length !== 2) return;
    setMoves((count) => count + 1);
    const isMatch = cards[next[0]]?.pairKey === cards[next[1]]?.pairKey;
    onAnswer(isMatch);
    if (isMatch) {
      const joined = [...matched, ...next];
      setMatched(joined);
      setOpen([]);
      if (joined.length === cards.length) onFinish();
    } else {
      timer.current = setTimeout(() => setOpen([]), 850);
    }
  };

  return <ActivityCard title="Flip & find" instruction="Turn over two cards at a time. Match the pictures and remember their fun facts.">
    {loading ? <Body style={{ textAlign: 'center', padding: 18 }}>Loading memory cards…</Body> : <>
      <View style={styles.memoryMeta}><Text style={styles.counter}>{matched.length / 2} pairs found</Text><Text style={styles.counter}>{moves} moves</Text></View>
      <View style={styles.memoryGrid}>{cards.map((card, index) => {
        const faceUp = open.includes(index) || matched.includes(index);
        return <Pressable key={card.id} accessibilityRole="button" accessibilityLabel={faceUp ? card.label : 'Face-down memory card'} onPress={() => flip(index)} style={[styles.memoryTile, faceUp && styles.memoryFaceUp, matched.includes(index) && styles.memoryMatched]}><Text style={styles.memoryFace}>{faceUp ? card.face : '✦'}</Text><Text numberOfLines={1} style={styles.memoryLabel}>{faceUp ? card.label : 'Tap'}</Text></Pressable>;
      })}</View>
      {matched.length ? <Body style={styles.fact}>{cards[matched[matched.length - 1]]?.fact}</Body> : null}
      <Progress value={matched.length / 2} total={Math.max(1, cards.length / 2)} />
    </>}
  </ActivityCard>;
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [result[index], result[swap]] = [result[swap], result[index]];
  }
  return result;
}

const sequencePlans: Record<string, string[]> = {
  'arrange-the-days': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  'morning-routine': ['Wake up', 'Get dressed', 'Brush teeth', 'Eat breakfast'],
  'follow-the-movement': ['Reach up', 'Clap twice', 'Turn around', 'March in place'],
  'story-pictures': ['A seed is planted', 'A sprout appears', 'Leaves grow', 'A flower blooms'],
  'garden-grower': ['Fill a pot with soil', 'Plant a seed', 'Water it gently', 'Give it sunlight'],
};

function SequenceActivity({ game, onAnswer, onFinish }: ActivityProps) {
  const order = sequencePlans[game.id] ?? ['Look for a clue', 'Make a plan', 'Try the plan', 'Check the result'];
  const [position, setPosition] = useState(0);
  const options = useMemo(() => shuffle(order), [game.id]);
  const [feedback, setFeedback] = useState('Tap the step that should come next.');

  const choose = (choice: string) => {
    const correct = choice === order[position];
    onAnswer(correct);
    if (!correct) { setFeedback('Good try. Think about what happens first, next, and last.'); return; }
    setFeedback(`${choice} — just right!`);
    if (position + 1 === order.length) { onFinish(); return; }
    setPosition((current) => current + 1);
  };

  return <ActivityCard title="Put it in order" instruction="Build the sequence one step at a time. Choose what should happen next.">
    <Progress value={position} total={order.length} />
    <View style={styles.orderList}>{order.map((step, index) => <View key={step} style={[styles.orderRow, index < position && styles.orderDone]}><Text style={styles.orderNumber}>{index < position ? '✓' : index + 1}</Text><Text style={styles.orderText}>{index < position ? step : index === position ? 'Choose this next…' : '???'}</Text></View>)}</View>
    <Text style={styles.feedback}>{feedback}</Text>
    <View style={styles.choiceWrap}>{options.map((item) => <Tile key={item} label={item} onPress={() => choose(item)} />)}</View>
  </ActivityCard>;
}

const missingRounds = [
  { scene: ['🐚', '🪸', '🐠', '⭐', '🦀', '🫧'], answer: '🐠' },
  { scene: ['🍎', '🥕', '🍌', '🥦', '🍇', '🥛'], answer: '🥦' },
  { scene: ['🚲', '🪖', '🚦', '🛣️', '🦺', '🛑'], answer: '🪖' },
  { scene: ['🌳', '🐦', '🍄', '🦋', '🌼', '🐿️'], answer: '🌼' },
  { scene: ['📚', '✏️', '🎒', '📏', '🖍️', '🧩'], answer: '📏' },
];

function MissingActivity({ onAnswer, onFinish }: ActivityProps) {
  const [round, setRound] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [message, setMessage] = useState('Study the scene, then hide one picture.');
  const task = missingRounds[round];
  const choose = (option: string) => {
    const correct = option === task.answer;
    onAnswer(correct);
    setMessage(correct ? 'You remembered it!' : 'Not that one. Look closely at the scene.');
    if (!correct) return;
    if (round + 1 === missingRounds.length) { onFinish(); return; }
    setTimeout(() => { setRound((value) => value + 1); setHidden(false); setMessage('Study the scene, then hide one picture.'); }, 450);
  };
  return <ActivityCard title="What went missing?" instruction="Look carefully at each little scene. Hide one picture, then choose the missing thing.">
    <Progress value={round} total={missingRounds.length} />
    <View style={styles.sceneGrid}>{task.scene.filter((item) => !hidden || item !== task.answer).map((item, index) => <View key={`${round}-${item}-${index}`} style={styles.sceneItem}><Text style={styles.sceneEmoji}>{item}</Text></View>)}</View>
    {!hidden ? <Button title="Hide one picture" onPress={() => { setHidden(true); setMessage('Which picture disappeared?'); }} style={{ marginTop: 15 }} /> : <View style={styles.choiceWrap}>{task.scene.map((item, index) => <Tile key={`${item}-${index}`} label={item} onPress={() => choose(item)} />)}</View>}
    <Text style={styles.feedback}>{message}</Text>
  </ActivityCard>;
}

const movement = { right: [1, 0], left: [-1, 0], down: [0, 1], up: [0, -1] } as const;
type Direction = keyof typeof movement;

function MazeActivity({ game, onAnswer, onFinish }: ActivityProps) {
  const [commands, setCommands] = useState<Direction[]>([]);
  const [position, setPosition] = useState<[number, number]>([0, 0]);
  const [message, setMessage] = useState('Add movement commands, then run your program.');
  const goal: [number, number] = game.mode === 'space3d' ? [3, 2] : game.mode === 'maze3d' ? [3, 3] : [3, 2];
  const walls = game.mode === 'maze3d' ? [5, 6, 9] : game.mode === 'space3d' ? [5, 9] : [5, 6];
  const isLoop = game.mode === 'loop';
  const isArcade = game.mode === 'maze3d' || game.mode === 'space3d';
  const symbols: Record<Direction, string> = { right: '→', left: '←', down: '↓', up: '↑' };

  const run = () => {
    const route = commands.flatMap((command) => isLoop ? [command, command] : [command]);
    let [x, y] = [0, 0];
    let hitWall = false;
    for (const command of route) {
      const delta = movement[command];
      const nextX = Math.max(0, Math.min(3, x + delta[0]));
      const nextY = Math.max(0, Math.min(3, y + delta[1]));
      if (walls.includes(nextY * 4 + nextX)) { hitWall = true; break; }
      x = nextX; y = nextY;
    }
    const success = !hitWall && x === goal[0] && y === goal[1];
    onAnswer(success);
    setPosition([x, y]);
    setMessage(success ? 'The explorer reached the goal. Program complete!' : hitWall ? 'A wall blocked that route. Change the commands and try again.' : `The explorer stopped on row ${y + 1}, column ${x + 1}. Edit the commands and try again.`);
    if (success) onFinish();
  };

  return <ActivityCard title={isArcade ? (game.mode === 'space3d' ? 'Space rescue route' : 'Crystal cave maze') : isLoop ? 'Repeat loop challenge' : 'Code the route'} instruction={isArcade ? 'Guide your explorer through a touch-controlled maze and reach the glowing exit.' : isLoop ? 'Build a short program. The repeat block runs each command twice.' : 'Add arrows to the program and guide the little robot to its star.'}>
    <View style={styles.maze}>
      {Array.from({ length: 16 }, (_, index) => {
        const x = index % 4; const y = Math.floor(index / 4);
        const here = position[0] === x && position[1] === y;
        const isGoal = goal[0] === x && goal[1] === y;
        const isWall = walls.includes(index);
        return <View key={index} style={[styles.mazeCell, isGoal && styles.mazeGoal, isWall && styles.mazeWall, here && styles.mazeHere]}><Text style={styles.mazeGlyph}>{here ? (game.mode === 'space3d' ? '🚀' : '🤖') : isGoal ? '⭐' : isWall ? '🪨' : ''}</Text></View>;
      })}
    </View>
    <View style={styles.programLine}><Text style={styles.programLabel}>PROGRAM</Text><Text style={styles.programText}>{commands.length ? commands.map((item) => symbols[item]).join('   ') : 'Add arrows below'}</Text>{isLoop && commands.length ? <Text style={styles.loopTag}>×2</Text> : null}</View>
    <View style={styles.commandGrid}>{(['up', 'left', 'down', 'right'] as Direction[]).map((command) => <Tile key={command} label={symbols[command]} onPress={() => { if (commands.length < 8) { setCommands((items) => [...items, command]); setMessage('Command added. Add another or run your program.'); } }} />)}</View>
    <View style={styles.actionRow}><Button title="Undo" secondary onPress={() => setCommands((items) => items.slice(0, -1))} style={{ flex: 1 }} /><Button title="Clear" secondary onPress={() => { setCommands([]); setPosition([0, 0]); }} style={{ flex: 1 }} /></View>
    <Button title="Run program" onPress={run} disabled={!commands.length} style={{ marginTop: 10 }} />
    <Text style={styles.feedback}>{message}</Text>
  </ActivityCard>;
}

const paintColors = ['#70B77E', '#FFD166', '#69B8E8', '#F28F8F', '#A68BE0', '#FFFFFF'];

function CreativeActivity({ game, onFinish }: ActivityProps) {
  const [paint, setPaint] = useState<string[]>(Array.from({ length: 25 }, () => '#FFFFFF'));
  const [color, setColor] = useState(paintColors[0]);
  const isMonster = game.mode === 'monster';
  const isPixel = game.mode === 'pixel';
  const filled = paint.filter((cell) => cell !== '#FFFFFF').length;
  const emoji = isMonster ? '👾' : isPixel ? '🟪' : '🎨';
  return <ActivityCard title={isMonster ? 'Create a creature' : isPixel ? 'Pixel picture studio' : 'Little art studio'} instruction={isMonster ? 'Choose colors and tap the grid to design a friendly creature.' : isPixel ? 'Pick a color and tap the squares to make a tiny pixel picture.' : 'Pick a color and tap the canvas to make your own picture.'}>
    <View style={styles.artPreview}><Text style={{ fontSize: 40 }}>{emoji}</Text><Text style={styles.artCount}>{filled} painted squares</Text></View>
    <View style={styles.palette}>{paintColors.map((swatch) => <Pressable key={swatch} accessibilityRole="button" accessibilityLabel={`Select ${swatch}`} onPress={() => setColor(swatch)} style={[styles.swatch, { backgroundColor: swatch }, color === swatch && styles.swatchSelected]} />)}</View>
    <View style={styles.canvas}>{paint.map((cell, index) => <Pressable key={index} accessibilityRole="button" accessibilityLabel={`Paint square ${index + 1}`} onPress={() => setPaint((items) => items.map((current, cellIndex) => cellIndex === index ? color : current))} style={[styles.canvasCell, { backgroundColor: cell }]} />)}</View>
    <Button title="Save my creation" onPress={onFinish} disabled={filled < 3} style={{ marginTop: 17 }} />
    <Text style={styles.feedback}>{filled < 3 ? 'Paint at least three squares, then save your picture.' : 'Your colors are looking wonderful!'}</Text>
  </ActivityCard>;
}

const sudokuSolution = [1, 2, 3, 4, 3, 4, 1, 2, 2, 1, 4, 3, 4, 3, 2, 1];
const sudokuClues = [1, 0, 3, 4, 0, 4, 0, 2, 2, 0, 4, 0, 0, 3, 0, 1];

function SudokuActivity({ onAnswer, onFinish }: ActivityProps) {
  const [values, setValues] = useState(sudokuClues);
  const [active, setActive] = useState(1);
  const [message, setMessage] = useState('Choose a blank square, then pick a number.');
  const choose = (number: number) => {
    if (values[active] !== 0) return;
    const correct = sudokuSolution[active] === number;
    onAnswer(correct);
    if (!correct) { setMessage('That number does not fit this square. Try another.'); return; }
    const next = values.map((value, index) => index === active ? number : value);
    setValues(next);
    setMessage('Nice logic!');
    const blank = next.findIndex((value) => value === 0);
    if (blank < 0) { onFinish(); return; }
    setActive(blank);
  };
  return <ActivityCard title="4 × 4 number puzzle" instruction="Fill the empty squares. Each row and column needs 1, 2, 3, and 4 once.">
    <View style={styles.sudokuGrid}>{values.map((value, index) => <Pressable key={index} accessibilityRole="button" onPress={() => value === 0 && setActive(index)} style={[styles.sudokuCell, (Math.floor(index / 4) === 1) && styles.sudokuBottomLine, (index % 4 === 1) && styles.sudokuRightLine, active === index && styles.sudokuActive]}><Text style={[styles.sudokuNumber, value === 0 && styles.sudokuEmpty]}>{value || '·'}</Text></Pressable>)}</View>
    <View style={styles.numberRow}>{[1, 2, 3, 4].map((number) => <Tile key={number} label={String(number)} onPress={() => choose(number)} />)}</View>
    <Text style={styles.feedback}>{message}</Text>
  </ActivityCard>;
}

const pianoSound = require('../../assets/piano-tone.wav');
const birdSound = require('../../assets/bird-clue.wav');
const frogSound = require('../../assets/frog-clue.wav');
const cowSound = require('../../assets/cow-clue.wav');
const fluteSound = require('../../assets/flute-clue.wav');
const violinSound = require('../../assets/violin-clue.wav');
const drumSound = require('../../assets/drum-clue.wav');
const noteRates = [0.75, 0.84, 0.94, 1, 1.12, 1.26, 1.41];
const noteNames = ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Ti'];

function playAudio(player: ReturnType<typeof useAudioPlayer>, source: number, rate = 1) {
  try {
    player.pause();
    player.replace(source);
    player.playbackRate = rate;
    player.shouldCorrectPitch = false;
    player.seekTo(0);
    player.play();
  } catch { /* Quietly continue if this device cannot play audio. */ }
}

function PianoActivity({ onFinish }: ActivityProps) {
  const player = useAudioPlayer(pianoSound);
  const [played, setPlayed] = useState<number[]>([]);
  const tapKey = (index: number) => {
    playAudio(player, pianoSound, noteRates[index]);
    setPlayed((items) => [...items, index]);
  };
  return <ActivityCard title="Mini piano" instruction="Tap the colorful keys to make your own little tune. Play five notes to finish your music round.">
    <View style={styles.notePrompt}><Text style={styles.noteEmoji}>🎹</Text><Text style={styles.noteText}>{played.length ? `Your tune: ${played.map((note) => noteNames[note]).join(' · ')}` : 'Your keyboard is ready!'}</Text></View>
    <View style={styles.pianoKeys}>{noteNames.map((name, index) => <Pressable key={name} accessibilityRole="button" accessibilityLabel={`Play ${name}`} onPress={() => tapKey(index)} style={[styles.pianoKey, { borderBottomColor: paintColors[index % paintColors.length] }]}><Text style={styles.keyName}>{name}</Text></Pressable>)}</View>
    <Button title="Finish my tune" onPress={onFinish} disabled={played.length < 5} style={{ marginTop: 18 }} />
    <Text style={styles.feedback}>{played.length < 5 ? `${Math.max(0, 5 - played.length)} more notes to make a tune.` : 'Lovely melody!'}</Text>
  </ActivityCard>;
}

const rhythmPattern = [0, 2, 1, 0];

function RhythmActivity({ onAnswer, onFinish }: ActivityProps) {
  const player = useAudioPlayer(pianoSound);
  const [taps, setTaps] = useState<number[]>([]);
  const [message, setMessage] = useState('Listen to the beat, then tap it back.');
  const beatNames = ['Clap', 'Tap', 'Stomp'];
  const replay = async () => {
    setMessage('Listen closely…');
    for (const beat of rhythmPattern) {
      playAudio(player, pianoSound, noteRates[beat + 1]);
      await new Promise((resolve) => setTimeout(resolve, 540));
    }
    setMessage('Your turn! Tap the same rhythm.');
  };
  const tap = (beat: number) => {
    const next = [...taps, beat];
    const correct = rhythmPattern[next.length - 1] === beat;
    onAnswer(correct);
    if (!correct) { setTaps([]); setMessage('Almost! Listen again, then try the pattern.'); return; }
    setTaps(next);
    setMessage('Good beat!');
    if (next.length === rhythmPattern.length) { onFinish(); return; }
  };
  return <ActivityCard title="Repeat the rhythm" instruction="Press play to hear a four-beat pattern. Copy it in the same order.">
    <Button title="▶  Play the rhythm" secondary onPress={() => void replay()} />
    <View style={styles.beatTrack}>{rhythmPattern.map((beat, index) => <View key={index} style={[styles.beatDot, index < taps.length && styles.beatDone]}><Text style={styles.beatEmoji}>{['👏', '👆', '🦶'][beat]}</Text></View>)}</View>
    <View style={styles.choiceWrap}>{beatNames.map((name, index) => <Tile key={name} label={`${['👏', '👆', '🦶'][index]}  ${name}`} onPress={() => tap(index)} />)}</View>
    <Text style={styles.feedback}>{message}</Text>
  </ActivityCard>;
}

function SoundActivity({ game, onAnswer, onFinish }: ActivityProps) {
  const player = useAudioPlayer(pianoSound);
  const instruments = game.id === 'guess-instrument';
  const choices = instruments ? [
    { name: 'Flute', source: fluteSound }, { name: 'Drum', source: drumSound }, { name: 'Violin', source: violinSound },
  ] : [
    { name: 'Bird', source: birdSound }, { name: 'Frog', source: frogSound }, { name: 'Cow', source: cowSound },
  ];
  const [round, setRound] = useState(0);
  const targetIndex = round % choices.length;
  const [message, setMessage] = useState('Play the clue, listen carefully, then choose.');
  const choose = (index: number) => {
    const correct = index === targetIndex;
    onAnswer(correct);
    setMessage(correct ? `That was the ${choices[index].name} sound!` : 'Listen once more and try again.');
    if (!correct) return;
    if (round + 1 === choices.length) { onFinish(); return; }
    setRound((value) => value + 1);
  };
  return <ActivityCard title={instruments ? 'Sound detective' : 'Listen and guess'} instruction={instruments ? 'Listen to each sound clue and find the instrument that made it.' : 'Listen to the nature clue and choose the animal you think made the sound.'}>
    <View style={styles.notePrompt}><Text style={styles.noteEmoji}>🔊</Text><Text style={styles.noteText}>{instruments ? 'Which instrument do you hear?' : 'Which animal do you hear?'}</Text></View>
    <Progress value={round} total={choices.length} />
    <Button title="▶  Play sound clue" secondary onPress={() => playAudio(player, choices[targetIndex].source)} />
    <View style={styles.choiceWrap}>{choices.map((choice, index) => <Tile key={choice.name} label={choice.name} onPress={() => choose(index)} />)}</View>
    <Text style={styles.feedback}>{message}</Text>
  </ActivityCard>;
}

type SortItem = { icon: string; label: string; bucket: string };
const sortSets: Record<string, { buckets: string[]; items: SortItem[]; title: string }> = {
  'healthy-food-sort': { title: 'Everyday or sometimes?', buckets: ['Everyday', 'Sometimes'], items: [
    { icon: '🍎', label: 'Apple', bucket: 'Everyday' }, { icon: '🍬', label: 'Candy', bucket: 'Sometimes' },
    { icon: '🥕', label: 'Carrot', bucket: 'Everyday' }, { icon: '🍟', label: 'Fries', bucket: 'Sometimes' },
    { icon: '🥦', label: 'Broccoli', bucket: 'Everyday' }, { icon: '🍪', label: 'Cookie', bucket: 'Sometimes' },
  ] },
  'clean-your-room': { title: 'Tidy-up sort!', buckets: ['Put away', 'Keep out'], items: [
    { icon: '🧸', label: 'Teddy', bucket: 'Put away' }, { icon: '📚', label: 'Book', bucket: 'Keep out' },
    { icon: '🧦', label: 'Socks', bucket: 'Put away' }, { icon: '🧩', label: 'Puzzle', bucket: 'Put away' },
    { icon: '✏️', label: 'Pencil', bucket: 'Keep out' }, { icon: '🚂', label: 'Toy train', bucket: 'Put away' },
  ] },
  'needs-vs-wants': { title: 'Need or want?', buckets: ['Need', 'Want'], items: [
    { icon: '🥗', label: 'Food', bucket: 'Need' }, { icon: '🎮', label: 'Game', bucket: 'Want' },
    { icon: '🏠', label: 'Home', bucket: 'Need' }, { icon: '🍭', label: 'Treat', bucket: 'Want' },
    { icon: '👟', label: 'Shoes', bucket: 'Need' }, { icon: '🧸', label: 'Toy', bucket: 'Want' },
  ] },
  'recycling-rescue': { title: 'Park recycling rescue', buckets: ['Recycle', 'Compost', 'Reuse'], items: [
    { icon: '📰', label: 'Newspaper', bucket: 'Recycle' }, { icon: '🍌', label: 'Banana peel', bucket: 'Compost' },
    { icon: '🫙', label: 'Glass jar', bucket: 'Reuse' }, { icon: '📦', label: 'Cardboard', bucket: 'Recycle' },
    { icon: '🍂', label: 'Dry leaves', bucket: 'Compost' }, { icon: '🛍️', label: 'Cloth bag', bucket: 'Reuse' },
  ] },
};

function SortActivity({ game, onAnswer, onFinish }: ActivityProps) {
  const activity = sortSets[game.id] ?? sortSets['healthy-food-sort'];
  const [index, setIndex] = useState(0);
  const [message, setMessage] = useState('Choose the best group for each picture.');
  const item = activity.items[index];
  const sort = (bucket: string) => {
    const correct = item.bucket === bucket;
    onAnswer(correct);
    setMessage(correct ? `Great sorting — ${item.label} belongs in ${bucket}.` : 'Try again. Think about what this item is used for.');
    if (!correct) return;
    if (index + 1 === activity.items.length) { onFinish(); return; }
    setIndex((value) => value + 1);
  };
  return <ActivityCard title={activity.title} instruction="Look at the item and tap the group where it belongs.">
    <Progress value={index} total={activity.items.length} />
    <View style={styles.sortObject}><Text style={styles.sortEmoji}>{item.icon}</Text><Text style={styles.sortName}>{item.label}</Text></View>
    <View style={styles.bucketRow}>{activity.buckets.map((bucket) => <Tile key={bucket} label={bucket} onPress={() => sort(bucket)} />)}</View>
    <Text style={styles.feedback}>{message}</Text>
  </ActivityCard>;
}

const clockTargets: [number, number][] = [[3, 0], [6, 30], [9, 15]];
function clockLabel(hour: number, minute: number) { return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`; }

function ClockActivity({ onAnswer, onFinish }: ActivityProps) {
  const [round, setRound] = useState(0);
  const [hour, setHour] = useState(12);
  const [minute, setMinute] = useState(0);
  const [message, setMessage] = useState('Use the arrows to set the time.');
  const [targetHour, targetMinute] = clockTargets[round];
  const check = () => {
    const correct = hour === targetHour && minute === targetMinute;
    onAnswer(correct);
    setMessage(correct ? 'The clock is set just right!' : 'Keep adjusting the hands and try again.');
    if (!correct) return;
    if (round + 1 === clockTargets.length) { onFinish(); return; }
    setRound((value) => value + 1);
    setHour(12); setMinute(0);
  };
  return <ActivityCard title="Set the clock" instruction="Match the digital time shown by changing the hour and minute hands.">
    <Progress value={round} total={clockTargets.length} />
    <View style={styles.clockTarget}><Text style={styles.clockCaption}>SET THE CLOCK TO</Text><Text style={styles.clockTime}>{clockLabel(targetHour, targetMinute)}</Text></View>
    <View style={styles.clockFace}><Text style={styles.clockFaceEmoji}>🕒</Text><Text style={styles.clockFaceTime}>{clockLabel(hour, minute)}</Text></View>
    <View style={styles.clockControl}><Text style={styles.clockControlLabel}>Hour</Text><Button title="−" secondary onPress={() => setHour((value) => (value + 10) % 12 + 1)} /><Text style={styles.clockValue}>{hour}</Text><Button title="+" secondary onPress={() => setHour((value) => value % 12 + 1)} /></View>
    <View style={styles.clockControl}><Text style={styles.clockControlLabel}>Minutes</Text><Button title="−" secondary onPress={() => setMinute((value) => (value + 55) % 60)} /><Text style={styles.clockValue}>{String(minute).padStart(2, '0')}</Text><Button title="+" secondary onPress={() => setMinute((value) => (value + 5) % 60)} /></View>
    <Button title="Check the clock" onPress={check} style={{ marginTop: 17 }} />
    <Text style={styles.feedback}>{message}</Text>
  </ActivityCard>;
}

function ShopActivity({ game, onAnswer, onFinish }: ActivityProps) {
  const goal = game.id === 'pizza-chef-shop' ? 25 : game.id === 'virtual-shop' ? 18 : 20;
  const [coins, setCoins] = useState<number[]>([]);
  const [message, setMessage] = useState('Add coins until you reach your goal exactly.');
  const total = coins.reduce((sum, coin) => sum + coin, 0);
  const addCoin = (value: number) => {
    const nextTotal = total + value;
    const correct = nextTotal === goal;
    onAnswer(nextTotal <= goal);
    if (nextTotal > goal) { setMessage('That is a little too much. Remove a coin and try again.'); return; }
    setCoins((items) => [...items, value]);
    setMessage(nextTotal === goal ? 'Goal reached! Great planning.' : `${goal - nextTotal} more to reach the goal.`);
    if (correct) onFinish();
  };
  return <ActivityCard title={game.id === 'pizza-chef-shop' ? 'Pizza budget' : 'Coin-counting shop'} instruction="Choose pretend coins and add their values to meet your goal exactly.">
    <View style={styles.shopGoal}><Text style={styles.goalLabel}>GOAL</Text><Text style={styles.goalAmount}>{goal} coins</Text><Text style={styles.savedAmount}>Saved: {total}</Text></View>
    <View style={styles.coinRow}>{[1, 2, 5, 10].map((value) => <Pressable key={value} accessibilityRole="button" onPress={() => addCoin(value)} style={styles.coin}><Text style={styles.coinIcon}>🪙</Text><Text style={styles.coinValue}>+{value}</Text></Pressable>)}</View>
    <View style={styles.savedCoins}>{coins.length ? coins.map((coin, index) => <Text key={`${index}-${coin}`} style={styles.savedCoin}>{coin}</Text>) : <Text style={styles.mutedSmall}>Tap a coin to start saving.</Text>}</View>
    <Button title="Remove last coin" secondary disabled={!coins.length} onPress={() => { setCoins((items) => items.slice(0, -1)); setMessage('Coin removed. Try a different plan.'); }} style={{ marginTop: 16 }} />
    <Text style={styles.feedback}>{message}</Text>
  </ActivityCard>;
}

function BalanceActivity({ onAnswer, onFinish }: ActivityProps) {
  const [round, setRound] = useState(0);
  const [balance, setBalance] = useState(5);
  const [message, setMessage] = useState('Move the marker close to the middle to balance the seesaw.');
  const check = () => {
    const correct = Math.abs(balance) <= 1;
    onAnswer(correct);
    setMessage(correct ? 'Balanced! You held the seesaw steady.' : balance < 0 ? 'A little to the right!' : 'A little to the left!');
    if (!correct) return;
    if (round + 1 === 3) { onFinish(); return; }
    setRound((value) => value + 1);
    setBalance(round === 0 ? -4 : 4);
  };
  return <ActivityCard title="Balance the seesaw" instruction="Use the arrows to bring the marker to the center, then hold it there.">
    <Progress value={round} total={3} />
    <View style={styles.seesaw}><Text style={styles.seesawEmoji}>🌳</Text><View style={[styles.seesawBoard, { transform: [{ rotate: `${balance * 2}deg` }] }]}><View style={[styles.balanceMarker, { left: `${50 + balance * 8}%` }]} /></View><Text style={styles.seesawEmoji}>🦊</Text></View>
    <View style={styles.balanceControls}><Button title="← Move left" secondary onPress={() => setBalance((value) => Math.max(-5, value - 1))} style={{ flex: 1 }} /><Button title="Move right →" secondary onPress={() => setBalance((value) => Math.min(5, value + 1))} style={{ flex: 1 }} /></View>
    <Text style={styles.feedback}>{message}</Text>
    <Button title="Hold it steady" onPress={check} style={{ marginTop: 10 }} />
  </ActivityCard>;
}

const lanes = ['left', 'center', 'right'] as const;
type Lane = typeof lanes[number];
const safeRaceLanes: Lane[] = ['center', 'left', 'right', 'center', 'left'];

function RaceActivity({ onAnswer, onFinish }: ActivityProps) {
  const [stage, setStage] = useState(0);
  const [lane, setLane] = useState<Lane>('center');
  const [message, setMessage] = useState('Steer into the clear lane to avoid puddles and collect stars.');
  const safeLane = safeRaceLanes[stage];
  const choose = (nextLane: Lane) => {
    const correct = nextLane === safeLane;
    onAnswer(correct);
    setLane(nextLane);
    setMessage(correct ? 'Great steering! A star for you.' : 'Splash! Try the clear lane on this track.');
    if (!correct) return;
    if (stage + 1 === safeRaceLanes.length) { onFinish(); return; }
    setStage((value) => value + 1);
  };
  return <ActivityCard title="Wonder kart rally" instruction="Read the track, then tap a lane to steer around the puddle and collect a star.">
    <Progress value={stage} total={safeRaceLanes.length} />
    <View style={styles.track}><View style={styles.trackLane}><Text style={styles.trackThing}>{safeLane === 'left' ? '⭐' : '💧'}</Text></View><View style={styles.trackLane}><Text style={styles.trackThing}>{safeLane === 'center' ? '⭐' : '💧'}</Text></View><View style={styles.trackLane}><Text style={styles.trackThing}>{safeLane === 'right' ? '⭐' : '💧'}</Text></View></View>
    <View style={styles.kartLane}><Text style={styles.kart}>🏎️</Text><Text style={styles.mutedSmall}>Your kart is in the {lane} lane</Text></View>
    <View style={styles.laneChoices}>{lanes.map((item) => <Tile key={item} label={item === 'left' ? '⬅ Left' : item === 'right' ? 'Right ➡' : '↑ Center'} onPress={() => choose(item)} />)}</View>
    <Text style={styles.feedback}>{message}</Text>
  </ActivityCard>;
}

function TargetActivity({ onAnswer, onFinish }: ActivityProps) {
  const [hits, setHits] = useState(0);
  const [message, setMessage] = useState('Tap the glowing star. Watch out for the decoy shapes.');
  const target = (hits * 5 + 3) % 9;
  const tap = (index: number) => {
    const correct = index === target;
    onAnswer(correct);
    setMessage(correct ? 'Star collected! Find the next one.' : 'That was a friendly decoy. Try the glowing star.');
    if (!correct) return;
    if (hits + 1 === 7) { onFinish(); return; }
    setHits((value) => value + 1);
  };
  return <ActivityCard title="Sparkle target practice" instruction="Tap seven friendly stars in the target field. There are no enemies, only shapes and sparkles.">
    <Progress value={hits} total={7} />
    <View style={styles.targetGrid}>{Array.from({ length: 9 }, (_, index) => <Pressable key={index} accessibilityRole="button" accessibilityLabel={index === target ? 'Star target' : 'Colorful shape'} onPress={() => tap(index)} style={[styles.targetCell, index === target && styles.targetActive]}><Text style={styles.targetEmoji}>{index === target ? '⭐' : ['🔵', '🔺', '🟢', '🟡', '💠', '🟣', '🔶', '🟦'][index % 8]}</Text></Pressable>)}</View>
    <Text style={styles.feedback}>{message}</Text>
  </ActivityCard>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  topbar: { minHeight: 58, paddingHorizontal: 17, flexDirection: 'row', alignItems: 'center', gap: 11 },
  backButton: { width: 42, height: 42, borderRadius: 15, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.line },
  backText: { fontSize: 34, lineHeight: 37, color: colors.ink, marginTop: -4 }, topTitle: { flex: 1, color: colors.ink, fontWeight: '900', fontSize: 16 },
  ageTag: { borderRadius: 20, backgroundColor: colors.leafLight, color: colors.leaf, paddingHorizontal: 11, paddingVertical: 7, fontSize: 11, fontWeight: '800' },
  content: { padding: 18, paddingBottom: 28, gap: 15 },
  hero: { minHeight: 105, borderRadius: 25, padding: 18, backgroundColor: colors.ink, flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', columnGap: 13, rowGap: 8 },
  heroIcon: { width: 55, height: 55, borderRadius: 18, backgroundColor: '#FFFFFF1F', alignItems: 'center', justifyContent: 'center' }, heroCopy: { flex: 1, minWidth: 180 }, eyebrow: { color: colors.lime, letterSpacing: 1.2, fontSize: 9, fontWeight: '900' },
  title: { color: '#fff', fontSize: 20, lineHeight: 25, marginTop: 2 }, description: { color: '#DBE9DD', width: '100%', fontSize: 12, lineHeight: 17 },
  activityCard: { borderRadius: 25, padding: 17 }, activityEyebrow: { color: colors.leaf, fontSize: 9, letterSpacing: 1.1, fontWeight: '900' }, activityTitle: { fontSize: 21, lineHeight: 26, marginTop: 4 }, instruction: { fontSize: 12, lineHeight: 18, marginTop: 5, marginBottom: 14 },
  progressWrap: { flexDirection: 'row', alignItems: 'center', gap: 9, marginVertical: 7 }, progressTrack: { flex: 1, height: 7, borderRadius: 8, backgroundColor: '#E9EDE2', overflow: 'hidden' }, progressFill: { height: '100%', backgroundColor: colors.leaf }, progressLabel: { color: colors.muted, fontWeight: '800', fontSize: 10, minWidth: 38, textAlign: 'right' },
  tile: { minHeight: 46, minWidth: 58, borderRadius: 15, borderWidth: 1.3, borderColor: colors.line, backgroundColor: '#fff', paddingHorizontal: 13, paddingVertical: 10, alignItems: 'center', justifyContent: 'center' }, tileSelected: { backgroundColor: colors.leaf, borderColor: colors.leaf }, tileDisabled: { opacity: 0.48 }, tileText: { color: colors.ink, fontWeight: '800', textAlign: 'center', fontSize: 13 }, tileTextSelected: { color: '#fff' }, pressed: { opacity: 0.78, transform: [{ scale: 0.98 }] },
  choiceWrap: { gap: 8, marginTop: 14 }, feedback: { color: colors.leaf, fontWeight: '700', fontSize: 12, lineHeight: 17, textAlign: 'center', marginTop: 12 },
  memoryMeta: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7 }, counter: { color: colors.leaf, fontSize: 11, fontWeight: '800' }, memoryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8 }, memoryTile: { width: '23%', minHeight: 76, borderRadius: 15, backgroundColor: '#E5ECE2', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.line }, memoryFaceUp: { backgroundColor: '#FFF2D5', borderColor: '#EFD59E' }, memoryMatched: { backgroundColor: '#E4F2E5', borderColor: '#A9CDAE' }, memoryFace: { fontSize: 25 }, memoryLabel: { fontSize: 9, color: colors.ink, fontWeight: '800', marginTop: 2 }, fact: { marginTop: 10, padding: 10, backgroundColor: '#F4F7EC', borderRadius: 12, fontSize: 11 },
  orderList: { gap: 7, marginTop: 12 }, orderRow: { minHeight: 39, borderRadius: 13, paddingHorizontal: 10, backgroundColor: '#F5F4EB', flexDirection: 'row', alignItems: 'center', gap: 10 }, orderDone: { backgroundColor: '#E8F4E9' }, orderNumber: { width: 23, height: 23, textAlign: 'center', textAlignVertical: 'center', color: colors.leaf, fontWeight: '900', borderRadius: 8, backgroundColor: '#fff', overflow: 'hidden' }, orderText: { color: colors.ink, fontSize: 12, fontWeight: '700' },
  sceneGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 9 }, sceneItem: { width: '30%', height: 65, borderRadius: 15, backgroundColor: '#EDF3E8', alignItems: 'center', justifyContent: 'center' }, sceneEmoji: { fontSize: 28 },
  maze: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 5, marginVertical: 12, alignSelf: 'center', maxWidth: 235 }, mazeCell: { width: 51, height: 51, borderRadius: 12, backgroundColor: '#EDF2E8', alignItems: 'center', justifyContent: 'center' }, mazeGoal: { backgroundColor: '#FFF0C8' }, mazeWall: { backgroundColor: '#DDE0D5' }, mazeHere: { backgroundColor: '#D9EAF4' }, mazeGlyph: { fontSize: 24 },
  programLine: { minHeight: 46, paddingHorizontal: 12, borderRadius: 13, backgroundColor: '#F5F4EB', flexDirection: 'row', alignItems: 'center', gap: 10 }, programLabel: { color: colors.muted, fontWeight: '900', fontSize: 9 }, programText: { flex: 1, color: colors.ink, fontSize: 15, fontWeight: '900' }, loopTag: { color: colors.leaf, fontWeight: '900' }, commandGrid: { flexDirection: 'row', justifyContent: 'center', gap: 7, marginTop: 12 }, actionRow: { flexDirection: 'row', gap: 8, marginTop: 9 },
  artPreview: { minHeight: 62, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFF7E8', borderRadius: 15 }, artCount: { color: colors.muted, fontWeight: '800', fontSize: 11 }, palette: { flexDirection: 'row', gap: 11, justifyContent: 'center', marginVertical: 12 }, swatch: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: '#D9DED5' }, swatchSelected: { borderColor: colors.ink, transform: [{ scale: 1.13 }] }, canvas: { aspectRatio: 1, width: '100%', flexDirection: 'row', flexWrap: 'wrap', gap: 3, padding: 4, borderRadius: 15, backgroundColor: '#E9EDE2' }, canvasCell: { width: '18.5%', height: '18.5%', borderRadius: 4, borderWidth: 1, borderColor: '#DFE4DA' },
  sudokuGrid: { width: 246, height: 246, alignSelf: 'center', flexDirection: 'row', flexWrap: 'wrap', borderWidth: 2, borderColor: colors.leaf, marginVertical: 15 }, sudokuCell: { width: '25%', height: '25%', borderWidth: 0.6, borderColor: '#B9C8B7', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }, sudokuBottomLine: { borderBottomWidth: 2, borderBottomColor: colors.leaf }, sudokuRightLine: { borderRightWidth: 2, borderRightColor: colors.leaf }, sudokuActive: { backgroundColor: '#E4F2E5' }, sudokuNumber: { color: colors.ink, fontSize: 21, fontWeight: '900' }, sudokuEmpty: { color: '#AEB9B0' }, numberRow: { flexDirection: 'row', justifyContent: 'center', gap: 10 },
  notePrompt: { minHeight: 65, borderRadius: 16, backgroundColor: '#F7F2E8', flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, marginVertical: 10 }, noteEmoji: { fontSize: 31 }, noteText: { color: colors.ink, fontWeight: '800', fontSize: 13, flex: 1 }, pianoKeys: { flexDirection: 'row', gap: 3, marginTop: 13 }, pianoKey: { flex: 1, minHeight: 111, borderRadius: 0, borderBottomWidth: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: '#D8DDD3', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 10 }, keyName: { color: colors.muted, fontSize: 10, fontWeight: '800' }, beatTrack: { flexDirection: 'row', justifyContent: 'center', gap: 13, marginVertical: 18 }, beatDot: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F1EFE6', alignItems: 'center', justifyContent: 'center' }, beatDone: { backgroundColor: '#D9EEDB' }, beatEmoji: { fontSize: 22 },
  sortObject: { minHeight: 114, borderRadius: 20, backgroundColor: '#F2F5EB', alignItems: 'center', justifyContent: 'center', marginTop: 13 }, sortEmoji: { fontSize: 49 }, sortName: { color: colors.ink, fontWeight: '900', marginTop: 4 }, bucketRow: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 8, marginTop: 15 },
  clockTarget: { padding: 14, backgroundColor: '#F8F1DE', borderRadius: 17, alignItems: 'center', marginTop: 10 }, clockCaption: { color: colors.muted, fontSize: 9, letterSpacing: 1.1, fontWeight: '900' }, clockTime: { color: colors.ink, fontWeight: '900', fontSize: 30, marginTop: 4 }, clockFace: { alignItems: 'center', padding: 8 }, clockFaceEmoji: { fontSize: 49 }, clockFaceTime: { color: colors.leaf, fontSize: 18, fontWeight: '900' }, clockControl: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 10 }, clockControlLabel: { color: colors.ink, width: 56, fontWeight: '800' }, clockValue: { minWidth: 36, textAlign: 'center', color: colors.ink, fontWeight: '900', fontSize: 18 },
  shopGoal: { padding: 14, borderRadius: 17, backgroundColor: '#FFF3D8', alignItems: 'center', marginVertical: 8 }, goalLabel: { color: colors.muted, fontSize: 9, letterSpacing: 1, fontWeight: '900' }, goalAmount: { color: colors.ink, fontSize: 25, fontWeight: '900' }, savedAmount: { color: colors.leaf, fontSize: 12, fontWeight: '800', marginTop: 3 }, coinRow: { flexDirection: 'row', justifyContent: 'center', gap: 9, marginTop: 9 }, coin: { width: 61, height: 74, borderRadius: 16, backgroundColor: '#F7E4B3', alignItems: 'center', justifyContent: 'center' }, coinIcon: { fontSize: 28 }, coinValue: { color: '#7E5D1C', fontWeight: '900', fontSize: 11 }, savedCoins: { minHeight: 38, borderRadius: 13, backgroundColor: '#F6F6EF', marginTop: 12, padding: 9, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6 }, savedCoin: { color: '#805E18', borderRadius: 12, paddingVertical: 4, paddingHorizontal: 9, backgroundColor: '#F2DFAB', fontWeight: '900' }, mutedSmall: { color: colors.muted, fontSize: 10, fontWeight: '700' },
  seesaw: { minHeight: 130, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 3, paddingBottom: 12 }, seesawEmoji: { fontSize: 28 }, seesawBoard: { width: '65%', height: 11, borderRadius: 8, backgroundColor: '#A16D42', position: 'relative', marginBottom: 5 }, balanceMarker: { position: 'absolute', width: 19, height: 19, borderRadius: 10, backgroundColor: colors.gold, top: -5, marginLeft: -10, borderWidth: 2, borderColor: '#fff' }, balanceControls: { flexDirection: 'row', gap: 8 },
  track: { height: 128, flexDirection: 'row', borderRadius: 17, overflow: 'hidden', backgroundColor: '#596D65', marginTop: 13 }, trackLane: { flex: 1, borderRightWidth: 1, borderRightColor: '#829288', alignItems: 'center', justifyContent: 'center' }, trackThing: { fontSize: 30 }, kartLane: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, padding: 12 }, kart: { fontSize: 29 }, laneChoices: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 8 },
  targetGrid: { alignSelf: 'center', width: 234, flexDirection: 'row', flexWrap: 'wrap', gap: 7, justifyContent: 'center', marginVertical: 16 }, targetCell: { width: 68, height: 68, borderRadius: 18, backgroundColor: '#F0F2E9', alignItems: 'center', justifyContent: 'center' }, targetActive: { backgroundColor: '#FFF0C7', borderWidth: 2, borderColor: colors.gold }, targetEmoji: { fontSize: 29 },
  finished: { marginTop: 20, alignItems: 'center', padding: 23 }, finishEmoji: { fontSize: 52, marginBottom: 5 }, finishTitle: { textAlign: 'center', fontSize: 24 }, finishText: { textAlign: 'center', fontSize: 13, marginTop: 8 },
});





