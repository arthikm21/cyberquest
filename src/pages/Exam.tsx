import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { QUESTIONS, pickRandom } from '../content/questions';
import { useStore } from '../store';
import { Question } from '../content/types';

const RadarReview = lazy(() => import('../components/RadarReview'));

const EXAM_QS = Math.min(30, QUESTIONS.length); // available pool
const EXAM_SECONDS = 3 * 60 * 60;
const PASS = 70;

export default function Exam() {
  const [phase, setPhase] = useState<'intro' | 'taking' | 'done'>('intro');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [flagged, setFlagged] = useState<boolean[]>([]);
  const [idx, setIdx] = useState(0);
  const [startedAt, setStartedAt] = useState<number>(0);
  const [now, setNow] = useState(Date.now());
  const recordExam = useStore((s) => s.recordExam);
  const addXP = useStore((s) => s.addXP);

  useEffect(() => {
    if (phase !== 'taking') return;
    const iv = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(iv);
  }, [phase]);

  const elapsed = Math.floor((now - startedAt) / 1000);
  const remaining = Math.max(0, EXAM_SECONDS - elapsed);

  useEffect(() => {
    if (phase === 'taking' && remaining <= 0) {
      finish();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining, phase]);

  function start() {
    const qs = pickRandom(QUESTIONS, EXAM_QS);
    setQuestions(qs);
    setAnswers(Array(qs.length).fill(null));
    setFlagged(Array(qs.length).fill(false));
    setIdx(0);
    setStartedAt(Date.now());
    setNow(Date.now());
    setPhase('taking');
  }

  function pick(i: number) {
    setAnswers((a) => a.map((v, k) => (k === idx ? i : v)));
  }

  function toggleFlag() {
    setFlagged((f) => f.map((v, k) => (k === idx ? !v : v)));
  }

  function finish() {
    const correct = questions.reduce((s, q, i) => s + (answers[i] === q.correct ? 1 : 0), 0);
    recordExam(correct, questions.length);
    const pct = (correct / questions.length) * 100;
    addXP(50 + Math.floor(pct * 2));
    setPhase('done');
  }

  const perDomain = useMemo(() => {
    if (phase !== 'done') return [] as { domain: string; score: number }[];
    const tally: Record<string, { right: number; total: number }> = {};
    questions.forEach((q, i) => {
      tally[q.domain] ||= { right: 0, total: 0 };
      tally[q.domain].total++;
      if (answers[i] === q.correct) tally[q.domain].right++;
    });
    return Object.entries(tally).map(([k, v]) => ({ domain: k, score: Math.round((v.right / v.total) * 100) }));
  }, [phase, questions, answers]);

  if (phase === 'intro') {
    return (
      <div className="max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl font-extrabold gradient-text">Exam Simulator</h1>
        <div className="card">
          <p className="text-text-secondary">{EXAM_QS} questions randomized from the pool. 3-hour timer. No feedback until the end. Pass at 70%.</p>
          <ul className="text-sm text-text-secondary mt-3 list-disc list-inside space-y-1">
            <li>Flag questions for review, jump to any number from the panel.</li>
            <li>Closing the page does not pause the clock — finish in one sitting.</li>
            <li>Your best score is saved on this browser.</li>
          </ul>
          <button className="btn-primary mt-4" onClick={start}>Start exam</button>
          <Link to="/quiz/practice" className="btn-ghost ml-2">Practice instead</Link>
        </div>
      </div>
    );
  }

  if (phase === 'done') {
    const correct = questions.reduce((s, q, i) => s + (answers[i] === q.correct ? 1 : 0), 0);
    const pct = Math.round((correct / questions.length) * 100);
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="card text-center">
          <div className="text-xs text-text-secondary uppercase">Exam Result</div>
          <div className="text-6xl font-extrabold mt-2" style={{ color: pct >= PASS ? '#10b981' : '#ef4444' }}>{pct}%</div>
          <div className={pct >= PASS ? 'text-success font-bold' : 'text-danger font-bold'}>{pct >= PASS ? 'PASS' : 'FAIL'}</div>
          <div className="text-text-secondary mt-1">{correct} / {questions.length} correct</div>
          <button className="btn-primary mt-4" onClick={() => setPhase('intro')}>Take again</button>
        </div>
        {perDomain.length >= 3 && (
          <div className="card">
            <h3 className="font-bold mb-2">Domain breakdown</h3>
            <Suspense fallback={<div className="text-text-secondary text-sm">Loading…</div>}>
              <RadarReview data={perDomain} />
            </Suspense>
          </div>
        )}
        <div className="card">
          <h3 className="font-bold mb-2">Review every question</h3>
          <ul className="space-y-3">
            {questions.map((q, i) => {
              const a = answers[i];
              const ok = a === q.correct;
              return (
                <li key={q.id} className="border-b border-border/40 pb-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Q{i + 1} · {q.domain}</span>
                    <span className={ok ? 'text-success' : 'text-danger'}>{ok ? '✓' : '✗'}</span>
                  </div>
                  <div className="font-semibold mt-1">{q.question}</div>
                  <div className="text-sm text-text-secondary mt-1">
                    Correct: <span className="text-success">{q.options?.[q.correct as number]}</span>
                    {a !== null && a !== q.correct && <> · You picked: <span className="text-danger">{q.options?.[a]}</span></>}
                    {a === null && <> · Unanswered</>}
                  </div>
                  <p className="text-xs text-text-secondary mt-1">{q.explanation}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }

  // taking
  const q = questions[idx];
  const hh = Math.floor(remaining / 3600);
  const mm = Math.floor((remaining % 3600) / 60);
  const ss = remaining % 60;
  const answered = answers.filter((a) => a !== null).length;

  return (
    <div className="grid lg:grid-cols-[1fr_240px] gap-4">
      <div className="card">
        <div className="flex justify-between items-center text-sm">
          <div className="font-mono text-text-secondary">Q{idx + 1} / {questions.length}</div>
          <div className={'font-mono ' + (remaining < 600 ? 'text-danger' : 'text-warning')}>{String(hh).padStart(2, '0')}:{String(mm).padStart(2, '0')}:{String(ss).padStart(2, '0')}</div>
        </div>
        <div className="text-xs text-text-secondary uppercase mt-2">{q.domain}</div>
        <h2 className="text-lg font-bold mt-1">{q.question}</h2>
        <div className="grid gap-2 mt-3">
          {q.options?.map((opt, i) => (
            <button
              key={i}
              className={'text-left px-4 py-3 rounded-lg border transition-colors ' + (answers[idx] === i ? 'border-accent1 bg-accent1/10' : 'border-border hover:border-accent1')}
              onClick={() => pick(i)}
            >
              <span className="font-mono text-xs text-text-secondary mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
            </button>
          ))}
        </div>
        <div className="flex justify-between mt-4 gap-2 flex-wrap">
          <button className="btn-secondary" onClick={() => setIdx(Math.max(0, idx - 1))} disabled={idx === 0}>← Prev</button>
          <button className={'btn-ghost ' + (flagged[idx] ? 'text-warning' : '')} onClick={toggleFlag}>{flagged[idx] ? '🚩 Unflag' : 'Flag for review'}</button>
          <button className="btn-secondary" onClick={() => setIdx(Math.min(questions.length - 1, idx + 1))} disabled={idx === questions.length - 1}>Next →</button>
          <button className="btn-primary ml-auto" onClick={finish}>Submit exam</button>
        </div>
      </div>

      <aside className="card !p-3 lg:sticky lg:top-[80px] self-start">
        <div className="text-xs text-text-secondary uppercase">Progress</div>
        <div className="text-sm font-mono mb-2">{answered} / {questions.length} answered</div>
        <div className="grid grid-cols-6 gap-1.5">
          {questions.map((_, i) => {
            const ans = answers[i] !== null;
            const fl = flagged[i];
            const cur = idx === i;
            return (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={
                  'h-8 rounded text-xs font-mono border transition-all ' +
                  (cur ? 'border-accent1 bg-accent1 text-bg' :
                    ans ? 'border-success bg-success/20 text-text-primary' :
                    'border-border text-text-secondary hover:border-accent1') + (fl ? ' ring-2 ring-warning' : '')
                }
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
