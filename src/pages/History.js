import React, { useState } from 'react';
import { formatScore } from '../data';

export const History = ({ history, clearHistory }) => {
  const [selectedPlayer, setSelectedPlayer] = useState('All');

  if (!history || history.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <h2>Lịch sử các lượt chơi</h2>
        <p>Chưa có lượt chơi nào.</p>
      </div>
    );
  }

  const players = ['All', ...Array.from(new Set(history.map((h) => h.name)))];

  const filteredHistory = selectedPlayer === 'All'
    ? history
    : history.filter((h) => h.name === selectedPlayer);

  const sortedHistory = [...filteredHistory].sort((a, b) => b.finalScore - a.finalScore);

  const totalGames = sortedHistory.length;
  const maxScore = totalGames > 0 ? Math.max(...sortedHistory.map((h) => h.finalScore)) : 0;
  const brokeCount = sortedHistory.filter((h) => h.result === 'Cháy túi').length;

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', padding: '10px' }}>
      <h2>Lịch sử các lượt chơi</h2>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0', background: '#f5f5f5', padding: '15px', borderRadius: '8px' }}>
        <div>
          <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Người chơi:</label>
          <select
            value={selectedPlayer}
            onChange={(e) => setSelectedPlayer(e.target.value)}
            style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="All">Tất cả</option>
            {players.filter((p) => p !== 'All').map((p, idx) => (
              <option key={idx} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <button
          onClick={clearHistory}
          style={{ padding: '8px 15px', backgroundColor: '#d32f2f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Xóa lịch sử
        </button>
      </div>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', fontWeight: 'bold', background: '#e8f5e9', padding: '12px', borderRadius: '6px' }}>
        <div>Số lượt chơi: {totalGames}</div>
        <div>Điểm cao nhất: {formatScore(maxScore)}</div>
        <div>Số lần cháy túi: {brokeCount}</div>
      </div>

      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: '#fff' }}>
        <thead>
          <tr style={{ background: '#eee' }}>
            <th>Người chơi</th>
            <th>Số câu đúng</th>
            <th>Điểm cuối</th>
            <th>Đánh giá</th>
            <th>Thời gian</th>
          </tr>
        </thead>
        <tbody>
          {sortedHistory.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.correctCount}/12</td>
              <td>{formatScore(item.finalScore)}</td>
              <td>{item.result}</td>
              <td>{item.playedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};