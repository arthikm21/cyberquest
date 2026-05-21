export function SocArt() {
  return (
    <svg viewBox="0 0 600 200" className="w-full h-32 sm:h-40">
      <defs>
        <linearGradient id="bg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#0a0e1a" />
          <stop offset="1" stopColor="#111827" />
        </linearGradient>
      </defs>
      <rect width="600" height="200" fill="url(#bg)" />
      <g fill="#00d4ff" opacity="0.5">
        {Array.from({ length: 20 }).map((_, i) => (
          <circle key={i} cx={20 + i * 30} cy={170} r={1.5} />
        ))}
      </g>
      <rect x="60" y="40" width="160" height="110" rx="6" fill="#0a0e1a" stroke="#1f2937" />
      <rect x="70" y="50" width="140" height="90" fill="#00131a" />
      <text x="80" y="80" fill="#00d4ff" fontSize="9" fontFamily="monospace">$ tail -f /var/log/anomaly</text>
      <text x="80" y="95" fill="#ef4444" fontSize="9" fontFamily="monospace">⚠ exfil detected</text>
      <text x="80" y="110" fill="#10b981" fontSize="9" fontFamily="monospace">{'>'} 192.168.1.147</text>
      <rect x="260" y="40" width="160" height="110" rx="6" fill="#0a0e1a" stroke="#1f2937" />
      <rect x="270" y="50" width="140" height="90" fill="#001a14" />
      <text x="280" y="80" fill="#10b981" fontSize="9" fontFamily="monospace">SIEM dashboard</text>
      <text x="280" y="95" fill="#f59e0b" fontSize="9" fontFamily="monospace">HIGH severity</text>
      <text x="280" y="110" fill="#ef4444" fontSize="9" fontFamily="monospace">847 events</text>
      <circle cx="500" cy="100" r="30" fill="#7c3aed" opacity="0.3" />
      <text x="488" y="106" fontSize="28">🧑‍💻</text>
    </svg>
  );
}

export function InsiderArt() {
  return (
    <svg viewBox="0 0 600 200" className="w-full h-32 sm:h-40">
      <rect width="600" height="200" fill="#0a0e1a" />
      <g stroke="#1f2937">
        {Array.from({ length: 15 }).map((_, i) => (
          <line key={i} x1={0} y1={i * 14} x2={600} y2={i * 14} />
        ))}
      </g>
      <text x="60" y="100" fontSize="60">🕵️</text>
      <text x="160" y="80" fill="#9ca3af" fontSize="11" fontFamily="monospace">contractor.laptop</text>
      <text x="160" y="100" fill="#ef4444" fontSize="11" fontFamily="monospace">→ customer_records.db</text>
      <text x="160" y="120" fill="#f59e0b" fontSize="11" fontFamily="monospace">847 exports / 3 weeks</text>
    </svg>
  );
}

export function RansomArt() {
  return (
    <svg viewBox="0 0 600 200" className="w-full h-32 sm:h-40">
      <rect width="600" height="200" fill="#0a0e1a" />
      <text x="260" y="120" fontSize="70">💀</text>
      <text x="180" y="50" fill="#ef4444" fontSize="14" fontFamily="monospace">YOUR FILES ARE ENCRYPTED</text>
      <text x="200" y="70" fill="#9ca3af" fontSize="11" fontFamily="monospace">10 BTC by 09:00 UTC</text>
    </svg>
  );
}

export function NetworkArt() {
  return (
    <svg viewBox="0 0 600 200" className="w-full h-32 sm:h-40">
      <rect width="600" height="200" fill="#0a0e1a" />
      <g stroke="#00d4ff" strokeWidth="1.5">
        <line x1="80" y1="100" x2="200" y2="100" />
        <line x1="200" y1="100" x2="320" y2="60" />
        <line x1="200" y1="100" x2="320" y2="140" />
        <line x1="320" y1="60" x2="460" y2="60" />
        <line x1="320" y1="140" x2="460" y2="140" />
      </g>
      <text x="60" y="108" fontSize="22">🌐</text>
      <text x="186" y="108" fontSize="22">🧱</text>
      <text x="306" y="68" fontSize="22">🔀</text>
      <text x="306" y="148" fontSize="22">📡</text>
      <text x="446" y="68" fontSize="22">🖥️</text>
      <text x="446" y="148" fontSize="22">💻</text>
    </svg>
  );
}

export function VaultArt() {
  return (
    <svg viewBox="0 0 600 200" className="w-full h-32 sm:h-40">
      <rect width="600" height="200" fill="#0a0e1a" />
      <circle cx="300" cy="100" r="70" fill="#111827" stroke="#7c3aed" strokeWidth="3" />
      <circle cx="300" cy="100" r="40" fill="#0a0e1a" stroke="#00d4ff" strokeWidth="2" />
      <text x="288" y="112" fontSize="28">🔐</text>
      <text x="80" y="40" fill="#9ca3af" fontSize="11" fontFamily="monospace">Create → Store → Use → Share → Archive → Destroy</text>
    </svg>
  );
}
