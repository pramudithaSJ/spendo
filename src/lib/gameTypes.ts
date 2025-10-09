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
  choices: GameChoice[];
  currentStep: number;
  isDeadEnd: boolean;
  deadEndReason?: string;
  completedAt?: string;
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
}
