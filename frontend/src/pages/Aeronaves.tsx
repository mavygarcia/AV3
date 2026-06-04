import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TipoAeronave, NivelPermissao } from '../types';
import { Plus, Plane } from 'lucide-react';

export const Aeronaves: React.FC = () => {
  const { aeronaves, adicionarAeronave, usuarioLogado } = useApp();
  const [showForm, setShowForm] = useState(false);
  
  // Form state
  const [codigo, setCodigo] = useState('');
  const [modelo, setModelo] = useState('');
  const [tipo, setTipo] = useState<TipoAeronave>(TipoAeronave.COMERCIAL);
  const [capacidade, setCapacidade] = useState('');
  const [alcance, setAlcance] = useState('');
  const [erro, setErro] = useState('');

  const temPermissao = usuarioLogado?.nivelPermissao === NivelPermissao.ADMINISTRADOR || 
                       usuarioLogado?.nivelPermissao === NivelPermissao.ENGENHEIRO;
//capyvara
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (aeronaves.some(a => a.codigo === codigo)) {
      setErro('Código de aeronave já cadastrado.');
      return;
    }

    adicionarAeronave({
      codigo,
      modelo,
      tipo,
      capacidade: Number(capacidade),
      alcance: Number(alcance),
      pecas: [],
      etapas: [],
      testes: []
    });

    // Reset form
    setCodigo('');
    setModelo('');
    setTipo(TipoAeronave.COMERCIAL);
    setCapacidade('');
    setAlcance('');
    setShowForm(false);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title">Aeronaves</h1>
          <p className="page-subtitle" style={{ marginBottom: 0 }}>Gestão e cadastro de aeronaves no sistema.</p>
        </div>
        
        {temPermissao && (
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            <Plus size={18} /> Nova Aeronave
          </button>
        )}
      </div>

      {erro && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--status-error)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--status-error)' }}>
          {erro}
        </div>
      )}

      {showForm && temPermissao && (
        <div className="card" style={{ marginBottom: '2rem', borderLeft: '4px solid var(--accent-lilac)' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Cadastrar Nova Aeronave</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2">
            <div className="input-group">
              <label>Código Único</label>
              <input required type="text" className="input" value={codigo} onChange={e => setCodigo(e.target.value)} placeholder="Ex: A320-001" />
            </div>
            
            <div className="input-group">
              <label>Modelo</label>
              <input required type="text" className="input" value={modelo} onChange={e => setModelo(e.target.value)} placeholder="Ex: Airbus A320" />
            </div>

            <div className="input-group">
              <label>Tipo</label>
              <select className="select" value={tipo} onChange={e => setTipo(e.target.value as TipoAeronave)}>
                <option value={TipoAeronave.COMERCIAL}>Comercial</option>
                <option value={TipoAeronave.MILITAR}>Militar</option>
              </select>
            </div>

            <div className="input-group">
              <label>Capacidade (Passageiros/Kg)</label>
              <input required type="number" className="input" value={capacidade} onChange={e => setCapacidade(e.target.value)} min="1" />
            </div>

            <div className="input-group">
              <label>Alcance (km)</label>
              <input required type="number" className="input" value={alcance} onChange={e => setAlcance(e.target.value)} min="1" />
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary">Salvar Aeronave</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {aeronaves.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <Plane size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
            <p>Nenhuma aeronave cadastrada ainda.</p>
          </div>
        ) : (
          <div className="table-container" style={{ border: 'none' }}>
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Modelo</th>
                  <th>Tipo</th>
                  <th>Capacidade</th>
                  <th>Alcance</th>
                  <th>Status (Etapas)</th>
                </tr>
              </thead>
              <tbody>
                {aeronaves.map(a => {
                  const concluida = a.etapas.length > 0 && a.etapas.every(e => e.status === 'CONCLUIDA');
                  const andamento = a.etapas.some(e => e.status === 'ANDAMENTO');
                  
                  return (
                    <tr key={a.codigo}>
                      <td><span className="badge badge-neutral">{a.codigo}</span></td>
                      <td style={{ fontWeight: 500 }}>{a.modelo}</td>
                      <td>
                        <span className={a.tipo === TipoAeronave.COMERCIAL ? 'badge badge-info' : 'badge badge-warning'}>
                          {a.tipo}
                        </span>
                      </td>
                      <td>{a.capacidade}</td>
                      <td>{a.alcance} km</td>
                      <td>
                        {a.etapas.length === 0 ? (
                          <span className="badge badge-neutral">Sem Etapas</span>
                        ) : concluida ? (
                          <span className="badge badge-success">Concluída</span>
                        ) : andamento ? (
                          <span className="badge badge-warning">Em Produção</span>
                        ) : (
                          <span className="badge badge-neutral">Planejada</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
