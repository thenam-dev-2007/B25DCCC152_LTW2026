import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>404 - Không tìm thấy trang</h2>
      <p>Trang bạn đang truy cập không tồn tại.</p>
      <Link to="/" style={{ color: '#2e7d32', fontWeight: 'bold' }}>
        Về trang chủ
      </Link>
    </div>
  );
};