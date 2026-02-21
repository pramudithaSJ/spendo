'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, ShieldAlert, AlertTriangle, Search, X, Shield, Info,
  MessageSquare, ClipboardPaste, Loader2, CheckCircle2, AlertOctagon,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { SPAM_COMPANIES, ScamType } from '@/lib/spamCompany';
import { analyzeMessage, AnalysisResult } from '@/lib/smsAnalyzerService';
import { getAIAnalysis } from '@/lib/smsAnalyzerAI';
import { openaiService } from '@/lib/openaiService';

const FILTER_TYPES: { key: 'all' | ScamType; labelKey: string }[] = [
  { key: 'all', labelKey: 'filterAll' },
  { key: 'pyramid', labelKey: 'pyramid' },
  { key: 'ponzi', labelKey: 'ponzi' },
  { key: 'crypto_scam', labelKey: 'crypto_scam' },
  { key: 'forex_scam', labelKey: 'forex_scam' },
  { key: 'investment_fraud', labelKey: 'investment_fraud' },
];

export default function FraudCheckerPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | ScamType>('all');
  const [activeTab, setActiveTab] = useState<'search' | 'analyze'>('search');

  // SMS Analyzer state
  const [smsText, setSmsText] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [aiEnhancing, setAiEnhancing] = useState(false);

  const filteredCompanies = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return SPAM_COMPANIES.filter((company) => {
      if (activeFilter !== 'all' && company.type !== activeFilter) return false;
      if (!query) return true;
      if (company.name.toLowerCase().includes(query)) return true;
      return company.aliases.some((alias) => alias.toLowerCase().includes(query));
    });
  }, [searchQuery, activeFilter]);

  const getFilterLabel = (filter: typeof FILTER_TYPES[number]) => {
    if (filter.key === 'all') return t.fraudChecker.filterAll;
    return t.fraudChecker.scamTypes[filter.labelKey as keyof typeof t.fraudChecker.scamTypes];
  };

  const handleAnalyze = () => {
    if (!smsText.trim()) return;
    const result = analyzeMessage(smsText);
    setAnalysisResult(result);

    if (openaiService.isConfigured()) {
      setAiEnhancing(true);
      getAIAnalysis(smsText, result)
        .then((aiSummary) => {
          setAnalysisResult((prev) => (prev ? { ...prev, aiSummary } : prev));
        })
        .catch(() => {
          // AI enhancement is optional — fail silently
        })
        .finally(() => {
          setAiEnhancing(false);
        });
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setSmsText(text);
    } catch {
      // Clipboard API not available or permission denied — do nothing
    }
  };

  const handleClear = () => {
    setSmsText('');
    setAnalysisResult(null);
    setAiEnhancing(false);
  };

  const verdictColor = (verdict: AnalysisResult['verdict']) => {
    if (verdict === 'LIKELY_FRAUD') return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', sub: 'text-red-600' };
    if (verdict === 'SUSPICIOUS') return { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', sub: 'text-amber-600' };
    return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', sub: 'text-green-600' };
  };

  const severityBadge = (severity: 'High' | 'Medium' | 'Low') => {
    if (severity === 'High') return 'bg-red-100 text-red-700';
    if (severity === 'Medium') return 'bg-amber-100 text-amber-700';
    return 'bg-blue-100 text-blue-700';
  };

  const verdictLabel = (verdict: AnalysisResult['verdict']) => {
    if (verdict === 'LIKELY_FRAUD') return t.fraudChecker.smsAnalyzer.verdictLikelyFraud;
    if (verdict === 'SUSPICIOUS') return t.fraudChecker.smsAnalyzer.verdictSuspicious;
    return t.fraudChecker.smsAnalyzer.verdictAppearsSafe;
  };

  const severityLabel = (severity: 'High' | 'Medium' | 'Low') => {
    if (severity === 'High') return t.fraudChecker.smsAnalyzer.severityHigh;
    if (severity === 'Medium') return t.fraudChecker.smsAnalyzer.severityMedium;
    return t.fraudChecker.smsAnalyzer.severityLow;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => router.push('/profile')}
            className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          <div className="relative">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
              <ShieldAlert className="h-5 w-5 text-red-600" />
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900">{t.fraudChecker.title}</h1>
            <p className="text-xs text-gray-500">{t.fraudChecker.subtitle}</p>
          </div>
          <span className="text-xs font-medium text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
            {t.fraudChecker.totalCount.replace('{count}', String(SPAM_COMPANIES.length))}
          </span>
        </div>
      </header>

      {/* Tab Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-[72px] z-10">
        <div className="flex">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors
              ${activeTab === 'search'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            <Search className="h-4 w-4" />
            {t.fraudChecker.tabs.searchCompanies}
          </button>
          <button
            onClick={() => setActiveTab('analyze')}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors
              ${activeTab === 'analyze'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            <MessageSquare className="h-4 w-4" />
            {t.fraudChecker.tabs.analyzeMessage}
          </button>
        </div>
      </div>

      {/* Search Companies Tab */}
      {activeTab === 'search' && (
        <div className="p-4 space-y-4">
          {/* Info Banner */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-4">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{t.fraudChecker.infoBanner}</p>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.fraudChecker.searchPlaceholder}
              className="w-full pl-11 pr-10 py-3.5 bg-white border border-gray-200 rounded-xl text-sm
                focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-300
                transition-all placeholder:text-gray-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </div>

          {/* Result count */}
          {searchQuery && (
            <p className="text-xs text-gray-500 px-1">
              {t.fraudChecker.resultsCount
                .replace('{count}', String(filteredCompanies.length))
                .replace('{total}', String(SPAM_COMPANIES.length))}
            </p>
          )}

          {/* Filter Chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
            {FILTER_TYPES.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors
                  ${activeFilter === filter.key
                    ? 'bg-red-600 text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
              >
                {getFilterLabel(filter)}
              </button>
            ))}
          </div>

          {/* Results */}
          <div className="space-y-3">
            {filteredCompanies.length > 0 ? (
              filteredCompanies.map((company, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden
                    transition-all duration-200 animate-in fade-in"
                >
                  <div className="flex">
                    {/* Left color bar */}
                    <div
                      className={`w-1.5 flex-shrink-0 ${
                        company.riskLevel === 'critical' ? 'bg-red-500' : 'bg-orange-400'
                      }`}
                    />
                    <div className="p-4 flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm">{company.name}</h3>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            company.riskLevel === 'critical'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}
                        >
                          {t.fraudChecker.riskLevels[company.riskLevel]}
                        </span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full border border-gray-200 text-gray-600">
                          {t.fraudChecker.scamTypes[company.type]}
                        </span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                          {company.reportedYear}
                        </span>
                      </div>

                      <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                        {company.description}
                      </p>

                      {company.aliases.length > 0 && (
                        <p className="text-[11px] text-gray-400 mt-2">
                          {t.fraudChecker.alsoKnownAs}: {company.aliases.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              /* Empty State */
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <Shield className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-700">{t.fraudChecker.noResults}</h3>
                <p className="text-xs text-gray-500 mt-1.5 max-w-[280px] mx-auto">
                  {t.fraudChecker.noResultsHint}
                </p>
              </div>
            )}
          </div>

          {/* Disclaimer */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 mt-6">
            <div className="flex gap-2.5">
              <Info className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-gray-500 leading-relaxed">
                {t.fraudChecker.disclaimer}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Analyze Message Tab */}
      {activeTab === 'analyze' && (
        <div className="p-4 space-y-4">
          <p className="text-sm text-gray-600">{t.fraudChecker.smsAnalyzer.subtitle}</p>

          {/* Textarea */}
          <div className="space-y-2">
            <textarea
              value={smsText}
              onChange={(e) => setSmsText(e.target.value)}
              placeholder={t.fraudChecker.smsAnalyzer.textareaPlaceholder}
              rows={6}
              className="w-full p-3.5 bg-white border border-gray-200 rounded-xl text-sm
                focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-300
                transition-all placeholder:text-gray-400 resize-none min-h-[140px]"
            />
            <div className="flex gap-2">
              <button
                onClick={handlePaste}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ClipboardPaste className="h-3.5 w-3.5" />
                {t.fraudChecker.smsAnalyzer.pasteButton}
              </button>
              {smsText && (
                <button
                  onClick={handleClear}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                  {t.fraudChecker.smsAnalyzer.clearButton}
                </button>
              )}
            </div>
          </div>

          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            disabled={!smsText.trim()}
            className="w-full py-3.5 bg-red-600 text-white font-semibold rounded-xl
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center gap-2
              hover:bg-red-700 active:bg-red-800 transition-colors"
          >
            <Shield className="h-4 w-4" />
            {t.fraudChecker.smsAnalyzer.analyzeButton}
          </button>

          {/* Results */}
          {analysisResult && (
            <div className="space-y-4">
              {/* Verdict Card */}
              {(() => {
                const colors = verdictColor(analysisResult.verdict);
                return (
                  <div className={`rounded-xl p-4 border ${colors.bg} ${colors.border}`}>
                    <div className="flex items-center gap-3">
                      {analysisResult.verdict === 'LIKELY_FRAUD' ? (
                        <AlertOctagon className="h-7 w-7 text-red-600 flex-shrink-0" />
                      ) : analysisResult.verdict === 'SUSPICIOUS' ? (
                        <AlertTriangle className="h-7 w-7 text-amber-600 flex-shrink-0" />
                      ) : (
                        <CheckCircle2 className="h-7 w-7 text-green-600 flex-shrink-0" />
                      )}
                      <div>
                        <p className={`text-xl font-bold ${colors.text}`}>
                          {verdictLabel(analysisResult.verdict)}
                        </p>
                        <p className={`text-sm font-medium ${colors.sub}`}>
                          {t.fraudChecker.smsAnalyzer.riskScore}: {analysisResult.riskScore}/100
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Matched Companies Warning */}
              {analysisResult.matchedCompanies.length > 0 && (
                <div className="space-y-2">
                  <div className="bg-red-100 border border-red-300 rounded-xl p-3">
                    <div className="flex items-start gap-2">
                      <AlertOctagon className="h-4 w-4 text-red-700 flex-shrink-0 mt-0.5" />
                      <p className="text-sm font-semibold text-red-800">
                        {t.fraudChecker.smsAnalyzer.matchedCompaniesWarning}
                      </p>
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800">
                    {t.fraudChecker.smsAnalyzer.matchedCompaniesTitle}
                  </h3>
                  {analysisResult.matchedCompanies.map((company, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                    >
                      <div className="flex">
                        <div className="w-1.5 flex-shrink-0 bg-red-500" />
                        <div className="p-3 flex-1">
                          <p className="font-semibold text-gray-900 text-sm">{company.name}</p>
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                company.riskLevel === 'critical'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-orange-100 text-orange-700'
                              }`}
                            >
                              {t.fraudChecker.riskLevels[company.riskLevel as keyof typeof t.fraudChecker.riskLevels]}
                            </span>
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full border border-gray-200 text-gray-600">
                              {t.fraudChecker.scamTypes[company.type as keyof typeof t.fraudChecker.scamTypes]}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Red Flags List */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-800">
                  {t.fraudChecker.smsAnalyzer.detectedRedFlags}
                </h3>
                {analysisResult.indicators.length === 0 ? (
                  <div className="flex items-center gap-2 py-3 px-4 bg-white border border-gray-200 rounded-xl">
                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <p className="text-sm text-gray-500">{t.fraudChecker.smsAnalyzer.noRedFlags}</p>
                  </div>
                ) : (
                  analysisResult.indicators.map((indicator, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl border border-gray-200 p-3.5 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-gray-900">
                          {t.fraudChecker.smsAnalyzer.indicatorCategories[indicator.category]}
                        </p>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${severityBadge(indicator.severity)}`}
                        >
                          {severityLabel(indicator.severity)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">{indicator.description}</p>
                      {indicator.matchedPhrases.length > 0 && (
                        <div>
                          <p className="text-[10px] text-gray-400 mb-1.5">
                            {t.fraudChecker.smsAnalyzer.matchedPhrases}:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {indicator.matchedPhrases.map((phrase, j) => (
                              <span
                                key={j}
                                className="text-[10px] px-2 py-0.5 bg-red-50 text-red-700 rounded-full border border-red-200"
                              >
                                &ldquo;{phrase}&rdquo;
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* AI Enhancing Loader */}
              {aiEnhancing && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 text-blue-600 animate-spin flex-shrink-0" />
                    <p className="text-sm text-blue-700">{t.fraudChecker.smsAnalyzer.aiEnhancing}</p>
                  </div>
                </div>
              )}

              {/* AI Analysis Box */}
              {analysisResult.aiSummary && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
                  <h3 className="text-sm font-semibold text-blue-900">
                    {t.fraudChecker.smsAnalyzer.aiAnalysisTitle}
                  </h3>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    {analysisResult.aiSummary}
                  </p>
                  <p className="text-[10px] text-blue-500">{t.fraudChecker.smsAnalyzer.aiPoweredBy}</p>
                </div>
              )}

              {/* Disclaimer */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5">
                <div className="flex gap-2.5">
                  <Info className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    {t.fraudChecker.smsAnalyzer.disclaimer}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
