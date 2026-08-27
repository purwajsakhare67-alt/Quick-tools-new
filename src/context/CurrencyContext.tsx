import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  GlobalCurrency, 
  CurrencyConfig, 
  CURRENCIES, 
  formatCurrency as utilsFormatCurrency, 
  formatCurrencyShort as utilsFormatCurrencyShort, 
  getSavedCurrency, 
  saveCurrency as utilsSaveCurrency 
} from '../utils/currency';
import { CurrencySelector } from '../components/CurrencySelector';

interface CurrencyContextType {
  currency: GlobalCurrency;
  setCurrency: (c: GlobalCurrency) => void;
  symbol: string;
  config: CurrencyConfig;
  format: (val: number, decimals?: number) => string;
  formatShort: (val: number) => string;
  CurrencySelectorBar: React.FC<{ className?: string; variant?: 'pills' | 'dropdown' | 'compact' }>;
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<GlobalCurrency>(getSavedCurrency());

  const setCurrency = (c: GlobalCurrency) => {
    setCurrencyState(c);
    utilsSaveCurrency(c);
  };

  const currentConfig = CURRENCIES[currency] || CURRENCIES.USD;
  const symbol = currentConfig.symbol;

  const format = (val: number, decimals: number = 0) => {
    return utilsFormatCurrency(val, currency, decimals);
  };

  const formatShort = (val: number) => {
    return utilsFormatCurrencyShort(val, currency);
  };

  const CurrencySelectorBar: React.FC<{ className?: string; variant?: 'pills' | 'dropdown' | 'compact' }> = ({
    className = '',
    variant = 'pills'
  }) => {
    return (
      <CurrencySelector
        currentCurrency={currency}
        onCurrencyChange={setCurrency}
        className={className}
        variant={variant}
      />
    );
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        symbol,
        config: currentConfig,
        format,
        formatShort,
        CurrencySelectorBar
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    // Return graceful standalone fallback if outside provider
    const fallbackCurrency = getSavedCurrency();
    const cfg = CURRENCIES[fallbackCurrency] || CURRENCIES.USD;
    return {
      currency: fallbackCurrency,
      setCurrency: () => {},
      symbol: cfg.symbol,
      config: cfg,
      format: (v, d = 0) => utilsFormatCurrency(v, fallbackCurrency, d),
      formatShort: (v) => utilsFormatCurrencyShort(v, fallbackCurrency),
      CurrencySelectorBar: () => null
    };
  }
  return ctx;
};
