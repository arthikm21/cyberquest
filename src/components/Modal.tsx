import { ReactNode, useEffect } from 'react';

export function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title?: string; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={'glass rounded-2xl border border-border w-full ' + (wide ? 'max-w-2xl' : 'max-w-md')}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="px-5 py-4 border-b border-border/60">
            <h2 className="text-lg font-bold">{title}</h2>
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
