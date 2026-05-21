import { DomainId } from '../lib/storage';

export type QuestionType = 'mc' | 'tf' | 'fill';

export type Question = {
  id: string;
  domain: DomainId;
  type: QuestionType;
  question: string;
  options?: string[];
  correct: number | string; // index for mc/tf, lowercased keyword(s) for fill (string with | separators)
  explanation: string;
  difficulty?: 1 | 2 | 3;
};

export type Flashcard = {
  id: string;
  term: string;
  def: string;
  domain: DomainId;
  example?: string;
  related?: string[];
};

export type GlossaryTerm = Flashcard;
