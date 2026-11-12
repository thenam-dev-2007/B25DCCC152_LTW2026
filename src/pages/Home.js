import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatScore } from '../data';

export const Home = ({ playerName, setPlayerName, history }) => {
  const [nameInput, setNameInput] = useState(playerName || '');
  const navigate = useNavigate();

  const handleStart = (e) => {
    e.preventDefault();
    if (nameInput.trim()) {
      setPlayerName(nameInput.trim());
      navigate('/play');
    }
  };

  let bestRecord = null;
  if (history && history.length > 0) {
    bestRecord = [...history].sort((a, b) => b.finalScore - a.finalScore)[0];
  }

  return (
    <div style={{ textAlign: 'center', maxWidth: '700px', margin: '40px auto', padding: '0 20px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '10px', color: '#111827' }}>
        Đặt cược kiến thức
      </h1>
      <p style={{ color: '#4b5563', fontSize: '15px', marginBottom: '25px' }}>
        Thử thách kiến thức Lập trình Web cùng chiến thuật đặt cược điểm số đỉnh cao.
      </p>

      {bestRecord && (
        <div style={{ 
          margin: '0 auto 25px', 
          padding: '14px 20px', 
          background: '#ecfdf5', 
          border: '1px solid #a7f3d0', 
          borderRadius: '12px', 
          fontSize: '16px', 
          fontWeight: '600', 
          color: '#065f46',
          display: 'inline-block',
          boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
        }}>
          🏆 Kỷ lục cao nhất: {formatScore(bestRecord.finalScore)} – <span>{bestRecord.name}</span>
        </div>
      )}
      
      <div style={{ 
        background: '#ffffff', 
        padding: '28px', 
        borderRadius: '16px', 
        marginBottom: '30px', 
        textAlign: 'left', 
        border: '1px solid #e5e7eb',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
      }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#111827', borderBottom: '1px solid #f3f4f6', paddingBottom: '10px' }}>
          📖 Luật chơi:
        </h3>
        <ul style={{ lineHeight: '1.7', margin: 0, paddingLeft: '20px', color: '#4b5563', fontSize: '14px' }}>
          <li style={{ marginBottom: '8px' }}>Bắt đầu với <strong style={{ color: '#111827' }}>1.000 điểm</strong> qua 12 câu hỏi HTML, CSS, JavaScript và React.</li>
          <li style={{ marginBottom: '8px' }}>Trước mỗi câu, chọn mức cược từ <strong style={{ color: '#111827' }}>100 đến 500 điểm</strong> dựa trên chủ đề và độ khó.</li>
          <li style={{ marginBottom: '8px' }}>Có <strong style={{ color: '#111827' }}>25 giây</strong> suy nghĩ sau khi câu hỏi hiển thị.</li>
          <li style={{ marginBottom: '8px' }}>Trả lời đúng nhận thưởng theo hệ số (x1, x1.5, x2); sai hoặc hết giờ mất nguyên số điểm cược.</li>
          <li style={{ marginBottom: '8px' }}>Dưới 100 điểm sẽ <strong style={{ color: '#dc2626' }}>cháy túi</strong> và kết thúc ngay lập tức.</li>
          <li>Sử dụng 3 quyền trợ giúp đặc biệt: <strong style={{ color: '#0284c7' }}>Xem trước</strong>, <strong style={{ color: '#9333ea' }}>Bảo hiểm</strong>, và <strong style={{ color: '#d97706' }}>Gợi ý</strong>.</li>
        </ul>
      </div>

      <form onSubmit={handleStart} style={{ display: 'flex', justifyContent: 'center', gap: '12px', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Nhập tên người chơi..."
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          style={{ 
            padding: '12px 18px', 
            fontSize: '15px', 
            width: '280px', 
            borderRadius: '10px', 
            border: '1px solid #d1d5db', 
            background: '#ffffff', 
            color: '#111827',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#2e7d32'}
          onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
        />
        <button
          type="submit"
          disabled={!nameInput.trim()}
          style={{
            padding: '12px 24px',
            fontSize: '15px',
            backgroundColor: nameInput.trim() ? '#2e7d32' : '#9ca3af',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            cursor: nameInput.trim() ? 'pointer' : 'not-allowed',
            fontWeight: '600',
            boxShadow: nameInput.trim() ? '0 4px 12px rgba(46, 125, 50, 0.3)' : 'none',
            transition: 'all 0.2s'
          }}
        >
          Vào chơi
        </button>
      </form>
    </div>
  );
};