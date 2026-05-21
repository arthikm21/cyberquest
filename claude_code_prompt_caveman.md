# CyberQuest CC WebApp — Claude Code Prompt

---

## ROLE
Senior full-stack engineer. Build ISC2 CC cert interactive learning app.

## APP
Name: **CyberQuest: The CC Journey**
React SPA. No backend. State: in-memory + localStorage. Vibe: Duolingo × HackTheBox × graphic novel.

## STACK
- **Vite + React 18 + TypeScript (strict)**. Hooks only. `.tsx` everywhere. No CRA.
- **Tailwind CSS** + CSS variables for theme tokens.
- **Recharts** (charts) — lazy-load only on pages that use it (heavy).
- **Lucide React** (icons) — named imports only (tree-shake).
- **Zustand** for global store (progress/XP/badges/settings). Tiny, no Redux bloat, selectors avoid re-render storms. Context only for theme + auth stub.
- **React Router v6** w/ `React.lazy` + `Suspense` per route (code-split each domain/game/story chapter).
- **idb-keyval** (IndexedDB) primary store. localStorage = fallback + tiny flags only.
- **Workbox** service worker → PWA, offline-first, app-shell cache.
- **Vitest + React Testing Library** unit. **Playwright** e2e for golden flows (quiz pass, exam submit, story Ch1, badge unlock).
- **ESLint + Prettier + TypeScript strict + Husky pre-commit**.
- No external APIs. All content hardcoded (JSON modules, code-split per domain).
- Persist: XP, progress, badges, streaks, quiz history, flashcard SRS state, settings → IndexedDB (localStorage mirror for tiny flags only).

---

## CONTENT: ALL 5 DOMAINS

### D1: Security Principles
Modules: CIA Triad | Risk Mgmt | Security Controls | Ethics | Governance

Concepts:
- C=no unauthorized disclosure, I=no unauthorized modification, A=access when needed
- PII, PHI
- Auth, Authorization, Non-repudiation, Privacy
- Threat actors: Insiders, Outsiders, Nation-states, Hacktivists, Cybercriminals, Bots
- Risk treat: Accept / Avoid / Mitigate(most common) / Transfer
- Qualitative vs Quantitative risk assessment
- Governance top→bottom: Regulations→Standards→Policies→Procedures
- Physical controls: badge readers, fences, locks, guards
- Technical controls: firewalls, encryption, MFA, antivirus
- Admin controls: policies, training, background checks
- Ethics: Protect society → Act honorably → Competent service → Advance profession

### D2: IR / BC / DR
Modules: Incident Response | Business Continuity | Disaster Recovery

Concepts:
- IR phases: Prep→Detection/Analysis→Containment/Eradication/Recovery→Post-Incident
- Terms: Breach, Event, Exploit, Incident, Intrusion, Threat, Vulnerability
- BC components: notification systems, call trees, vendor contacts, checklists
- DR components: exec summary, dept plans, technical guides, checklists
- IR=keep operating during incident; BC=keep operating through crisis; DR=restore after failure
- RPO vs RTO

### D3: Access Control
Modules: Fundamentals | Physical Controls | Logical Controls

Concepts:
- Subjects(who)=users/processes/programs/devices — ACTIVE
- Objects(what)=data/systems/buildings/apps — PASSIVE
- Rules(how/when)=permissions/ACLs/policies
- Defense in depth: multiple layers
- Physical: mantraps, turnstiles, CCTV, guards, fencing, lighting
- Logical: DAC, MAC, RBAC, ABAC
- Least Privilege, Separation of Duties, Need to Know
- MFA: know + have + are

### D4: Network Security
Modules: Networking Basics | Threats/Attacks | Tools/Controls

Concepts:
- LAN, WAN, WLAN, VPN
- Devices: Hub(dumb)→Switch(smart)→Router(smarter)→Firewall(security)
- OSI 7 layers: Physical→DataLink→Network→Transport→Session→Presentation→Application
- TCP/IP model
- IP + MAC addressing
- Ports: HTTP=80, HTTPS=443, FTP=21, SSH=22, DNS=53, SMTP=25
- Threats: DoS/DDoS, MitM, Phishing, Ransomware, Social Engineering, SQLi, XSS
- Tools: Firewall, IDS, IPS, SIEM, VPN, WAF, Honeypots
- Network segmentation, DMZ, Zero Trust
- Wireless: WPA2, WPA3, rogue APs

### D5: Security Operations
Modules: Data Security | Logging/Monitoring | Encryption | Config Mgmt | Awareness Training

Concepts:
- Data lifecycle: Create→Store→Use→Share→Archive→Destroy
- Classification: Highly Restricted→Moderately Restricted→Low Sensitivity→Unrestricted
- Destruction: Clearing(overwrite), Purging(degauss), Physical destruction
- Logging: captures events, forensics, accountability
- Encryption: Symmetric(AES/DES), Asymmetric(RSA), Hashing(SHA/MD5)
- PKI, digital certs, digital signatures
- Hardening: reduce attack surface, patch, disable unused services
- Config mgmt: baseline, change mgmt, patch mgmt
- Awareness: phishing sims, training, clean desk policy

---

## FEATURES — BUILD ALL

### 1. DASHBOARD
- Animated hero banner: "CyberQuest: Become a Certified Cyber Guardian"
- Player card: username, emoji avatar, XP bar, level badge, streak days
- 5 domain cards: icon, title, progress%, lock/unlock (D1 unlocked default; next unlocks at 70% prior)
- Daily challenge widget: random quiz Q, bonus XP
- Leaderboard: simulated top 5 + real player
- Recent badges earned
- Rotating cybersecurity tip of day

### 2. STORY MODE ("The Heist") — visual novel style

**Ch1 (D1) — "The Leak"**
Alex=new analyst at MegaCorp. Customer data leaking. Must: ID CIA triad failure, ID threat actor, pick risk treatment.
- 4-5 scenes w/ SVG art panels
- Decision points: pick action → wrong=consequence+lesson, right=XP+advance
- 

**Ch2 (D2) — "The Ransomware"**
MegaCorp hit 2AM. Execute IR→BC→DR.
- Walk IR phases interactively
- Countdown timer UI
- Checklist: pick correct IR actions

**Ch3 (D3) — "The Insider"**
Someone accessing wrong files. Investigate logs, apply least privilege, catch insider.
- Access control matrix puzzle
- Drag-drop: assign permissions to users

**Ch4 (D4) — "The Network Intruder"**
Hacker lateral movement. Trace attack, ID vector, harden network.
- Clickable network topology diagram
- ID attack path

**Ch5 (D5) — "The Whistleblower"**
Alex finds encrypted files. Proper data handling, log check, secure destruction.
- Log analysis mini-game (spot anomaly)

### 3. QUIZ ENGINE
Types: Multiple Choice(4-opt) | True/False(explain wrong) | Drag-drop matching | Scenario-based | Fill-blank(keyword check)

Min 10 Q/domain (50+ total). Include these + generate more:

**D1:**
- "A" in CIA? → Availability
- Risk treatment that stops activity? → Avoidance
- PII=? → Personally Identifiable Information
- NOT security control type? → Financial (Physical/Technical/Admin are valid)
- Governance top→bottom? → Regs→Standards→Policies→Procedures
- Political attacker? → Hacktivist
- Non-repudiation means? → Cannot deny action taken
- Most common risk treatment? → Mitigation
- HIPAA protects? → PHI
- "Something you are" factor? → Biometrics

**D2:**
- First IR phase? → Preparation
- RTO=? → Recovery Time Objective
- Last plan activated? → DR
- Breach defined as? → Unauthorized PII disclosure/loss of control
- IR team = ? → Cross-functional: mgmt + technical + functional

**D3:**
- Subject in access control? → Entity requesting access (active)
- Least Privilege means? → Min access needed only
- RBAC=? → Role-Based Access Control
- Mantrap = what control type? → Physical
- Separation of Duties prevents? → Fraud/errors via multi-person requirement

**D4:**
- OSI layer for IP addressing? → Layer 3 Network
- HTTPS port? → 443
- IDS vs IPS — which blocks? → IPS
- DDoS targets which CIA pillar? → Availability
- WPA3 used for? → Wireless security

**D5:**
- First data lifecycle step? → Create
- Overwriting data = ? → Clearing
- AES = what encryption type? → Symmetric
- Logging supports? → Accountability + forensics
- Hardening = ? → Reduce attack surface via secure configs

Quiz modes:
- Timed (30s/Q, speed bonus XP)
- Practice (untimed, hints)
- Exam sim (75Q, 3hr timer, mirrors real CC exam)

Score screen: %, weak areas Recharts radar chart, wrong answer review, XP awarded, streak multiplier.

### 4. FLASHCARDS
- Flip animation: front=term, back=definition
- Left arrow/swipe = don't know (repeats more). Right = know it.
- Spaced repetition logic
- Progress: X/Y mastered per domain
- Search + domain filter

Terms (include all, generate definitions):
Adequate Security, Administrative Controls, Asset, Authentication, Authorization, Availability, Baseline, Biometric, Bot, Classified Info, Confidentiality, Criticality, Data Integrity, Encryption, GDPR, Governance, HIPAA, Impact, Info Security Risk, Integrity, ISO, IETF, Likelihood, MFA, NIST, Non-repudiation, PII, PHI, Physical Controls, Privacy, Risk, Risk Acceptance, Risk Assessment, Risk Avoidance, Risk Mitigation, Risk Transfer, Qualitative Risk Analysis, Quantitative Risk Analysis, Social Engineering, Subject, Object, Least Privilege, Separation of Duties, DAC, MAC, RBAC, OSI Model, Firewall, IDS, IPS, VPN, Symmetric Encryption, Asymmetric Encryption, Hashing, Data Classification, Data Destruction, Hardening, Logging, Patch Management

### 5. MINI-GAMES (all 6, each completable 2-5min)

**G1: CIA Defender** (tower defense CSS)
- Enemies march toward server: Hacker, Insider, Ransomware, Phishing
- Player places defense cards: Firewall, Encryption, MFA, Training
- Each threat beaten by specific control (teaches mapping)
- 3 levels, difficulty scales

**G2: OSI Stack Stacker**
- Drag 7 OSI layer tiles into correct order
- Timed → faster = more XP
- Animated data packet travels down on correct completion
- Wrong placement: tile shake + bounce back

**G3: Phishing Detective**
- Show fake emails one by one
- Spot 3 red flags per email (hover highlight): spoofed sender, urgency, fake links, grammar errors, bad attachments
- 5 rounds, final score

**G4: Risk Roulette**
- Spin wheel → scenario (e.g. "Laptop left on train")
- Pick: Accept / Avoid / Mitigate / Transfer
- Explain after each
- 10 scenarios, leaderboard score

**G5: Password Fortress**
- Build password by adding complexity: length, uppercase, numbers, symbols
- Visual strength meter animates
- Defend against: dictionary, brute force, credential stuffing attacks (animated waves)
- Teaches password policy + auth best practices

**G6: Network Topology Builder**
- Drag: Hub, Switch, Router, Firewall, Server, Client onto canvas
- Draw lines to connect
- "Audit Network" button → evaluate security (firewall between internet+internal, etc.)
- Score + feedback

### 6. VISUAL EXPLAINERS (per domain, animated SVG)

**D1: CIA Triad Castle**
- SVG castle, 3 towers: Confidentiality(blue), Integrity(green), Availability(gold)
- Click tower → expand sub-concepts
- Threats attack → defenses appear

**D2: Crisis Timeline**
- Animated horizontal timeline: Normal→Incident→IR activated→BC holds→DR restores
- Click each stage → tooltip with details

**D3: Access Control Matrix**
- Animated grid: users vs resources
- Colors: green=allow, red=deny, yellow=conditional
- Toggle permissions → see access change live

**D4: OSI Layer Cake**
- 7 stacked animated layers
- Click layer → name, protocols, function, real-world example
- Animate data packet traveling through layers

**D5: Data Vault**
- Animated vault, data lifecycle stages
- Click stage → handling requirements
- Encryption animation: plaintext → ciphertext visual transform

### 7. GAMIFICATION

XP earn rates:
- Lesson complete: 50 XP
- Quiz Q correct: 10 XP
- Game level: 75 XP
- Daily challenge: 100 XP
- Perfect quiz: 2× XP

Levels: Recruit(0)→Analyst(500)→Specialist(1500)→Engineer(3000)→Architect(6000)→CISO(10000)

Badges:
- 🛡️ CIA Guardian — D1 complete
- 🚨 Incident Handler — D2 complete
- 🔐 Access Gatekeeper — D3 complete
- 🌐 Network Defender — D4 complete
- 🔒 Security Operator — D5 complete
- 🏆 CC Champion — all domains done
- 🔥 On Fire — 7-day streak
- ⚡ Speed Demon — quiz under time
- 🎯 Sharpshooter — 10 correct row
- 🧠 Encyclopedia — all flashcards mastered

Daily streak: 1 activity/day. Persist all to localStorage. Leaderboard: player vs 9 fake players.

### 8. EXAM SIMULATOR
- 75 randomized Q from full question bank
- 3hr countdown (prominent timer)
- Flag Q for review
- Jump to any Q number
- No feedback during exam
- Results: Pass/Fail(70% pass), domain breakdown bar chart, radar chart strengths/weaknesses, full review (Q + your answer + correct + explanation), "Study Weak Areas" button

### 9. GLOSSARY
- A-Z searchable, 80+ terms
- Per term: name, definition, example, domain, related terms
- Domain filter buttons
- "Add to flashcards" per term

### 10. STUDY PLAN GENERATOR
- Input: exam date + hrs/week available
- Output: week-by-week plan (what to study, which activities, time estimate)
- Visual calendar/timeline display
- Mark days complete

---

## DESIGN

Colors (dark cyberpunk, dark mode primary):
- bg: `#0a0e1a`
- surface: `#111827`
- border: `#1f2937`
- accent1: `#00d4ff` (cyan)
- accent2: `#7c3aed` (purple)
- success: `#10b981`
- warning: `#f59e0b`
- danger: `#ef4444`
- text-primary: `#f9fafb`
- text-secondary: `#9ca3af`

Typography: bold large headers, `font-mono` for terminal/code, sans-serif body.

Visual style:
- Glassmorphism cards: `backdrop-blur` + semi-transparent bg + subtle border
- Neon glow: `box-shadow: 0 0 20px rgba(0,212,255,0.3)`
- Transitions: `transition-all duration-300`
- Hover: `hover:scale-105` + glow up
- Gradient text headings: cyan→purple
- Subtle CSS grid/matrix bg pattern
- Skeleton pulse loading states
- Micro-animations: XP float+fade, badge unlock glow burst, correct/wrong flash green/red, card 3D flip

Layout:
- Collapsible sidebar nav (→ bottom tab bar on mobile)
- Max-width content area
- Sticky top bar: logo, XP/level, streak, settings
- Responsive: mobile + tablet + desktop

---

## NAV STRUCTURE
```
CyberQuest
├── 🏠 Dashboard
├── 📖 Story Mode
│   ├── Ch1: The Leak
│   ├── Ch2: The Ransomware
│   ├── Ch3: The Insider
│   ├── Ch4: The Network Intruder
│   └── Ch5: The Whistleblower
├── 🎓 Learn
│   ├── D1: Security Principles
│   ├── D2: IR/BC/DR
│   ├── D3: Access Control
│   ├── D4: Network Security
│   └── D5: Security Operations
├── 🧠 Visual Explainers
├── 🃏 Flashcards
├── ❓ Quizzes
├── 🎮 Mini-Games (6 games)
├── 📝 Exam Simulator
├── 📚 Glossary
├── 📅 Study Plan
└── 🏆 Achievements
```

---

## IMPL NOTES

State: Zustand store, sliced (`progressSlice`, `xpSlice`, `settingsSlice`, `quizSlice`, `srsSlice`). Selectors via `useStore(s => s.x)` to avoid wide re-renders. No Redux.

Storage pattern (IndexedDB primary, schema-versioned, migration-safe):
```ts
// src/lib/storage.ts
import { get, set, del } from 'idb-keyval';

const KEY = 'cyberquest:v1';
const SCHEMA_VERSION = 1;

export type PersistedState = {
  schemaVersion: number;
  userId: string;          // anon UUID until login attached
  username: string;
  avatar: string;
  xp: number;
  level: string;
  streak: { count: number; lastActiveISO: string };
  domainProgress: Record<'D1'|'D2'|'D3'|'D4'|'D5', number>;
  badges: string[];
  quizHistory: Array<{ id: string; correct: boolean; ts: number }>;
  srs: Record<string, { box: 1|2|3|4|5; dueISO: string }>;
  settings: { reducedMotion: boolean; sound: boolean; theme: 'dark'|'light' };
};

export async function loadProgress(): Promise<PersistedState | null> {
  const raw = await get<PersistedState>(KEY);
  if (!raw) return null;
  return migrate(raw);
}

export async function saveProgress(state: PersistedState) {
  await set(KEY, { ...state, schemaVersion: SCHEMA_VERSION });
}

function migrate(s: PersistedState): PersistedState {
  if (s.schemaVersion === SCHEMA_VERSION) return s;
  // future migrations chained here
  return { ...s, schemaVersion: SCHEMA_VERSION };
}
```

Persist middleware: debounce writes 500ms. Wrap in try/catch — IndexedDB can fail in private mode → fall back to in-memory + toast user.

Export/Import: JSON download/upload of `PersistedState` (data portability, GDPR-friendly, lets user move browsers).

Animations: Tailwind `animate-pulse/bounce/spin` + custom CSS keyframes for XP float, badge burst, Q feedback flash, card 3D flip.

Games: each = self-contained component, own state, 2-5min completable.

Question bank schema:
```javascript
{ id, domain, type, question, options[], correct, explanation, difficulty }
```

SVG art: inline SVG for story scenes + visual explainers.

Responsive: Tailwind `sm: md: lg:` throughout. Sidebar collapses → bottom tabs mobile.

Onboarding (first-time):
- Modal: enter username, pick emoji avatar (10 options), 3-step UI tutorial
- Confirm → enter app

---

## STORY SCENE EXAMPLE (match this quality)

```
Ch1 Scene 1 — "The Discovery"
[SVG: dark office, glowing monitors, Alex alarmed]

NARRATOR: 11:47 PM. MegaCorp HQ. Security Operations Center.
ALEX: "These DB queries look wrong. Someone pulled customer records 3 weeks straight."
[Alert pulses red]
SYSTEM: ⚠️ ANOMALY: 847 unauthorized exports | customer_records_2024.db | src: 192.168.1.147 [INTERNAL]
ALEX: "Internal IP... insider threat?"

━━━━━━━━━━━━━━━━━━
What does Alex do?
[A] 🔍 Investigate IP quietly
[B] 📢 Alert security team + management NOW
[C] 🔒 Lock DB immediately
[D] 📧 Email all employees asking who exported
━━━━━━━━━━━━━━━━━━

A → wrong: "Security = team sport. Solo incident handling violates IR Prep. -10 XP. Lesson: IR needs cross-functional team from start."
B → correct: "✅ +25 XP. Detection→Analysis→Team Activation. Breach confirmed — PII disclosed without auth. Confidentiality violated!"
```

---

## DELIVERABLES (min required)
- App loads, no errors
- All 5 domains accessible
- 3+ mini-games: full win/lose state
- 30+ quiz Q (target 50+)
- 40+ flashcard terms
- Ch1 story fully playable, Ch2-5 stubs ok
- XP/levels/badges work + persist localStorage
- Dashboard shows real progress
- Exam sim: 20+ Q + scoring
- Responsive mobile+desktop
- Dark cyberpunk theme throughout

## STRETCH
- Web Audio API: beeps/chimes correct/wrong
- CSS confetti on badge unlock
- Day/night toggle
- window.print() study plan export
- Shareable score text summary
- Keyboard shortcuts

---

## PROD-READY @ 1M USERS

Target: 1M MAU. Static SPA on edge CDN = pennies in cost, fine at this scale. Bottleneck is browser perf + storage + observability, not server. Build to these standards from day one.

### Hosting + CDN
- Static host: **Cloudflare Pages** or **Vercel** or **Netlify**. Pick one. Edge-cached globally.
- Immutable hashed assets (`/assets/*.[hash].js`) → `Cache-Control: public, max-age=31536000, immutable`.
- `index.html` → `Cache-Control: no-cache` so deploys propagate instantly.
- Custom domain + auto HTTPS + HTTP/2/3.
- Preview deploys per PR.

### Perf budgets (enforce in CI via Lighthouse CI)
- Initial JS gzip ≤ **180 KB**.
- LCP ≤ 2.0s on 4G mid-tier mobile.
- TBT ≤ 200ms. CLS ≤ 0.05. INP ≤ 200ms.
- Per-route chunk ≤ 80 KB gzip.

### Bundle strategy
- `React.lazy()` every route: each domain, each game, each story chapter, exam sim, glossary.
- Recharts → only in score/exam pages (lazy).
- Question bank → split per domain (`d1.json`...`d5.json`), import dynamically when domain opens.
- SVG art for story scenes → lazy import per chapter; never ship Ch2-5 art with initial bundle.
- Tailwind: `content` globbed tight, JIT, purge in prod.
- Preload critical fonts (`font-display: swap`). Self-host fonts, no Google CDN (privacy + perf).

### PWA / offline
- Workbox service worker. App shell precached. Runtime cache for question banks (stale-while-revalidate).
- Manifest: name, icons (192/512/maskable), `display: standalone`, themed splash.
- Offline page. App fully usable offline once visited (huge for studying on transit).
- Update flow: show "New version available — reload" toast when SW activates.

### Storage scale (the real localStorage trap)
- localStorage = synchronous, ~5MB cap, blocks main thread. **Do not use as primary.**
- IndexedDB via `idb-keyval` = async, ~50MB+ per origin, non-blocking. **Primary store.**
- Quota check on first write: `navigator.storage.estimate()` → warn at 80% used.
- Schema versioned (`schemaVersion` field). Migrations run on load.
- Debounce writes (500ms). Batch updates.
- `navigator.storage.persist()` request → ask browser not to evict.
- Private/Incognito → IDB may be ephemeral. Detect + show banner "progress won't save in private mode".

### Security
- **CSP** strict: `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' (tailwind needs); img-src 'self' data:; connect-src 'self' <sentry> <analytics>; frame-ancestors 'none'; base-uri 'self'`. Set via `_headers` (Pages/Netlify) or `vercel.json`.
- Headers: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`.
- **No `dangerouslySetInnerHTML`** anywhere. All user-supplied strings (username) sanitized + length-capped (≤ 24 chars, alnum + `_-`).
- No secrets in client. Ever. (Trivially true now, must stay true when backend lands.)
- Subresource Integrity if any third-party CDN script (avoid — self-host).
- Dependabot / Renovate on.

### Observability
- **Sentry** for JS errors + React error boundaries + source maps uploaded on build. Sample rate 10% in prod.
- **PostHog** or **Plausible** (privacy-friendly, GDPR-ok cookieless) for product analytics. Events: lesson_complete, quiz_finish, badge_unlock, game_complete, exam_submit, install_pwa.
- **Web Vitals** (`web-vitals` lib) → ship to analytics.
- Synthetic uptime: free Cloudflare / UptimeRobot ping on `/`.

### Error handling
- **Error boundary per route**. Fallback UI = "Something broke. [Reload] [Report]". Capture to Sentry.
- Global `window.onerror` + `unhandledrejection` → Sentry.
- IndexedDB write failure → toast + in-memory fallback, do not crash.

### Accessibility (WCAG 2.1 AA)
- Keyboard nav full (focus rings visible, skip-to-content link).
- ARIA labels on icon-only buttons.
- Color contrast verified (cyberpunk darks pass — verify each pair).
- `prefers-reduced-motion` → disable confetti, glow pulses, page transitions.
- All games keyboard-playable where possible (OSI stacker = arrow keys + space).
- Quiz: focus trapped in modal, results announce via `aria-live`.
- Lighthouse a11y ≥ 95.

### SEO + meta
- `react-helmet-async` per route: title, description, OG image, Twitter card.
- `sitemap.xml`, `robots.txt`.
- Landing route SSR/prerender via Vite SSG plugin so first paint + SEO snapshot is HTML, not JS shell. (Improves social previews + Google ranking.)
- JSON-LD `Course` schema on landing.

### CI/CD (GitHub Actions)
```
lint → typecheck → unit tests → build → playwright e2e → lighthouse-ci → deploy preview
main merge → deploy prod
```
Required green for merge. Lighthouse budgets gate.

### Legal / compliance
- **Disclaimer**: "Not affiliated with, endorsed by, or sponsored by (ISC)². CC, CISSP, etc. are trademarks of (ISC)²." — footer + about page.
- Privacy policy page (cookieless analytics → minimal). ToS page.
- GDPR/CCPA buttons in settings: **Export my data** (JSON download), **Delete my data** (wipe IDB + reload).
- If PostHog cookies enabled → add consent banner. Prefer cookieless mode → no banner needed.

### Anti-abuse
- Leaderboard is fake (per spec) — no abuse vector.
- Username rate-limit changes (1/min client-side, doesn't matter without backend, but pattern stays for later).
- Throttle game timer loops + cancel intervals on unmount (memory leak hazard at scale).

### Browser support
- Evergreen: last 2 versions Chrome/Edge/Firefox/Safari. iOS Safari 15+. No IE.
- `<noscript>` fallback page.

### Mobile
- Touch targets ≥ 44×44px.
- Safe-area-inset for notch.
- Install prompt for PWA after 3rd visit.

### Feature flags
- `src/config/flags.ts` — static JSON of bools. Lets you ship dark code, roll out per-route. Future: hydrate from edge config.

---

## AUTH SCAFFOLD (slot for future login/signup — do NOT implement now)

Goal: every user already has a stable anon identity. When login lands later, attach it to that identity, no data loss.

- On first launch, generate `userId = crypto.randomUUID()` and persist to IDB.
- `<AuthProvider>` context exposes `{ user: null | User, status: 'anon' | 'authed' | 'loading', signIn, signOut }`. Currently always `anon` w/ no-op `signIn`/`signOut`.
- Top bar shows **[Sign In]** button → opens modal stub: "Sign in coming soon. Your progress is saved on this browser." Disabled CTA + "Notify me" mailto link.
- Onboarding modal already handles username + avatar locally → that's the anon profile. Reuse on login (claim flow).
- Settings page → "Account" section w/ greyed-out "Connect account to sync across devices" row. Visible placeholder communicates the future.
- Code shape ready: `signIn()` will (later) call OAuth, get token, POST anon IDB blob to backend, swap to authed mode. Persist layer abstracted (`storage.ts`) so swap from IDB-only → IDB+remote-sync is a single-file change.
- **Do not** add forms, do not add password fields, do not import any auth lib yet. Just the empty seats.

---

## REVISED DELIVERABLES (replaces minimum list above)

Must-haves for v1 prod ship:
- All 5 domains accessible, code-split per route.
- 3+ mini-games fully playable w/ win/lose states; remaining 3 stubbed but routed.
- 50+ quiz questions across 5 domains.
- 50+ flashcard terms w/ spaced repetition (Leitner 5-box).
- Story Ch1 fully playable; Ch2-5 routed stubs w/ "Coming soon" hero.
- XP / levels / badges / streak — all persisted to IndexedDB, survive reload, survive browser restart.
- Dashboard reflects real persisted progress.
- Exam sim: 30+ Q drawn from bank, 3hr timer, full review screen.
- Onboarding modal on first launch (username + avatar + 3-step tour).
- PWA installable, works offline after first visit.
- Auth scaffold present (sign-in button → "coming soon" modal). No real auth.
- A11y: keyboard nav + reduced-motion respected + Lighthouse a11y ≥ 95.
- Sentry + analytics wired (env-gated; ok if DSN/key are placeholder strings).
- Error boundaries per route.
- Export / Import / Delete progress in settings.
- CSP + security headers set via host config file.
- README w/ run/build/deploy steps.

Non-goals (explicitly out for v1):
- Login / signup (scaffold only).
- Real backend, real leaderboard, real multiplayer.
- Server-side user data.
- Push notifications.

---

## BUILD ORDER
1. **Scaffolding**: Vite + React + TS strict + Tailwind + Router + Zustand + idb-keyval. ESLint/Prettier/Husky. `_headers` w/ CSP. `manifest.json`. SW shell.
2. **Storage layer** (`src/lib/storage.ts`) + Zustand store + persist middleware + migration stub. Unit test round-trip.
3. **Layout shell**: Sidebar nav, top bar (XP/level/streak/sign-in stub), error boundary, route splits.
4. **Onboarding modal** → writes initial anon profile to IDB.
5. **Dashboard** (reads real store).
6. **Quiz engine** + D1 question bank + score screen (Recharts lazy).
7. **Flashcards** + Leitner SRS.
8. **2 mini-games**: CIA Defender + OSI Stacker (most replayable).
9. **Story Ch1** full; Ch2–5 routed stubs.
10. **Visual Explainers** (start D1 + D4 cake, others stubbed).
11. **Exam Simulator**.
12. **Glossary** + **Study Plan**.
13. **Auth scaffold** (sign-in modal stub).
14. **Settings**: export/import/delete data, reduced-motion, sound, theme.
15. **PWA polish**: install prompt, offline page, update toast.
16. **Observability hookup**: Sentry, web-vitals, analytics events.
17. **Lighthouse pass**, fix until budgets green.
18. **e2e flows** in Playwright: onboarding → quiz pass → badge unlock → reload → progress persists.

Hero screen must scream premium + fun + cybersecurity on first render — but never at the cost of perf budgets above.

**Build complete app now.**
