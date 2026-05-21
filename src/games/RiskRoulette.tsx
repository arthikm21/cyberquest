import { useMemo, useState } from 'react';
import { useStore } from '../store';

type Treatment = 'Accept' | 'Avoid' | 'Mitigate' | 'Transfer';
type Scenario = { text: string; correct: Treatment; why: string };

const SCENARIOS: Scenario[] = [
  { text: 'A laptop was left on a train. Likelihood: high. Impact: high.', correct: 'Mitigate', why: 'Mitigate via FDE + remote-wipe + endpoint policy. Cost-justified.' },
  { text: 'A fringe market is so risky leadership wants to stop selling there.', correct: 'Avoid', why: 'Eliminating the activity removes the risk entirely.' },
  { text: 'A rare freak hailstorm could damage one rooftop antenna. Cost to insure is trivial.', correct: 'Transfer', why: 'Insurance shifts financial impact to a third party.' },
  { text: 'A 0.001% chance of a $50 power surge fries a backup fan we replace anyway.', correct: 'Accept', why: 'Cost of treatment exceeds expected loss — accept.' },
  { text: 'Engineers may leak source code via personal email.', correct: 'Mitigate', why: 'DLP + policy + least privilege + monitoring reduce likelihood & impact.' },
  { text: 'Operating in a sanctioned country exposes us to legal action.', correct: 'Avoid', why: 'Avoidance — exit the business activity.' },
  { text: 'Hosting our own email risks an outage we cannot fix fast.', correct: 'Transfer', why: 'Outsource to a managed provider — transfer operational risk.' },
  { text: 'A printer in the lobby occasionally jams. Minor productivity hit.', correct: 'Accept', why: 'Low-impact nuisance — formally accept.' },
  { text: 'Phishing succeeds twice per quarter.', correct: 'Mitigate', why: 'Training + email filtering + MFA + reporting tools — layered mitigation.' },
  { text: 'Building a feature requires storing biometric data we don’t have policy for.', correct: 'Avoid', why: 'Without policy/controls, do not collect — avoid.' },
];

const TREATMENTS: Treatment[] = ['Accept', 'Avoid', 'Mitigate', 'Transfer'];

export default function RiskRoulette() {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<Treatment | null>(null);
  const [done, setDone] = useState(false);
  const addXP = useStore((s) => s.addXP);
  const cur = SCENARIOS[idx];
  const ordered = useMemo(() => SCENARIOS.slice(), []);

  function choose(t: Treatment) {
    if (picked) return;
    setPicked(t);
    if (t === cur.correct) setScore((s) => s + 1);
  }

  function next() {
    if (idx + 1 === ordered.length) {
      setDone(true);
      addXP(20 + score * 5);
      return;
    }
    setIdx(idx + 1);
    setPicked(null);
  }

  if (done) {
    return (
      <div className="card max-w-md mx-auto text-center">
        <h2 className="text-2xl font-bold">Roulette Result</h2>
        <p className="text-text-secondary mt-1">{score} / {SCENARIOS.length} correct treatments.</p>
        <button className="btn-primary mt-4" onClick={() => { setIdx(0); setScore(0); setPicked(null); setDone(false); }}>Replay</button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-3">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold gradient-text">Risk Roulette</h1>
        <span className="text-sm font-mono text-text-secondary">{idx + 1} / {SCENARIOS.length}</span>
      </header>
      <div className="card">
        <div className="text-xs text-text-secondary uppercase">Scenario</div>
        <p className="text-lg font-semibold mt-1">{cur.text}</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {TREATMENTS.map((t) => {
          const isCorrect = t === cur.correct;
          const isPicked = picked === t;
          let cls = 'card !p-3 text-center transition-all ';
          if (!picked) cls += 'hover:border-accent1';
          else if (isCorrect) cls += 'border-success !bg-success/10';
          else if (isPicked) cls += 'border-danger !bg-danger/10';
          else cls += 'opacity-60';
          return (
            <button key={t} className={cls} onClick={() => choose(t)} disabled={!!picked}>
              <div className="font-bold">{t}</div>
            </button>
          );
        })}
      </div>
      {picked && (
        <div className="card">
          <div className={picked === cur.correct ? 'text-success font-semibold' : 'text-danger font-semibold'}>
            {picked === cur.correct ? '✓ Right call' : '✗ Better choice: ' + cur.correct}
          </div>
          <p className="text-sm text-text-secondary mt-1">{cur.why}</p>
          <button className="btn-primary mt-3" onClick={next}>{idx + 1 < SCENARIOS.length ? 'Next' : 'Finish'}</button>
        </div>
      )}
    </div>
  );
}
