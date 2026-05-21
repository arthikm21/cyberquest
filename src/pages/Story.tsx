import { Link } from 'react-router-dom';
import { CHAPTERS } from '../content/story';
import { useStore } from '../store';

export default function Story() {
  const storyProgress = useStore((s) => s.storyProgress);
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-3xl font-extrabold gradient-text">Story Mode — The Heist</h1>
        <p className="text-text-secondary">Five chapters. Each ends with a real incident — and what you should have done.</p>
      </header>
      <div className="grid sm:grid-cols-2 gap-4">
        {CHAPTERS.map((c, i) => {
          const sceneIdx = storyProgress[c.id] ?? 0;
          const total = c.scenes.length || 1;
          const pct = Math.round((sceneIdx / total) * 100);
          return (
            <Link key={c.id} to={`/story/${c.id}`} className={'card hover:shadow-neon hover:scale-[1.01] transition-all'}>
              <div className="text-xs text-text-secondary">{c.domain} · Chapter {i + 1}</div>
              <h2 className="text-xl font-bold mt-1">{c.title}</h2>
              <p className="text-text-secondary text-sm mt-1">{c.subtitle}</p>
              <div className="mt-3 h-1.5 bg-surface rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-accent1 to-accent2" style={{ width: `${pct}%` }} />
              </div>
              <div className="flex justify-between text-xs text-text-secondary mt-1">
                <span>{c.stub ? 'Preview' : `${pct}%`}</span>
                <span>{c.stub ? 'Coming soon' : 'Play'}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
