import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NivelPermissao } from '../types';
import { Plus, Users, Pencil, Trash2, X } from 'lucide-react';

export const Funcionarios: React.FC = () => {
  const { funcionarios, adicionarFuncionario, removerFuncionario, atualizarFuncionario, usuarioLogado } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  // Form state
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [nivel, setNivel] = useState<NivelPermissao>(NivelPermissao.OPERADOR);
  const [erro, setErro] = useState('');

  const ehAdmin = usuarioLogado?.nivelPermissao === NivelPermissao.ADMINISTRADOR;

  const resetForm = () => {
    setNome('');
    setTelefone('');
    setEndereco('');
    setUsuario('');
    setSenha('');
    setNivel(NivelPermissao.OPERADOR);
    setEditingId(null);
    setShowForm(false);
    setErro('');
  };

  const handleEdit = (f: any) => {
    setNome(f.nome);
    setTelefone(f.telefone);
    setEndereco(f.endereco);
    setUsuario(f.usuario);
    setSenha(''); // Require new password or keep old if empty
    setNivel(f.nivelPermissao);
    setEditingId(f.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    removerFuncionario(id);
    setDeleteConfirmId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (editingId) {
      if (funcionarios.some(f => f.usuario === usuario && f.id !== editingId)) {
        setErro('Nome de usuário já existe.');
        return;
      }

      atualizarFuncionario(editingId, {
        nome,
        telefone,
        endereco,
        usuario,
        senha: senha ? senha : undefined,
        nivelPermissao: nivel
      });
    } else {
      if (funcionarios.some(f => f.usuario === usuario)) {
        setErro('Nome de usuário já existe.');
        return;
      }

      if (!senha) {
        setErro('A senha é obrigatória para novos funcionários.');
        return;
      }

      adicionarFuncionario({
        id: `F${Date.now()}`,
        nome,
        telefone,
        endereco,
        usuario,
        senha,
        nivelPermissao: nivel
      } as any);
    }

    resetForm();
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title">Funcionários</h1>
          <p className="page-subtitle" style={{ marginBottom: 0 }}>Gestão da equipe e controle de acesso.</p>
        </div>
        
        {ehAdmin && !showForm && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <Plus size={18} /> Novo Funcionário
          </button>
        )}
      </div>

      {erro && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--status-error)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--status-error)' }}>
          {erro}
        </div>
      )}

      {showForm && ehAdmin && (
        <div className="card" style={{ marginBottom: '2rem', borderLeft: '4px solid var(--accent-pink)' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>
            {editingId ? 'Editar Funcionário' : 'Cadastrar Novo Funcionário'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2">
            <div className="input-group">
              <label>Nome Completo</label>
              <input required type="text" className="input" value={nome} onChange={e => setNome(e.target.value)} />
            </div>
            
            <div className="input-group">
              <label>Telefone</label>
              <input required type="text" className="input" value={telefone} onChange={e => setTelefone(e.target.value)} />
            </div>

            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <label>Endereço</label>
              <input required type="text" className="input" value={endereco} onChange={e => setEndereco(e.target.value)} />
            </div>

            <div className="input-group">
              <label>Usuário de Login</label>
              <input required type="text" className="input" value={usuario} onChange={e => setUsuario(e.target.value)} />
            </div>

            <div className="input-group">
              <label>Senha {editingId && <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>(deixe em branco para não alterar)</span>}</label>
              <input type="password" className="input" value={senha} onChange={e => setSenha(e.target.value)} required={!editingId} />
            </div>

            <div className="input-group">
              <label>Nível de Permissão</label>
              <select className="select" value={nivel} onChange={e => setNivel(e.target.value as NivelPermissao)}>
                <option value={NivelPermissao.OPERADOR}>Operador</option>
                <option value={NivelPermissao.ENGENHEIRO}>Engenheiro</option>
                <option value={NivelPermissao.ADMINISTRADOR}>Administrador</option>
              </select>
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary">{editingId ? 'Atualizar Funcionário' : 'Salvar Funcionário'}</button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container" style={{ border: 'none' }}>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Usuário</th>
                <th>Nível</th>
                <th>Telefone</th>
                {ehAdmin && <th>Ações</th>}
              </tr>
            </thead>
            <tbody>
              {funcionarios.map(f => (
                <tr key={f.id}>
                  <td><span className="badge badge-neutral">{f.id}</span></td>
                  <td style={{ fontWeight: 500 }}>{f.nome}</td>
                  <td>{f.usuario}</td>
                  <td>
                    <span className={`badge ${f.nivelPermissao === NivelPermissao.ADMINISTRADOR ? 'badge-error' : f.nivelPermissao === NivelPermissao.ENGENHEIRO ? 'badge-info' : 'badge-neutral'}`}>
                      {f.nivelPermissao}
                    </span>
                  </td>
                  <td>{f.telefone}</td>
                  {ehAdmin && (
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-secondary" style={{ padding: '0.5rem' }} onClick={() => handleEdit(f)} title="Editar">
                          <Pencil size={16} />
                        </button>
                        <button className="btn btn-secondary" style={{ padding: '0.5rem', color: 'var(--status-error)', borderColor: 'var(--status-error)' }} onClick={() => setDeleteConfirmId(f.id)} title="Excluir">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="card" style={{ maxWidth: '400px', width: '90%', margin: '0 auto', position: 'relative' }}>
            <button 
              onClick={() => setDeleteConfirmId(null)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
            >
              <X size={20} />
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', color: 'var(--status-error)' }}>
              <Trash2 size={24} />
              <h2 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--text-primary)' }}>Confirmar Exclusão</h2>
            </div>
            
            <p style={{ marginBottom: '2rem' }}>
              Tem certeza que deseja excluir este funcionário? Esta ação não pode ser desfeita.
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setDeleteConfirmId(null)}>
                Cancelar
              </button>
              <button 
                className="btn btn-primary" 
                style={{ backgroundColor: 'var(--status-error)', borderColor: 'var(--status-error)' }}
                onClick={() => handleDelete(deleteConfirmId)}
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
