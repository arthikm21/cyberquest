import { Question } from './types';

export const QUESTIONS: Question[] = [
  // =====================================================================
  // D1 — SECURITY PRINCIPLES (target 156 ; current count below tracked in summary)
  // =====================================================================

  // ---- D1.CIA.Definition ----
  {
    id: 'd1-q1', domain: 'D1', subObjective: 'D1.CIA.Definition', difficulty: 1, type: 'mc',
    question: 'What does the "A" in the CIA triad stand for?',
    options: ['Authentication', 'Authorization', 'Availability', 'Accountability'],
    correct: 2,
    explanation: {
      why_correct: 'Availability — authorized users have timely, reliable access to data and systems when needed.',
      why_wrong: [
        'Authentication verifies identity; it is not part of the CIA triad.',
        'Authorization grants permissions to an authenticated entity; it supports access decisions but is not part of CIA.',
        'Accountability ties actions to a unique actor; it supports CIA but is not one of the three pillars.',
      ],
      mnemonic: 'CIA = Confidential, Intact, Accessible.',
      refModuleId: 'd1-cia',
    },
  },
  {
    id: 'd1-q13', domain: 'D1', subObjective: 'D1.CIA.Definition', difficulty: 1, type: 'mc',
    question: 'Encrypting data at rest primarily protects which CIA pillar?',
    options: ['Confidentiality', 'Integrity', 'Availability', 'Non-repudiation'],
    correct: 0,
    explanation: {
      why_correct: 'Encryption renders data unreadable without the key, preventing unauthorized disclosure — confidentiality.',
      why_wrong: [
        'Integrity (no unauthorized modification) is enforced by hashes and digital signatures, not encryption alone.',
        'Availability concerns access when needed; encryption can hurt availability if keys are lost.',
        'Non-repudiation is a property of digital signatures, not raw encryption.',
      ],
      refModuleId: 'd1-cia',
    },
  },
  {
    id: 'd1-q14', domain: 'D1', subObjective: 'D1.CIA.Definition', difficulty: 2, type: 'mc',
    question: 'A backup system that produces an immutable nightly snapshot most directly protects which pillar?',
    options: ['Confidentiality only', 'Integrity', 'Availability', 'Both Integrity AND Availability'],
    correct: 3,
    explanation: {
      why_correct: 'Immutable backups guard against tampering (integrity) AND ensure the data can be restored when production fails (availability).',
      why_wrong: [
        'Backups alone are not a confidentiality control — they protect the data from loss, not from disclosure.',
        'Integrity alone is partial: immutability covers integrity, but recovery enables availability too.',
        'Availability alone is partial: immutability also blocks attackers from altering historical state.',
      ],
      refModuleId: 'd1-cia',
    },
  },
  {
    id: 'd1-q15', domain: 'D1', subObjective: 'D1.CIA.Definition', difficulty: 3, type: 'mc',
    question: 'A finance team reports their accounting database returns slightly different totals each query. Production was unaffected last week. Which CIA pillar appears compromised?',
    options: ['Confidentiality', 'Integrity', 'Availability', 'Authentication'],
    correct: 1,
    explanation: {
      why_correct: 'Data that should be deterministic returning different values indicates unauthorized or unintended modification — an integrity failure.',
      why_wrong: [
        'No indication of unauthorized disclosure of the data to external parties.',
        'The system is responding, so availability is not the primary failure.',
        'Authentication is not part of the CIA triad — and there is no auth-failure symptom described.',
      ],
      refModuleId: 'd1-cia',
    },
  },

  // ---- D1.CIA.DAD ----
  {
    id: 'd1-q16', domain: 'D1', subObjective: 'D1.CIA.DAD', difficulty: 1, type: 'mc',
    question: 'DAD is the opposite of CIA. What does each letter mean?',
    options: [
      'Disclosure / Alteration / Destruction',
      'Detection / Analysis / Defense',
      'Denial / Access / Disclosure',
      'Disclosure / Authentication / Destruction',
    ],
    correct: 0,
    explanation: {
      why_correct: 'DAD is the threat-side mirror of CIA — Disclosure (loss of confidentiality), Alteration (loss of integrity), Destruction (loss of availability).',
      why_wrong: [
        'Detection / Analysis / Defense maps to incident response phases, not the DAD model.',
        '"Denial / Access / Disclosure" is a made-up sequence — Denial of availability is correct but the others are wrong.',
        'Authentication is not part of DAD; the model only mirrors C, I, A.',
      ],
      mnemonic: 'D-A-D mirrors C-I-A in order.',
      refModuleId: 'd1-cia',
    },
  },

  // ---- D1.DataTypes.PII ----
  {
    id: 'd1-q3', domain: 'D1', subObjective: 'D1.DataTypes.PII', difficulty: 1, type: 'mc',
    question: 'PII stands for...',
    options: [
      'Personally Identifiable Information',
      'Private Internet Identity',
      'Protected Internal Info',
      'Personal Insurance ID',
    ],
    correct: 0,
    explanation: {
      why_correct: 'PII = Personally Identifiable Information. Examples: full name with SSN, name with DOB and address.',
      why_wrong: [
        '"Private Internet Identity" is not a standard term.',
        '"Protected Internal Info" is not standard; PHI is the medical analogue.',
        'PII is broader than insurance IDs; insurance IDs are one example, not the definition.',
      ],
      refModuleId: 'd1-cia',
    },
  },
  {
    id: 'd1-q17', domain: 'D1', subObjective: 'D1.DataTypes.PII', difficulty: 2, type: 'mc',
    question: 'Which of the following alone is LEAST useful for personally identifying a specific individual?',
    options: [
      'A first name like "John"',
      'A passport number',
      'A driver license number',
      'A Social Security Number',
    ],
    correct: 0,
    explanation: {
      why_correct: 'A common first name without any other attribute cannot uniquely identify a person and is generally not PII on its own.',
      why_wrong: [
        'Passport numbers are unique identifiers issued to a specific person — strong PII.',
        'Driver license numbers are unique identifiers — strong PII.',
        'SSNs uniquely identify a person in the US — the canonical strong PII identifier.',
      ],
      refModuleId: 'd1-cia',
    },
  },
  {
    id: 'd1-q18', domain: 'D1', subObjective: 'D1.DataTypes.PII', difficulty: 3, type: 'mc',
    question: 'A marketing team plans to publish an analytics report with users\' approximate ZIP, birth year, and gender. Why is this still a privacy risk?',
    options: [
      'It contains an SSN-like identifier',
      'The combination of quasi-identifiers can re-identify individuals',
      'It is encrypted, which legally counts as PII',
      'ZIP codes are protected by HIPAA',
    ],
    correct: 1,
    explanation: {
      why_correct: 'Combinations of quasi-identifiers (ZIP + DOB + gender) can re-identify a large fraction of a population — a well-documented privacy attack.',
      why_wrong: [
        'No SSN-like field is present; the risk comes from the combination.',
        'Encryption status does not transform a field into PII; the data is what is PII.',
        'HIPAA covers PHI in covered entities, not ZIPs broadly.',
      ],
      refModuleId: 'd1-cia',
    },
  },

  // ---- D1.DataTypes.PHI ----
  {
    id: 'd1-q9', domain: 'D1', subObjective: 'D1.DataTypes.PHI', difficulty: 1, type: 'mc',
    question: 'HIPAA protects what kind of data?',
    options: ['Financial transactions', 'PHI (Protected Health Information)', 'Student academic records', 'Trade secrets'],
    correct: 1,
    explanation: {
      why_correct: 'HIPAA protects PHI — individually identifiable health information held by covered entities and business associates.',
      why_wrong: [
        'Financial transactions are covered by GLBA, PCI-DSS, and SOX in different ways — not HIPAA.',
        'Student academic records are covered by FERPA in the US.',
        'Trade secrets are protected by IP and contract law, not HIPAA.',
      ],
      refModuleId: 'd1-gov',
    },
  },
  {
    id: 'd1-q19', domain: 'D1', subObjective: 'D1.DataTypes.PHI', difficulty: 2, type: 'mc',
    question: 'Which of the following is PHI under HIPAA?',
    options: [
      'A patient name combined with a diagnosis stored by a hospital',
      'A grocery receipt for over-the-counter vitamins',
      'A fitness-watch step count synced to a personal cloud app',
      'A publicly published research paper containing aggregate, de-identified statistics',
    ],
    correct: 0,
    explanation: {
      why_correct: 'PHI = identifiable health information created or held by a HIPAA-covered entity. A hospital storing a name with diagnosis fits squarely.',
      why_wrong: [
        'Grocery receipts are not health records held by a covered entity.',
        'Consumer fitness apps generally are not HIPAA-covered entities; the data is health data but not PHI under HIPAA.',
        'Properly de-identified, aggregated data is no longer PHI.',
      ],
      refModuleId: 'd1-gov',
    },
  },

  // ---- D1.Risk.Treatments ----
  {
    id: 'd1-q2', domain: 'D1', subObjective: 'D1.Risk.Treatments', difficulty: 1, type: 'mc',
    question: 'Which risk treatment stops the risky activity entirely?',
    options: ['Acceptance', 'Avoidance', 'Mitigation', 'Transfer'],
    correct: 1,
    explanation: {
      why_correct: 'Avoidance eliminates the source of the risk by discontinuing the activity.',
      why_wrong: [
        'Acceptance lives with the risk; the activity continues.',
        'Mitigation reduces likelihood or impact via controls but the activity continues.',
        'Transfer shifts financial impact (insurance, contracts) without eliminating the activity.',
      ],
      refModuleId: 'd1-risk',
    },
  },
  {
    id: 'd1-q8', domain: 'D1', subObjective: 'D1.Risk.Treatments', difficulty: 1, type: 'mc',
    question: 'The most common risk treatment is:',
    options: ['Acceptance', 'Avoidance', 'Mitigation', 'Transfer'],
    correct: 2,
    explanation: {
      why_correct: 'Mitigation — applying controls to reduce likelihood or impact — is the most common treatment because most business risks cannot be eliminated entirely.',
      why_wrong: [
        'Acceptance is reserved for low-impact or low-likelihood risks where treatment cost outweighs benefit.',
        'Avoidance requires stopping the activity — often impractical for revenue-generating processes.',
        'Transfer (insurance, outsourcing) shifts financial impact but does not address operational risk in most cases.',
      ],
      refModuleId: 'd1-risk',
    },
  },
  {
    id: 'd1-q20', domain: 'D1', subObjective: 'D1.Risk.Treatments', difficulty: 3, type: 'mc',
    question: 'A small office accepts that a freak storm could damage a single back-up server because replacement is cheap and the probability is low. Which treatment is this?',
    options: ['Avoidance', 'Mitigation', 'Acceptance', 'Transfer'],
    correct: 2,
    explanation: {
      why_correct: 'They have chosen to live with the risk because the cost of treatment is not justified — that is acceptance, formally documented.',
      why_wrong: [
        'Avoidance would require discontinuing the activity (e.g., not having a backup server) — not the choice made.',
        'Mitigation would mean installing controls (lightning protection, redundant hardware) to reduce likelihood or impact.',
        'Transfer would mean buying insurance to shift the financial cost.',
      ],
      refModuleId: 'd1-risk',
    },
  },
  {
    id: 'd1-q21', domain: 'D1', subObjective: 'D1.Risk.Treatments', difficulty: 3, type: 'mc',
    question: 'A logistics company buys cyber-insurance to cover ransomware payouts. Which treatment is this?',
    options: ['Mitigation', 'Transfer', 'Avoidance', 'Acceptance'],
    correct: 1,
    explanation: {
      why_correct: 'Insurance shifts the financial impact of the risk to a third party — the textbook definition of risk transfer.',
      why_wrong: [
        'Mitigation requires controls reducing the likelihood or impact of the event itself; insurance does not prevent the attack.',
        'Avoidance would require ceasing the operation that creates the exposure; the company is continuing operations.',
        'Acceptance means taking no formal action; buying insurance is an explicit treatment, not acceptance.',
      ],
      refModuleId: 'd1-risk',
    },
  },
  {
    id: 'd1-q22', domain: 'D1', subObjective: 'D1.Risk.Treatments', difficulty: 2, type: 'multi',
    question: 'Select ALL treatments that leave residual risk after they are applied.',
    options: ['Avoidance', 'Mitigation', 'Transfer', 'Acceptance'],
    correct: [1, 2, 3],
    explanation: {
      why_correct: 'Mitigation reduces but does not eliminate (residual remains), transfer shifts financial impact (operational residual remains), acceptance retains the full residual. Only avoidance discontinues the activity entirely, eliminating residual.',
      why_wrong: [
        'Avoidance is the one treatment that removes residual risk — discontinue the activity and there is nothing left to manage.',
      ],
      refModuleId: 'd1-risk',
    },
  },

  // ---- D1.Risk.Formula ----
  {
    id: 'd1-q23', domain: 'D1', subObjective: 'D1.Risk.Formula', difficulty: 1, type: 'mc',
    question: 'Risk is best expressed as:',
    options: [
      'Threat × Vulnerability ÷ Control',
      'Likelihood × Impact',
      'Cost × Benefit',
      'Asset × Recovery time',
    ],
    correct: 1,
    explanation: {
      why_correct: 'Risk is conventionally Likelihood × Impact — how probable an adverse event is, multiplied by how much harm it would cause.',
      why_wrong: [
        'No standard risk model uses control as a divisor in the base formula.',
        'Cost × Benefit describes business case analysis, not risk.',
        'Asset × Recovery time has no defined meaning.',
      ],
      refModuleId: 'd1-risk',
    },
  },

  // ---- D1.Risk.Quantitative ----
  {
    id: 'd1-q24', domain: 'D1', subObjective: 'D1.Risk.Quantitative', difficulty: 2, type: 'mc',
    question: 'SLE (Single Loss Expectancy) is calculated as:',
    options: [
      'Asset Value × Exposure Factor',
      'Asset Value × Annual Rate of Occurrence',
      'Exposure Factor × Annual Rate of Occurrence',
      'Asset Value ÷ Exposure Factor',
    ],
    correct: 0,
    explanation: {
      why_correct: 'SLE = AV × EF — the loss from a single event equals the asset value times the percentage of asset lost in that event.',
      why_wrong: [
        'AV × ARO has no standard meaning by itself; ARO is used to derive ALE from SLE.',
        'EF × ARO is not a defined CC/ISC2 formula.',
        'SLE is a product, not a ratio.',
      ],
      mnemonic: 'SLE = AV × EF; ALE = SLE × ARO.',
      refModuleId: 'd1-risk',
    },
  },
  {
    id: 'd1-q25', domain: 'D1', subObjective: 'D1.Risk.Quantitative', difficulty: 2, type: 'mc',
    question: 'ALE (Annualized Loss Expectancy) is calculated as:',
    options: [
      'SLE × ARO',
      'AV × EF',
      'AV ÷ ARO',
      'SLE ÷ EF',
    ],
    correct: 0,
    explanation: {
      why_correct: 'ALE = SLE × ARO. Loss per event multiplied by events per year yields expected annual loss.',
      why_wrong: [
        'AV × EF is the formula for SLE, not ALE.',
        'AV ÷ ARO has no standard meaning.',
        'SLE ÷ EF is not a defined formula.',
      ],
      refModuleId: 'd1-risk',
    },
  },
  {
    id: 'd1-q26', domain: 'D1', subObjective: 'D1.Risk.Quantitative', difficulty: 3, type: 'mc',
    question: 'An asset is worth $200,000. A flood would destroy 25% of its value, and the regional flood ARO is 0.1. What is the ALE?',
    options: ['$5,000', '$50,000', '$20,000', '$200,000'],
    correct: 0,
    explanation: {
      why_correct: 'SLE = $200,000 × 0.25 = $50,000. ALE = $50,000 × 0.1 = $5,000.',
      why_wrong: [
        '$50,000 is the SLE (per-event loss), not annualized.',
        '$20,000 mixes the numbers incorrectly.',
        '$200,000 is the full asset value, not a loss expectancy.',
      ],
      refModuleId: 'd1-risk',
    },
  },

  // ---- D1.Risk.Qualitative ----
  {
    id: 'd1-q11', domain: 'D1', subObjective: 'D1.Risk.Qualitative', difficulty: 1, type: 'tf',
    question: 'Quantitative risk analysis uses subjective labels like High / Medium / Low.',
    options: ['True', 'False'],
    correct: 1,
    explanation: {
      why_correct: 'False. Qualitative uses subjective labels (H/M/L). Quantitative uses numbers (ALE, SLE, ARO, EF).',
      why_wrong: [
        'True is wrong — subjective labels are the hallmark of QUALITATIVE analysis. Quantitative analysis assigns concrete numeric values.',
      ],
      refModuleId: 'd1-risk',
    },
  },
  {
    id: 'd1-q27', domain: 'D1', subObjective: 'D1.Risk.Qualitative', difficulty: 2, type: 'mc',
    question: 'A small NGO with no actuarial data needs a fast risk assessment. Which analysis style fits best?',
    options: ['Quantitative — assign dollar values to every asset', 'Qualitative — High/Medium/Low ratings', 'Skip the assessment until data is available', 'Outsource to an insurer'],
    correct: 1,
    explanation: {
      why_correct: 'Qualitative analysis is fast and works without monetary baselines — ideal where data and time are scarce.',
      why_wrong: [
        'Quantitative requires numeric inputs the NGO does not have.',
        'Skipping leaves the org blind; a rough qualitative pass is better than nothing.',
        'Outsourcing to an insurer biases the output toward insurable risks and delays internal planning.',
      ],
      refModuleId: 'd1-risk',
    },
  },

  // ---- D1.Controls.Categories ----
  {
    id: 'd1-q4', domain: 'D1', subObjective: 'D1.Controls.Categories', difficulty: 1, type: 'mc',
    question: 'Which is NOT one of the three security control categories?',
    options: ['Physical', 'Technical', 'Operational', 'Administrative'],
    correct: 2,
    explanation: {
      why_correct: 'The three categories are Physical, Technical, and Administrative. "Operational" sounds plausible but is not the standard CC category.',
      why_wrong: [
        'Physical is one of the three categories (locks, badges, guards).',
        'Technical is one of the three (firewalls, encryption, MFA).',
        'Administrative is one of the three (policies, training, background checks).',
      ],
      mnemonic: 'PTA — Physical, Technical, Administrative.',
      refModuleId: 'd1-controls',
    },
  },
  {
    id: 'd1-q28', domain: 'D1', subObjective: 'D1.Controls.Categories', difficulty: 2, type: 'mc',
    question: 'A mandatory annual security training program is which control category?',
    options: ['Physical', 'Technical', 'Administrative', 'Compensating'],
    correct: 2,
    explanation: {
      why_correct: 'Training is implemented through policy and people processes — administrative.',
      why_wrong: [
        'Physical controls are tangible barriers (locks, fences).',
        'Technical controls are implemented in hardware/software (firewalls, MFA).',
        'Compensating is a control FUNCTION, not a category.',
      ],
      refModuleId: 'd1-controls',
    },
  },
  {
    id: 'd1-q29', domain: 'D1', subObjective: 'D1.Controls.Categories', difficulty: 2, type: 'mc',
    question: 'An access badge reader at the data-center door is which category?',
    options: ['Administrative', 'Physical', 'Technical', 'Both Physical AND Technical'],
    correct: 3,
    explanation: {
      why_correct: 'Badge readers blend physical (control physical access to a space) and technical (electronics enforce the decision). CC commonly classifies them as both.',
      why_wrong: [
        'It is not enforced through policy alone, so not Administrative.',
        'Physical alone misses the technical enforcement; the badge logic is electronic.',
        'Technical alone misses the physical barrier role.',
      ],
      refModuleId: 'd1-controls',
    },
  },

  // ---- D1.Controls.Functions ----
  {
    id: 'd1-q30', domain: 'D1', subObjective: 'D1.Controls.Functions', difficulty: 1, type: 'mc',
    question: 'Which control function attempts to discourage an attacker without physically blocking them?',
    options: ['Preventive', 'Detective', 'Deterrent', 'Corrective'],
    correct: 2,
    explanation: {
      why_correct: 'Deterrent controls aim to dissuade — signs, visible cameras, lighting.',
      why_wrong: [
        'Preventive controls stop the action (locked door).',
        'Detective controls identify that the action occurred (alarm, logs).',
        'Corrective controls restore state after the event (backup restore).',
      ],
      mnemonic: 'PDCDCD: Preventive, Detective, Corrective, Deterrent, Compensating, Directive.',
      refModuleId: 'd1-controls',
    },
  },
  {
    id: 'd1-q31', domain: 'D1', subObjective: 'D1.Controls.Functions', difficulty: 2, type: 'mc',
    question: 'A SIEM alert that pages the on-call analyst when a privileged account logs in at 03:00 is which control function?',
    options: ['Preventive', 'Detective', 'Compensating', 'Directive'],
    correct: 1,
    explanation: {
      why_correct: 'An alert does not stop the action — it identifies that the action occurred so humans can respond. That is detective.',
      why_wrong: [
        'Preventive would actively block the login (e.g., MFA challenge that fails).',
        'Compensating is a substitute when the primary control cannot be used; alerts are direct detection, not a substitute.',
        'Directive controls instruct people what to do (policies, procedures).',
      ],
      refModuleId: 'd1-controls',
    },
  },
  {
    id: 'd1-q32', domain: 'D1', subObjective: 'D1.Controls.Functions', difficulty: 3, type: 'mc',
    question: 'A regulator requires MFA on remote VPN, but a legacy contractor cannot install the MFA agent. The team enables IP allow-listing plus a daily audit of contractor logins. The allow-list + audit combination is best described as:',
    options: ['Preventive', 'Detective', 'Compensating', 'Deterrent'],
    correct: 2,
    explanation: {
      why_correct: 'Compensating controls satisfy the spirit of a requirement when the primary control (MFA) cannot be implemented. IP allow-listing limits access and audits detect misuse — together they compensate for missing MFA.',
      why_wrong: [
        'Preventive is part of the answer but underspecifies the role: this is a substitute for the required control.',
        'Detective alone (audits) does not address the access requirement; only paired with allow-listing.',
        'Deterrent does not match — the goal is satisfying regulator intent, not psychological discouragement.',
      ],
      refModuleId: 'd1-controls',
    },
  },

  // ---- D1.Governance.Hierarchy ----
  {
    id: 'd1-q5', domain: 'D1', subObjective: 'D1.Governance.Hierarchy', difficulty: 1, type: 'mc',
    question: 'Governance hierarchy from top to bottom is:',
    options: [
      'Procedures → Policies → Standards → Regulations',
      'Regulations → Standards → Policies → Procedures',
      'Policies → Regulations → Standards → Procedures',
      'Standards → Policies → Regulations → Procedures',
    ],
    correct: 1,
    explanation: {
      why_correct: 'Regulations (external law) sit at the top, then Standards, then organizational Policies, then specific Procedures (how-to).',
      why_wrong: [
        'Reverses the hierarchy — procedures are the bottom, not the top.',
        'Policies are internal; they do not sit above Regulations.',
        'Standards sit between Regulations and Policies, not above Policies.',
      ],
      mnemonic: 'Regulators sit at the top; people on the floor follow procedures.',
      refModuleId: 'd1-gov',
    },
  },
  {
    id: 'd1-q33', domain: 'D1', subObjective: 'D1.Governance.Hierarchy', difficulty: 2, type: 'mc',
    question: 'A document titled "Password Reset Procedure — Step-by-Step" is at which level of governance?',
    options: ['Regulation', 'Standard', 'Policy', 'Procedure'],
    correct: 3,
    explanation: {
      why_correct: 'Procedures are concrete, step-by-step instructions. The title literally says "step-by-step".',
      why_wrong: [
        'Regulations are external law, not internal step-by-step docs.',
        'Standards define what is required (e.g., 12-char minimum) without describing exact steps.',
        'Policies set high-level expectations ("users must reset passwords every 90 days") not steps.',
      ],
      refModuleId: 'd1-gov',
    },
  },
  {
    id: 'd1-q34', domain: 'D1', subObjective: 'D1.Governance.Hierarchy', difficulty: 2, type: 'mc',
    question: 'A document that says "All employees must complete annual security awareness training" is best classified as a:',
    options: ['Standard', 'Policy', 'Procedure', 'Guideline'],
    correct: 1,
    explanation: {
      why_correct: 'Policies are high-level mandatory statements from management. "All employees must…" is the policy form.',
      why_wrong: [
        'Standards are specific mandatory technical/operational requirements (e.g., "training shall use the SANS curriculum").',
        'Procedures are step-by-step (how to enroll).',
        'Guidelines are recommendations, not mandatory.',
      ],
      refModuleId: 'd1-gov',
    },
  },

  // ---- D1.Governance.Frameworks ----
  {
    id: 'd1-q35', domain: 'D1', subObjective: 'D1.Governance.Frameworks', difficulty: 1, type: 'mc',
    question: 'How many core functions does the NIST Cybersecurity Framework have?',
    options: ['3', '4', '5', '7'],
    correct: 2,
    explanation: {
      why_correct: 'NIST CSF has 5: Identify, Protect, Detect, Respond, Recover. (CSF 2.0 adds Govern as a sixth; CC currently tests the original 5.)',
      why_wrong: [
        '3 is too few — the framework is broader.',
        '4 might be confused with IR phases (NIST 4-phase model).',
        '7 is OSI layers, not CSF functions.',
      ],
      mnemonic: 'I-P-D-R-R: Identify, Protect, Detect, Respond, Recover.',
      refModuleId: 'd1-gov',
    },
  },
  {
    id: 'd1-q36', domain: 'D1', subObjective: 'D1.Governance.Frameworks', difficulty: 2, type: 'mc',
    question: 'ISO/IEC 27001 vs 27002 — which statement is correct?',
    options: [
      '27001 specifies the ISMS requirements; 27002 is implementation guidance for controls',
      '27001 is the control catalog; 27002 is the management standard',
      'They are identical; the numbers are just versions',
      '27002 supersedes 27001 in 2022',
    ],
    correct: 0,
    explanation: {
      why_correct: '27001 is the certifiable management-system standard with requirements for an ISMS; 27002 provides implementation guidance for the controls in 27001 Annex A.',
      why_wrong: [
        'Reversed — 27001 is the requirements doc, 27002 is the guidance.',
        'They are different documents with different purposes.',
        '27002 is a companion guide, not a replacement.',
      ],
      refModuleId: 'd1-gov',
    },
  },
  {
    id: 'd1-q37', domain: 'D1', subObjective: 'D1.Governance.Frameworks', difficulty: 2, type: 'mc',
    question: 'A SOC 2 Type 2 report covers:',
    options: [
      'Controls at a point in time only',
      'Controls operating effectively over a period (typically 6–12 months)',
      'Financial reporting only',
      'Only the design of controls, never operation',
    ],
    correct: 1,
    explanation: {
      why_correct: 'SOC 2 Type 2 attests to design AND operating effectiveness over a period. Type 1 is design-only at a point in time.',
      why_wrong: [
        'Type 1 covers a point in time; Type 2 covers a period.',
        'SOC 1 focuses on financial-reporting-relevant controls, not SOC 2.',
        'Type 1 covers design only; Type 2 always covers operation as well.',
      ],
      refModuleId: 'd1-gov',
    },
  },

  // ---- D1.ThreatActors ----
  {
    id: 'd1-q6', domain: 'D1', subObjective: 'D1.ThreatActors', difficulty: 1, type: 'mc',
    question: 'A threat actor motivated by political or social causes is called a...',
    options: ['Insider', 'Hacktivist', 'Nation-state', 'Script kiddie'],
    correct: 1,
    explanation: {
      why_correct: 'Hacktivists pursue political or social aims — defacements, leaks, denial-of-service to embarrass a target.',
      why_wrong: [
        'Insiders have authorized internal access being abused — different motive set.',
        'Nation-states pursue strategic goals (espionage, sabotage), funded and persistent.',
        'Script kiddies pursue notoriety or thrill with low skill; not primarily political.',
      ],
      refModuleId: 'd1-gov',
    },
  },
  {
    id: 'd1-q12', domain: 'D1', subObjective: 'D1.ThreatActors', difficulty: 1, type: 'mc',
    question: 'A "bot" as a threat actor refers to:',
    options: [
      'An automated program acting on behalf of an attacker',
      'A junior analyst',
      'A backup script',
      'A firewall rule',
    ],
    correct: 0,
    explanation: {
      why_correct: 'Bots are automated agents — typically members of a botnet — used for DDoS, credential stuffing, scanning.',
      why_wrong: [
        'A junior analyst is a human and not a threat actor category.',
        'A backup script is benign automation, not adversarial.',
        'A firewall rule is a control, not an actor.',
      ],
      refModuleId: 'd1-gov',
    },
  },
  {
    id: 'd1-q38', domain: 'D1', subObjective: 'D1.ThreatActors', difficulty: 3, type: 'mc',
    question: 'A sustained, well-resourced campaign that stays inside the network for months and primarily exfiltrates IP is most consistent with which actor profile?',
    options: ['Script kiddie', 'Insider opportunist', 'Nation-state / APT', 'Hacktivist'],
    correct: 2,
    explanation: {
      why_correct: 'Long dwell time, IP theft, and resource depth match Advanced Persistent Threat / nation-state campaigns.',
      why_wrong: [
        'Script kiddies are usually noisy and short-lived.',
        'Insider opportunists tend to take what they can quickly when leaving, not maintain long dwell times.',
        'Hacktivists tend to seek publicity, not silent IP theft.',
      ],
      refModuleId: 'd1-gov',
    },
  },

  // ---- D1.Laws.GDPR ----
  {
    id: 'd1-q39', domain: 'D1', subObjective: 'D1.Laws.GDPR', difficulty: 2, type: 'mc',
    question: 'Under GDPR, which is NOT a recognized data-subject right?',
    options: ['Right to access', 'Right to rectification', 'Right to be forgotten (erasure)', 'Right to be paid for personal data'],
    correct: 3,
    explanation: {
      why_correct: 'GDPR does not grant a right to be paid for personal data. The recognized rights include access, rectification, erasure, restriction, portability, objection, and rights related to automated decision-making.',
      why_wrong: [
        'Access (Art. 15) is a core right.',
        'Rectification (Art. 16) is a core right.',
        'Erasure / right to be forgotten (Art. 17) is a core right.',
      ],
      refModuleId: 'd1-gov',
    },
  },
  {
    id: 'd1-q40', domain: 'D1', subObjective: 'D1.Laws.GDPR', difficulty: 2, type: 'mc',
    question: 'GDPR applies to:',
    options: [
      'Only EU-based companies',
      'Only companies that physically operate in the EU',
      'Any organization processing personal data of people in the EU, regardless of where the org is based',
      'Only government agencies in EU member states',
    ],
    correct: 2,
    explanation: {
      why_correct: 'GDPR has extraterritorial reach (Art. 3): any controller/processor handling EU-resident personal data is covered.',
      why_wrong: [
        'Scope extends well beyond EU-based companies.',
        'Physical presence is not required.',
        'GDPR applies to both private and public sector.',
      ],
      refModuleId: 'd1-gov',
    },
  },

  // ---- D1.Laws.HIPAA / GLBA / FERPA / SOX / PCI ----
  {
    id: 'd1-q41', domain: 'D1', subObjective: 'D1.Laws.GLBA', difficulty: 1, type: 'mc',
    question: 'GLBA primarily protects:',
    options: [
      'Health information',
      'Customer non-public financial information held by financial institutions',
      'Student records',
      'Credit card data',
    ],
    correct: 1,
    explanation: {
      why_correct: 'The Gramm-Leach-Bliley Act protects non-public personal financial information held by financial institutions, including the Safeguards Rule and Privacy Rule.',
      why_wrong: [
        'Health is HIPAA.',
        'Students are FERPA.',
        'Credit cards are PCI-DSS (industry standard, not a US law).',
      ],
      refModuleId: 'd1-gov',
    },
  },
  {
    id: 'd1-q42', domain: 'D1', subObjective: 'D1.Laws.FERPA', difficulty: 1, type: 'mc',
    question: 'FERPA protects:',
    options: ['Patient records', 'Bank statements', 'Student educational records', 'Government classified data'],
    correct: 2,
    explanation: {
      why_correct: 'FERPA (Family Educational Rights and Privacy Act) protects the privacy of student education records at US institutions receiving federal funding.',
      why_wrong: [
        'Patient records are HIPAA territory.',
        'Bank statements relate to GLBA.',
        'Classified data is governed by executive order and DoD classification policies.',
      ],
      refModuleId: 'd1-gov',
    },
  },
  {
    id: 'd1-q43', domain: 'D1', subObjective: 'D1.Laws.SOX', difficulty: 2, type: 'mc',
    question: 'SOX was enacted primarily in response to:',
    options: [
      'Major corporate accounting scandals (e.g., Enron, WorldCom)',
      'A cyber-attack on the US Treasury',
      'A privacy lawsuit against a hospital chain',
      'Bank robberies in the 1990s',
    ],
    correct: 0,
    explanation: {
      why_correct: 'The Sarbanes-Oxley Act (2002) was passed after major accounting fraud scandals; it imposes financial-reporting and internal-control requirements on publicly traded companies in the US.',
      why_wrong: [
        'There was no specific Treasury cyber-event driving SOX.',
        'Privacy lawsuits drive HIPAA-type regulation, not SOX.',
        'SOX is not a law about bank robbery.',
      ],
      refModuleId: 'd1-gov',
    },
  },
  {
    id: 'd1-q44', domain: 'D1', subObjective: 'D1.Laws.PCI', difficulty: 1, type: 'mc',
    question: 'PCI-DSS applies to:',
    options: [
      'Any organization that stores, processes, or transmits payment card data',
      'Only US banks',
      'Only large retailers (Fortune 500)',
      'Only e-commerce sites',
    ],
    correct: 0,
    explanation: {
      why_correct: 'PCI-DSS is a contractual industry standard binding on any entity that stores, processes, or transmits cardholder data — regardless of size or sector.',
      why_wrong: [
        'Banks are involved as acquirers/issuers, but the scope is far broader.',
        'Even small merchants accepting cards are in scope (with reduced requirements).',
        'Brick-and-mortar retailers are equally in scope as e-commerce.',
      ],
      refModuleId: 'd1-gov',
    },
  },

  // ---- D1.Ethics.Canons ----
  {
    id: 'd1-q45', domain: 'D1', subObjective: 'D1.Ethics.Canons', difficulty: 2, type: 'mc',
    question: 'Which is the FIRST canon of the ISC2 Code of Ethics?',
    options: [
      'Protect society, the common good, necessary public trust and confidence, and the infrastructure.',
      'Act honorably, honestly, justly, responsibly, and legally.',
      'Provide diligent and competent service to principals.',
      'Advance and protect the profession.',
    ],
    correct: 0,
    explanation: {
      why_correct: 'Canon I protects society — the broadest obligation and the highest priority.',
      why_wrong: [
        'Canon II — second, not first.',
        'Canon III — third.',
        'Canon IV — fourth.',
      ],
      mnemonic: 'Society → Honor → Principals → Profession.',
      refModuleId: 'd1-ethics',
    },
  },
  {
    id: 'd1-q46', domain: 'D1', subObjective: 'D1.Ethics.Canons', difficulty: 2, type: 'mc',
    question: 'Which canon comes SECOND in the ISC2 Code of Ethics?',
    options: [
      'Protect society and infrastructure',
      'Act honorably, honestly, justly, responsibly, and legally',
      'Provide diligent and competent service to principals',
      'Advance and protect the profession',
    ],
    correct: 1,
    explanation: {
      why_correct: 'Canon II is "Act honorably, honestly, justly, responsibly, and legally."',
      why_wrong: [
        'That is Canon I — first, not second.',
        'That is Canon III — third, not second.',
        'That is Canon IV — fourth, not second.',
      ],
      refModuleId: 'd1-ethics',
    },
  },
  {
    id: 'd1-q47', domain: 'D1', subObjective: 'D1.Ethics.Canons', difficulty: 3, type: 'mc',
    question: 'A vendor offers an ISC2-certified professional a "consulting fee" to recommend their product to a client. Which canon does accepting it most clearly violate?',
    options: [
      'Canon I — protect society',
      'Canon II — act honorably',
      'Canon III — diligent and competent service to principals',
      'Canon IV — advance the profession',
    ],
    correct: 2,
    explanation: {
      why_correct: 'The professional owes diligent and competent service to principals (the client). Undisclosed financial incentive from a vendor compromises that duty — squarely Canon III.',
      why_wrong: [
        'Canon I concerns society at large, not the client relationship.',
        'Canon II covers honor broadly but the specific breach is the principal duty.',
        'Canon IV concerns the profession\'s standing — secondary effect, not the primary violation.',
      ],
      refModuleId: 'd1-ethics',
    },
  },

  // ---- D1.AAA ----
  {
    id: 'd1-q48', domain: 'D1', subObjective: 'D1.AAA', difficulty: 1, type: 'mc',
    question: 'In AAA, the second "A" stands for:',
    options: ['Audit', 'Authorization', 'Accountability', 'Availability'],
    correct: 1,
    explanation: {
      why_correct: 'AAA = Authentication, Authorization, Accounting (sometimes Accountability). The middle A is Authorization.',
      why_wrong: [
        'Audit relates to the third A in some models (Accounting), but Authorization comes first.',
        'Accountability is the third A in some renderings, not the second.',
        'Availability is part of CIA, not AAA.',
      ],
      refModuleId: 'd1-gov',
    },
  },

  // ---- D1.NonRepudiation ----
  {
    id: 'd1-q7', domain: 'D1', subObjective: 'D1.NonRepudiation', difficulty: 1, type: 'mc',
    question: 'Non-repudiation means:',
    options: [
      'A user can deny they performed an action',
      'A user cannot credibly deny they performed an action',
      'Two users cannot share an account',
      'Logs cannot be edited',
    ],
    correct: 1,
    explanation: {
      why_correct: 'Non-repudiation provides cryptographic or strong audit proof binding an actor to an action so it cannot be credibly denied.',
      why_wrong: [
        'That is the opposite — repudiation.',
        'Shared-account prevention is part of identity hygiene, not the definition of non-repudiation.',
        'Log immutability supports non-repudiation but is not its definition.',
      ],
      refModuleId: 'd1-gov',
    },
  },
  {
    id: 'd1-q49', domain: 'D1', subObjective: 'D1.NonRepudiation', difficulty: 2, type: 'mc',
    question: 'Which mechanism best provides non-repudiation for a sent email?',
    options: [
      'TLS in transit',
      'Sender\'s digital signature using their private key',
      'AES encryption of the payload',
      'A password on the mail account',
    ],
    correct: 1,
    explanation: {
      why_correct: 'A digital signature uses the sender\'s private key. Only the sender holds it, so a valid signature proves they (or their key) signed — that is the basis of non-repudiation.',
      why_wrong: [
        'TLS protects transport but does not bind sender identity to the message body.',
        'AES is symmetric encryption — protects confidentiality, not authorship.',
        'A password protects account access but does not cryptographically bind a message.',
      ],
      refModuleId: 'd1-gov',
    },
  },

  // ---- D1.PrivacyVsSecurity ----
  {
    id: 'd1-q50', domain: 'D1', subObjective: 'D1.PrivacyVsSecurity', difficulty: 2, type: 'mc',
    question: 'Which statement best distinguishes privacy from security?',
    options: [
      'Privacy and security are synonyms.',
      'Privacy is about what data is collected and how it is used; security is about protecting data from unauthorized access or modification.',
      'Security applies to PII only; privacy applies to all data.',
      'Privacy is enforced by HIPAA; security is enforced by GDPR.',
    ],
    correct: 1,
    explanation: {
      why_correct: 'Privacy governs collection, use, and disclosure choices; security implements the controls that protect data integrity and confidentiality.',
      why_wrong: [
        'They overlap but are not the same — common trap.',
        'Security covers all data, not only PII.',
        'Both HIPAA and GDPR have privacy AND security components.',
      ],
      refModuleId: 'd1-gov',
    },
  },

  // ---- D1.DataTypes.SPI ----
  {
    id: 'd1-q51', domain: 'D1', subObjective: 'D1.DataTypes.SPI', difficulty: 2, type: 'mc',
    question: 'Sensitive Personal Information (SPI) typically includes which of the following?',
    options: [
      'A person\'s name only',
      'Racial or ethnic origin, religious beliefs, sexual orientation, or genetic data',
      'Office building floor plans',
      'Generic marketing preferences',
    ],
    correct: 1,
    explanation: {
      why_correct: 'SPI (also called "special category data" under GDPR Art. 9) includes especially sensitive attributes — race, religion, sexual orientation, health, genetic, biometric, political opinions, union membership.',
      why_wrong: [
        'A name alone is PII at best, not SPI.',
        'Building plans are sensitive corporate info but not SPI.',
        'Marketing preferences are not legally protected as SPI in most frameworks.',
      ],
      refModuleId: 'd1-cia',
    },
  },

  // ---- D1.Risk.Treatments — more scenarios ----
  {
    id: 'd1-q52', domain: 'D1', subObjective: 'D1.Risk.Treatments', difficulty: 3, type: 'mc',
    question: 'A US-based fintech wants to launch in a country with sanctions exposure. Legal flags it as unacceptable. The CEO decides not to enter the market. Which treatment is this?',
    options: ['Mitigation', 'Avoidance', 'Transfer', 'Acceptance'],
    correct: 1,
    explanation: {
      why_correct: 'Choosing not to enter the market eliminates exposure entirely — avoidance.',
      why_wrong: [
        'Mitigation requires controls reducing the risk while continuing the activity.',
        'Transfer would mean entering and shifting impact (e.g., reinsurance) — not chosen.',
        'Acceptance would mean entering and living with the risk — explicitly rejected.',
      ],
      refModuleId: 'd1-risk',
    },
  },

  // =====================================================================
  // D2 — IR / BC / DR (target 60)
  // =====================================================================

  // ---- D2.IR.Phases ----
  {
    id: 'd2-q1', domain: 'D2', subObjective: 'D2.IR.Phases', difficulty: 1, type: 'mc',
    question: 'Which is the FIRST phase of Incident Response (NIST SP 800-61)?',
    options: ['Detection & Analysis', 'Preparation', 'Containment, Eradication, & Recovery', 'Post-Incident Activity'],
    correct: 1,
    explanation: {
      why_correct: 'Preparation is first — build the team, playbooks, tools, and training before anything happens.',
      why_wrong: [
        'Detection & Analysis is second.',
        'Containment/Eradication/Recovery is third.',
        'Post-Incident Activity is fourth.',
      ],
      mnemonic: 'P → D → C → P (Prep, Detect, Contain, Post).',
      refModuleId: 'd2-ir',
    },
  },
  {
    id: 'd2-q9', domain: 'D2', subObjective: 'D2.IR.Phases', difficulty: 2, type: 'mc',
    question: 'Containment, Eradication, and Recovery are grouped together in which IR model?',
    options: ['NIST 4-phase', 'PCI-DSS', 'GDPR', 'ITIL'],
    correct: 0,
    explanation: {
      why_correct: 'NIST SP 800-61 groups Containment, Eradication, and Recovery into a single phase.',
      why_wrong: [
        'PCI-DSS references IR but does not define this phase structure.',
        'GDPR addresses breach notification timelines, not phase grouping.',
        'ITIL uses different terminology (incident management, problem management).',
      ],
      refModuleId: 'd2-ir',
    },
  },
  {
    id: 'd2-q10', domain: 'D2', subObjective: 'D2.IR.Phases', difficulty: 1, type: 'mc',
    question: 'Post-Incident Activity primarily focuses on:',
    options: [
      'Public relations and customer marketing',
      'Lessons learned, root cause documentation, and control updates',
      'Choosing a new IR vendor',
      'Cancelling the IR plan',
    ],
    correct: 1,
    explanation: {
      why_correct: 'The phase exists to convert the incident into improved defenses — retrospectives, RCA, training updates, playbook tweaks.',
      why_wrong: [
        'PR is downstream and not the primary purpose of this phase.',
        'Choosing vendors is procurement, not an IR phase outcome.',
        'IR plans are revised, not cancelled, after incidents.',
      ],
      refModuleId: 'd2-ir',
    },
  },
  {
    id: 'd2-q52', domain: 'D2', subObjective: 'D2.IR.Phases', difficulty: 3, type: 'mc',
    question: 'During an active intrusion, the team isolates an infected server from the network but leaves it running for memory acquisition. They are in which phase?',
    options: ['Preparation', 'Detection & Analysis', 'Containment, Eradication, & Recovery', 'Post-Incident Activity'],
    correct: 2,
    explanation: {
      why_correct: 'Isolating the host while preserving live state is a containment action that also preserves evidence — squarely within Containment/Eradication/Recovery.',
      why_wrong: [
        'Preparation is pre-incident.',
        'Detection & Analysis is identification and scoping; the action here is containment.',
        'Post-Incident is after recovery completes.',
      ],
      refModuleId: 'd2-ir',
    },
  },

  // ---- D2.IR.Terms ----
  {
    id: 'd2-q4', domain: 'D2', subObjective: 'D2.IR.Terms', difficulty: 1, type: 'mc',
    question: 'A "breach" is best defined as:',
    options: [
      'Any unusual event in a log',
      'Unauthorized disclosure or loss of control of sensitive data',
      'A failed login attempt',
      'A scheduled maintenance window',
    ],
    correct: 1,
    explanation: {
      why_correct: 'Breach = unauthorized disclosure or loss of control of sensitive data (e.g., PII, PHI).',
      why_wrong: [
        'That is an event, not a breach.',
        'A failed login is an event.',
        'Maintenance is planned activity, not a breach.',
      ],
      refModuleId: 'd2-ir',
    },
  },
  {
    id: 'd2-q7', domain: 'D2', subObjective: 'D2.IR.Terms', difficulty: 1, type: 'tf',
    question: 'A vulnerability is an active attack against your systems.',
    options: ['True', 'False'],
    correct: 1,
    explanation: {
      why_correct: 'False. A vulnerability is a passive weakness. An exploit is the technique that leverages it. An attack is the act of using the exploit.',
      why_wrong: [
        'True is wrong — confuses the weakness with the action against it. The weakness alone is the vulnerability; without an actor and exploit it is just an exposure waiting to be addressed.',
      ],
      refModuleId: 'd2-ir',
    },
  },
  {
    id: 'd2-q53', domain: 'D2', subObjective: 'D2.IR.Terms', difficulty: 2, type: 'mc',
    question: 'Which sequence best describes the relationship?',
    options: [
      'Vulnerability → Exploit → Incident → Breach (if data is lost)',
      'Incident → Vulnerability → Exploit → Breach',
      'Breach → Incident → Vulnerability → Exploit',
      'Exploit → Vulnerability → Incident → Breach',
    ],
    correct: 0,
    explanation: {
      why_correct: 'A vulnerability is a weakness; an exploit leverages it; the resulting adverse event is an incident; if sensitive data is disclosed, the incident is also a breach.',
      why_wrong: [
        'Vulnerability comes first, not in the middle.',
        'Breach is the outcome, not the start.',
        'Exploit needs a vulnerability to leverage; vulnerability comes first.',
      ],
      refModuleId: 'd2-ir',
    },
  },

  // ---- D2.IR.Team ----
  {
    id: 'd2-q5', domain: 'D2', subObjective: 'D2.IR.Team', difficulty: 1, type: 'mc',
    question: 'A well-formed IR team is best described as:',
    options: [
      'Only the security analyst on call',
      'Cross-functional: management, technical, legal, comms, HR as needed',
      'Outsourced entirely to a vendor',
      'Limited to executives',
    ],
    correct: 1,
    explanation: {
      why_correct: 'IR requires cross-functional response: executive sponsorship, technical containment, legal and PR for notifications, HR for personnel actions.',
      why_wrong: [
        'A single analyst cannot drive containment, comms, and legal simultaneously.',
        'Outsourcing entirely loses institutional context.',
        'Executives alone lack technical execution capability.',
      ],
      refModuleId: 'd2-ir',
    },
  },

  // ---- D2.BC.RTO_RPO ----
  {
    id: 'd2-q2', domain: 'D2', subObjective: 'D2.BC.RTO_RPO', difficulty: 1, type: 'mc',
    question: 'RTO stands for:',
    options: ['Recovery Time Objective', 'Risk Tolerance Outcome', 'Routine Test Output', 'Restore Tier One'],
    correct: 0,
    explanation: {
      why_correct: 'RTO = Recovery Time Objective — the maximum acceptable downtime before recovery completes.',
      why_wrong: [
        'No such standard term.',
        'No such standard term.',
        'No such standard term.',
      ],
      refModuleId: 'd2-dr',
    },
  },
  {
    id: 'd2-q8', domain: 'D2', subObjective: 'D2.BC.RTO_RPO', difficulty: 1, type: 'mc',
    question: 'RPO of "1 hour" means:',
    options: [
      'You must be back online within 1 hour',
      'You can tolerate up to 1 hour of data loss',
      'You back up every 1 hour mandatorily',
      'Your team responds within 1 hour',
    ],
    correct: 1,
    explanation: {
      why_correct: 'RPO bounds tolerable data loss measured in time. An RPO of 1 hour means you can lose at most 1 hour of data.',
      why_wrong: [
        'That describes RTO.',
        'A 1-hour RPO implies backups at least that often, but the RPO itself is the data-loss tolerance, not the schedule.',
        'That describes response-time SLA, not RPO.',
      ],
      mnemonic: 'RPO = data; RTO = time-back-online.',
      refModuleId: 'd2-dr',
    },
  },
  {
    id: 'd2-q54', domain: 'D2', subObjective: 'D2.BC.RTO_RPO', difficulty: 2, type: 'mc',
    question: 'MTD (Maximum Tolerable Downtime) compared to RTO:',
    options: [
      'MTD = RTO',
      'MTD ≥ RTO (MTD is the upper bound; RTO must be less)',
      'MTD < RTO (RTO is the upper bound)',
      'They are unrelated',
    ],
    correct: 1,
    explanation: {
      why_correct: 'MTD is the absolute maximum the business can survive. RTO must be less than or equal to MTD; otherwise recovery is too slow for survival.',
      why_wrong: [
        'They can match but typically MTD ≥ RTO with margin.',
        'Reversed — RTO ≤ MTD.',
        'They are tightly related in BCP.',
      ],
      refModuleId: 'd2-dr',
    },
  },

  // ---- D2.DR.Sites ----
  {
    id: 'd2-q3', domain: 'D2', subObjective: 'D2.DR.Sites', difficulty: 1, type: 'mc',
    question: 'A "hot site" in DR planning is:',
    options: [
      'An empty room with electricity and HVAC',
      'A fully equipped, ready-to-cutover replica site',
      'A site equipped only with hardware, no current data',
      'A logical site that exists only on paper',
    ],
    correct: 1,
    explanation: {
      why_correct: 'A hot site has hardware, software, and current data — failover takes minutes to hours.',
      why_wrong: [
        'That describes a cold site.',
        'That describes a warm site.',
        'No such recognized DR category.',
      ],
      refModuleId: 'd2-dr',
    },
  },
  {
    id: 'd2-q55', domain: 'D2', subObjective: 'D2.DR.Sites', difficulty: 2, type: 'mc',
    question: 'Which DR site type is the cheapest but takes the longest to bring online?',
    options: ['Hot', 'Warm', 'Cold', 'Cloud'],
    correct: 2,
    explanation: {
      why_correct: 'A cold site is essentially a space with power and HVAC — minimal cost, longest cutover (procure hardware, load data).',
      why_wrong: [
        'Hot is most expensive, fastest.',
        'Warm sits in the middle.',
        'Cloud cost varies but is typically not the cheapest, and time-to-online is much faster than cold.',
      ],
      refModuleId: 'd2-dr',
    },
  },

  // ---- D2.DR.Backups ----
  {
    id: 'd2-q56', domain: 'D2', subObjective: 'D2.DR.Backups', difficulty: 2, type: 'mc',
    question: 'A differential backup captures:',
    options: [
      'Everything every time',
      'Only changes since the last full backup',
      'Only changes since the last backup of any kind',
      'A bit-for-bit clone of the disk',
    ],
    correct: 1,
    explanation: {
      why_correct: 'Differential = all changes since the last FULL. Restore needs the last full + latest differential.',
      why_wrong: [
        'That is a full backup.',
        'That is an incremental backup.',
        'That is a disk image, not a differential.',
      ],
      refModuleId: 'd2-dr',
    },
  },
  {
    id: 'd2-q57', domain: 'D2', subObjective: 'D2.DR.Backups', difficulty: 3, type: 'mc',
    question: 'A company runs Full on Sundays and Incremental Monday–Saturday. To restore on Wednesday after a Tuesday-night incident, you need:',
    options: [
      'Sunday full only',
      'Sunday full + Monday incremental + Tuesday incremental',
      'Sunday full + Tuesday incremental only',
      'All incrementals from Monday onward and no full',
    ],
    correct: 1,
    explanation: {
      why_correct: 'Incremental restores require the last full PLUS every incremental since that full, in order.',
      why_wrong: [
        'Missing the day-by-day deltas.',
        'Missing Monday\'s incremental, which has changes Tuesday\'s does not contain.',
        'Without the full, incrementals have nothing to apply against.',
      ],
      refModuleId: 'd2-dr',
    },
  },

  // ---- D2.IR.ChainOfCustody ----
  {
    id: 'd2-q58', domain: 'D2', subObjective: 'D2.IR.ChainOfCustody', difficulty: 2, type: 'mc',
    question: 'Chain of custody documentation primarily serves to:',
    options: [
      'Prove who had control of evidence and when',
      'Speed up containment',
      'Reduce forensic tool cost',
      'Replace backups',
    ],
    correct: 0,
    explanation: {
      why_correct: 'Chain of custody records every person who handled evidence and when — required to admit evidence in legal proceedings.',
      why_wrong: [
        'It does not affect containment speed.',
        'Tool cost is unrelated.',
        'Backups are operational; chain of custody is forensic.',
      ],
      refModuleId: 'd2-ir',
    },
  },

  // ---- D2.BC.BIA ----
  {
    id: 'd2-q6', domain: 'D2', subObjective: 'D2.BC.BIA', difficulty: 1, type: 'mc',
    question: 'A BIA (Business Impact Analysis) primarily identifies:',
    options: [
      'Patch levels of every server',
      'Critical business processes and the impact of their loss',
      'Marketing performance over the last quarter',
      'Network throughput baselines',
    ],
    correct: 1,
    explanation: {
      why_correct: 'A BIA ranks business processes by criticality and quantifies the operational/financial impact if they were lost — input to BC/DR priorities.',
      why_wrong: [
        'Patch levels are operational, not BIA output.',
        'Marketing data is unrelated.',
        'Throughput is a network measurement, not a BIA artifact.',
      ],
      refModuleId: 'd2-bc',
    },
  },

  // =====================================================================
  // D3 — ACCESS CONTROL (target 132)
  // =====================================================================

  // ---- D3.Fundamentals.SubjectObject ----
  {
    id: 'd3-q1', domain: 'D3', subObjective: 'D3.Fundamentals.SubjectObject', difficulty: 1, type: 'mc',
    question: 'In access control, the SUBJECT is:',
    options: [
      'The passive resource being accessed',
      'The active entity requesting access',
      'The rule that allows access',
      'The log of past access',
    ],
    correct: 1,
    explanation: {
      why_correct: 'Subjects are ACTIVE entities — users, processes, devices — that request access.',
      why_wrong: [
        'Objects are passive resources.',
        'Rules govern access; they are not subjects.',
        'Logs record access; they are evidence, not subjects.',
      ],
      mnemonic: 'Subject acts on Object via Rules.',
      refModuleId: 'd3-fund',
    },
  },

  // ---- D3.IAAA ----
  {
    id: 'd3-q40', domain: 'D3', subObjective: 'D3.IAAA', difficulty: 1, type: 'mc',
    question: 'IAAA stands for:',
    options: [
      'Identification, Authentication, Authorization, Accountability',
      'Inspection, Audit, Access, Approval',
      'Identity, Anti-virus, Authentication, Authorization',
      'Internal, Authorized, Audited, Allowed',
    ],
    correct: 0,
    explanation: {
      why_correct: 'IAAA = Identification (claim) → Authentication (prove) → Authorization (allow) → Accountability (trace).',
      why_wrong: [
        'Made-up sequence.',
        'Mixes anti-virus, which is unrelated.',
        'Made-up sequence.',
      ],
      refModuleId: 'd3-fund',
    },
  },
  {
    id: 'd3-q41', domain: 'D3', subObjective: 'D3.IAAA', difficulty: 2, type: 'mc',
    question: 'A user types a username, then a password. The username step is which IAAA element?',
    options: ['Authentication', 'Authorization', 'Identification', 'Accountability'],
    correct: 2,
    explanation: {
      why_correct: 'Providing a username is a claim of identity — Identification.',
      why_wrong: [
        'Authentication is the proof step (password, token, biometric).',
        'Authorization happens after authentication, deciding what to allow.',
        'Accountability is achieved via logging after action.',
      ],
      refModuleId: 'd3-fund',
    },
  },

  // ---- D3.Principles.LeastPrivilege ----
  {
    id: 'd3-q2', domain: 'D3', subObjective: 'D3.Principles.LeastPrivilege', difficulty: 1, type: 'mc',
    question: 'Least Privilege means:',
    options: [
      'Give everyone admin to reduce help-desk tickets',
      'Give only the minimum access needed for the job',
      'Give no access until requested for every action',
      'Give privilege based on tenure',
    ],
    correct: 1,
    explanation: {
      why_correct: 'Least privilege restricts access to only what is required for the role or task.',
      why_wrong: [
        'That increases risk dramatically — opposite of least privilege.',
        'That describes JIT or zero-standing-privilege models — related but stricter than the base principle.',
        'Tenure-based access has no security justification.',
      ],
      refModuleId: 'd3-logical',
    },
  },

  // ---- D3.Models.RBAC ----
  {
    id: 'd3-q3', domain: 'D3', subObjective: 'D3.Models.RBAC', difficulty: 1, type: 'mc',
    question: 'RBAC stands for:',
    options: ['Role-Based Access Control', 'Risk-Based Access Cycle', 'Rule-Bound Account Class', 'Resource-Bound Auth Channel'],
    correct: 0,
    explanation: {
      why_correct: 'RBAC ties permissions to roles, then assigns users to roles. Simpler to audit than per-user permissions.',
      why_wrong: [
        'Made-up term.',
        'Made-up term.',
        'Made-up term.',
      ],
      refModuleId: 'd3-logical',
    },
  },

  // ---- D3.Physical.Controls ----
  {
    id: 'd3-q4', domain: 'D3', subObjective: 'D3.Physical.Controls', difficulty: 1, type: 'mc',
    question: 'A mantrap is what type of control?',
    options: ['Administrative', 'Logical', 'Physical', 'Compensating function only'],
    correct: 2,
    explanation: {
      why_correct: 'A mantrap is a small room with interlocked doors — a physical access control preventing tailgating.',
      why_wrong: [
        'Administrative is policy-based, not a physical barrier.',
        'Logical refers to electronic/software controls.',
        'Compensating is a function, not a category — though a mantrap can serve a preventive function.',
      ],
      refModuleId: 'd3-physical',
    },
  },

  // ---- D3.Principles.SeparationOfDuties ----
  {
    id: 'd3-q5', domain: 'D3', subObjective: 'D3.Principles.SeparationOfDuties', difficulty: 1, type: 'mc',
    question: 'Separation of Duties primarily prevents:',
    options: ['Slow approvals', 'Fraud and unilateral errors', 'Backup failures', 'Wireless intrusions'],
    correct: 1,
    explanation: {
      why_correct: 'SoD splits critical actions across multiple people so no single actor can complete a fraudulent or harmful task alone.',
      why_wrong: [
        'Slower approvals are a side effect, not the goal.',
        'Backups are unrelated.',
        'Wireless intrusions are not addressed by SoD.',
      ],
      refModuleId: 'd3-logical',
    },
  },

  // ---- D3.Models.MAC ----
  {
    id: 'd3-q6', domain: 'D3', subObjective: 'D3.Models.MAC', difficulty: 1, type: 'mc',
    question: 'MAC (Mandatory Access Control) is based on:',
    options: ['Owner discretion', 'System-enforced labels/classification', 'User role assignments', 'Time-of-day rules only'],
    correct: 1,
    explanation: {
      why_correct: 'MAC enforces labels (Secret, Top Secret) at the system level — users cannot override.',
      why_wrong: [
        'That is DAC (owner discretion).',
        'That is RBAC.',
        'Time-based rules exist in ABAC but do not define MAC.',
      ],
      refModuleId: 'd3-logical',
    },
  },

  // ---- D3.Models.DAC ----
  {
    id: 'd3-q7', domain: 'D3', subObjective: 'D3.Models.DAC', difficulty: 1, type: 'mc',
    question: 'DAC (Discretionary Access Control) is characterized by:',
    options: [
      'Owners decide who can access their resources',
      'System enforces labels for access',
      'Roles define all access exclusively',
      'Only administrators can grant access',
    ],
    correct: 0,
    explanation: {
      why_correct: 'In DAC, the data owner decides permissions — common in file systems.',
      why_wrong: [
        'That is MAC.',
        'That is RBAC.',
        'Administrative-only granting describes a centralized policy model, not DAC.',
      ],
      refModuleId: 'd3-logical',
    },
  },

  // ---- D3.AuthFactors / D3.MFA ----
  {
    id: 'd3-q8', domain: 'D3', subObjective: 'D3.AuthFactors', difficulty: 1, type: 'mc',
    question: 'The three classic MFA factor categories are:',
    options: [
      'Know, Have, Are',
      'Read, Write, Execute',
      'Local, Network, Cloud',
      'Physical, Logical, Admin',
    ],
    correct: 0,
    explanation: {
      why_correct: 'Something you know (password), something you have (token/phone), something you are (biometric).',
      why_wrong: [
        'That is file-permission notation, unrelated.',
        'That is a connectivity classification.',
        'That is control categories, unrelated to factors.',
      ],
      mnemonic: 'Know, Have, Are (KHA).',
      refModuleId: 'd3-logical',
    },
  },
  {
    id: 'd3-q42', domain: 'D3', subObjective: 'D3.AuthFactors', difficulty: 2, type: 'mc',
    question: 'A retina scan is which authentication factor?',
    options: ['Something you know', 'Something you have', 'Something you are', 'Something you do'],
    correct: 2,
    explanation: {
      why_correct: 'Biometric traits (retina, fingerprint, face) are "something you are".',
      why_wrong: [
        'Knowledge factors are memorized secrets.',
        'Possession factors are physical/digital tokens.',
        '"Something you do" relates to behavioral biometrics (typing rhythm, gait).',
      ],
      refModuleId: 'd3-logical',
    },
  },
  {
    id: 'd3-q43', domain: 'D3', subObjective: 'D3.MFA', difficulty: 2, type: 'mc',
    question: 'A user presents a password and then a hardware token code. Is this MFA?',
    options: [
      'No — both are knowledge factors',
      'Yes — password (know) + hardware token (have)',
      'No — biometrics required',
      'Only if biometrics are also enabled',
    ],
    correct: 1,
    explanation: {
      why_correct: 'Two different categories are required. Password is know; hardware token is have. That qualifies as MFA.',
      why_wrong: [
        'A hardware token is "have", not "know".',
        'MFA does not require biometrics — two of any different categories suffice.',
        '2-of-3 satisfies MFA; biometrics are not mandatory.',
      ],
      refModuleId: 'd3-logical',
    },
  },

  // ---- D3.Principles.NeedToKnow ----
  {
    id: 'd3-q9', domain: 'D3', subObjective: 'D3.Principles.NeedToKnow', difficulty: 1, type: 'tf',
    question: '"Need to Know" can require even further restriction than role-based access.',
    options: ['True', 'False'],
    correct: 0,
    explanation: {
      why_correct: 'True. Role grants the broad permission set; need-to-know filters it down to the specific records the user has a business reason to see right now.',
      why_wrong: [
        'False is wrong — role-based access and need-to-know are layered, not equivalent. A DBA may have the role to query a payroll table yet have no need-to-know for an individual employee\'s record.',
      ],
      refModuleId: 'd3-logical',
    },
  },

  // ---- D3.DefenseInDepth ----
  {
    id: 'd3-q10', domain: 'D3', subObjective: 'D3.DefenseInDepth', difficulty: 1, type: 'mc',
    question: 'Defense in depth means:',
    options: [
      'A single strong control',
      'Multiple layered controls so failure of one is not catastrophic',
      'Only physical controls',
      'Only logical controls',
    ],
    correct: 1,
    explanation: {
      why_correct: 'Layered controls — physical, technical, administrative — at multiple points reduce the chance that any single failure compromises the system.',
      why_wrong: [
        'Defense in depth is explicitly about multiple layers, not one.',
        'Physical-only is incomplete.',
        'Logical-only is incomplete.',
      ],
      refModuleId: 'd3-fund',
    },
  },

  // =====================================================================
  // D4 — NETWORK SECURITY (target 144)
  // =====================================================================

  // ---- D4.OSI.Layers ----
  {
    id: 'd4-q1', domain: 'D4', subObjective: 'D4.OSI.Layers', difficulty: 1, type: 'mc',
    question: 'IP addressing lives at which OSI layer?',
    options: ['Layer 2 — Data Link', 'Layer 3 — Network', 'Layer 4 — Transport', 'Layer 7 — Application'],
    correct: 1,
    explanation: {
      why_correct: 'IP is Layer 3 (Network). MAC is Layer 2; TCP/UDP are Layer 4.',
      why_wrong: [
        'Layer 2 is MAC addressing and switching.',
        'Layer 4 is TCP/UDP — ports, not IPs.',
        'Layer 7 is the application protocol (HTTP, SMTP).',
      ],
      mnemonic: 'Please Do Not Throw Sausage Pizza Away.',
      refModuleId: 'd4-basics',
    },
  },
  {
    id: 'd4-q6', domain: 'D4', subObjective: 'D4.OSI.Layers', difficulty: 1, type: 'mc',
    question: 'In the OSI model, the Transport layer is layer:',
    options: ['2', '3', '4', '7'],
    correct: 2,
    explanation: {
      why_correct: 'Layer 4 — Transport. TCP and UDP operate here.',
      why_wrong: [
        'Layer 2 is Data Link.',
        'Layer 3 is Network.',
        'Layer 7 is Application.',
      ],
      refModuleId: 'd4-basics',
    },
  },

  // ---- D4.Ports ----
  {
    id: 'd4-q2', domain: 'D4', subObjective: 'D4.Ports', difficulty: 1, type: 'mc',
    question: 'HTTPS uses which default port?',
    options: ['80', '21', '443', '53'],
    correct: 2,
    explanation: {
      why_correct: 'HTTPS = 443.',
      why_wrong: [
        '80 is HTTP.',
        '21 is FTP.',
        '53 is DNS.',
      ],
      refModuleId: 'd4-basics',
    },
  },
  {
    id: 'd4-q11', domain: 'D4', subObjective: 'D4.Ports', difficulty: 1, type: 'mc',
    question: 'SSH default port is:',
    options: ['21', '22', '23', '25'],
    correct: 1,
    explanation: {
      why_correct: 'SSH = 22.',
      why_wrong: [
        '21 is FTP control.',
        '23 is Telnet (insecure).',
        '25 is SMTP.',
      ],
      refModuleId: 'd4-basics',
    },
  },
  {
    id: 'd4-q60', domain: 'D4', subObjective: 'D4.Ports', difficulty: 2, type: 'mc',
    question: 'DNS uses which port number and protocol?',
    options: ['UDP 53 (queries) and TCP 53 (zone transfer / large responses)', 'TCP 80 only', 'UDP 67 only', 'TCP 22 only'],
    correct: 0,
    explanation: {
      why_correct: 'DNS uses UDP 53 for most queries and TCP 53 for zone transfers and responses too large for UDP.',
      why_wrong: [
        'TCP 80 is HTTP.',
        'UDP 67/68 is DHCP.',
        'TCP 22 is SSH.',
      ],
      refModuleId: 'd4-basics',
    },
  },

  // ---- D4.Attacks.DoS ----
  {
    id: 'd4-q4', domain: 'D4', subObjective: 'D4.Attacks.DoS', difficulty: 1, type: 'mc',
    question: 'A DDoS attack primarily targets which CIA pillar?',
    options: ['Confidentiality', 'Integrity', 'Availability', 'Non-repudiation'],
    correct: 2,
    explanation: {
      why_correct: 'Flooding resources denies availability to legitimate users.',
      why_wrong: [
        'No unauthorized disclosure occurs.',
        'Data integrity is not the primary target.',
        'Non-repudiation is unrelated.',
      ],
      refModuleId: 'd4-threats',
    },
  },

  // ---- D4.Wireless ----
  {
    id: 'd4-q5', domain: 'D4', subObjective: 'D4.Wireless', difficulty: 1, type: 'mc',
    question: 'WPA3 is used for:',
    options: ['Wired network encryption', 'Wireless network security', 'VPN protocols', 'Database hardening'],
    correct: 1,
    explanation: {
      why_correct: 'WPA3 is the current Wi-Fi security standard (successor to WPA2).',
      why_wrong: [
        'Wired networks use 802.1X / MACsec, not WPA.',
        'VPNs use IPsec, SSL/TLS — not WPA.',
        'Database hardening is unrelated.',
      ],
      refModuleId: 'd4-tools',
    },
  },

  // ---- D4.Devices.Layer ----
  {
    id: 'd4-q7', domain: 'D4', subObjective: 'D4.Devices.Layer', difficulty: 1, type: 'mc',
    question: 'A device that filters traffic between networks of different trust levels is a:',
    options: ['Hub', 'Switch', 'Router', 'Firewall'],
    correct: 3,
    explanation: {
      why_correct: 'A firewall enforces access policy between networks of different trust levels.',
      why_wrong: [
        'Hubs are dumb broadcast devices.',
        'Switches forward frames within a network segment.',
        'Routers move packets between networks but do not by default enforce security policy.',
      ],
      refModuleId: 'd4-tools',
    },
  },

  // ---- D4.Attacks.Injection ----
  {
    id: 'd4-q8', domain: 'D4', subObjective: 'D4.Attacks.Injection', difficulty: 2, type: 'mc',
    question: 'SQL injection exploits flaws in:',
    options: [
      'Network routing',
      'Input handling in applications',
      'Wireless encryption',
      'Physical access',
    ],
    correct: 1,
    explanation: {
      why_correct: 'SQLi exploits unsanitized user input that gets concatenated into SQL queries. Use parameterized queries to prevent it.',
      why_wrong: [
        'Routing is unrelated to SQLi.',
        'Wireless encryption is unrelated.',
        'Physical access is unrelated.',
      ],
      refModuleId: 'd4-threats',
    },
  },

  // ---- D4.DMZ ----
  {
    id: 'd4-q9', domain: 'D4', subObjective: 'D4.DMZ', difficulty: 1, type: 'mc',
    question: 'A DMZ is best described as:',
    options: [
      'A trusted internal subnet',
      'A semi-trusted network exposing services to the internet while shielding internal networks',
      'A backup data center',
      'A logging system',
    ],
    correct: 1,
    explanation: {
      why_correct: 'A DMZ hosts internet-facing services while limiting their access to internal networks — defense in depth at the perimeter.',
      why_wrong: [
        'Internal subnets are fully trusted.',
        'Backup data centers belong to DR planning.',
        'Logging is unrelated.',
      ],
      refModuleId: 'd4-tools',
    },
  },

  // ---- D4.ZeroTrust ----
  {
    id: 'd4-q10', domain: 'D4', subObjective: 'D4.ZeroTrust', difficulty: 1, type: 'mc',
    question: 'Zero Trust assumes:',
    options: [
      'Internal traffic is always safe',
      'Every request must be authenticated and authorized regardless of origin',
      'Firewalls alone are enough',
      'VPNs eliminate all threats',
    ],
    correct: 1,
    explanation: {
      why_correct: 'Zero Trust = never trust, always verify — no implicit trust based on network location.',
      why_wrong: [
        'Opposite of zero trust.',
        'A firewall alone is perimeter-only thinking.',
        'A VPN extends trust; it does not eliminate threats.',
      ],
      refModuleId: 'd4-tools',
    },
  },

  // ---- D4.Firewalls.Types ----
  {
    id: 'd4-q61', domain: 'D4', subObjective: 'D4.Firewalls.Types', difficulty: 2, type: 'mc',
    question: 'Which firewall type tracks the state of connections (e.g., SYN, ESTABLISHED) to make decisions?',
    options: ['Packet filter', 'Stateful firewall', 'Application proxy', 'Air gap'],
    correct: 1,
    explanation: {
      why_correct: 'Stateful firewalls track connection state and only allow packets consistent with that state.',
      why_wrong: [
        'Packet filters look at each packet in isolation.',
        'Application proxies operate at Layer 7 with deeper inspection but are not defined by state-tracking primarily.',
        'An air gap is physical isolation, not a firewall.',
      ],
      refModuleId: 'd4-tools',
    },
  },

  // ---- D4.Attacks.MitM ----
  {
    id: 'd4-q62', domain: 'D4', subObjective: 'D4.Attacks.MitM', difficulty: 2, type: 'mc',
    question: 'Which control best defends against an on-path / Man-in-the-Middle attack on a web session?',
    options: [
      'HTTPS with valid certificates and HSTS',
      'A longer username',
      'Disabling JavaScript',
      'Frequent password rotation',
    ],
    correct: 0,
    explanation: {
      why_correct: 'TLS + valid certificate + HSTS prevents downgrade and verifies endpoint identity, defeating most on-path attacks.',
      why_wrong: [
        'Username length is irrelevant to MitM.',
        'Disabling JS does not address transport interception.',
        'Password rotation does not affect MitM exposure of an already-authenticated session.',
      ],
      refModuleId: 'd4-threats',
    },
  },

  // =====================================================================
  // D5 — SECURITY OPERATIONS (target 108)
  // =====================================================================

  // ---- D5.Data.Lifecycle ----
  {
    id: 'd5-q1', domain: 'D5', subObjective: 'D5.Data.Lifecycle', difficulty: 1, type: 'mc',
    question: 'The first step of the data lifecycle is:',
    options: ['Store', 'Create', 'Use', 'Destroy'],
    correct: 1,
    explanation: {
      why_correct: 'Create → Store → Use → Share → Archive → Destroy.',
      why_wrong: [
        'Store comes after Create.',
        'Use comes after Store.',
        'Destroy is the last phase.',
      ],
      refModuleId: 'd5-data',
    },
  },

  // ---- D5.Data.Sanitization ----
  {
    id: 'd5-q2', domain: 'D5', subObjective: 'D5.Data.Sanitization', difficulty: 1, type: 'mc',
    question: 'Overwriting a drive multiple times is an example of:',
    options: ['Purging', 'Clearing', 'Physical destruction', 'Hashing'],
    correct: 1,
    explanation: {
      why_correct: 'Clearing = overwrite. Purging = degauss / strong sanitize. Destruction = physically destroy media.',
      why_wrong: [
        'Purging uses degaussing or stronger sanitization.',
        'Physical destruction is mechanical (shred, incinerate).',
        'Hashing is one-way fingerprinting — unrelated to sanitization.',
      ],
      refModuleId: 'd5-data',
    },
  },

  // ---- D5.Crypto.Symmetric ----
  {
    id: 'd5-q3', domain: 'D5', subObjective: 'D5.Crypto.Symmetric', difficulty: 1, type: 'mc',
    question: 'AES is what type of encryption?',
    options: ['Symmetric', 'Asymmetric', 'Hashing', 'Steganography'],
    correct: 0,
    explanation: {
      why_correct: 'AES is a symmetric block cipher — same key encrypts and decrypts.',
      why_wrong: [
        'Asymmetric examples are RSA, ECC.',
        'Hashing is one-way (SHA-2/3, MD5).',
        'Steganography hides data in other data; not encryption.',
      ],
      refModuleId: 'd5-crypto',
    },
  },

  // ---- D5.Logging.WhatToLog ----
  {
    id: 'd5-q4', domain: 'D5', subObjective: 'D5.Logging.WhatToLog', difficulty: 1, type: 'mc',
    question: 'Logging primarily supports:',
    options: ['Marketing analytics', 'Accountability and forensic investigation', 'Code minification', 'Salary planning'],
    correct: 1,
    explanation: {
      why_correct: 'Logs tie actions to actors and timeframes — the foundation of accountability and investigation.',
      why_wrong: [
        'Logs may inform analytics but that is not the primary security purpose.',
        'Unrelated to security operations.',
        'Unrelated.',
      ],
      refModuleId: 'd5-log',
    },
  },

  // ---- D5.Config.Hardening ----
  {
    id: 'd5-q5', domain: 'D5', subObjective: 'D5.Config.Hardening', difficulty: 1, type: 'mc',
    question: 'Hardening means:',
    options: [
      'Increasing access for convenience',
      'Reducing attack surface via secure configs and patching',
      'Adding more user accounts',
      'Encrypting only at rest',
    ],
    correct: 1,
    explanation: {
      why_correct: 'Hardening reduces attack surface — patch, disable unused services, restrict accounts.',
      why_wrong: [
        'Opposite of hardening.',
        'More accounts increases attack surface.',
        'Encryption is one tactic; hardening is broader.',
      ],
      refModuleId: 'd5-config',
    },
  },

  // ---- D5.Crypto.Asymmetric ----
  {
    id: 'd5-q6', domain: 'D5', subObjective: 'D5.Crypto.Asymmetric', difficulty: 1, type: 'mc',
    question: 'RSA is an example of:',
    options: ['Symmetric encryption', 'Asymmetric encryption', 'Hashing', 'Salting'],
    correct: 1,
    explanation: {
      why_correct: 'RSA is asymmetric — uses a key pair (public + private).',
      why_wrong: [
        'AES is symmetric.',
        'SHA / MD5 are hashing.',
        'Salting is a randomization step used with hashing, not a cryptosystem.',
      ],
      refModuleId: 'd5-crypto',
    },
  },

  // ---- D5.Crypto.DigitalSig ----
  {
    id: 'd5-q7', domain: 'D5', subObjective: 'D5.Crypto.DigitalSig', difficulty: 2, type: 'mc',
    question: 'A digital signature provides:',
    options: [
      'Confidentiality only',
      'Integrity + authentication of origin + non-repudiation',
      'Availability only',
      'Network speed',
    ],
    correct: 1,
    explanation: {
      why_correct: 'A signature proves the message has not been altered (integrity), that the signer holds the private key (origin), and binds them to the act (non-repudiation).',
      why_wrong: [
        'Signatures do not encrypt the message body for confidentiality.',
        'Availability is unrelated.',
        'No throughput benefit; signatures add overhead.',
      ],
      refModuleId: 'd5-crypto',
    },
  },

  // ---- D5.PKI.Basics ----
  {
    id: 'd5-q8', domain: 'D5', subObjective: 'D5.PKI.Basics', difficulty: 1, type: 'mc',
    question: 'PKI primarily provides:',
    options: [
      'A way to issue and verify digital certificates',
      'A patching schedule',
      'A wireless protocol',
      'A backup strategy',
    ],
    correct: 0,
    explanation: {
      why_correct: 'PKI = Public Key Infrastructure — CAs, RAs, certs, CRL/OCSP for issuing and validating identity bindings.',
      why_wrong: [
        'Patching is configuration management, not PKI.',
        'Wireless protocols are unrelated.',
        'Backups are unrelated.',
      ],
      refModuleId: 'd5-crypto',
    },
  },

  // ---- D5.Config.Baseline ----
  {
    id: 'd5-q9', domain: 'D5', subObjective: 'D5.Config.Baseline', difficulty: 1, type: 'mc',
    question: 'A configuration baseline is:',
    options: [
      'A known-good reference configuration to compare against',
      'A backup tape',
      'A SIEM dashboard',
      'A risk register',
    ],
    correct: 0,
    explanation: {
      why_correct: 'Baselines define the expected state. Drift from baseline triggers investigation.',
      why_wrong: [
        'Backup media is operational, not a baseline.',
        'SIEM is monitoring, not configuration definition.',
        'Risk register tracks risks, not configurations.',
      ],
      refModuleId: 'd5-config',
    },
  },

  // ---- D5.Crypto.Hashing ----
  {
    id: 'd5-q10', domain: 'D5', subObjective: 'D5.Crypto.Hashing', difficulty: 1, type: 'tf',
    question: 'MD5 is still recommended for password hashing.',
    options: ['True', 'False'],
    correct: 1,
    explanation: {
      why_correct: 'False. MD5 is collision-broken and far too fast for password hashing — modern GPUs crack billions of MD5 hashes per second. Use a deliberately slow adaptive function: bcrypt, scrypt, or Argon2.',
      why_wrong: [
        'True is wrong — even outside the collision attacks, MD5 is unsuitable for passwords because it is fast. Password hashes must be slow to defeat brute force.',
      ],
      refModuleId: 'd5-crypto',
    },
  },

  // ---- D5.Training.Awareness ----
  {
    id: 'd5-q11', domain: 'D5', subObjective: 'D5.Training.Awareness', difficulty: 1, type: 'mc',
    question: 'A phishing simulation is what type of control?',
    options: ['Physical', 'Technical', 'Administrative', 'Compensating'],
    correct: 2,
    explanation: {
      why_correct: 'Awareness training is implemented via policy and people processes — administrative.',
      why_wrong: [
        'Physical = tangible barriers.',
        'Technical = hardware/software.',
        'Compensating is a function, not a category.',
      ],
      refModuleId: 'd5-aware',
    },
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

// Per-domain weighted sampling for blueprint-correct exam draws.
// Blueprint: D1=26, D2=10, D3=22, D4=24, D5=18.
export function sampleByBlueprint(total: number, seed?: number): Question[] {
  const weights: Record<string, number> = { D1: 26, D2: 10, D3: 22, D4: 24, D5: 18 };
  const out: Question[] = [];
  for (const d of ['D1', 'D2', 'D3', 'D4', 'D5'] as const) {
    const want = Math.round((weights[d] / 100) * total);
    const pool = (QUESTIONS_BY_DOMAIN[d] ?? []).filter((q) => q.type !== 'multi');
    out.push(...pickRandom(pool, Math.min(want, pool.length), seed));
  }
  return pickRandom(out, out.length, seed);
}

// Diagnostic draw — 30 questions with fixed per-domain counts 6/3/7/8/6 (sums to 30).
export function sampleDiagnostic(seed?: number): Question[] {
  const counts: Record<string, number> = { D1: 6, D2: 3, D3: 7, D4: 8, D5: 6 };
  const out: Question[] = [];
  for (const d of ['D1', 'D2', 'D3', 'D4', 'D5'] as const) {
    const pool = (QUESTIONS_BY_DOMAIN[d] ?? []).filter((q) => q.type !== 'multi');
    out.push(...pickRandom(pool, Math.min(counts[d], pool.length), seed));
  }
  return pickRandom(out, out.length, seed);
}
