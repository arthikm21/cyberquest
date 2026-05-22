/* Content validator — runs before vite build via npm prebuild hook.
 * Fails (exit 1) on:
 *   - Question.subObjective not in OBJECTIVE_BY_ID
 *   - Flashcard.subObjective (if set) not in OBJECTIVE_BY_ID
 *   - why_wrong.length !== options.length - (correct array length)
 *   - correct index out of range
 *   - type/correct mismatch (type='multi' must be number[], else must be number)
 *   - duplicate question or flashcard ids
 *   - empty why_correct
 *   - <2 options on any question
 */
import { QUESTIONS } from '../src/content/questions';
import { FLASHCARDS } from '../src/content/flashcards';
import { OBJECTIVE_BY_ID } from '../src/content/objectives';

const errors: string[] = [];

function check(cond: boolean, msg: string) {
  if (!cond) errors.push(msg);
}

// ---- Questions ----
const qIds = new Map<string, number>();
for (const q of QUESTIONS) {
  qIds.set(q.id, (qIds.get(q.id) ?? 0) + 1);

  check(!!OBJECTIVE_BY_ID[q.subObjective], `Q ${q.id}: unknown subObjective "${q.subObjective}"`);
  check(Array.isArray(q.options) && q.options.length >= 2, `Q ${q.id}: must have at least 2 options`);

  const correctArr = Array.isArray(q.correct) ? q.correct : [q.correct];
  for (const c of correctArr) {
    check(
      Number.isInteger(c) && c >= 0 && c < q.options.length,
      `Q ${q.id}: correct index ${c} out of range [0, ${q.options.length})`,
    );
  }

  if (q.type === 'multi') {
    check(Array.isArray(q.correct), `Q ${q.id}: type='multi' requires correct to be number[]`);
    check(correctArr.length >= 1, `Q ${q.id}: type='multi' must mark at least one correct option`);
  } else {
    check(!Array.isArray(q.correct), `Q ${q.id}: only type='multi' may use correct as number[]`);
  }

  const expectedWrong = q.options.length - correctArr.length;
  check(
    q.explanation.why_wrong.length === expectedWrong,
    `Q ${q.id}: why_wrong.length=${q.explanation.why_wrong.length} but expected ${expectedWrong} (options=${q.options.length}, correct=${correctArr.length})`,
  );

  check(
    typeof q.explanation.why_correct === 'string' && q.explanation.why_correct.trim().length > 0,
    `Q ${q.id}: why_correct is empty`,
  );

  for (let i = 0; i < q.explanation.why_wrong.length; i++) {
    const w = q.explanation.why_wrong[i];
    check(
      typeof w === 'string' && w.trim().length > 0,
      `Q ${q.id}: why_wrong[${i}] is empty`,
    );
  }
}
for (const [id, count] of qIds) {
  if (count > 1) errors.push(`Duplicate question id: ${id} (${count} occurrences)`);
}

// ---- Flashcards ----
const fIds = new Map<string, number>();
for (const f of FLASHCARDS) {
  fIds.set(f.id, (fIds.get(f.id) ?? 0) + 1);
  if (f.subObjective) {
    check(!!OBJECTIVE_BY_ID[f.subObjective], `Flashcard ${f.id}: unknown subObjective "${f.subObjective}"`);
  }
  check(typeof f.term === 'string' && f.term.trim().length > 0, `Flashcard ${f.id}: empty term`);
  check(typeof f.def === 'string' && f.def.trim().length > 0, `Flashcard ${f.id}: empty def`);
}
for (const [id, count] of fIds) {
  if (count > 1) errors.push(`Duplicate flashcard id: ${id} (${count} occurrences)`);
}

// ---- Report ----
if (errors.length > 0) {
  console.error(`\n❌ Content validation FAILED — ${errors.length} error(s):\n`);
  for (const e of errors) console.error(`  - ${e}`);
  console.error('');
  process.exit(1);
}

// summary
const byDomain: Record<string, number> = {};
for (const q of QUESTIONS) byDomain[q.domain] = (byDomain[q.domain] ?? 0) + 1;
console.log(`✅ Content validation OK`);
console.log(`   questions: ${QUESTIONS.length} total (${Object.entries(byDomain).map(([d, n]) => `${d}=${n}`).join(', ')})`);
console.log(`   flashcards: ${FLASHCARDS.length}`);
console.log(`   objectives referenced: ${new Set(QUESTIONS.map((q) => q.subObjective)).size}`);
process.exit(0);
