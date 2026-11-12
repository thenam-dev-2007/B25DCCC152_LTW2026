import React, { useState, useEffect } from 'react';
import { LEVELS, formatMultiplier, MIN_BET } from '../data';
import { validateBet, MAX_BET_DYNAMIC } from '../utils';
import { ScoreInfo } from './ScoreInfo';
import { Supports } from './Supports';

export const BetPanel = ({
  currentQuestionIndex,
  totalQuestions,
  question,
  score,
  onPlaceBet,
  usedPreview,
  usedInsurance,
  usedHint,
  onUsePreview,
  onUseInsurance,
  onUseHint,
  showPreview,
}) => {
  const [betInput, setBetInput] = useState(100);
  const [error, setError] = useState('');

  const multVal = question.level === 1 ? 1 : question.level === 2 ? 1.5 : 2;
  const maxAllowed = MAX_BET_DYNAMIC(score);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setBetInput((prev) => Math.min(maxAllowed, Number(prev) + 100));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setBetInput((prev) => Math.max(MIN_BET, Number(prev) - 100));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const betVal = Number(betInput);
        const err = validateBet(betVal, score);
        if (!err) {
          onPlaceBet(betVal);
        } else {
          setError(err);
        }
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
    };
  }, [betInput, maxAllowed, score, onPlaceBet]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const betVal = Number(betInput);
    const err = validateBet(betVal, score);
    if (err) {
      setError(err);
    } else {
      setError('');
      onPlaceBet(betVal);
    }
  };

  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '40px auto', 
      padding: '30px', 
      border: '1px solid #e5e7eb', 
      borderRadius: '16px', 
      background: '#ffffff',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px', 
        fontSize: '15px', 
        color: '#4b5563', 
        fontWeight: '600',
        borderBottom: '1px solid #f3f4f6',
        paddingBottom: '12px'
      }}>
        <span>Câu {currentQuestionIndex + 1}/{totalQuestions}</span>
        <span style={{ color: '#0284c7', background: '#e0f2fe', padding: '4px 10px', borderRadius: '6px' }}>
          {question.topic} · {LEVELS[question.level]} ({formatMultiplier(multVal)})
        </span>
      </div>

      {showPreview && (
        <div style={{ 
          background: '#f0f9ff', 
          padding: '16px', 
          borderRadius: '12px', 
          marginBottom: '20px', 
          border: '1px solid #bae6fd',
          color: '#0369a1',
          fontSize: '15px'
        }}>
          <strong>Xem trước câu hỏi:</strong> {question.question}
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <ScoreInfo score={score} />
      </div>

      <div style={{ marginBottom: '25px', background: '#f9fafb', padding: '14px', borderRadius: '12px', border: '1px solid #f3f4f6' }}>
        <Supports
          step="betting"
          usedPreview={usedPreview}
          usedInsurance={usedInsurance}
          usedHint={usedHint}
          onUsePreview={onUsePreview}
          onUseInsurance={onUseInsurance}
          onUseHint={onUseHint}
        />
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
            Nhập mức cược (phím ↑ ↓ để tăng giảm, Enter để xác nhận):
          </label>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              type="number"
              step="100"
              min="100"
              max={maxAllowed}
              value={betInput}
              onChange={(e) => {
                setBetInput(e.target.value);
                setError(validateBet(Number(e.target.value), score));
              }}
              style={{ 
                padding: '12px 16px', 
                fontSize: '16px', 
                width: '180px', 
                borderRadius: '10px', 
                border: '1px solid #d1d5db', 
                background: '#ffffff', 
                color: '#111827',
                fontWeight: '600'
              }}
            />
            <button
              type="submit"
              disabled={!!validateBet(Number(betInput), score)}
              style={{
                padding: '12px 24px',
                fontSize: '16px',
                backgroundColor: validateBet(Number(betInput), score) ? '#9ca3af' : '#2e7d32',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                cursor: validateBet(Number(betInput), score) ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                flex: 1,
                boxShadow: validateBet(Number(betInput), score) ? 'none' : '0 4px 12px rgba(46, 125, 50, 0.3)',
                transition: 'all 0.2s'
              }}
            >
              Đặt cược ngay
            </button>
          </div>
        </div>
        {error && <div style={{ color: '#dc2626', fontSize: '13px', marginTop: '8px', fontWeight: '500' }}>{error}</div>}
      </form>
    </div>
  );
};