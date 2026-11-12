# SPEC-014 — Rondo em Projects e no AI Lab

## 1. Identificação

| Campo | Valor |
|---|---|
| Nome | Rondo em Projects e no AI Lab |
| Identificador | SPEC-014 |
| Slug | `014-rondo` |
| Versão | 0.2.0 |
| Status | In Review (2026-11-12). Textos e defaults aprovados pelo Bruno; implementada e verificada (seção 15). |
| Data | 2026-11-12 |
| Origem | Pedido do Bruno: o projeto "Analytics Personas" virou o **Rondo**, ganhou uma identidade visual e novas funcionalidades; atualizar o portfólio com as telas do app e adicionar o projeto à seção Projects. |

Prioridades usadas: **Must** (obrigatório), **Should** (desejável; pode ser adiada sem bloquear a entrega).

## 2. Contexto

Hoje o projeto existe no site só como o card **"Analytics Personas"** (estado "Planning", sem página) no AI Lab (SPEC-006). O repositório (`brunolucildo/rondo`, público) foi renomeado para **Rondo** e saiu da fase de ideia: tem a fundação técnica e o fluxo de autenticação prontos, observabilidade, testes de carga e uma identidade visual própria. As funcionalidades de produto (experts, conectores, ingestão, LLM) **não existem**.

**Objetivo:** apresentar o Rondo em Projects, com página de detalhe e telas reais do app, com o mesmo rigor das outras páginas: estado real, nada além do que o repositório sustenta, e sem números de avaliação.

**Fontes (lidas em 2026-11-12):** `README.md`, `.docs/BUSINESS.md`, `.docs/ARCHITECTURE.md`, `.docs/DESIGN.md`, `.docs/QA.md` e os ADRs 0007, 0009, 0010, 0012 e 0013 do repositório do Rondo, mais as telas do app capturadas localmente.

## 3. Escopo

### 3.1. Dentro do escopo

1. O Rondo entra em `/projects` como **quarto projeto**, com página de detalhe em `/projects/rondo` (pt-BR: `/projetos/rondo`), no mesmo formato do Reelix e do Football.
2. Categoria "Personal project", estado "In development" (decisão do Bruno em 2026-11-12).
3. Quatro telas do app, em um conjunto único para os dois idiomas: entrada (sign in), criar conta (sign up), recuperar senha (forgot password) e redefinir senha (reset password). Elas carregam a marca (logo pixel-art, paleta e sombras duras).
4. O card do AI Lab "Analytics Personas" passa a se chamar **Rondo** e leva à página do projeto.
5. O Rondo entra também nos destaques da Home (ver Q1).
6. Metadados da lista de Projects, do detalhe e do AI Lab atualizados nos dois idiomas; o sitemap passa de 34 para 36 páginas.
7. Testes E2E e documentação (`README.md`, `PUBLICACAO.md`, `QA.md`, SPEC-001, SPEC-004 e SPEC-006) ajustados.

### 3.2. Fora do escopo

- Página de detalhe nova no AI Lab para o Rondo (o card só aponta para Projects).
- Atualizar a página Technologies com a stack do Rondo (candidato a SPEC própria; ver Q4).
- Telas que exigem back-end (conta confirmada, `/app`), painel do Grafana, resultados dos testes de carga e quaisquer números de avaliação (PROJ-RF-08).
- Capturas do logo isolado ou da paleta como imagem própria (a marca aparece nas telas).
- Apresentar o Rondo como produto lançado ou disponível, e mensagens de disponibilidade profissional.
- Alterar o repositório do Rondo.

## 4. Requisitos funcionais

| ID | Prioridade | Requisito |
|---|---|---|
| RON-RF-01 | Must | `/en/projects` e `/pt-BR/projetos` listam quatro projetos, nesta ordem: Football Stat Analytics, Reelix, Rondo e FintaLab (ver Q2). Cada entrada tem um `h2` com o nome. |
| RON-RF-02 | Must | A entrada do Rondo mostra categoria "Personal project"/"Projeto pessoal", estado "In development"/"Em desenvolvimento", descrição curta, tecnologias, "View details" e "View on GitHub". |
| RON-RF-03 | Must | O detalhe existe em `/en/projects/rondo` e `/pt-BR/projetos/rondo`, com o mesmo conjunto de sete seções dos outros detalhes (PROJ-RF-06): Overview, Challenge, Solution, Architecture, Technical decisions, Current state e Links. Não há seção Results. |
| RON-RF-04 | Must | As tecnologias do Rondo correspondem ao que está instalado e em uso no repositório (seção 7.1). Itens apenas planejados (Vercel, CI, provedor de LLM, conectores) não aparecem como tecnologia do projeto. |
| RON-RF-05 | Must | O texto do Rondo nunca apresenta experts, conectores, ingestão de fontes, integração com LLM ou implantação como existentes, e diz isso na seção Current state. |
| RON-RF-06 | Must | Nenhuma página do Rondo publica números de avaliação, de desempenho, de carga ou percentuais (PROJ-RF-08). |
| RON-RF-07 | Must | O link "View on GitHub" aponta para `https://github.com/brunolucildo/rondo`, abre em nova aba, com `rel="noopener noreferrer"` e indicação acessível. |
| RON-RF-08 | Must | O detalhe mostra as quatro telas da seção 7.4 em uma fileira rolável e focável com o rótulo "Screens"/"Telas"; a lista mostra as três primeiras (entrada, criar conta, recuperar senha). Cada imagem tem `alt` e legenda no idioma da página, largura e altura declaradas, até 250 KB e carrega sob demanda quando está abaixo da primeira dobra. |
| RON-RF-09 | Must | As imagens não contêm e-mails, nomes, senhas nem qualquer dado real: os formulários estão vazios. |
| RON-RF-10 | Must | O card "Rondo" do AI Lab mantém o estado "Planning"/"Em planejamento", usa o nome "Rondo" e tem um único link, no nome, para o detalhe do projeto no mesmo idioma. A frase do card continua dizendo que a fundação técnica existe e as funcionalidades de produto, não. |
| RON-RF-11 | Must | O nome "Analytics Personas" não aparece mais como título de projeto em nenhuma página; ele pode aparecer uma vez, na Overview do Rondo, como nome anterior ("called Analytics Personas before"). |
| RON-RF-12 | Must | Nome, categoria, estado e descrição do Rondo são idênticos na lista, nos destaques da Home e no detalhe (PROJ-RNF-06). |
| RON-RF-13 | Must | Os destaques da Home mostram quatro projetos, na ordem da lista (decisão do layout em Q1). |
| RON-RF-14 | Must | O detalhe e a lista de Projects têm `title`, `description`, canonical, `hreflang` e Open Graph por idioma, são indexáveis e entram no sitemap (36 URLs) e nos dados estruturados conforme a SPEC-013; título até 60 e descrição até 160 caracteres. |
| RON-RF-15 | Must | Todo texto visível vem dos arquivos de conteúdo `en` e `pt-BR`, sem condicionais de idioma nos componentes (PROJ-RF-11), e as páginas não contêm as expressões proibidas do `CLAUDE.md` (seção 7). |

## 5. Requisitos não funcionais

| ID | Categoria | Requisito |
|---|---|---|
| RON-RNF-01 | Renderização | Estática, sem Client Components novos, conteúdo no HTML inicial (PROJ-RNF-01). |
| RON-RNF-02 | Acessibilidade | WCAG 2.2 AA: zero violações no axe-core nas duas páginas novas e na lista, a 1440 px e 390 px, nos dois idiomas; hierarquia de títulos sem saltos; alvos de toque de 44 px. |
| RON-RNF-03 | Responsividade | Sem rolagem horizontal em 360, 390, 768, 1366, 1440 e 1920 px; com quatro cards, a Home mantém os cards legíveis em 1024 px e acima. |
| RON-RNF-04 | Desempenho | LCP até 2,5 s e CLS até 0,1; as imagens passam pelo otimizador do Next.js. |
| RON-RNF-05 | Qualidade | `pnpm check`, `pnpm typecheck`, `pnpm build` e `pnpm test:e2e` sem erros; paridade de chaves entre `en` e `pt-BR`. |
| RON-RNF-06 | Consistência | A mudança do número de páginas (34 para 36) é refletida nos testes e nos documentos que citam o número. |

## 6. Interface e experiência

Segue a SPEC-004 sem exceção de layout: entrada editorial na lista, detalhe com sete seções em duas colunas a partir de 1024 px, estado em `Badge` (o estado "In development" já existe) e fileira de telas rolável no detalhe.

- **Imagens:** são capturas de tela de desktop, quase quadradas (cerca de 0,93:1), diferentes das telas verticais de celular do Reelix. Na fileira, cada tela mantém a proporção e o encaixe por tela; no mobile, a fileira rola na horizontal.
- **Home:** com quatro projetos, a grade de destaques passa de três colunas para duas a partir de 1024 px (2 × 2), porque três colunas deixariam um card sozinho na segunda linha (decisão em Q1).
- **AI Lab:** o card "Rondo" deixa de ser um card sem link; o link no nome segue o padrão dos experimentos com página (NEU-RF-15, ajustado por esta SPEC).
- Sem animação nova, sem parallax e sem hover decorativo.

### Estados

| Situação | Comportamento |
|---|---|
| Slug desconhecido | 404 do site, no idioma da rota. |
| Texto mais longo em pt-BR | Quebra de linha na coluna, sem rolagem horizontal. |
| JavaScript desabilitado | Páginas inteiras legíveis e links funcionais. |

## 7. Conteúdo e dados

Todos os fatos vêm da documentação e do código do repositório do Rondo (seção 2). **Os textos abaixo são rascunhos para aprovação do Bruno (Q3).**

### 7.1. Dados do projeto

| Campo | Valor |
|---|---|
| Chave e slug | `rondo` / `rondo` |
| Repositório | `https://github.com/brunolucildo/rondo` |
| Categoria e estado | Personal project / In development |
| Tecnologias (ordem de exibição) | TypeScript, Node.js, PostgreSQL |
| Legenda das imagens | Uma só, `rondo` |

A lista é curta de propósito: a SPEC-005 exige que toda tecnologia de um projeto conste na página Technologies, com o projeto no contexto. Como a stack completa do Rondo (React, Vite, TanStack, Tailwind CSS, shadcn/ui, Nest.js, Next.js, Supabase, OpenTelemetry, Grafana, k6, Playwright) ainda não está nessa página e ampliá-la é outra SPEC (Q4), só entram os nomes que já existem lá (TypeScript, Node.js e PostgreSQL), e o restante da stack aparece no texto de Architecture. Fora da lista também: Bun, Turborepo e tudo que está só planejado.

### 7.2. Textos da lista e da Home

| Campo | Inglês (`en`) | Português (`pt-BR`) |
|---|---|---|
| Nome | Rondo | Rondo |
| Categoria | Personal project | Projeto pessoal |
| Estado | In development | Em desenvolvimento |
| Descrição curta | A platform to create and run AI experts for the roles of a football club, with answers traceable to connected sources. The technical foundation exists; product features do not. | Uma plataforma para criar e operar especialistas de IA para as funções de um clube de futebol, com respostas rastreáveis até as fontes conectadas. A fundação técnica existe; as funcionalidades de produto, não. |

### 7.3. Detalhe

**Metadados**

| | Inglês | Português |
|---|---|---|
| `title` | Rondo \| Bruno Lucildo | Rondo \| Bruno Lucildo |
| `description` | A personal platform for football club AI experts: authentication, observability and load tests in place; architecture, decisions and current state. (147) | Plataforma pessoal de especialistas de IA para clubes de futebol: autenticação, observabilidade e testes de carga prontos; arquitetura, decisões e estado atual. (160) |

**Overview**

- **en:** Rondo is a platform to create and run experts: AI agents specialized in the roles of a football club, such as head coach or performance analyst, fed by connected data sources and answering with citations to them. It was called Analytics Personas before it took the Rondo name. The repository is a monorepo with a React web app, a Nest.js API and a local observability stack. It is a personal project.
- **pt-BR:** O Rondo é uma plataforma para criar e operar especialistas: agentes de IA especializados nas funções de um clube de futebol, como técnico ou analista de desempenho, alimentados por fontes de dados conectadas e com respostas que citam essas fontes. O projeto se chamava Analytics Personas antes de receber o nome Rondo. O repositório é um monorepo com um app web em React, uma API em Nest.js e uma pilha local de observabilidade. É um projeto pessoal.

**Challenge**

- **en:** Football clubs keep knowledge in scattered tools: documents, wikis, tickets and spreadsheets. Each role needs that material turned into decisions quickly, and an answer that cannot be traced to its sources, or that invents data, is worse than no answer. The challenge is to build specialized experts whose answers are auditable, on a base where accounts and access to data can be trusted from the start.
- **pt-BR:** Os clubes de futebol guardam conhecimento em ferramentas dispersas: documentos, wikis, chamados e planilhas. Cada função precisa transformar esse material em decisões rápidas, e uma resposta que não pode ser rastreada até as fontes, ou que inventa dados, é pior do que nenhuma. O desafio é construir especialistas cujas respostas possam ser auditadas, sobre uma base em que contas e acesso aos dados sejam confiáveis desde o início.

**Solution**

- **en:** The product idea is one expert per role, each with its own scope, authorized sources and delivery format, answering requests in natural language with citations and declaring a gap when context is missing. So far the work went into the base this needs: accounts with e-mail confirmation, sign-in and password recovery, an observable and load-tested API, and a design system with its own visual identity. Experts, connectors and the language model integration are planned and do not exist yet.
- **pt-BR:** A ideia do produto é um especialista por função, cada um com seu escopo, suas fontes autorizadas e seu formato de entrega, respondendo a pedidos em linguagem natural com citações e declarando a lacuna quando falta contexto. Até agora o trabalho foi para a base de que isso precisa: contas com confirmação por e-mail, entrada e recuperação de senha, uma API observável e testada sob carga, e um sistema de design com identidade visual própria. Os especialistas, os conectores e a integração com o modelo de linguagem estão planejados e ainda não existem.

**Architecture**

- **en:** A monorepo with a React and Vite web app (TanStack Router and Query), a Nest.js API in TypeScript, a Next.js documentation site and a shared design system package built on Tailwind CSS and shadcn/ui. The API is organized in vertical slices with domain, application, infrastructure and interface layers, one request handler per endpoint and one use case per flow. Data lives in PostgreSQL through a local Supabase, with row-level security on and no policies, so only the API can reach it. The API sends traces, metrics and logs through OpenTelemetry to a local Grafana stack (Loki, Tempo and Mimir), with a provisioned dashboard and alerts, and k6 load tests run against an isolated instance. Lint, formatting, unit, integration and end-to-end tests run locally; there is no CI pipeline yet.
- **pt-BR:** Um monorepo com um app web em React e Vite (TanStack Router e Query), uma API em Nest.js com TypeScript, um site de documentação em Next.js e um pacote de design system compartilhado, construído sobre Tailwind CSS e shadcn/ui. A API é organizada em fatias verticais com camadas de domínio, aplicação, infraestrutura e interface, um request handler por endpoint e um caso de uso por fluxo. Os dados ficam em PostgreSQL por meio de um Supabase local, com row-level security ligada e sem policies, de modo que só a API os alcança. A API envia traces, métricas e logs por OpenTelemetry a uma pilha Grafana local (Loki, Tempo e Mimir), com dashboard e alertas provisionados, e os testes de carga com k6 rodam contra uma instância isolada. Lint, formatação e testes unitários, de integração e end-to-end rodam localmente; ainda não há pipeline de CI.

**Technical decisions**

| # | Inglês (título. texto) | Português (título. texto) |
|---|---|---|
| 1 | **Authentication owned by the API.** Accounts, Argon2id password hashes and single-use link tokens, stored only as hashes, live in the API's own tables; Supabase Auth was deliberately not used. | **Autenticação própria da API.** Contas, hashes de senha em Argon2id e tokens de link de uso único, guardados só como hash, ficam nas tabelas da própria API; o Supabase Auth foi deliberadamente deixado de fora. |
| 2 | **Sessions that can be revoked at once.** The session token is a signed JWT, but every request also checks the session row in the database, so signing out or signing in elsewhere takes effect immediately and only the latest session of each person stays valid. | **Sessões que podem ser revogadas na hora.** O token de sessão é um JWT assinado, mas toda requisição também confere a sessão no banco; assim, sair ou entrar em outro lugar tem efeito imediato e só a última sessão de cada pessoa continua válida. |
| 3 | **Protect the server before the features.** Rate limits on sign-up and sign-in, and a cap on simultaneous password hashing with a bounded queue that answers "busy" instead of stalling the whole API, a design shaped by load tests. | **Proteger o servidor antes das funcionalidades.** Limites de requisição no cadastro e na entrada, e um teto de hashes de senha simultâneos com fila limitada, que responde "ocupado" em vez de travar a API inteira, desenho moldado por testes de carga. |
| 4 | **Observability from the start.** Metrics, traces and logs reach a single Grafana dashboard, with each attempt counted once in one place and no personal data in metric labels. | **Observabilidade desde o início.** Métricas, traces e logs chegam a um único dashboard do Grafana, com cada tentativa contada uma vez em um só lugar e sem dados pessoais nos rótulos das métricas. |
| 5 | **A visual identity of its own.** A retro 8-bit direction inspired by football and Brazil, with a pixel-art logo, a five-color palette and hard offset shadows, documented with accessibility rules aimed at WCAG 2.2 AA. | **Uma identidade visual própria.** Uma direção retrô em 8 bits, inspirada em futebol e no Brasil, com logo em pixel art, uma paleta de cinco cores e sombras duras deslocadas, documentada com regras de acessibilidade que visam o WCAG 2.2 AA. |

**Current state**

- **en:** In development. Implemented: account creation with e-mail confirmation, sign-in, sign-out and password recovery, plus the observability and load-testing setup. Not implemented: experts, connectors, source ingestion, the language model integration, deployment and a CI pipeline. The interface is in English, and the screens shown here come from the local development build, with no real data.
- **pt-BR:** Em desenvolvimento. Implementado: criação de conta com confirmação por e-mail, entrada, saída e recuperação de senha, mais a observabilidade e a configuração de testes de carga. Não implementado: especialistas, conectores, ingestão de fontes, integração com o modelo de linguagem, implantação e pipeline de CI. A interface está em inglês, e as telas exibidas aqui vêm da versão de desenvolvimento local, sem dados reais.

### 7.4. Imagens

Capturas feitas em 2026-11-12 do `apps/app` do Rondo em modo de desenvolvimento local (`vite`), viewport de 800 × 860 e escala 2, recortadas em 1040 × 1560 px, centradas no logo e no cartão (arquivos de 28 a 40 KB), com os formulários **vazios**, sem back-end e sem dados reais. Ficam em `public/images/projects/`, versionadas; a origem e os direitos entram em `public/images/CREDITS.md` (autoria do Bruno).

| Arquivo | Onde aparece |
|---|---|
| `rondo-sign-in.png` | Lista (1ª tela); detalhe (1ª tela) |
| `rondo-sign-up.png` | Lista (2ª tela); detalhe (2ª tela) |
| `rondo-forgot-password.png` | Lista (3ª tela); detalhe (3ª tela) |
| `rondo-reset-password.png` | Detalhe (4ª tela) |

| Chave | Texto alternativo (`en`) | Texto alternativo (`pt-BR`) |
|---|---|---|
| `rondoSignIn` | Rondo sign-in screen: the pixel-art Rondo logo above a card with email and password fields, an orange Sign in button and links to recover the password and create an account. The app interface is in English. | Tela de entrada do Rondo: o logo do Rondo em pixel art sobre um cartão com os campos de e-mail e senha, um botão laranja Sign in e links para recuperar a senha e criar uma conta. A interface do app está em inglês. |
| `rondoSignUp` | Rondo sign-up screen: the logo above a card with first name, last name, email, password and password confirmation fields and an orange Create account button. The app interface is in English. | Tela de cadastro do Rondo: o logo sobre um cartão com os campos de nome, sobrenome, e-mail, senha e confirmação de senha e um botão laranja Create account. A interface do app está em inglês. |
| `rondoForgotPassword` | Rondo password recovery screen: the logo above a card asking for the email to receive a reset link, with an orange Send reset link button. The app interface is in English. | Tela de recuperação de senha do Rondo: o logo sobre um cartão que pede o e-mail para receber o link de redefinição, com um botão laranja Send reset link. A interface do app está em inglês. |
| `rondoResetPassword` | Rondo reset password screen: the logo above a card with new password and confirmation fields, each with a show-password control, and an orange Reset password button. The app interface is in English. | Tela de redefinição de senha do Rondo: o logo sobre um cartão com os campos de nova senha e confirmação, cada um com um controle para mostrar a senha, e um botão laranja Reset password. A interface do app está em inglês. |

| Legenda | Texto |
|---|---|
| `en` | Screens from the local development build, with no real data. The app interface is in English. |
| `pt-BR` | Telas da versão de desenvolvimento local, sem dados reais. A interface do app está em inglês. |

### 7.5. AI Lab (card)

| Campo | Inglês | Português |
|---|---|---|
| Nome | Rondo | Rondo |
| Frase | A platform to create and run experts: AI agents specialized in the functions of a football club, fed by connected data sources, with answers traceable to them. The technical foundation exists; product features do not. | Uma plataforma para criar e operar especialistas: agentes de IA especializados nas funções de um clube de futebol, alimentados por fontes de dados conectadas, com respostas rastreáveis até elas. A fundação técnica existe; as funcionalidades de produto, não. |

A frase é a que já está aprovada para o card; só o nome muda e o card ganha o link.

### 7.6. Metadados da lista de Projects

| | Inglês | Português |
|---|---|---|
| `description` | Projects by Bruno Lucildo and their current state: AI football analysis, a movie tracking app and a club AI platform (personal), and a product concept. (151) | Projetos de Bruno Lucildo e o estado de cada um: análise de futebol com IA, app de filmes e plataforma de IA para clubes (pessoais) e um conceito de produto. (157) |

A frase de abertura da lista (`intro`) não muda.

## 8. Critérios de aceitação

| ID | Cobre | Critério (Given / When / Then) |
|---|---|---|
| RON-CA-01 | RF-01 | **Given** `/en/projects` e `/pt-BR/projetos` **Then** há um `h1` e quatro `h2` na ordem Football Stat Analytics, Reelix, Rondo e FintaLab. |
| RON-CA-02 | RF-02, RF-12 | **Given** a lista, a Home e o detalhe **Then** o Rondo tem o mesmo nome, categoria, estado e descrição nos três lugares, e a lista tem "View details" e "View on GitHub". |
| RON-CA-03 | RF-03 | **Given** `/en/projects/rondo` e `/pt-BR/projetos/rondo` **Then** respondem 200, com um `h1` e sete `h2` (Overview, Challenge, Solution, Architecture, Technical decisions, Current state, Links; pt-BR: Visão geral, Desafio, Solução, Arquitetura, Decisões técnicas, Estado atual, Links) e sem `h2` "Results". |
| RON-CA-04 | RF-04 | **Given** as tecnologias do Rondo **Then** são TypeScript, Node.js e PostgreSQL (seção 7.1), cada uma com o Rondo no contexto em Technologies, e nenhuma página cita Vercel, CI, Bun ou um provedor de LLM como tecnologia do projeto. |
| RON-CA-05 | RF-05, RF-06 | **Given** o texto do Rondo **When** buscado por "%" e por números de carga **Then** não há ocorrências, e a seção Current state lista o que não existe (especialistas, conectores, ingestão, LLM, implantação, CI). |
| RON-CA-06 | RF-07 | **Given** "View on GitHub" do Rondo **Then** aponta para `brunolucildo/rondo`, abre em nova aba com `rel` com `noopener` e indicação acessível. |
| RON-CA-07 | RF-08, RF-09 | **Given** a lista **Then** a entrada do Rondo mostra `rondo-sign-in`, `rondo-sign-up` e `rondo-forgot-password`, nessa ordem; **Given** o detalhe **Then** mostra as quatro telas da seção 7.4 em uma fileira rolável e focável com o rótulo "Screens"/"Telas". **Given** cada imagem **Then** tem `alt` e legenda no idioma da página, largura e altura declaradas, arquivo de até 250 KB e, abaixo da primeira dobra, carregamento sob demanda. **Given** uma revisão visual **Then** nenhuma mostra dado real. |
| RON-CA-08 | RF-10, RF-11 | **Given** o AI Lab **Then** o card "Rondo" mantém o estado "Planning"/"Em planejamento", tem um único link, no nome, para o detalhe do projeto no mesmo idioma, e "Analytics Personas" não aparece como título em nenhuma página; **When** o conteúdo é buscado por "Analytics Personas" **Then** só há uma ocorrência por idioma, na Overview do Rondo. |
| RON-CA-09 | RF-13, RNF-03 | **Given** a Home **Then** há quatro destaques, na ordem da lista; **Given** 1024, 1366 e 1440 px **Then** a grade tem duas colunas e nenhum card fica cortado. |
| RON-CA-10 | RF-14 | **Given** o HTML da lista, do detalhe e do card do AI Lab **Then** cada um tem `title` até 60 e `description` até 160 caracteres, canonical, `hreflang` e Open Graph por idioma, nenhuma meta `noindex`, e o sitemap lista 36 URLs, incluindo `/projects/rondo` e `/projetos/rondo`. |
| RON-CA-11 | RF-15 | **Given** as páginas nos dois idiomas **Then** não há texto visível fora dos arquivos de conteúdo, nem frase em idioma diferente do da página (exceto nomes próprios e os textos das telas, que estão em inglês e são descritos nos textos alternativos), nem as expressões proibidas do `CLAUDE.md`. |
| RON-CA-12 | RNF-01, RNF-02, RNF-04 | **Given** o HTML das páginas novas **Then** não há Client Components novos; o axe-core não acusa violações a 1440 px e 390 px nos dois idiomas; LCP e CLS ficam dentro das metas em build de produção. |
| RON-CA-13 | RNF-05, RNF-06 | **Given** o repositório **Then** `pnpm check`, `pnpm typecheck`, `pnpm build` e `pnpm test:e2e` terminam sem erros, e os testes e documentos que citavam 34 páginas citam 36. |

## 9. Dependências

| Dependência | Situação | Impacto |
|---|---|---|
| SPEC-004 Projects | Done | Passa a v0.9.0: quarto projeto, lista de quatro `h2` e legenda `rondo`. |
| SPEC-006 AI Lab e SPEC-012 | Done | O card "Analytics Personas" vira "Rondo" e ganha link (NEU-RF-15 ajustado); passa a v0.6.0 / v0.2.0. |
| SPEC-001 Home | Done | Quatro destaques e grade de duas colunas (HOME-RF-04, HOME-CA-04, HOME-CA-17). |
| SPEC-013 SEO | In Review | 36 páginas no sitemap, nos testes e na documentação (`PUBLICACAO.md`, `README.md`). |
| Repositório `brunolucildo/rondo` | Público | A fonte dos fatos; as telas vêm de uma execução local do `apps/app`. |

## 10. Riscos

| Risco | Mitigação |
|---|---|
| O Rondo parecer mais pronto do que é | Estado "In development", Current state listando o que não existe, RON-RF-05 e RON-CA-05. |
| Números dos testes de carga ou de desempenho publicados sem validação | RON-RF-06; os números dos ADRs ficam fora. |
| Captura mostrar dado pessoal | Formulários vazios, sem back-end, revisão visual (RON-CA-07). |
| Capturas ficarem desatualizadas quando a interface mudar | Legenda "versão de desenvolvimento local"; atualizar quando a identidade ou as telas mudarem de forma visível. |
| O nome antigo "Analytics Personas" continuar em links ou em buscas | Uma menção na Overview (RON-RF-11); o slug do AI Lab antigo não tinha página, então não há URL a redirecionar. |
| A interface do app estar em inglês nas duas versões do site | Legenda e textos alternativos dizem isso (como no Reelix, em português). |
| Home com quatro cards ficar desbalanceada | Grade 2 × 2 a partir de 1024 px (Q1), RON-CA-09. |
| O repositório mudar (README, nome, escopo) depois desta SPEC | Fatos datados de 2026-11-12; revisar quando houver funcionalidade de produto. |

## 11. Perguntas abertas

| ID | Pergunta | Impacto | Dono | Bloqueia |
|---|---|---|---|---|
| Q1 | Os quatro projetos entram na Home, em grade 2 × 2? A alternativa é manter três destaques na Home (qual sai?) ou voltar a três colunas com um card sozinho. | RON-RF-13 e HOME-RF-04. | Bruno | Não (reversível); default: 4 cards em 2 × 2. |
| Q2 | A ordem Football, Reelix, Rondo e FintaLab (conceitual por último) está boa, ou o Rondo, por ser o mais recente, vai em primeiro? | RON-RF-01 e RON-RF-13. | Bruno | Não (reversível); default: Rondo em terceiro. |
| Q3 | Os textos das seções 7.2 a 7.6 (lista, detalhe, textos alternativos, legenda e metadados, em inglês e português) estão aprovados? Em especial, as frases de desafio e de decisões técnicas, que resumem os ADRs. | Todo o conteúdo. | Bruno | **Sim.** |
| Q4 | A página Technologies deve ganhar a stack do Rondo (Nest.js, Supabase, OpenTelemetry, k6...)? | Fora do escopo; seria outra SPEC. Se sim, a lista de tecnologias do Rondo (7.1) passa a ser a completa. | Bruno | Não; default: não. **Em aberto (2026-11-12):** sem resposta, vale o default. |
| Q5 | Posso mencionar o nome anterior "Analytics Personas" na Overview (RON-RF-11)? | Texto da Overview. | Bruno | Não; default: sim. |

## 12. Premissas

1. O slug é `rondo` nos dois idiomas; o caminho usa `projects` em inglês e `projetos` em português.
2. Nome, categoria, estado, descrição, tecnologias, repositório e imagens do Rondo ficam em `src/config/projects.ts` e nos `common.json`, a fonte única da SPEC-004.
3. As capturas são de execução local do app, com formulários vazios e sem back-end. Os textos das telas estão em inglês (decisão de produto do Rondo de 2026-11-09).
4. As imagens do Rondo são únicas para os dois idiomas, como as do Reelix.
5. A lista curta de tecnologias (7.1) inclui só o que está instalado e em uso; ferramentas de monorepo e de testes de unidade ficam de fora para manter a linha legível.

## 13. Decisões registradas

| Data | Decisão | Origem |
|---|---|---|
| 2026-11-12 | O Rondo entra em Projects com página de detalhe; o card do AI Lab é renomeado e passa a apontar para o projeto. | Resposta do Bruno |
| 2026-11-12 | Imagens: telas de autenticação do app (sem painel de observabilidade e sem a marca como imagem à parte). | Resposta do Bruno |
| 2026-11-12 | Categoria "Personal project", estado "In development". | Resposta do Bruno |
| 2026-11-12 | Quatro telas (a de redefinição de senha só no detalhe), capturadas de uma execução local com formulários vazios. | Decisão do agente, aprovada com a SPEC (Q3) |
| 2026-11-12 | Textos (seção 7) e defaults de Q1, Q2 e Q5 aprovados: Home com quatro destaques em 2 × 2, Rondo em terceiro lugar e menção ao nome anterior. | Resposta do Bruno ("Aprovo, implementar") |
| 2026-11-12 | A lista de tecnologias do Rondo ficou em TypeScript, Node.js e PostgreSQL, porque o teste de consistência da SPEC-005 exige que toda tecnologia de projeto conste em Technologies. Decisão tomada pelo agente ao implementar, reversível por Q4. | Conflito entre SPEC-014 e SPEC-005, resolvido sem ampliar o escopo |

## 14. Impacto nos testes

- `e2e/projects.spec.ts`: lista com quatro `h2`, detalhe do Rondo (sete `h2`, tecnologias, links, imagens, fileira rolável), slug inexistente.
- `e2e/home.spec.ts`: quatro destaques e grade.
- `e2e/ai-lab.spec.ts` e `e2e/i18n.spec.ts`: card "Rondo" com link e sem "Analytics Personas" como título.
- `e2e/seo.spec.ts` e `e2e/a11y.spec.ts`: 36 páginas, metadados do detalhe novo, axe nas duas páginas.
- Conteúdo: `content-rules.ts` cobre as novas chaves.

## 15. Implementação e verificação

Implementada na branch `feat/rondo`. Arquivos:

- Novos: `.specs/014-rondo.md` e quatro telas em `public/images/projects/` (`rondo-sign-in.png`, `rondo-sign-up.png`, `rondo-forgot-password.png`, `rondo-reset-password.png`).
- Alterados: `src/config/projects.ts` (quarto projeto, imagens e legenda), `src/config/technologies.ts` (Rondo no contexto de TypeScript, Node.js e PostgreSQL), `src/config/aiLab.ts` e `src/components/ai-lab/ExperimentTile.tsx` (o card passa a ser `rondo`, com `projectPage`), `src/components/sections/FeaturedProjects.tsx` (duas colunas), `src/components/projects/ProjectFigure.tsx` (tipo da legenda), `src/lib/seo/metadata.ts` (metadados do detalhe) e os dois `common.json`.
- Testes: `e2e/projects.spec.ts`, `home.spec.ts`, `ai-lab.spec.ts`, `i18n.spec.ts`, `seo.spec.ts`, `a11y.spec.ts` e `assets.spec.ts` (quatro projetos, 36 páginas, imagens novas, card com link e o texto sobre o que o Rondo não tem).
- Documentação: README, `PUBLICACAO.md`, `QA.md`, `SEO.md`, `CONTENT.md`, `BUSINESS.md`, `CREDITS.md` e notas nas SPECs 001, 004, 006 e 012.

Verificação: ver o relatório final da entrega (resultados de `pnpm check`, `pnpm typecheck`, `pnpm build` e `pnpm test:e2e`).
