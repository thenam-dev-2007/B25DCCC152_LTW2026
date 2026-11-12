import React from 'react';

export const Footer = () => {
  return (
    <footer style={{
      marginTop: '60px',
      padding: '20px 0',
      textAlign: 'center',
      borderTop: '1px solid #e5e7eb',
      color: '#6b7280',
      fontSize: '14px',
      backgroundColor: '#ffffff'
    }}>
      <p style={{ margin: '0 0 5px 0', fontWeight: '500', color: '#374151' }}>
        Trò chơi “Đặt cược kiến thức – phiên bản Lập trình Web”
      </p>
      <p style={{ margin: 0 }}>
        Phát triển với React &amp; React Router · Chúc bạn ôn tập hiệu quả!
      </p>
    </footer>
  );
};