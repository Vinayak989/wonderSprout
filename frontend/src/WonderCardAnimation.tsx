import type { WonderCategoryId } from './wonder-facts';

type WonderScene = {
  subject: string;
  companion: string;
  motion: string;
};

function scene(subject: string, companion: string, motion: string): WonderScene {
  return { subject, companion, motion };
}

function animalScene(fact: string): WonderScene {
  const text = fact.toLowerCase();
  if (text.includes('elephant')) return scene('🐘', '🌿', 'trunk-reach');
  if (text.includes('giraffe')) return scene('🦒', '🌳', 'neck-stretch');
  if (text.includes('butterfl')) return scene('🦋', '🌼', 'wing-flutter');
  if (text.includes('bat')) return scene('🦇', '〰️', 'echo-pulse');
  if (text.includes('dolphin')) return scene('🐬', '〰️', 'click-swim');
  if (text.includes('penguin')) return scene('🐧', '❄️', 'waddle');
  if (text.includes('owl')) return scene('🦉', '👀', 'head-turn');
  if (text.includes('chameleon')) return scene('🦎', '🌈', 'color-shift');
  if (text.includes('polar bear')) return scene('🐻‍❄️', '🖤', 'fur-reveal');
  if (text.includes('flamingo')) return scene('🦩', '🦐', 'food-color');
  if (text.includes('kangaroo') || text.includes('joey')) return scene('🦘', '🫶', 'pouch-bounce');
  if (text.includes('octopus')) return scene('🐙', '💙', 'heart-beat');
  if (text.includes('otter')) return scene('🦦', '🪨', 'rock-crack');
  if (text.includes('zebra')) return scene('🦓', '〰️', 'stripe-dash');
  if (text.includes('hummingbird')) return scene('🐦', '🌺', 'hover-feed');
  if (text.includes('camel')) return scene('🐪', '👁️', 'eyelash-blink');
  if (text.includes('fox')) return scene('🦊', '👂', 'snow-listen');
  if (text.includes('ant')) return scene('🐜', '〰️', 'antenna-sense');
  if (text.includes('red panda')) return scene('🐼', '🧣', 'tail-curl');
  if (text.includes('crocodile')) return scene('🐊', '🦷', 'tooth-grow');
  if (text.includes('hedgehog')) return scene('🦔', '🟤', 'curl-up');
  if (text.includes('horse')) return scene('🐎', '💤', 'standing-doze');
  if (text.includes('spider')) return scene('🕷️', '🕸️', 'leg-scuttle');
  if (text.includes('dog')) return scene('🐕', '🔎', 'nose-print');
  return scene('🦊', '✨', 'gentle-bob');
}

function plantScene(fact: string): WonderScene {
  const text = fact.toLowerCase();
  if (text.includes('sunflower seeds')) return scene('🌻', '🌻', 'seed-shower');
  if (text.includes('leaves use sunlight')) return scene('🍃', '☀️', 'make-food');
  if (text.includes('roots hold')) return scene('🌱', '💧', 'roots-drink');
  if (text.includes('cacti')) return scene('🌵', '💧', 'water-store');
  if (text.includes('sunflowers')) return scene('🌻', '☀️', 'sun-follow');
  if (text.includes('flytrap')) return scene('🪴', '🪰', 'leaf-snap');
  if (text.includes('bamboo')) return scene('🎋', '🌱', 'bamboo-sway');
  if (text.includes('ferns')) return scene('🌿', '✨', 'spore-drift');
  if (text.includes('moss')) return scene('🍀', '💧', 'surface-soak');
  if (text.includes('tree rings')) return scene('🌳', '🪵', 'tree-rings');
  if (text.includes('carrot')) return scene('🥕', '🟤', 'root-store');
  if (text.includes('water-lily')) return scene('🪷', '💧', 'lily-float');
  if (text.includes('pine trees')) return scene('🌲', '🍃', 'needle-sway');
  if (text.includes('pollinators')) return scene('🌼', '🐝', 'pollinate');
  if (text.includes('seed holds')) return scene('🌰', '🌱', 'seed-open');
  if (text.includes('aloe')) return scene('🪴', '💧', 'leaf-store');
  if (text.includes('dandelion')) return scene('🌼', '🌬️', 'wind-carry');
  if (text.includes('pea roots')) return scene('🫛', '🦠', 'root-partner');
  if (text.includes('pores on leaves')) return scene('🍃', '💨', 'leaf-breathe');
  if (text.includes('tiny tubes')) return scene('🌳', '💧', 'water-rise');
  if (text.includes('acorn')) return scene('🌰', '🍂', 'acorn-fall');
  if (text.includes('tendrils')) return scene('🫛', '〰️', 'tendril-climb');
  if (text.includes('pitcher plants')) return scene('🪴', '🪰', 'pitcher-trap');
  if (text.includes('seagrass')) return scene('🌿', '🐠', 'underwater-sway');
  if (text.includes('chlorophyll')) return scene('🍃', '☀️', 'sun-capture');
  return scene('🌱', '💧', 'gentle-grow');
}

function fishScene(fact: string): WonderScene {
  const text = fact.toLowerCase();
  if (text.includes('gills help')) return scene('🐟', '🫧', 'gill-breathe');
  if (text.includes('fins help')) return scene('🐠', '↗️', 'fin-steer');
  if (text.includes('scales')) return scene('🐟', '✨', 'scale-shimmer');
  if (text.includes('lateral line')) return scene('🐟', '〰️', 'sense-ripple');
  if (text.includes('clownfish')) return scene('🐠', '🪸', 'anemone-hide');
  if (text.includes('father seahorse')) return scene('🐠', '🥚', 'eggs-hatch');
  if (text.includes('pufferfish')) return scene('🐡', '💨', 'puff-up');
  if (text.includes('whale shark')) return scene('🦈', '🫧', 'plankton-filter');
  if (text.includes('shark')) return scene('🦈', '🦴', 'cartilage-glide');
  if (text.includes('flying fish')) return scene('🐟', '🌊', 'water-glide');
  if (text.includes('archerfish')) return scene('🐟', '💦', 'water-squirt');
  if (text.includes('mudskippers')) return scene('🐟', '🟤', 'mud-walk');
  if (text.includes('salmon')) return scene('🐟', '🥚', 'river-swim');
  if (text.includes('parrotfish')) return scene('🐠', '🪸', 'reef-nibble');
  if (text.includes('electric eel')) return scene('🪱', '⚡', 'electric-zap');
  if (text.includes('anglerfish')) return scene('🐟', '💡', 'lure-glow');
  if (text.includes('tuna')) return scene('🐟', '🫧', 'steady-swim');
  if (text.includes('flounder')) return scene('🐟', '👀', 'eye-shift');
  if (text.includes('rest')) return scene('🐠', '💤', 'fish-rest');
  if (text.includes('goldfish')) return scene('🐠', '🕒', 'feeding-routine');
  if (text.includes('seahorse')) return scene('🐠', '🌿', 'tail-grip');
  if (text.includes('stingray')) return scene('🪽', '🏖️', 'sand-hide');
  if (text.includes('herring')) return scene('🐟', '🐟', 'fish-school');
  if (text.includes('lungfish')) return scene('🐟', '💨', 'air-breath');
  if (text.includes('body shape')) return scene('🐟', '〰️', 'streamline');
  return scene('🐠', '🫧', 'gentle-swim');
}

function planetScene(fact: string): WonderScene {
  const text = fact.toLowerCase();
  if (text.includes('mercury travels')) return scene('⚫', '☀️', 'fast-orbit');
  if (text.includes('venus is the hottest')) return scene('🟠', '🔥', 'heat-wave');
  if (text.includes('earth has one')) return scene('🌍', '🌙', 'moon-orbit');
  if (text.includes('olympus mons')) return scene('🔴', '🌋', 'volcano-erupt');
  if (text.includes('jupiter is the biggest')) return scene('🟤', '✨', 'planet-grow');
  if (text.includes('great red spot')) return scene('🟤', '🌀', 'cloud-storm');
  if (text.includes('saturn') && text.includes('rings')) return scene('🪐', '🧊', 'ring-spin');
  if (text.includes('uranus spins tilted')) return scene('🔵', '〰️', 'tilted-spin');
  if (text.includes('fastest winds')) return scene('🔵', '💨', 'wind-rush');
  if (text.includes('four largest moons')) return scene('🟤', '🌙', 'moon-family');
  if (text.includes('titan')) return scene('🪐', '🌊', 'moon-lakes');
  if (text.includes('ganymede')) return scene('🟠', '🌙', 'large-moon');
  if (text.includes('phobos and deimos')) return scene('🔴', '🌙', 'twin-moons');
  if (text.includes('mercury has no moons')) return scene('⚫', '☀️', 'moonless-orbit');
  if (text.includes('venus takes longer')) return scene('🟠', '☀️', 'slow-spin');
  if (text.includes('methane') && text.includes('blue-green')) return scene('🔵', '🫧', 'methane-glow');
  if (text.includes('farthest')) return scene('🔵', '✨', 'far-planet');
  if (text.includes('tilted axis')) return scene('🌍', '🍂', 'seasons-turn');
  if (text.includes('long cliffs')) return scene('⚫', '🪨', 'cooling-cliffs');
  if (text.includes('moon io')) return scene('🌋', '🟠', 'io-erupt');
  if (text.includes('europa')) return scene('🧊', '🌊', 'hidden-ocean');
  if (text.includes('sunset on mars')) return scene('🔴', '🌅', 'blue-sunset');
  if (text.includes('sulfuric acid')) return scene('🟠', '☁️', 'cloud-cover');
  if (text.includes('nitrogen')) return scene('🌍', '💨', 'air-layers');
  if (text.includes('triton')) return scene('🔵', '🌙', 'reverse-orbit');
  return scene('🪐', '⭐', 'gentle-orbit');
}

const sceneFor: Record<WonderCategoryId, (fact: string) => WonderScene> = {
  animals: animalScene,
  plants: plantScene,
  fish: fishScene,
  planets: planetScene,
};

export default function WonderCardAnimation({ category, fact, label, className = '' }: {
  category: WonderCategoryId;
  fact: string;
  label?: string;
  className?: string;
}) {
  const selected = sceneFor[category](fact);

  return (
    <div className={`wonder-card-animation wonder-animation-${category} wonder-motion-${selected.motion} ${className}`.trim()} role="img" aria-label={label ?? fact}>
      <span className="wonder-animation-halo" aria-hidden="true" />
      <span className="wonder-animation-companion" aria-hidden="true">{selected.companion}</span>
      <span className="wonder-animation-subject" aria-hidden="true">{selected.subject}</span>
      <span className="wonder-animation-floor" aria-hidden="true" />
      <span className="wonder-animation-sparkle" aria-hidden="true">✦</span>
    </div>
  );
}
