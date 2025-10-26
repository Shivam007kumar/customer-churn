import React, { useState } from 'react';
import './App.css';

// --- Helper Components for rich UI ---

// 1. SliderField: Combines a range slider with a precise number input
const SliderField = ({ label, name, value, onChange, min, max, step = 1, unit = "" }) => (
  <div className="form-group slider-group">
    <div className="slider-header">
      <label htmlFor={name}>{label}</label>
      <span className="slider-value">{value}{unit}</span>
    </div>
    <div className="slider-controls">
      <input
        type="range"
        id={name}
        name={name}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="range-slider"
      />
      <input
        type="number"
        name={name}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="number-input"
      />
    </div>
  </div>
);

// 2. RadioCardField: Apple-style clickable cards for options
const RadioCardField = ({ label, name, value, options, onChange }) => (
  <div className="form-group radio-group-container">
    <label className="radio-label">{label}</label>
    <div className="radio-options">
      {options.map((option) => (
        <label
          key={option}
          className={`radio-card ${value === option ? 'selected' : ''}`}
        >
          <input
            type="radio"
            name={name}
            value={option}
            checked={value === option}
            onChange={onChange}
            className="radio-input-hidden"
          />
          <span className="radio-text">{option}</span>
        </label>
      ))}
    </div>
  </div>
);


// --- Main App Component ---

function App() {
  const [formData, setFormData] = useState({
    age: 40,
    tenure_months: 24,
    monthly_charges: 70.00,
    total_charges: 1500.00,
    monthly_minutes: 400,
    data_usage_gb: 20,
    num_products: 2,
    feature_adoption_score: 50,
    last_login_days_ago: 5,
    logins_last_month: 10,
    customer_satisfaction: 3,
    total_transactions: 24,
    total_failed_transactions: 0,
    avg_transaction_amount: 70,
    days_since_last_transaction: 15,
    failed_transaction_rate: 0.0,
    total_tickets: 2,
    open_tickets: 0,
    high_priority_tickets: 0,
    avg_resolution_time: 24,
    contract_type: "Month-to-Month",
    payment_method: "Credit Card",
    gender: "Female",
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    // Ensure numbers remain numbers, but keep decimal points if typing
    let processedValue = value;
    if (type === 'number' || type === 'range') {
       processedValue = value === '' ? '' : Number(value);
    }
    setFormData(prev => ({ ...prev, [name]: processedValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPrediction(null); setError(''); setLoading(true);

    try {
       // Ensure all data is in correct format before sending
       const payload = { ...formData };
       for (let key in payload) {
           if (typeof payload[key] === 'string' && !isNaN(payload[key])) {
               payload[key] = Number(payload[key]);
           }
       }

      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Prediction request failed');
      const result = await response.json();
      setPrediction(result);
    } catch (err) {
      setError('Unable to connect to the prediction API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="app-container">
        <header className="App-header">
          <h1>Churn Predictor Pro</h1>
          <p>Configure customer profile to analyze retention risk.</p>
        </header>

        <main>
          <form onSubmit={handleSubmit}>
            <div className="form-sections">
              
              {/* --- SECTION 1: Demographics & Contract --- */}
              <section className="form-section">
                <h2>Profile & Contract</h2>
                <div className="section-grid">
                   <SliderField label="Age" name="age" value={formData.age} min={18} max={90} onChange={handleChange} />
                   <RadioCardField label="Gender" name="gender" value={formData.gender} options={["Male", "Female"]} onChange={handleChange} />
                   <SliderField label="Tenure (Months)" name="tenure_months" value={formData.tenure_months} min={0} max={72} onChange={handleChange} />
                   <RadioCardField label="Contract Type" name="contract_type" value={formData.contract_type} options={["Month-to-Month", "One Year", "Two Year"]} onChange={handleChange} />
                </div>
                 <RadioCardField label="Payment Method" name="payment_method" value={formData.payment_method} options={["Electronic Check", "Mailed Check", "Bank Transfer", "Credit Card"]} onChange={handleChange} />
              </section>

              {/* --- SECTION 2: Usage Metrics --- */}
              <section className="form-section">
                <h2>Usage & Engagement</h2>
                <div className="section-grid">
                  <SliderField label="Monthly Charges ($)" name="monthly_charges" value={formData.monthly_charges} min={15} max={150} step={0.5} onChange={handleChange} unit="$" />
                  <SliderField label="Total Charges ($)" name="total_charges" value={formData.total_charges} min={0} max={10000} step={10} onChange={handleChange} unit="$" />
                  <SliderField label="Monthly Minutes" name="monthly_minutes" value={formData.monthly_minutes} min={0} max={2000} step={10} onChange={handleChange} />
                  <SliderField label="Data Usage (GB)" name="data_usage_gb" value={formData.data_usage_gb} min={0} max={500} step={1} onChange={handleChange} unit=" GB" />
                  <SliderField label="Products Owned" name="num_products" value={formData.num_products} min={1} max={4} onChange={handleChange} />
                  <SliderField label="Adoption Score" name="feature_adoption_score" value={formData.feature_adoption_score} min={0} max={100} onChange={handleChange} />
                  <SliderField label="Satisfaction (1-5)" name="customer_satisfaction" value={formData.customer_satisfaction} min={1} max={5} step={0.1} onChange={handleChange} />
                  <SliderField label="Days Since Login" name="last_login_days_ago" value={formData.last_login_days_ago} min={0} max={365} onChange={handleChange} />
                </div>
              </section>

               {/* --- SECTION 3: Transactional Health --- */}
               <section className="form-section">
                <h2>Transactions & Support</h2>
                <div className="section-grid">
                  <SliderField label="Total Transactions" name="total_transactions" value={formData.total_transactions} min={0} max={200} onChange={handleChange} />
                  <SliderField label="Failed Txns" name="total_failed_transactions" value={formData.total_failed_transactions} min={0} max={50} onChange={handleChange} />
                  <SliderField label="Total Tickets" name="total_tickets" value={formData.total_tickets} min={0} max={50} onChange={handleChange} />
                  <SliderField label="Open Tickets" name="open_tickets" value={formData.open_tickets} min={0} max={10} onChange={handleChange} />
                  <SliderField label="Resolution Time (Hrs)" name="avg_resolution_time" value={formData.avg_resolution_time} min={0} max={200} onChange={handleChange} />
                   {/* For less common inputs, standard SliderField is still fine, or you could add them here if needed */}
                </div>
              </section>

            </div>

            <div className="sticky-footer">
              {error && <div className="error-banner">{error}</div>}
              <div className="action-bar">
                  {prediction && (
                    <div className={`mini-result ${prediction.prediction === 1 ? 'risk-high' : 'risk-low'}`}>
                        <span className="label">Risk Probability:</span>
                        <span className="value">{(prediction.probability * 100).toFixed(1)}%</span>
                    </div>
                  )}
                  <button type="submit" className="predict-btn" disabled={loading}>
                    {loading ? <span className="loading-spinner"></span> : 'Analyze Risk'}
                  </button>
              </div>
            </div>

          </form>
        </main>
      </div>

       {/* Full Screen Result Overlay */}
       {prediction && (
        <div className="result-overlay" onClick={() => setPrediction(null)}>
           <div className={`result-card ${prediction.prediction === 1 ? 'churn-risk' : 'retain-safe'}`} onClick={e => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setPrediction(null)}>×</button>
              <h3>Analysis Complete</h3>
              <div className="risk-gauge">
                  <svg viewBox="0 0 36 36" className="circular-chart">
                    <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="circle" strokeDasharray={`${prediction.probability * 100}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <text x="18" y="20.35" className="percentage">{(prediction.probability * 100).toFixed(0)}%</text>
                  </svg>
              </div>
              <h2>{prediction.prediction === 1 ? "High Churn Risk" : "Low Churn Risk"}</h2>
              <p>{prediction.prediction === 1 
                 ? "This customer shows strong indicators of leaving. Immediate retention recommended." 
                 : "This customer appears stable and satisfied with current services."}
              </p>
           </div>
        </div>
       )}
    </div>
  );
}

export default App;