import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TipoPeca, StatusPeca, NivelPermissao } from '../types';
import { Plus, Wrench } from 'lucide-react';

export const Pecas: React.FC = () => {
  const { aeronaves, adicionarPeca, atualizarStatusPeca, usuarioLogado } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [selectedAeronave, setSelectedAeronave] = useState('');
  
  const podeEditar = usuarioLogado?.nivelPermissao !== NivelPermissao.OPERADOR;
  
  // Form state
  const [nome, setNome] = useState('');
  const [fornecedor, setFornecedor] = useState('');
  const [tipo, setTipo] = useState<TipoPeca>(TipoPeca.NACIONAL);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAeronave) return;

    const aeronave = aeronaves.find(a => a.codigo === selectedAeronave);
    if (!aeronave) return;

    const novaPeca = {
      nome,
      fornecedor,
      tipo,
      status: StatusPeca.EM_PRODUCAO
    };

    adicionarPeca(selectedAeronave, novaPeca);

    // Reset form
    setNome('');
    setFornecedor('');
    setTipo(TipoPeca.NACIONAL);
    setShowForm(false);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title">Peças</h1>
          <p className="page-subtitle" style={{ marginBottom: 0 }}>Gerenciamento de inventário e peças de aeronaves.</p>
        </div>
        
        {podeEditar && (
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            <Plus size={18} /> Adicionar Peça
          </button>
        )}
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '2rem', borderLeft: '4px solid var(--status-info)' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Adicionar Peça a uma Aeronave</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2">
            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <label>Selecione a Aeronave</label>
              <select required className="select" value={selectedAeronave} onChange={e => setSelectedAeronave(e.target.value)}>
                <option value="">Selecione...</option>
                {aeronaves.map(a => (
                  <option key={a.codigo} value={a.codigo}>{a.modelo} ({a.codigo})</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>Nome da Peça</label>
              <input required type="text" className="input" value={nome} onChange={e => setNome(e.target.value)} />
            </div>
            
            <div className="input-group">
              <label>Fornecedor</label>
              <input required type="text" className="input" value={fornecedor} onChange={e => setFornecedor(e.target.value)} />
            </div>

            <div className="input-group">
              <label>Tipo</label>
              <select className="select" value={tipo} onChange={e => setTipo(e.target.value as TipoPeca)}>
                <option value={TipoPeca.NACIONAL}>Nacional</option>
                <option value={TipoPeca.IMPORTADA}>Importada</option>
              </select>
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary" disabled={!selectedAeronave}>Salvar Peça</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1">
        {aeronaves.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            <Wrench size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
            <p>Cadastre uma aeronave primeiro para gerenciar suas peças.</p>
          </div>
        ) : (
          aeronaves.map(aeronave => (
            <div key={aeronave.codigo} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{aeronave.modelo} <span className="badge badge-neutral">{aeronave.codigo}</span></h3>
                <span className="badge badge-info">{aeronave.pecas.length} peças</span>
              </div>
              
              {aeronave.pecas.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Nenhuma peça registrada nesta aeronave.</p>
              ) : (
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>Tipo</th>
                        <th>Fornecedor</th>
                        <th>Status</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {aeronave.pecas.map((p, idx) => (
                        <tr key={idx}>
                          <td style={{ fontWeight: 500 }}>{p.nome}</td>
                          <td>{p.tipo}</td>
                          <td>{p.fornecedor}</td>
                          <td>
                            <span className={`badge ${
                              p.status === StatusPeca.PRONTA ? 'badge-success' : 
                              p.status === StatusPeca.EM_TRANSPORTE ? 'badge-warning' : 'badge-neutral'
                            }`}>
                              {p.status}
                            </span>
                          </td>
                          <td>
                            {podeEditar ? (
                              <select 
                                className="select" 
                                style={{ padding: '0.3rem 0.5rem', fontSize: '0.85rem' }}
                                value={p.status}
                                onChange={(e) => p.id && atualizarStatusPeca(aeronave.codigo, p.id, e.target.value as StatusPeca)}
                              >
                                <option value={StatusPeca.EM_PRODUCAO}>Em Produção</option>
                                <option value={StatusPeca.EM_TRANSPORTE}>Em Transporte</option>
                                <option value={StatusPeca.PRONTA}>Pronta</option>
                              </select>
                            ) : (
                              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Apenas visualização</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
