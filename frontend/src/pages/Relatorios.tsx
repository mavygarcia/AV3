import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FileText, Printer, Download } from 'lucide-react';
import { Aeronave } from '../types';

export const Relatorios: React.FC = () => {
  const { aeronaves, funcionarios } = useApp();
  const [selectedAeronave, setSelectedAeronave] = useState('');
  const [cliente, setCliente] = useState('');
  const [dataEntrega, setDataEntrega] = useState('');
  const [relatorioGerado, setRelatorioGerado] = useState<{ aeronave: Aeronave, cliente: string, data: string } | null>(null);

  const handleGerarRelatorio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAeronave || !cliente || !dataEntrega) return;

    const aeronave = aeronaves.find(a => a.codigo === selectedAeronave);
    if (!aeronave) return;

    setRelatorioGerado({
      aeronave,
      cliente,
      data: dataEntrega
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadTxt = () => {
    if (!relatorioGerado) return;
    
    const { aeronave, cliente, data } = relatorioGerado;
    
    let txt = `=================================================\n`;
    txt += `          AEROCODE - RELATORIO OFICIAL\n`;
    txt += `=================================================\n\n`;
    txt += `CLIENTE: ${cliente}\n`;
    txt += `DATA DE ENTREGA: ${new Date(data).toLocaleDateString()}\n\n`;
    
    txt += `--- DADOS DA AERONAVE ---\n`;
    txt += `CODIGO: ${aeronave.codigo}\n`;
    txt += `MODELO: ${aeronave.modelo}\n`;
    txt += `TIPO: ${aeronave.tipo}\n`;
    txt += `CAPACIDADE: ${aeronave.capacidade} passageiros/carga\n`;
    txt += `ALCANCE: ${aeronave.alcance} km\n\n`;
    
    txt += `--- PECAS UTILIZADAS ---\n`;
    if (aeronave.pecas.length === 0) txt += `Nenhuma peca registrada.\n`;
    aeronave.pecas.forEach(p => {
      txt += `- ${p.nome} | Tipo: ${p.tipo} | Fornec: ${p.fornecedor} | Status: ${p.status}\n`;
    });
    txt += `\n`;

    txt += `--- ETAPAS DE PRODUCAO ---\n`;
    if (aeronave.etapas.length === 0) txt += `Nenhuma etapa registrada.\n`;
    aeronave.etapas.forEach(e => {
      txt += `- ${e.nome} | Prazo: ${new Date(e.prazo).toLocaleDateString()} | Status: ${e.status}\n`;
      const funcNomes = e.funcionariosIds.map(id => funcionarios.find(f => f.id === id)?.nome).join(', ');
      txt += `  Responsaveis: ${funcNomes || 'Nenhum'}\n`;
    });
    txt += `\n`;

    txt += `--- TESTES DE QUALIDADE ---\n`;
    if (aeronave.testes.length === 0) txt += `Nenhum teste registrado.\n`;
    aeronave.testes.forEach(t => {
      txt += `- Teste ${t.tipo}: ${t.resultado}\n`;
    });
    txt += `\n`;
    
    txt += `=================================================\n`;
    txt += `Assinatura Eng. Chefe: __________________________\n`;
    txt += `Assinatura Cliente: _____________________________\n`;
    txt += `=================================================\n`;

    // Criar download via Blob ASCII
    const blob = new Blob([txt], { type: 'text/plain;charset=us-ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Relatorio_${aeronave.codigo}_${cliente.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }} className="no-print">
        <div>
          <h1 className="page-title">Relatório de Entrega</h1>
          <p className="page-subtitle" style={{ marginBottom: 0 }}>Geração de documento oficial de entrega da aeronave.</p>
        </div>
      </div>

      <div className="card no-print" style={{ marginBottom: '2rem' }}>
        <form onSubmit={handleGerarRelatorio} className="grid grid-cols-2">
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
            <label>Nome do Cliente</label>
            <input required type="text" className="input" value={cliente} onChange={e => setCliente(e.target.value)} />
          </div>
          
          <div className="input-group">
            <label>Data de Entrega</label>
            <input required type="date" className="input" value={dataEntrega} onChange={e => setDataEntrega(e.target.value)} />
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary" disabled={!selectedAeronave}>
              <FileText size={18} /> Gerar Relatório
            </button>
          </div>
        </form>
      </div>

      {relatorioGerado && (
        <div className="card animate-fade-in" style={{ background: '#fff', color: '#000' }}>
          <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem', gap: '1rem' }}>
            <button className="btn btn-secondary" style={{ color: '#333', borderColor: '#ccc' }} onClick={handleDownloadTxt}>
              <Download size={18} /> Baixar TXT (ASCII)
            </button>
            <button className="btn btn-secondary" style={{ color: '#333', borderColor: '#ccc' }} onClick={handlePrint}>
              <Printer size={18} /> Imprimir PDF
            </button>
          </div>
          
          <div id="relatorio-print" style={{ padding: '2rem', fontFamily: 'serif', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem', borderBottom: '2px solid #000', paddingBottom: '1rem' }}>
              <h1 style={{ fontSize: '24px', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '2px' }}>Aerocode</h1>
              <h2 style={{ fontSize: '18px', margin: 0, fontWeight: 'normal' }}>Relatório Oficial de Entrega de Aeronave</h2>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <p><strong>Cliente:</strong> {relatorioGerado.cliente}</p>
              <p><strong>Data de Entrega:</strong> {new Date(relatorioGerado.data).toLocaleDateString()}</p>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>Dados da Aeronave</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li><strong>Código:</strong> {relatorioGerado.aeronave.codigo}</li>
                <li><strong>Modelo:</strong> {relatorioGerado.aeronave.modelo}</li>
                <li><strong>Tipo:</strong> {relatorioGerado.aeronave.tipo}</li>
                <li><strong>Capacidade:</strong> {relatorioGerado.aeronave.capacidade}</li>
                <li><strong>Alcance:</strong> {relatorioGerado.aeronave.alcance} km</li>
              </ul>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>Peças Utilizadas</h3>
              {relatorioGerado.aeronave.pecas.length === 0 ? (
                <p>Nenhuma peça detalhada registrada.</p>
              ) : (
                <ul style={{ paddingLeft: '20px' }}>
                  {relatorioGerado.aeronave.pecas.map((p, idx) => (
                    <li key={idx}>{p.nome} - Tipo: {p.tipo} - Fornecedor: {p.fornecedor} - Status: {p.status}</li>
                  ))}
                </ul>
              )}
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>Etapas de Produção</h3>
              {relatorioGerado.aeronave.etapas.length === 0 ? (
                <p>Nenhuma etapa detalhada registrada.</p>
              ) : (
                <ul style={{ paddingLeft: '20px' }}>
                  {relatorioGerado.aeronave.etapas.map((e, idx) => (
                    <li key={idx} style={{ marginBottom: '10px' }}>
                      <strong>{e.nome}</strong> (Status: {e.status}) - Prazo: {new Date(e.prazo).toLocaleDateString()}
                      <br />
                      <span style={{ fontSize: '0.9em', color: '#555' }}>
                        Responsáveis: {e.funcionariosIds.map(id => funcionarios.find(f => f.id === id)?.nome).join(', ') || 'Nenhum'}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>Testes de Qualidade</h3>
              {relatorioGerado.aeronave.testes.length === 0 ? (
                <p>Nenhum teste detalhado registrado.</p>
              ) : (
                <ul style={{ paddingLeft: '20px' }}>
                  {relatorioGerado.aeronave.testes.map((t, idx) => (
                    <li key={idx}>Teste {t.tipo}: <strong>{t.resultado}</strong></li>
                  ))}
                </ul>
              )}
            </div>

            <div style={{ marginTop: '5rem', display: 'flex', justifyContent: 'space-between', textAlign: 'center' }}>
              <div style={{ width: '45%' }}>
                <div style={{ borderTop: '1px solid #000', paddingTop: '10px' }}>Assinatura Aerocode (Engenheiro Chefe)</div>
              </div>
              <div style={{ width: '45%' }}>
                <div style={{ borderTop: '1px solid #000', paddingTop: '10px' }}>Assinatura Cliente ({relatorioGerado.cliente})</div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Styles for printing */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #relatorio-print, #relatorio-print * {
            visibility: visible;
          }
          #relatorio-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
          .app-container {
            display: block;
          }
          .main-content {
            padding: 0;
          }
        }
      `}</style>
    </div>
  );
};
