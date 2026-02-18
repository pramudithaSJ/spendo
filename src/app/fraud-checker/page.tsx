'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShieldAlert, AlertTriangle, Search, X, Shield, Info } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { SPAM_COMPANIES, ScamType } from '@/lib/spamCompany';

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

  const filteredCompanies = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return SPAM_COMPANIES.filter((company) => {
      // Filter by scam type
      if (activeFilter !== 'all' && company.type !== activeFilter) return false;
      // Filter by search query
      if (!query) return true;
      if (company.name.toLowerCase().includes(query)) return true;
      return company.aliases.some((alias) => alias.toLowerCase().includes(query));
    });
  }, [searchQuery, activeFilter]);

  const getFilterLabel = (filter: typeof FILTER_TYPES[number]) => {
    if (filter.key === 'all') return t.fraudChecker.filterAll;
    return t.fraudChecker.scamTypes[filter.labelKey as keyof typeof t.fraudChecker.scamTypes];
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
    </div>
  );
}
