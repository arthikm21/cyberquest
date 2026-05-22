import { lazy, Suspense, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useStore } from './store';
import { Onboarding } from './components/Onboarding';
import { Modal } from './components/Modal';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Story = lazy(() => import('./pages/Story'));
const StoryChapter = lazy(() => import('./pages/StoryChapter'));
const Learn = lazy(() => import('./pages/Learn'));
const LearnDomain = lazy(() => import('./pages/LearnDomain'));
const Explainers = lazy(() => import('./pages/Explainers'));
const Flashcards = lazy(() => import('./pages/Flashcards'));
const Quiz = lazy(() => import('./pages/Quiz'));
const QuizRunner = lazy(() => import('./pages/QuizRunner'));
const Games = lazy(() => import('./pages/Games'));
const GameRunner = lazy(() => import('./pages/GameRunner'));
const Exam = lazy(() => import('./pages/Exam'));
const Glossary = lazy(() => import('./pages/Glossary'));
const StudyPlan = lazy(() => import('./pages/StudyPlan'));
const Diagnostic = lazy(() => import('./pages/Diagnostic'));
const Achievements = lazy(() => import('./pages/Achievements'));
const Settings = lazy(() => import('./pages/Settings'));

function LoadingShell() {
  return (
    <div className="p-10 text-center text-text-secondary animate-pulse">Loading…</div>
  );
}

function SignInModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="Sign in (coming soon)">
      <p className="text-text-secondary">
        Cross-device sync is on the way. For now, your progress is securely saved on this browser.
      </p>
      <p className="text-text-secondary mt-2 text-sm">
        When sign-in launches, your current progress will attach to your account — nothing lost.
      </p>
      <div className="flex justify-end mt-5">
        <button className="btn-primary" onClick={onClose}>Got it</button>
      </div>
    </Modal>
  );
}

export default function App() {
  const hydrated = useStore((s) => s._hydrated);
  const username = useStore((s) => s.username);
  const registerActivity = useStore((s) => s.registerActivity);
  const reducedMotion = useStore((s) => s.settings.reducedMotion);
  const [signInOpen, setSignInOpen] = useState(false);

  useEffect(() => {
    if (hydrated && username) registerActivity();
  }, [hydrated, username, registerActivity]);

  useEffect(() => {
    if (reducedMotion) document.documentElement.classList.add('motion-reduce');
    else document.documentElement.classList.remove('motion-reduce');
  }, [reducedMotion]);

  if (!hydrated) return <LoadingShell />;
  const needsOnboarding = !username;

  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<Layout onOpenSignIn={() => setSignInOpen(true)} />}>
          <Route
            index
            element={
              <Suspense fallback={<LoadingShell />}>
                <Dashboard />
              </Suspense>
            }
          />
          <Route path="story" element={<Suspense fallback={<LoadingShell />}><Story /></Suspense>} />
          <Route path="story/:id" element={<Suspense fallback={<LoadingShell />}><StoryChapter /></Suspense>} />
          <Route path="learn" element={<Suspense fallback={<LoadingShell />}><Learn /></Suspense>} />
          <Route path="learn/:id" element={<Suspense fallback={<LoadingShell />}><LearnDomain /></Suspense>} />
          <Route path="explainers" element={<Suspense fallback={<LoadingShell />}><Explainers /></Suspense>} />
          <Route path="flashcards" element={<Suspense fallback={<LoadingShell />}><Flashcards /></Suspense>} />
          <Route path="quiz" element={<Suspense fallback={<LoadingShell />}><Quiz /></Suspense>} />
          <Route path="quiz/:mode" element={<Suspense fallback={<LoadingShell />}><QuizRunner /></Suspense>} />
          <Route path="games" element={<Suspense fallback={<LoadingShell />}><Games /></Suspense>} />
          <Route path="games/:id" element={<Suspense fallback={<LoadingShell />}><GameRunner /></Suspense>} />
          <Route path="exam" element={<Suspense fallback={<LoadingShell />}><Exam /></Suspense>} />
          <Route path="glossary" element={<Suspense fallback={<LoadingShell />}><Glossary /></Suspense>} />
          <Route path="study-plan" element={<Suspense fallback={<LoadingShell />}><StudyPlan /></Suspense>} />
          <Route path="diagnostic" element={<Suspense fallback={<LoadingShell />}><Diagnostic /></Suspense>} />
          <Route path="achievements" element={<Suspense fallback={<LoadingShell />}><Achievements /></Suspense>} />
          <Route path="settings" element={<Suspense fallback={<LoadingShell />}><Settings /></Suspense>} />
          <Route path="*" element={<div className="p-10 text-center"><h2 className="text-2xl font-bold mb-2">404</h2><p className="text-text-secondary">Page not found.</p></div>} />
        </Route>
      </Routes>
      {needsOnboarding && <Onboarding onDone={() => {}} />}
      <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} />
    </ErrorBoundary>
  );
}
