import { Question } from './types';

export const QUESTIONS: Question[] = [
  // ===== D1 — Security Principles =====
  {
    id: 'd1-q1', domain: 'D1', type: 'mc',
    question: 'What does the "A" in the CIA triad stand for?',
    options: ['Authentication', 'Authorization', 'Availability', 'Accountability'],
    correct: 2,
    explanation: 'CIA = Confidentiality, Integrity, Availability. The A is Availability — making sure data and systems are reachable when needed.',
  },
  {
    id: 'd1-q2', domain: 'D1', type: 'mc',
    question: 'Which risk treatment stops the risky activity entirely?',
    options: ['Acceptance', 'Avoidance', 'Mitigation', 'Transfer'],
    correct: 1,
    explanation: 'Avoidance eliminates the activity that introduces the risk. Mitigation reduces it; Transfer shifts it (e.g., insurance); Acceptance lives with it.',
  },
  {
    id: 'd1-q3', domain: 'D1', type: 'mc',
    question: 'PII stands for...',
    options: [
      'Personally Identifiable Information',
      'Private Internet Identity',
      'Protected Internal Info',
      'Personal Insurance ID',
    ],
    correct: 0,
    explanation: 'PII = Personally Identifiable Information. Examples: name + SSN, name + DOB + address.',
  },
  {
    id: 'd1-q4', domain: 'D1', type: 'mc',
    question: 'Which is NOT one of the three security control categories?',
    options: ['Physical', 'Technical', 'Financial', 'Administrative'],
    correct: 2,
    explanation: 'The three control categories are Physical, Technical, and Administrative. "Financial" is not a category.',
  },
  {
    id: 'd1-q5', domain: 'D1', type: 'mc',
    question: 'Governance hierarchy from top to bottom is:',
    options: [
      'Procedures → Policies → Standards → Regulations',
      'Regulations → Standards → Policies → Procedures',
      'Policies → Regulations → Standards → Procedures',
      'Standards → Policies → Regulations → Procedures',
    ],
    correct: 1,
    explanation: 'Regulations (law) sit at the top, then Standards, then organizational Policies, then specific Procedures.',
  },
  {
    id: 'd1-q6', domain: 'D1', type: 'mc',
    question: 'A threat actor motivated by political or social causes is called a...',
    options: ['Insider', 'Hacktivist', 'Nation-state', 'Script kiddie'],
    correct: 1,
    explanation: 'Hacktivists pursue political/social aims — think defacement, leaks. Nation-states pursue strategic goals; insiders work from within.',
  },
  {
    id: 'd1-q7', domain: 'D1', type: 'mc',
    question: 'Non-repudiation means:',
    options: [
      'A user can deny they performed an action',
      'A user cannot deny they performed an action',
      'Two users cannot share an account',
      'Logs cannot be edited',
    ],
    correct: 1,
    explanation: 'Non-repudiation provides proof of action — typically via digital signatures or strong audit trails — so the actor cannot credibly deny it.',
  },
  {
    id: 'd1-q8', domain: 'D1', type: 'mc',
    question: 'The most common risk treatment is:',
    options: ['Acceptance', 'Avoidance', 'Mitigation', 'Transfer'],
    correct: 2,
    explanation: 'Mitigation is the most common — applying controls to reduce likelihood or impact.',
  },
  {
    id: 'd1-q9', domain: 'D1', type: 'mc',
    question: 'HIPAA protects what kind of data?',
    options: ['Financial', 'PHI', 'Student records', 'Trade secrets'],
    correct: 1,
    explanation: 'HIPAA protects PHI (Protected Health Information). FERPA covers student records; GLBA covers some financial data.',
  },
  {
    id: 'd1-q10', domain: 'D1', type: 'mc',
    question: '"Something you are" in MFA refers to:',
    options: ['A password', 'A hardware token', 'Biometrics', 'A backup code'],
    correct: 2,
    explanation: 'Three factors: know (password), have (token), are (biometrics — fingerprint, face, retina).',
  },
  {
    id: 'd1-q11', domain: 'D1', type: 'tf',
    question: 'Quantitative risk analysis uses subjective labels like High / Medium / Low.',
    options: ['True', 'False'],
    correct: 1,
    explanation: 'False. Qualitative uses subjective labels. Quantitative uses numbers (ALE, SLE, ARO).',
  },
  {
    id: 'd1-q12', domain: 'D1', type: 'mc',
    question: 'A "bot" as a threat actor refers to:',
    options: [
      'An automated program/agent acting on behalf of an attacker',
      'A junior analyst',
      'A backup script',
      'A firewall rule',
    ],
    correct: 0,
    explanation: 'Bots are automated agents — frequently part of botnets used for DDoS or credential stuffing.',
  },

  // ===== D2 — IR / BC / DR =====
  {
    id: 'd2-q1', domain: 'D2', type: 'mc',
    question: 'Which is the FIRST phase of Incident Response?',
    options: ['Detection', 'Preparation', 'Containment', 'Recovery'],
    correct: 1,
    explanation: 'Preparation is first — build the team, runbooks, tools, and training before anything happens.',
  },
  {
    id: 'd2-q2', domain: 'D2', type: 'mc',
    question: 'RTO stands for:',
    options: ['Recovery Time Objective', 'Risk Tolerance Outcome', 'Routine Test Output', 'Restore Tier One'],
    correct: 0,
    explanation: 'RTO = Recovery Time Objective — how fast you must be back up. RPO = how much data loss you can stomach.',
  },
  {
    id: 'd2-q3', domain: 'D2', type: 'mc',
    question: 'Which plan is typically activated LAST?',
    options: ['Incident Response', 'Business Continuity', 'Disaster Recovery', 'Awareness Training'],
    correct: 2,
    explanation: 'IR keeps you operating during the incident, BC keeps the business running through the crisis, DR restores afterwards.',
  },
  {
    id: 'd2-q4', domain: 'D2', type: 'mc',
    question: 'A "breach" is best defined as:',
    options: [
      'Any unusual event in a log',
      'Unauthorized disclosure or loss of control of PII',
      'A failed login attempt',
      'A scheduled maintenance window',
    ],
    correct: 1,
    explanation: 'A breach involves unauthorized disclosure/loss of control of sensitive data, especially PII or PHI.',
  },
  {
    id: 'd2-q5', domain: 'D2', type: 'mc',
    question: 'The IR team should be:',
    options: [
      'Only the security analyst on call',
      'Cross-functional: management, technical, and functional roles',
      'Outsourced 100% to a vendor',
      'Limited to executives',
    ],
    correct: 1,
    explanation: 'IR requires cross-functional response — execs decide, technical contains, comms/legal/HR engage as needed.',
  },
  {
    id: 'd2-q6', domain: 'D2', type: 'mc',
    question: 'Which BC component is a contact tree?',
    options: ['Recovery time matrix', 'Notification system / call tree', 'Patch baseline', 'Encryption registry'],
    correct: 1,
    explanation: 'Call trees / notification systems are core BC artifacts — how you alert the right people fast.',
  },
  {
    id: 'd2-q7', domain: 'D2', type: 'tf',
    question: 'A vulnerability is an active attack against your systems.',
    options: ['True', 'False'],
    correct: 1,
    explanation: 'False. A vulnerability is a weakness; an exploit takes advantage of it; an attack is the act.',
  },
  {
    id: 'd2-q8', domain: 'D2', type: 'mc',
    question: 'RPO of "1 hour" means:',
    options: [
      'You must be back online within 1 hour',
      'You can tolerate up to 1 hour of data loss',
      'You back up every 1 hour mandatorily',
      'Your team responds within 1 hour',
    ],
    correct: 1,
    explanation: 'RPO is the data-loss tolerance window. RTO is the time-to-restore.',
  },
  {
    id: 'd2-q9', domain: 'D2', type: 'mc',
    question: 'Containment, Eradication, and Recovery occur during which IR phase grouping?',
    options: ['Preparation', 'Detection & Analysis', 'Containment/Eradication/Recovery', 'Post-Incident'],
    correct: 2,
    explanation: 'These three are grouped together as one phase — stop the bleeding, remove the cause, restore service.',
  },
  {
    id: 'd2-q10', domain: 'D2', type: 'mc',
    question: 'Post-Incident activities focus on:',
    options: [
      'Selling the incident publicly',
      'Lessons learned and improvement',
      'Skipping documentation',
      'Replacing the IR team',
    ],
    correct: 1,
    explanation: 'Post-Incident = retrospectives, root-cause docs, control updates, training tweaks.',
  },

  // ===== D3 — Access Control =====
  {
    id: 'd3-q1', domain: 'D3', type: 'mc',
    question: 'In access control, the SUBJECT is:',
    options: [
      'The passive resource being accessed',
      'The active entity requesting access',
      'The rule that allows access',
      'The log of past access',
    ],
    correct: 1,
    explanation: 'Subjects are active (users/processes). Objects are passive (files/systems). Rules govern.',
  },
  {
    id: 'd3-q2', domain: 'D3', type: 'mc',
    question: 'Least Privilege means:',
    options: [
      'Give everyone admin to reduce help-desk tickets',
      'Give only the minimum access needed for the job',
      'Give no access until requested',
      'Give privilege based on tenure',
    ],
    correct: 1,
    explanation: 'Least Privilege restricts access to only what is required for the role/task.',
  },
  {
    id: 'd3-q3', domain: 'D3', type: 'mc',
    question: 'RBAC stands for:',
    options: ['Role-Based Access Control', 'Risk-Based Access Cycle', 'Rules-Bound Account Class', 'Resource-Bound Auth Channel'],
    correct: 0,
    explanation: 'RBAC ties permissions to job roles, then assigns users to roles.',
  },
  {
    id: 'd3-q4', domain: 'D3', type: 'mc',
    question: 'A mantrap is what type of control?',
    options: ['Administrative', 'Logical', 'Physical', 'Compensating'],
    correct: 2,
    explanation: 'Mantrap = physical control — small room with two interlocked doors to prevent tailgating.',
  },
  {
    id: 'd3-q5', domain: 'D3', type: 'mc',
    question: 'Separation of Duties primarily prevents:',
    options: ['Slow approvals', 'Fraud and unilateral errors', 'Backup failures', 'Wireless intrusions'],
    correct: 1,
    explanation: 'SoD splits critical actions across multiple people so no single actor can commit fraud unchecked.',
  },
  {
    id: 'd3-q6', domain: 'D3', type: 'mc',
    question: 'MAC (Mandatory Access Control) is based on:',
    options: ['Owner discretion', 'Labels/classification enforced by the system', 'User role', 'Time of day'],
    correct: 1,
    explanation: 'MAC enforces labels (e.g., Secret, Top Secret) at the system level — users cannot override.',
  },
  {
    id: 'd3-q7', domain: 'D3', type: 'mc',
    question: 'DAC (Discretionary Access Control) is characterized by:',
    options: [
      'Owners decide who can access their resources',
      'System forces label-based access',
      'Roles define access exclusively',
      'Only admins can grant access',
    ],
    correct: 0,
    explanation: 'DAC lets the data owner decide permissions — common in file systems.',
  },
  {
    id: 'd3-q8', domain: 'D3', type: 'mc',
    question: 'The three MFA factor categories are:',
    options: [
      'Know, Have, Are',
      'Read, Write, Execute',
      'Local, Network, Cloud',
      'Physical, Logical, Admin',
    ],
    correct: 0,
    explanation: 'Something you know (password), have (token), are (biometric).',
  },
  {
    id: 'd3-q9', domain: 'D3', type: 'tf',
    question: '"Need to Know" can require even further restriction than role-based access.',
    options: ['True', 'False'],
    correct: 0,
    explanation: 'True. A user with the role may still be denied if they have no business need to see that specific data.',
  },
  {
    id: 'd3-q10', domain: 'D3', type: 'mc',
    question: 'Defense in depth means:',
    options: [
      'A single strong control',
      'Multiple layered controls so failure of one is not catastrophic',
      'Only physical controls',
      'Only logical controls',
    ],
    correct: 1,
    explanation: 'Defense in depth = layered controls — physical, technical, administrative — at multiple points.',
  },

  // ===== D4 — Network Security =====
  {
    id: 'd4-q1', domain: 'D4', type: 'mc',
    question: 'IP addressing lives at which OSI layer?',
    options: ['Layer 2 — Data Link', 'Layer 3 — Network', 'Layer 4 — Transport', 'Layer 7 — Application'],
    correct: 1,
    explanation: 'IP is Layer 3 (Network). MAC is Layer 2 (Data Link). TCP/UDP are Layer 4.',
  },
  {
    id: 'd4-q2', domain: 'D4', type: 'mc',
    question: 'HTTPS uses which default port?',
    options: ['80', '21', '443', '53'],
    correct: 2,
    explanation: 'HTTPS = 443. HTTP = 80, FTP = 21, DNS = 53.',
  },
  {
    id: 'd4-q3', domain: 'D4', type: 'mc',
    question: 'Which actively BLOCKS malicious traffic in line?',
    options: ['IDS', 'IPS', 'SIEM', 'Honeypot'],
    correct: 1,
    explanation: 'IPS is in-line and blocks. IDS detects and alerts. SIEM correlates events. Honeypots lure attackers.',
  },
  {
    id: 'd4-q4', domain: 'D4', type: 'mc',
    question: 'A DDoS attack primarily targets which CIA pillar?',
    options: ['Confidentiality', 'Integrity', 'Availability', 'Non-repudiation'],
    correct: 2,
    explanation: 'DDoS floods resources, denying availability to legitimate users.',
  },
  {
    id: 'd4-q5', domain: 'D4', type: 'mc',
    question: 'WPA3 is used for:',
    options: ['Wired network encryption', 'Wireless network security', 'VPN protocols', 'Database hardening'],
    correct: 1,
    explanation: 'WPA3 is the current wireless network security standard, replacing WPA2.',
  },
  {
    id: 'd4-q6', domain: 'D4', type: 'mc',
    question: 'In the OSI model, the Transport layer is layer:',
    options: ['2', '3', '4', '7'],
    correct: 2,
    explanation: 'Transport is Layer 4 — TCP/UDP live here.',
  },
  {
    id: 'd4-q7', domain: 'D4', type: 'mc',
    question: 'A device that filters traffic between trusted and untrusted networks is a:',
    options: ['Hub', 'Switch', 'Router', 'Firewall'],
    correct: 3,
    explanation: 'A firewall enforces an access control policy between networks of different trust levels.',
  },
  {
    id: 'd4-q8', domain: 'D4', type: 'mc',
    question: 'SQL injection exploits flaws in:',
    options: [
      'Network routing',
      'Input handling in applications',
      'Wireless encryption',
      'Physical access',
    ],
    correct: 1,
    explanation: 'SQLi exploits unsanitized user input that gets concatenated into SQL queries. Use parameterized queries.',
  },
  {
    id: 'd4-q9', domain: 'D4', type: 'mc',
    question: 'A DMZ is best described as:',
    options: [
      'A trusted internal subnet',
      'A semi-trusted network exposing services to the internet',
      'A backup data center',
      'A logging system',
    ],
    correct: 1,
    explanation: 'DMZ (demilitarized zone) hosts internet-facing services while shielding the internal network.',
  },
  {
    id: 'd4-q10', domain: 'D4', type: 'mc',
    question: 'Zero Trust assumes:',
    options: [
      'Internal traffic is always safe',
      'Every request must be authenticated and authorized regardless of origin',
      'Firewalls alone are enough',
      'VPNs eliminate threats',
    ],
    correct: 1,
    explanation: 'Zero Trust = never trust, always verify — no implicit trust based on network location.',
  },
  {
    id: 'd4-q11', domain: 'D4', type: 'mc',
    question: 'SSH default port is:',
    options: ['21', '22', '23', '25'],
    correct: 1,
    explanation: 'SSH uses port 22. Telnet (insecure) is 23. SMTP is 25.',
  },

  // ===== D5 — Security Operations =====
  {
    id: 'd5-q1', domain: 'D5', type: 'mc',
    question: 'The first step of the data lifecycle is:',
    options: ['Store', 'Create', 'Use', 'Destroy'],
    correct: 1,
    explanation: 'Create → Store → Use → Share → Archive → Destroy.',
  },
  {
    id: 'd5-q2', domain: 'D5', type: 'mc',
    question: 'Overwriting a drive multiple times is an example of:',
    options: ['Purging', 'Clearing', 'Destruction', 'Hashing'],
    correct: 1,
    explanation: 'Clearing = overwrite. Purging = degauss/strong sanitize. Destruction = physically destroy media.',
  },
  {
    id: 'd5-q3', domain: 'D5', type: 'mc',
    question: 'AES is what type of encryption?',
    options: ['Symmetric', 'Asymmetric', 'Hashing', 'Steganography'],
    correct: 0,
    explanation: 'AES is a symmetric block cipher. RSA is asymmetric. SHA is a hash function.',
  },
  {
    id: 'd5-q4', domain: 'D5', type: 'mc',
    question: 'Logging primarily supports:',
    options: ['Marketing analytics', 'Accountability and forensics', 'Code minification', 'Salary planning'],
    correct: 1,
    explanation: 'Logs anchor accountability (who did what when) and forensic investigation.',
  },
  {
    id: 'd5-q5', domain: 'D5', type: 'mc',
    question: 'Hardening means:',
    options: [
      'Increasing access for convenience',
      'Reducing attack surface via secure configs',
      'Adding more user accounts',
      'Encrypting only at rest',
    ],
    correct: 1,
    explanation: 'Hardening reduces attack surface — patch, disable unused services, restrict accounts.',
  },
  {
    id: 'd5-q6', domain: 'D5', type: 'mc',
    question: 'RSA is an example of:',
    options: ['Symmetric encryption', 'Asymmetric encryption', 'Hashing', 'Salting'],
    correct: 1,
    explanation: 'RSA is asymmetric — uses a key pair (public + private).',
  },
  {
    id: 'd5-q7', domain: 'D5', type: 'mc',
    question: 'A digital signature provides:',
    options: [
      'Confidentiality only',
      'Integrity + non-repudiation',
      'Availability only',
      'Network speed',
    ],
    correct: 1,
    explanation: 'A digital signature proves integrity (data unchanged) and non-repudiation (signer is bound to the act).',
  },
  {
    id: 'd5-q8', domain: 'D5', type: 'mc',
    question: 'PKI mainly provides:',
    options: [
      'A way to issue and verify digital certificates',
      'A patching schedule',
      'A wireless protocol',
      'A backup strategy',
    ],
    correct: 0,
    explanation: 'PKI = Public Key Infrastructure — CAs, certs, revocation, trust chains.',
  },
  {
    id: 'd5-q9', domain: 'D5', type: 'mc',
    question: 'Configuration management baseline is:',
    options: [
      'A known-good reference config to compare against',
      'A backup tape',
      'A SIEM dashboard',
      'A risk register',
    ],
    correct: 0,
    explanation: 'Baselines define the expected state. Drift from baseline triggers investigation.',
  },
  {
    id: 'd5-q10', domain: 'D5', type: 'tf',
    question: 'MD5 is still recommended for password hashing.',
    options: ['True', 'False'],
    correct: 1,
    explanation: 'False. MD5 is broken (collisions). Use bcrypt, scrypt, or Argon2 for passwords.',
  },
  {
    id: 'd5-q11', domain: 'D5', type: 'mc',
    question: 'A phishing simulation is what type of control?',
    options: ['Physical', 'Technical', 'Administrative', 'Compensating'],
    correct: 2,
    explanation: 'Awareness/training is an administrative control.',
  },
];

export const QUESTIONS_BY_DOMAIN = QUESTIONS.reduce<Record<string, Question[]>>((acc, q) => {
  (acc[q.domain] ||= []).push(q);
  return acc;
}, {});

export function pickRandom<T>(arr: T[], n: number, seed?: number): T[] {
  const a = arr.slice();
  let s = seed ?? Date.now();
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, n);
}
