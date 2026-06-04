import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Lock, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Login: React.FC = () => {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const { login } = useApp();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    
    const success = await login(usuario, senha);
    if (success) {
      navigate('/aeronaves');
    } else {
      setErro('Usuário ou senha inválidos.');
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      width: '100%',
      padding: '1rem',
      background: 'var(--bg-dark)',
      boxSizing: 'border-box'
    }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '480px', padding: '2.5rem', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            background: 'var(--bg-hover)', 
            width: '56px', 
            height: '56px', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 1rem',
            color: 'var(--accent-pink)'
          }}>
            <Plane size={28} />
          </div>
          <h1 className="page-title" style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Aerocode</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0' }}>Gestão de Produção de Aeronaves</p>
        </div>

        {erro && (
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.1)', 
            color: 'var(--status-error)', 
            padding: '0.75rem', 
            borderRadius: '8px', 
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            textAlign: 'center',
            border: '1px solid var(--status-error)'
          }}>
            {erro}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Usuário</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="text" 
                className="input" 
                style={{ width: '100%', paddingLeft: '2.5rem' }} 
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group" style={{ marginBottom: '1.5rem' }}>
            <label>Senha</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="password" 
                className="input" 
                style={{ width: '100%', paddingLeft: '2.5rem' }}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
            Entrar no Sistema
          </button>
        </form>
        
        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <p>Para testar as permissões, use os perfis padrão:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.5rem' }}>
            <p>Admin: <strong>admin</strong> | Senha: <strong>admin123</strong></p>
            <p>Engenheiro: <strong>engenheiro</strong> | Senha: <strong>eng123</strong></p>
            <p>Operador: <strong>operador</strong> | Senha: <strong>op123</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
};
