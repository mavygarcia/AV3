# Relatório de Planejamento e Requisitos - Aerocode GUI

Este documento apresenta os wireframes de baixa fidelidade, os protótipos de alta fidelidade e os fluxos de navegação do sistema Aerocode GUI. O objetivo é demonstrar a estrutura visual, a organização das funcionalidades e os diferentes níveis de acesso dos usuários do sistema.

## 1. Objetivos do Projeto
O projeto Aerocode GUI tem como objetivo transformar o sistema atual baseado em linha de comando (CLI) em uma aplicação gráfica moderna e intuitiva. A proposta busca melhorar a experiência dos usuários, reduzir a curva de aprendizado e aumentar a produtividade operacional dentro do ambiente corporativo aeronáutico.

## 2. Público-Alvo
A aplicação foi projetada principalmente para Engenheiros Aeronáuticos, Engenheiros de Produção, Operadores e Administradores do sistema. Cada perfil possui permissões específicas e funcionalidades adaptadas às suas responsabilidades dentro da operação.

## 3. Requisitos Funcionais
- **Sistema de autenticação** com controle de permissões por perfil (Administrador, Engenheiro, Operador).
- **Cadastro e gerenciamento de aeronaves** (código, modelo, tipo, capacidade e alcance).
- **Controle de peças** e estoque operacional (com atualização de status).
- **Gerenciamento das etapas de produção** (início, conclusão e atribuição de funcionários).
- **Registro e acompanhamento de testes de qualidade** (elétrico, hidráulico, aerodinâmico).
- **Cadastro de funcionários e níveis de acesso** (CRUD completo com edição e exclusão restrita a Administradores).
- **Geração de relatórios oficiais de entrega** ao final da produção.

## 4. Requisitos Não Funcionais
- Aplicação desenvolvida utilizando **React** e **TypeScript**.
- Arquitetura baseada em **SPA** (Single Page Application).
- Interface responsiva, moderna e dinâmica.
- Compatibilidade com ambientes Windows e Linux.
- Protótipo focado em Front-End com armazenamento temporário em memória (Context API).

---

## 5. Estrutura Visual e Telas do Sistema

Nesta seção, detalhamos o fluxo de navegação e as interfaces projetadas para cada um dos diferentes níveis de acesso. O sistema adapta suas funcionalidades para garantir segurança e focar no que é relevante para cada usuário.

### 5.1. Wireframes de Baixa Fidelidade

Nesta etapa inicial de design, o foco foi estruturar a informação, destacando os menus, os módulos principais e os fluxos de navegação que cada perfil deve percorrer.

#### Administrador (Baixa Fidelidade)
O administrador possui acesso completo ao sistema, incluindo cadastro de aeronaves, gestão de peças, controle de funcionários, testes de qualidade e emissão de relatórios.
- **Fluxo de Navegação:** O acesso é feito primeiramente pela **Tela de Login**. Após a autenticação, o administrador é direcionado para a página inicial de **Aeronaves**, onde gerencia a frota. A partir do menu lateral, ele tem acesso livre à aba de **Funcionários** e pode navegar sucessivamente pelos módulos operacionais de **Peças**, **Etapas**, **Testes** e **Relatórios**.
- **Gestão de Funcionários:** Tela com listagem completa da equipe, botão de "Novo Cadastro" e ícones para edição e exclusão de contas com modal de segurança.
- **Gestão da Produção:** Formulários expansíveis no topo para cadastro de peças, etapas e testes, além da atualização irrestrita de status nas tabelas abaixo.

> **[ ESPAÇO PARA A IMAGEM AQUI: Insira o Wireframe de Baixa Fidelidade do Administrador ]**

#### Engenheiro (Baixa Fidelidade)
Demonstra o fluxo de trabalho voltado diretamente para as etapas de montagem, testes de qualidade e controle operacional da planta fabril.
- **Fluxo de Navegação:** Entra pelo **Login** e também inicia sua jornada na tela de **Aeronaves**. Através do menu, ele percorre as telas de **Peças**, **Etapas** e **Testes**.
- **Gestão Operacional:** Possui permissões de edição nas páginas de Aeronaves, Peças, Etapas e Testes.
- **Acompanhamento Produtivo:** Interface focada em facilitar o acompanhamento e o registro de aprovação de qualidade em tempo real.
- **Restrições:** O fluxo omite a aba de Gestão de Funcionários no menu por motivos de segurança.

> **[ ESPAÇO PARA A IMAGEM AQUI: Insira o Wireframe de Baixa Fidelidade do Engenheiro ]**

#### Operador (Baixa Fidelidade)
Destaca as funcionalidades focadas estritamente nas atividades diárias da linha de montagem, simplificando as tarefas.
- **Fluxo de Navegação:** O operador faz o **Login** e acessa a página de **Aeronaves**. Pelo menu, ele pode apenas consultar o sequenciamento de **Peças**, **Etapas** e **Testes**.
- **Foco na Produção:** Leitura das atividades essenciais (verificação de peças disponíveis, status de etapas e resultados de testes).
- **Interface Restrita (Apenas Visualização):** Botões de "Adicionar" e opções de mudança de status são ocultados ou substituídos por avisos de que não há permissão de alteração.


---

### 5.2. Protótipos de Alta Fidelidade

Nesta etapa, apresentamos a identidade visual definitiva da plataforma Aerocode GUI. O layout utiliza tema escuro moderno, componentes responsivos e navegação intuitiva.

#### Administrador (Alta Fidelidade)
Apresenta a experiência profissional completa para o gerenciamento total do sistema e de toda a equipe, com cores sólidas e alertas visuais claros.



#### Engenheiro (Alta Fidelidade)
Demonstra uma interface otimizada para produtividade e análise técnica rigorosa das etapas da aeronave.



#### Operador (Alta Fidelidade)
A versão final do fluxo para o operador é extremamente enxuta, impedindo poluição visual para quem precisa focar estritamente em consultar as ordens de serviço.


## 6. Conclusão
Os wireframes e protótipos apresentados demonstram a evolução visual e estrutural da plataforma Aerocode GUI. A solução proposta busca oferecer uma experiência mais intuitiva, organizada e eficiente para a gestão de produção de aeronaves, alinhando tecnologia, usabilidade e produtividade em um único ambiente integrado.
