import { useState } from 'react';
import { useCurrency } from './hooks/useCurrency';
import './App.css';

const API_KEY = '3962c1b12165c66549b49a7a'; // Replace with your exchangerate-api.com key

function App() {
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');
  const { rates, loading, error, currencies } = useCurrency(API_KEY);

  const convert = () => {
    if (!rates?.rates || !amount) return '0.00';
    const usdAmount = parseFloat(amount) / (rates.rates[fromCurrency] || 1);
    return (usdAmount * (rates.rates[toCurrency] || 1)).toFixed(2);
  };

  const swappedResult = convert();

  if (error) {
    return (
      <div className="app">
        <h1>Currency Converter</h1>
        <div className="error">{error}</div>
        <p>Check your API key and try refreshing.</p>
      </div>
    );
  }

  return (
    <div className="app">
      <h1>Currency Converter</h1>
      
      {loading && <div className="loading">Loading exchange rates...</div>}
      
      <div className="converter">
        <div className="input-group">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            min="0"
            step="0.01"
            disabled={loading}
          />
          <select 
            value={fromCurrency} 
            onChange={(e) => setFromCurrency(e.target.value)}
            disabled={loading}
          >
            {currencies.map(c => (
              <option key={c.code} value={c.code}>
                {c.symbol} {c.code}
              </option>
            ))}
          </select>
        </div>

        <div className="swap">↔️</div>

        <div className="input-group">
          <input
            type="number"
            value={rates ? swappedResult : ''}
            readOnly
            placeholder={loading ? "Loading..." : "Converted amount"}
          />
          <select 
            value={toCurrency} 
            onChange={(e) => setToCurrency(e.target.value)}
            disabled={loading}
          >
            {currencies.map(c => (
              <option key={c.code} value={c.code}>
                {c.symbol} {c.code}
              </option>
            ))}
          </select>
        </div>
      </div>

      {rates && (
        <div className="footer">
          <p>Updated: {rates.date} | Base: {rates.base}</p>
        </div>
      )}
    </div>
  );
}

export default App;
