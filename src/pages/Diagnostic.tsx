import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sampleDiagnostic } from '../content/questions';
import { Question } from '../content/types';
import { DomainId } from '../lib/storage';
import { useStore } from '../store';
import { generateStudyPlan } from '../lib/studyplan';

function isCorrectIndex(q: Question, i: number | null): boolean {
  if (i === null || i < 0) return false;
  if (Array.isArray(q.correct)) return q.correct.includes(i);
  return q.correct === i;
}

export default function Diagnostic() {
  const questions = useMemo(() => sampleDiagnostic(), []);
  const [answers, setAnswers] = useState<(number | null)[]>(() => Array(questions.length).fill(null));
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<'taking' | 'done'>('taking');
  const setDiagnostic = useStore((s) => s.setDiagnostic);
  const setStudyPlan = useStore((s) => s.setStudyPlan);
  const nav = useNavigate();
  const [hoursPerWeek, setHoursPerWeek] = useState(7);

  function pick(i: number) {
    setAnswers((a) => a.map((v, k) => (k === idx ? i : v)));
  }
  function go(delta: number) {
    setIdx((v) => Math.max(0, Math.min(questions.length - 1, v + delta)));
  }

  function submit() {
    const perDomain: Record<DomainId, { right: number; total: number; pct: number }> = {
      D1: { right: 0, total: 0, pct: 0 },
      D2: { right: 0, total: 0, pct: 0 },
      D3: { right: 0, total: 0, pct: 0 },
      D4: { right: 0, total: 0, pct: 0 },
      D5: { right: 0, total: 0, pct: 0 },
    };
    questions.forEach((q, i) => {
      perDomain[q.domain].total++;
      if (isCorrectIndex(q, answers[i])) perDomain[q.domain].right++;
    });
    for (const d of Object.keys(perDomain) as DomainId[]) {
      const v = perDomain[d];
      v.pct = v.total > 0 ? v.right / v.total : 0;
    }
    setDiagnostic({ takenAt: Date.now(), total: questions.length, perDomain });
    setPhase('done');
  }

  function buildPlan() {
    const result = useStore.getState().diagnosticResult;
    if (!result) return;
    const accByDomain: Record<DomainId, number> = {
      D1: result.perDomain.D1.pct,
      D2: result.perDomain.D2.pct,
      D3: result.perDomain.D3.pct,
      D4: result.perDomain.D4.pct,
      D5: result.perDomain.D5.pct,
    };
    const plan = generateStudyPlan({ perDomain: accByDomain, hoursPerWeek });
    setStudyPlan(plan);
    nav('/study-plan');
  }

  if (phase === 'done') {
    const result = useStore.getState().diagnosticResult;
    if (!result) return null;
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="card">
          <h1 className="text-2xl font-extrabold gradient-text">Diagnostic complete</h1>
          <p className="text-text-secondary mt-1">Per-domain baseline. We'll build a plan that focuses your weakest domains first.</p>
          <ul className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-4 text-sm">
            {(Object.keys(result.perDomain) as DomainId[]).map((d) => {
              const v = result.perDomain[d];
              const pct = Math.round(v.pct * 100);
              const color = pct >= 80 ? 'text-success' : pct >= 70 ? 'text-warning' : 'text-danger';
              return (
                <li key={d} className="bg-bg/60 rounded p-2 text-center">
                  <div className="text-text-secondary text-xs">{d}</div>
                  <div className={'font-mono text-lg ' + color}>{pct}%</div>
                  <div className="text-xs text-text-secondary">{v.right}/{v.total}</div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="card">
          <h2 className="text-lg font-bold">How much time per week?</h2>
          <p className="text-sm text-text-secondary">We'll fit your 4-week plan to your schedule.</p>
          <input
            type="number"
            min={2}
            max={30}
            value={hoursPerWeek}
            onChange={(e) => setHoursPerWeek(Math.max(2, Math.min(30, Number(e.target.value) || 7)))}
            className="input mt-3 w-32"
          />
          <span className="text-sm text-text-secondary ml-2">hours / week</span>
          <div className="flex gap-2 mt-4">
            <button className="btn-primary" onClick={buildPlan}>Generate 4-week plan →</button>
            <Link to="/" className="btn-ghost">Skip for now</Link>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[idx];
  if (!q) return <p className="card">No diagnostic questions available — bank is too small.</p>;
  const answered = answers.filter((a) => a !== null).length;

  return (
    <div className="max-w-2xl mx-auto space-y-3">
      <div className="flex justify-between items-center text-sm">
        <h1 className="text-xl font-bold gradient-text">Diagnostic · {answered} / {questions.length}</h1>
        <div className="text-text-secondary font-mono">Q{idx + 1}</div>
      </div>
      <p className="text-xs text-text-secondary">Answer honestly. No XP, no penalties. This sets your study plan baseline.</p>

      <div className="card">
        <div className="text-xs text-text-secondary uppercase">{q.domain} · {q.subObjective}</div>
        <h2 className="text-lg font-bold mt-1">{q.question}</h2>
        <div className="grid gap-2 mt-3">
          {q.options.map((opt, i) => (
            <button
              key={i}
              className={
                'text-left px-4 py-3 rounded-lg border transition-colors ' +
                (answers[idx] === i ? 'border-accent1 bg-accent1/10' : 'border-border hover:border-accent1')
              }
              onClick={() => pick(i)}
            >
              <span className="font-mono text-xs text-text-secondary mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
            </button>
          ))}
        </div>
        <div className="flex justify-between mt-4 flex-wrap gap-2">
          <button className="btn-secondary" onClick={() => go(-1)} disabled={idx === 0}>← Prev</button>
          <button className="btn-secondary" onClick={() => go(1)} disabled={idx === questions.length - 1}>Next →</button>
          <button
            className="btn-primary ml-auto"
            onClick={submit}
            disabled={answered < questions.length}
            title={answered < questions.length ? `Answer all ${questions.length} first` : ''}
          >
            Submit diagnostic
          </button>
        </div>
      </div>
    </div>
  );
}
