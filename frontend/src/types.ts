export enum TipoAeronave {
  COMERCIAL = "COMERCIAL",
  MILITAR = "MILITAR",
}

export enum NivelPermissao {
  ADMINISTRADOR = "ADMINISTRADOR",
  ENGENHEIRO = "ENGENHEIRO",
  OPERADOR = "OPERADOR",
}

export enum TipoPeca {
  NACIONAL = "NACIONAL",
  IMPORTADA = "IMPORTADA",
}

export enum StatusPeca {
  EM_PRODUCAO = "EM_PRODUCAO",
  EM_TRANSPORTE = "EM_TRANSPORTE",
  PRONTA = "PRONTA",
}

export enum StatusEtapa {
  PENDENTE = "PENDENTE",
  ANDAMENTO = "ANDAMENTO",
  CONCLUIDA = "CONCLUIDA",
}

export enum TipoTeste {
  ELETRICO = "ELETRICO",
  HIDRAULICO = "HIDRAULICO",
  AERODINAMICO = "AERODINAMICO",
}

export enum ResultadoTeste {
  APROVADO = "APROVADO",
  REPROVADO = "REPROVADO",
}

export interface Funcionario {
  id: string;
  nome: string;
  telefone: string;
  endereco: string;
  usuario: string;
  nivelPermissao: NivelPermissao;
}

export interface Peca {
  id?: string;
  nome: string;
  tipo: TipoPeca;
  fornecedor: string;
  status: StatusPeca;
}

export interface Etapa {
  id?: string;
  nome: string;
  prazo: string;
  status: StatusEtapa;
  funcionariosIds: string[];
}

export interface Teste {
  id?: string;
  tipo: TipoTeste;
  resultado: ResultadoTeste;
}

export interface Aeronave {
  codigo: string;
  modelo: string;
  tipo: TipoAeronave;
  capacidade: number;
  alcance: number;
  pecas: Peca[];
  etapas: Etapa[];
  testes: Teste[];
}
