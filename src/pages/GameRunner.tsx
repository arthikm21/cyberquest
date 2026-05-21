import { lazy, Suspense } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const CIA = lazy(() => import('../games/CIADefender'));
const OSI = lazy(() => import('../games/OSIStacker'));
const Phish = lazy(() => import('../games/PhishingDetective'));
const Risk = lazy(() => import('../games/RiskRoulette'));
const Pass = lazy(() => import('../games/PasswordFortress'));
const Topo = lazy(() => import('../games/TopologyBuilder'));

const MAP: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  'cia-defender': CIA,
  'osi-stacker': OSI,
  'phishing-detective': Phish,
  'risk-roulette': Risk,
  'password-fortress': Pass,
  'topology': Topo,
};

export default function GameRunner() {
  const { id } = useParams<{ id: string }>();
  const G = id ? MAP[id] : undefined;
  if (!G) return <div className="card">Unknown game.</div>;
  return (
    <div className="space-y-4">
      <Link to="/games" className="inline-flex items-center text-sm text-text-secondary hover:text-accent1"><ChevronLeft size={16} /> Back to games</Link>
      <Suspense fallback={<div className="text-text-secondary">Loading game…</div>}>
        <G />
      </Suspense>
    </div>
  );
}
