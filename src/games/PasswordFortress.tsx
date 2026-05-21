import { useEffect, useMemo, useState } from 'react';
import { useStore } from '../store';

function strengthOf(pw: string) {
  let s = 0;
  if (pw.length >= 8) s += 1;
  if (pw.length >= 12) s += 1;
  if (pw.length >= 16) s += 1;
  if (/[A-Z]/.test(pw)) s += 1;
  if (/[a-z]/.test(pw)) s += 1;
  if (/[0-9]/.test(pw)) s += 1;
  if (/[^A-Za-z0-9]/.test(pw)) s += 1;
  if (/(password|qwerty|admin|1234|letmein)/i.test(pw)) s = Math.max(0, s - 3);
  return Math.min(7, s);
}

const ATTACKS = [
  { name: 'Dictionary', needs: 2, tip: 'Common words / "password" / "qwerty" fail dictionary attacks.' },
  { name: 'Brute force (short)', needs: 4, tip: 'Length is the single biggest factor against brute force.' },
  { name: 'Credential stuffing', needs: 5, tip: 'Reusing passwords across sites is the real win for attackers. Unique passwords + MFA stop this.' },
  { name: 'Hybrid attack', needs: 6, tip: 'Predictable substitutions (P@ssw0rd) get cracked. Mix length, symbols, randomness.' },
  { name: 'GPU brute force (long)', needs: 7, tip: 'Long passphrases (≥16 chars) defeat even GPU brute force in reasonable time.' },
];

export default function PasswordFortress() {
  const [pw, setPw] = useState('');
  const [wave, setWave] = useState(0);
  const [result, setResult] = useState<null | 'survived' | 'breached'>(null);
  const addXP = useStore((s) => s.addXP);
  const s = useMemo(() => strengthOf(pw), [pw]);

  useEffect(() => {
    if (result || wave === 0) return;
    const t = setTimeout(() => {
      const atk = ATTACKS[wave - 1];
      if (s >= atk.needs) {
        if (wave === ATTACKS.length) {
          setResult('survived');
          addXP(80);
        } else {
          setWave((w) => w + 1);
        }
      } else {
        setResult('breached');
      }
    }, 1100);
    return () => clearTimeout(t);
  }, [wave, result, s, addXP]);

  function start() {
    if (!pw) return;
    setResult(null);
    setWave(1);
  }

  return (
    <div className="max-w-xl mx-auto space-y-3">
      <h1 className="text-2xl font-bold gradient-text">Password Fortress</h1>
      <p className="text-xs text-text-secondary">Build a password. The fortress will face 5 attack waves. Length + variety + uniqueness wins.</p>

      <div className="card space-y-3">
        <input
          className="input w-full font-mono"
          placeholder="Type a candidate password…"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          autoComplete="off"
          spellCheck={false}
        />
        <div className="flex gap-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="h-2 flex-1 rounded"
              style={{
                background:
                  i < s
                    ? s <= 2 ? '#ef4444' : s <= 4 ? '#f59e0b' : '#10b981'
                    : '#1f2937',
              }}
            />
          ))}
        </div>
        <div className="text-xs text-text-secondary">Strength score {s}/7</div>
      </div>

      {!wave && !result && (
        <button className="btn-primary w-full" onClick={start} disabled={!pw}>Defend the fortress</button>
      )}

      {wave > 0 && !result && (
        <div className="card text-center">
          <div className="text-xs text-text-secondary uppercase">Wave {wave} / {ATTACKS.length}</div>
          <div className="text-xl font-bold mt-1">⚔️ {ATTACKS[wave - 1].name}</div>
          <p className="text-sm text-text-secondary mt-2">{ATTACKS[wave - 1].tip}</p>
          <div className="mt-3 animate-pulse text-accent1">Holding the line…</div>
        </div>
      )}

      {result && (
        <div className="card text-center">
          <h2 className="text-2xl font-bold">{result === 'survived' ? '🏆 Fortress holds!' : '💥 Breached'}</h2>
          <p className="text-text-secondary mt-1">{result === 'survived' ? 'Strong password survived all 5 waves.' : `Failed at wave ${wave}: ${ATTACKS[wave - 1].name}.`}</p>
          <button className="btn-primary mt-3" onClick={() => { setWave(0); setResult(null); }}>Try another password</button>
        </div>
      )}
    </div>
  );
}
