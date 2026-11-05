import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import type { Language } from './i18n';

type AgeBand = '3-5' | '6-8' | '9-12';
type ThreeMode = 'maze3d' | 'space3d';
type Cell = { x: number; z: number };
type Props = { mode: ThreeMode; age: AgeBand; language: Language; onFinish: () => void };

const cellKey = (x: number, z: number) => `${x},${z}`;
const say = (language: Language, en: string, hi: string) => language === 'hi' ? hi : en;

function makeMaze(roomCount: number, crystalCount: number) {
  const size = roomCount * 2 + 1;
  const walls = new Set<string>();
  for (let z = 0; z < size; z += 1) for (let x = 0; x < size; x += 1) walls.add(cellKey(x, z));

  const start = { x: 1, z: 1 };
  const visited = new Set([cellKey(start.x, start.z)]);
  const stack = [start];
  walls.delete(cellKey(start.x, start.z));
  const jumps = [[2, 0], [-2, 0], [0, 2], [0, -2]] as const;

  while (stack.length) {
    const current = stack[stack.length - 1];
    const options = jumps
      .map(([dx, dz]) => ({ x: current.x + dx, z: current.z + dz, dx, dz }))
      .filter((next) => next.x > 0 && next.z > 0 && next.x < size - 1 && next.z < size - 1 && !visited.has(cellKey(next.x, next.z)));
    if (!options.length) {
      stack.pop();
      continue;
    }
    const next = options[Math.floor(Math.random() * options.length)];
    walls.delete(cellKey(current.x + next.dx / 2, current.z + next.dz / 2));
    walls.delete(cellKey(next.x, next.z));
    visited.add(cellKey(next.x, next.z));
    stack.push({ x: next.x, z: next.z });
  }

  const exit = { x: size - 2, z: size - 2 };
  const queue: Cell[] = [start];
  const previous = new Map<string, Cell>();
  const seen = new Set([cellKey(start.x, start.z)]);
  while (queue.length) {
    const current = queue.shift()!;
    if (current.x === exit.x && current.z === exit.z) break;
    for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const x = current.x + dx;
      const z = current.z + dz;
      const key = cellKey(x, z);
      if (!walls.has(key) && !seen.has(key)) {
        seen.add(key);
        previous.set(key, current);
        queue.push({ x, z });
      }
    }
  }
  const path: Cell[] = [exit];
  while (path[path.length - 1].x !== start.x || path[path.length - 1].z !== start.z) {
    const parent = previous.get(cellKey(path[path.length - 1].x, path[path.length - 1].z));
    if (!parent) break;
    path.push(parent);
  }
  path.reverse();
  const crystals = Array.from({ length: crystalCount }, (_, index) => {
    const part = index + 1;
    return path[Math.max(1, Math.floor((path.length - 1) * part / (crystalCount + 1)))];
  });
  return { size, walls, start, exit, crystals };
}

const planets = [
  { id: 'mercury', name: ['Mercury', 'बुध'], fact: ['Mercury is the closest planet to the Sun.', 'बुध सूरज के सबसे पास का ग्रह है।'], color: '#a9a6a8', size: 0.28, orbit: 2.1 },
  { id: 'venus', name: ['Venus', 'शुक्र'], fact: ['Venus is the hottest planet in our solar system.', 'शुक्र हमारे सौरमंडल का सबसे गर्म ग्रह है।'], color: '#f2bd68', size: 0.4, orbit: 3.05 },
  { id: 'earth', name: ['Earth', 'पृथ्वी'], fact: ['Earth has liquid water and is home to many forms of life.', 'पृथ्वी पर तरल पानी है और यह अनेक जीवों का घर है।'], color: '#49a9e6', size: 0.43, orbit: 4.0 },
  { id: 'mars', name: ['Mars', 'मंगल'], fact: ['Mars looks red because its soil contains rusty iron.', 'मंगल की मिट्टी में जंग जैसा लोहा होने से यह लाल दिखता है।'], color: '#eb745e', size: 0.34, orbit: 4.95 },
  { id: 'jupiter', name: ['Jupiter', 'बृहस्पति'], fact: ['Jupiter is the largest planet in our solar system.', 'बृहस्पति हमारे सौरमंडल का सबसे बड़ा ग्रह है।'], color: '#d99b72', size: 0.76, orbit: 6.1 },
  { id: 'saturn', name: ['Saturn', 'शनि'], fact: ['Saturn has wide rings made mostly of ice and rock.', 'शनि के चौड़े छल्ले ज़्यादातर बर्फ़ और पत्थर के बने हैं।'], color: '#e5ca8d', size: 0.64, orbit: 7.45 },
  { id: 'uranus', name: ['Uranus', 'अरुण'], fact: ['Uranus spins tipped far over on its side.', 'अरुण अपनी धुरी पर एक ओर बहुत झुका हुआ घूमता है।'], color: '#78d4d0', size: 0.5, orbit: 8.75 },
  { id: 'neptune', name: ['Neptune', 'वरुण'], fact: ['Neptune is a deep-blue planet with very fast winds.', 'वरुण गहरे नीले रंग का ग्रह है जहाँ बहुत तेज़ हवाएँ चलती हैं।'], color: '#527ce0', size: 0.48, orbit: 10.05 },
];

function MazeField({ language, layout, player, collected, mission, onMove }: {
  language: Language; layout: ReturnType<typeof makeMaze>; player: Cell; collected: number[]; mission: number;
  onMove: (dx: number, dz: number) => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef(player);
  const collectedRef = useRef(collected);
  const moveRef = useRef(onMove);
  playerRef.current = player;
  collectedRef.current = collected;
  moveRef.current = onMove;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    } catch {
      host.classList.add('three-fallback');
      return undefined;
    }
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#e5f4ff');
    scene.fog = new THREE.Fog('#e5f4ff', layout.size * 1.7, layout.size * 4.3);
    const camera = new THREE.PerspectiveCamera(43, 1, 0.1, 100);
    camera.position.set(layout.size * 0.72, layout.size * 1.02, layout.size * 1.05);
    camera.lookAt(0, 0, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    host.replaceChildren(renderer.domElement);
    renderer.domElement.className = 'three-canvas';
    renderer.domElement.setAttribute('aria-hidden', 'true');

    scene.add(new THREE.HemisphereLight('#e5f8ff', '#618567', 2.2));
    const sun = new THREE.DirectionalLight('#fff2d8', 3.2);
    sun.position.set(-5, 10, 7);
    sun.castShadow = true;
    scene.add(sun);
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(layout.size + 2, layout.size + 2),
      new THREE.MeshStandardMaterial({ color: '#9bcf9f', roughness: 1 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.13;
    ground.receiveShadow = true;
    scene.add(ground);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(layout.size, layout.size),
      new THREE.MeshStandardMaterial({ color: '#f4edcf', roughness: 0.95 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0.005;
    floor.receiveShadow = true;
    scene.add(floor);

    const wallGeometry = new THREE.BoxGeometry(0.96, 1.05, 0.96);
    const wallMaterials = ['#83c8c2', '#84add6', '#bd9bd6', '#f1c27b'].map((color) => new THREE.MeshStandardMaterial({ color, roughness: 0.72 }));
    layout.walls.forEach((key) => {
      const [x, z] = key.split(',').map(Number);
      const block = new THREE.Mesh(wallGeometry, wallMaterials[(x * 3 + z) % wallMaterials.length]);
      block.position.set(x - (layout.size - 1) / 2, 0.53, z - (layout.size - 1) / 2);
      block.castShadow = true;
      block.receiveShadow = true;
      scene.add(block);
    });

    const crystalMeshes = layout.crystals.map((cell, index) => {
      const material = new THREE.MeshStandardMaterial({ color: ['#43cbe0', '#f2b84c', '#bd7fe4'][index], emissive: ['#27b9dc', '#e49b31', '#a55ed2'][index], emissiveIntensity: 0.75, metalness: 0.25, roughness: 0.3 });
      const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.31, 0), material);
      crystal.position.set(cell.x - (layout.size - 1) / 2, 0.56, cell.z - (layout.size - 1) / 2);
      crystal.castShadow = true;
      scene.add(crystal);
      return crystal;
    });

    const portalMaterial = new THREE.MeshStandardMaterial({ color: '#9aa6ad', emissive: '#52606b', emissiveIntensity: 0.25, metalness: 0.45, roughness: 0.3 });
    const portal = new THREE.Mesh(new THREE.TorusGeometry(0.43, 0.1, 12, 32), portalMaterial);
    portal.rotation.x = Math.PI / 2;
    portal.position.set(layout.exit.x - (layout.size - 1) / 2, 0.18, layout.exit.z - (layout.size - 1) / 2);
    scene.add(portal);

    const firefly = new THREE.Group();
    const fireflyBody = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 12), new THREE.MeshStandardMaterial({ color: '#fff08a', emissive: '#ffd83e', emissiveIntensity: 2.4 }));
    firefly.add(fireflyBody);
    const wingMaterial = new THREE.MeshStandardMaterial({ color: '#ddf7ff', transparent: true, opacity: 0.82, side: THREE.DoubleSide });
    for (const side of [-1, 1]) {
      const wing = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 10), wingMaterial);
      wing.scale.set(1, 0.55, 1.7);
      wing.position.set(side * 0.15, 0.06, 0);
      firefly.add(wing);
    }
    firefly.position.set(layout.exit.x - (layout.size - 1) / 2, 0.88, layout.exit.z - (layout.size - 1) / 2);
    firefly.visible = mission === 3;
    scene.add(firefly);
    const fireflyLight = new THREE.PointLight('#ffe66c', mission === 3 ? 2.2 : 0, 2.7);
    fireflyLight.position.copy(firefly.position);
    scene.add(fireflyLight);

    const playerGroup = new THREE.Group();
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.32, 22, 18), new THREE.MeshStandardMaterial({ color: '#ff8a74', roughness: 0.55 }));
    body.position.y = 0.36;
    body.castShadow = true;
    playerGroup.add(body);
    const face = new THREE.Mesh(new THREE.SphereGeometry(0.19, 18, 14), new THREE.MeshStandardMaterial({ color: '#fff5df', roughness: 0.7 }));
    face.position.set(0, 0.43, 0.23);
    playerGroup.add(face);
    const hat = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.32, 18), new THREE.MeshStandardMaterial({ color: '#8766ce', roughness: 0.55 }));
    hat.position.set(0, 0.77, 0);
    hat.castShadow = true;
    playerGroup.add(hat);
    scene.add(playerGroup);

    const resize = () => {
      const width = host.clientWidth || 600;
      const height = host.clientHeight || 340;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();

    let animationId = 0;
    const animate = () => {
      animationId = window.requestAnimationFrame(animate);
      const time = performance.now() * 0.003;
      const position = playerRef.current;
      playerGroup.position.x += ((position.x - (layout.size - 1) / 2) - playerGroup.position.x) * 0.22;
      playerGroup.position.z += ((position.z - (layout.size - 1) / 2) - playerGroup.position.z) * 0.22;
      playerGroup.position.y = Math.sin(time) * 0.035;
      crystalMeshes.forEach((crystal, index) => {
        crystal.visible = !collectedRef.current.includes(index);
        crystal.rotation.y += 0.025;
        crystal.rotation.x += 0.009;
        crystal.position.y = 0.56 + Math.sin(time + index) * 0.08;
      });
      const open = collectedRef.current.length === layout.crystals.length;
      portalMaterial.color.set(open ? '#51d9b0' : '#9aa6ad');
      portalMaterial.emissive.set(open ? '#21c997' : '#52606b');
      portal.rotation.z += open ? 0.025 : 0.006;
      firefly.position.y = 0.88 + Math.sin(time * 1.7) * 0.11;
      firefly.rotation.y += 0.018;
      fireflyLight.position.y = firefly.position.y;
      renderer.render(scene, camera);
    };
    animate();

    const onKeyDown = (event: KeyboardEvent) => {
      const direction: Record<string, [number, number]> = {
        ArrowUp: [0, -1], w: [0, -1], W: [0, -1],
        ArrowDown: [0, 1], s: [0, 1], S: [0, 1],
        ArrowLeft: [-1, 0], a: [-1, 0], A: [-1, 0],
        ArrowRight: [1, 0], d: [1, 0], D: [1, 0],
      };
      const move = direction[event.key];
      if (move) {
        event.preventDefault();
        moveRef.current(move[0], move[1]);
      }
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', onKeyDown);
      observer.disconnect();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      wallGeometry.dispose();
      wallMaterials.forEach((material) => material.dispose());
      renderer.dispose();
      host.replaceChildren();
      host.classList.remove('three-fallback');
    };
  }, [layout]);

  return <div ref={hostRef} className="three-canvas-host maze-field" aria-label={say(language, '3D crystal maze game board.', '3D क्रिस्टल भूलभुलैया का गेम बोर्ड।')} />;
}

function CrystalMaze({ age, language, onFinish }: Omit<Props, 'mode'>) {
  const [mission, setMission] = useState(1);
  const [stageCleared, setStageCleared] = useState(false);
  const roomCount = (age === '3-5' ? 3 : age === '6-8' ? 4 : 5) + mission - 1;
  const layout = useMemo(() => makeMaze(roomCount, mission + 2), [roomCount, mission]);
  const [player, setPlayer] = useState<Cell>(layout.start);
  const [collected, setCollected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [message, setMessage] = useState(say(language, 'Mission 1: Find 3 crystals and open the Moon Gate.', 'मिशन 1: 3 क्रिस्टल खोजो और चाँद का द्वार खोलो।'));
  const playerRef = useRef(player);
  const collectedRef = useRef(collected);
  const finishedRef = useRef(false);
  playerRef.current = player;
  collectedRef.current = collected;

  const move = (dx: number, dz: number) => {
    if (finishedRef.current) return;
    const current = playerRef.current;
    const next = { x: current.x + dx, z: current.z + dz };
    if (layout.walls.has(cellKey(next.x, next.z))) {
      setMessage(say(language, 'A friendly wall is in the way. Try another path!', 'रास्ते में दीवार है। कोई दूसरा रास्ता आज़माओ!'));
      return;
    }
    playerRef.current = next;
    setPlayer(next);
    setMoves((value) => value + 1);
    const crystalIndex = layout.crystals.findIndex((crystal) => crystal.x === next.x && crystal.z === next.z);
    let nextCollected = collectedRef.current;
    if (crystalIndex >= 0 && !nextCollected.includes(crystalIndex)) {
      nextCollected = [...nextCollected, crystalIndex];
      collectedRef.current = nextCollected;
      setCollected(nextCollected);
      setMessage(nextCollected.length === layout.crystals.length
        ? say(language, 'All crystals found! The portal is glowing.', 'सारे क्रिस्टल मिल गए! पोर्टल चमक रहा है।')
        : say(language, `Crystal found! ${nextCollected.length} of ${layout.crystals.length}.`, `क्रिस्टल मिल गया! ${layout.crystals.length} में से ${nextCollected.length}।`));
    }
    if (next.x === layout.exit.x && next.z === layout.exit.z) {
      if (nextCollected.length === layout.crystals.length) {
        finishedRef.current = true;
        if (mission < 3) {
          setStageCleared(true);
          setMessage(say(language, `Mission ${mission} complete!`, `मिशन ${mission} पूरा हुआ!`));
        } else {
          setMessage(say(language, 'You rescued the firefly and escaped the cave!', 'तुमने जुगनू को बचाकर गुफा से बाहर निकाला!'));
          window.setTimeout(onFinish, 450);
        }
      } else {
        setMessage(say(language, `Find ${layout.crystals.length - nextCollected.length} more crystal(s) first.`, `पहले ${layout.crystals.length - nextCollected.length} और क्रिस्टल खोजो।`));
      }
    }
  };

  const arrow = (label: string, dx: number, dz: number, symbol: string) => (
    <button type="button" className="three-direction-button" aria-label={label} onClick={() => move(dx, dz)}>{symbol}</button>
  );

  const missionObjective = mission === 1
    ? say(language, 'Find 3 crystals to awaken the Moon Gate.', 'चाँद का द्वार जगाने के लिए 3 क्रिस्टल खोजो।')
    : mission === 2
      ? say(language, 'Find 4 star shards to power the crystal bridge.', 'क्रिस्टल पुल को जगाने के लिए 4 सितारा-टुकड़े खोजो।')
      : say(language, 'Find 5 crystals, then guide the lost firefly to the portal.', '5 क्रिस्टल खोजो, फिर खोए जुगनू को पोर्टल तक पहुँचाओ।');

  function nextMission() {
    const nextMissionNumber = mission + 1;
    setMission(nextMissionNumber);
    const start = { x: 1, z: 1 };
    playerRef.current = start;
    collectedRef.current = [];
    setPlayer(start);
    setCollected([]);
    setMoves(0);
    setStageCleared(false);
    finishedRef.current = false;
    setMessage(nextMissionNumber === 2
      ? say(language, 'Mission 2: Find 4 star shards and power the bridge.', 'मिशन 2: 4 सितारा-टुकड़े खोजो और पुल को जगाओ।')
      : say(language, 'Mission 3: Find 5 crystals and rescue the firefly.', 'मिशन 3: 5 क्रिस्टल खोजो और जुगनू को बचाओ।'));
  }

  return <div className="three-game-panel">
    <div className="three-game-heading"><div><strong>{say(language, 'Crystal Cave 3D Campaign', '3D क्रिस्टल गुफा अभियान')}</strong><p>{missionObjective}</p></div><span className="three-progress-pill">{say(language, `Mission ${mission} / 3`, `मिशन ${mission} / 3`)} · 💎 {collected.length} / {layout.crystals.length}</span></div>
    <MazeField language={language} layout={layout} player={player} collected={collected} mission={mission} onMove={move} />
    {stageCleared && <div className="three-mission-clear"><strong>{say(language, `Mission ${mission} complete!`, `मिशन ${mission} पूरा हुआ!`)}</strong><p>{say(language, 'The cave path is safe. Your next mission is ready.', 'गुफा का रास्ता साफ़ है। अगला मिशन तैयार है।')}</p><button className="button button-primary" type="button" onClick={nextMission}>{say(language, 'Start next mission', 'अगला मिशन शुरू करो')} →</button></div>}
    <div className="three-game-bottom"><p className="three-game-message" role="status">{message}</p><div className="three-controls" aria-label={say(language, 'Maze movement controls', 'भूलभुलैया चलाने के बटन')}>
      <span />{arrow(say(language, 'Move forward', 'आगे चलो'), 0, -1, '↑')}<span />
      {arrow(say(language, 'Move left', 'बाएँ चलो'), -1, 0, '←')}<span className="three-move-count">{moves}</span>{arrow(say(language, 'Move right', 'दाएँ चलो'), 1, 0, '→')}
      <span />{arrow(say(language, 'Move back', 'पीछे चलो'), 0, 1, '↓')}<span />
    </div></div>
    <small className="three-help-note">{say(language, 'Use arrow keys or WASD, or tap the direction buttons.', 'तीर के बटन या WASD कुंजियाँ दबाओ, या दिशा वाले बटन टैप करो।')}</small>
  </div>;
}

type XY = { x: number; y: number };
type SpaceMission = {
  id: string;
  title: [string, string];
  destination: [string, string];
  cargo: [string, string];
  story: [string, string];
  fact: [string, string];
  planetId?: string;
  planetColor: string;
  pickups: XY[];
  hazards: XY[];
  target: XY;
};

const spaceMissions: SpaceMission[] = [
  {
    id: 'moon-relay', title: ['Moon Relay Rescue', 'चाँद रिले बचाव'], destination: ['Moon relay', 'चाँद का रिले'], cargo: ['signal cells', 'सिग्नल सेल'],
    story: ['The Moon relay has gone quiet. Fly through the asteroid field, collect its signal cells, and dock at the relay.', 'चाँद का रिले बंद हो गया है। क्षुद्रग्रहों से बचो, सिग्नल सेल जमा करो और रिले तक पहुँचो।'],
    fact: ['The Moon travels around Earth and reflects sunlight.', 'चाँद पृथ्वी के चारों ओर घूमता है और सूरज की रोशनी लौटाता है।'],
    planetColor: '#bac8df', pickups: [{ x: -3.9, y: 1.95 }, { x: -1.3, y: -1.95 }, { x: 1.3, y: 1.3 }, { x: 3.25, y: -0.65 }],
    hazards: [{ x: -2.6, y: 0.65 }, { x: 0, y: -0.65 }, { x: 2.6, y: 1.3 }, { x: 3.9, y: -1.95 }], target: { x: 4.55, y: 2.6 },
  },
  {
    id: 'mars-supplies', title: ['Mars Supply Run', 'मंगल पर सामान पहुँचाओ'], destination: ['Mars station', 'मंगल स्टेशन'], cargo: ['water pods', 'पानी के कैप्सूल'], planetId: 'mars', planetColor: '#d76b52',
    story: ['The Mars crew needs water. Pick up the supply pods and steer around the rock field to reach their base.', 'मंगल पर मौजूद टीम को पानी चाहिए। पानी के कैप्सूल उठाओ और चट्टानों से बचते हुए उनके ठिकाने तक पहुँचो।'],
    fact: ['Mars looks red because its dusty soil contains iron.', 'मंगल की धूल भरी मिट्टी में लोहा होने से यह लाल दिखता है।'],
    pickups: [{ x: -3.9, y: -1.95 }, { x: -1.95, y: 2.6 }, { x: 0.65, y: -2.6 }, { x: 2.6, y: 0.65 }],
    hazards: [{ x: -2.6, y: -0.65 }, { x: 0, y: 1.3 }, { x: 1.95, y: -0.65 }, { x: 3.25, y: 1.95 }], target: { x: 4.55, y: -2.6 },
  },
  {
    id: 'saturn-repair', title: ['Saturn Station Repair', 'शनि स्टेशन की मरम्मत'], destination: ['Saturn station', 'शनि स्टेशन'], cargo: ['repair kits', 'मरम्मत किट'], planetId: 'saturn', planetColor: '#d9bb7e',
    story: ['A research station near Saturn is damaged. Gather repair kits, dodge the space rocks, and bring the tools to the station.', 'शनि के पास का शोध स्टेशन खराब है। मरम्मत किट जमा करो, अंतरिक्ष की चट्टानों से बचो और औज़ार स्टेशन तक पहुँचाओ।'],
    fact: ['Saturn’s bright rings are made mostly of ice and rock.', 'शनि के चमकीले छल्ले ज़्यादातर बर्फ़ और पत्थर से बने हैं।'],
    pickups: [{ x: -3.9, y: 1.95 }, { x: -1.95, y: -2.6 }, { x: 0.65, y: 2.6 }, { x: 2.6, y: -0.65 }],
    hazards: [{ x: -3.25, y: -0.65 }, { x: -0.65, y: 0.65 }, { x: 1.3, y: -1.95 }, { x: 3.25, y: 1.3 }], target: { x: 4.55, y: 2.6 },
  },
];

function SpaceMissionField({ mission, age, needed, position, collected, active, language, onMove }: {
  mission: SpaceMission; age: AgeBand; needed: number; position: XY; collected: number[]; active: boolean; language: Language; onMove: (dx: number, dy: number) => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(position);
  const collectedRef = useRef(collected);
  const activeRef = useRef(active);
  const moveRef = useRef(onMove);
  positionRef.current = position;
  collectedRef.current = collected;
  activeRef.current = active;
  moveRef.current = onMove;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false }); }
    catch { host.classList.add('three-fallback'); return undefined; }
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#07132d');
    const camera = new THREE.PerspectiveCamera(39, 1, 0.1, 100);
    camera.position.set(0, 1.4, 21.5);
    camera.lookAt(0, 0, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    host.replaceChildren(renderer.domElement);
    renderer.domElement.className = 'three-canvas';
    renderer.domElement.setAttribute('aria-hidden', 'true');

    scene.add(new THREE.AmbientLight('#9cb9ff', 1.45));
    const keyLight = new THREE.PointLight('#d7e4ff', 95, 30);
    keyLight.position.set(-3, 4, 8);
    scene.add(keyLight);

    const starPositions = new Float32Array(430 * 3);
    for (let i = 0; i < 430; i += 1) {
      starPositions[i * 3] = (Math.random() - 0.5) * 28;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 17;
      starPositions[i * 3 + 2] = -2 - Math.random() * 15;
    }
    const starsGeometry = new THREE.BufferGeometry();
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    scene.add(new THREE.Points(starsGeometry, new THREE.PointsMaterial({ color: '#e1eaff', size: 0.075 })));

    const flightDeck = new THREE.Mesh(new THREE.PlaneGeometry(13, 8), new THREE.MeshStandardMaterial({ color: '#0b1e40', roughness: 0.95, metalness: 0.1 }));
    flightDeck.position.z = -1.4;
    scene.add(flightDeck);
    const grid = new THREE.GridHelper(13, 26, '#4774a0', '#223c67');
    grid.rotation.x = Math.PI / 2;
    grid.position.z = -1.25;
    const gridMaterials = Array.isArray(grid.material) ? grid.material : [grid.material];
    gridMaterials.forEach((material) => { material.transparent = true; material.opacity = 0.26; });
    scene.add(grid);

    const destination = planets.find((planet) => planet.id === mission.planetId);
    const planet = new THREE.Mesh(
      new THREE.SphereGeometry(destination?.size ? Math.max(1.05, destination.size * 1.7) : 1.05, 36, 24),
      new THREE.MeshStandardMaterial({ color: destination?.color ?? mission.planetColor, roughness: 0.85, emissive: destination?.color ?? mission.planetColor, emissiveIntensity: 0.13 }),
    );
    planet.position.set(mission.target.x + 0.35, mission.target.y + 0.55, -3.2);
    scene.add(planet);
    if (mission.planetId === 'saturn') {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.13, 8, 48), new THREE.MeshStandardMaterial({ color: '#f0d79e', roughness: 0.8, side: THREE.DoubleSide }));
      ring.position.copy(planet.position);
      ring.rotation.x = 0.28;
      scene.add(ring);
    }

    const station = new THREE.Group();
    const stationRing = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.1, 10, 32), new THREE.MeshStandardMaterial({ color: '#72e5c8', emissive: '#19a987', emissiveIntensity: 0.8, metalness: 0.4 }));
    station.add(stationRing);
    const stationCore = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 12), new THREE.MeshStandardMaterial({ color: '#fff1a8', emissive: '#ffc52e', emissiveIntensity: 1.2 }));
    station.add(stationCore);
    station.position.set(mission.target.x, mission.target.y, 0.3);
    scene.add(station);
    const targetLight = new THREE.PointLight('#49e0c0', 1.7, 3.5);
    targetLight.position.copy(station.position);
    scene.add(targetLight);

    const pickupGeometry = new THREE.OctahedronGeometry(0.25, 0);
    const pickupMeshes = mission.pickups.slice(0, needed).map((pickup, index) => {
      const mesh = new THREE.Mesh(pickupGeometry, new THREE.MeshStandardMaterial({ color: ['#62e5d0', '#ffd166', '#88b5ff', '#f3a5ed'][index], emissive: ['#2acdb5', '#ecab42', '#528ce0', '#d766c6'][index], emissiveIntensity: 0.85, metalness: 0.2 }));
      mesh.position.set(pickup.x, pickup.y, 0.25);
      scene.add(mesh);
      return mesh;
    });

    const asteroids = mission.hazards.slice(0, age === '3-5' ? 2 : 4).map((hazard, index) => {
      const mesh = new THREE.Mesh(new THREE.DodecahedronGeometry(0.43 + (index % 2) * 0.07, 0), new THREE.MeshStandardMaterial({ color: index % 2 ? '#988ba9' : '#74849e', roughness: 0.95, flatShading: true }));
      mesh.position.set(hazard.x, hazard.y, 0.12);
      scene.add(mesh);
      return mesh;
    });

    const ship = new THREE.Group();
    const hull = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.3, 0.96, 18), new THREE.MeshStandardMaterial({ color: '#f5f7ff', metalness: 0.38, roughness: 0.35 }));
    hull.rotation.z = -Math.PI / 2;
    hull.castShadow = true;
    ship.add(hull);
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.27, 0.58, 18), new THREE.MeshStandardMaterial({ color: '#ff8d71', metalness: 0.18, roughness: 0.4 }));
    nose.rotation.z = -Math.PI / 2;
    nose.position.x = 0.68;
    ship.add(nose);
    const cockpit = new THREE.Mesh(new THREE.SphereGeometry(0.16, 18, 14), new THREE.MeshStandardMaterial({ color: '#7fe3f2', emissive: '#2bb5cc', emissiveIntensity: 0.5, metalness: 0.5 }));
    cockpit.position.set(0.06, 0.18, 0.18);
    ship.add(cockpit);
    const finMaterial = new THREE.MeshStandardMaterial({ color: '#8b6fd0', roughness: 0.5 });
    for (const side of [-1, 1]) {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.09, 0.08), finMaterial);
      fin.position.set(-0.27, side * 0.28, 0);
      fin.rotation.z = side * -0.28;
      ship.add(fin);
    }
    const flame = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.47, 16), new THREE.MeshStandardMaterial({ color: '#ffbd53', emissive: '#ff6b32', emissiveIntensity: 1.4 }));
    flame.rotation.z = Math.PI / 2;
    flame.position.x = -0.64;
    ship.add(flame);
    scene.add(ship);

    const resize = () => {
      const width = host.clientWidth || 600;
      const height = host.clientHeight || 330;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();

    let animationId = 0;
    const animate = () => {
      animationId = window.requestAnimationFrame(animate);
      const time = performance.now() * 0.001;
      ship.position.x += (positionRef.current.x - ship.position.x) * 0.22;
      ship.position.y += (positionRef.current.y - ship.position.y) * 0.22;
      ship.rotation.z = Math.sin(time * 1.5) * 0.035;
      flame.scale.setScalar(0.85 + Math.sin(time * 16) * 0.12);
      planet.rotation.y += 0.002;
      stationRing.rotation.z += 0.012;
      pickupMeshes.forEach((mesh, index) => {
        mesh.visible = !collectedRef.current.includes(index);
        mesh.rotation.x += 0.018;
        mesh.rotation.y += 0.025;
        mesh.position.y = mission.pickups[index].y + Math.sin(time * 2 + index) * 0.08;
      });
      asteroids.forEach((mesh, index) => { mesh.rotation.x += 0.006 + index * 0.001; mesh.rotation.y += 0.009; });
      renderer.render(scene, camera);
    };
    animate();

    const onKeyDown = (event: KeyboardEvent) => {
      if (!activeRef.current) return;
      const direction: Record<string, [number, number]> = {
        ArrowUp: [0, 1], w: [0, 1], W: [0, 1], ArrowDown: [0, -1], s: [0, -1], S: [0, -1],
        ArrowLeft: [-1, 0], a: [-1, 0], A: [-1, 0], ArrowRight: [1, 0], d: [1, 0], D: [1, 0],
      };
      const move = direction[event.key];
      if (move) { event.preventDefault(); moveRef.current(move[0], move[1]); }
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', onKeyDown);
      observer.disconnect();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points || object instanceof THREE.GridHelper) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      pickupGeometry.dispose();
      renderer.dispose();
      host.replaceChildren();
      host.classList.remove('three-fallback');
    };
  }, [mission, age, needed]);

  return <div ref={hostRef} className="three-canvas-host space-field" aria-label={say(language, '3D space mission flight board.', '3D अंतरिक्ष मिशन का उड़ान क्षेत्र।')} />;
}

function SolarExplorer({ age, language, onFinish }: Omit<Props, 'mode'>) {
  const [missionIndex, setMissionIndex] = useState(0);
  const [phase, setPhase] = useState<'briefing' | 'playing' | 'cleared' | 'failed'>('briefing');
  const [position, setPosition] = useState<XY>({ x: -5.2, y: 0 });
  const [collected, setCollected] = useState<number[]>([]);
  const [shields, setShields] = useState(age === '3-5' ? 5 : 3);
  const [message, setMessage] = useState(say(language, 'Mission control is ready. Read your briefing and launch!', 'मिशन कंट्रोल तैयार है। जानकारी पढ़ो और उड़ान भरो!'));
  const mission = spaceMissions[missionIndex];
  const needed = age === '3-5' ? 2 : age === '6-8' ? 3 : 4;
  const activeHazards = mission.hazards.slice(0, age === '3-5' ? 2 : 4);
  const positionRef = useRef(position);
  const collectedRef = useRef(collected);
  const phaseRef = useRef(phase);
  const shieldsRef = useRef(shields);
  positionRef.current = position;
  collectedRef.current = collected;
  phaseRef.current = phase;
  shieldsRef.current = shields;

  function movement(dx: number, dy: number) {
    if (phaseRef.current !== 'playing') return;
    const step = 0.65;
    const next = {
      x: Math.max(-5.2, Math.min(5.2, Math.round((positionRef.current.x + dx * step) / step) * step)),
      y: Math.max(-3.25, Math.min(3.25, Math.round((positionRef.current.y + dy * step) / step) * step)),
    };
    if (next.x === positionRef.current.x && next.y === positionRef.current.y) return;
    const asteroid = activeHazards.find((hazard) => Math.hypot(next.x - hazard.x, next.y - hazard.y) < 0.58);
    if (asteroid) {
      const remaining = shieldsRef.current - 1;
      shieldsRef.current = remaining;
      setShields(remaining);
      const start = { x: -5.2, y: 0 };
      positionRef.current = start;
      setPosition(start);
      if (remaining <= 0) {
        phaseRef.current = 'failed';
        setPhase('failed');
        setMessage(say(language, 'Shields are empty. Retry this mission to take off again.', 'ढाल खत्म हो गई। फिर से उड़ान भरने के लिए यह मिशन दोबारा शुरू करो।'));
      } else {
        setMessage(say(language, `Asteroid bump! ${remaining} shields left. Your shuttle returned to the launch pad.`, `क्षुद्रग्रह से टक्कर! ${remaining} ढाल बाकी। शटल फिर से शुरुआती जगह पर है।`));
      }
      return;
    }

    positionRef.current = next;
    setPosition(next);
    const pickupIndex = mission.pickups.slice(0, needed).findIndex((pickup, index) => !collectedRef.current.includes(index) && Math.hypot(next.x - pickup.x, next.y - pickup.y) < 0.48);
    let nextCollected = collectedRef.current;
    if (pickupIndex >= 0) {
      nextCollected = [...nextCollected, pickupIndex];
      collectedRef.current = nextCollected;
      setCollected(nextCollected);
      setMessage(say(language, `${mission.cargo[0]} collected: ${nextCollected.length} of ${needed}.`, `${mission.cargo[1]} मिले: ${needed} में से ${nextCollected.length}।`));
    }
    if (Math.hypot(next.x - mission.target.x, next.y - mission.target.y) < 0.68) {
      if (nextCollected.length === needed) {
        phaseRef.current = 'cleared';
        setPhase('cleared');
        setMessage(say(language, 'Cargo delivered! Mission complete.', 'सामान पहुँच गया! मिशन पूरा हुआ।'));
      } else {
        setMessage(say(language, `Docking bay needs ${needed - nextCollected.length} more ${mission.cargo[0]}.`, `डॉकिंग बे को ${mission.cargo[1]} में से ${needed - nextCollected.length} और चाहिए।`));
      }
    }
  }

  function launchMission() {
    phaseRef.current = 'playing';
    setPhase('playing');
    setMessage(say(language, `Collect ${needed} ${mission.cargo[0]}, avoid asteroids, then dock at ${mission.destination[0]}.`, `${needed} ${mission.cargo[1]} जमा करो, क्षुद्रग्रहों से बचो और ${mission.destination[1]} पर डॉक करो।`));
  }

  function resetMission() {
    const start = { x: -5.2, y: 0 };
    positionRef.current = start;
    collectedRef.current = [];
    shieldsRef.current = age === '3-5' ? 5 : 3;
    setPosition(start);
    setCollected([]);
    setShields(shieldsRef.current);
    phaseRef.current = 'briefing';
    setPhase('briefing');
    setMessage(say(language, 'Mission control is ready. Read your briefing and launch!', 'मिशन कंट्रोल तैयार है। जानकारी पढ़ो और उड़ान भरो!'));
  }

  function nextMission() {
    if (missionIndex >= spaceMissions.length - 1) { onFinish(); return; }
    const nextIndex = missionIndex + 1;
    setMissionIndex(nextIndex);
    const start = { x: -5.2, y: 0 };
    positionRef.current = start;
    collectedRef.current = [];
    shieldsRef.current = age === '3-5' ? 5 : 3;
    phaseRef.current = 'briefing';
    setPosition(start);
    setCollected([]);
    setShields(shieldsRef.current);
    setPhase('briefing');
    setMessage(say(language, `Mission ${nextIndex + 1} briefing is ready.`, `मिशन ${nextIndex + 1} की जानकारी तैयार है।`));
  }

  const arrow = (label: string, dx: number, dy: number, symbol: string) => (
    <button type="button" className="three-direction-button" aria-label={label} onClick={() => movement(dx, dy)}>{symbol}</button>
  );

  return <div className="three-game-panel space-mission-game">
    <div className="three-game-heading"><div><strong>{say(language, 'Space Rescue: Mission Control', 'अंतरिक्ष बचाव: मिशन कंट्रोल')}</strong><p>{mission.title[language === 'hi' ? 1 : 0]}</p></div><span className="three-progress-pill">{say(language, `Mission ${missionIndex + 1} / 3`, `मिशन ${missionIndex + 1} / 3`)} · 📦 {collected.length} / {needed} · 🛡️ {shields}</span></div>
    <SpaceMissionField mission={mission} age={age} needed={needed} position={position} collected={collected} active={phase === 'playing'} language={language} onMove={movement} />
    {phase === 'briefing' && <div className="space-mission-card"><span className="mission-eyebrow">🚀 {say(language, 'MISSION BRIEFING', 'मिशन की जानकारी')}</span><h3>{mission.title[language === 'hi' ? 1 : 0]}</h3><p>{mission.story[language === 'hi' ? 1 : 0]}</p><div className="mission-objective"><strong>{say(language, 'Your mission', 'तुम्हारा मिशन')}</strong><span>{say(language, `Collect ${needed} ${mission.cargo[0]} and dock at the ${mission.destination[0]}.`, `${needed} ${mission.cargo[1]} जमा करके ${mission.destination[1]} पर डॉक करो।`)}</span></div><small>🌎 {mission.fact[language === 'hi' ? 1 : 0]}</small><button type="button" className="button button-primary" onClick={launchMission}>{say(language, 'Launch mission', 'मिशन शुरू करो')} 🚀</button></div>}
    {phase === 'playing' && <><div className="three-game-bottom"><p className="three-game-message" role="status">{message}</p><div className="three-controls" aria-label={say(language, 'Shuttle flight controls', 'शटल उड़ाने के बटन')}>
      <span />{arrow(say(language, 'Fly up', 'ऊपर उड़ो'), 0, 1, '↑')}<span />
      {arrow(say(language, 'Fly left', 'बाएँ उड़ो'), -1, 0, '←')}<span className="three-move-count">{collected.length}/{needed}</span>{arrow(say(language, 'Fly right', 'दाएँ उड़ो'), 1, 0, '→')}
      <span />{arrow(say(language, 'Fly down', 'नीचे उड़ो'), 0, -1, '↓')}<span />
    </div></div><small className="three-help-note">{say(language, 'Use arrow keys or WASD, avoid the asteroids, and dock after collecting the cargo.', 'तीर की कुंजियाँ या WASD दबाओ, क्षुद्रग्रहों से बचो और सामान जमा करके डॉक करो।')}</small></>}
    {phase === 'cleared' && <div className="three-mission-clear"><strong>✅ {say(language, 'Mission complete!', 'मिशन पूरा हुआ!')}</strong><p>{say(language, `You delivered the cargo to ${mission.destination[0]}.`, `तुमने सामान ${mission.destination[1]} तक पहुँचा दिया।`)}</p><button className="button button-primary" type="button" onClick={nextMission}>{missionIndex === spaceMissions.length - 1 ? say(language, 'Complete campaign', 'अभियान पूरा करो') : say(language, 'Next mission', 'अगला मिशन')} →</button></div>}
    {phase === 'failed' && <div className="three-mission-clear mission-failed"><strong>🛟 {say(language, 'Shuttle needs a reset.', 'शटल को फिर से तैयार करना होगा।')}</strong><p>{say(language, 'Your mission is still waiting. Try a safer route around the asteroids.', 'मिशन अभी बाकी है। क्षुद्रग्रहों से बचने के लिए दूसरा रास्ता आज़माओ।')}</p><button className="button button-primary" type="button" onClick={resetMission}>{say(language, 'Retry mission', 'मिशन फिर से खेलो')} ↻</button></div>}
    {phase !== 'briefing' && phase !== 'playing' && <p className="three-game-message" role="status">{message}</p>}
  </div>;
}

export default function ThreeArcade(props: Props) {
  return props.mode === 'maze3d'
    ? <CrystalMaze age={props.age} language={props.language} onFinish={props.onFinish} />
    : <SolarExplorer age={props.age} language={props.language} onFinish={props.onFinish} />;
}
