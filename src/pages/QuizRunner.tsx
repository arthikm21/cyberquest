import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { QUESTIONS, QUESTIONS_BY_DOMAIN, pickRandom } from '../content/questions';
import { Question } from '../content/types';
import { useStore } from '../store';
import { DomainId } from '../lib/storage';

const RadarReview = lazy(() => import('../components/RadarReview'));

type Mode = 'practice' | 'timed';

const TIMED_PER_Q = 30;

function isCorrectIndex(q: Question, i: number): boolean {
  if (Array.isArray(q.correct)) return q.correct.includes(i);
  return q.correct === i;
}

function wrongIndexFor(q: Question, picked: number): number {
  // why_wrong is indexed by option position, skipping the correct option.
  if (Array.isArray(q.correct)) return -1;
  return picked < q.correct ? picked : picked - 1;
}

export default function QuizRunner() {
  const { mode } = useParams<{ mode: string }>();
  const m: Mode = (mode === 'timed' ? 'timed' : 'practice');
  const [sp] = useSearchParams();
  const dFilter = sp.get('d') as DomainId | null;

  // Multi-correct items deferred to Task 5 (exam upgrade); exclude here.
  const pool = (dFilter ? QUESTIONS_BY_DOMAIN[dFilter] ?? [] : QUESTIONS).filter((q) => q.type !== 'multi');
  const questions = useMemo(() => pickRandom(pool, Math.min(10, pool.length)), [pool]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ q: Question; pickedIdx: number; correct: boolean; tookMs: number }[]>([]);
  const [tStart, setTStart] = useState(() => Date.now());
  const [tLeft, setTLeft] = useState(TIMED_PER_Q);

  const recordQuiz = useStore((s) => s.recordQuizAnswer);
  const addXP = useStore((s) => s.addXP);
  const unlockBadge = useStore((s) => s.unlockBadge);
  const bumpModule = useStore((s) => s.bumpModule);

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

  if (!q) return <p>No questions in this filter.</p>;

  if (idx >= questions.length) {
    const total = answers.length;
    const correctCount = answers.filter((a) => a.correct).length;
    const pct = Math.round((correctCount / total) * 100);
    const totalSec = answers.reduce((s, a) => s + a.tookMs / 1000, 0);
    if (m === 'timed' && totalSec < TIMED_PER_Q * total / 2 && pct >= 60) unlockBadge('speed_demon');
    if (pct === 100) addXP(50); // perfect bonus
    // bump domain module slightly based on results
    if (dFilter) {
      const dProg = pct / 100;
      bumpModule(dFilter, `quiz-${Date.now()}`, dProg);
    }
    return (
      <ScoreScreen answers={answers} mode={m} retry={() => location.reload()} />
    );
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
          <div className="mt-4 p-3 rounded-lg bg-bg/60 border border-border space-y-2">
            <div className={picked >= 0 && isCorrectIndex(q, picked) ? 'text-success font-semibold' : 'text-danger font-semibold'}>
              {picked >= 0 && isCorrectIndex(q, picked) ? '✓ Correct' : picked === -1 ? '⏱ Time out' : '✗ Incorrect'}
            </div>
            <p className="text-sm"><span className="text-success font-semibold">✅ Why correct:</span> <span className="text-text-secondary">{q.explanation.why_correct}</span></p>
            {picked >= 0 && !isCorrectIndex(q, picked) && q.explanation.why_wrong[wrongIndexFor(q, picked)] && (
              <p className="text-sm"><span className="text-danger font-semibold">❌ Why your pick is wrong:</span> <span className="text-text-secondary">{q.explanation.why_wrong[wrongIndexFor(q, picked)]}</span></p>
            )}
            {q.explanation.mnemonic && (
              <p className="text-sm"><span className="text-warning font-semibold">🧠 Mnemonic:</span> <span className="text-text-secondary">{q.explanation.mnemonic}</span></p>
            )}
            {q.explanation.refModuleId && (
              <Link to={`/learn/${q.domain}`} className="text-sm text-accent1 inline-block">🔗 Review {q.domain} · {q.explanation.refModuleId} →</Link>
            )}
            <button className="btn-primary mt-2" onClick={next}>{idx + 1 < questions.length ? 'Next' : 'See results'}</button>
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
        <ul className="space-y-4">
          {answers.map((a, i) => {
            const correctIdx = Array.isArray(a.q.correct) ? a.q.correct[0] : a.q.correct;
            const wrongIdx = a.pickedIdx >= 0 && !a.correct ? (a.pickedIdx < correctIdx ? a.pickedIdx : a.pickedIdx - 1) : -1;
            return (
              <li key={i} className="border-b border-border/40 pb-3">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Q{i + 1} · {a.q.domain} · {a.q.subObjective}</span>
                  <span className={a.correct ? 'text-success' : 'text-danger'}>{a.correct ? '✓' : '✗'}</span>
                </div>
                <div className="font-semibold mt-1">{a.q.question}</div>
                <div className="text-sm text-text-secondary mt-1">
                  Correct: <span className="text-success">{a.q.options[correctIdx]}</span>
                  {!a.correct && a.pickedIdx >= 0 && <> · Your pick: <span className="text-danger">{a.q.options[a.pickedIdx]}</span></>}
                  {a.pickedIdx === -1 && <> · You ran out of time</>}
                </div>
                <p className="text-sm mt-2"><span className="text-success font-semibold">✅</span> <span className="text-text-secondary">{a.q.explanation.why_correct}</span></p>
                {wrongIdx >= 0 && a.q.explanation.why_wrong[wrongIdx] && (
                  <p className="text-sm mt-1"><span className="text-danger font-semibold">❌</span> <span className="text-text-secondary">{a.q.explanation.why_wrong[wrongIdx]}</span></p>
                )}
                {a.q.explanation.mnemonic && <p className="text-sm mt-1"><span className="text-warning font-semibold">🧠</span> <span className="text-text-secondary">{a.q.explanation.mnemonic}</span></p>}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
