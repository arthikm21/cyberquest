import { DomainId } from '../lib/storage';

export type DomainMeta = {
  id: DomainId;
  title: string;
  short: string;
  emoji: string;
  color: string;
  modules: { id: string; title: string; bullets: string[] }[];
};

export const DOMAINS: DomainMeta[] = [
  {
    id: 'D1',
    title: 'Security Principles',
    short: 'CIA, risk, controls, ethics, governance',
    emoji: '🛡️',
    color: '#00d4ff',
    modules: [
      {
        id: 'd1-cia',
        title: 'CIA Triad',
        bullets: [
          'Confidentiality — no unauthorized disclosure',
          'Integrity — no unauthorized modification',
          'Availability — access when needed',
          'PII = Personally Identifiable Information',
          'PHI = Protected Health Information (HIPAA)',
        ],
      },
      {
        id: 'd1-risk',
        title: 'Risk Management',
        bullets: [
          'Treatments: Accept, Avoid, Mitigate (most common), Transfer',
          'Qualitative vs Quantitative assessment',
          'Likelihood × Impact = Risk',
        ],
      },
      {
        id: 'd1-controls',
        title: 'Security Controls',
        bullets: [
          'Physical: badges, fences, locks, guards',
          'Technical: firewalls, encryption, MFA, antivirus',
          'Administrative: policies, training, background checks',
        ],
      },
      {
        id: 'd1-ethics',
        title: 'Ethics',
        bullets: [
          'Protect society',
          'Act honorably',
          'Provide competent service',
          'Advance the profession',
        ],
      },
      {
        id: 'd1-gov',
        title: 'Governance',
        bullets: [
          'Top→Bottom: Regulations → Standards → Policies → Procedures',
          'Threat actors: Insiders, Outsiders, Nation-states, Hacktivists, Cybercriminals, Bots',
          'Auth, Authorization, Non-repudiation, Privacy',
        ],
      },
    ],
  },
  {
    id: 'D2',
    title: 'IR / BC / DR',
    short: 'Incident response, continuity, disaster recovery',
    emoji: '🚨',
    color: '#f59e0b',
    modules: [
      {
        id: 'd2-ir',
        title: 'Incident Response',
        bullets: [
          'Phases: Preparation → Detection/Analysis → Containment/Eradication/Recovery → Post-Incident',
          'Terms: Breach, Event, Exploit, Incident, Intrusion, Threat, Vulnerability',
          'IR team is cross-functional: management + technical + functional',
        ],
      },
      {
        id: 'd2-bc',
        title: 'Business Continuity',
        bullets: [
          'Keep operating through a crisis',
          'Components: notification systems, call trees, vendor contacts, checklists',
        ],
      },
      {
        id: 'd2-dr',
        title: 'Disaster Recovery',
        bullets: [
          'Restore after failure',
          'Plans: exec summary, dept plans, technical guides, checklists',
          'RPO = data loss tolerated, RTO = time to recover',
        ],
      },
    ],
  },
  {
    id: 'D3',
    title: 'Access Control',
    short: 'Subjects, objects, rules, physical + logical',
    emoji: '🔐',
    color: '#7c3aed',
    modules: [
      {
        id: 'd3-fund',
        title: 'Fundamentals',
        bullets: [
          'Subjects (who) = users/processes — ACTIVE',
          'Objects (what) = data/systems — PASSIVE',
          'Rules (how/when) = permissions/ACLs/policies',
          'Defense in depth = multiple layers',
        ],
      },
      {
        id: 'd3-physical',
        title: 'Physical Controls',
        bullets: ['Mantraps, turnstiles, CCTV, guards, fencing, lighting'],
      },
      {
        id: 'd3-logical',
        title: 'Logical Controls',
        bullets: [
          'DAC = owner discretion',
          'MAC = mandatory labels',
          'RBAC = by role',
          'ABAC = by attributes',
          'Least Privilege, Separation of Duties, Need to Know',
          'MFA = know + have + are',
        ],
      },
    ],
  },
  {
    id: 'D4',
    title: 'Network Security',
    short: 'Networking basics, threats, tools, controls',
    emoji: '🌐',
    color: '#10b981',
    modules: [
      {
        id: 'd4-basics',
        title: 'Networking Basics',
        bullets: [
          'LAN, WAN, WLAN, VPN',
          'Devices: Hub → Switch → Router → Firewall',
          'OSI 7: Physical, Data Link, Network, Transport, Session, Presentation, Application',
          'TCP/IP model',
          'Ports: HTTP 80, HTTPS 443, FTP 21, SSH 22, DNS 53, SMTP 25',
        ],
      },
      {
        id: 'd4-threats',
        title: 'Threats & Attacks',
        bullets: [
          'DoS/DDoS, MitM, Phishing, Ransomware, Social Engineering, SQLi, XSS',
        ],
      },
      {
        id: 'd4-tools',
        title: 'Tools & Controls',
        bullets: [
          'Firewall, IDS, IPS, SIEM, VPN, WAF, Honeypots',
          'Segmentation, DMZ, Zero Trust',
          'Wireless: WPA2, WPA3, rogue APs',
        ],
      },
    ],
  },
  {
    id: 'D5',
    title: 'Security Operations',
    short: 'Data security, encryption, hardening, awareness',
    emoji: '🔒',
    color: '#ef4444',
    modules: [
      {
        id: 'd5-data',
        title: 'Data Security',
        bullets: [
          'Lifecycle: Create → Store → Use → Share → Archive → Destroy',
          'Classification: Highly Restricted → Moderately Restricted → Low Sensitivity → Unrestricted',
          'Destruction: Clearing (overwrite), Purging (degauss), Physical destruction',
        ],
      },
      {
        id: 'd5-log',
        title: 'Logging & Monitoring',
        bullets: ['Logs support forensics + accountability'],
      },
      {
        id: 'd5-crypto',
        title: 'Encryption',
        bullets: [
          'Symmetric: AES, DES',
          'Asymmetric: RSA',
          'Hashing: SHA, MD5 (broken)',
          'PKI, digital certs, digital signatures',
        ],
      },
      {
        id: 'd5-config',
        title: 'Config Management',
        bullets: [
          'Hardening: reduce attack surface, patch, disable unused services',
          'Baseline, change management, patch management',
        ],
      },
      {
        id: 'd5-aware',
        title: 'Awareness Training',
        bullets: ['Phishing sims, regular training, clean desk policy'],
      },
    ],
  },
];

export const DOMAIN_BY_ID: Record<DomainId, DomainMeta> = Object.fromEntries(
  DOMAINS.map((d) => [d.id, d]),
) as Record<DomainId, DomainMeta>;
