export const TIPS = [
  'Avoidance is the only treatment that eliminates a risk entirely — by removing the activity that creates it.',
  'IDS detects. IPS prevents. Remember: P for prevent.',
  'CIA = Confidentiality, Integrity, Availability. Most threats map cleanly to one of them.',
  'Mitigation is the most common risk treatment — controls applied to reduce likelihood or impact.',
  'RTO = how fast back up. RPO = how much data loss tolerated.',
  'Defense in depth: assume one control will fail. Layer multiple.',
  'Least Privilege beats Most Convenient. Always.',
  'Phishing is the #1 initial-access vector. Train users like you patch servers.',
  'Symmetric = fast, key sharing tricky. Asymmetric = slow, solves key sharing.',
  'Hashing is one-way. If your hash can be reversed, it’s not hashing.',
  'Subjects act. Objects are acted upon. Don’t mix them up.',
  'A breach involves loss of control of PII/PHI — not every event is a breach.',
];

export function tipForDay(): string {
  const day = Math.floor(Date.now() / 86400000);
  return TIPS[day % TIPS.length];
}
