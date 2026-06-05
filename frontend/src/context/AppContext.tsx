import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { Aeronave, Funcionario, NivelPermissao, Peca, Etapa, Teste, StatusPeca, StatusEtapa } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

const normalizeAeronave = (a: any): Aeronave => ({
  codigo: a.codigo,
  modelo: a.modelo,
  tipo: a.tipo,
  capacidade: a.capacidade,
  alcance: a.alcance,
  pecas: a.pecas ?? [],
  etapas: (a.etapas ?? []).map((e: any) => ({ ...e, funcionariosIds: e.funcionariosIds ?? [] })),
  testes: a.testes ?? [],
});

interface AppContextType {
  aeronaves: Aeronave[];
  funcionarios: Funcionario[];
  usuarioLogado: Funcionario | null;
  login: (usuario: string, senha: string) => Promise<boolean>;
  logout: () => void;
  adicionarAeronave: (aeronave: Aeronave) => void;
  adicionarFuncionario: (funcionario: Funcionario & { senha?: string }) => void;
  adicionarPeca: (codigo: string, peca: Peca) => void;
  atualizarStatusPeca: (codigo: string, pecaId: string, status: StatusPeca) => void;
  adicionarEtapa: (codigo: string, etapa: Omit<Etapa, 'id'>) => void;
  atualizarStatusEtapa: (codigo: string, etapaId: string, status: StatusEtapa) => void;
  associarFuncionarioEtapa: (codigo: string, etapaId: string, funcionarioId: string) => void;
  adicionarTeste: (codigo: string, teste: Omit<Teste, 'id'>) => void;
  atualizarAeronave: (codigo: string, atualizacao: Partial<Aeronave>) => void;
  removerFuncionario: (id: string) => void;
  atualizarFuncionario: (id: string, atualizacao: Partial<Funcionario> & { senha?: string }) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [aeronaves, setAeronaves] = useState<Aeronave[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [usuarioLogado, setUsuarioLogado] = useState<Funcionario | null>(() => {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem('usuarioLogado');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    axios.get(`${API_URL}/aeronaves`)
      .then(res => setAeronaves(Array.isArray(res.data.data) ? res.data.data.map(normalizeAeronave) : []))
      .catch(err => console.error('Erro aeronaves:', err));
      
    axios.get(`${API_URL}/funcionarios`)
      .then(res => {
        if (res.data.data && res.data.data.length > 0) {
          setFuncionarios(res.data.data);
        }
      })
      .catch(err => console.error('Erro funcionarios:', err));
  }, []);

  useEffect(() => {
    if (usuarioLogado) {
      localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));
    } else {
      localStorage.removeItem('usuarioLogado');
    }
  }, [usuarioLogado]);

  const login = async (usuario: string, senha: string) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { usuario, senha });
      const func = response.data.data as Funcionario;
      setUsuarioLogado(func);
      return true;
    } catch (err) {
      console.error('Erro de login:', err);
      return false;
    }
  };

  const logout = () => {
    setUsuarioLogado(null);
  };

  const adicionarAeronave = async (aeronave: Aeronave) => {
    try {
      const response = await axios.post(`${API_URL}/aeronaves`, aeronave);
      if (response.data && response.data.data) {
        // Usa os dados que voltaram do banco para garantir que pegamos os valores oficiais
        setAeronaves(prev => [...prev, { ...aeronave, ...response.data.data }]);
      } else {
        setAeronaves(prev => [...prev, aeronave]);
      }
    } catch (err) {
      console.error("Erro ao salvar aeronave no banco:", err);
      // Fallback visual
      setAeronaves(prev => [...prev, aeronave]);
    }
  };

  const adicionarFuncionario = async (funcionario: Funcionario & { senha?: string }) => {
    const { senha, ...resto } = funcionario;
    try {
      const res = await axios.post(`${API_URL}/funcionarios`, { ...resto, senha });
      setFuncionarios(prev => [...prev, res.data.data]);
    } catch (err) {
      console.error('Erro ao criar funcionário:', err);
    }
  };

  const adicionarPeca = async (codigo: string, peca: Peca) => {
    try {
      const res = await axios.post(`${API_URL}/aeronaves/${codigo}/pecas`, peca);
      setAeronaves(prev => prev.map(a => a.codigo === codigo ? { ...a, pecas: [...a.pecas, res.data.data] } : a));
    } catch (err) {
      console.error('Erro ao adicionar peça:', err);
    }
  };

  const atualizarStatusPeca = async (codigo: string, pecaId: string, status: StatusPeca) => {
    try {
      const res = await axios.put(`${API_URL}/aeronaves/${codigo}/pecas/${pecaId}`, { status });
      setAeronaves(prev => prev.map(a => {
        if (a.codigo !== codigo) return a;
        return {
          ...a,
          pecas: a.pecas.map(p => p.id === pecaId ? { ...p, status: res.data.data.status } : p),
        };
      }));
    } catch (err) {
      console.error('Erro ao atualizar status da peça:', err);
    }
  };

  const adicionarEtapa = async (codigo: string, etapa: Omit<Etapa, 'id'>) => {
    try {
      const res = await axios.post(`${API_URL}/aeronaves/${codigo}/etapas`, etapa);
      setAeronaves(prev => prev.map(a => a.codigo === codigo ? { ...a, etapas: [...a.etapas, res.data.data] } : a));
    } catch (err) {
      console.error('Erro ao adicionar etapa:', err);
    }
  };

  const atualizarStatusEtapa = async (codigo: string, etapaId: string, status: StatusEtapa) => {
    try {
      const res = await axios.patch(`${API_URL}/aeronaves/${codigo}/etapas/${etapaId}`, { status });
      setAeronaves(prev => prev.map(a => {
        if (a.codigo !== codigo) return a;
        return {
          ...a,
          etapas: a.etapas.map(e => e.id === etapaId ? { ...e, status: res.data.data.status } : e),
        };
      }));
    } catch (err) {
      console.error('Erro ao atualizar status da etapa:', err);
    }
  };

  const associarFuncionarioEtapa = async (codigo: string, etapaId: string, funcionarioId: string) => {
    try {
      await axios.post(`${API_URL}/etapas/${etapaId}/funcionarios`, { funcionarioId });
      setAeronaves(prev => prev.map(a => {
        if (a.codigo !== codigo) return a;
        return {
          ...a,
          etapas: a.etapas.map(e => {
            if (e.id !== etapaId) return e;
            const atuais = e.funcionariosIds || [];
            return {
              ...e,
              funcionariosIds: atuais.includes(funcionarioId) ? atuais : [...atuais, funcionarioId]
            };
          }),
        };
      }));
    } catch (err) {
      console.error('Erro ao associar funcionário à etapa:', err);
    }
  };

  const adicionarTeste = async (codigo: string, teste: Omit<Teste, 'id'>) => {
    try {
      const res = await axios.post(`${API_URL}/aeronaves/${codigo}/testes`, teste);
      setAeronaves(prev => prev.map(a => a.codigo === codigo ? { ...a, testes: [...a.testes, res.data.data] } : a));
    } catch (err) {
      console.error('Erro ao adicionar teste:', err);
    }
  };

  const atualizarAeronave = async (codigo: string, atualizacao: Partial<Aeronave>) => {
    // 1. Atualiza estado local primeiro para resposta rápida (Optimistic UI)
    const newAeronaves = aeronaves.map(a => a.codigo === codigo ? { ...a, ...atualizacao } : a);
    setAeronaves(newAeronaves);
    
    // 2. Manda pro banco (que cuidará de Peças, Etapas e Testes via PUT)
    const aeronaveAtualizada = newAeronaves.find(a => a.codigo === codigo);
    if(aeronaveAtualizada) {
      try {
        await axios.put(`${API_URL}/aeronaves/${codigo}`, aeronaveAtualizada);
      } catch(err) {
        console.error("Erro ao sincronizar peças/etapas no MySQL", err);
      }
    }
  };

  const removerFuncionario = async (id: string) => {
    setFuncionarios(prev => prev.filter(f => f.id !== id));
    try {
      await axios.delete(`${API_URL}/funcionarios/${id}`);
    } catch(err) {
      console.error("Erro delete", err);
    }
  };

  const atualizarFuncionario = async (id: string, atualizacao: Partial<Funcionario> & { senha?: string }) => {
    const { senha, ...resto } = atualizacao;
    const payload = senha ? { ...resto, senha } : resto;
    setFuncionarios(prev => prev.map(f => f.id === id ? { ...f, ...resto } : f));
    try {
      await axios.put(`${API_URL}/funcionarios/${id}`, payload);
    } catch(err) {
      console.error('Erro update', err);
    }
  };

  return (
    <AppContext.Provider value={{
      aeronaves,
      funcionarios,
      usuarioLogado,
      login,
      logout,
      adicionarAeronave,
      adicionarFuncionario,
      adicionarPeca,
      atualizarStatusPeca,
      adicionarEtapa,
      atualizarStatusEtapa,
      associarFuncionarioEtapa,
      adicionarTeste,
      atualizarAeronave,
      removerFuncionario,
      atualizarFuncionario
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
