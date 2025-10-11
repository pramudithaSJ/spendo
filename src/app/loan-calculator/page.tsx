'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormattedNumberInput } from '@/components/ui/FormattedNumberInput';
import { Calculator, TrendingUp, PieChart, ArrowLeft, Info, X, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export default function LoanCalculatorPage() {
  const { t } = useLanguage();
  const { currency } = useCurrency();

  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [tenureYears, setTenureYears] = useState('');
  const [tenureMonths, setTenureMonths] = useState('');
  const [selectedLoanType, setSelectedLoanType] = useState('personal');

  const [results, setResults] = useState<{
    monthlyEMI: number;
    totalInterest: number;
    totalAmount: number;
    principalPercentage: number;
    interestPercentage: number;
  } | null>(null);

  const [errors, setErrors] = useState({
    amount: '',
    rate: '',
    tenure: '',
  });

  const loanTypes = [
    { id: 'personal', label: t.loanCalculator.personalLoan, rate: '12-18' },
    { id: 'home', label: t.loanCalculator.homeLoan, rate: '8-12' },
    { id: 'vehicle', label: t.loanCalculator.vehicleLoan, rate: '10-15' },
    { id: 'education', label: t.loanCalculator.educationLoan, rate: '6-10' },
    { id: 'business', label: t.loanCalculator.businessLoan, rate: '14-20' },
  ];

  const validateInputs = (): boolean => {
    const newErrors = { amount: '', rate: '', tenure: '' };
    let isValid = true;

    const amount = parseFloat(loanAmount);
    if (!loanAmount || isNaN(amount) || amount <= 0) {
      newErrors.amount = t.loanCalculator.invalidAmount;
      isValid = false;
    }

    const rate = parseFloat(interestRate);
    if (!interestRate || isNaN(rate) || rate <= 0 || rate > 100) {
      newErrors.rate = t.loanCalculator.invalidRate;
      isValid = false;
    }

    const years = parseInt(tenureYears) || 0;
    const months = parseInt(tenureMonths) || 0;
    const totalMonths = years * 12 + months;

    if (totalMonths <= 0) {
      newErrors.tenure = t.loanCalculator.invalidTenure;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const calculateEMI = () => {
    if (!validateInputs()) return;

    const P = parseFloat(loanAmount);
    const r = parseFloat(interestRate) / 12 / 100; // Monthly interest rate
    const years = parseInt(tenureYears) || 0;
    const months = parseInt(tenureMonths) || 0;
    const n = years * 12 + months; // Total months

    // EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
    const emi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    const totalAmount = emi * n;
    const totalInterest = totalAmount - P;

    const principalPercentage = (P / totalAmount) * 100;
    const interestPercentage = (totalInterest / totalAmount) * 100;

    setResults({
      monthlyEMI: emi,
      totalInterest,
      totalAmount,
      principalPercentage,
      interestPercentage,
    });
  };

  const handleLoanTypeSelect = (type: string, rate: string) => {
    setSelectedLoanType(type);
    // Set the middle value of the rate range as default
    const [min, max] = rate.split('-').map(Number);
    const avgRate = ((min + max) / 2).toFixed(1);
    setInterestRate(avgRate);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-2">
            <Link href="/profile">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Calculator className="h-6 w-6 text-gray-900" />
              <h1 className="text-xl font-bold text-gray-900">
                {t.loanCalculator.title}
              </h1>
            </div>
          </div>
          <p className="text-sm text-gray-500 pl-11">{t.loanCalculator.subtitle}</p>
        </div>
      </header>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Loan Type Selection */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              {t.loanCalculator.loanType}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {loanTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleLoanTypeSelect(type.id, type.rate)}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    selectedLoanType === type.id
                      ? 'border-black bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-sm">{type.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{type.rate}% p.a.</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-amber-900 leading-relaxed">
                  {t.loanCalculator.ratesDisclaimer}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Typical Rates Info */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">
                  {t.loanCalculator.typicalRates}
                </p>
                <div className="text-xs text-blue-800 mt-2 space-y-1">
                  <p>{t.loanCalculator.personalRate}</p>
                  <p>{t.loanCalculator.homeRate}</p>
                  <p>{t.loanCalculator.vehicleRate}</p>
                  <p>{t.loanCalculator.educationRate}</p>
                  <p>{t.loanCalculator.businessRate}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Input Fields */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">
                {t.loanCalculator.loanAmount}
              </CardTitle>
              {loanAmount && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLoanAmount('')}
                  className="h-8 text-gray-500 hover:text-gray-900"
                >
                  <X className="h-4 w-4 mr-1" />
                  {t.loanCalculator.clearAmount}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <FormattedNumberInput
              value={loanAmount}
              onChange={(value) => setLoanAmount(value)}
              placeholder={t.loanCalculator.loanAmountPlaceholder}
              error={!!errors.amount}
            />
            {errors.amount && (
              <p className="text-sm text-red-600">{errors.amount}</p>
            )}

            {/* Quick Amount Buttons */}
            <div>
              <p className="text-xs text-gray-600 mb-2">{t.loanCalculator.quickAmounts}:</p>
              <div className="grid grid-cols-5 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setLoanAmount('100000')}
                  className="text-xs h-8"
                >
                  100K
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setLoanAmount('500000')}
                  className="text-xs h-8"
                >
                  500K
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setLoanAmount('1000000')}
                  className="text-xs h-8"
                >
                  1M
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setLoanAmount('5000000')}
                  className="text-xs h-8"
                >
                  5M
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setLoanAmount('10000000')}
                  className="text-xs h-8"
                >
                  10M
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              {t.loanCalculator.interestRate}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="number"
              step="0.1"
              placeholder={t.loanCalculator.interestRatePlaceholder}
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className={`text-lg ${errors.rate ? 'border-red-500' : ''}`}
            />
            {errors.rate && (
              <p className="text-sm text-red-600 mt-2">{errors.rate}</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              {t.loanCalculator.loanTenure}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-2 block">
                  {t.loanCalculator.years}
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(e.target.value)}
                  className={errors.tenure ? 'border-red-500' : ''}
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-2 block">
                  {t.loanCalculator.months}
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={tenureMonths}
                  onChange={(e) => setTenureMonths(e.target.value)}
                  className={errors.tenure ? 'border-red-500' : ''}
                />
              </div>
            </div>
            {errors.tenure && (
              <p className="text-sm text-red-600 mt-2">{errors.tenure}</p>
            )}
          </CardContent>
        </Card>

        {/* Calculate Button */}
        <Button
          onClick={calculateEMI}
          className="w-full bg-black text-white hover:bg-gray-800 h-12 text-base"
        >
          <Calculator className="h-5 w-5 mr-2" />
          {t.loanCalculator.calculateEMI}
        </Button>

        {/* Results */}
        {results && (
          <>
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  {t.loanCalculator.results}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                  <p className="text-sm text-green-800 mb-1">
                    {t.loanCalculator.monthlyEMI}
                  </p>
                  <p className="text-2xl font-bold text-green-900">
                    {formatCurrency(results.monthlyEMI, currency)}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">
                      {t.loanCalculator.principalAmount}
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(parseFloat(loanAmount), currency)}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">
                      {t.loanCalculator.totalInterest}
                    </p>
                    <p className="text-lg font-semibold text-orange-600">
                      {formatCurrency(results.totalInterest, currency)}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">
                      {t.loanCalculator.totalAmount}
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(results.totalAmount, currency)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Breakdown Chart */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  {t.loanCalculator.breakdown}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">{t.loanCalculator.principal}</span>
                      <span className="font-medium">
                        {results.principalPercentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${results.principalPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">{t.loanCalculator.interest}</span>
                      <span className="font-medium">
                        {results.interestPercentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-orange-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${results.interestPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
