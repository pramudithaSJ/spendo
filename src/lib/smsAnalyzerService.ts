import { SPAM_COMPANIES } from './spamCompany';

export type FraudVerdict = 'LIKELY_FRAUD' | 'SUSPICIOUS' | 'APPEARS_SAFE';

export type IndicatorCategory =
  | 'guaranteedReturns'
  | 'unrealisticReturns'
  | 'urgencyPressure'
  | 'recruitmentReferral'
  | 'suspiciousContact'
  | 'legitimacyFlags'
  | 'investmentJargon';

export interface FraudIndicator {
  category: IndicatorCategory;
  description: string;
  severity: 'High' | 'Medium' | 'Low';
  matchedPhrases: string[];
}

export interface MatchedCompany {
  name: string;
  type: string;
  riskLevel: string;
}

export interface AnalysisResult {
  verdict: FraudVerdict;
  riskScore: number;
  indicators: FraudIndicator[];
  matchedCompanies: MatchedCompany[];
  aiSummary?: string;
  analyzedAt: Date;
}

interface RuleDefinition {
  category: IndicatorCategory;
  description: string;
  severity: 'High' | 'Medium' | 'Low';
  patterns: RegExp[];
  points: number;
  cap: number;
}

const RULES: RuleDefinition[] = [
  {
    category: 'guaranteedReturns',
    description: 'Promises of guaranteed profits or risk-free investments',
    severity: 'High',
    patterns: [
      /guaranteed\s+profit/i,
      /guaranteed\s+return/i,
      /no\s+risk/i,
      /risk\s*[-\s]?free/i,
      /assured\s+return/i,
      /100%\s+safe/i,
      /100%\s+guaranteed/i,
    ],
    points: 25,
    cap: 25,
  },
  {
    category: 'unrealisticReturns',
    description: 'Promises of unrealistically high or rapid returns',
    severity: 'High',
    patterns: [
      /(\d{2,3})%\s*(per|a)\s*(month|week|day)/i,
      /double\s+your\s+money/i,
      /daily\s+profit/i,
      /daily\s+return/i,
    ],
    points: 20,
    cap: 25,
  },
  {
    category: 'urgencyPressure',
    description: 'High-pressure tactics designed to rush decision-making',
    severity: 'Medium',
    patterns: [
      /limited\s+time/i,
      /limited\s+slots/i,
      /act\s+now/i,
      /last\s+chance/i,
      /offer\s+expires/i,
      /\bhurry\b/i,
      /\burgent\b/i,
    ],
    points: 15,
    cap: 20,
  },
  {
    category: 'recruitmentReferral',
    description: 'MLM-style recruitment and referral income promises',
    severity: 'High',
    patterns: [
      /refer\s+a\s+friend/i,
      /recruit\s+members/i,
      /\bdownline\b/i,
      /\bMLM\b/i,
      /passive\s+income/i,
      /unlimited\s+earning/i,
    ],
    points: 20,
    cap: 20,
  },
  {
    category: 'suspiciousContact',
    description: 'Requests to contact only via unverifiable channels',
    severity: 'Medium',
    patterns: [
      /whatsapp\s+only/i,
      /contact\s+via\s+telegram/i,
      /dm\s+us\s+for\s+details/i,
    ],
    points: 15,
    cap: 15,
  },
  {
    category: 'legitimacyFlags',
    description: 'Indicators of unregistered or offshore operations',
    severity: 'Medium',
    patterns: [
      /not\s+registered/i,
      /no\s+SEC.*CBSL.*licen[sc]e/i,
      /private\s+investment\s+group/i,
      /\boffshore\b/i,
      /exclusive\s+club/i,
    ],
    points: 15,
    cap: 15,
  },
  {
    category: 'investmentJargon',
    description: 'Misuse of investment terminology to appear legitimate',
    severity: 'Low',
    patterns: [
      /guaranteed\s+forex/i,
      /guaranteed\s+crypto/i,
      /binary\s+options/i,
      /bot\s+trading\s+profit/i,
    ],
    points: 10,
    cap: 10,
  },
];

function extractMatchedPhrases(text: string, patterns: RegExp[]): string[] {
  const matched: string[] = [];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      matched.push(match[0]);
    }
  }
  return matched;
}

export function analyzeMessage(text: string): AnalysisResult {
  const indicators: FraudIndicator[] = [];
  let totalScore = 0;

  for (const rule of RULES) {
    const matched = extractMatchedPhrases(text, rule.patterns);
    if (matched.length > 0) {
      totalScore += Math.min(rule.points, rule.cap);
      indicators.push({
        category: rule.category,
        description: rule.description,
        severity: rule.severity,
        matchedPhrases: matched,
      });
    }
  }

  // Check for known company names / aliases
  const matchedCompanies: MatchedCompany[] = [];
  const lowerText = text.toLowerCase();
  for (const company of SPAM_COMPANIES) {
    const nameFound = lowerText.includes(company.name.toLowerCase());
    const aliasFound = company.aliases.some((alias) =>
      lowerText.includes(alias.toLowerCase())
    );
    if (nameFound || aliasFound) {
      matchedCompanies.push({
        name: company.name,
        type: company.type,
        riskLevel: company.riskLevel,
      });
    }
  }

  if (matchedCompanies.length > 0) {
    totalScore += 30;
  }

  const riskScore = Math.min(totalScore, 100);

  let verdict: FraudVerdict;
  if (riskScore >= 60) {
    verdict = 'LIKELY_FRAUD';
  } else if (riskScore >= 30) {
    verdict = 'SUSPICIOUS';
  } else {
    verdict = 'APPEARS_SAFE';
  }

  return {
    verdict,
    riskScore,
    indicators,
    matchedCompanies,
    analyzedAt: new Date(),
  };
}
