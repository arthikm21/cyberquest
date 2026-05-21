import { Link, useParams } from 'react-router-dom';
import { CHAPTER_BY_ID } from '../content/story';
import { useStore } from '../store';
import { useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { SocArt, InsiderArt, RansomArt, NetworkArt, VaultArt } from '../components/StoryArt';

export default function StoryChapter() {
  const { id } = useParams<{ id: string }>();
  const ch = id ? CHAPTER_BY_ID[id] : undefined;
  const setStoryScene = useStore((s) => s.setStoryScene);
  const addXP = useStore((s) => s.addXP);
  const bumpModule = useStore((s) => s.bumpModule);
  const storyProgress = useStore((s) => s.storyProgress);
  const start = id ? (storyProgress[id] ?? 0) : 0;
  const [idx, setIdx] = useState(start);
  const [picked, setPicked] = useState<number | null>(null);

  useEffect(() => { setIdx(start); setPicked(null); }, [id, start]);

  if (!ch) return <div className="card">Unknown chapter.</div>;
  if (ch.stub || !ch.scenes.length) {
    return (
      <div className="space-y-3 max-w-2xl mx-auto">
        <Link to="/story" className="inline-flex items-center text-sm text-text-secondary hover:text-accent1"><ChevronLeft size={16} /> Back</Link>
        <div className="card text-center">
          <h1 className="text-2xl font-bold gradient-text">{ch.title}</h1>
          <p className="text-text-secondary mt-1">{ch.subtitle}</p>
          <div className="mt-4 text-5xl">🛠️</div>
          <p className="text-text-secondary mt-3">Chapter coming soon. In the meantime, study the related domain.</p>
          <Link to={`/learn/${ch.domain}`} className="btn-primary mt-4">Study {ch.domain}</Link>
        </div>
      </div>
    );
  }
  const scene = ch.scenes[idx];

  function pickChoice(i: number) {
    if (picked !== null) return;
    setPicked(i);
    const c = scene.choices![i];
    addXP(c.xp);
  }

  function advance() {
    if (!ch) return;
    const nextIdx = idx + 1;
    setIdx(nextIdx);
    setPicked(null);
    if (id) setStoryScene(id, nextIdx);
    if (nextIdx >= ch.scenes.length) {
      bumpModule(ch.domain, `story-${ch.id}`, 0.5);
    }
  }

  const Art = scene.art === 'soc' ? SocArt
    : scene.art === 'insider' ? InsiderArt
    : scene.art === 'ransom' ? RansomArt
    : scene.art === 'network' ? NetworkArt
    : VaultArt;

  return (
    <div className="space-y-3 max-w-3xl mx-auto">
      <div className="flex justify-between items-center text-sm">
        <Link to="/story" className="inline-flex items-center text-text-secondary hover:text-accent1"><ChevronLeft size={16} /> Story</Link>
        <span className="font-mono text-text-secondary">{ch.title} — {idx + 1} / {ch.scenes.length}</span>
      </div>

      {idx >= ch.scenes.length ? (
        <div className="card text-center">
          <h2 className="text-2xl font-bold gradient-text">Chapter Complete</h2>
          <p className="text-text-secondary mt-2">You closed the loop. Lessons logged. XP banked.</p>
          <div className="flex justify-center gap-2 mt-4">
            <Link to="/story" className="btn-secondary">More chapters</Link>
            <Link to={`/quiz/practice?d=${ch.domain}`} className="btn-primary">Quiz on {ch.domain}</Link>
          </div>
        </div>
      ) : (
        <div className="card space-y-3">
          <div className="rounded-xl overflow-hidden border border-border">
            <Art />
          </div>
          {scene.narrator && <p className="italic text-text-secondary">{scene.narrator}</p>}
          {scene.alex && <p><span className="text-accent1 font-semibold">ALEX</span> · {scene.alex}</p>}
          {scene.system && <pre className="text-xs font-mono bg-bg/70 border border-danger/40 rounded-lg p-2 text-danger whitespace-pre-wrap">⚠ {scene.system}</pre>}
          {scene.question && <h3 className="text-lg font-bold mt-2">{scene.question}</h3>}
          {scene.choices && (
            <div className="grid gap-2">
              {scene.choices.map((c, i) => {
                const chosen = picked === i;
                const reveal = picked !== null;
                let cls = 'text-left card !p-3 transition-all ';
                if (!reveal) cls += 'hover:border-accent1 cursor-pointer';
                else if (c.correct) cls += 'border-success !bg-success/10';
                else if (chosen) cls += 'border-danger !bg-danger/10';
                else cls += 'opacity-60';
                return (
                  <button key={i} className={cls} onClick={() => pickChoice(i)} disabled={picked !== null}>
                    <div className="font-semibold">{c.label}</div>
                    {reveal && chosen && (
                      <div className={'mt-1 text-sm ' + (c.correct ? 'text-success' : 'text-danger')}>
                        {c.correct ? '✓ +' : c.xp >= 0 ? '+' : ''}{c.xp} XP — {c.feedback}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
          {(picked !== null || !scene.choices) && (
            <button className="btn-primary w-full" onClick={advance}>{idx + 1 < ch.scenes.length ? 'Continue →' : 'Finish chapter'}</button>
          )}
        </div>
      )}
    </div>
  );
}
