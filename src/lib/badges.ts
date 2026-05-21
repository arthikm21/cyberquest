export type Badge = {
  id: string;
  emoji: string;
  name: string;
  desc: string;
};

export const BADGES: Badge[] = [
  { id: 'cia_guardian', emoji: '🛡️', name: 'CIA Guardian', desc: 'Complete D1: Security Principles' },
  { id: 'incident_handler', emoji: '🚨', name: 'Incident Handler', desc: 'Complete D2: IR/BC/DR' },
  { id: 'access_gatekeeper', emoji: '🔐', name: 'Access Gatekeeper', desc: 'Complete D3: Access Control' },
  { id: 'network_defender', emoji: '🌐', name: 'Network Defender', desc: 'Complete D4: Network Security' },
  { id: 'security_operator', emoji: '🔒', name: 'Security Operator', desc: 'Complete D5: Security Operations' },
  { id: 'cc_champion', emoji: '🏆', name: 'CC Champion', desc: 'Complete all 5 domains' },
  { id: 'on_fire', emoji: '🔥', name: 'On Fire', desc: '7-day streak' },
  { id: 'speed_demon', emoji: '⚡', name: 'Speed Demon', desc: 'Finish a timed quiz under half the time' },
  { id: 'sharpshooter', emoji: '🎯', name: 'Sharpshooter', desc: '10 correct quiz answers in a row' },
  { id: 'encyclopedia', emoji: '🧠', name: 'Encyclopedia', desc: 'Master all flashcards' },
];

export const BADGE_BY_ID: Record<string, Badge> = Object.fromEntries(BADGES.map((b) => [b.id, b]));
