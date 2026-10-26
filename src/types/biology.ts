export type DifficultyLevel = 'Mudah' | 'Sedang' | 'Sulit / HOTS';

export interface LearningObjective {
  id: string;
  code: string;
  title: string;
  description: string;
}

export interface KeyConcept {
  title: string;
  content: string;
  mnemonic?: string;
}

export interface OrganFunctionRow {
  organ: string;
  detail: string;
  function: string;
  enzymesOrSubstances?: string;
}

export interface ProcessStep {
  stepNumber: number;
  title: string;
  organ: string;
  description: string;
  chemicalOrMechanical?: string;
  note?: string;
}

export interface ComparisonTable {
  title: string;
  headers: string[];
  rows: string[][];
}

export interface IllustrationData {
  id: string;
  title: string;
  caption: string;
  altText: string;
  type: string;
}

export interface MaterialSection {
  id: string;
  title: string;
  subTitle?: string;
  intro: string;
  bullets?: string[];
  keyConcept?: KeyConcept;
  organTable?: OrganFunctionRow[];
  organTableTitle?: string;
  comparisonTable?: ComparisonTable;
  processSteps?: ProcessStep[];
  processStepsTitle?: string;
  illustrationId?: string;
  extraNote?: string;
}

export interface QuestionChoice {
  id: 'A' | 'B' | 'C' | 'D' | 'E';
  text: string;
}

export interface EssayRubricKeyword {
  word: string;
  points: number;
  explanation: string;
}

export interface EssayRubric {
  maxScore: number;
  modelAnswer: string;
  keywords: EssayRubricKeyword[];
  scoringGuide: string;
}

export interface Question {
  id: string;
  number: number;
  type: 'multiple_choice' | 'essay';
  objectiveId: string; // Links to LearningObjective.id
  difficulty: DifficultyLevel;
  isHots?: boolean;
  stimulus?: string;
  question: string;
  options?: QuestionChoice[];
  correctAnswer?: 'A' | 'B' | 'C' | 'D' | 'E';
  explanation: string;
  rubric?: EssayRubric;
}

export interface SubMateri {
  id: string;
  number: number;
  title: string;
  shortTitle: string;
  summary: string;
  themeColor: {
    primary: string;
    light: string;
    border: string;
    text: string;
    gradient: string;
  };
  learningObjectives: LearningObjective[];
  sections: MaterialSection[];
  illustrations: IllustrationData[];
  questions: Question[]; // 10 Multiple choice + 5 Essay
}

export interface QuizAttemptRecord {
  subMateriId: string;
  mode: 'practice' | 'competition';
  pgAnswers: Record<string, 'A' | 'B' | 'C' | 'D' | 'E'>;
  essayAnswers: Record<string, string>;
  essayScores: Record<string, number>;
  essayFeedback: Record<string, string>;
  pgScore: number; // 0-100
  essayScore: number; // 0-100
  totalScore: number; // 0.7 * pg + 0.3 * essay
  objectiveBreakdown: Record<string, { total: number; correct: number; percentage: number }>;
  timeSpentSeconds: number;
  completedAt: string;
}

export type MasteryLevel = 'Belum Menguasai' | 'Cukup' | 'Menguasai' | 'Sangat Menguasai';

export interface EvaluationResult {
  totalScore: number;
  pgScore: number;
  essayScore: number;
  masteryLevel: MasteryLevel;
  masteryBadgeColor: string;
  objectiveStats: {
    objective: LearningObjective;
    scorePercent: number;
    totalQuestions: number;
    isMastered: boolean;
  }[];
  recommendations: {
    sectionId: string;
    sectionTitle: string;
    reason: string;
    reviewTips: string;
  }[];
}
