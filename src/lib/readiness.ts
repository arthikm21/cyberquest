import { DomainId, ExamAttempt } from './storage';

const WINDOW_MS = 14 * 24 * 3600 * 1000;
const MIN_ATTEMPTS = 3;
const PASS_SCALED = 900; // 90% of 1000
const DOMAIN_MIN = 0.8; // 80% accuracy per domain across the qualifying attempts

export type Readiness =
  | { ready: true; avgScaled: number; perDomainAcc: Record<DomainId, number>; qualifyingAttempts: ExamAttempt[] }
  | {
      ready: false;
      reason: string;
      blocker: 'no_attempts' | 'too_few_attempts' | 'low_score' | 'weak_domain';
      weakDomain?: DomainId;
      weakDomainAcc?: number;
      perDomainAcc?: Record<DomainId, number>;
      qualifyingAttempts?: ExamAttempt[];
    };

export function computeReadiness(attempts: ExamAttempt[]): Readiness {
  const cutoff = Date.now() - WINDOW_MS;
  const recent = attempts
    .filter((a) => a.finishedTs >= cutoff)
    .sort((a, b) => b.finishedTs - a.finishedTs);

  if (recent.length === 0) {
    return {
      ready: false,
      blocker: 'no_attempts',
      reason: 'Take a 100-question mock to start tracking readiness.',
    };
  }
  if (recent.length < MIN_ATTEMPTS) {
    const need = MIN_ATTEMPTS - recent.length;
    return {
      ready: false,
      blocker: 'too_few_attempts',
      reason: `${need} more 100-question mock${need === 1 ? '' : 's'} needed in the last 14 days.`,
    };
  }

  const top3 = recent.slice(0, MIN_ATTEMPTS);
  const lowest = Math.min(...top3.map((a) => a.scaledScore));
  if (lowest < PASS_SCALED) {
    return {
      ready: false,
      blocker: 'low_score',
      reason: `Need ≥ ${PASS_SCALED} scaled on each of the last 3 mocks. Lowest so far: ${lowest}.`,
      qualifyingAttempts: top3,
    };
  }

  // Aggregate per-domain accuracy across qualifying attempts.
  const agg: Record<DomainId, { right: number; total: number }> = {
    D1: { right: 0, total: 0 }, D2: { right: 0, total: 0 }, D3: { right: 0, total: 0 },
    D4: { right: 0, total: 0 }, D5: { right: 0, total: 0 },
  };
  for (const a of top3) {
    for (const d of Object.keys(a.perDomain) as DomainId[]) {
      agg[d].right += a.perDomain[d].right;
      agg[d].total += a.perDomain[d].total;
    }
  }
  const perDomainAcc: Record<DomainId, number> = { D1: 1, D2: 1, D3: 1, D4: 1, D5: 1 };
  let weakest: { domain: DomainId; acc: number } | null = null;
  for (const d of Object.keys(agg) as DomainId[]) {
    const acc = agg[d].total > 0 ? agg[d].right / agg[d].total : 1;
    perDomainAcc[d] = acc;
    if (acc < DOMAIN_MIN && (!weakest || acc < weakest.acc)) {
      weakest = { domain: d, acc };
    }
  }

  if (weakest) {
    return {
      ready: false,
      blocker: 'weak_domain',
      reason: `${weakest.domain} accuracy ${Math.round(weakest.acc * 100)}% across the last 3 mocks — need ≥ ${Math.round(DOMAIN_MIN * 100)}%.`,
      weakDomain: weakest.domain,
      weakDomainAcc: weakest.acc,
      perDomainAcc,
      qualifyingAttempts: top3,
    };
  }

  return {
    ready: true,
    avgScaled: Math.round(top3.reduce((s, a) => s + a.scaledScore, 0) / top3.length),
    perDomainAcc,
    qualifyingAttempts: top3,
  };
}

/**
 * Find the weakest sub-objectives within a domain from quizHistory.
 * `qLookup` maps question id -> subObjective (caller supplies, to avoid
 * pulling the question bank into the store/initial bundle).
 */
export function weakSubObjectivesIn(
  domain: DomainId,
  quizHistory: { id: string; correct: boolean; ts: number; domain: DomainId }[],
  qLookup: Map<string, string>,
  limit = 5,
): { subObjective: string; acc: number; n: number }[] {
  const tally = new Map<string, { right: number; total: number }>();
  for (const h of quizHistory) {
    if (h.domain !== domain) continue;
    const sub = qLookup.get(h.id);
    if (!sub) continue;
    const cur = tally.get(sub) ?? { right: 0, total: 0 };
    cur.total++;
    if (h.correct) cur.right++;
    tally.set(sub, cur);
  }
  return [...tally.entries()]
    .map(([sub, v]) => ({ subObjective: sub, acc: v.right / v.total, n: v.total }))
    .filter((e) => e.n >= 2 && e.acc < 0.8)
    .sort((a, b) => a.acc - b.acc)
    .slice(0, limit);
}
