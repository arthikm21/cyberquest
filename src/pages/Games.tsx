import { Link } from 'react-router-dom';
import { ShieldCheck, Layers3, Mail, Dices, KeyRound, Network } from 'lucide-react';

const GAMES = [
  { id: 'cia-defender', name: 'CIA Defender', desc: 'Tower-defense: match controls to threats.', icon: ShieldCheck, color: '#00d4ff' },
  { id: 'osi-stacker', name: 'OSI Stack Stacker', desc: 'Order the 7 OSI layers correctly. Beat the clock.', icon: Layers3, color: '#7c3aed' },
  { id: 'phishing-detective', name: 'Phishing Detective', desc: 'Spot the red flags in suspicious emails.', icon: Mail, color: '#f59e0b' },
  { id: 'risk-roulette', name: 'Risk Roulette', desc: 'Pick the right risk treatment for each scenario.', icon: Dices, color: '#10b981' },
  { id: 'password-fortress', name: 'Password Fortress', desc: 'Build a password strong enough to survive the waves.', icon: KeyRound, color: '#ef4444' },
  { id: 'topology', name: 'Network Topology Builder', desc: 'Wire up devices and audit the security posture.', icon: Network, color: '#00d4ff' },
];

export default function Games() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-extrabold gradient-text">Mini-Games</h1>
        <p className="text-text-secondary">2–5 minutes each. Each game teaches one piece of the CC body of knowledge.</p>
      </header>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {GAMES.map((g) => (
          <Link
            key={g.id}
            to={`/games/${g.id}`}
            className="card hover:shadow-neon hover:scale-[1.02] transition-all"
          >
            <g.icon size={28} style={{ color: g.color }} />
            <h2 className="text-lg font-bold mt-2">{g.name}</h2>
            <p className="text-sm text-text-secondary mt-1">{g.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
