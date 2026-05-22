import { create } from 'zustand';
import { fsrs, Rating, type Grade } from 'ts-fsrs';
import {
  DomainId,
  PersistedState,
  ExamSession,
  ExamAttempt,
  DiagnosticResult,
  StudyPlan,
  emptyState,
  loadProgress,
  saveProgress,
  wipeProgress,
  defaultFsrsState,
  deserializeFsrs,
  serializeFsrs,
} from './lib/storage';
import { accuracyFromHistory, recomputeStudyPlan as recomputePlan } from './lib/studyplan';
import { BADGES } from './lib/badges';
import { FLASHCARDS } from './content/flashcards';

const scheduler = fsrs();

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
  gradeCard: (cardId: string, rating: Grade) => void;
  enqueueRemediation: (questionIds: string[]) => void;
  recordRemediationAnswer: (questionId: string, correct: boolean, sessionId: string) => void;
  startExamSession: (s: ExamSession) => void;
  updateExamSession: (patch: Partial<ExamSession>) => void;
  finishExamAttempt: (a: ExamAttempt) => void;
  clearExamSession: () => void;
  setDiagnostic: (r: DiagnosticResult) => void;
  setStudyPlan: (p: StudyPlan) => void;
  markStudyDayDone: (isoDate: string, done?: boolean) => void;
  recomputeStudyPlanWeekly: () => void;
  resetStudyPlan: () => void;
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

  enqueueRemediation: (ids) => {
    const cur = get();
    const r = { ...cur.remediation };
    const now = Date.now();
    let added = 0;
    for (const id of ids) {
      if (!r[id]) {
        r[id] = { addedTs: now, streak: 0 };
        added++;
      }
    }
    if (added > 0) {
      set({ remediation: r });
      get().pushToast(`+${added} item${added === 1 ? '' : 's'} added to remediation queue`, 'info');
    }
  },

  startExamSession: (s) => set({ examSession: s }),
  updateExamSession: (patch) => {
    const cur = get().examSession;
    if (!cur) return;
    set({ examSession: { ...cur, ...patch } });
  },
  finishExamAttempt: (a) => {
    const attempts = [...get().examAttempts, a].slice(-50);
    set({ examAttempts: attempts, examSession: undefined });
    // legacy examBests mirror — keep filled for backward compat
    const bests = [...get().examBests, { score: a.rawCorrect, total: a.total, ts: a.finishedTs }].slice(-20);
    set({ examBests: bests });
  },
  clearExamSession: () => set({ examSession: undefined }),

  setDiagnostic: (r) => set({ diagnosticResult: r }),
  setStudyPlan: (p) => set({ studyPlan: p }),
  markStudyDayDone: (isoDate, done = true) => {
    const cur = get().studyPlan;
    if (!cur) return;
    const days = cur.days.map((d) => (d.isoDate === isoDate ? { ...d, done } : d));
    set({ studyPlan: { ...cur, days } });
  },
  recomputeStudyPlanWeekly: () => {
    const cur = get();
    if (!cur.studyPlan) return;
    const last = cur.studyPlan.lastRecomputeISO;
    const today = new Date().toISOString().slice(0, 10);
    const lastDate = last ? new Date(last + 'T00:00:00').getTime() : 0;
    if (Date.now() - lastDate < 6 * 86400 * 1000) return; // ~weekly
    const sinceTs = Date.now() - 7 * 86400 * 1000;
    const acc = accuracyFromHistory(cur.quizHistory, sinceTs);
    const next = recomputePlan(cur.studyPlan, acc);
    set({ studyPlan: { ...next, lastRecomputeISO: today } });
  },
  resetStudyPlan: () => set({ studyPlan: undefined, diagnosticResult: undefined }),

  recordRemediationAnswer: (id, correct, sessionId) => {
    const cur = get();
    const item = cur.remediation[id];
    if (!item) return; // not enqueued; no-op

    if (!correct) {
      set({ remediation: { ...cur.remediation, [id]: { ...item, streak: 0, lastSessionId: sessionId } } });
      return;
    }
    // correct
    if (item.lastSessionId === sessionId) {
      // same session — don't advance streak (must be across different sessions)
      set({ remediation: { ...cur.remediation, [id]: { ...item, lastSessionId: sessionId } } });
      return;
    }
    const nextStreak = item.streak + 1;
    if (nextStreak >= 3) {
      const next = { ...cur.remediation };
      delete next[id];
      set({ remediation: next });
      get().pushToast('✓ Item graduated from remediation', 'good');
      return;
    }
    set({ remediation: { ...cur.remediation, [id]: { ...item, streak: nextStreak, lastSessionId: sessionId } } });
  },

  gradeCard: (cardId, rating) => {
    const cur = get();
    const now = new Date();
    const prev = cur.srs[cardId];
    const card = prev ? deserializeFsrs(prev) : deserializeFsrs(defaultFsrsState(now));
    const { card: next } = scheduler.next(card, now, rating);
    const nextSer = serializeFsrs(next);
    set({ srs: { ...cur.srs, [cardId]: nextSer } });

    // tiny XP for any review; bigger when graded Good or Easy
    const xp = rating === Rating.Again ? 1 : rating === Rating.Hard ? 3 : rating === Rating.Good ? 5 : 7;
    get().addXP(xp, { silent: true });

    // encyclopedia: all flashcards reached the FSRS Review state with at least one Good/Easy rep.
    // State 2 = Review in ts-fsrs.
    const srsAfter = { ...cur.srs, [cardId]: nextSer };
    const masteredAll = FLASHCARDS.every((c) => {
      const s = srsAfter[c.id];
      return s && s.state === 2 && s.reps >= 1;
    });
    if (masteredAll) get().unlockBadge('encyclopedia');
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
      remediation: s.remediation,
      examAttempts: s.examAttempts,
      examSession: s.examSession,
      diagnosticResult: s.diagnosticResult,
      studyPlan: s.studyPlan,
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
      s.remediation === prev.remediation &&
      s.examAttempts === prev.examAttempts &&
      s.examSession === prev.examSession &&
      s.diagnosticResult === prev.diagnosticResult &&
      s.studyPlan === prev.studyPlan &&
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
