# Aerocode GUI

Este é o repositório do **Aerocode GUI**, um sistema moderno para a gestão de produção de aeronaves. Este projeto consiste na modernização de um sistema legado (anteriormente baseado em linha de comando - CLI) para uma **Interface Gráfica de Usuário (SPA)** robusta, intuitiva e escalável.

## 📄 Documentação Oficial
Para detalhes completos sobre o planejamento, wireframes, protótipos de alta fidelidade e fluxos de navegação (divididos por níveis de acesso), consulte o nosso relatório oficial:
👉 **[Ler o Relatório Final em PDF](./docs/Relatorio_Aerocode_GUI.pdf)**

## Tecnologias Utilizadas
- **React 18** (com Hooks e Context API para gerenciamento de estado)
- **TypeScript** (tipagem estática para maior segurança no desenvolvimento)
- **Vite** (ferramenta de build rápida)
- **Lucide React** (ícones)
- **CSS3** (Variáveis CSS, Flexbox, Grid e animações personalizadas)

## Níveis de Acesso
O sistema implementa um controle rigoroso de permissões focado na rotina corporativa:
1. **Administrador:** Acesso total. Pode criar/editar/remover funcionários, gerenciar frota, atualizar testes/etapas e emitir relatórios.
2. **Engenheiro:** Focado na parte técnica. Possui todas as permissões de gerência na linha de montagem (Aeronaves, Peças, Etapas, Testes), mas não tem acesso à gestão de equipe ou à emissão do relatório oficial de venda.
3. **Operador:** Focado apenas na leitura das atividades de chão de fábrica. Pode navegar pelos fluxos de produção para consulta, mas possui a interface travada (apenas visualização) para edições críticas.

## 💻 Como Rodar o Projeto

### Pré-requisitos
- Node.js (versão 18+ recomendada)
- NPM ou Yarn

### Instalação
1. Clone o repositório:
```bash
git clone https://github.com/mavygarcia/AV3.git
```

2. Entre na pasta do projeto:
```bash
cd AV3
```

3. Instale as dependências (utilize a flag `--legacy-peer-deps` para evitar qualquer conflito caso esteja rodando com versões do Node antigas ou muito recentes):
```bash
npm install --legacy-peer-deps
```

4. Crie o arquivo de configuração de ambiente e aponte para o backend:
```bash
copy .env.example .env
```

5. Ajuste `VITE_API_URL` no arquivo `.env` caso o backend esteja em outra URL.

6. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

O frontend utiliza autenticação backend real em vez de login local fixo.

O projeto estará disponível no seu navegador, geralmente em `http://localhost:5173`.

###  Acesso de Demonstração (Login Padrão)
Para testar o sistema, você pode utilizar as seguintes credenciais que já vêm configuradas por padrão:
- **Administrador:** Usuário: `admin` | Senha: `admin123`
- **Engenheiro:** Usuário: `engenheiro` | Senha: `eng123`
- **Operador:** Usuário: `operador` | Senha: `op123`

---


