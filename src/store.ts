import { create } from 'zustand';
import {
  DomainId,
  PersistedState,
  emptyState,
  loadProgress,
  saveProgress,
  wipeProgress,
} from './lib/storage';
import { BADGES } from './lib/badges';

type Toast = { id: number; msg: string; tone?: 'info' | 'good' | 'bad' };

type StoreState = PersistedState & {
  _hydrated: boolean;
  _toasts: Toast[];
  _xpFloats: { id: number; amount: number; x: number; y: number }[];
};

type StoreActions = {
  hydrate: (s: PersistedState) => void;
  setUsername: (n: string) => void;
  setAvatar: (e: string) => void;
  addXP: (amount: number, opts?: { silent?: boolean; floatAt?: { x: number; y: number } }) => void;
  recordQuizAnswer: (q: { id: string; correct: boolean; domain: DomainId }) => void;
  recordExam: (score: number, total: number) => void;
  bumpModule: (domain: DomainId, moduleId: string, progress: number) => void;
  setStoryScene: (chapterId: string, scene: number) => void;
  setSrs: (cardId: string, box: 1 | 2 | 3 | 4 | 5) => void;
  registerActivity: () => void;
  unlockBadge: (id: string) => void;
  setSetting: <K extends keyof PersistedState['settings']>(k: K, v: PersistedState['settings'][K]) => void;
  setDailyChallenge: (q: PersistedState['dailyChallenge']) => void;
  pushToast: (msg: string, tone?: Toast['tone']) => void;
  dismissToast: (id: number) => void;
  pushXpFloat: (amount: number, x: number, y: number) => void;
  removeXpFloat: (id: number) => void;
  reset: () => Promise<void>;
  importState: (s: PersistedState) => Promise<void>;
};

let toastId = 0;
let floatId = 0;

const initial = emptyState();

export const useStore = create<StoreState & StoreActions>((set, get) => ({
  ...initial,
  _hydrated: false,
  _toasts: [],
  _xpFloats: [],

  hydrate: (s) => set({ ...s, _hydrated: true }),

  setUsername: (n) => set({ username: n.slice(0, 24).replace(/[^a-zA-Z0-9_\- ]/g, '') }),
  setAvatar: (e) => set({ avatar: e }),

  addXP: (amount, opts) => {
    const cur = get();
    const next = cur.xp + Math.max(0, Math.round(amount));
    set({ xp: next });
    if (!opts?.silent && amount > 0) {
      const f = opts?.floatAt ?? { x: window.innerWidth - 80, y: 70 };
      get().pushXpFloat(amount, f.x, f.y);
    }
  },

  recordQuizAnswer: ({ id, correct, domain }) => {
    const hist = [...get().quizHistory, { id, correct, ts: Date.now(), domain }].slice(-500);
    set({ quizHistory: hist });
    // sharpshooter — 10 correct in a row
    const last10 = hist.slice(-10);
    if (last10.length === 10 && last10.every((h) => h.correct)) {
      get().unlockBadge('sharpshooter');
    }
  },

  recordExam: (score, total) => {
    const bests = [...get().examBests, { score, total, ts: Date.now() }].slice(-20);
    set({ examBests: bests });
  },

  bumpModule: (domain, moduleId, progress) => {
    const cur = get();
    const done = new Set(cur.domainModulesDone[domain]);
    if (progress >= 1) done.add(moduleId);
    const arr = Array.from(done);
    set({
      domainModulesDone: { ...cur.domainModulesDone, [domain]: arr },
      domainProgress: {
        ...cur.domainProgress,
        [domain]: Math.max(cur.domainProgress[domain], Math.min(1, progress)),
      },
    });
    // domain complete badge
    if (cur.domainProgress[domain] < 1 && progress >= 1) {
      const map: Record<DomainId, string> = {
        D1: 'cia_guardian',
        D2: 'incident_handler',
        D3: 'access_gatekeeper',
        D4: 'network_defender',
        D5: 'security_operator',
      };
      get().unlockBadge(map[domain]);
      // all done?
      const after = { ...cur.domainProgress, [domain]: 1 };
      if (Object.values(after).every((v) => v >= 1)) get().unlockBadge('cc_champion');
    }
  },

  setStoryScene: (chapterId, scene) => {
    set({ storyProgress: { ...get().storyProgress, [chapterId]: scene } });
  },

  setSrs: (cardId, box) => {
    const days = [0, 1, 2, 4, 7, 14][box] ?? 1;
    const due = new Date(Date.now() + days * 24 * 3600 * 1000).toISOString();
    set({ srs: { ...get().srs, [cardId]: { box, dueISO: due } } });
  },

  registerActivity: () => {
    const today = new Date().toISOString().slice(0, 10);
    const cur = get();
    const last = cur.streak.lastActiveISO;
    if (last === today) return;
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const count = last === yesterday ? cur.streak.count + 1 : 1;
    set({ streak: { count, lastActiveISO: today } });
    if (count >= 7) get().unlockBadge('on_fire');
  },

  unlockBadge: (id) => {
    const cur = get();
    if (cur.badges.includes(id)) return;
    set({ badges: [...cur.badges, id] });
    const b = BADGES.find((x) => x.id === id);
    if (b) get().pushToast(`${b.emoji} Badge unlocked: ${b.name}`, 'good');
  },

  setSetting: (k, v) => {
    set({ settings: { ...get().settings, [k]: v } });
  },

  setDailyChallenge: (q) => set({ dailyChallenge: q }),

  pushToast: (msg, tone) => {
    const id = ++toastId;
    set({ _toasts: [...get()._toasts, { id, msg, tone }] });
    setTimeout(() => get().dismissToast(id), 4000);
  },
  dismissToast: (id) => set({ _toasts: get()._toasts.filter((t) => t.id !== id) }),
  pushXpFloat: (amount, x, y) => {
    const id = ++floatId;
    set({ _xpFloats: [...get()._xpFloats, { id, amount, x, y }] });
    setTimeout(() => get().removeXpFloat(id), 1100);
  },
  removeXpFloat: (id) => set({ _xpFloats: get()._xpFloats.filter((f) => f.id !== id) }),

  reset: async () => {
    await wipeProgress();
    const fresh = emptyState();
    set({ ...fresh, _hydrated: true, _toasts: [], _xpFloats: [] });
  },

  importState: async (s) => {
    set({ ...s, _hydrated: true });
    await saveProgress(s);
  },
}));

// debounced persistence
let saveTimer: number | undefined;
function debouncedSave() {
  if (saveTimer) window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => {
    const s = useStore.getState();
    if (!s._hydrated) return;
    const persisted: PersistedState = {
      schemaVersion: s.schemaVersion,
      userId: s.userId,
      username: s.username,
      avatar: s.avatar,
      createdAtISO: s.createdAtISO,
      xp: s.xp,
      streak: s.streak,
      domainProgress: s.domainProgress,
      domainModulesDone: s.domainModulesDone,
      badges: s.badges,
      quizHistory: s.quizHistory,
      examBests: s.examBests,
      srs: s.srs,
      storyProgress: s.storyProgress,
      settings: s.settings,
      dailyChallenge: s.dailyChallenge,
    };
    saveProgress(persisted);
  }, 400);
}

useStore.subscribe((s, prev) => {
  if (!s._hydrated) return;
  // ignore transient ui state
  if (
    s._toasts !== prev._toasts ||
    s._xpFloats !== prev._xpFloats
  ) {
    const onlyUI =
      s.xp === prev.xp &&
      s.badges === prev.badges &&
      s.quizHistory === prev.quizHistory &&
      s.srs === prev.srs &&
      s.storyProgress === prev.storyProgress &&
      s.domainProgress === prev.domainProgress &&
      s.examBests === prev.examBests &&
      s.streak === prev.streak &&
      s.username === prev.username &&
      s.avatar === prev.avatar &&
      s.settings === prev.settings &&
      s.dailyChallenge === prev.dailyChallenge;
    if (onlyUI) return;
  }
  debouncedSave();
});

export async function hydrateStoreFromIDB() {
  const loaded = await loadProgress();
  if (loaded) {
    useStore.getState().hydrate(loaded);
  } else {
    const fresh = emptyState();
    useStore.getState().hydrate(fresh);
    await saveProgress(fresh);
  }
}

// selectors
export const selectIsOnboarded = (s: StoreState) => !!s.username;
