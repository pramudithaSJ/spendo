'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Currency } from '@/lib/types';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (curr: Currency) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('LKR');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load saved currency from localStorage
    const savedCurrency = localStorage.getItem('spendo-currency') as Currency;
    if (savedCurrency && (savedCurrency === 'USD' || savedCurrency === 'LKR')) {
      setCurrencyState(savedCurrency);
    } else {
      // Default to LKR for Sri Lankan users
      setCurrencyState('LKR');
    }
    setMounted(true);
  }, []);

  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr);
    localStorage.setItem('spendo-currency', curr);
  };

  const value: CurrencyContextType = {
    currency,
    setCurrency,
  };

  // Prevent flash of wrong currency
  if (!mounted) {
    return null;
  }

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
