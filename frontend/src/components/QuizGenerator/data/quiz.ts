
export type QuizQuestion = {
  question_number: number;
  question: string;
  type: 'multiple_choice' | 'short_answer';
  choices: string[];
  correct_answer: string;
  explanation: string;
}
export type Answer = {
  question_number: number;
  question: string;
  type: 'multiple_choice' | 'short_answer';
  choices: string[];
  correct_answer: string;
  explanation: string;
  user_answer: string
}

// by Id
export type QuizInfo =  Quiz & {
  questions: QuizQuestion[]
}

// by category
export type Quiz = {
  name: string,
  level: string,
  id: number,
  path: string,
  category_id: number,
  created_at: string,
}
export type QuizAttempt = {
  id: number,
  submitted_at: string,
  category_id: number,
  path: string,
}
