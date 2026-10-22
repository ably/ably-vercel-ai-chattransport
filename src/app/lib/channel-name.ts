const WORDS = [
  'astronaut',
  'badger',
  'banjo',
  'basalt',
  'beacon',
  'beagle',
  'blossom',
  'boomerang',
  'breeze',
  'bubble',
  'cactus',
  'canyon',
  'cheesecake',
  'cipher',
  'clover',
  'comet',
  'compass',
  'cricket',
  'crumpet',
  'dahlia',
  'dolphin',
  'dragon',
  'dumpling',
  'ember',
  'falcon',
  'finch',
  'fjord',
  'follow',
  'forest',
  'galaxy',
  'gazelle',
  'giraffe',
  'glacier',
  'gopher',
  'harbor',
  'hazel',
  'heron',
  'jasper',
  'juniper',
  'kettle',
  'lantern',
  'lemur',
  'lilac',
  'lobster',
  'magpie',
  'maple',
  'marble',
  'meadow',
  'minnow',
  'mosaic',
  'narwhal',
  'nebula',
  'nimbus',
  'ocelot',
  'orchid',
  'otter',
  'panda',
  'parsnip',
  'pebble',
  'penguin',
  'pickle',
  'pigeon',
  'plum',
  'poppy',
  'puffin',
  'quartz',
  'quokka',
  'raccoon',
  'river',
  'saffron',
  'salmon',
  'sparrow',
  'sprightly',
  'swallow',
  'tangerine',
  'thistle',
  'tiger',
  'turnip',
  'violet',
  'walrus',
  'willow',
];

function pickWord(): string {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

// Anyone who knows a session's channel name can join it, so the name must be
// unguessable. The words keep it readable; the 96-bit random suffix makes it
// unguessable.
function randomSuffix(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

export function generateChannelSlug(): string {
  return `${pickWord()}-${pickWord()}-${randomSuffix()}`;
}

export function generateClientName(): string {
  return `${pickWord()}-${pickWord()}`;
}

export const CHANNEL_NAMESPACE = process.env.NEXT_PUBLIC_ABLY_CHANNEL_NAMESPACE ?? 'ai:';

const SLUG_PATTERN = /^[A-Za-z0-9_-]{1,128}$/;

// A session channel is `<namespace><slug>`. The slug pattern excludes `*`, so a
// name that passes can never widen into a wildcard capability.
export function isSessionChannel(name: string): boolean {
  return name.startsWith(CHANNEL_NAMESPACE) && SLUG_PATTERN.test(name.slice(CHANNEL_NAMESPACE.length));
}

// `*` as a token's clientId lets the holder publish as any clientId, so it is
// never accepted.
export function isValidClientId(clientId: string): boolean {
  return clientId.length > 0 && clientId.length <= 128 && clientId !== '*';
}
