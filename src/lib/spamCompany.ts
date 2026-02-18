export type ScamType = 'pyramid' | 'ponzi' | 'investment_fraud' | 'forex_scam' | 'crypto_scam' | 'mlm_scam';

export type RiskLevel = 'high' | 'critical';

export interface SpamCompany {
  name: string;
  aliases: string[];
  type: ScamType;
  description: string;
  reportedYear: number;
  riskLevel: RiskLevel;
}

export const SPAM_COMPANIES: SpamCompany[] = [
  {
    name: 'Company Alpha',
    aliases: ['Alpha Investments', 'Alpha Global'],
    type: 'pyramid',
    description: 'Operates a pyramid scheme disguised as a trading platform with guaranteed returns.',
    reportedYear: 2023,
    riskLevel: 'critical',
  },
  {
    name: 'Company Beta',
    aliases: ['Beta Finance', 'BetaFX'],
    type: 'forex_scam',
    description: 'Unregistered forex trading platform promising unrealistic daily profits.',
    reportedYear: 2024,
    riskLevel: 'high',
  },
  {
    name: 'Company Gamma',
    aliases: ['Gamma Holdings', 'Gamma Capital'],
    type: 'ponzi',
    description: 'Classic Ponzi scheme paying early investors with new investor funds.',
    reportedYear: 2023,
    riskLevel: 'critical',
  },
  {
    name: 'Company Delta',
    aliases: ['Delta Crypto', 'DeltaCoin'],
    type: 'crypto_scam',
    description: 'Fake cryptocurrency exchange that blocks withdrawals after deposits.',
    reportedYear: 2024,
    riskLevel: 'critical',
  },
  {
    name: 'Company Epsilon',
    aliases: ['Epsilon Network', 'Epsilon MLM'],
    type: 'mlm_scam',
    description: 'Multi-level marketing scheme with no real product, only recruitment bonuses.',
    reportedYear: 2022,
    riskLevel: 'high',
  },
  {
    name: 'Company Zeta',
    aliases: ['Zeta Wealth', 'Zeta Trading'],
    type: 'investment_fraud',
    description: 'Fraudulent investment advisory firm collecting fees without providing services.',
    reportedYear: 2024,
    riskLevel: 'high',
  },
  {
    name: 'Company Eta',
    aliases: ['Eta Digital', 'EtaToken'],
    type: 'crypto_scam',
    description: 'Promotes worthless tokens with fake celebrity endorsements and pump-and-dump tactics.',
    reportedYear: 2023,
    riskLevel: 'critical',
  },
  {
    name: 'Company Theta',
    aliases: ['Theta Partners', 'Theta Group'],
    type: 'pyramid',
    description: 'Recruitment-based scheme requiring large upfront membership fees.',
    reportedYear: 2022,
    riskLevel: 'high',
  },
  {
    name: 'Company Iota',
    aliases: ['Iota Markets', 'IotaFX Pro'],
    type: 'forex_scam',
    description: 'Clone of a legitimate broker site used to collect deposits from victims.',
    reportedYear: 2024,
    riskLevel: 'critical',
  },
  {
    name: 'Company Kappa',
    aliases: ['Kappa Ventures', 'Kappa Income'],
    type: 'ponzi',
    description: 'Promises fixed monthly returns of 20%+ through alleged commodity trading.',
    reportedYear: 2023,
    riskLevel: 'critical',
  },
];
