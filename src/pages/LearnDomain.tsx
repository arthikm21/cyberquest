import { Link, useParams } from 'react-router-dom';
import { DOMAIN_BY_ID } from '../content/domains';
import { useStore } from '../store';
import { DomainId } from '../lib/storage';
import { ChevronLeft, Check } from 'lucide-react';

export default function LearnDomain() {
  const { id } = useParams<{ id: string }>();
  const did = (id as DomainId) ?? 'D1';
  const dom = DOMAIN_BY_ID[did];
  const done = useStore((s) => s.domainModulesDone[did] || []);
  const bumpModule = useStore((s) => s.bumpModule);
  const addXP = useStore((s) => s.addXP);

  if (!dom) return <p>Unknown domain.</p>;

  function markDone(mid: string) {
    if (done.includes(mid)) return;
    const total = dom.modules.length;
    const progress = Math.min(1, (done.length + 1) / total);
    bumpModule(did, mid, progress);
    addXP(50);
  }

  const pct = Math.round((done.length / dom.modules.length) * 100);

  return (
    <div className="space-y-6">
      <Link to="/learn" className="inline-flex items-center text-sm text-text-secondary hover:text-accent1"><ChevronLeft size={16} /> Back to Learn</Link>
      <header className="card">
        <div className="flex items-start gap-4">
          <div className="text-5xl">{dom.emoji}</div>
          <div className="flex-1">
            <div className="text-xs text-text-secondary">{dom.id}</div>
            <h1 className="text-3xl font-extrabold gradient-text">{dom.title}</h1>
            <p className="text-text-secondary mt-1">{dom.short}</p>
            <div className="mt-3 h-2 bg-surface rounded-full overflow-hidden">
              <div className="h-full" style={{ width: `${pct}%`, background: dom.color }} />
            </div>
            <div className="text-xs text-text-secondary mt-1">{pct}% complete</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Link to={`/quiz/practice?d=${dom.id}`} className="btn-primary">Quick practice quiz</Link>
          <Link to={`/flashcards?d=${dom.id}`} className="btn-secondary">Flashcards</Link>
        </div>
      </header>

      <div className="grid md:grid-cols-2 gap-4">
        {dom.modules.map((m) => {
          const isDone = done.includes(m.id);
          return (
            <div key={m.id} className="card">
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-bold">{m.title}</h2>
                {isDone && <span className="text-success text-sm inline-flex items-center"><Check size={16} /> Done</span>}
              </div>
              <ul className="mt-2 space-y-1.5 text-sm text-text-secondary">
                {m.bullets.map((b, i) => (
                  <li key={i} className="flex gap-2"><span className="text-accent1">▸</span><span>{b}</span></li>
                ))}
              </ul>
              <button
                className={isDone ? 'btn-ghost mt-4' : 'btn-primary mt-4'}
                onClick={() => markDone(m.id)}
                disabled={isDone}
              >
                {isDone ? 'Reviewed' : 'Mark module complete +50 XP'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
