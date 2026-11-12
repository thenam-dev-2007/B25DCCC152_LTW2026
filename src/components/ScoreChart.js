import React from 'react';

export const ScoreChart = ({ rounds }) => {
  if (!rounds || rounds.length === 0) return null;

  const maxScore = Math.max(1000, ...rounds.map((r) => r.scoreAfter));

  return (
    <div style={{ margin: '30px 0', textAlign: 'center' }}>
      <h4>Biểu đồ điểm qua các câu</h4>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: '10px',
          height: '250px',
          borderBottom: '2px solid #333',
          paddingBottom: '5px',
          paddingTop: '20px',
          overflowX: 'auto',
        }}
      >
        {rounds.map((round, idx) => {
          const heightPx = Math.max(10, (round.scoreAfter / maxScore) * 200);
          const isCorrect = round.correct;

          return (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '45px' }}>
              <div style={{ fontSize: '11px', marginBottom: '5px', whiteSpace: 'nowrap' }}>
                {round.scoreAfter.toLocaleString('vi-VN')}
              </div>
              <div
                style={{
                  width: '30px',
                  height: `${heightPx}px`,
                  backgroundColor: isCorrect ? '#4caf50' : '#f44336',
                  borderRadius: '4px 4px 0 0',
                }}
              />
              <div style={{ fontSize: '12px', marginTop: '5px', fontWeight: 'bold' }}>
                C{idx + 1}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};