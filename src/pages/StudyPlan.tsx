import { useMemo, useState } from 'react';
import { DOMAINS } from '../content/domains';

const ACTIVITIES = [
  'Read modules + bullet review',
  'Practice quiz (10 Q)',
  'Flashcards (15 cards)',
  'Mini-game related to domain',
  'Story chapter for domain',
];

export default function StudyPlan() {
  const today = new Date();
  const isoToday = today.toISOString().slice(0, 10);
  const [examDate, setExamDate] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() + 28); return d.toISOString().slice(0, 10);
  });
  const [hours, setHours] = useState(5);

  const plan = useMemo(() => {
    const ed = new Date(examDate + 'T00:00:00');
    const days = Math.max(7, Math.ceil((ed.getTime() - today.getTime()) / 86400000));
    const weeks = Math.max(1, Math.ceil(days / 7));
    const items: { week: number; domain: string; focus: string; activity: string; minutes: number }[] = [];
    for (let w = 1; w <= weeks; w++) {
      const dom = DOMAINS[(w - 1) % DOMAINS.length];
      const totalMin = hours * 60;
      const perActivity = Math.round(totalMin / ACTIVITIES.length);
      ACTIVITIES.forEach((a, ai) => {
        items.push({
          week: w,
          domain: `${dom.id} · ${dom.title}`,
          focus: dom.modules[ai % dom.modules.length].title,
          activity: a,
          minutes: perActivity,
        });
      });
    }
    return { weeks, items };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examDate, hours]);

  function print() { window.print(); }

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-3xl font-extrabold gradient-text">Study Plan</h1>
        <p className="text-text-secondary">Tell us when you’re taking the exam and how many hours you can give per week.</p>
      </header>
      <div className="card grid sm:grid-cols-3 gap-3">
        <label className="text-sm">
          <div className="text-text-secondary mb-1">Today</div>
          <input className="input w-full" value={isoToday} readOnly />
        </label>
        <label className="text-sm">
          <div className="text-text-secondary mb-1">Exam date</div>
          <input type="date" className="input w-full" value={examDate} onChange={(e) => setExamDate(e.target.value)} />
        </label>
        <label className="text-sm">
          <div className="text-text-secondary mb-1">Hours / week</div>
          <input type="number" className="input w-full" min={1} max={40} value={hours} onChange={(e) => setHours(Math.max(1, Math.min(40, Number(e.target.value) || 1)))} />
        </label>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-text-secondary text-sm">{plan.weeks} weeks · {plan.items.length} tasks · {hours} hr/week</p>
        <button className="btn-secondary" onClick={print}>Print / Save PDF</button>
      </div>
      <div className="space-y-3">
        {Array.from({ length: plan.weeks }).map((_, w) => (
          <details key={w} className="card" open={w === 0}>
            <summary className="cursor-pointer font-bold">Week {w + 1}</summary>
            <table className="w-full text-sm mt-3">
              <thead>
                <tr className="text-left text-text-secondary">
                  <th className="py-1">Domain</th><th>Focus</th><th>Activity</th><th>Mins</th>
                </tr>
              </thead>
              <tbody>
                {plan.items.filter((it) => it.week === w + 1).map((it, i) => (
                  <tr key={i} className="border-t border-border/40">
                    <td className="py-1">{it.domain}</td>
                    <td className="text-text-secondary">{it.focus}</td>
                    <td>{it.activity}</td>
                    <td className="font-mono">{it.minutes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        ))}
      </div>
    </div>
  );
}
