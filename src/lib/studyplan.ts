import { DOMAINS } from '../content/domains';
import { DomainId, StudyPlan, StudyPlanDay } from './storage';

function isoDay(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/**
 * Rank domains by weakness. Returns DomainIds ordered worst → best.
 * Domains with accuracy < 70% are "weak"; the rest are "fluent".
 */
export function rankByWeakness(perDomain: Record<DomainId, number>): DomainId[] {
  const entries: { d: DomainId; acc: number }[] = (Object.keys(perDomain) as DomainId[]).map((d) => ({ d, acc: perDomain[d] }));
  entries.sort((a, b) => a.acc - b.acc);
  return entries.map((e) => e.d);
}

/**
 * Distribute the 28 study days across domains weighted by weakness.
 * Weakest domain gets the most days; fluent (>= 70%) domains get at most 1 day for review.
 */
function distributeDays(perDomain: Record<DomainId, number>): DomainId[] {
  const ordered = rankByWeakness(perDomain);
  const weak = ordered.filter((d) => perDomain[d] < 0.7);
  const fluent = ordered.filter((d) => perDomain[d] >= 0.7);

  const days: DomainId[] = [];
  if (weak.length === 0) {
    // All fluent — even rotation
    while (days.length < 28) {
      for (const d of ordered) {
        if (days.length >= 28) break;
        days.push(d);
      }
    }
    return days;
  }

  // Weight each weak domain by gap to 70%; weights sum to 1.
  const gaps = weak.map((d) => Math.max(0.01, 0.7 - perDomain[d]));
  const gapSum = gaps.reduce((a, b) => a + b, 0);
  // Reserve up to 5 days total for fluent domain review; rest goes to weak.
  const fluentDayBudget = Math.min(fluent.length * 2, 5);
  const weakDays = 28 - fluentDayBudget;

  const allocations = weak.map((_, i) => Math.round((gaps[i] / gapSum) * weakDays));
  // Rounding can over/undershoot; fix by distributing remainder.
  let diff = weakDays - allocations.reduce((a, b) => a + b, 0);
  for (let i = 0; diff !== 0 && i < 100; i++) {
    const idx = i % allocations.length;
    if (diff > 0) { allocations[idx]++; diff--; } else if (allocations[idx] > 0) { allocations[idx]--; diff++; }
  }

  // Interleave allocations to spread weakest first but not stack 14 days in a row.
  const queues: DomainId[][] = weak.map((d, i) => Array(allocations[i]).fill(d));
  while (queues.some((q) => q.length > 0)) {
    for (const q of queues) {
      if (q.length > 0) days.push(q.shift()!);
      if (days.length >= weakDays) break;
    }
  }
  // Append fluent review days at end of plan.
  let f = 0;
  while (days.length < 28 && fluent.length > 0) {
    days.push(fluent[f % fluent.length]);
    f++;
  }
  while (days.length < 28) days.push(ordered[0]); // safety pad
  return days.slice(0, 28);
}

export function generateStudyPlan(opts: {
  perDomain: Record<DomainId, number>;
  hoursPerWeek: number;
  startISO?: string;
}): StudyPlan {
  const start = opts.startISO ? new Date(opts.startISO + 'T00:00:00') : new Date();
  const startISO = isoDay(start);
  const focusByDay = distributeDays(opts.perDomain);

  const moduleCursor: Record<DomainId, number> = { D1: 0, D2: 0, D3: 0, D4: 0, D5: 0 };
  const days: StudyPlanDay[] = focusByDay.map((focus, i) => {
    const dom = DOMAINS.find((d) => d.id === focus);
    const mod = dom?.modules[moduleCursor[focus] % (dom.modules.length || 1)];
    moduleCursor[focus] = (moduleCursor[focus] || 0) + 1;
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    // Quiz items per day scales with hoursPerWeek/7; default ~5–8.
    const perDay = Math.max(3, Math.min(15, Math.round((opts.hoursPerWeek * 60) / 7 / 6)));
    return {
      isoDate: isoDay(date),
      focusDomain: focus,
      lessonModuleId: mod?.id,
      quizCount: perDay,
      cardCount: Math.max(10, perDay * 2),
      done: false,
    };
  });

  return {
    id: 'plan_' + Date.now().toString(36),
    createdAt: Date.now(),
    startISO,
    weeks: 4,
    days,
    hoursPerWeek: opts.hoursPerWeek,
    baselineAccuracy: opts.perDomain,
  };
}

/**
 * Recompute the plan based on recent activity. Keeps marked-done days untouched
 * and reassigns focus + module for remaining days to match latest weakness ranking.
 */
export function recomputeStudyPlan(plan: StudyPlan, perDomain: Record<DomainId, number>): StudyPlan {
  const todayISO = isoDay(new Date());
  const focusByDay = distributeDays(perDomain);
  const moduleCursor: Record<DomainId, number> = { D1: 0, D2: 0, D3: 0, D4: 0, D5: 0 };
  const newDays = plan.days.map((d, i) => {
    if (d.done || d.isoDate < todayISO) return d;
    const focus = focusByDay[i] ?? d.focusDomain;
    const dom = DOMAINS.find((x) => x.id === focus);
    const mod = dom?.modules[moduleCursor[focus] % (dom.modules.length || 1)];
    moduleCursor[focus] = (moduleCursor[focus] || 0) + 1;
    return { ...d, focusDomain: focus, lessonModuleId: mod?.id };
  });
  return { ...plan, days: newDays, lastRecomputeISO: todayISO };
}

/** Accuracy per domain from quiz history (subset of the persisted log). */
export function accuracyFromHistory(
  history: { domain: DomainId; correct: boolean; ts: number }[],
  sinceTs: number,
): Record<DomainId, number> {
  const tally: Record<DomainId, { right: number; total: number }> = {
    D1: { right: 0, total: 0 }, D2: { right: 0, total: 0 }, D3: { right: 0, total: 0 },
    D4: { right: 0, total: 0 }, D5: { right: 0, total: 0 },
  };
  for (const h of history) {
    if (h.ts < sinceTs) continue;
    tally[h.domain].total++;
    if (h.correct) tally[h.domain].right++;
  }
  const out: Record<DomainId, number> = { D1: 0.7, D2: 0.7, D3: 0.7, D4: 0.7, D5: 0.7 };
  for (const d of Object.keys(tally) as DomainId[]) {
    if (tally[d].total > 0) out[d] = tally[d].right / tally[d].total;
  }
  return out;
}
