import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusEtapa, NivelPermissao } from '../types';
import { Plus, ListTodo } from 'lucide-react';

export const Etapas: React.FC = () => {
  const { aeronaves, funcionarios, adicionarEtapa, atualizarStatusEtapa, associarFuncionarioEtapa, usuarioLogado } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [selectedAeronave, setSelectedAeronave] = useState('');
  
  const podeEditar = usuarioLogado?.nivelPermissao !== NivelPermissao.OPERADOR;
  
  // Form state
  const [nome, setNome] = useState('');
  const [prazo, setPrazo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAeronave) return;

    const aeronave = aeronaves.find(a => a.codigo === selectedAeronave);
    if (!aeronave) return;

    const novaEtapa = {
      nome,
      prazo,
      status: StatusEtapa.PENDENTE,
      funcionariosIds: []
    };

    adicionarEtapa(selectedAeronave, novaEtapa);

    // Reset form
    setNome('');
    setPrazo('');
    setShowForm(false);
  };

  const handleAtualizarStatusEtapa = (aeronaveCodigo: string, etapaIndex: number, novoStatus: StatusEtapa) => {
    const aeronave = aeronaves.find(a => a.codigo === aeronaveCodigo);
    if (!aeronave) return;

    // Se estiver iniciando, verificar se a anterior foi concluída
    if (novoStatus === StatusEtapa.ANDAMENTO && etapaIndex > 0) {
      if (aeronave.etapas?.[etapaIndex - 1]?.status !== StatusEtapa.CONCLUIDA) {
        alert("A etapa anterior ainda não foi concluída.");
        return;
      }
    }

    const etapaId = aeronave.etapas?.[etapaIndex]?.id;
    if (etapaId) {
      atualizarStatusEtapa(aeronaveCodigo, etapaId, novoStatus);
    }
  };

  const associarFuncionario = (aeronaveCodigo: string, etapaIndex: number, funcionarioId: string) => {
    if (!funcionarioId) return;
    
    const aeronave = aeronaves.find(a => a.codigo === aeronaveCodigo);
    if (!aeronave) return;

    const etapaId = aeronave.etapas[etapaIndex]?.id;
    if (!etapaId) return;

    associarFuncionarioEtapa(aeronaveCodigo, etapaId, funcionarioId);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title">Etapas de Produção</h1>
          <p className="page-subtitle" style={{ marginBottom: 0 }}>Gerenciamento do fluxo de produção das aeronaves.</p>
        </div>
        
        {podeEditar && (
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            <Plus size={18} /> Adicionar Etapa
          </button>
        )}
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '2rem', borderLeft: '4px solid var(--status-success)' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Adicionar Etapa a uma Aeronave</h2>
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
              <label>Nome da Etapa</label>
              <input required type="text" className="input" value={nome} onChange={e => setNome(e.target.value)} />
            </div>
            
            <div className="input-group">
              <label>Prazo</label>
              <input required type="date" className="input" value={prazo} onChange={e => setPrazo(e.target.value)} />
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary" disabled={!selectedAeronave}>Salvar Etapa</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1">
        {aeronaves.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            <ListTodo size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
            <p>Cadastre uma aeronave primeiro para gerenciar suas etapas de produção.</p>
          </div>
        ) : (
          aeronaves.map(aeronave => (
            <div key={aeronave.codigo} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{aeronave.modelo} <span className="badge badge-neutral">{aeronave.codigo}</span></h3>
                <span className="badge badge-success">{aeronave.etapas?.length ?? 0} etapas</span>
              </div>
              
              {(aeronave.etapas?.length ?? 0) === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Nenhuma etapa registrada nesta aeronave.</p>
              ) : (
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Nome da Etapa</th>
                        <th>Prazo</th>
                        <th>Status</th>
                        <th>Funcionários</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {aeronave.etapas?.map((e, idx) => (
                        <tr key={idx}>
                          <td style={{ color: 'var(--text-secondary)' }}>{idx + 1}</td>
                          <td style={{ fontWeight: 500 }}>{e.nome}</td>
                          <td>{new Date(e.prazo).toLocaleDateString()}</td>
                          <td>
                            <span className={`badge ${
                              e.status === StatusEtapa.CONCLUIDA ? 'badge-success' : 
                              e.status === StatusEtapa.ANDAMENTO ? 'badge-warning' : 'badge-neutral'
                            }`}>
                              {e.status}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                              {e.funcionariosIds?.map(fid => {
                                const func = funcionarios.find(f => f.id === fid);
                                return func ? <span key={fid} style={{ fontSize: '0.8rem' }}>• {func.nome}</span> : null;
                              })}
                              
                              {podeEditar && (
                                <select 
                                  className="select" 
                                  style={{ padding: '0.2rem', fontSize: '0.75rem', marginTop: '0.25rem' }}
                                  value=""
                                  onChange={(evt) => associarFuncionario(aeronave.codigo, idx, evt.target.value)}
                                >
                                  <option value="">+ Associar...</option>
                                  {funcionarios.map(f => (
                                    <option key={f.id} value={f.id}>{f.nome}</option>
                                  ))}
                                </select>
                              )}
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              {!podeEditar && e.status !== StatusEtapa.CONCLUIDA && (
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Apenas visualização</span>
                              )}
                              {podeEditar && e.status === StatusEtapa.PENDENTE && (
                                <button className="btn btn-secondary" style={{ padding: '0.3rem 0.5rem', fontSize: '0.8rem' }} onClick={() => handleAtualizarStatusEtapa(aeronave.codigo, idx, StatusEtapa.ANDAMENTO)}>
                                  ▶ Iniciar
                                </button>
                              )}
                              {podeEditar && e.status === StatusEtapa.ANDAMENTO && (
                                <button className="btn btn-secondary" style={{ padding: '0.3rem 0.5rem', fontSize: '0.8rem', borderColor: 'var(--status-success)', color: 'var(--status-success)' }} onClick={() => handleAtualizarStatusEtapa(aeronave.codigo, idx, StatusEtapa.CONCLUIDA)}>
                                  ✔ Finalizar
                                </button>
                              )}
                            </div>
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
