import { DomainId } from '../lib/storage';

export type StoryChoice = {
  label: string;
  correct?: boolean;
  feedback: string;
  xp: number;
};

export type StoryScene = {
  narrator?: string;
  alex?: string;
  system?: string;
  art: 'soc' | 'ransom' | 'insider' | 'network' | 'vault';
  question?: string;
  choices?: StoryChoice[];
};

export type StoryChapter = {
  id: string;
  domain: DomainId;
  title: string;
  subtitle: string;
  scenes: StoryScene[];
  stub?: boolean;
};

export const CHAPTERS: StoryChapter[] = [
  {
    id: 'ch1',
    domain: 'D1',
    title: 'The Leak',
    subtitle: 'Customer data is leaking from MegaCorp. Find the failure.',
    scenes: [
      {
        narrator: '11:47 PM. MegaCorp HQ. Security Operations Center.',
        alex: '"These DB queries look wrong. Someone pulled customer records 3 weeks straight."',
        system: 'ANOMALY: 847 unauthorized exports | customer_records_2024.db | src: 192.168.1.147 [INTERNAL]',
        art: 'soc',
        question: 'What does Alex do first?',
        choices: [
          { label: '🔍 Investigate the IP quietly, alone', feedback: 'Solo IR violates the Preparation phase — incident response is a team sport from the start.', xp: -10, correct: false },
          { label: '📢 Alert the security team & management immediately', feedback: 'Correct. Detection → Analysis → Team activation. Cross-functional response is the standard.', xp: 25, correct: true },
          { label: '🔒 Lock the entire database without notice', feedback: 'Premature containment can destroy evidence and cause business outage. Coordinate first.', xp: -5, correct: false },
          { label: '📧 Email all employees asking who did it', feedback: 'Tips off the insider, contaminates the investigation, leaks PII context broadly.', xp: -10, correct: false },
        ],
      },
      {
        alex: '"The security lead asks me to classify the failure. Which CIA pillar took the hit?"',
        system: '847 customer PII records exfiltrated. Data was correct, available — but exposed.',
        art: 'soc',
        question: 'Which CIA pillar was violated?',
        choices: [
          { label: 'Confidentiality', feedback: 'Correct. Unauthorized disclosure = confidentiality breach. Records were intact and available — just exposed.', xp: 25, correct: true },
          { label: 'Integrity', feedback: 'Integrity means unauthorized modification. Data wasn’t altered — it was exfiltrated.', xp: -5, correct: false },
          { label: 'Availability', feedback: 'Availability means access when needed. Records remained available.', xp: -5, correct: false },
          { label: 'Non-repudiation', feedback: 'Non-repudiation is a property, not a CIA pillar.', xp: -5, correct: false },
        ],
      },
      {
        alex: '"The source IP belongs to a contractor laptop. Internal subnet. They’ve been quiet for weeks."',
        system: 'Threat actor profile required.',
        art: 'insider',
        question: 'What kind of threat actor are we looking at?',
        choices: [
          { label: 'Insider', feedback: 'Correct. Authorized internal access being abused = insider threat.', xp: 25, correct: true },
          { label: 'Nation-state', feedback: 'No nation-state TTPs observed; source is an internal contractor laptop.', xp: -5, correct: false },
          { label: 'Hacktivist', feedback: 'Hacktivists pursue political aims publicly — this is quiet exfiltration.', xp: -5, correct: false },
          { label: 'Script kiddie', feedback: 'This is a sustained 3-week exfiltration with internal access — not a script kiddie.', xp: -5, correct: false },
        ],
      },
      {
        alex: '"Legal asks how we’re treating the residual risk going forward."',
        system: 'Choose a risk treatment for the long-term policy gap.',
        art: 'soc',
        question: 'What risk treatment should the policy commit to?',
        choices: [
          { label: 'Accept — it’s rare', feedback: 'Acceptance for a known PII exfiltration vector is rarely defensible.', xp: -10, correct: false },
          { label: 'Avoid — stop having contractors', feedback: 'Eliminating the business activity is overkill and impractical.', xp: -5, correct: false },
          { label: 'Mitigate — DLP, least privilege, monitoring', feedback: 'Correct. The most common, defensible treatment: layer controls to reduce likelihood + impact.', xp: 30, correct: true },
          { label: 'Transfer — buy insurance and move on', feedback: 'Transfer covers some financial impact but does not fix the underlying control gap.', xp: -5, correct: false },
        ],
      },
      {
        narrator: '4:12 AM. The contractor account is locked. PII disclosure reported to leadership and counsel. Alex updates the playbook with what worked.',
        alex: '"One down. Four to go."',
        art: 'soc',
      },
    ],
  },
  { id: 'ch2', domain: 'D2', title: 'The Ransomware', subtitle: 'MegaCorp hit at 2 AM. Execute IR → BC → DR.', scenes: [], stub: true },
  { id: 'ch3', domain: 'D3', title: 'The Insider', subtitle: 'Someone is reading files they shouldn’t. Lock it down.', scenes: [], stub: true },
  { id: 'ch4', domain: 'D4', title: 'The Network Intruder', subtitle: 'Lateral movement detected. Trace and harden.', scenes: [], stub: true },
  { id: 'ch5', domain: 'D5', title: 'The Whistleblower', subtitle: 'Encrypted files surface. Handle data with care.', scenes: [], stub: true },
];

export const CHAPTER_BY_ID = Object.fromEntries(CHAPTERS.map((c) => [c.id, c]));
