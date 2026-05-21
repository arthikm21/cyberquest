import { Link } from 'react-router-dom';
import { Clock, BookOpen, Trophy } from 'lucide-react';

const MODES = [
  { id: 'practice', icon: BookOpen, name: 'Practice', desc: 'Untimed, with instant explanations and hints.', color: '#00d4ff' },
  { id: 'timed', icon: Clock, name: 'Timed Sprint', desc: '30s per question. Speed bonus XP.', color: '#f59e0b' },
  { id: 'exam', icon: Trophy, name: 'Exam Sim', desc: '75 questions, 3-hour timer. No feedback until end.', color: '#7c3aed' },
];

export default function Quiz() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-extrabold gradient-text">Quizzes</h1>
        <p className="text-text-secondary">Active recall is the highest-leverage study you can do. Pick a mode.</p>
      </header>

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
