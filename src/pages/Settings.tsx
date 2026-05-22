import { useRef, useState } from 'react';
import { useStore } from '../store';
import { downloadJSON, PersistedState, SCHEMA_VERSION } from '../lib/storage';

export default function Settings() {
  const username = useStore((s) => s.username);
  const avatar = useStore((s) => s.avatar);
  const setUsername = useStore((s) => s.setUsername);
  const setAvatar = useStore((s) => s.setAvatar);
  const settings = useStore((s) => s.settings);
  const setSetting = useStore((s) => s.setSetting);
  const reset = useStore((s) => s.reset);
  const importState = useStore((s) => s.importState);
  const pushToast = useStore((s) => s.pushToast);
  const fileRef = useRef<HTMLInputElement>(null);
  const [confirmingReset, setConfirmingReset] = useState(false);

  function onExport() {
    const s = useStore.getState();
    const persisted: PersistedState = {
      schemaVersion: s.schemaVersion,
      userId: s.userId,
      username: s.username,
      avatar: s.avatar,
      createdAtISO: s.createdAtISO,
      xp: s.xp,
      streak: s.streak,
      domainProgress: s.domainProgress,
      domainModulesDone: s.domainModulesDone,
      badges: s.badges,
      quizHistory: s.quizHistory,
      examBests: s.examBests,
      srs: s.srs,
      remediation: s.remediation,
      storyProgress: s.storyProgress,
      settings: s.settings,
      dailyChallenge: s.dailyChallenge,
    };
    downloadJSON(persisted);
    pushToast('Progress exported.', 'good');
  }

  function onImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const data = JSON.parse(String(reader.result));
        if (typeof data !== 'object' || !data.userId) throw new Error('Invalid file');
        data.schemaVersion = SCHEMA_VERSION;
        await importState(data as PersistedState);
        pushToast('Progress imported.', 'good');
      } catch (err) {
        pushToast('Import failed: invalid file.', 'bad');
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <header>
        <h1 className="text-3xl font-extrabold gradient-text">Settings</h1>
        <p className="text-text-secondary">Manage your callsign, accessibility, and your data.</p>
      </header>

      <section className="card space-y-3">
        <h2 className="font-bold">Profile</h2>
        <label className="block text-sm">
          <div className="text-text-secondary mb-1">Callsign</div>
          <input className="input w-full" value={username} maxLength={24} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <label className="block text-sm">
          <div className="text-text-secondary mb-1">Avatar emoji</div>
          <input className="input w-full" value={avatar} maxLength={4} onChange={(e) => setAvatar(e.target.value)} />
        </label>
      </section>

      <section className="card space-y-3">
        <h2 className="font-bold">Accessibility & Preferences</h2>
        <Toggle label="Reduced motion" checked={settings.reducedMotion} onChange={(v) => setSetting('reducedMotion', v)} />
        <Toggle label="Sound (placeholder)" checked={settings.sound} onChange={(v) => setSetting('sound', v)} />
      </section>

      <section className="card space-y-3">
        <h2 className="font-bold">Account (coming soon)</h2>
        <p className="text-sm text-text-secondary">Cross-device sync via account is on the roadmap. Today, your progress lives on this browser.</p>
        <div className="bg-bg/60 rounded-lg p-3 border border-border/60 opacity-70">
          <div className="text-sm">Connect account to sync across devices</div>
          <button className="btn-secondary mt-2" disabled>Connect (disabled)</button>
        </div>
      </section>

      <section className="card space-y-3">
        <h2 className="font-bold">Your Data</h2>
        <p className="text-sm text-text-secondary">Export a JSON copy of your progress, or import one from another browser.</p>
        <div className="flex flex-wrap gap-2">
          <button className="btn-secondary" onClick={onExport}>Export progress (JSON)</button>
          <input ref={fileRef} type="file" accept="application/json" hidden onChange={onImport} />
          <button className="btn-secondary" onClick={() => fileRef.current?.click()}>Import progress</button>
          {!confirmingReset ? (
            <button className="btn-ghost text-danger" onClick={() => setConfirmingReset(true)}>Delete all my data</button>
          ) : (
            <span className="inline-flex gap-2">
              <button className="btn-ghost" onClick={() => setConfirmingReset(false)}>Cancel</button>
              <button className="btn-primary !bg-danger" onClick={async () => { await reset(); pushToast('All progress wiped.', 'bad'); location.reload(); }}>Confirm delete</button>
            </span>
          )}
        </div>
      </section>

      <section className="card text-xs text-text-secondary space-y-1">
        <h3 className="font-bold text-text-primary">About</h3>
        <p>CyberQuest is an unofficial study companion. Not affiliated with, endorsed by, or sponsored by (ISC)². CC, CISSP, and related marks belong to (ISC)².</p>
        <p>v0.1.0 · Schema {SCHEMA_VERSION}</p>
      </section>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="text-sm">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={'relative inline-flex h-6 w-11 items-center rounded-full transition-colors ' + (checked ? 'bg-accent1' : 'bg-surface border border-border')}
        aria-pressed={checked}
        aria-label={label}
      >
        <span className={'inline-block h-5 w-5 rounded-full bg-bg transition-transform ' + (checked ? 'translate-x-5' : 'translate-x-0.5')} />
      </button>
    </label>
  );
}
