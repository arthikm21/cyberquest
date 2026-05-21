import { useState } from 'react';

type Key = 'cia' | 'crisis' | 'matrix' | 'osi' | 'vault';

export default function Explainers() {
  const [tab, setTab] = useState<Key>('cia');
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-3xl font-extrabold gradient-text">Visual Explainers</h1>
        <p className="text-text-secondary">Click around to build intuition — these are alive, not slides.</p>
      </header>
      <div className="flex flex-wrap gap-2">
        {([
          ['cia', 'D1 · CIA Castle'],
          ['crisis', 'D2 · Crisis Timeline'],
          ['matrix', 'D3 · Access Matrix'],
          ['osi', 'D4 · OSI Layer Cake'],
          ['vault', 'D5 · Data Vault'],
        ] as [Key, string][]).map(([k, lbl]) => (
          <button
            key={k}
            className={
              'px-3 py-1.5 rounded-full text-sm border transition-colors ' +
              (tab === k ? 'border-accent1 bg-accent1/10 text-accent1' : 'border-border text-text-secondary hover:text-text-primary')
            }
            onClick={() => setTab(k)}
          >
            {lbl}
          </button>
        ))}
      </div>
      <div className="card">
        {tab === 'cia' && <CIACastle />}
        {tab === 'crisis' && <CrisisTimeline />}
        {tab === 'matrix' && <AccessMatrix />}
        {tab === 'osi' && <OSICake />}
        {tab === 'vault' && <DataVault />}
      </div>
    </div>
  );
}

function CIACastle() {
  const [tower, setTower] = useState<'C' | 'I' | 'A' | null>(null);
  const info = {
    C: { name: 'Confidentiality', color: '#00d4ff', defs: 'Encryption, access controls, classification, MFA.' },
    I: { name: 'Integrity', color: '#10b981', defs: 'Hashing, digital signatures, change control, version control.' },
    A: { name: 'Availability', color: '#f59e0b', defs: 'Redundancy, backups, DDoS protection, capacity planning.' },
  } as const;
  return (
    <div>
      <svg viewBox="0 0 600 260" className="w-full">
        <rect x="0" y="200" width="600" height="60" fill="#1f2937" />
        {([['C', 120], ['I', 300], ['A', 480]] as ['C' | 'I' | 'A', number][]).map(([t, x]) => (
          <g key={t} onClick={() => setTower(t)} className="cursor-pointer">
            <rect x={x - 30} y={80} width={60} height={120} fill={info[t].color} opacity={tower === t ? 1 : 0.55} />
            <polygon points={`${x - 30},80 ${x},50 ${x + 30},80`} fill={info[t].color} />
            <rect x={x - 8} y={140} width={16} height={30} fill="#0a0e1a" />
            <text x={x - 4} y={185} fontSize="20" fontWeight="bold" fill="#0a0e1a">{t}</text>
          </g>
        ))}
        <text x="60" y="40" fontSize="14" fill="#9ca3af">Click a tower to explore →</text>
      </svg>
      {tower && (
        <div className="mt-3">
          <h3 className="font-bold" style={{ color: (info as any)[tower].color }}>{info[tower].name}</h3>
          <p className="text-sm text-text-secondary">{info[tower].defs}</p>
        </div>
      )}
    </div>
  );
}

function CrisisTimeline() {
  const stages = [
    { name: 'Normal', tip: 'Baseline operations. Detection coverage continually validated.' },
    { name: 'Incident', tip: 'An event with adverse impact occurs. IR is triggered.' },
    { name: 'IR Active', tip: 'Containment / Eradication / Recovery underway.' },
    { name: 'BC Holds', tip: 'Critical business functions kept running, possibly degraded.' },
    { name: 'DR Restores', tip: 'Systems and data restored from baseline / backups.' },
    { name: 'Back to Normal', tip: 'Post-incident lessons applied. Controls strengthened.' },
  ];
  const [i, setI] = useState(0);
  return (
    <div>
      <div className="relative">
        <div className="h-2 bg-surface rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-accent1 to-accent2 transition-all" style={{ width: `${((i + 1) / stages.length) * 100}%` }} />
        </div>
        <div className="flex justify-between mt-2">
          {stages.map((s, idx) => (
            <button key={s.name} className={'text-xs px-1 ' + (idx === i ? 'text-accent1 font-bold' : 'text-text-secondary')} onClick={() => setI(idx)}>
              {s.name}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 text-sm text-text-secondary">{stages[i].tip}</div>
    </div>
  );
}

function AccessMatrix() {
  const users = ['Alex', 'Sam', 'Jordan'];
  const resources = ['payroll.db', 'reports/', 'configs.yml'];
  const initial: ('allow' | 'deny' | 'cond')[][] = [
    ['deny', 'allow', 'deny'],
    ['allow', 'allow', 'cond'],
    ['deny', 'cond', 'allow'],
  ];
  const [grid, setGrid] = useState(initial);
  function toggle(r: number, c: number) {
    setGrid((g) => g.map((row, ri) => ri !== r ? row : row.map((cell, ci) => ci !== c ? cell : cell === 'allow' ? 'deny' : cell === 'deny' ? 'cond' : 'allow')));
  }
  return (
    <div>
      <table className="w-full text-sm">
        <thead>
          <tr><th></th>{resources.map((r) => <th key={r} className="text-left p-2 text-text-secondary font-mono">{r}</th>)}</tr>
        </thead>
        <tbody>
          {users.map((u, ri) => (
            <tr key={u}>
              <td className="p-2 font-semibold">{u}</td>
              {resources.map((_, ci) => {
                const v = grid[ri][ci];
                const cls = v === 'allow' ? 'bg-success/30 border-success/50' : v === 'deny' ? 'bg-danger/30 border-danger/50' : 'bg-warning/30 border-warning/50';
                return <td key={ci} className="p-1"><button className={'w-full px-2 py-1 rounded border ' + cls} onClick={() => toggle(ri, ci)}>{v}</button></td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-text-secondary mt-2">Click a cell to cycle allow → deny → conditional. This is what an Access Control Matrix looks like under RBAC/DAC tooling.</p>
    </div>
  );
}

function OSICake() {
  const layers = [
    { n: 7, name: 'Application', ex: 'HTTP, SMTP, DNS' },
    { n: 6, name: 'Presentation', ex: 'TLS, encoding, compression' },
    { n: 5, name: 'Session', ex: 'NetBIOS, RPC' },
    { n: 4, name: 'Transport', ex: 'TCP, UDP' },
    { n: 3, name: 'Network', ex: 'IP, ICMP, routers' },
    { n: 2, name: 'Data Link', ex: 'MAC, switches, Ethernet' },
    { n: 1, name: 'Physical', ex: 'Cables, NICs, signals' },
  ];
  const [pick, setPick] = useState<number | null>(7);
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <div className="space-y-1">
        {layers.map((l) => (
          <button
            key={l.n}
            onClick={() => setPick(l.n)}
            className={'w-full text-left rounded-lg p-2 border transition-all ' + (pick === l.n ? 'border-accent1 bg-accent1/10' : 'border-border')}
          >
            <span className="font-mono text-xs text-text-secondary mr-2">L{l.n}</span> {l.name}
          </button>
        ))}
      </div>
      <div className="card !p-3">
        {pick && (
          <>
            <div className="text-xs text-text-secondary">Layer {pick}</div>
            <h3 className="font-bold gradient-text text-lg">{layers.find((l) => l.n === pick)!.name}</h3>
            <p className="text-sm text-text-secondary mt-1">Examples: {layers.find((l) => l.n === pick)!.ex}</p>
          </>
        )}
        <p className="text-xs text-text-secondary mt-3">Data flows down on send, up on receive. Each layer adds/removes its own headers.</p>
      </div>
    </div>
  );
}

function DataVault() {
  const stages = ['Create', 'Store', 'Use', 'Share', 'Archive', 'Destroy'];
  const tips: Record<string, string> = {
    Create: 'Classify at creation. Apply labels immediately.',
    Store: 'Encrypt at rest. Apply access controls per classification.',
    Use: 'Enforce least privilege; log access for accountability.',
    Share: 'Encrypt in transit. Verify recipient need-to-know.',
    Archive: 'Move to cold storage; retain per policy/regulation.',
    Destroy: 'Clearing (overwrite), Purging (degauss), or Physical destruction.',
  };
  const [pick, setPick] = useState('Create');
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {stages.map((s) => (
          <button key={s} className={'px-3 py-1.5 rounded-full text-sm border ' + (pick === s ? 'border-accent1 bg-accent1/10 text-accent1' : 'border-border text-text-secondary')} onClick={() => setPick(s)}>{s}</button>
        ))}
      </div>
      <div className="mt-3 card !p-3">
        <h3 className="font-bold">{pick}</h3>
        <p className="text-sm text-text-secondary mt-1">{tips[pick]}</p>
      </div>
    </div>
  );
}
