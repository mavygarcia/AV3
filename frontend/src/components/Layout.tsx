import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useApp } from '../context/AppContext';

export const Layout: React.FC = () => {
  const { usuarioLogado } = useApp();

  if (!usuarioLogado) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};
