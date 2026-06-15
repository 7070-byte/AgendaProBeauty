# API Back-End

API REST desenvolvida para o gerenciamento de agendamentos do salão de beleza AgendaProBeauty. Este projeto faz parte do Programa de Residência Tecnológica em Desenvolvimento de Software.

Escopo do Projeto

A API foi projetada para cobrir os seguintes requisitos essenciais:
* Cadastro e login de usuários com autenticação e controle de acesso.
* Gestão completa de profissionais, serviços e áreas do salão.
* Controle de agenda, definição de horários de trabalho e bloqueios manuais.
* Criação, cancelamento e atualização de status de agendamentos.

Tecnologias Utilizadas

Runtime: Node.js (última atualização)
Framework: Express
Arquitetura Baseada em Módulos 

Estrutura de Pastas (Sprint 1)

O projeto adota uma estrutura modular para facilitar a manutenção:

src/
├── config/                 # Configurações globais (banco de dados)
├── server.js               # Inicialização do servidor Express
└── modules/                # Módulos independentes da aplicação
    ├── usuarios/           # Rotas, controllers, services e repositories de Usuários
    ├── profissionais/      # Módulo de Profissionais
    ├── servicos/           # Módulo de Serviços
    └── agendamentos/       # Módulo de Agendamentos
