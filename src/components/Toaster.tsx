import { useStore } from '../store';

export function Toaster() {
  const toasts = useStore((s) => s._toasts);
  return (
    <div className="fixed top-3 right-3 z-50 flex flex-col gap-2 max-w-[90vw]" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={
            'glass rounded-lg px-4 py-3 text-sm shadow-neon border ' +
            (t.tone === 'good'
              ? 'border-success/60'
              : t.tone === 'bad'
              ? 'border-danger/60'
              : 'border-accent1/60')
          }
        >
          {t.msg}
        </div>
      ))}
    </div>
  );
}

export function XpFloaters() {
  const floats = useStore((s) => s._xpFloats);
  return (
    <>
      {floats.map((f) => (
        <div
          key={f.id}
          className="xp-floater animate-float-up"
          style={{ left: f.x, top: f.y }}
        >
          {f.amount > 0 ? `+${f.amount}` : f.amount} XP
        </div>
      ))}
    </>
  );
}
