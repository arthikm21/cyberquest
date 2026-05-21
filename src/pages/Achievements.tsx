import { BADGES } from '../lib/badges';
import { useStore } from '../store';
import { levelFor, levelProgress } from '../lib/levels';

export default function Achievements() {
  const xp = useStore((s) => s.xp);
  const badges = useStore((s) => s.badges);
  const lvl = levelFor(xp);
  const lp = levelProgress(xp);

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-3xl font-extrabold gradient-text">Achievements</h1>
        <p className="text-text-secondary">Your XP, level, and badge collection.</p>
      </header>

      <div className="card">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-xs text-text-secondary">Level</div>
            <div className="text-2xl font-bold">{lvl.name}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-text-secondary">XP</div>
            <div className="text-2xl font-mono">{xp}</div>
          </div>
        </div>
        <div className="mt-3 h-2 bg-surface rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-accent1 to-accent2" style={{ width: `${Math.round(lp.pct * 100)}%` }} />
        </div>
        <div className="text-xs text-text-secondary mt-1">{lp.toXp ? `${lp.toXp - xp} XP to next level` : 'Max level reached'}</div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {BADGES.map((b) => {
          const got = badges.includes(b.id);
          return (
            <div key={b.id} className={'card text-center ' + (got ? 'shadow-neon border-accent1/50' : 'opacity-60')}>
              <div className="text-5xl">{got ? b.emoji : '🔒'}</div>
              <h3 className="font-bold mt-2">{b.name}</h3>
              <p className="text-xs text-text-secondary mt-1">{b.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
