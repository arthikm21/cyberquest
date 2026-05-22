import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { DOMAINS } from '../content/domains';
import { tipForDay } from '../content/tips';
import { QUESTIONS } from '../content/questions';
import { FLASHCARDS } from '../content/flashcards';
import { levelFor, levelProgress } from '../lib/levels';
import { BADGES, BADGE_BY_ID } from '../lib/badges';
import { lazy, Suspense, useMemo, useState } from 'react';
import { Flame, Sparkles, Target, Zap, Layers, Wrench, TrendingUp } from 'lucide-react';

const ExamTrend = lazy(() => import('../components/ExamTrend'));

const FAKE_LEADERBOARD = [
  { name: 'NullPointer', xp: 9200, avatar: '🥷' },
  { name: 'PacketWolf', xp: 7400, avatar: '🐺' },
  { name: 'ByteForge', xp: 5800, avatar: '🦅' },
  { name: 'HashHunter', xp: 4100, avatar: '🦊' },
  { name: 'CipherFox', xp: 2900, avatar: '🐉' },
  { name: 'PortScanner', xp: 2100, avatar: '🦂' },
  { name: 'CryptoKid', xp: 1500, avatar: '👾' },
  { name: 'RootCause', xp: 900, avatar: '🤖' },
  { name: 'PingMaster', xp: 400, avatar: '🧙' },
];

function DomainCard({ id, title, short, emoji, color, progress, locked }: { id: string; title: string; short: string; emoji: string; color: string; progress: number; locked: boolean }) {
  return (
    <Link
      to={locked ? '#' : `/learn/${id}`}
      className={
        'card relative overflow-hidden block transition-all ' +
        (locked ? 'opacity-60 cursor-not-allowed' : 'hover:scale-[1.02] hover:shadow-neon')
      }
      aria-disabled={locked}
      onClick={(e) => locked && e.preventDefault()}
    >
      <div className="absolute right-3 top-3 text-3xl">{emoji}</div>
      <div className="text-xs text-text-secondary">{id}</div>
      <h3 className="text-lg font-bold mt-1">{title}</h3>
      <p className="text-sm text-text-secondary mt-1 pr-8">{short}</p>
      <div className="mt-4 h-2 bg-surface rounded-full overflow-hidden">
        <div className="h-full" style={{ width: `${Math.round(progress * 100)}%`, background: color }} />
      </div>
      <div className="flex justify-between mt-1 text-xs text-text-secondary">
        <span>{Math.round(progress * 100)}%</span>
        <span>{locked ? '🔒 Locked' : 'Open'}</span>
      </div>
    </Link>
  );
}

export default function Dashboard() {
  const xp = useStore((s) => s.xp);
  const username = useStore((s) => s.username);
  const avatar = useStore((s) => s.avatar);
  const streak = useStore((s) => s.streak);
  const domainProgress = useStore((s) => s.domainProgress);
  const badges = useStore((s) => s.badges);
  const daily = useStore((s) => s.dailyChallenge);
  const setDaily = useStore((s) => s.setDailyChallenge);
  const addXP = useStore((s) => s.addXP);
  const recordQuiz = useStore((s) => s.recordQuizAnswer);
  const srs = useStore((s) => s.srs);
  const remediation = useStore((s) => s.remediation);
  const examAttempts = useStore((s) => s.examAttempts);
  const diagnostic = useStore((s) => s.diagnosticResult);
  const lvl = levelFor(xp);
  const lp = levelProgress(xp);
  const nav = useNavigate();

  const { dueCount, newCount } = useMemo(() => {
    const now = Date.now();
    let due = 0;
    let fresh = 0;
    for (const c of FLASHCARDS) {
      const s = srs[c.id];
      if (!s) fresh++;
      else if (new Date(s.due).getTime() <= now) due++;
    }
    return { dueCount: due, newCount: fresh };
  }, [srs]);

  const today = new Date().toISOString().slice(0, 10);
  const dailyPool = useMemo(() => QUESTIONS.filter((q) => q.type !== 'multi'), []);
  const dailyQ = useMemo(() => {
    if (daily?.dateISO === today) {
      const found = QUESTIONS.find((q) => q.id === daily.questionId);
      if (found) return found;
    }
    const idx = Math.floor((Date.now() / 86400000)) % dailyPool.length;
    return dailyPool[idx];
  }, [daily, today, dailyPool]);

  const isDailyCorrect = (i: number) => {
    if (Array.isArray(dailyQ.correct)) return dailyQ.correct.includes(i);
    return dailyQ.correct === i;
  };

  if (!daily || daily.dateISO !== today) {
    setDaily({ dateISO: today, questionId: dailyQ.id, done: false });
  }

  const [picked, setPicked] = useState<number | null>(null);

  function answerDaily(i: number) {
    if (daily?.done) return;
    setPicked(i);
    const correct = isDailyCorrect(i);
    recordQuiz({ id: dailyQ.id, correct, domain: dailyQ.domain });
    setDaily({ dateISO: today, questionId: dailyQ.id, done: true, correct });
    if (correct) addXP(100);
    else addXP(10);
  }

  const leaderboard = [...FAKE_LEADERBOARD, { name: username || 'You', xp, avatar, isYou: true as const }]
    .sort((a, b) => b.xp - a.xp)
    .slice(0, 6);

  const recentBadges = badges.slice(-4).map((b) => BADGE_BY_ID[b]).filter(Boolean);

  // domain unlock: D1 always, next unlocks at 70% prior
  function isLocked(i: number) {
    if (i === 0) return false;
    const prev = DOMAINS[i - 1].id as keyof typeof domainProgress;
    return domainProgress[prev] < 0.7;
  }

  return (
    <div className="space-y-6">
      {/* hero */}
      <section className="relative overflow-hidden rounded-3xl border border-border/60 glass p-6 sm:p-10">
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
        <div className="absolute -right-10 -top-10 w-64 h-64 rounded-full blur-3xl opacity-30" style={{ background: 'radial-gradient(circle, #00d4ff, transparent 70%)' }} />
        <div className="absolute -left-10 -bottom-10 w-64 h-64 rounded-full blur-3xl opacity-30" style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)' }} />
        <div className="relative">
          <div className="text-xs uppercase tracking-widest text-text-secondary">CyberQuest</div>
          <h1 className="text-3xl sm:text-5xl font-extrabold mt-1 leading-tight">
            <span className="gradient-text">Become a Certified Cyber Guardian</span>
          </h1>
          <p className="text-text-secondary mt-3 max-w-2xl">
            Master the ISC2 Certified in Cybersecurity body of knowledge through story missions, quizzes, mini-games, and spaced-repetition flashcards.
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            <Link to="/learn/D1" className="btn-primary"><Sparkles size={18} /> Continue Learning</Link>
            <Link to="/story/ch1" className="btn-secondary"><Target size={18} /> Play Story Mode</Link>
            <Link to="/exam" className="btn-ghost"><Zap size={18} /> Exam Sim</Link>
          </div>
        </div>
      </section>

      {/* player + daily */}
      <section className="grid md:grid-cols-3 gap-4">
        <div className="card md:col-span-1">
          <div className="flex items-center gap-3">
            <div className="text-5xl">{avatar}</div>
            <div>
              <div className="text-xs text-text-secondary">Operator</div>
              <div className="text-xl font-bold">{username || 'Recruit'}</div>
              <div className="text-xs text-accent1 font-mono">{lvl.name}</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-text-secondary">
              <span>{xp} XP</span>
              <span>{lp.toXp ? `${lp.toXp} XP next` : 'MAX'}</span>
            </div>
            <div className="h-2 bg-surface rounded-full overflow-hidden mt-1">
              <div className="h-full bg-gradient-to-r from-accent1 to-accent2" style={{ width: `${Math.round(lp.pct * 100)}%` }} />
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <div className="flex-1 bg-surface/60 rounded-lg p-2 text-center">
              <Flame size={18} className="text-warning mx-auto" />
              <div className="text-xs text-text-secondary">Streak</div>
              <div className="font-bold">{streak.count}d</div>
            </div>
            <div className="flex-1 bg-surface/60 rounded-lg p-2 text-center">
              <div className="text-lg">🏅</div>
              <div className="text-xs text-text-secondary">Badges</div>
              <div className="font-bold">{badges.length}/{BADGES.length}</div>
            </div>
          </div>
          <Link
            to="/flashcards"
            className={
              'mt-3 flex items-center gap-2 rounded-lg p-2 border transition-all ' +
              (dueCount > 0
                ? 'border-accent1/60 bg-accent1/10 hover:shadow-neon'
                : 'border-border bg-surface/40')
            }
            aria-label="Open flashcards review"
          >
            <Layers size={20} className={dueCount > 0 ? 'text-accent1' : 'text-text-secondary'} />
            <div className="flex-1 text-left">
              <div className="text-xs text-text-secondary">Today's review</div>
              <div className="text-sm">
                <span className={dueCount > 0 ? 'text-accent1 font-bold' : 'text-text-secondary'}>{dueCount} due</span>
                <span className="text-text-secondary"> · {newCount} new</span>
              </div>
            </div>
            <span className="text-accent1 text-sm">→</span>
          </Link>
          {Object.keys(remediation).length > 0 && (
            <Link
              to="/quiz/remediation"
              className="mt-2 flex items-center gap-2 rounded-lg p-2 border border-warning/60 bg-warning/10 hover:shadow-neon-purple transition-all"
              aria-label="Open remediation quiz"
            >
              <Wrench size={20} className="text-warning" />
              <div className="flex-1 text-left">
                <div className="text-xs text-text-secondary">Re-drill queue</div>
                <div className="text-sm text-warning font-bold">{Object.keys(remediation).length} to re-drill</div>
              </div>
              <span className="text-warning text-sm">→</span>
            </Link>
          )}
        </div>

        <div className="card md:col-span-2">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs text-text-secondary uppercase tracking-wide">Daily Challenge</div>
              <h3 className="text-lg font-bold">{dailyQ.question}</h3>
            </div>
            <div className="text-warning text-sm font-mono">+100 XP</div>
          </div>
          <div className="grid sm:grid-cols-2 gap-2 mt-3">
            {dailyQ.options.map((opt, i) => {
              const done = daily?.done;
              const correct = isDailyCorrect(i);
              const isPicked = picked === i;
              const cls = !done
                ? 'border-border hover:border-accent1'
                : correct
                ? 'border-success bg-success/10'
                : isPicked
                ? 'border-danger bg-danger/10'
                : 'border-border opacity-60';
              return (
                <button
                  key={i}
                  className={'text-left px-3 py-2 rounded-lg border transition-colors ' + cls}
                  onClick={() => answerDaily(i)}
                  disabled={done}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          {daily?.done && (
            <p className={'mt-3 text-sm ' + (daily.correct ? 'text-success' : 'text-danger')}>
              {daily.correct ? '✓ Correct.' : '✗ Not quite.'} {dailyQ.explanation.why_correct}
            </p>
          )}
        </div>
      </section>

      {/* diagnostic nudge (only when no result yet) */}
      {!diagnostic && (
        <Link
          to="/diagnostic"
          className="card flex items-center gap-3 hover:shadow-neon transition-all border-accent1/40 !bg-accent1/5"
        >
          <Sparkles size={24} className="text-accent1 shrink-0" />
          <div className="flex-1">
            <div className="font-bold">Run the 30-question diagnostic</div>
            <div className="text-sm text-text-secondary">10–15 minutes. We'll measure your starting accuracy per domain and build a 4-week adaptive study plan.</div>
          </div>
          <span className="text-accent1">→</span>
        </Link>
      )}

      {/* exam trend (only when data exists) */}
      {examAttempts.length > 0 && (
        <section className="card">
          <div className="flex items-start justify-between">
            <div>
              <div className="inline-flex items-center gap-2 text-xs text-text-secondary uppercase tracking-wide">
                <TrendingUp size={14} /> Exam scaled-score trend
              </div>
              <h3 className="text-lg font-bold mt-1">Last {Math.min(10, examAttempts.length)} mock{examAttempts.length === 1 ? '' : 's'}</h3>
              <p className="text-xs text-text-secondary">Pass line at 700. Aim for ≥ 900 consistently before the real exam.</p>
            </div>
            <Link to="/exam" className="btn-secondary !min-h-0 !py-1 text-sm">New attempt →</Link>
          </div>
          <div className="mt-3">
            <Suspense fallback={<div className="h-[180px] flex items-center justify-center text-text-secondary text-sm">Loading trend…</div>}>
              <ExamTrend attempts={examAttempts} />
            </Suspense>
          </div>
        </section>
      )}

      {/* domains */}
      <section>
        <h2 className="text-xl font-bold mb-3">Domains</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DOMAINS.map((d, i) => (
            <DomainCard
              key={d.id}
              id={d.id}
              title={d.title}
              short={d.short}
              emoji={d.emoji}
              color={d.color}
              progress={domainProgress[d.id]}
              locked={isLocked(i)}
            />
          ))}
        </div>
      </section>

      {/* leaderboard + badges + tip */}
      <section className="grid md:grid-cols-3 gap-4">
        <div className="card">
          <h3 className="font-bold mb-2">Leaderboard</h3>
          <ol className="space-y-2">
            {leaderboard.map((p, i) => (
              <li
                key={p.name + i}
                className={
                  'flex items-center gap-3 rounded-lg px-2 py-1 ' +
                  ('isYou' in p ? 'bg-accent1/10 border border-accent1/40' : '')
                }
              >
                <span className="font-mono text-xs text-text-secondary w-5">{i + 1}.</span>
                <span className="text-xl">{p.avatar}</span>
                <span className="flex-1 truncate">{p.name}</span>
                <span className="font-mono text-sm">{p.xp.toLocaleString()}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="card">
          <h3 className="font-bold mb-2">Recent Badges</h3>
          {recentBadges.length === 0 && <p className="text-sm text-text-secondary">None yet — earn one by completing a quiz!</p>}
          <div className="grid grid-cols-4 gap-2 mt-2">
            {recentBadges.map((b) => (
              <div key={b.id} className="text-center bg-surface/60 rounded-lg p-2">
                <div className="text-3xl">{b.emoji}</div>
                <div className="text-[10px] text-text-secondary mt-1 leading-tight">{b.name}</div>
              </div>
            ))}
          </div>
          <Link to="/achievements" className="text-xs text-accent1 mt-3 inline-block">View all →</Link>
        </div>

        <div className="card">
          <h3 className="font-bold mb-2">Tip of the Day</h3>
          <p className="text-sm text-text-secondary">{tipForDay()}</p>
          <button
            className="btn-secondary mt-4 w-full"
            onClick={() => nav('/quiz/practice')}
          >
            Practice now
          </button>
        </div>
      </section>
    </div>
  );
}
