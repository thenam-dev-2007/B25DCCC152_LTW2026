import React from 'react';
import { formatScore } from '../data';

export const ScoreInfo = ({ score, bet }) => {
  return (
    <div style={{ display: 'flex', gap: '20px', marginBottom: '15px', fontSize: '16px', fontWeight: 'bold' }}>
      <div>Điểm hiện có: <span style={{ color: '#2e7d32' }}>{formatScore(score)}</span></div>
      {bet !== null && bet !== undefined && bet > 0 && (
        <div>Đang cược: <span style={{ color: '#d32f2f' }}>{formatScore(bet)}</span></div>
      )}
    </div>
  );
};