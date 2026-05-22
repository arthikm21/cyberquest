import { Link } from 'react-router-dom';
import { Question } from '../content/types';

function correctIndexOf(q: Question): number {
  return Array.isArray(q.correct) ? q.correct[0] : q.correct;
}

function isCorrectIndex(q: Question, i: number): boolean {
  if (Array.isArray(q.correct)) return q.correct.includes(i);
  return q.correct === i;
}

function wrongIndexFor(q: Question, optionIdx: number): number {
  if (Array.isArray(q.correct)) return -1;
  return optionIdx < q.correct ? optionIdx : optionIdx - 1;
}

/**
 * Structured explanation block used after the user has committed an answer.
 * Renders:
 *   ✅ correct option + why_correct
 *   ✗ / ❌ each distractor + why_wrong[i] (the user's pick is highlighted in danger color)
 *   🧠 mnemonic when present
 *   🔗 deep link to the relevant Learn-domain module
 *
 * Compact mode hides mnemonic + link (for crowded inline feedback).
 */
export default function Explanation({ q, pickedIdx, compact }: { q: Question; pickedIdx?: number | null; compact?: boolean }) {
  const cIdx = correctIndexOf(q);
  return (
    <div className="space-y-2">
      <div className="text-sm flex gap-2">
        <span className="text-success font-semibold shrink-0">✅ Correct:</span>
        <div>
          <span className="text-text-primary font-semibold">{q.options[cIdx]}</span>
          <span className="text-text-secondary"> — {q.explanation.why_correct}</span>
        </div>
      </div>
      {q.options.map((opt, i) => {
        if (isCorrectIndex(q, i)) return null;
        const wi = wrongIndexFor(q, i);
        const w = q.explanation.why_wrong[wi];
        if (!w) return null;
        const isPick = pickedIdx === i;
        return (
          <div key={i} className="text-sm flex gap-2">
            <span className={'shrink-0 font-semibold ' + (isPick ? 'text-danger' : 'text-text-secondary')}>{isPick ? '❌ Your pick:' : '✗'}</span>
            <div>
              <span className={isPick ? 'text-danger font-semibold' : 'text-text-secondary'}>{opt}</span>
              <span className="text-text-secondary"> — {w}</span>
            </div>
          </div>
        );
      })}
      {q.explanation.mnemonic && !compact && (
        <div className="text-sm flex gap-2">
          <span className="text-warning font-semibold shrink-0">🧠 Mnemonic:</span>
          <span className="text-text-secondary">{q.explanation.mnemonic}</span>
        </div>
      )}
      {q.explanation.refModuleId && !compact && (
        <Link to={`/learn/${q.domain}`} className="text-sm text-accent1 inline-flex items-center gap-1 mt-1">
          🔗 Review {q.domain} · {q.explanation.refModuleId} →
        </Link>
      )}
    </div>
  );
}
