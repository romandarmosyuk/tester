export interface Question {
  id?: string;
  text: string;
  options: string[];
  correct: number;

  topic: string;
  theoryLink?: string;
  task?: string;
  hint?: string;
}

export interface AttemptAnswer {
  questionId: string;
  chosen: number;
  correct: boolean;
  isExtra: boolean;
}

export interface Attempt {
  id: string;
  userId: string;
  answers: AttemptAnswer[];
  createdAt: number;
  score: number;
  total: number;
  weakTopics: string[];
}
