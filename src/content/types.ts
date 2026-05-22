import { DomainId } from '../lib/storage';

export type QuestionType = 'mc' | 'tf' | 'multi';

export type Difficulty = 1 | 2 | 3;

export type Explanation = {
  why_correct: string;
  why_wrong: string[]; // one per non-correct option; in option-index order, skipping the correct index
  mnemonic?: string;
  refModuleId?: string;
};

export type Question = {
  id: string;
  domain: DomainId;
  subObjective: string;
  difficulty: Difficulty;
  type: QuestionType;
  question: string;
  options: string[];
  correct: number | number[]; // array for type='multi'
  explanation: Explanation;
  tags?: string[];
};

export type Flashcard = {
  id: string;
  term: string;
  def: string;
  domain: DomainId;
  subObjective: string; // required as of Task 8
  example?: string;
  related?: string[];
};

export type GlossaryTerm = Flashcard;
