import express, { Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());

function sendJson(res: Response, data: any, startProcessing: number, statusCode = 200) {
  return res.status(statusCode).json({
    data,
    metrics: {
      processingTime: Number((performance.now() - startProcessing).toFixed(2)),
    },
  });
}

// Aeronaves
app.get('/aeronaves', async (req, res) => {
  // Simulate network latency of 50ms before processing to approximate a realistic production scenario.
  // This delay is intentionally not counted in the server processing time, so it appears as latency.
  await new Promise(resolve => setTimeout(resolve, 50));

  const startProcessing = performance.now();
  const aeronaves = await prisma.aeronave.findMany({
    include: { pecas: true, etapas: true, testes: true },
  });

  return sendJson(res, aeronaves, startProcessing);
});

app.get('/aeronaves/:codigo', async (req, res) => {
  const startProcessing = performance.now();
  const aeronave = await prisma.aeronave.findUnique({
    where: { codigo: req.params.codigo },
    include: { pecas: true, etapas: true, testes: true },
  });

  if (!aeronave) {
    return res.status(404).json({ error: 'Aeronave não encontrada.' });
  }

  return sendJson(res, aeronave, startProcessing);
});

app.post('/aeronaves', async (req, res) => {
  const { codigo, modelo, tipo, capacidade, alcance } = req.body;
  const startProcessing = performance.now();
  const aeronave = await prisma.aeronave.create({
    data: { codigo, modelo, tipo, capacidade, alcance },
  });

  return sendJson(res, aeronave, startProcessing, 201);
});

app.post('/aeronaves/:codigo/pecas', async (req, res) => {
  const { nome, tipo, fornecedor, status } = req.body;
  const startProcessing = performance.now();
  const aeronave = await prisma.aeronave.findUnique({ where: { codigo: req.params.codigo } });
  if (!aeronave) {
    return res.status(404).json({ error: 'Aeronave não encontrada.' });
  }

  const peca = await prisma.peca.create({
    data: { nome, tipo, fornecedor, status, aeronaveId: req.params.codigo },
  });

  return sendJson(res, peca, startProcessing, 201);
});

app.put('/aeronaves/:codigo/pecas/:pecaId', async (req, res) => {
  const { status } = req.body;
  const startProcessing = performance.now();
  const peca = await prisma.peca.update({
    where: { id: req.params.pecaId },
    data: { status },
  });
  return sendJson(res, peca, startProcessing);
});

app.post('/aeronaves/:codigo/etapas', async (req, res) => {
  const { nome, prazo, status, funcionariosIds } = req.body;
  const startProcessing = performance.now();
  const aeronave = await prisma.aeronave.findUnique({ where: { codigo: req.params.codigo } });
  if (!aeronave) {
    return res.status(404).json({ error: 'Aeronave não encontrada.' });
  }

  const etapa = await prisma.etapa.create({
    data: {
      nome,
      prazo,
      status,
      aeronaveId: req.params.codigo,
      funcionarios: funcionariosIds?.length ? {
        create: funcionariosIds.map((funcionarioId: string) => ({ funcionarioId }))
      } : undefined,
    },
  });

  return sendJson(res, etapa, startProcessing, 201);
});

app.patch('/aeronaves/:codigo/etapas/:etapaId', async (req, res) => {
  const { status } = req.body;
  const startProcessing = performance.now();

  if (status === 'ANDAMENTO' || status === 'CONCLUIDA') {
    const etapaWithFuncs = await prisma.etapa.findUnique({
      where: { id: req.params.etapaId },
      include: { funcionarios: true }
    });
    if (!etapaWithFuncs || etapaWithFuncs.funcionarios.length === 0) {
      return res.status(400).json({ error: 'Não é possível iniciar ou finalizar uma etapa sem funcionários vinculados.' });
    }
  }

  const etapa = await prisma.etapa.update({
    where: { id: req.params.etapaId },
    data: { status },
  });
  return sendJson(res, etapa, startProcessing);
});

app.post('/etapas/:etapaId/funcionarios', async (req, res) => {
  const { funcionarioId } = req.body;
  const startProcessing = performance.now();
  const existing = await prisma.etapaFuncionario.findUnique({
    where: { etapaId_funcionarioId: { etapaId: req.params.etapaId, funcionarioId } },
  });
  if (existing) {
    return res.status(409).json({ error: 'Funcionário já associado à etapa.' });
  }

  const etapaFuncionario = await prisma.etapaFuncionario.create({
    data: { etapaId: req.params.etapaId, funcionarioId },
  });
  return sendJson(res, etapaFuncionario, startProcessing, 201);
});

app.post('/aeronaves/:codigo/testes', async (req, res) => {
  const { tipo, resultado } = req.body;
  const startProcessing = performance.now();
  const aeronave = await prisma.aeronave.findUnique({ where: { codigo: req.params.codigo } });
  if (!aeronave) {
    return res.status(404).json({ error: 'Aeronave não encontrada.' });
  }

  const teste = await prisma.teste.create({
    data: { tipo, resultado, aeronaveId: req.params.codigo },
  });
  return sendJson(res, teste, startProcessing, 201);
});

// Funcionarios
app.get('/funcionarios', async (req, res) => {
  const startProcessing = performance.now();
  const funcionarios = await prisma.funcionario.findMany({
    select: {
      id: true,
      nome: true,
      telefone: true,
      endereco: true,
      usuario: true,
      nivelPermissao: true,
    },
  });
  return sendJson(res, funcionarios, startProcessing);
});

app.get('/funcionarios/:id', async (req, res) => {
  const startProcessing = performance.now();
  const funcionario = await prisma.funcionario.findUnique({
    where: { id: req.params.id },
    select: {
      id: true,
      nome: true,
      telefone: true,
      endereco: true,
      usuario: true,
      nivelPermissao: true,
    },
  });

  if (!funcionario) {
    return res.status(404).json({ error: 'Funcionário não encontrado.' });
  }
  return sendJson(res, funcionario, startProcessing);
});

app.post('/funcionarios', async (req, res) => {
  const { id, ...rest } = req.body; // Remove id se vier do mock
  const startProcessing = performance.now();
  if (rest.senha) {
    rest.senha = await bcrypt.hash(rest.senha, 10);
  }
  const funcionario = await prisma.funcionario.create({ data: rest });
  const sanitized = {
    id: funcionario.id,
    nome: funcionario.nome,
    telefone: funcionario.telefone,
    endereco: funcionario.endereco,
    usuario: funcionario.usuario,
    nivelPermissao: funcionario.nivelPermissao,
  };
  return sendJson(res, sanitized, startProcessing, 201);
});

app.put('/funcionarios/:id', async (req, res) => {
  const startProcessing = performance.now();
  const data = req.body;
  if (data.senha) {
    data.senha = await bcrypt.hash(data.senha, 10);
  }
  try {
    const funcionario = await prisma.funcionario.update({
      where: { id: req.params.id },
      data,
    });
  const sanitized = {
    id: funcionario.id,
    nome: funcionario.nome,
    telefone: funcionario.telefone,
    endereco: funcionario.endereco,
    usuario: funcionario.usuario,
    nivelPermissao: funcionario.nivelPermissao,
  };
  return sendJson(res, sanitized, startProcessing);
  } catch (error) {
    return res.status(404).json({ error: 'Funcionário não encontrado.' });
  }
});

app.delete('/funcionarios/:id', async (req, res) => {
  const startProcessing = performance.now();
  try {
    await prisma.funcionario.delete({ where: { id: req.params.id } });
    return sendJson(res, { message: 'Funcionário removido com sucesso.' }, startProcessing);
  } catch (e) {
    return res.status(404).json({ error: 'Funcionário não encontrado.' });
  }
});

app.post('/login', async (req, res) => {
  const { usuario, senha } = req.body;
  const startProcessing = performance.now();
  const funcionario = await prisma.funcionario.findUnique({
    where: { usuario },
  });

  if (!funcionario || !(await bcrypt.compare(senha, funcionario.senha))) {
    return res.status(401).json({ error: 'Usuário ou senha inválidos.' });
  }

  const sanitized = {
    id: funcionario.id,
    nome: funcionario.nome,
    telefone: funcionario.telefone,
    endereco: funcionario.endereco,
    usuario: funcionario.usuario,
    nivelPermissao: funcionario.nivelPermissao,
  };
  return sendJson(res, sanitized, startProcessing);
});

// Update Aeronave ( Nested writes para Peças, Etapas e Testes )
app.put('/aeronaves/:codigo', async (req, res) => {
  const { codigo } = req.params;
  const { pecas, etapas, testes, ...rest } = req.body;
  const startProcessing = performance.now();

  
  await prisma.peca.deleteMany({ where: { aeronaveId: codigo } });
  await prisma.etapa.deleteMany({ where: { aeronaveId: codigo } });
  await prisma.teste.deleteMany({ where: { aeronaveId: codigo } });
  
  const aeronave = await prisma.aeronave.update({
    where: { codigo },
    data: {
      ...rest,
      pecas: pecas?.length ? { create: pecas.map((p: any) => ({
        nome: p.nome, tipo: p.tipo, fornecedor: p.fornecedor, status: p.status
      })) } : undefined,
      etapas: etapas?.length ? { create: etapas.map((e: any) => ({
        nome: e.nome, 
        prazo: e.prazo, 
        status: e.status,
        funcionarios: e.funcionariosIds?.length ? {
          create: e.funcionariosIds.map((id: string) => ({
            funcionarioId: id
          }))
        } : undefined
      })) } : undefined,
      testes: testes?.length ? { create: testes.map((t: any) => ({
        tipo: t.tipo, resultado: t.resultado
      })) } : undefined
    },
    include: { pecas: true, etapas: true, testes: true }
  });

  return sendJson(res, aeronave, startProcessing);
});

async function seedDefaultData() {
  const defaultUsers = [
    {
      id: 'F0001',
      nome: 'Administrador Padrão',
      telefone: '(00) 00000-0000',
      endereco: 'Sede Aerocode',
      usuario: 'admin',
      senha: 'admin123',
      nivelPermissao: 'ADMINISTRADOR',
    },
    {
      id: 'F0002',
      nome: 'Engenheiro Padrão',
      telefone: '(00) 11111-1111',
      endereco: 'Fábrica Principal',
      usuario: 'engenheiro',
      senha: 'eng123',
      nivelPermissao: 'ENGENHEIRO',
    },
    {
      id: 'F0003',
      nome: 'Operador Padrão',
      telefone: '(00) 22222-2222',
      endereco: 'Linha de Montagem',
      usuario: 'operador',
      senha: 'op123',
      nivelPermissao: 'OPERADOR',
    },
  ];

  for (const user of defaultUsers) {
    const hashedPassword = await bcrypt.hash(user.senha, 10);
    await prisma.funcionario.upsert({
      where: { usuario: user.usuario },
      update: {
        nome: user.nome,
        telefone: user.telefone,
        endereco: user.endereco,
        senha: hashedPassword,
        nivelPermissao: user.nivelPermissao,
      },
      create: { ...user, senha: hashedPassword },
    });
  }

  const sampleAeronave = await prisma.aeronave.findUnique({ where: { codigo: 'A320-001' } });
  if (!sampleAeronave) {
    await prisma.aeronave.create({
      data: {
        codigo: 'A320-001',
        modelo: 'Airbus A320',
        tipo: 'COMERCIAL',
        capacidade: 180,
        alcance: 6100,
        pecas: {
          create: [
            { nome: 'Motor TurboFan', tipo: 'IMPORTADA', fornecedor: 'CFM International', status: 'EM_PRODUCAO' },
            { nome: 'Trem de Pouso', tipo: 'NACIONAL', fornecedor: 'Embraer Componentes', status: 'EM_TRANSPORTE' },
          ],
        },
        etapas: {
          create: [
            {
              nome: 'Montagem da fuselagem',
              prazo: '2026-07-10',
              status: 'ANDAMENTO',
              funcionarios: {
                create: [
                  { funcionarioId: 'F0002' },
                ],
              },
            },
            {
              nome: 'Teste de sistemas',
              prazo: '2026-07-20',
              status: 'PENDENTE',
            },
          ],
        },
        testes: {
          create: [
            { tipo: 'ELETRICO', resultado: 'APROVADO' },
          ],
        },
      },
    });
  }
}

seedDefaultData()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Erro durante o seed inicial:', error);
    process.exit(1);
  });
