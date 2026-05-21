import { useMemo, useState } from 'react';
import { FLASHCARDS } from '../content/flashcards';
import { DomainId } from '../lib/storage';
import { Search } from 'lucide-react';

const DOMAINS: ('all' | DomainId)[] = ['all', 'D1', 'D2', 'D3', 'D4', 'D5'];

export default function Glossary() {
  const [filter, setFilter] = useState<'all' | DomainId>('all');
  const [q, setQ] = useState('');

  const items = useMemo(() => {
    return FLASHCARDS
      .filter((t) => filter === 'all' || t.domain === filter)
      .filter((t) => !q || t.term.toLowerCase().includes(q.toLowerCase()) || t.def.toLowerCase().includes(q.toLowerCase()))
      .sort((a, b) => a.term.localeCompare(b.term));
  }, [filter, q]);

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-3xl font-extrabold gradient-text">Glossary</h1>
        <p className="text-text-secondary">{FLASHCARDS.length} terms covered. Filter and search.</p>
      </header>
      <div className="flex flex-wrap gap-2">
        {DOMAINS.map((d) => (
          <button
            key={d}
            className={'px-3 py-1.5 rounded-full text-sm border ' + (filter === d ? 'border-accent1 bg-accent1/10 text-accent1' : 'border-border text-text-secondary')}
            onClick={() => setFilter(d)}
          >
            {d.toUpperCase()}
          </button>
        ))}
        <div className="relative ml-auto">
          <Search size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input className="input pl-8" placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>
      <ul className="grid sm:grid-cols-2 gap-3">
        {items.map((t) => (
          <li key={t.id} className="card">
            <div className="flex justify-between text-xs text-text-secondary">
              <span className="font-mono">{t.domain}</span>
            </div>
            <h3 className="text-lg font-bold mt-1">{t.term}</h3>
            <p className="text-sm text-text-secondary mt-1">{t.def}</p>
          </li>
        ))}
        {items.length === 0 && <p className="text-text-secondary">No results.</p>}
      </ul>
    </div>
  );
}
