import React from 'react';
import { NavLink } from 'react-router-dom';

export const NavBar = () => {
  const getStyle = ({ isActive }) => ({
    padding: '10px 20px',
    textDecoration: 'none',
    color: isActive ? '#ffffff' : '#4b5563',
    backgroundColor: isActive ? '#2e7d32' : '#e5e7eb',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.2s ease',
  });

  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      gap: '12px', 
      marginBottom: '30px', 
      padding: '16px', 
      background: '#ffffff', 
      borderBottom: '1px solid #e5e7eb',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
    }}>
      <NavLink to="/" style={getStyle} end>
        Trang chủ
      </NavLink>
      <NavLink to="/questions" style={getStyle}>
        Ngân hàng câu hỏi
      </NavLink>
      <NavLink to="/history" style={getStyle}>
        Lịch sử
      </NavLink>
    </nav>
  );
};