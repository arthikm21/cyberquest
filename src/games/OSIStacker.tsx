import { useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from '../store';

const LAYERS = [
  { n: 1, name: 'Physical' },
  { n: 2, name: 'Data Link' },
  { n: 3, name: 'Network' },
  { n: 4, name: 'Transport' },
  { n: 5, name: 'Session' },
  { n: 6, name: 'Presentation' },
  { n: 7, name: 'Application' },
];

function shuffle<T>(a: T[]) {
  const b = a.slice();
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

export default function OSIStacker() {
  const [pool, setPool] = useState(() => shuffle(LAYERS));
  const [stack, setStack] = useState<typeof LAYERS>([]);
  const [time, setTime] = useState(60);
  const [done, setDone] = useState<null | 'win' | 'lose'>(null);
  const tickRef = useRef<number | undefined>();
  const addXP = useStore((s) => s.addXP);

  useEffect(() => {
    if (done) return;
    tickRef.current = window.setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          setDone('lose');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, [done]);

  function place(layer: typeof LAYERS[number]) {
    if (done) return;
    const expected = stack.length + 1;
    if (layer.n === expected) {
      setStack((s) => [...s, layer]);
      setPool((p) => p.filter((x) => x.n !== layer.n));
      if (stack.length + 1 === 7) {
        setDone('win');
        const bonus = Math.max(0, Math.floor(time * 1.5));
        addXP(75 + bonus);
      }
    } else {
      // bounce — penalize 3s
      setTime((t) => Math.max(0, t - 3));
      const el = document.getElementById('layer-' + layer.n);
      if (el) {
        el.animate(
          [{ transform: 'translateX(0)' }, { transform: 'translateX(-8px)' }, { transform: 'translateX(8px)' }, { transform: 'translateX(0)' }],
          { duration: 250 },
        );
      }
    }
  }

  function reset() {
    setPool(shuffle(LAYERS));
    setStack([]);
    setTime(60);
    setDone(null);
  }

  const mnemonic = useMemo(() => '"Please Do Not Throw Sausage Pizza Away" — Physical → Application', []);

  if (done) {
    return (
      <div className="card max-w-md mx-auto text-center">
        <h2 className="text-2xl font-bold">{done === 'win' ? '🏆 Stack Built!' : '⏰ Out of time'}</h2>
        <p className="text-text-secondary mt-1">{done === 'win' ? 'OSI memorized. +75 XP plus time bonus.' : 'The OSI runs Physical → Application. Try again.'}</p>
        <p className="text-xs text-text-secondary mt-2">{mnemonic}</p>
        <button className="btn-primary mt-4" onClick={reset}>Replay</button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold gradient-text">OSI Stack Stacker</h1>
        <div className={'font-mono ' + (time <= 10 ? 'text-danger' : 'text-warning')}>{time}s</div>
      </header>
      <p className="text-xs text-text-secondary">Place from Layer 1 (Physical, bottom) up to Layer 7 (Application, top). Wrong tile = −3s.</p>

      <div className="flex flex-col-reverse gap-1 min-h-[280px] p-2 rounded-2xl border border-dashed border-border bg-bg/40">
        {stack.map((l) => (
          <div key={l.n} className="rounded-lg py-2 text-center border border-accent1/40 bg-accent1/10 shadow-neon">
            <span className="font-mono text-xs text-text-secondary mr-2">L{l.n}</span>{l.name}
          </div>
        ))}
        {stack.length === 0 && <div className="text-text-secondary text-center text-sm">Build up from L1 →</div>}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {pool.map((l) => (
          <button
            key={l.n}
            id={'layer-' + l.n}
            className="card !p-3 text-left hover:border-accent1"
            onClick={() => place(l)}
          >
            <span className="font-mono text-xs text-text-secondary mr-2">L{l.n}</span>{l.name}
          </button>
        ))}
      </div>
    </div>
  );
}
