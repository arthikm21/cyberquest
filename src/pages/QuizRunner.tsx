import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { QUESTIONS, QUESTIONS_BY_DOMAIN, pickRandom } from '../content/questions';
import { Question } from '../content/types';
import { useStore } from '../store';
import { DomainId } from '../lib/storage';
import Explanation from '../components/Explanation';

const RadarReview = lazy(() => import('../components/RadarReview'));

type Mode = 'practice' | 'timed' | 'remediation';

const TIMED_PER_Q = 30;

function newSessionId(): string {
  if (globalThis.crypto && 'randomUUID' in globalThis.crypto) return globalThis.crypto.randomUUID();
  return 's_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function isCorrectIndex(q: Question, i: number): boolean {
  if (Array.isArray(q.correct)) return q.correct.includes(i);
  return q.correct === i;
}

export default function QuizRunner() {
  const { mode } = useParams<{ mode: string }>();
  const m: Mode = mode === 'timed' ? 'timed' : mode === 'remediation' ? 'remediation' : 'practice';
  const [sp] = useSearchParams();
  const dFilter = sp.get('d') as DomainId | null;

  const remediation = useStore((s) => s.remediation);
  const recordQuiz = useStore((s) => s.recordQuizAnswer);
  const addXP = useStore((s) => s.addXP);
  const unlockBadge = useStore((s) => s.unlockBadge);
  const bumpModule = useStore((s) => s.bumpModule);
  const enqueueRemediation = useStore((s) => s.enqueueRemediation);
  const recordRemediationAnswer = useStore((s) => s.recordRemediationAnswer);

  // Snapshot remediation queue at mount so the running quiz doesn't reshuffle
  // mid-session as items graduate out.
  const remediationIdsAtStart = useMemo(() => Object.keys(remediation), []); // eslint-disable-line react-hooks/exhaustive-deps

  // Pool selection.
  //   - remediation mode: items currently in queue
  //   - domain-filtered: that domain only
  //   - default: full bank
  // Multi-correct items deferred to Task 5; exclude here.
  const pool = useMemo(() => {
    const base =
      m === 'remediation'
        ? QUESTIONS.filter((q) => remediationIdsAtStart.includes(q.id))
        : dFilter
        ? QUESTIONS_BY_DOMAIN[dFilter] ?? []
        : QUESTIONS;
    return base.filter((q) => q.type !== 'multi');
  }, [m, dFilter, remediationIdsAtStart]);
  const questions = useMemo(() => pickRandom(pool, Math.min(10, pool.length)), [pool]);
  const sessionId = useMemo(newSessionId, []);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ q: Question; pickedIdx: number; correct: boolean; tookMs: number }[]>([]);
  const [tStart, setTStart] = useState(() => Date.now());
  const [tLeft, setTLeft] = useState(TIMED_PER_Q);

  const q = questions[idx];

  useEffect(() => {
    if (m !== 'timed' || picked !== null) return;
    setTLeft(TIMED_PER_Q);
    const start = Date.now();
    const iv = setInterval(() => {
      const left = TIMED_PER_Q - Math.floor((Date.now() - start) / 1000);
      setTLeft(Math.max(0, left));
      if (left <= 0) {
        clearInterval(iv);
        choose(-1);
      }
    }, 250);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, m]);

  function choose(i: number) {
    if (picked !== null) return;
    setPicked(i);
    const correct = i >= 0 && isCorrectIndex(q, i);
    const tookMs = Date.now() - tStart;
    const tookSec = tookMs / 1000;
    setAnswers((a) => [...a, { q, pickedIdx: i, correct, tookMs }]);
    recordQuiz({ id: q.id, correct, domain: q.domain });
    // Remediation: store no-ops if this q is not in the queue.
    recordRemediationAnswer(q.id, correct, sessionId);
    if (correct) {
      let xp = 10;
      if (m === 'timed') xp += Math.max(0, Math.floor((TIMED_PER_Q - tookSec) / 3));
      addXP(xp);
    }
  }

  function next() {
    setPicked(null);
    setTStart(Date.now());
    setIdx((v) => v + 1);
  }

  // Finalization side-effects run exactly once when the quiz completes.
  const [finalized, setFinalized] = useState(false);
  useEffect(() => {
    if (idx < questions.length || answers.length !== questions.length || finalized) return;
    const total = answers.length;
    const correctCount = answers.filter((a) => a.correct).length;
    const pct = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const totalSec = answers.reduce((s, a) => s + a.tookMs / 1000, 0);
    if (m === 'timed' && totalSec < (TIMED_PER_Q * total) / 2 && pct >= 60) unlockBadge('speed_demon');
    if (pct === 100 && total > 0) addXP(50);
    if (dFilter) bumpModule(dFilter, `quiz-${Date.now()}`, pct / 100);

    // Remediation: enqueue 3 siblings per missed question.
    const siblingIds: string[] = [];
    for (const a of answers) {
      if (a.correct) continue;
      const subPool = QUESTIONS.filter((qq) => qq.subObjective === a.q.subObjective && qq.id !== a.q.id && qq.type !== 'multi');
      const picks = pickRandom(subPool, Math.min(3, subPool.length)).map((qq) => qq.id);
      siblingIds.push(...picks);
    }
    if (siblingIds.length > 0) enqueueRemediation(siblingIds);

    setFinalized(true);
  }, [idx, questions.length, answers, finalized, m, dFilter, addXP, unlockBadge, bumpModule, enqueueRemediation]);

  if (!q) return <p className="card">No questions in this filter.{m === 'remediation' && <> <Link to="/quiz" className="text-accent1">← Back to quizzes</Link></>}</p>;

  if (idx >= questions.length) {
    return <ScoreScreen answers={answers} mode={m} retry={() => location.reload()} />;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between text-sm">
        <Link to="/quiz" className="text-text-secondary hover:text-accent1">← Quizzes</Link>
        <div className="font-mono text-text-secondary">{idx + 1} / {questions.length}</div>
        {m === 'timed' && picked === null && (
          <div className={'font-mono ' + (tLeft <= 5 ? 'text-danger' : 'text-warning')}>{tLeft}s</div>
        )}
      </div>
      <div className="h-1.5 bg-surface rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-accent1 to-accent2" style={{ width: `${((idx) / questions.length) * 100}%` }} />
      </div>

      <div className="card">
        <div className="text-xs text-text-secondary uppercase">{q.domain} · {q.subObjective} · {q.type === 'tf' ? 'True / False' : 'Multiple Choice'}</div>
        <h2 className="text-lg font-bold mt-1">{q.question}</h2>
        <div className="grid gap-2 mt-4">
          {q.options.map((opt, i) => {
            const isCorrect = isCorrectIndex(q, i);
            const isPicked = picked === i;
            let cls = 'text-left px-4 py-3 rounded-lg border transition-colors ';
            if (picked === null) cls += 'border-border hover:border-accent1';
            else if (isCorrect) cls += 'border-success bg-success/10';
            else if (isPicked) cls += 'border-danger bg-danger/10';
            else cls += 'border-border opacity-50';
            return (
              <button key={i} className={cls} onClick={() => choose(i)} disabled={picked !== null}>
                <span className="font-mono text-xs text-text-secondary mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
              </button>
            );
          })}
        </div>
        {picked !== null && (
          <div className="mt-4 p-3 rounded-lg bg-bg/60 border border-border space-y-3">
            <div className={picked >= 0 && isCorrectIndex(q, picked) ? 'text-success font-semibold' : 'text-danger font-semibold'}>
              {picked >= 0 && isCorrectIndex(q, picked) ? '✓ Correct' : picked === -1 ? '⏱ Time out' : '✗ Incorrect'}
            </div>
            <Explanation q={q} pickedIdx={picked} />
            <button className="btn-primary mt-1" onClick={next}>{idx + 1 < questions.length ? 'Next' : 'See results'}</button>
          </div>
        )}
      </div>
    </div>
  );
}

function ScoreScreen({ answers, mode, retry }: { answers: { q: Question; pickedIdx: number; correct: boolean; tookMs: number }[]; mode: Mode; retry: () => void }) {
  const total = answers.length;
  const correctCount = answers.filter((a) => a.correct).length;
  const pct = Math.round((correctCount / total) * 100);

  const perDomain: Record<string, { right: number; total: number }> = {};
  for (const a of answers) {
    const d = a.q.domain;
    perDomain[d] ||= { right: 0, total: 0 };
    perDomain[d].total++;
    if (a.correct) perDomain[d].right++;
  }
  const radarData = Object.entries(perDomain).map(([k, v]) => ({ domain: k, score: Math.round((v.right / v.total) * 100) }));

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="card text-center">
        <div className="text-sm text-text-secondary uppercase tracking-wide">{mode === 'timed' ? 'Timed Sprint' : 'Practice'} — Results</div>
        <div className="text-6xl font-extrabold gradient-text mt-2">{pct}%</div>
        <div className="text-text-secondary mt-1">{correctCount} of {total} correct</div>
        <div className="flex justify-center gap-3 mt-4">
          <button className="btn-primary" onClick={retry}>Retry</button>
          <Link to="/quiz" className="btn-secondary">More quizzes</Link>
        </div>
      </div>

      {radarData.length >= 3 && (
        <div className="card">
          <h3 className="font-bold mb-2">Strengths by domain</h3>
          <Suspense fallback={<div className="text-text-secondary text-sm">Loading chart…</div>}>
            <RadarReview data={radarData} />
          </Suspense>
        </div>
      )}

      <div className="card">
        <h3 className="font-bold mb-2">Review</h3>
        <ul className="space-y-5">
          {answers.map((a, i) => (
            <li key={i} className="border-b border-border/40 pb-3">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Q{i + 1} · {a.q.domain} · {a.q.subObjective}</span>
                <span className={a.correct ? 'text-success' : 'text-danger'}>
                  {a.correct ? '✓' : a.pickedIdx === -1 ? '⏱ time-out' : '✗'}
                </span>
              </div>
              <div className="font-semibold mt-1">{a.q.question}</div>
              <div className="mt-2">
                <Explanation q={a.q} pickedIdx={a.pickedIdx >= 0 ? a.pickedIdx : null} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
