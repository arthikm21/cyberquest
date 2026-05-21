import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store';

type Threat = { id: number; kind: 'Hacker' | 'Insider' | 'Ransomware' | 'Phishing'; emoji: string; x: number; counters: Defense[] };
type Defense = 'Firewall' | 'Encryption' | 'MFA' | 'Training';

const DEFENSE_INFO: { id: Defense; emoji: string; teaches: string }[] = [
  { id: 'Firewall', emoji: '🧱', teaches: 'Blocks unauthorized network access — best vs external Hackers.' },
  { id: 'Encryption', emoji: '🔐', teaches: 'Protects data confidentiality — best vs Ransomware demanding readable data.' },
  { id: 'MFA', emoji: '🔑', teaches: 'Stops credential abuse — best vs Insiders abusing accounts.' },
  { id: 'Training', emoji: '🎓', teaches: 'Reduces social engineering risk — best vs Phishing.' },
];

const KIND_COUNTERS: Record<Threat['kind'], Defense> = {
  Hacker: 'Firewall',
  Ransomware: 'Encryption',
  Insider: 'MFA',
  Phishing: 'Training',
};

const KIND_EMOJI: Record<Threat['kind'], string> = {
  Hacker: '👤', Ransomware: '💀', Insider: '🕵️', Phishing: '🎣',
};

const KINDS: Threat['kind'][] = ['Hacker', 'Ransomware', 'Insider', 'Phishing'];

export default function CIADefender() {
  const [running, setRunning] = useState(false);
  const [level, setLevel] = useState(1);
  const [health, setHealth] = useState(5);
  const [score, setScore] = useState(0);
  const [threats, setThreats] = useState<Threat[]>([]);
  const [picked, setPicked] = useState<Defense | null>(null);
  const [over, setOver] = useState<null | 'win' | 'lose'>(null);
  const tickRef = useRef<number | undefined>();
  const spawnRef = useRef<number | undefined>();
  const idRef = useRef(0);
  const addXP = useStore((s) => s.addXP);

  function start(lv: number) {
    setLevel(lv);
    setHealth(5);
    setScore(0);
    setThreats([]);
    setOver(null);
    setRunning(true);
  }

  useEffect(() => {
    if (!running) return;
    const speed = 0.4 + level * 0.25; // % of arena per second
    tickRef.current = window.setInterval(() => {
      setThreats((ts) => {
        const next = ts.map((t) => ({ ...t, x: t.x + speed }));
        const leaked = next.filter((t) => t.x >= 100);
        if (leaked.length) {
          setHealth((h) => Math.max(0, h - leaked.length));
        }
        return next.filter((t) => t.x < 100);
      });
    }, 100);
    spawnRef.current = window.setInterval(() => {
      const kind = KINDS[Math.floor(Math.random() * KINDS.length)];
      idRef.current++;
      setThreats((ts) => [...ts, { id: idRef.current, kind, emoji: KIND_EMOJI[kind], x: 0, counters: [] }]);
    }, Math.max(900, 1800 - level * 300));

    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
      if (spawnRef.current) clearInterval(spawnRef.current);
    };
  }, [running, level]);

  useEffect(() => {
    if (!running) return;
    if (health <= 0) {
      setRunning(false);
      setOver('lose');
    }
    if (score >= 10 + level * 5) {
      setRunning(false);
      setOver('win');
      addXP(75);
    }
  }, [health, score, running, level, addXP]);

  function useDefense(d: Defense, threatId?: number) {
    if (!running) return;
    let id = threatId;
    if (id === undefined) {
      // apply to nearest threat to the right
      const t = threats.slice().sort((a, b) => b.x - a.x)[0];
      if (!t) return;
      id = t.id;
    }
    const t = threats.find((x) => x.id === id);
    if (!t) return;
    if (KIND_COUNTERS[t.kind] === d) {
      setThreats((ts) => ts.filter((x) => x.id !== id));
      setScore((s) => s + 1);
    } else {
      // wrong counter slows but doesn't kill
      setThreats((ts) => ts.map((x) => (x.id === id ? { ...x, x: Math.max(0, x.x - 8), counters: [...x.counters, d] } : x)));
      setScore((s) => Math.max(0, s - 1));
    }
  }

  if (!running && !over) {
    return (
      <div className="card max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold gradient-text">CIA Defender</h1>
        <p className="text-text-secondary mt-1">Threats march toward the server. Click a defense to deploy it against the leading threat. Match the right control to the right threat — wrong picks only slow them down.</p>
        <ul className="text-sm mt-3 grid sm:grid-cols-2 gap-2">
          {DEFENSE_INFO.map((d) => (
            <li key={d.id} className="bg-surface/60 rounded-lg p-2"><span className="text-xl mr-2">{d.emoji}</span><b>{d.id}</b> — {d.teaches}</li>
          ))}
        </ul>
        <div className="flex gap-2 mt-4">
          <button className="btn-primary" onClick={() => start(1)}>Level 1</button>
          <button className="btn-secondary" onClick={() => start(2)}>Level 2</button>
          <button className="btn-secondary" onClick={() => start(3)}>Level 3</button>
        </div>
      </div>
    );
  }

  if (over) {
    return (
      <div className="card max-w-md mx-auto text-center">
        <h2 className="text-2xl font-bold">{over === 'win' ? '🏆 Defense Holds!' : '💥 Server Compromised'}</h2>
        <p className="text-text-secondary mt-1">Score {score} · Level {level}</p>
        <div className="flex justify-center gap-2 mt-4">
          <button className="btn-primary" onClick={() => start(level)}>Retry</button>
          <button className="btn-secondary" onClick={() => start(Math.min(3, level + 1))}>Next level</button>
          <button className="btn-ghost" onClick={() => { setOver(null); setRunning(false); }}>Menu</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-w-3xl mx-auto">
      <div className="flex justify-between items-center text-sm">
        <div className="font-mono">Lvl {level} · HP <span className="text-danger">{'♥'.repeat(health)}</span></div>
        <div className="font-mono text-accent1">Score: {score}</div>
        <button className="btn-ghost !min-h-0 !py-1 text-sm" onClick={() => { setRunning(false); setOver(null); }}>Stop</button>
      </div>
      <div className="relative h-32 sm:h-40 rounded-2xl border border-border bg-bg/70 overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-16 bg-gradient-to-l from-success/20 to-transparent flex items-center justify-center text-3xl">🖥️</div>
        {threats.map((t) => (
          <button
            key={t.id}
            className="absolute top-1/2 -translate-y-1/2 text-3xl"
            style={{ left: `${Math.min(95, t.x)}%`, transition: 'left 0.1s linear' }}
            onClick={() => picked && useDefense(picked, t.id)}
            aria-label={`${t.kind} threat`}
            title={t.kind}
          >
            {t.emoji}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {DEFENSE_INFO.map((d) => (
          <button
            key={d.id}
            className={
              'flex flex-col items-center py-2 rounded-lg border transition-all ' +
              (picked === d.id ? 'border-accent1 bg-accent1/10 shadow-neon' : 'border-border hover:border-accent1/60')
            }
            onClick={() => { setPicked(d.id); useDefense(d.id); }}
          >
            <span className="text-2xl">{d.emoji}</span>
            <span className="text-xs mt-1">{d.id}</span>
          </button>
        ))}
      </div>
      <p className="text-xs text-text-secondary text-center">Click a defense to deploy it against the leading threat. Right match = kill. Wrong match = slow + lose a point.</p>
    </div>
  );
}
