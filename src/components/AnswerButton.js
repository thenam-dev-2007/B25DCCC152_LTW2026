import React from 'react';
import { LETTERS } from '../data';

export const AnswerButton = ({ index, option, selectedOption, correctOption, revealed, onClick }) => {
  let bg = '#ffffff';
  let border = '1px solid #d1d5db';
  let color = '#1f2937';

  if (revealed) {
    if (index === correctOption) {
      bg = '#e8f5e9';
      border = '2px solid #4caf50';
      color = '#2e7d32';
    } else if (index === selectedOption) {
      bg = '#ffebee';
      border = '2px solid #f44336';
      color = '#c62828';
    }
  } else if (index === selectedOption) {
    bg = '#e3f2fd';
    border = '2px solid #2196f3';
  }

  return (
    <button
      onClick={onClick}
      disabled={revealed}
      style={{
        padding: '16px 20px',
        textAlign: 'left',
        backgroundColor: bg,
        border: border,
        color: color,
        borderRadius: '12px',
        fontSize: '15px',
        cursor: revealed ? 'default' : 'pointer',
        fontWeight: index === correctOption && revealed ? '700' : '500',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
      }}
    >
      <span style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        width: '28px', 
        height: '28px', 
        borderRadius: '6px', 
        background: '#f3f4f6', 
        fontSize: '13px', 
        fontWeight: '700',
        color: '#374151'
      }}>
        {LETTERS[index]}
      </span>
      <span style={{ flex: 1 }}>{option}</span>
    </button>
  );
};