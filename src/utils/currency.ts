export type GlobalCurrency = 'USD' | 'EUR' | 'GBP' | 'INR';

export interface CurrencyConfig {
  code: GlobalCurrency;
  symbol: string;
  name: string;
  locale: string;
  flag: string;
  symbolPosition: 'prefix' | 'suffix';
  multiplierFromUSD: number; // Approximate scaling for realistic default slider ranges
}

export const CURRENCIES: Record<GlobalCurrency, CurrencyConfig> = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    locale: 'en-US',
    flag: '🇺🇸',
    symbolPosition: 'prefix',
    multiplierFromUSD: 1
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    locale: 'de-DE',
    flag: '🇪🇺',
    symbolPosition: 'prefix',
    multiplierFromUSD: 0.92
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    locale: 'en-GB',
    flag: '🇬🇧',
    symbolPosition: 'prefix',
    multiplierFromUSD: 0.79
  },
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    locale: 'en-IN',
    flag: '🇮🇳',
    symbolPosition: 'prefix',
    multiplierFromUSD: 85
  }
};

export const CURRENCY_LIST: CurrencyConfig[] = [
  CURRENCIES.USD,
  CURRENCIES.EUR,
  CURRENCIES.GBP,
  CURRENCIES.INR
];

export function formatCurrency(
  val: number,
  currency: GlobalCurrency = 'USD',
  decimals: number = 0
): string {
  const cfg = CURRENCIES[currency] || CURRENCIES.USD;
  const num = Math.round(val);
  
  if (currency === 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: decimals
    }).format(num);
  }

  return new Intl.NumberFormat(cfg.locale, {
    style: 'currency',
    currency: cfg.code,
    maximumFractionDigits: decimals
  }).format(num);
}

export function formatCurrencyShort(
  val: number,
  currency: GlobalCurrency = 'USD'
): string {
  const cfg = CURRENCIES[currency] || CURRENCIES.USD;
  const sym = cfg.symbol;

  if (currency === 'INR') {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(1)} K`;
    return `₹${Math.round(val)}`;
  }

  // Worldwide Western notation (Millions, Billions, Thousands)
  if (val >= 1000000000) {
    return `${sym}${(val / 1000000000).toFixed(2)}B`;
  }
  if (val >= 1000000) {
    return `${sym}${(val / 1000000).toFixed(2)}M`;
  }
  if (val >= 1000) {
    return `${sym}${(val / 1000).toFixed(1)}K`;
  }
  return `${sym}${Math.round(val).toLocaleString('en-US')}`;
}

export function getSavedCurrency(): GlobalCurrency {
  try {
    const saved = localStorage.getItem('quickfree_currency') as GlobalCurrency;
    if (saved && CURRENCIES[saved]) {
      return saved;
    }
  } catch (e) {
    // Ignore localStorage errors
  }
  return 'USD';
}

export function saveCurrency(c: GlobalCurrency): void {
  try {
    localStorage.setItem('quickfree_currency', c);
  } catch (e) {
    // Ignore localStorage errors
  }
}
