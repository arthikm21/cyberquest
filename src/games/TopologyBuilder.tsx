import { useState } from 'react';
import { useStore } from '../store';

type Kind = 'Internet' | 'Firewall' | 'Router' | 'Switch' | 'Server' | 'Client';

type Node = { id: number; kind: Kind; x: number; y: number };

const PALETTE: { kind: Kind; emoji: string }[] = [
  { kind: 'Internet', emoji: '🌐' },
  { kind: 'Firewall', emoji: '🧱' },
  { kind: 'Router', emoji: '📡' },
  { kind: 'Switch', emoji: '🔀' },
  { kind: 'Server', emoji: '🖥️' },
  { kind: 'Client', emoji: '💻' },
];

export default function TopologyBuilder() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [links, setLinks] = useState<[number, number][]>([]);
  const [linkFrom, setLinkFrom] = useState<number | null>(null);
  const [audit, setAudit] = useState<null | { score: number; notes: string[] }>(null);
  const addXP = useStore((s) => s.addXP);

  function add(kind: Kind, e: React.MouseEvent<HTMLDivElement>) {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setNodes((ns) => [...ns, { id: Date.now() + Math.random(), kind, x: Math.max(20, Math.min(rect.width - 20, x)), y: Math.max(20, Math.min(rect.height - 20, y)) }]);
  }

  function toggleLink(id: number) {
    if (linkFrom === null) {
      setLinkFrom(id);
      return;
    }
    if (linkFrom === id) {
      setLinkFrom(null);
      return;
    }
    setLinks((ls) => [...ls, [linkFrom, id]]);
    setLinkFrom(null);
  }

  function runAudit() {
    const notes: string[] = [];
    let score = 0;
    const has = (k: Kind) => nodes.some((n) => n.kind === k);
    const get = (k: Kind) => nodes.find((n) => n.kind === k);

    const internet = get('Internet');
    const firewall = get('Firewall');
    const server = get('Server');
    const client = get('Client');

    if (has('Internet') && has('Firewall')) {
      if (internet && firewall && links.some(([a, b]) => [a, b].includes(internet.id) && [a, b].includes(firewall.id))) {
        score += 30;
        notes.push('✓ Internet sits behind a Firewall.');
      } else {
        notes.push('✗ Internet exists but is not connected to the Firewall.');
      }
    } else if (has('Internet')) {
      notes.push('✗ Internet present but no Firewall — internal devices are directly exposed.');
    }

    if (firewall && server) {
      const path = links.some(([a, b]) => [a, b].includes(firewall.id) && [a, b].includes(server.id));
      const directInternet = internet && links.some(([a, b]) => [a, b].includes(internet.id) && [a, b].includes(server.id));
      if (path && !directInternet) {
        score += 20;
        notes.push('✓ Server reachable only via Firewall.');
      } else if (directInternet) {
        notes.push('✗ Server is directly connected to Internet — bypasses Firewall.');
      }
    }

    if (has('Switch') && has('Client')) {
      score += 15;
      notes.push('✓ Switch present — internal clients can be segmented.');
    }

    if (has('Router')) {
      score += 10;
      notes.push('✓ Router included for L3 routing.');
    }

    if (links.length === 0) notes.push('✗ No connections drawn.');
    if (nodes.length < 3) notes.push('ℹ Add at least an Internet, Firewall, and Server for a realistic perimeter.');

    if (client && server && links.length) {
      score += 15;
      notes.push('✓ Client and Server present in the same diagram.');
    }

    score = Math.max(0, Math.min(100, score + 10));
    setAudit({ score, notes });
    addXP(40 + Math.floor(score / 4));
  }

  function reset() { setNodes([]); setLinks([]); setLinkFrom(null); setAudit(null); }

  return (
    <div className="max-w-4xl mx-auto space-y-3">
      <h1 className="text-2xl font-bold gradient-text">Network Topology Builder</h1>
      <p className="text-xs text-text-secondary">Click a device button, then click in the canvas to place it. Click two nodes to link them. Aim for: Internet → Firewall → Switch → Servers/Clients.</p>

      <div className="flex flex-wrap gap-2">
        {PALETTE.map((p) => (
          <DragChip key={p.kind} kind={p.kind} emoji={p.emoji} onPlace={(e) => add(p.kind, e)} />
        ))}
        <button className="btn-ghost ml-auto !min-h-0 !py-1 text-sm" onClick={reset}>Reset</button>
        <button className="btn-primary !min-h-0 !py-1 text-sm" onClick={runAudit}>Audit network</button>
      </div>

      <div
        id="topo-canvas"
        className="relative h-96 rounded-2xl border border-dashed border-border bg-bg/50 overflow-hidden"
        onClick={(e) => {
          const active = document.querySelector('[data-place]') as HTMLElement | null;
          const kind = active?.dataset.place as Kind | undefined;
          if (kind) {
            add(kind, e as unknown as React.MouseEvent<HTMLDivElement>);
            active?.removeAttribute('data-place');
          }
        }}
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {links.map(([a, b], i) => {
            const A = nodes.find((n) => n.id === a);
            const B = nodes.find((n) => n.id === b);
            if (!A || !B) return null;
            return <line key={i} x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="#00d4ff" strokeWidth={2} opacity={0.7} />;
          })}
        </svg>
        {nodes.map((n) => {
          const palette = PALETTE.find((p) => p.kind === n.kind)!;
          return (
            <button
              key={n.id}
              className={'absolute -translate-x-1/2 -translate-y-1/2 text-3xl bg-surface/80 rounded-full border ' + (linkFrom === n.id ? 'border-accent1 shadow-neon' : 'border-border')}
              style={{ left: n.x, top: n.y, width: 48, height: 48 }}
              onClick={(e) => { e.stopPropagation(); toggleLink(n.id); }}
              title={n.kind}
              aria-label={n.kind}
            >{palette.emoji}</button>
          );
        })}
        {nodes.length === 0 && <div className="absolute inset-0 flex items-center justify-center text-text-secondary text-sm">Click a device above, then click on the canvas to place it.</div>}
      </div>

      {audit && (
        <div className="card">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">Audit: <span className={audit.score >= 60 ? 'text-success' : 'text-warning'}>{audit.score}/100</span></h2>
          </div>
          <ul className="text-sm space-y-1 mt-2">
            {audit.notes.map((n, i) => (<li key={i} className="text-text-secondary">{n}</li>))}
          </ul>
        </div>
      )}
    </div>
  );
}

function DragChip({ kind, emoji, onPlace }: { kind: Kind; emoji: string; onPlace: (e: React.MouseEvent<HTMLDivElement>) => void }) {
  return (
    <button
      data-place-btn={kind}
      className="btn-secondary !min-h-0 !py-1 text-sm"
      onClick={(e) => {
        e.stopPropagation();
        const existing = document.querySelector('[data-place]');
        if (existing) existing.removeAttribute('data-place');
        (e.currentTarget as HTMLElement).setAttribute('data-place', kind);
      }}
    >
      <span className="text-lg">{emoji}</span> {kind}
    </button>
  );
}
