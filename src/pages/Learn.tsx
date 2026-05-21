import { Link } from 'react-router-dom';
import { DOMAINS } from '../content/domains';
import { useStore } from '../store';

export default function Learn() {
  const progress = useStore((s) => s.domainProgress);
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-extrabold gradient-text">Learn</h1>
      <p className="text-text-secondary">All 5 ISC2 CC domains. Read each module, then test your recall.</p>
      <div className="grid sm:grid-cols-2 gap-4">
        {DOMAINS.map((d) => (
          <Link key={d.id} to={`/learn/${d.id}`} className="card hover:shadow-neon transition-all hover:scale-[1.01]">
            <div className="flex items-start gap-3">
              <div className="text-4xl">{d.emoji}</div>
              <div className="flex-1">
                <div className="text-xs text-text-secondary">{d.id}</div>
                <h2 className="text-lg font-bold">{d.title}</h2>
                <p className="text-sm text-text-secondary mt-1">{d.short}</p>
                <div className="mt-3 h-1.5 bg-surface rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-accent1 to-accent2" style={{ width: `${Math.round(progress[d.id] * 100)}%` }} />
                </div>
                <div className="text-xs text-text-secondary mt-1">{Math.round(progress[d.id] * 100)}%</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
