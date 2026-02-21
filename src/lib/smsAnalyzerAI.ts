import { openaiService } from './openaiService';
import { AnalysisResult } from './smsAnalyzerService';

export async function getAIAnalysis(
  messageText: string,
  ruleResult: AnalysisResult
): Promise<string> {
  const detectedCategories = ruleResult.indicators
    .map((i) => i.category)
    .join(', ');

  const systemPrompt = `You are a fraud detection expert specializing in Sri Lankan investment scams and financial fraud (SEC, CBSL regulatory context). Analyze investment messages concisely. Respond in 80 words or less.`;

  const userPrompt = `Message: "${messageText}"

Pre-detected fraud categories: ${detectedCategories || 'None'}
Rule-based verdict: ${ruleResult.verdict}
Risk score: ${ruleResult.riskScore}/100

Provide a 2-3 sentence explanation of why this message is or isn't fraudulent, highlighting the most concerning elements.`;

  const response = await openaiService.sendMessage([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ]);

  return response;
}
