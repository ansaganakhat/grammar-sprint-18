export type TenseGroup = "Present" | "Past" | "Future";
export type TenseFamily = "Simple" | "Continuous" | "Perfect" | "Perfect Continuous";
export type Difficulty = "easy" | "medium" | "hard";

export interface Tense {
  id: string;
  group: TenseGroup;
  family: TenseFamily;
  name: string;
  nameKz: string;
  usageKz: string;
  usageEn: string;
  positiveFormula: string;
  negativeFormula: string;
  questionFormula: string;
  signals: string[];
  positiveExample: string;
  negativeExample: string;
  questionExample: string;
  commonError: string;
  correction: string;
}

export interface Question {
  id: string;
  topic: string;
  subtopic: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanationKz: string;
  difficulty: Difficulty;
  tags: string[];
  active: boolean;
  source?: "seed" | "generated" | "custom" | "import";
}

export interface QuizAnswer {
  questionId: string;
  topic: string;
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
  explanationKz: string;
  correct: boolean;
}

export interface TestResult {
  id: string;
  date: string;
  mode: string;
  score: number;
  total: number;
  percentage: number;
  durationSeconds: number;
  answers: QuizAnswer[];
}

export type TopicStatus = "Жаңа" | "Оқылып жатыр" | "Қайталау қажет" | "Жақсы" | "Меңгерілді";

export interface TenseProgress {
  tenseId: string;
  theoryRead: boolean;
  formulaAttempts: number;
  formulaCorrect: number;
  quizCorrect: number;
  quizWrong: number;
  lastScore: number;
  bestScore: number;
  reviewCount: number;
  recentScores: number[];
  status: TopicStatus;
}

export interface MistakeRecord {
  questionId: string;
  topic: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  explanationKz: string;
  firstWrongAt: string;
  lastReviewedAt: string;
  wrongCount: number;
  correctStreak: number;
  intervalIndex: number;
  nextReviewAt: string;
  status: "Қайталау қажет" | "Меңгерілді";
}

export interface ReviewItem {
  id: string;
  tenseId: string;
  title: string;
  intervalIndex: number;
  nextReviewAt: string;
  completed: boolean;
}

export interface Profile {
  name: string;
  dailyGoal: number;
  targetScore: number;
}
