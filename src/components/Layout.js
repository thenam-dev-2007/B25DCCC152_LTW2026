import React from 'react';
import { Outlet } from 'react-router-dom';
import { NavBar } from './NavBar';
import { Footer } from './Footer';

export const Layout = () => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh', 
      fontFamily: 'Plus Jakarta Sans, Arial, sans-serif' 
    }}>
      <NavBar />
      <main style={{ flex: 1, maxWidth: '900px', width: '100%', margin: '0 auto', padding: '0 15px' }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};