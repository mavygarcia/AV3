import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Plane, Users, Wrench, ListTodo, ShieldCheck, FileText, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Sidebar: React.FC = () => {
  const { usuarioLogado, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!usuarioLogado) return null;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Plane size={28} className="sidebar-logo" />
          <h2 className="sidebar-title">Aerocode</h2>
        </div>
        <button className="btn btn-secondary mobile-logout" onClick={handleLogout} style={{ padding: '0.4rem', border: 'none' }} title="Sair">
          <LogOut size={20} />
        </button>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/aeronaves" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Plane size={20} />
          <span>Aeronaves</span>
        </NavLink>
        
        <NavLink to="/funcionarios" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Users size={20} />
          <span>Funcionários</span>
        </NavLink>
        
        <NavLink to="/pecas" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Wrench size={20} />
          <span>Peças</span>
        </NavLink>
        
        <NavLink to="/etapas" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <ListTodo size={20} />
          <span>Etapas</span>
        </NavLink>
        
        <NavLink to="/testes" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <ShieldCheck size={20} />
          <span>Testes</span>
        </NavLink>

        <NavLink to="/relatorios" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <FileText size={20} />
          <span>Relatórios</span>
        </NavLink>
      </nav>
      
      <div className="sidebar-footer">
        <div style={{ marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <div>Logado como:</div>
          <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{usuarioLogado.nome}</div>
          <div style={{ fontSize: '0.75rem' }}>{usuarioLogado.nivelPermissao}</div>
        </div>
        <button className="btn btn-secondary" style={{ width: '100%' }} onClick={handleLogout}>
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </aside>
  );
};
