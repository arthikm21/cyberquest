import { useState } from 'react';
import { useStore } from '../store';
import { Modal } from './Modal';

const AVATARS = ['🛡️', '🦊', '🐺', '🦅', '🐉', '🦂', '🤖', '👾', '🧙', '🥷'];

export function Onboarding({ onDone }: { onDone: () => void }) {
  const setUsername = useStore((s) => s.setUsername);
  const setAvatar = useStore((s) => s.setAvatar);
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [avatar, setLocalAvatar] = useState('🛡️');

  const next = () => {
    if (step === 0) {
      if (!name.trim()) return;
      setUsername(name.trim());
      setAvatar(avatar);
    }
    if (step === 3) {
      onDone();
      return;
    }
    setStep((s) => s + 1);
  };

  return (
    <Modal open={true} onClose={() => {}} title="Welcome to CyberQuest" wide>
      {step === 0 && (
        <div className="space-y-4">
          <p className="text-text-secondary">Pick a callsign and an avatar. Your progress saves on this browser.</p>
          <div>
            <label className="text-sm text-text-secondary">Callsign</label>
            <input
              className="input w-full mt-1"
              value={name}
              maxLength={24}
              autoFocus
              placeholder="e.g. RogueByte"
              onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z0-9_\- ]/g, ''))}
            />
          </div>
          <div>
            <label className="text-sm text-text-secondary">Avatar</label>
            <div className="grid grid-cols-5 gap-2 mt-2">
              {AVATARS.map((a) => (
                <button
                  key={a}
                  className={
                    'text-3xl py-3 rounded-lg border transition-all ' +
                    (avatar === a ? 'border-accent1 bg-accent1/10 shadow-neon' : 'border-border hover:border-accent1/60')
                  }
                  onClick={() => setLocalAvatar(a)}
                  aria-label={`Avatar ${a}`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {step === 1 && (
        <div className="space-y-3">
          <h3 className="text-xl font-bold gradient-text">Tour 1 / 3 — Learn</h3>
          <p className="text-text-secondary">5 domains cover the ISC2 CC body of knowledge. Modules unlock as you earn XP — start with Security Principles.</p>
        </div>
      )}
      {step === 2 && (
        <div className="space-y-3">
          <h3 className="text-xl font-bold gradient-text">Tour 2 / 3 — Practice</h3>
          <p className="text-text-secondary">Quizzes, flashcards (spaced repetition), and mini-games turn passive reading into active recall.</p>
        </div>
      )}
      {step === 3 && (
        <div className="space-y-3">
          <h3 className="text-xl font-bold gradient-text">Tour 3 / 3 — Prove it</h3>
          <p className="text-text-secondary">The Exam Simulator mirrors the real CC: 75 questions, 3-hour timer. Pass at 70%.</p>
        </div>
      )}
      <div className="flex justify-between mt-6">
        <button className="btn-ghost" onClick={() => step > 0 && setStep(step - 1)} disabled={step === 0}>Back</button>
        <button className="btn-primary" onClick={next} disabled={step === 0 && !name.trim()}>
          {step < 3 ? 'Next' : 'Enter the Quest'}
        </button>
      </div>
    </Modal>
  );
}
