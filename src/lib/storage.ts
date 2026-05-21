import { get, set, del } from 'idb-keyval';

export const KEY = 'cyberquest:v1';
export const SCHEMA_VERSION = 1;

export type DomainId = 'D1' | 'D2' | 'D3' | 'D4' | 'D5';

export type Settings = {
  reducedMotion: boolean;
  sound: boolean;
  theme: 'dark' | 'light';
};

export type SrsCard = { box: 1 | 2 | 3 | 4 | 5; dueISO: string };

export type PersistedState = {
  schemaVersion: number;
  userId: string;
  username: string;
  avatar: string; // emoji
  createdAtISO: string;
  xp: number;
  streak: { count: number; lastActiveISO: string };
  domainProgress: Record<DomainId, number>; // 0..1
  domainModulesDone: Record<DomainId, string[]>;
  badges: string[];
  quizHistory: Array<{ id: string; correct: boolean; ts: number; domain: DomainId }>;
  examBests: Array<{ score: number; total: number; ts: number }>;
  srs: Record<string, SrsCard>;
  storyProgress: Record<string, number>; // chapterId -> scene index
  settings: Settings;
  dailyChallenge?: { dateISO: string; questionId: string; done: boolean; correct?: boolean };
};

export function emptyState(): PersistedState {
  const id =
    (globalThis.crypto && 'randomUUID' in globalThis.crypto)
      ? globalThis.crypto.randomUUID()
      : 'u_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
  return {
    schemaVersion: SCHEMA_VERSION,
    userId: id,
    username: '',
    avatar: '🛡️',
    createdAtISO: new Date().toISOString(),
    xp: 0,
    streak: { count: 0, lastActiveISO: '' },
    domainProgress: { D1: 0, D2: 0, D3: 0, D4: 0, D5: 0 },
    domainModulesDone: { D1: [], D2: [], D3: [], D4: [], D5: [] },
    badges: [],
    quizHistory: [],
    examBests: [],
    srs: {},
    storyProgress: {},
    settings: { reducedMotion: false, sound: true, theme: 'dark' },
  };
}

export async function loadProgress(): Promise<PersistedState | null> {
  try {
    const raw = await get<PersistedState>(KEY);
    if (!raw) return null;
    return migrate(raw);
  } catch {
    return null;
  }
}

export async function saveProgress(state: PersistedState) {
  try {
    await set(KEY, { ...state, schemaVersion: SCHEMA_VERSION });
  } catch (err) {
    // silently degrade — caller may toast
    console.warn('saveProgress failed', err);
  }
}

export async function wipeProgress() {
  try { await del(KEY); } catch {}
}

function migrate(s: PersistedState): PersistedState {
  if (s.schemaVersion === SCHEMA_VERSION) return s;
  return { ...emptyState(), ...s, schemaVersion: SCHEMA_VERSION };
}

export function downloadJSON(state: PersistedState) {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cyberquest-progress-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
