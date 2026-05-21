export type LevelInfo = { name: string; min: number; next: number | null };

const LEVELS: { name: string; min: number }[] = [
  { name: 'Recruit', min: 0 },
  { name: 'Analyst', min: 500 },
  { name: 'Specialist', min: 1500 },
  { name: 'Engineer', min: 3000 },
  { name: 'Architect', min: 6000 },
  { name: 'CISO', min: 10000 },
];

export function levelFor(xp: number): LevelInfo {
  let cur = LEVELS[0];
  let next: number | null = LEVELS[1].min;
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].min) {
      cur = LEVELS[i];
      next = i + 1 < LEVELS.length ? LEVELS[i + 1].min : null;
    }
  }
  return { name: cur.name, min: cur.min, next };
}

export function levelProgress(xp: number) {
  const l = levelFor(xp);
  if (l.next === null) return { pct: 1, fromXp: l.min, toXp: l.min, current: xp };
  const range = l.next - l.min;
  const into = xp - l.min;
  return { pct: Math.max(0, Math.min(1, into / range)), fromXp: l.min, toXp: l.next, current: xp };
}
