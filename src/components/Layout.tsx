import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  Home, BookOpen, GraduationCap, Brain, Layers, HelpCircle,
  Gamepad2, FileCheck, Library, Calendar, Trophy, Settings, LogIn, Menu, X, Flame,
} from 'lucide-react';
import { useStore } from '../store';
import { levelFor, levelProgress } from '../lib/levels';
import { Toaster, XpFloaters } from './Toaster';
import { useState } from 'react';

const NAV = [
  { to: '/', label: 'Dashboard', icon: Home },
  { to: '/story', label: 'Story Mode', icon: BookOpen },
  { to: '/learn', label: 'Learn', icon: GraduationCap },
  { to: '/explainers', label: 'Visual Explainers', icon: Brain },
  { to: '/flashcards', label: 'Flashcards', icon: Layers },
  { to: '/quiz', label: 'Quizzes', icon: HelpCircle },
  { to: '/games', label: 'Mini-Games', icon: Gamepad2 },
  { to: '/exam', label: 'Exam Simulator', icon: FileCheck },
  { to: '/glossary', label: 'Glossary', icon: Library },
  { to: '/study-plan', label: 'Study Plan', icon: Calendar },
  { to: '/achievements', label: 'Achievements', icon: Trophy },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function Layout({ onOpenSignIn }: { onOpenSignIn: () => void }) {
  const xp = useStore((s) => s.xp);
  const streak = useStore((s) => s.streak);
  const username = useStore((s) => s.username);
  const avatar = useStore((s) => s.avatar);
  const lvl = levelFor(xp);
  const lp = levelProgress(xp);
  const [mobileOpen, setMobileOpen] = useState(false);
  const loc = useLocation();

  // close drawer on nav
  if (mobileOpen && loc.pathname) {
    // noop; handled via onClick
  }

  return (
    <div className="min-h-screen bg-grid">
      <XpFloaters />
      <Toaster />

      {/* top bar */}
      <header className="sticky top-0 z-30 glass border-b border-border/60">
        <div className="flex items-center gap-3 px-3 sm:px-5 py-3">
          <button
            className="md:hidden btn-ghost !min-h-0 !p-2"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <NavLink to="/" className="flex items-center gap-2 font-extrabold text-lg">
            <span className="text-2xl">🛡️</span>
            <span className="gradient-text hidden sm:inline">CyberQuest</span>
          </NavLink>
          <div className="flex-1" />
          <div className="hidden sm:flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-text-secondary leading-3">{lvl.name}</div>
              <div className="text-sm font-mono">{xp} XP</div>
            </div>
            <div className="w-28 h-2 bg-surface rounded-full overflow-hidden border border-border">
              <div
                className="h-full bg-gradient-to-r from-accent1 to-accent2"
                style={{ width: `${Math.round(lp.pct * 100)}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-surface/60 border border-border">
            <Flame size={16} className="text-warning" />
            <span className="font-mono text-sm">{streak.count}</span>
          </div>
          <button className="btn-secondary !min-h-0 !py-1 !px-3 text-sm" onClick={onOpenSignIn}>
            <LogIn size={16} /> Sign In
          </button>
          <NavLink to="/settings" className="text-2xl" aria-label="Open profile">{avatar || '🛡️'}</NavLink>
        </div>
      </header>

      <div className="flex">
        {/* desktop sidebar */}
        <aside className="hidden md:block w-60 shrink-0 border-r border-border/60 sticky top-[60px] h-[calc(100vh-60px)] overflow-y-auto">
          <nav className="p-3 space-y-1">
            {NAV.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ' +
                  (isActive
                    ? 'bg-accent1/10 text-accent1 border border-accent1/30 shadow-neon'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface/60')
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="p-3 text-xs text-text-secondary border-t border-border/60">
            <div>Welcome, <span className="text-text-primary">{username || 'Recruit'}</span></div>
            <div className="mt-1">v0.1 · Browser-saved progress</div>
          </div>
        </aside>

        {/* mobile drawer */}
        {mobileOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-bg/80 backdrop-blur" onClick={() => setMobileOpen(false)}>
            <nav className="absolute left-0 top-0 bottom-0 w-72 glass border-r border-border p-3 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold gradient-text">CyberQuest</span>
                <button className="btn-ghost !min-h-0 !p-1" onClick={() => setMobileOpen(false)}><X size={18} /></button>
              </div>
              {NAV.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm ' +
                    (isActive
                      ? 'bg-accent1/10 text-accent1 border border-accent1/30'
                      : 'text-text-secondary')
                  }
                >
                  <Icon size={18} />
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>
        )}

        <main id="main" className="flex-1 min-w-0 p-4 sm:p-6 max-w-[1400px] mx-auto w-full">
          <Outlet />
        </main>
      </div>

      <footer className="px-4 py-6 text-center text-xs text-text-secondary">
        Not affiliated with, endorsed by, or sponsored by (ISC)². CC, CISSP and related marks are trademarks of (ISC)². Progress is saved on this browser.
      </footer>
    </div>
  );
}
