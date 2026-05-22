import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Rating, type Grade } from 'ts-fsrs';
import { FLASHCARDS } from '../content/flashcards';
import { useStore } from '../store';
import { DomainId } from '../lib/storage';
import { Search, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const DOMAIN_FILTERS: { id: 'all' | DomainId; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'D1', label: 'D1' },
  { id: 'D2', label: 'D2' },
  { id: 'D3', label: 'D3' },
  { id: 'D4', label: 'D4' },
  { id: 'D5', label: 'D5' },
];

const STATE_LABEL: Record<number, string> = {
  0: 'New',
  1: 'Learning',
  2: 'Review',
  3: 'Relearning',
};

export default function Flashcards() {
  const [sp] = useSearchParams();
  const initial = (sp.get('d') as DomainId | null) ?? 'all';
  const [filter, setFilter] = useState<'all' | DomainId>(initial);
  const [search, setSearch] = useState('');
  const [cram, setCram] = useState(false);

  const srs = useStore((s) => s.srs);
  const gradeCard = useStore((s) => s.gradeCard);
  const unlockBadge = useStore((s) => s.unlockBadge);

  const filtered = useMemo(() => {
    return FLASHCARDS.filter((c) => filter === 'all' || c.domain === filter)
      .filter((c) => !search || c.term.toLowerCase().includes(search.toLowerCase()) || c.def.toLowerCase().includes(search.toLowerCase()));
  }, [filter, search]);

  // Build study queue: due cards first (state exists + due <= now), then new (no state).
  // In cram mode, ignore scheduling — show entire filtered set.
  const queue = useMemo(() => {
    if (cram) return filtered;
    const now = Date.now();
    const due: typeof filtered = [];
    const fresh: typeof filtered = [];
    for (const c of filtered) {
      const r = srs[c.id];
      if (!r) fresh.push(c);
      else if (new Date(r.due).getTime() <= now) due.push(c);
      // future: skip outside cram mode
    }
    return [...due, ...fresh];
  }, [filtered, srs, cram]);

  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = queue[idx];

  function grade(r: Grade) {
    if (!card) return;
    gradeCard(card.id, r);
    // Encyclopedia: every flashcard in FSRS Review state with reps >= 1.
    // Check post-grade so the badge can fire immediately on the unlocking review.
    queueMicrotask(() => {
      const after = useStore.getState().srs;
      const allMastered = FLASHCARDS.every((c) => {
        const s = after[c.id];
        return s && s.state === 2 && s.reps >= 1;
      });
      if (allMastered) unlockBadge('encyclopedia');
    });
    setFlipped(false);
    setIdx((v) => v + 1);
  }

  const mastered = filtered.filter((c) => {
    const s = srs[c.id];
    return s && s.state === 2 && s.reps >= 1;
  }).length;
  const dueNow = filtered.filter((c) => {
    const s = srs[c.id];
    return s && new Date(s.due).getTime() <= Date.now();
  }).length;
  const newCount = filtered.filter((c) => !srs[c.id]).length;

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-extrabold gradient-text">Flashcards</h1>
        <div className="text-sm text-text-secondary">{mastered} / {filtered.length} mastered · {dueNow} due · {newCount} new</div>
      </header>

      <div className="flex flex-wrap gap-2 items-center">
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
        <button
          className={
            'px-3 py-1.5 rounded-full text-sm border transition-colors inline-flex items-center gap-1 ' +
            (cram ? 'border-warning bg-warning/10 text-warning' : 'border-border text-text-secondary hover:text-text-primary')
          }
          onClick={() => { setCram((v) => !v); setIdx(0); setFlipped(false); }}
          aria-pressed={cram}
          title="Cram mode ignores FSRS scheduling"
        >
          <Zap size={14} /> Cram {cram ? 'on' : 'off'}
        </button>
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
          <p className="text-text-secondary mt-1">
            {cram
              ? 'No cards match this filter.'
              : 'No due or new cards in this filter. Come back later or turn on Cram to study ahead.'}
          </p>
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
                  <div className="text-xs text-text-secondary uppercase">{card.domain} · {STATE_LABEL[srs[card.id]?.state ?? 0]}</div>
                  <div className="text-3xl font-extrabold mt-2 gradient-text">{card.term}</div>
                  <div className="text-text-secondary text-xs mt-6">Tap to flip</div>
                </div>
              </div>
              <div className="flip-card-back card overflow-y-auto">
                <div className="max-w-prose mx-auto h-full flex flex-col">
                  <div className="text-xs text-text-secondary uppercase text-center">Definition</div>
                  <div className="text-lg mt-2 text-center">{card.def}</div>
                  {card.example && (
                    <div className="text-sm mt-3 text-text-secondary">
                      <span className="text-accent1 font-semibold">📍 Example:</span> {card.example}
                    </div>
                  )}
                  {card.related && card.related.length > 0 && (
                    <div className="text-sm mt-2 text-text-secondary">
                      <span className="text-accent2 font-semibold">🔗 Related:</span> {card.related.join(', ')}
                    </div>
                  )}
                  <div className="mt-auto pt-3 flex items-center justify-between text-xs text-text-secondary">
                    <Link
                      to={`/learn/${card.domain}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-accent1 hover:underline"
                    >
                      📚 Review {card.domain} module →
                    </Link>
                    <span>Tap to flip back</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-text-secondary font-mono">{idx + 1} / {queue.length}</div>
            {srs[card.id]?.last_review && (
              <div className="text-xs text-text-secondary">
                Last review: {new Date(srs[card.id]!.last_review!).toLocaleDateString()}
              </div>
            )}
          </div>

          <div className="grid grid-cols-4 gap-2">
            <button className="btn-secondary !min-h-0 py-3 flex-col" onClick={() => grade(Rating.Again)}>
              <span className="text-danger font-bold">Again</span>
              <span className="text-[10px] text-text-secondary">1</span>
            </button>
            <button className="btn-secondary !min-h-0 py-3 flex-col" onClick={() => grade(Rating.Hard)}>
              <span className="text-warning font-bold">Hard</span>
              <span className="text-[10px] text-text-secondary">2</span>
            </button>
            <button className="btn-secondary !min-h-0 py-3 flex-col" onClick={() => grade(Rating.Good)}>
              <span className="text-success font-bold">Good</span>
              <span className="text-[10px] text-text-secondary">3</span>
            </button>
            <button className="btn-secondary !min-h-0 py-3 flex-col" onClick={() => grade(Rating.Easy)}>
              <span className="text-accent1 font-bold">Easy</span>
              <span className="text-[10px] text-text-secondary">4</span>
            </button>
          </div>
          <p className="text-xs text-text-secondary text-center">
            FSRS schedules each card by your grade. Again → soon, Easy → far away. Cram mode ignores scheduling.
          </p>
        </>
      )}
    </div>
  );
}

