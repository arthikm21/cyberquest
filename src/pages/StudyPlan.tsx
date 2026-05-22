import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store';
import { DOMAIN_BY_ID } from '../content/domains';
import { DomainId } from '../lib/storage';
import { Check, Sparkles } from 'lucide-react';

function isoDay(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export default function StudyPlan() {
  const studyPlan = useStore((s) => s.studyPlan);
  const diagnostic = useStore((s) => s.diagnosticResult);
  const markDay = useStore((s) => s.markStudyDayDone);
  const recompute = useStore((s) => s.recomputeStudyPlanWeekly);
  const resetPlan = useStore((s) => s.resetStudyPlan);

  // Trigger weekly recompute on mount (cheap; guarded inside the action).
  useEffect(() => { recompute(); }, [recompute]);

  const todayISO = useMemo(() => isoDay(new Date()), []);

  if (!studyPlan) {
    return (
      <div className="space-y-4 max-w-2xl">
        <h1 className="text-3xl font-extrabold gradient-text">Study Plan</h1>
        <div className="card">
          {diagnostic ? (
            <>
              <p className="text-text-secondary">You took the diagnostic but the plan hasn't been built yet.</p>
              <Link to="/diagnostic" className="btn-primary mt-3 inline-flex"><Sparkles size={16} /> Continue plan setup</Link>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold">Step 1 — take the diagnostic</h2>
              <p className="text-text-secondary mt-1">
                30 questions, weighted by exam blueprint. We'll measure your starting accuracy per domain
                and build a 4-week plan that drills your weakest areas first.
              </p>
              <Link to="/diagnostic" className="btn-primary mt-4 inline-flex"><Sparkles size={16} /> Run 30-question diagnostic →</Link>
            </>
          )}
        </div>
      </div>
    );
  }

  // group days by week
  const weeks: typeof studyPlan.days[] = [];
  for (let w = 0; w < studyPlan.weeks; w++) {
    weeks.push(studyPlan.days.slice(w * 7, w * 7 + 7));
  }

  const baselineEntries = Object.entries(studyPlan.baselineAccuracy) as [DomainId, number][];

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold gradient-text">Study Plan</h1>
          <p className="text-text-secondary">
            {studyPlan.weeks}-week plan · {studyPlan.hoursPerWeek} hr/week · starts {studyPlan.startISO}
            {studyPlan.lastRecomputeISO && <> · recomputed {studyPlan.lastRecomputeISO}</>}
          </p>
        </div>
        <button className="btn-ghost text-danger" onClick={() => { if (confirm('Reset plan and diagnostic? You will need to retake the diagnostic.')) resetPlan(); }}>
          Reset plan
        </button>
      </header>

      <section className="card">
        <h3 className="font-bold mb-2">Baseline (from diagnostic)</h3>
        <ul className="grid grid-cols-5 gap-2 text-xs">
          {baselineEntries.map(([d, acc]) => {
            const pct = Math.round(acc * 100);
            const color = pct >= 80 ? 'text-success' : pct >= 70 ? 'text-warning' : 'text-danger';
            return (
              <li key={d} className="bg-bg/60 rounded p-2 text-center">
                <div className="text-text-secondary">{d}</div>
                <div className={'font-mono ' + color}>{pct}%</div>
              </li>
            );
          })}
        </ul>
        <p className="text-xs text-text-secondary mt-2">
          Plan recomputes weekly from your last 7 days of quiz activity — weakest domains keep getting more days.
        </p>
      </section>

      {weeks.map((wDays, wi) => {
        const allDone = wDays.every((d) => d.done);
        return (
          <details key={wi} className="card" open={!allDone}>
            <summary className="cursor-pointer font-bold">
              Week {wi + 1}
              <span className="text-text-secondary text-xs font-normal ml-2">
                {wDays.filter((d) => d.done).length} / {wDays.length} days complete
              </span>
            </summary>
            <div className="grid sm:grid-cols-2 gap-2 mt-3">
              {wDays.map((day) => {
                const dom = DOMAIN_BY_ID[day.focusDomain];
                const mod = dom.modules.find((m) => m.id === day.lessonModuleId);
                const isToday = day.isoDate === todayISO;
                const isPast = day.isoDate < todayISO;
                return (
                  <div
                    key={day.isoDate}
                    className={
                      'rounded-xl border p-3 ' +
                      (day.done
                        ? 'border-success/40 bg-success/5'
                        : isToday
                        ? 'border-accent1/60 bg-accent1/5 shadow-neon'
                        : isPast
                        ? 'border-border/40 opacity-60'
                        : 'border-border')
                    }
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <div className="text-xs text-text-secondary">{day.isoDate}{isToday && <span className="ml-2 text-accent1">· today</span>}</div>
                        <div className="font-bold mt-0.5 flex items-center gap-2">
                          <span className="text-xl">{dom.emoji}</span>
                          <span className="truncate">{dom.id} · {dom.title}</span>
                        </div>
                        {mod && <div className="text-sm text-text-secondary mt-1">Module: {mod.title}</div>}
                      </div>
                      <button
                        className={
                          'shrink-0 px-2 py-1 rounded-lg border text-xs ' +
                          (day.done
                            ? 'border-success bg-success/20 text-success'
                            : 'border-border hover:border-accent1 text-text-secondary')
                        }
                        onClick={() => markDay(day.isoDate, !day.done)}
                        aria-pressed={day.done}
                      >
                        {day.done ? (<><Check size={12} className="inline" /> done</>) : 'mark done'}
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                      <Link to={`/quiz/practice?d=${day.focusDomain}`} className="btn-secondary !min-h-0 !py-1 justify-start">
                        <span className="text-text-secondary">Quiz</span>
                        <span className="font-mono text-accent1 ml-auto">{day.quizCount}</span>
                      </Link>
                      <Link to={`/flashcards?d=${day.focusDomain}`} className="btn-secondary !min-h-0 !py-1 justify-start">
                        <span className="text-text-secondary">Cards</span>
                        <span className="font-mono text-accent1 ml-auto">{day.cardCount}</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </details>
        );
      })}
    </div>
  );
}
