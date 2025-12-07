import { useState, useEffect } from 'react';
import axios from 'axios';
import type { CurrencyData } from '../types/currency';

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' }
];

export const useCurrency = (apiKey: string) => {
  const [rates, setRates] = useState<CurrencyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRates = async () => {
      if (!apiKey || apiKey === 'YOUR_API_KEY') return;
      
      setLoading(true);
      try {
        const res = await axios.get(
          `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`
        );
        
        console.log('Full API response:', res.data); // DEBUG
        
        // Handle different possible response structures
        const apiData = res.data;
        let conversionRates = {};
        
        if (apiData.conversion_rates) {
          // Newer API format
          conversionRates = apiData.conversion_rates;
        } else if (apiData.rates) {
          // Legacy format
          conversionRates = apiData.rates;
        } else {
          throw new Error('Unexpected API response format');
        }
        
        setRates({
          rates: conversionRates,
          base: apiData.base_code || 'USD',
          date: apiData.conversion_time || new Date().toISOString().split('T')[0]
        });
        setError('');
      } catch (err: any) {
        console.error('API Error:', err.response?.data || err.message);
        setError(`API Error: ${err.response?.status || 'Unknown'}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRates();
  }, [apiKey]);

  return { rates, loading, error, currencies: CURRENCIES };
};
