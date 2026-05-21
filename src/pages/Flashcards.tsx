import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FLASHCARDS } from '../content/flashcards';
import { useStore } from '../store';
import { DomainId } from '../lib/storage';
import { Search } from 'lucide-react';

const DOMAIN_FILTERS: { id: 'all' | DomainId; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'D1', label: 'D1' },
  { id: 'D2', label: 'D2' },
  { id: 'D3', label: 'D3' },
  { id: 'D4', label: 'D4' },
  { id: 'D5', label: 'D5' },
];

export default function Flashcards() {
  const [sp] = useSearchParams();
  const initial = (sp.get('d') as DomainId | null) ?? 'all';
  const [filter, setFilter] = useState<'all' | DomainId>(initial);
  const [search, setSearch] = useState('');
  const srs = useStore((s) => s.srs);
  const setSrs = useStore((s) => s.setSrs);
  const addXP = useStore((s) => s.addXP);
  const unlockBadge = useStore((s) => s.unlockBadge);

  const filtered = useMemo(() => {
    return FLASHCARDS.filter((c) => (filter === 'all' || c.domain === filter))
      .filter((c) => !search || c.term.toLowerCase().includes(search.toLowerCase()) || c.def.toLowerCase().includes(search.toLowerCase()));
  }, [filter, search]);

  // study queue: due cards first, then unseen
  const queue = useMemo(() => {
    const now = Date.now();
    const due: typeof filtered = [];
    const unseen: typeof filtered = [];
    const future: typeof filtered = [];
    for (const c of filtered) {
      const r = srs[c.id];
      if (!r) unseen.push(c);
      else if (new Date(r.dueISO).getTime() <= now) due.push(c);
      else future.push(c);
    }
    return [...due, ...unseen, ...future];
  }, [filtered, srs]);

  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = queue[idx];

  function know() {
    if (!card) return;
    const cur = srs[card.id]?.box ?? 1;
    const next = Math.min(5, cur + 1) as 1 | 2 | 3 | 4 | 5;
    setSrs(card.id, next);
    addXP(5);
    advance();
    // encyclopedia: all FLASHCARDS at box >= 4
    const allMastered = FLASHCARDS.every((c) => (c.id === card.id ? next >= 4 : (srs[c.id]?.box ?? 0) >= 4));
    if (allMastered) unlockBadge('encyclopedia');
  }
  function dunno() {
    if (!card) return;
    setSrs(card.id, 1);
    advance();
  }
  function advance() {
    setFlipped(false);
    setIdx((v) => v + 1);
  }

  const mastered = filtered.filter((c) => (srs[c.id]?.box ?? 0) >= 4).length;

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-extrabold gradient-text">Flashcards</h1>
        <div className="text-sm text-text-secondary">{mastered} / {filtered.length} mastered</div>
      </header>

      <div className="flex flex-wrap gap-2">
        {DOMAIN_FILTERS.map((d) => (
          <button
            key={d.id}
            className={
              'px-3 py-1.5 rounded-full text-sm border transition-colors ' +
              (filter === d.id ? 'border-accent1 bg-accent1/10 text-accent1' : 'border-border text-text-secondary hover:text-text-primary')
            }
            onClick={() => { setFilter(d.id); setIdx(0); setFlipped(false); }}
          >
            {d.label}
          </button>
        ))}
        <div className="relative ml-auto">
          <Search size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            className="input pl-8"
            placeholder="Search terms…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setIdx(0); }}
          />
        </div>
      </div>

      {!card ? (
        <div className="card text-center">
          <h2 className="text-xl font-bold">All caught up 🎉</h2>
          <p className="text-text-secondary mt-1">No more cards in this filter. Come back later or pick another domain.</p>
        </div>
      ) : (
        <>
          <div
            className={'flip-card h-72 sm:h-80 ' + (flipped ? 'flipped' : '')}
            onClick={() => setFlipped((f) => !f)}
          >
            <div className="flip-card-inner cursor-pointer">
              <div className="flip-card-front card flex items-center justify-center text-center">
                <div>
                  <div className="text-xs text-text-secondary uppercase">{card.domain}</div>
                  <div className="text-3xl font-extrabold mt-2 gradient-text">{card.term}</div>
                  <div className="text-text-secondary text-xs mt-6">Tap to flip</div>
                </div>
              </div>
              <div className="flip-card-back card flex items-center justify-center text-center">
                <div className="max-w-prose">
                  <div className="text-xs text-text-secondary uppercase">Definition</div>
                  <div className="text-lg mt-2">{card.def}</div>
                  <div className="text-text-secondary text-xs mt-6">Tap to flip back</div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-sm text-text-secondary font-mono">{idx + 1} / {queue.length} · Box {srs[card.id]?.box ?? 1}</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button className="btn-secondary py-3" onClick={dunno}>← Again</button>
            <button className="btn-primary py-3" onClick={know}>Got it →</button>
          </div>
          <p className="text-xs text-text-secondary text-center">
            Leitner spaced repetition — "Got it" pushes the card further into the future. "Again" resets to box 1.
          </p>
        </>
      )}
    </div>
  );
}
