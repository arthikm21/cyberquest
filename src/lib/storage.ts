import { get, set, del } from 'idb-keyval';
import { createEmptyCard, State, type Card as FsrsCard } from 'ts-fsrs';

export const KEY = 'cyberquest:v1'; // IDB key name (kept stable across schema versions)
export const SCHEMA_VERSION = 5;

export type DomainId = 'D1' | 'D2' | 'D3' | 'D4' | 'D5';

export type Settings = {
  reducedMotion: boolean;
  sound: boolean;
  theme: 'dark' | 'light';
};

// Serialized FSRS card state (dates as ISO strings for IDB-safe storage).
export type FsrsCardState = {
  due: string;
  stability: number;
  difficulty: number;
  elapsed_days: number;
  scheduled_days: number;
  learning_steps: number;
  reps: number;
  lapses: number;
  state: 0 | 1 | 2 | 3; // mirrors ts-fsrs State enum
  last_review?: string;
};

export type RemediationItem = {
  addedTs: number;
  streak: number; // consecutive correct answers across different sessions; remove at >= 3
  lastSessionId?: string;
};

export type ExamAttempt = {
  id: string;
  startedTs: number;
  finishedTs: number;
  total: number;
  rawCorrect: number;
  scaledScore: number; // 0..1000, linear map (raw/total * 1000)
  perDomain: Record<DomainId, { right: number; total: number }>;
  timeUsedSec: number;
};

export type ExamSession = {
  id: string;
  startedTs: number;
  durationSec: number; // wall-clock duration; remaining = durationSec - (now - startedTs)
  questionIds: string[];
  answers: (number | null)[];
  flagged: boolean[];
  currentIdx: number;
};

export type DiagnosticResult = {
  takenAt: number;
  total: number;
  perDomain: Record<DomainId, { right: number; total: number; pct: number }>;
};

export type StudyPlanDay = {
  isoDate: string; // YYYY-MM-DD
  focusDomain: DomainId;
  lessonModuleId?: string;
  quizCount: number;
  cardCount: number;
  done: boolean;
};

export type StudyPlan = {
  id: string;
  createdAt: number;
  startISO: string;
  weeks: number; // 4
  days: StudyPlanDay[];
  hoursPerWeek: number;
  lastRecomputeISO?: string;
  baselineAccuracy: Record<DomainId, number>;
};

export type PersistedState = {
  schemaVersion: number;
  userId: string;
  username: string;
  avatar: string;
  createdAtISO: string;
  xp: number;
  streak: { count: number; lastActiveISO: string };
  domainProgress: Record<DomainId, number>;
  domainModulesDone: Record<DomainId, string[]>;
  badges: string[];
  quizHistory: Array<{ id: string; correct: boolean; ts: number; domain: DomainId }>;
  examBests: Array<{ score: number; total: number; ts: number }>;
  examAttempts: ExamAttempt[];
  examSession?: ExamSession;
  diagnosticResult?: DiagnosticResult;
  studyPlan?: StudyPlan;
  srs: Record<string, FsrsCardState>;
  remediation: Record<string, RemediationItem>;
  storyProgress: Record<string, number>;
  settings: Settings;
  dailyChallenge?: { dateISO: string; questionId: string; done: boolean; correct?: boolean };
};

export function defaultFsrsState(now: Date = new Date()): FsrsCardState {
  return serializeFsrs(createEmptyCard(now));
}

export function serializeFsrs(c: FsrsCard): FsrsCardState {
  return {
    due: c.due.toISOString(),
    stability: c.stability,
    difficulty: c.difficulty,
    elapsed_days: c.elapsed_days,
    scheduled_days: c.scheduled_days,
    learning_steps: c.learning_steps,
    reps: c.reps,
    lapses: c.lapses,
    state: c.state as 0 | 1 | 2 | 3,
    last_review: c.last_review ? c.last_review.toISOString() : undefined,
  };
}

export function deserializeFsrs(s: FsrsCardState): FsrsCard {
  return {
    due: new Date(s.due),
    stability: s.stability,
    difficulty: s.difficulty,
    elapsed_days: s.elapsed_days,
    scheduled_days: s.scheduled_days,
    learning_steps: s.learning_steps,
    reps: s.reps,
    lapses: s.lapses,
    state: s.state as State,
    last_review: s.last_review ? new Date(s.last_review) : undefined,
  };
}

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
    examAttempts: [],
    srs: {},
    remediation: {},
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
    console.warn('saveProgress failed', err);
  }
}

export async function wipeProgress() {
  try { await del(KEY); } catch {}
}

/**
 * Forward migrations. Each block lifts state up exactly one version.
 * Existing user data is never destroyed silently — missing fields get
 * sensible defaults.
 */
function migrate(s: PersistedState): PersistedState {
  let cur = s;

  // v1 → v2: Leitner SrsCard (box, dueISO) → FSRS card state.
  // Box scores are not directly translatable to FSRS stability/difficulty;
  // safer to reset each touched card to a default FSRS state due now,
  // letting the user re-grade once. Untouched cards remain absent (treated as "new").
  if ((cur.schemaVersion ?? 1) < 2) {
    const oldSrs = (cur.srs ?? {}) as Record<string, unknown>;
    const newSrs: Record<string, FsrsCardState> = {};
    for (const id of Object.keys(oldSrs)) {
      newSrs[id] = defaultFsrsState();
    }
    cur = { ...cur, srs: newSrs };
  }

  // Fill any newly-introduced top-level fields with defaults from emptyState.
  const defaults = emptyState();
  cur = { ...defaults, ...cur, settings: { ...defaults.settings, ...(cur.settings ?? {}) } };

  return { ...cur, schemaVersion: SCHEMA_VERSION };
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
