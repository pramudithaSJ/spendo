// Game Types for Student Loan Management Scenario

export type OptionId = 'A' | 'B' | 'C' | 'D';

export interface GameOption {
  id: OptionId;
  text: string;
  textTa: string;
  financialImpact?: {
    description: string;
    descriptionTa: string;
    monthlyPayment?: number;
    totalDebt?: number;
    savings?: number;
  };
  isDeadEnd?: boolean;
  deadEndReason?: string;
  deadEndReasonTa?: string;
}

export interface GameStep {
  step: number;
  title: string;
  titleTa: string;
  scenario: string;
  scenarioTa: string;
  context?: string;
  contextTa?: string;
  options: GameOption[];
}

export interface GameChoice {
  step: number;
  option: OptionId;
  locked: boolean;
  timestamp: string;
}

export interface GameState {
  groupNumber: number;
  groupName?: string;
  scenarioId: string;
  choices: GameChoice[];
  currentStep: number;
  isDeadEnd: boolean;
  deadEndReason?: string;
  startTime: string;
  completedAt?: string;
  pageLoadCount: number;
  wasRefreshed: boolean;
  refreshTimestamps: string[];
  // Final assessment validation
  studentAnswer?: 'yes' | 'no';  // Student's answer to "Do you have enough balance?"
  isCorrect?: boolean;            // Whether student's assessment was correct
  actualBalance?: number;         // Calculated emergency fund amount
}

export interface DisabledOption {
  step: number;
  option: OptionId;
  reason: string;
  reasonTa: string;
}

export interface GameResult {
  totalLoanAmount: number;
  totalPaid: number;
  remainingDebt: number;
  monthlyPayment: number;
  yearsToComplete: number;
  totalInterestPaid: number;
  savings: number;
  outcome: 'excellent' | 'good' | 'fair' | 'poor' | 'failed';
  outcomeSummary: string;
  outcomeSummaryTa: string;
  recommendations: string[];
  recommendationsTa: string[];
  timeSpent?: number; // Time spent in seconds
  hasEnoughBalance: boolean; // For Step 5 emergency check (Rs 300,000)
  emergencyFund: number; // Calculated savings for emergency
}

export interface FirebaseGameResult {
  id?: string;
  groupNumber: number;
  scenarioId: string;
  timeSpent: string; // formatted time (e.g., "2m 30s")
  timeSpentSeconds: number; // raw seconds for sorting
  outcome: 'excellent' | 'good' | 'fair' | 'poor' | 'failed';
  completedAt: string;
  userId: string;
  totalLoanAmount: number;
  savings: number;
  remainingDebt: number;
  pageLoadCount: number;
  wasRefreshed: boolean;
  refreshTimestamps: string[];
  // Final assessment validation
  studentAnswer: 'yes' | 'no';  // Student's final answer
  isCorrect: boolean;            // Whether assessment was correct
  actualBalance: number;         // Calculated balance
  submittedAt: string;           // Submission timestamp for ranking
}
