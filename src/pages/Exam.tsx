import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { QUESTIONS, QUESTIONS_BY_DOMAIN, pickRandom, sampleByBlueprint } from '../content/questions';
import { useStore } from '../store';
import { Question } from '../content/types';
import { DomainId } from '../lib/storage';

const RadarReview = lazy(() => import('../components/RadarReview'));

const TARGET_QS = 100;
const EXAM_SECONDS = 120 * 60; // 120 min wall-clock
const PASS_SCALED = 700;

const POOL = QUESTIONS.filter((q) => q.type !== 'multi');

function isCorrectIndex(q: Question, i: number | null): boolean {
  if (i === null || i < 0) return false;
  if (Array.isArray(q.correct)) return q.correct.includes(i);
  return q.correct === i;
}

function correctIndexOf(q: Question): number {
  return Array.isArray(q.correct) ? q.correct[0] : q.correct;
}

function wrongIndexFor(q: Question, picked: number): number {
  if (Array.isArray(q.correct)) return -1;
  return picked < q.correct ? picked : picked - 1;
}

function newId(): string {
  if (globalThis.crypto && 'randomUUID' in globalThis.crypto) return globalThis.crypto.randomUUID();
  return 'e_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function fmtClock(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

type Phase = 'intro' | 'taking' | 'done';

export default function Exam() {
  const examSession = useStore((s) => s.examSession);
  const examAttempts = useStore((s) => s.examAttempts);
  const startExamSession = useStore((s) => s.startExamSession);
  const updateExamSession = useStore((s) => s.updateExamSession);
  const finishExamAttempt = useStore((s) => s.finishExamAttempt);
  const clearExamSession = useStore((s) => s.clearExamSession);
  const addXP = useStore((s) => s.addXP);
  const enqueueRemediation = useStore((s) => s.enqueueRemediation);

  // Phase derives from session presence; final review is its own state.
  const [phase, setPhase] = useState<Phase>(() => (examSession ? 'taking' : 'intro'));
  const [finalAttempt, setFinalAttempt] = useState<ExamFinalView | null>(null);

  // Tick for timer display only — persisted timer is wall-clock from startedTs.
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (phase !== 'taking') return;
    const iv = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(iv);
  }, [phase]);

  const remaining = examSession
    ? Math.max(0, examSession.durationSec - Math.floor((now - examSession.startedTs) / 1000))
    : 0;

  // Rehydrate questions from session ids.
  const questions: Question[] = useMemo(() => {
    if (!examSession) return [];
    return examSession.questionIds
      .map((id) => POOL.find((q) => q.id === id))
      .filter((q): q is Question => !!q);
  }, [examSession]);

  // Auto-submit on timer expire.
  useEffect(() => {
    if (phase === 'taking' && examSession && remaining <= 0) {
      submit('expired');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining, phase, examSession]);

  function start() {
    // Blueprint-weighted sample. With current bank, fewer than 100 items may be drawn.
    const drawn = sampleByBlueprint(TARGET_QS);
    const ids = drawn.map((q) => q.id);
    const session = {
      id: newId(),
      startedTs: Date.now(),
      durationSec: EXAM_SECONDS,
      questionIds: ids,
      answers: Array(ids.length).fill(null),
      flagged: Array(ids.length).fill(false),
      currentIdx: 0,
    };
    startExamSession(session);
    setNow(Date.now());
    setPhase('taking');
  }

  function abandon() {
    if (!confirm('Abandon this exam attempt? Your progress for this attempt will be lost.')) return;
    clearExamSession();
    setPhase('intro');
  }

  function pick(i: number) {
    if (!examSession) return;
    const next = [...examSession.answers];
    next[examSession.currentIdx] = i;
    updateExamSession({ answers: next });
  }

  function toggleFlag() {
    if (!examSession) return;
    const next = [...examSession.flagged];
    next[examSession.currentIdx] = !next[examSession.currentIdx];
    updateExamSession({ flagged: next });
  }

  function go(delta: number) {
    if (!examSession) return;
    const target = Math.max(0, Math.min(questions.length - 1, examSession.currentIdx + delta));
    if (target !== examSession.currentIdx) updateExamSession({ currentIdx: target });
  }

  function jumpTo(i: number) {
    if (!examSession) return;
    if (i < 0 || i >= questions.length) return;
    updateExamSession({ currentIdx: i });
  }

  function submit(reason: 'manual' | 'expired') {
    if (!examSession) return;
    if (reason === 'manual') {
      const unanswered = examSession.answers.filter((a) => a === null).length;
      if (unanswered > 0 && !confirm(`Submit with ${unanswered} unanswered? They will count as wrong.`)) return;
    }
    const total = questions.length;
    let rawCorrect = 0;
    const perDomain: Record<DomainId, { right: number; total: number }> = {
      D1: { right: 0, total: 0 },
      D2: { right: 0, total: 0 },
      D3: { right: 0, total: 0 },
      D4: { right: 0, total: 0 },
      D5: { right: 0, total: 0 },
    };
    const missedSiblings: string[] = [];
    questions.forEach((q, i) => {
      perDomain[q.domain].total++;
      if (isCorrectIndex(q, examSession.answers[i])) {
        perDomain[q.domain].right++;
        rawCorrect++;
      } else {
        const subPool = QUESTIONS.filter((qq) => qq.subObjective === q.subObjective && qq.id !== q.id && qq.type !== 'multi');
        const picks = pickRandom(subPool, Math.min(3, subPool.length)).map((qq) => qq.id);
        missedSiblings.push(...picks);
      }
    });
    if (missedSiblings.length > 0) enqueueRemediation(missedSiblings);

    const scaled = total > 0 ? Math.round((rawCorrect / total) * 1000) : 0;
    const timeUsedSec = Math.floor((Date.now() - examSession.startedTs) / 1000);
    const attempt = {
      id: examSession.id,
      startedTs: examSession.startedTs,
      finishedTs: Date.now(),
      total,
      rawCorrect,
      scaledScore: scaled,
      perDomain,
      timeUsedSec,
    };
    finishExamAttempt(attempt);
    addXP(50 + Math.floor(scaled / 5));

    setFinalAttempt({
      attempt,
      questions,
      answers: examSession.answers,
      reason,
    });
    setPhase('done');
  }

  // Keyboard nav (only while taking).
  useEffect(() => {
    if (phase !== 'taking' || !examSession) return;
    const onKey = (e: KeyboardEvent) => {
      // skip when typing in inputs (none in exam, but defensive)
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return;
      if (e.key === '1' || e.key === '2' || e.key === '3' || e.key === '4') {
        const n = Number(e.key) - 1;
        const q = questions[examSession.currentIdx];
        if (q && n < q.options.length) {
          e.preventDefault();
          pick(n);
        }
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFlag();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        go(-1);
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        e.preventDefault();
        go(1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, examSession, questions]);

  // -------------- INTRO --------------
  if (phase === 'intro') {
    const havePool = {
      D1: QUESTIONS_BY_DOMAIN.D1?.filter((q) => q.type !== 'multi').length ?? 0,
      D2: QUESTIONS_BY_DOMAIN.D2?.filter((q) => q.type !== 'multi').length ?? 0,
      D3: QUESTIONS_BY_DOMAIN.D3?.filter((q) => q.type !== 'multi').length ?? 0,
      D4: QUESTIONS_BY_DOMAIN.D4?.filter((q) => q.type !== 'multi').length ?? 0,
      D5: QUESTIONS_BY_DOMAIN.D5?.filter((q) => q.type !== 'multi').length ?? 0,
    };
    const want = { D1: 26, D2: 10, D3: 22, D4: 24, D5: 18 };
    const projected =
      Math.min(want.D1, havePool.D1) +
      Math.min(want.D2, havePool.D2) +
      Math.min(want.D3, havePool.D3) +
      Math.min(want.D4, havePool.D4) +
      Math.min(want.D5, havePool.D5);
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <h1 className="text-3xl font-extrabold gradient-text">Exam Simulator</h1>
        <div className="card space-y-3">
          <p className="text-text-secondary">
            Full mock — blueprint-weighted draw mirroring the real CC exam (D1 26% · D2 10% · D3 22% · D4 24% · D5 18%).
            120-minute wall-clock timer. Refresh-safe (saved in browser). Pass at scaled 700/1000.
          </p>
          {projected < TARGET_QS && (
            <div className="text-xs bg-warning/10 border border-warning/40 rounded-lg p-2 text-warning">
              Heads-up: current item bank can supply <b>{projected}</b> of the targeted {TARGET_QS} questions
              (bank still growing). Score scales linearly — raw {Math.round(0.7 * projected)}/{projected} ≈ 700.
            </div>
          )}
          <ul className="text-sm text-text-secondary list-disc list-inside space-y-1">
            <li>No feedback during the exam. Full review afterwards.</li>
            <li>Keyboard: <kbd className="kbd">1</kbd>–<kbd className="kbd">4</kbd> select option · <kbd className="kbd">F</kbd> flag · <kbd className="kbd">←</kbd> / <kbd className="kbd">→</kbd> navigate · <kbd className="kbd">Enter</kbd> next.</li>
            <li>Wall-clock timer keeps running across refreshes and closed tabs.</li>
            <li>Your attempt history is saved on this browser.</li>
          </ul>
          <div className="flex flex-wrap gap-2">
            <button className="btn-primary" onClick={start}>Start exam</button>
            <Link to="/quiz/practice" className="btn-ghost">Practice instead</Link>
          </div>
        </div>

        {examAttempts.length > 0 && (
          <div className="card">
            <h3 className="font-bold mb-2">Recent attempts</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-text-secondary">
                  <th className="py-1">Date</th>
                  <th>Scaled</th>
                  <th>Raw</th>
                  <th>Time</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {[...examAttempts].reverse().slice(0, 10).map((a) => (
                  <tr key={a.id} className="border-t border-border/40">
                    <td className="py-1 text-text-secondary">{new Date(a.finishedTs).toLocaleDateString()}</td>
                    <td className={'font-mono ' + (a.scaledScore >= PASS_SCALED ? 'text-success' : 'text-danger')}>{a.scaledScore}</td>
                    <td className="font-mono">{a.rawCorrect}/{a.total}</td>
                    <td className="font-mono text-text-secondary">{fmtClock(a.timeUsedSec)}</td>
                    <td>{a.scaledScore >= PASS_SCALED ? <span className="text-success text-xs">PASS</span> : <span className="text-danger text-xs">FAIL</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  // -------------- DONE (final review) --------------
  if (phase === 'done' && finalAttempt) {
    const { attempt, questions: qs, answers, reason } = finalAttempt;
    const radarData = (Object.keys(attempt.perDomain) as DomainId[])
      .filter((d) => attempt.perDomain[d].total > 0)
      .map((d) => ({ domain: d, score: Math.round((attempt.perDomain[d].right / attempt.perDomain[d].total) * 100) }));
    const passed = attempt.scaledScore >= PASS_SCALED;
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="card text-center">
          <div className="text-xs text-text-secondary uppercase">Exam Result {reason === 'expired' && '· auto-submitted on timeout'}</div>
          <div className="text-6xl font-extrabold mt-2" style={{ color: passed ? '#10b981' : '#ef4444' }}>{attempt.scaledScore}</div>
          <div className="text-sm text-text-secondary">scaled score · 0–1000 · pass ≥ {PASS_SCALED}</div>
          <div className={passed ? 'text-success font-bold mt-1' : 'text-danger font-bold mt-1'}>{passed ? 'PASS' : 'FAIL'}</div>
          <div className="text-text-secondary mt-2 text-sm">
            {attempt.rawCorrect} / {attempt.total} correct · time used {fmtClock(attempt.timeUsedSec)}
          </div>
          <div className="flex justify-center gap-2 mt-4">
            <button className="btn-primary" onClick={() => { setFinalAttempt(null); setPhase('intro'); }}>Done</button>
          </div>
        </div>

        {radarData.length >= 3 && (
          <div className="card">
            <h3 className="font-bold mb-2">Domain breakdown</h3>
            <Suspense fallback={<div className="text-text-secondary text-sm">Loading…</div>}>
              <RadarReview data={radarData} />
            </Suspense>
            <ul className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-3 text-xs">
              {(Object.keys(attempt.perDomain) as DomainId[]).map((d) => {
                const v = attempt.perDomain[d];
                if (v.total === 0) return null;
                const pct = Math.round((v.right / v.total) * 100);
                const color = pct >= 80 ? 'text-success' : pct >= 60 ? 'text-warning' : 'text-danger';
                return (
                  <li key={d} className="bg-bg/60 rounded p-2 text-center">
                    <div className="text-text-secondary">{d}</div>
                    <div className={'font-mono ' + color}>{pct}%</div>
                    <div className="text-text-secondary">{v.right}/{v.total}</div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div className="card">
          <h3 className="font-bold mb-2">Review every question</h3>
          <ul className="space-y-4">
            {qs.map((q, i) => {
              const a = answers[i];
              const ok = isCorrectIndex(q, a);
              const cIdx = correctIndexOf(q);
              const wIdx = a !== null && a >= 0 && !ok ? wrongIndexFor(q, a) : -1;
              return (
                <li key={q.id} className="border-b border-border/40 pb-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Q{i + 1} · {q.domain} · {q.subObjective}</span>
                    <span className={ok ? 'text-success' : 'text-danger'}>{ok ? '✓' : '✗'}</span>
                  </div>
                  <div className="font-semibold mt-1">{q.question}</div>
                  <div className="text-sm text-text-secondary mt-1">
                    Correct: <span className="text-success">{q.options[cIdx]}</span>
                    {a !== null && a >= 0 && !ok && <> · You picked: <span className="text-danger">{q.options[a]}</span></>}
                    {a === null && <> · Unanswered</>}
                  </div>
                  <p className="text-sm mt-2"><span className="text-success font-semibold">✅</span> <span className="text-text-secondary">{q.explanation.why_correct}</span></p>
                  {wIdx >= 0 && q.explanation.why_wrong[wIdx] && (
                    <p className="text-sm mt-1"><span className="text-danger font-semibold">❌</span> <span className="text-text-secondary">{q.explanation.why_wrong[wIdx]}</span></p>
                  )}
                  {q.explanation.mnemonic && <p className="text-sm mt-1"><span className="text-warning font-semibold">🧠</span> <span className="text-text-secondary">{q.explanation.mnemonic}</span></p>}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }

  // -------------- TAKING --------------
  // If we're stuck in taking phase but the session disappeared (external clear,
  // wipe, import), bounce back to intro via an effect (not setState in render).
  useEffect(() => {
    if (phase === 'taking' && (!examSession || questions.length === 0)) {
      setPhase('intro');
    }
  }, [phase, examSession, questions.length]);

  if (!examSession || questions.length === 0) {
    return null; // will re-render as intro on next tick
  }
  const q = questions[examSession.currentIdx];
  const answered = examSession.answers.filter((a) => a !== null).length;

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <div className="card">
        <div className="flex justify-between items-center text-sm">
          <div className="font-mono text-text-secondary">Q{examSession.currentIdx + 1} / {questions.length}</div>
          <div className={'font-mono ' + (remaining < 600 ? 'text-danger' : remaining < 1800 ? 'text-warning' : 'text-text-secondary')}>
            {fmtClock(remaining)}
          </div>
        </div>
        <div className="text-xs text-text-secondary uppercase mt-2">{q.domain}</div>
        <h2 className="text-lg font-bold mt-1">{q.question}</h2>
        <div className="grid gap-2 mt-3">
          {q.options.map((opt, i) => (
            <button
              key={i}
              className={
                'text-left px-4 py-3 rounded-lg border transition-colors ' +
                (examSession.answers[examSession.currentIdx] === i
                  ? 'border-accent1 bg-accent1/10'
                  : 'border-border hover:border-accent1')
              }
              onClick={() => pick(i)}
            >
              <span className="font-mono text-xs text-text-secondary mr-2">{i + 1}.</span>
              {opt}
            </button>
          ))}
        </div>
        <div className="flex justify-between mt-4 gap-2 flex-wrap items-center">
          <button className="btn-secondary" onClick={() => go(-1)} disabled={examSession.currentIdx === 0}>← Prev</button>
          <button
            className={'btn-ghost ' + (examSession.flagged[examSession.currentIdx] ? 'text-warning' : '')}
            onClick={toggleFlag}
          >
            {examSession.flagged[examSession.currentIdx] ? '🚩 Unflag (F)' : 'Flag for review (F)'}
          </button>
          <button className="btn-secondary" onClick={() => go(1)} disabled={examSession.currentIdx === questions.length - 1}>Next →</button>
          <button className="btn-primary ml-auto" onClick={() => submit('manual')}>Submit exam</button>
          <button className="btn-ghost text-danger" onClick={abandon}>Abandon</button>
        </div>
        <p className="text-xs text-text-secondary mt-3">
          Keyboard: <kbd className="kbd">1</kbd>–<kbd className="kbd">4</kbd> answer · <kbd className="kbd">F</kbd> flag · <kbd className="kbd">←</kbd> <kbd className="kbd">→</kbd> nav · <kbd className="kbd">Enter</kbd> next
        </p>
      </div>

      <aside className="card !p-3 lg:sticky lg:top-[80px] self-start max-h-[calc(100vh-100px)] overflow-y-auto">
        <div className="text-xs text-text-secondary uppercase">Progress</div>
        <div className="text-sm font-mono mb-2">{answered} / {questions.length} answered</div>
        <div className="flex gap-2 text-[10px] text-text-secondary mb-2">
          <span className="inline-flex items-center gap-1"><span className="inline-block w-2 h-2 rounded bg-success/30 border border-success/50" /> answered</span>
          <span className="inline-flex items-center gap-1"><span className="inline-block w-2 h-2 rounded border border-border" /> blank</span>
          <span className="inline-flex items-center gap-1"><span className="inline-block w-2 h-2 rounded border border-warning ring-1 ring-warning" /> flagged</span>
        </div>
        <div className="grid grid-cols-6 sm:grid-cols-10 gap-1">
          {questions.map((_, i) => {
            const ans = examSession.answers[i] !== null;
            const fl = examSession.flagged[i];
            const cur = examSession.currentIdx === i;
            return (
              <button
                key={i}
                onClick={() => jumpTo(i)}
                className={
                  'h-7 rounded text-[10px] font-mono border transition-all ' +
                  (cur
                    ? 'border-accent1 bg-accent1 text-bg'
                    : ans
                    ? 'border-success bg-success/20 text-text-primary'
                    : 'border-border text-text-secondary hover:border-accent1') +
                  (fl ? ' ring-2 ring-warning' : '')
                }
                aria-label={`Question ${i + 1}${ans ? ' answered' : ''}${fl ? ' flagged' : ''}`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </aside>
    </div>
  );
}

type ExamFinalView = {
  attempt: import('../lib/storage').ExamAttempt;
  questions: Question[];
  answers: (number | null)[];
  reason: 'manual' | 'expired';
};
