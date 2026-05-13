import React, { useState } from 'react';
import "./styles/Assessment.css"
import { Activity, CheckCircle2 } from 'lucide-react';

const Assessment = ({ t }) => {
  const [scores, setScores] = useState({});
  const [result, setResult] = useState(null);

  const handleChange = (id, value) => {
    setScores({ ...scores, [id]: value });
  };

  const calculateCI = () => {
    const values = Object.values(scores);
    if (values.length === 0) return;
    const average = values.reduce((a, b) => a + b, 0) / values.length;
    setResult(average.toFixed(2));
  };

  return (
    <div className="assessment-container">
      <div className="assessment-header">
        <h2>{t.assessment.title}</h2>
        <p>{t.assessment.subtitle}</p>
      </div>

      <div className="assessment-grid">
        <div className="assessment-card">
          <h3>{t.assessment.categories.workplace}</h3>
          <div className="input-group">
            <label>Factor 01</label>
            <input type="number" min="0" max="10" onChange={(e) => handleChange('f1', +e.target.value)} />
          </div>
          <div className="input-group">
            <label>Factor 02</label>
            <input type="number" min="0" max="10" onChange={(e) => handleChange('f2', +e.target.value)} />
          </div>
        </div>

        <div className="assessment-card">
          <h3>{t.assessment.categories.equipment}</h3>
          <div className="input-group">
            <label>Factor 03</label>
            <input type="number" min="0" max="10" onChange={(e) => handleChange('f3', +e.target.value)} />
          </div>
          <div className="input-group">
            <label>Factor 04</label>
            <input type="number" min="0" max="10" onChange={(e) => handleChange('f4', +e.target.value)} />
          </div>
        </div>
      </div>

      <div className="action-area">
        <button className="calc-btn" onClick={calculateCI}>
          <Activity size={20} />
          {t.assessment.calculate_btn}
        </button>
      </div>

      {result && (
        <div className="result-display">
          <CheckCircle2 size={40} color="#2e7d32" />
          <h4>{t.assessment.result_title}: {result}</h4>
        </div>
      )}
    </div>
  );
};

export default Assessment;