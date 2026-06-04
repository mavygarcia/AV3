import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TipoTeste, ResultadoTeste, NivelPermissao } from '../types';
import { Plus, ShieldCheck } from 'lucide-react';

export const Testes: React.FC = () => {
  const { aeronaves, adicionarTeste, usuarioLogado } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [selectedAeronave, setSelectedAeronave] = useState('');
  
  const podeEditar = usuarioLogado?.nivelPermissao !== NivelPermissao.OPERADOR;
  
  // Form state
  const [tipo, setTipo] = useState<TipoTeste>(TipoTeste.ELETRICO);
  const [resultado, setResultado] = useState<ResultadoTeste>(ResultadoTeste.APROVADO);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAeronave) return;

    const aeronave = aeronaves.find(a => a.codigo === selectedAeronave);
    if (!aeronave) return;

    const novoTeste = {
      tipo,
      resultado
    };

    adicionarTeste(selectedAeronave, novoTeste);

    // Reset form
    setTipo(TipoTeste.ELETRICO);
    setResultado(ResultadoTeste.APROVADO);
    setShowForm(false);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title">Testes e Qualidade</h1>
          <p className="page-subtitle" style={{ marginBottom: 0 }}>Registro de inspeções e testes realizados nas aeronaves.</p>
        </div>
        
        {podeEditar && (
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            <Plus size={18} /> Registrar Teste
          </button>
        )}
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '2rem', borderLeft: '4px solid var(--accent-lilac)' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Registrar Novo Teste</h2>
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
              <label>Tipo de Teste</label>
              <select className="select" value={tipo} onChange={e => setTipo(e.target.value as TipoTeste)}>
                <option value={TipoTeste.ELETRICO}>Elétrico</option>
                <option value={TipoTeste.HIDRAULICO}>Hidráulico</option>
                <option value={TipoTeste.AERODINAMICO}>Aerodinâmico</option>
              </select>
            </div>
            
            <div className="input-group">
              <label>Resultado do Teste</label>
              <select className="select" value={resultado} onChange={e => setResultado(e.target.value as ResultadoTeste)}>
                <option value={ResultadoTeste.APROVADO}>Aprovado</option>
                <option value={ResultadoTeste.REPROVADO}>Reprovado</option>
              </select>
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary" disabled={!selectedAeronave}>Salvar Teste</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1">
        {aeronaves.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            <ShieldCheck size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
            <p>Cadastre uma aeronave primeiro para gerenciar testes de qualidade.</p>
          </div>
        ) : (
          aeronaves.map(aeronave => (
            <div key={aeronave.codigo} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{aeronave.modelo} <span className="badge badge-neutral">{aeronave.codigo}</span></h3>
                <span className="badge badge-neutral">{aeronave.testes.length} testes</span>
              </div>
              
              {aeronave.testes.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Nenhum teste registrado nesta aeronave.</p>
              ) : (
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Tipo de Teste</th>
                        <th>Resultado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {aeronave.testes.map((t, idx) => (
                        <tr key={idx}>
                          <td style={{ fontWeight: 500 }}>{t.tipo}</td>
                          <td>
                            <span className={`badge ${
                              t.resultado === ResultadoTeste.APROVADO ? 'badge-success' : 'badge-error'
                            }`}>
                              {t.resultado === ResultadoTeste.APROVADO ? '✔ Aprovado' : '✘ Reprovado'}
                            </span>
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
