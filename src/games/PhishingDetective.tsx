import { useState } from 'react';
import { useStore } from '../store';

type RedFlag = { label: string; matches: RegExp; tip: string };

type Email = {
  from: string;
  subject: string;
  body: string;
  flags: RedFlag[];
};

const EMAILS: Email[] = [
  {
    from: 'security@meg4corp-it.com',
    subject: 'URGENT: Password expires in 1 hour — verify now',
    body: 'Click here http://megacorp-it-login.help.ru to verify your password or your account will be permanently locked. Failure to comply will result in termination.',
    flags: [
      { label: 'Spoofed sender domain', matches: /meg4corp-it/i, tip: 'Lookalike domain — "meg4corp-it" is not the real company.' },
      { label: 'Urgent pressure', matches: /urgent|1 hour|permanently/i, tip: 'Urgency is a classic phishing pressure tactic.' },
      { label: 'Suspicious link', matches: /megacorp-it-login\.help\.ru/i, tip: 'Mismatched and foreign-TLD URL — never click.' },
    ],
  },
  {
    from: 'ceo@megacorp.com',
    subject: 'Quick favor — gift cards for the board',
    body: 'I am in a board meeting and need 5 Apple gift cards ASAP. Buy them and send me the codes by reply. I will reimburse you. Do not call.',
    flags: [
      { label: 'CEO impersonation (BEC)', matches: /board|gift cards/i, tip: 'Classic business-email-compromise pretext.' },
      { label: '"Do not call" — bypassing verification', matches: /do not call|asap/i, tip: 'Attackers discourage out-of-band verification.' },
      { label: 'Gift card payment', matches: /gift card/i, tip: 'Legit business never reimburses via gift cards.' },
    ],
  },
  {
    from: 'hr-payroll@megacorp.com',
    subject: 'Your bonus deposit — confirm bank details',
    body: 'Please open the attached BONUS.zip and confirm your routing number to receive your bonus. Reply with your SSN to verify identity.',
    flags: [
      { label: 'Malicious attachment', matches: /\.zip/i, tip: 'Zips often hide executables/malware.' },
      { label: 'Asks for SSN', matches: /ssn/i, tip: 'HR never collects SSN via email.' },
      { label: 'Out-of-process payroll change', matches: /routing number/i, tip: 'Banking changes should go through HR portal, not email.' },
    ],
  },
];

export default function PhishingDetective() {
  const [idx, setIdx] = useState(0);
  const [flagged, setFlagged] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [score, setScore] = useState(0);
  const addXP = useStore((s) => s.addXP);
  const email = EMAILS[idx];

  function click(text: string, sentence: string) {
    if (done) return;
    for (const f of email.flags) {
      if (f.matches.test(sentence) && !flagged.includes(f.label)) {
        setFlagged((arr) => [...arr, f.label]);
        return;
      }
    }
    // wrong click
  }

  function next() {
    const got = flagged.length;
    setScore((s) => s + got);
    if (idx === EMAILS.length - 1) {
      setDone(true);
      const total = EMAILS.reduce((s, e) => s + e.flags.length, 0);
      const totalCorrect = score + got;
      addXP(20 + totalCorrect * 5);
    } else {
      setIdx(idx + 1);
      setFlagged([]);
    }
  }

  if (done) {
    const total = EMAILS.reduce((s, e) => s + e.flags.length, 0);
    return (
      <div className="card max-w-lg mx-auto text-center">
        <h2 className="text-2xl font-bold">Detective Score</h2>
        <p className="text-text-secondary mt-1">{score} / {total} red flags caught.</p>
        <button className="btn-primary mt-4" onClick={() => { setIdx(0); setFlagged([]); setScore(0); setDone(false); }}>Play again</button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-3">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold gradient-text">Phishing Detective</h1>
        <span className="text-sm font-mono text-text-secondary">Email {idx + 1} / {EMAILS.length}</span>
      </header>
      <p className="text-xs text-text-secondary">Click suspicious words or phrases. Find all the red flags before hitting Next.</p>

      <div className="card font-mono text-sm whitespace-pre-wrap">
        <div className="text-text-secondary text-xs">From: <span className="cursor-pointer hover:underline" onClick={() => click(email.from, email.from)}>{email.from}</span></div>
        <div className="text-text-secondary text-xs">Subject: <span className="cursor-pointer hover:underline" onClick={() => click(email.subject, email.subject)}>{email.subject}</span></div>
        <div className="mt-3 leading-relaxed">
          {email.body.split(/(\s+)/).map((tok, i) => (
            <span
              key={i}
              className="hover:bg-warning/20 cursor-pointer rounded px-0.5"
              onClick={() => click(tok, email.body)}
            >
              {tok}
            </span>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-2">
        {email.flags.map((f) => {
          const got = flagged.includes(f.label);
          return (
            <div key={f.label} className={'rounded-lg p-2 text-xs border ' + (got ? 'border-success bg-success/10' : 'border-border opacity-70')}>
              <div className="font-bold">{got ? '✓ ' : '? '}{f.label}</div>
              {got && <div className="text-text-secondary mt-1">{f.tip}</div>}
            </div>
          );
        })}
      </div>

      <button className="btn-primary w-full" onClick={next}>{idx === EMAILS.length - 1 ? 'Finish' : 'Next email'}</button>
    </div>
  );
}
