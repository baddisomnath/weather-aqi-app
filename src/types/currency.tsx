export interface CurrencyData {
  rates: Record<string, number>;
  base: string;
  date: string;
}

export interface CurrencyOption {
  code: string;
  name: string;
  symbol: string;
}
