import { Link } from 'react-router-dom';
import { Clock, BookOpen, Trophy, Wrench } from 'lucide-react';
import { useStore } from '../store';

const MODES = [
  { id: 'practice', icon: BookOpen, name: 'Practice', desc: 'Untimed, with instant explanations and hints.', color: '#00d4ff' },
  { id: 'timed', icon: Clock, name: 'Timed Sprint', desc: '30s per question. Speed bonus XP.', color: '#f59e0b' },
  { id: 'exam', icon: Trophy, name: 'Exam Sim', desc: '75 questions, 3-hour timer. No feedback until end.', color: '#7c3aed' },
];

export default function Quiz() {
  const remediation = useStore((s) => s.remediation);
  const remediationCount = Object.keys(remediation).length;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-extrabold gradient-text">Quizzes</h1>
        <p className="text-text-secondary">Active recall is the highest-leverage study you can do. Pick a mode.</p>
      </header>

      {remediationCount > 0 && (
        <Link
          to="/quiz/remediation"
          className="card hover:shadow-neon hover:scale-[1.01] transition-all block border-warning/40 !bg-warning/5"
        >
          <div className="flex items-start gap-3">
            <Wrench size={28} className="text-warning shrink-0" />
            <div>
              <h2 className="text-lg font-bold">Re-drill missed material</h2>
              <p className="text-sm text-text-secondary mt-1">
                <span className="text-warning font-semibold">{remediationCount}</span> item{remediationCount === 1 ? '' : 's'} to re-drill.
                Each item graduates from the queue after 3 correct answers across different sessions.
              </p>
            </div>
          </div>
        </Link>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {MODES.map((m) => (
          <Link
            key={m.id}
            to={m.id === 'exam' ? '/exam' : `/quiz/${m.id}`}
            className="card hover:shadow-neon hover:scale-[1.02] transition-all block"
          >
            <m.icon size={28} style={{ color: m.color }} />
            <h2 className="text-lg font-bold mt-2">{m.name}</h2>
            <p className="text-sm text-text-secondary mt-1">{m.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
