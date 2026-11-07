# SPEC-004 — Projects

## 1. Identificação

| Campo | Valor |
|---|---|
| Nome | Projects |
| Identificador | SPEC-004 |
| Slug | `004-projects` |
| Versão | 0.6.0 |
| Status | In Review (implementada em 2026-11-07; aguardando revisão do usuário e do PR) |
| Data | 2026-11-07 |
| Origem | SPEC-004 de `.specs/FEATURES.md` (v0.1, Draft) |

Prioridades usadas: **Must** (obrigatório para a v1), **Should** (desejável; pode ser adiada sem bloquear a entrega).

## 2. Contexto

A página Projects apresenta projetos pessoais, acadêmicos e conceituais de Bruno. Hoje ela existe apenas como página provisória (título e "em construção"), marcada como `noindex`, e é o destino do CTA "Explore My Work" e do link "Ver projetos" da Home.

**Objetivo:** demonstrar capacidade de planejamento, arquitetura, desenvolvimento e resolução de problemas (`CONTENT.md`, seção 4.4), sempre com o estado real de cada projeto.

**Relação com o produto:** a Home destaca os projetos em cards curtos; Projects reúne todos, e cada projeto desenvolvido o bastante ganha uma página de detalhe com contexto, arquitetura e decisões. Os estudos de caso profissionais (modernização, RabbitMQ) ficam fora desta versão, porque seus resultados ainda não foram validados para publicação (`CONTENT.md`, 6.3).

## 3. Escopo

### 3.1. Dentro do escopo

1. Lista em `/projects` com três projetos: Football Stat Analytics (acadêmico), Reelix (pessoal) e FintaLab (conceitual).
2. Página de detalhe para o Football Stat Analytics e para o Reelix. O FintaLab aparece só na lista, com link para o repositório.
3. Em cada entrada: nome, categoria, estado explícito, descrição curta, tecnologias e links.
4. Em cada detalhe, sete seções: Overview, Challenge, Solution, Architecture (com a implementação), Technical Decisions, Current State e Links.
5. Terceiro destaque na Home: o FintaLab entra ao lado do Football Stat Analytics e do Reelix, com a mesma fonte de dados da lista (atualiza a SPEC-001 para v0.8.0).
6. Imagens capturadas dos próprios projetos: nove telas do app Reelix (home, home de filmes, busca, detalhe de série, avaliações e comentários, watchlist, perfil, estatísticas e entrada) e três telas do protótipo do FintaLab (em cada idioma). O Football Stat Analytics não tem imagens.
7. Metadados da lista e de cada detalhe nos dois idiomas, substituindo o `noindex` provisório.

### 3.2. Fora do escopo

- Estudos de caso profissionais e qualquer resultado de trabalho na empresa (SPEC futura; ver SPEC-003, EXP-RF-13).
- Seção Results e métricas de avaliação (decisão do usuário; os números dos repositórios ficam fora).
- Página de detalhe do FintaLab.
- Filtros, busca e ordenação por categoria (são três projetos).
- Citar o programa de pós-graduação ou a instituição como contexto do Football Stat Analytics (decisão do usuário: só "projeto acadêmico").
- Mensagens de disponibilidade profissional ("Open to Work", "Available for Opportunities", "Hire Me" e equivalentes) e qualquer indício de produto lançado.
- Imagens do Football Stat Analytics; telas do Reelix de minhas listas (dados de teste), minhas avaliações, histórico de acompanhamento, acompanhamento, social, perfil de amigos e notificações; parallax e animação de entrada.
- Header, footer, menu e Language Switcher (SPEC-010, já implementados).

## 4. Requisitos funcionais

| ID | Prioridade | Requisito |
|---|---|---|
| PROJ-RF-01 | Must | A lista tem um `h1`, um parágrafo de abertura e três entradas, nesta ordem: Football Stat Analytics, Reelix e FintaLab. Cada entrada tem um `h2` com o nome. |
| PROJ-RF-02 | Must | Cada entrada da lista mostra categoria, estado, descrição curta, tecnologias e o link "View on GitHub". As entradas do Football e do Reelix têm também o link "View details" para a página de detalhe. |
| PROJ-RF-03 | Must | O FintaLab não tem página de detalhe nem link "View details". Seu único link é o do repositório. |
| PROJ-RF-04 | Must | O estado de cada projeto usa uma das classificações do `DESIGN_SYSTEM.md` (4.6): Football Stat Analytics e Reelix "In development"; FintaLab "Conceptual". Nenhum projeto é apresentado como lançado ou disponível. |
| PROJ-RF-05 | Must | Os detalhes ficam em `/projects/football-stat-analytics` e `/projects/reelix` (pt-BR: `/projetos/football-stat-analytics` e `/projetos/reelix`). Um slug desconhecido responde com página 404. |
| PROJ-RF-06 | Must | A página de detalhe tem: link "Back to projects", categoria, estado, `h1` com o nome, descrição curta, tecnologias, link para o GitHub e sete `h2` na ordem Overview, Challenge, Solution, Architecture, Technical decisions, Current state e Links. Não há seção Results. |
| PROJ-RF-07 | Must | As tecnologias correspondem à implementação real dos repositórios (seção 7.1). Tecnologias apenas propostas, como as do planejamento do FintaLab, não aparecem como tecnologias do projeto. |
| PROJ-RF-08 | Must | Nenhuma página publica resultados de avaliação nem percentuais. O único número de qualidade permitido é a quantidade de testes automatizados do Football Stat Analytics (109), no texto aprovado da arquitetura. |
| PROJ-RF-09 | Must | O Football Stat Analytics é identificado como "Academic project"/"Projeto acadêmico", sem citar curso ou instituição. |
| PROJ-RF-10 | Must | Os links para o GitHub abrem em nova aba, com `rel="noopener noreferrer"` e indicação acessível de nova aba. Repositórios: `brunolucildo/football-stat-analytics-cli`, `brunolucildo/reelix` e `brunolucildo/fintalab`. |
| PROJ-RF-11 | Must | Todo texto visível vem dos arquivos de conteúdo `en` e `pt-BR`, sem condicionais de idioma nos componentes. |
| PROJ-RF-12 | Must | A lista e cada detalhe definem `title`, `description`, canonical, `hreflang` e Open Graph por idioma, são indexáveis e têm a rota equivalente no outro idioma. |
| PROJ-RF-13 | Must | As páginas não contêm as expressões proibidas do `CLAUDE.md` (seção 7), mensagens de disponibilidade profissional nem frases do `CONTENT.md` (seção 9) como "paixão por tecnologia". |
| PROJ-RF-14 | Must | A Home mostra três destaques (Football Stat Analytics, Reelix e FintaLab). Nome, categoria, estado, descrição curta e repositório vêm da mesma fonte da lista, e os textos coincidem nas duas páginas. |
| PROJ-RF-15 | Must | As imagens da seção 7.6 aparecem na lista (capa do Reelix, que é a home do app; três telas do FintaLab no idioma ativo) e no detalhe do Reelix (as nove telas, em uma fileira rolável), cada uma com texto alternativo e legenda no idioma da página. O Football Stat Analytics não tem imagem e a página não reserva espaço para ela. |
| PROJ-RF-16 | Must | As imagens das telas do Reelix não mostram e-mails, nomes de terceiros nem dados de amigos. A home do Reelix mostra pôsteres de séries obtidos do TMDB, aprovada pelo usuário, e a legenda do Reelix credita o TMDB. As imagens do FintaLab mostram só dados fictícios do próprio protótipo. |

## 5. Requisitos não funcionais

| ID | Categoria | Requisito |
|---|---|---|
| PROJ-RNF-01 | Renderização | A lista e os detalhes são gerados estaticamente, sem Client Components, com o conteúdo no HTML inicial. |
| PROJ-RNF-02 | Desempenho | LCP até 2,5 s e CLS até 0,1 em build de produção. Cada imagem declara largura e altura, tem até 250 KB e é servida pelo otimizador de imagens do Next.js; as que ficam abaixo da primeira dobra carregam sob demanda. |
| PROJ-RNF-03 | Acessibilidade | WCAG 2.2 AA: contraste, foco visível, hierarquia de títulos sem saltos, alvos de toque de pelo menos 44 px nos links e anúncio de links externos. |
| PROJ-RNF-04 | Responsividade | Sem rolagem horizontal em 360, 390, 768, 1366, 1440 e 1920 px, nos dois idiomas. |
| PROJ-RNF-05 | Leitura | Texto corrido com no máximo 80 caracteres por linha em desktop, como em About e Experience. |
| PROJ-RNF-06 | Consistência | Estado, categoria e descrição de cada projeto são os mesmos na Home, na lista e no detalhe, e nenhum afirma mais do que os repositórios sustentam. |
| PROJ-RNF-07 | Tipos e qualidade | TypeScript strict; `pnpm check`, `pnpm typecheck` e `pnpm build` sem erros; paridade de chaves entre `en` e `pt-BR`; testes E2E em `e2e/projects.spec.ts` e ajuste de `e2e/home.spec.ts`. |

## 6. Interface e experiência

### 6.1. Composição

Layout editorial, sem cards na lista de Projects; os cards seguem apenas na Home.

| Largura | Lista | Detalhe |
|---|---|---|
| ≥1024 px | Cada entrada em duas colunas: nome, categoria e estado na coluna estreita; descrição, tecnologias e links na coluna larga, separadas por filete. | Cada seção em duas colunas: `h2` na coluna estreita e texto na larga, com largura de leitura limitada. |
| <1024 px | Coluna única: nome, rótulos, descrição, tecnologias e links. | Coluna única: `h2` acima do texto. |

- O estado usa `Badge`; a categoria é texto secundário. O estado "Conceptual" não usa o verde-limão de destaque.
- Tecnologias em uma linha de texto discreta, como em Experience, sem níveis de proficiência.
- A seção Technical decisions é uma lista curta, cada item com uma frase de decisão em destaque e a razão.
- Na Home, o terceiro card segue o `Card` já usado, em coluna única abaixo de 1024 px e três colunas a partir de 1024 px.
- Imagens: na lista, a capa do Reelix (a home do app, em formato de celular) fica na coluna larga, acima da descrição; o FintaLab mostra suas três telas em fileira, que quebra em coluna abaixo de 768 px. No detalhe do Reelix, as nove telas ficam em uma única fileira rolável na horizontal, abaixo do cabeçalho, com encaixe a cada tela e foco por teclado; a fileira tem o rótulo acessível "Screens"/"Telas". Toda imagem tem legenda visível (seção 7.6) e cantos discretos, sem moldura de aparelho.
- Sem animação de entrada, sem parallax e sem hover decorativo.

### 6.2. Estados

| Situação | Comportamento esperado |
|---|---|
| Slug desconhecido | Página 404 do site, no idioma da rota. |
| Projeto sem imagem (Football) | Nenhum espaço reservado (PROJ-RF-15). |
| Texto mais longo em pt-BR | Quebra de linha dentro da coluna, sem rolagem horizontal. |
| Navegação por teclado | Na lista: skip link, header, "View details" e "View on GitHub" de cada entrada, footer. Foco visível. |
| `prefers-reduced-motion` | Sem efeito: as páginas não têm movimento. |
| JavaScript desabilitado | Páginas inteiras legíveis e links funcionais. |

Não há estado de carregamento, vazio ou erro de dados: o conteúdo é estático.

## 7. Conteúdo e dados

Origem: os READMEs, `PROJECT_STATUS.md` e `docs/architecture.md` do Reelix, o README do Football Stat Analytics e o README e `planning/` do FintaLab (repositórios públicos, lidos em 2026-11-07), mais `CONTENT.md` (4.4 e 6) e as respostas do usuário. Os textos abaixo usam apenas fatos desses documentos e foram **aprovados pelo usuário em 2026-11-07** (Q1).

### 7.1. Dados por projeto

| Campo | Football Stat Analytics | Reelix | FintaLab |
|---|---|---|---|
| Slug | `football-stat-analytics` | `reelix` | sem página de detalhe |
| Repositório | `brunolucildo/football-stat-analytics-cli` | `brunolucildo/reelix` | `brunolucildo/fintalab` |
| Categoria (`en` / `pt-BR`) | Academic project / Projeto acadêmico | Personal project / Projeto pessoal | Product concept / Conceito de produto |
| Estado (`en` / `pt-BR`) | In development / Em desenvolvimento | In development / Em desenvolvimento | Conceptual / Conceitual |
| Tecnologias | TypeScript, Node.js, OpenAI API, SQLite, RAG | React Native, Expo, TypeScript, ASP.NET Core (.NET 10), PostgreSQL, Entity Framework Core, Supabase Auth, TMDB | TypeScript, OpenAI API, SQLite (chatbot experimental existente) |

As tecnologias do FintaLab são as do código que existe hoje (um chatbot de terminal e o wireframe estático). A arquitetura que o repositório propõe (Next.js, Supabase) é planejamento, não implementação, e não entra na lista.

### 7.2. Textos da página e das entradas

| Elemento | Inglês (`en`) | Português (`pt-BR`) |
|---|---|---|
| `h1` da lista | Projects | Projetos |
| Abertura | Academic, personal and conceptual projects, each with its current state and a link to its public repository. | Projetos acadêmicos, pessoais e conceituais, cada um com seu estado atual e um link para o repositório público. |
| Rótulos | View details; View on GitHub; Back to projects; Technologies | Ver detalhes; Ver no GitHub; Voltar para projetos; Tecnologias |
| Football: descrição curta | Analysis of football athlete performance using AI, conversational interaction and information retrieval. | Análise de desempenho de atletas de futebol com IA, interação conversacional e recuperação de informações. |
| Reelix: descrição curta | An app to discover and track movies and series, record what you have watched and share authorized activity with friends. | Aplicativo para descobrir e acompanhar filmes e séries, registrar o que você assistiu e compartilhar atividades autorizadas com amigos. |
| FintaLab: descrição curta | A planned platform that turns match observations into evidence-grounded performance feedback for players, agencies and clubs. It is at the planning stage: the repository holds product planning, a static wireframe and an experimental chatbot, and FintaLab is a working name. | Uma plataforma planejada que transforma observações de partidas em retorno de desempenho fundamentado em evidências para jogadores, agências e clubes. Está em fase de planejamento: o repositório reúne o planejamento do produto, um wireframe estático e um chatbot experimental, e FintaLab é um nome de trabalho. |
| Title (SEO, lista) | Projects \| Bruno Lucildo | Projetos \| Bruno Lucildo |
| Description (SEO, lista) | Academic, personal and conceptual projects by Bruno Lucildo, each with its current state: AI-assisted football analysis, a movie and series tracking app and a performance-feedback product concept. | Projetos acadêmicos, pessoais e conceituais de Bruno Lucildo, cada um com seu estado atual: análise de futebol com IA, um aplicativo de acompanhamento de filmes e séries e um conceito de produto de retorno de desempenho. |

### 7.3. Football Stat Analytics (detalhe)

| Seção | Inglês (`en`) | Português (`pt-BR`) |
|---|---|---|
| Overview | Football Stat Analytics is a command-line application that analyzes football athlete performance with AI. It indexes scouting reports, answers questions grounded in those reports and offers an interactive chat with analyst personas. It is an academic project. | O Football Stat Analytics é uma aplicação de linha de comando que analisa o desempenho de atletas de futebol com IA. Ela indexa relatórios de observação, responde perguntas fundamentadas nesses relatórios e oferece um chat interativo com personas de analista. É um projeto acadêmico. |
| Challenge | Language models readily produce statements that sound right but have no support: invented numbers, actions the data never mentioned and flattering adjectives. In sports analysis that is worse than no answer. The challenge was to keep every answer tied to the evidence the user supplies or to the reports that were indexed. | Modelos de linguagem produzem com facilidade afirmações que parecem corretas, mas não têm suporte: números inventados, ações que os dados nunca citaram e adjetivos elogiosos. Na análise esportiva isso é pior do que não responder. O desafio foi manter cada resposta ligada à evidência fornecida pelo usuário ou aos relatórios indexados. |
| Solution | Answers pass through layers of checking. Deterministic rules enforce the output format and reject unsupported numbers and wording. A semantic verifier, a second model that must quote the evidence, judges each statement. A failed answer gets one automatic correction attempt, and answers based on reports end with a grounding report showing what could be traced back to the retrieved excerpts. | As respostas passam por camadas de verificação. Regras determinísticas impõem o formato de saída e rejeitam números e termos sem suporte. Um verificador semântico, um segundo modelo que precisa citar a evidência, avalia cada afirmação. Uma resposta reprovada recebe uma tentativa automática de correção, e as respostas baseadas em relatórios terminam com um relatório de fundamentação que mostra o que pôde ser rastreado até os trechos recuperados. |
| Architecture | The application is written in TypeScript on Node.js, using native type stripping and the built-in SQLite module. Ingestion extracts text from PDF reports, translates it, splits it into chunks, generates embeddings with the OpenAI API and stores them in SQLite. Retrieval ranks chunks by a hybrid score that combines embedding similarity and keyword overlap, and sends the five best to the answer prompt. The chat keeps its session history in SQLite and summarizes older messages when the context grows. The code separates AI behavior (personas, policies, validation and verification) from storage and retrieval, and 109 automated tests cover it with stubbed model calls, so they run without an API key. | A aplicação é escrita em TypeScript sobre Node.js, com remoção nativa de tipos e o módulo SQLite embutido. A ingestão extrai o texto de relatórios em PDF, traduz, divide em trechos, gera embeddings com a API da OpenAI e grava tudo no SQLite. A recuperação ordena os trechos por uma pontuação híbrida, que combina similaridade de embeddings e coincidência de palavras-chave, e envia os cinco melhores ao prompt da resposta. O chat guarda o histórico da sessão no SQLite e resume as mensagens mais antigas quando o contexto cresce. O código separa o comportamento de IA (personas, políticas, validação e verificação) do armazenamento e da recuperação, e 109 testes automatizados o cobrem com chamadas de modelo simuladas, então rodam sem chave de API. |
| Technical decisions (1) | Rules in code, not only in prompts. Prompt instructions alone cannot guarantee that the model follows a policy, so the most important rules are checked by code. | Regras no código, não só nos prompts. Instruções de prompt sozinhas não garantem que o modelo siga uma política, então as regras mais importantes são verificadas pelo código. |
| Technical decisions (2) | A judge that is not trusted blindly. The verifier must quote the evidence, and a quote that is not in the evidence is rejected. If the verifier itself fails, the chat keeps working and shows a warning. | Um juiz em quem não se confia às cegas. O verificador precisa citar a evidência, e uma citação que não está na evidência é rejeitada. Se o próprio verificador falhar, o chat continua funcionando e mostra um aviso. |
| Technical decisions (3) | Optional consensus, off by default. Answering with the median of three samples costs three times the generation and did not make the scores reliably stable, so it is available but disabled. | Consenso opcional, desligado por padrão. Responder com a mediana de três amostras custa três vezes a geração e não tornou as notas estáveis de forma confiável, então está disponível, mas desativado. |
| Technical decisions (4) | Simple local storage. Conversation history and embeddings live in SQLite files, which keeps the project easy to run and inspect. | Armazenamento local simples. O histórico de conversas e os embeddings ficam em arquivos SQLite, o que torna o projeto fácil de executar e inspecionar. |
| Current state | In development. The project describes itself as experimental: answers are not checked against official statistics, PDF ingestion does not run OCR, and the checks are safeguards that do not replace human review. A known limitation is retrieval: the index has no athlete metadata to filter on, so a question about one athlete can retrieve excerpts about others. | Em desenvolvimento. O projeto se descreve como experimental: as respostas não são conferidas com estatísticas oficiais, a ingestão de PDF não faz OCR, e as verificações são salvaguardas que não substituem a revisão humana. Uma limitação conhecida é a recuperação: o índice não tem metadados de atleta para filtrar, então uma pergunta sobre um atleta pode recuperar trechos sobre outros. |
| Links | View on GitHub | Ver no GitHub |
| Title (SEO) | Football Stat Analytics \| Bruno Lucildo | Football Stat Analytics \| Bruno Lucildo |
| Description (SEO) | An academic project that analyzes football athlete performance with AI, retrieval and layered answer verification: architecture, technical decisions and current state. | Um projeto acadêmico que analisa o desempenho de atletas de futebol com IA, recuperação de informações e verificação de respostas em camadas: arquitetura, decisões técnicas e estado atual. |

### 7.4. Reelix (detalhe)

| Seção | Inglês (`en`) | Português (`pt-BR`) |
|---|---|---|
| Overview | Reelix is an app to discover and track movies and series, record what you have watched and share authorized activity with friends. The repository holds a React Native mobile app and an ASP.NET Core API. It is a personal project. | O Reelix é um aplicativo para descobrir e acompanhar filmes e séries, registrar o que você assistiu e compartilhar atividades autorizadas com amigos. O repositório reúne um app mobile em React Native e uma API em ASP.NET Core. É um projeto pessoal. |
| Challenge | A viewing diary is personal data. Sharing it with friends only works if each person controls what is shared, and comments and ratings must not spoil a plot for someone who has not watched yet. The challenge was to build social features on top of that, with privacy and spoiler control as rules of the product rather than afterthoughts. | Um diário do que se assiste é dado pessoal. Compartilhá-lo com amigos só funciona se cada pessoa controla o que é compartilhado, e comentários e avaliações não podem estragar um enredo para quem ainda não assistiu. O desafio foi construir os recursos sociais sobre isso, com privacidade e controle de spoilers como regras do produto, e não como remendos. |
| Solution | Sharing is opt-in and split into separate consents for history, ratings and favorites. Comments are private by default, can be flagged as spoilers and stay hidden until the reader chooses to reveal them. Progress tracking, lists, achievements and a monthly ranking among friends are built on the same rules. | O compartilhamento é opcional e dividido em consentimentos separados para histórico, avaliações e favoritos. Comentários são privados por padrão, podem ser sinalizados como spoiler e ficam ocultos até o leitor escolher revelá-los. O acompanhamento de progresso, as listas, as conquistas e um ranking mensal entre amigos seguem as mesmas regras. |
| Architecture | The API is a modular monolith in ASP.NET Core (.NET 10), organized in Domain, Application, Infrastructure and Api projects so that business rules do not depend on frameworks or the database. Data lives in PostgreSQL through Entity Framework Core. Supabase Auth handles sign-in, and the API validates its tokens and maps them to the internal account. Movie and series metadata comes from TMDB, behind an adapter, with provider credentials kept on the server. The mobile app uses React Native with Expo, strict TypeScript, Expo Router and TanStack Query. A GitHub Actions workflow runs the backend tests, the mobile lint and type checks, dependency audits and secret scanning. | A API é um monólito modular em ASP.NET Core (.NET 10), organizado nos projetos Domain, Application, Infrastructure e Api para que as regras de negócio não dependam de frameworks nem do banco. Os dados ficam no PostgreSQL, via Entity Framework Core. O Supabase Auth cuida do login, e a API valida seus tokens e os associa à conta interna. Os metadados de filmes e séries vêm do TMDB, por trás de um adaptador, com as credenciais do provedor mantidas no servidor. O app mobile usa React Native com Expo, TypeScript estrito, Expo Router e TanStack Query. Um workflow do GitHub Actions executa os testes do backend, as verificações de lint e tipos do mobile, auditorias de dependências e a busca por segredos. |
| Technical decisions (1) | A modular monolith before microservices. The design stays simple until real usage justifies more infrastructure. | Um monólito modular antes de microsserviços. O desenho se mantém simples até o uso real justificar mais infraestrutura. |
| Technical decisions (2) | One identity system. Supabase Auth is the only provider, and a second system such as ASP.NET Identity was deliberately not added. | Um único sistema de identidade. O Supabase Auth é o único provedor, e um segundo sistema, como o ASP.NET Identity, foi deliberadamente deixado de fora. |
| Technical decisions (3) | Providers behind an adapter. The catalog integration can be replaced without touching business rules, and provider keys never reach the app. | Provedores por trás de um adaptador. A integração com o catálogo pode ser trocada sem mexer nas regras de negócio, e as chaves dos provedores nunca chegam ao app. |
| Technical decisions (4) | AI kept off until decided. An automatic spoiler classifier exists on the server but is disabled by default while cost and data policy are decided; manual spoiler flagging works without it. | IA desligada até haver decisão. Existe no servidor um classificador automático de spoilers, desativado por padrão enquanto custo e política de dados são definidos; a sinalização manual de spoilers funciona sem ele. |
| Current state | In development. The code covers accounts, onboarding, discovery, tracking, lists, ratings and comments, friends, notifications and achievements, but the repository itself states that this describes the implementation and does not confirm a production deployment. Remote push notifications are disabled, the Android widget is not implemented and the mobile app has no automated tests yet. | Em desenvolvimento. O código cobre contas, onboarding, descoberta, acompanhamento, listas, avaliações e comentários, amigos, notificações e conquistas, mas o próprio repositório afirma que isso descreve a implementação e não confirma uma implantação em produção. As notificações push remotas estão desativadas, o widget Android não foi implementado e o app mobile ainda não tem testes automatizados. |
| Links | View on GitHub | Ver no GitHub |
| Title (SEO) | Reelix \| Bruno Lucildo | Reelix \| Bruno Lucildo |
| Description (SEO) | A personal movie and series tracking app with privacy-first sharing and spoiler control: architecture, technical decisions and current state. | Um aplicativo pessoal de acompanhamento de filmes e séries, com compartilhamento que prioriza a privacidade e controle de spoilers: arquitetura, decisões técnicas e estado atual. |

### 7.5. Rastreabilidade

| Afirmação | Fonte |
|---|---|
| Football: CLI, RAG, personas, chat interativo, SQLite, embeddings, tradução, pontuação híbrida e cinco trechos, resumo de contexto | README do repositório (seções de funcionalidades, ingestão, "Metrics" e estrutura) |
| Football: camadas de verificação, juiz com citação obrigatória, uma tentativa de correção, relatório de fundamentação, consenso opcional desligado | README ("Output validation", "Semantic verification", "Consistency experiment") |
| Football: 109 testes sem chave de API; experimental; sem OCR; limitação da recuperação | README ("Usage", aviso inicial, "Held-out cases") e `CONTENT.md` 6.1 |
| Football: estado "Em desenvolvimento" e categoria "projeto acadêmico" | Decisão do usuário (2026-11-07) |
| Reelix: stack, camadas, Supabase Auth, TMDB atrás de adaptador, CI | `PROJECT_STATUS.md` e `docs/architecture.md` (04/11/2026 e 03/11/2026) |
| Reelix: consentimentos separados, comentários privados, spoilers, ranking mensal | README do repositório (funcionalidades) |
| Reelix: classificador de spoilers desativado; push desligado; widget pendente; sem testes mobile; sem confirmação de produção | `PROJECT_STATUS.md` e README |
| FintaLab: nome de trabalho, planejamento, wireframe estático, chatbot experimental, sem aplicação | README e `planning/PRODUCT_BRIEF.md` do repositório |
| FintaLab: categoria "conceito de produto" e estado "Conceitual" | Premissa deste refinamento, a confirmar (Q2) |

### 7.6. Imagens

Origem: capturas feitas em 2026-11-07 dos próprios projetos. As do Reelix vêm do app web em modo de desenvolvimento, em viewport de celular (430 px de largura, escala 2), com a conta de desenvolvimento do usuário, e foram revisadas para excluir e-mails e dados de terceiros. As do FintaLab vêm do protótipo estático (`planning/wireframes/index.html`), em 1440×900 (escala 1,5), nos dois idiomas que o protótipo oferece. Ficam em `public/images/projects/`, versionadas, e os textos alternativos e as legendas abaixo foram **aprovados pelo usuário em 2026-11-07** (Q4), com uma adição minha à legenda do Reelix (crédito ao TMDB).

| Arquivo | Dimensões | Onde aparece |
|---|---|---|
| `reelix-home.jpg` | 830×1800 | Capa do Reelix na lista; detalhe do Reelix (primeira tela) |
| `reelix-movies.jpg` | 860×1800 | Detalhe do Reelix (segunda tela) |
| `reelix-search.jpg` | 860×1800 | Detalhe do Reelix (terceira tela) |
| `reelix-title.jpg` | 860×1800 | Detalhe do Reelix (quarta tela) |
| `reelix-reviews.png` | 860×1800 | Detalhe do Reelix (quinta tela) |
| `reelix-watchlist.jpg` | 860×1800 | Detalhe do Reelix (sexta tela) |
| `reelix-profile.png` | 860×1340 | Detalhe do Reelix (sétima tela) |
| `reelix-stats.png` | 830×1800 | Detalhe do Reelix (oitava tela) |
| `reelix-login.png` | 860×1800 | Detalhe do Reelix (nona tela) |
| `fintalab-landing.<idioma>.png` | 2160×1350 | Lista (FintaLab), primeira tela |
| `fintalab-evaluation.<idioma>.png` | 2160×1350 | Lista (FintaLab), segunda tela |
| `fintalab-roster.<idioma>.png` | 2160×1350 | Lista (FintaLab), terceira tela |

`<idioma>` é `en` ou `pt-BR`. A interface do Reelix está em português, e as imagens são as mesmas nos dois idiomas; o texto alternativo e a legenda dizem isso na versão em inglês.

| Imagem | Texto alternativo (`en`) | Texto alternativo (`pt-BR`) |
|---|---|---|
| `reelix-home` | Reelix home screen on a phone: the Series tab with "Continue watching" and "Start watching" rows of series posters and the start of the release calendar. The app interface is in Portuguese. | Tela inicial do Reelix no celular: a aba Séries com as fileiras "Continuar Assistindo" e "Começar a Assistir", com pôsteres de séries, e o início do calendário de estreias. |
| `reelixMovies` | Reelix home screen on a phone, Movies tab: a "Quero assistir" row with one movie poster, a row of featured movies and the start of the favorites row. The app interface is in Portuguese. | Tela inicial do Reelix no celular, aba Filmes: a fileira "Quero assistir" com um pôster de filme, a fileira de filmes em destaque e o início dos favoritos. |
| `reelixSearch` | Reelix catalog search on a phone: the Movies and Series tabs, a search field with "Interestelar" and two results with poster and year. The app interface is in Portuguese. | Pesquisa no catálogo do Reelix no celular: as abas Filmes e Séries, o campo de busca com "Interestelar" e dois resultados com pôster e ano. |
| `reelixTitle` | Reelix title screen for the series Breaking Bad on a phone: a backdrop image, the release date, action buttons, the synopsis and the seasons and episodes tabs with watched progress. The app interface is in Portuguese. | Tela de título do Reelix no celular, para a série Breaking Bad: uma imagem de fundo, a data de lançamento, botões de ação, a sinopse e as abas de temporadas e episódios com o progresso assistido. |
| `reelixReviews` | Reelix reviews and comments section on a phone: a half-star rating control with a private or public choice, and a comment box with a spoiler checkbox and a visibility choice. The app interface is in Portuguese. | Seção de avaliações e comentários do Reelix no celular: o controle de nota em meia estrela com a escolha entre privado e público, e a caixa de comentário com a opção de marcar como spoiler e a escolha de visibilidade. |
| `reelixWatchlist` | Reelix watchlist screen on a phone: tabs for favorites, watchlist and my lists, a catalog search field, a sort option and two titles with poster, type, year and genre. The app interface is in Portuguese. | Tela de watchlist do Reelix no celular: abas de favoritos, watchlist e minhas listas, campo de busca no catálogo, opção de ordenação e dois títulos com pôster, tipo, ano e gênero. |
| `reelixProfile` | Reelix profile screen on a phone: avatar choices (initials and illustrated characters) and a row of achievement badges with a link to progress and statistics. The app interface is in Portuguese. | Tela de perfil do Reelix no celular: opções de avatar (iniciais e personagens ilustrados) e uma fileira de medalhas de conquistas com um link para progresso e estatísticas. |
| `reelix-login` | Reelix sign-in screen on a phone: the reelix logo, the headline "Suas histórias começam aqui." and e-mail and password fields. The app interface is in Portuguese. | Tela de entrada do Reelix no celular: o logotipo do reelix, o título "Suas histórias começam aqui." e os campos de e-mail e senha. |
| `reelix-stats` | Reelix achievements and statistics screen on a phone: totals of episodes, series, movies and records, estimated viewing time and the current month's activity. The app interface is in Portuguese. | Tela de conquistas e estatísticas do Reelix no celular: totais de episódios, séries, filmes e registros, tempo estimado de exibição e a atividade do mês. |
| `fintalab-landing` | FintaLab concept prototype, home screen: the headline "Every match can take you further." next to a football pitch illustration, with a notice that people, clubs and numbers are fictional. | Protótipo conceitual do FintaLab, tela inicial: o título "Cada partida pode levar você mais longe." ao lado de uma ilustração de campo de futebol, com o aviso de que pessoas, clubes e números são fictícios. |
| `fintalab-evaluation` | FintaLab concept prototype, evaluation screen: a pixel-art player card with fictional scores and a note that the values are invented and were not generated by the engine. | Protótipo conceitual do FintaLab, tela de avaliação: uma carta de jogador em pixel art com notas fictícias e um aviso de que os valores são inventados e não foram gerados pelo motor. |
| `fintalab-roster` | FintaLab concept prototype, player roster screen: a table of four fictional players with position, nationality, relationship status and latest evaluation. | Protótipo conceitual do FintaLab, tela de elenco: uma tabela com quatro jogadores fictícios, com posição, nacionalidade, vínculo e última avaliação. |

| Legenda | Inglês (`en`) | Português (`pt-BR`) |
|---|---|---|
| Reelix | Screens from the development build. The app interface is in Portuguese. Movie and series data and images from TMDB; this product is not endorsed or certified by TMDB. | Telas da versão de desenvolvimento. A interface do app está em português. Dados e imagens de filmes e séries do TMDB; este produto não é endossado nem certificado pelo TMDB. |
| FintaLab | Screens from the static concept prototype. All people, clubs and numbers are fictional. | Telas do protótipo conceitual estático. Todas as pessoas, clubes e números são fictícios. |

A home do Reelix mostra o que o usuário está assistindo e pôsteres de séries do TMDB (artes dos estúdios, e um deles traz o rosto de uma pessoa real). O usuário aprovou o uso em 2026-11-07 (Q5); a legenda credita o TMDB.

Em 2026-11-07, a pedido do usuário, as telas do Reelix passaram de três para nove. As seis novas (home de filmes, busca, detalhe de série, avaliações e comentários, watchlist e topo do perfil) foram capturadas sem janela visível, com a mesma conta de desenvolvimento, e revisadas: mostram pôsteres e imagens de fundo do TMDB, como a home, e nenhum e-mail nem dado de amigos. O detalhe de série traz a imagem de fundo de uma série com atores reais. A tela de avaliações e comentários mostra os controles de privacidade e de spoiler.

Capturas deixadas de fora de propósito: minhas listas (traz uma lista de teste com texto sem sentido); minhas avaliações (quase vazia); histórico de acompanhamento (lista o que o usuário assistiu, com data e hora); acompanhamento (exibe a barra de voltar e início duplicada); e social, perfil de amigos e notificações (dados de terceiros). O topo do perfil foi recortado para excluir o nome de exibição e a biografia de teste.

## 8. Critérios de aceitação

| ID | Cobre | Critério (Given / When / Then) |
|---|---|---|
| PROJ-CA-01 | RF-01 | **Given** `/en/projects` **When** a página carrega **Then** há um único `h1`, o parágrafo de abertura e três `h2` na ordem Football Stat Analytics, Reelix e FintaLab. O mesmo vale para `/pt-BR/projetos`. |
| PROJ-CA-02 | RF-02, RF-03 | **Given** a lista **When** renderizada **Then** cada entrada mostra categoria, estado, descrição curta, tecnologias e "View on GitHub"; Football e Reelix têm "View details"; o FintaLab não tem. |
| PROJ-CA-03 | RF-04 | **Given** a lista, os detalhes e os destaques da Home **Then** os estados são "In development", "In development" e "Conceptual" (pt-BR: "Em desenvolvimento" e "Conceitual") e não há "launched", "available" ou equivalentes. |
| PROJ-CA-04 | RF-05 | **Given** `/en/projects/football-stat-analytics`, `/en/projects/reelix` e as rotas `/pt-BR/projetos/...` **Then** respondem 200; **Given** `/en/projects/inexistente` **Then** responde 404. |
| PROJ-CA-05 | RF-06 | **Given** cada detalhe **Then** há um único `h1` e sete `h2` na ordem Overview, Challenge, Solution, Architecture, Technical decisions, Current state e Links (pt-BR: Visão geral, Desafio, Solução, Arquitetura, Decisões técnicas, Estado atual e Links); não há `h2` "Results"/"Resultados". |
| PROJ-CA-06 | RF-07 | **Given** as tecnologias de cada projeto **Then** coincidem com a seção 7.1; nenhuma página lista Next.js ou Supabase como tecnologia do FintaLab. |
| PROJ-CA-07 | RF-08 | **Given** o texto das páginas **When** buscado por "%" **Then** não há ocorrências; o único número de qualidade é "109", no detalhe do Football. |
| PROJ-CA-08 | RF-09 | **Given** o conteúdo do Football Stat Analytics **When** buscado por "Coders" e "University" **Then** não há ocorrências, e a categoria é "Academic project"/"Projeto acadêmico". |
| PROJ-CA-09 | RF-10 | **Given** os links "View on GitHub" **When** inspecionados **Then** apontam para os três repositórios da seção 7.1, abrem em nova aba, têm `rel` com `noopener` e indicação acessível de nova aba. |
| PROJ-CA-10 | RF-11 | **Given** as páginas nos dois idiomas **Then** não há texto visível fora dos arquivos de conteúdo e nenhuma frase aparece em idioma diferente do da página (exceto nomes próprios e termos técnicos). |
| PROJ-CA-11 | RF-12 | **Given** o HTML da lista e dos detalhes **Then** cada um tem `title`, `description`, canonical, `hreflang` para as duas versões (com os caminhos `/projects/<slug>` e `/projetos/<slug>`) e Open Graph próprios, `<html lang>` correto e nenhuma meta `robots` com `noindex`. |
| PROJ-CA-12 | RF-13 | **Given** o conteúdo e os metadados dos dois idiomas **When** buscados por "Open to Work", "Available for Opportunities", "Available for Hire", "Looking for a New Job", "Hire Me", "paixão por tecnologia" e "passion for technology" **Then** não há ocorrências. |
| PROJ-CA-13 | RF-14, RNF-06 | **Given** a Home **Then** há três destaques, com o FintaLab em terceiro, e o nome, a categoria, o estado e a descrição de cada um são idênticos aos da lista. |
| PROJ-CA-14 | RF-15 | **Given** a lista **Then** a entrada do Reelix mostra `reelix-home`, a do FintaLab mostra as três telas no idioma ativo e a do Football não tem imagem nem reserva espaço; **Given** o detalhe do Reelix **Then** mostra as nove telas na ordem da seção 7.6 (`reelix-home`, `reelix-movies`, `reelix-search`, `reelix-title`, `reelix-reviews`, `reelix-watchlist`, `reelix-profile`, `reelix-stats` e `reelix-login`), em uma única fileira rolável e focável com o rótulo "Screens"/"Telas"; o detalhe do Football não tem imagem. **Given** cada imagem **Then** tem `alt` e legenda no idioma da página (seção 7.6), largura e altura declaradas e arquivo de até 250 KB, e as que ficam abaixo da primeira dobra carregam sob demanda. |
| PROJ-CA-19 | RF-16 | **Given** as imagens de `public/images/projects/` **When** revisadas visualmente **Then** as do Reelix não mostram e-mails, nomes de terceiros nem dados de amigos, e as do FintaLab mostram só dados fictícios; **Given** a legenda do Reelix **Then** credita o TMDB. |
| PROJ-CA-15 | RNF-01, RNF-02 | **Given** o HTML das páginas **Then** o conteúdo está no HTML inicial, não há Client Components nem classes de animação, e as páginas funcionam sem JavaScript. |
| PROJ-CA-16 | RNF-03 | **Given** navegação apenas por teclado **When** o usuário percorre a lista **Then** a ordem é skip link, header, links de cada entrada na ordem visual e footer, com foco visível; a árvore de acessibilidade não pula níveis de título. |
| PROJ-CA-17 | RNF-04, RNF-05 | **Given** as larguras 360, 390, 768, 1366, 1440 e 1920 px **Then** `scrollWidth` não excede `innerWidth`, em ambos os idiomas; **Given** largura ≥1024 px **Then** nenhuma linha de texto corrido passa de 80 caracteres. |
| PROJ-CA-18 | RNF-07 | **Given** o código das páginas **Then** `pnpm check`, `pnpm typecheck` e `pnpm build` terminam sem erros e `pnpm test:e2e` passa, incluindo `e2e/projects.spec.ts` e o `e2e/home.spec.ts` atualizado. |

## 9. Dependências

| Dependência | Situação | Impacto |
|---|---|---|
| SPEC-010 Global Layout | Implementada | Header, footer, skip link e `main`. |
| SPEC-008 Internationalization | Implementada na base | Rotas localizadas e conteúdo `en`/`pt-BR`; exige rota dinâmica localizada (`/projects/[slug]` e `/projetos/[slug]`). |
| SPEC-001 Home | Implementada (v0.7.0) | Passa a v0.8.0: terceiro destaque, `HOME-RF-04`, `HOME-CA-04`, `HOME-CA-17` e testes de `e2e/home.spec.ts`. |
| SPEC-002 About e SPEC-003 Experience | Implementadas | Sem dependência direta; mantêm o mesmo padrão editorial e de testes. |
| SPEC-011 Fotografia e ativos visuais | Pendente | Trata dos ativos visuais do site; as imagens desta SPEC são capturas dos próprios projetos e já estão em `public/images/projects/`. |
| Revisão dos bancos `.db` do repositório do Football | Em aberto (a cargo do usuário) | O link do projeto aparece na Home e aqui; a revisão decide se o repositório pode seguir público. |

## 10. Riscos

| Risco | Mitigação |
|---|---|
| Projeto apresentado como mais pronto do que é (Reelix, FintaLab) | Estado explícito, textos de "Current state" com as limitações do próprio repositório e PROJ-CA-03. |
| Resultados ou números de avaliação publicados sem validação | Sem seção Results, sem percentuais (PROJ-RF-08); só "109 testes". |
| O repositório do Football versiona bancos `.db` com trechos indexados de relatórios | Revisão a cargo do usuário; o link permanece até essa decisão. |
| Tecnologia proposta apresentada como implementada (FintaLab) | A lista usa só o código existente (PROJ-RF-07). |
| O nome do FintaLab é provisório e pode mudar | A descrição diz "working name"; o nome fica em uma única fonte de dados. |
| Texto do detalhe virar cópia do README | Texto próprio, em português e inglês, só com fatos documentados; aprovação do usuário (Q1). |
| Contexto acadêmico atribuído a um curso sem confirmação | Só "projeto acadêmico" (PROJ-RF-09). |
| Divergência entre Home, lista e detalhe | Fonte única de dados e PROJ-CA-13. |
| As seis telas novas do Reelix serem publicadas sem a aprovação específica do usuário | Foram escolhidas e revisadas pelo agente a partir do pedido de "mais imagens"; aprovação pendente (Q6); retirar uma tela é só tirá-la de `src/config/projects.ts`. |
| Captura do app mostrar dado pessoal ou de terceiros | Revisão visual de cada imagem (PROJ-CA-19) e telas sociais, de perfil e de notificações fora da v1. |
| A home do Reelix traz pôsteres de séries (arte de estúdio, via TMDB, com o rosto de uma pessoa real num deles) e o que o usuário assiste | Uso aprovado pelo usuário (Q5), crédito ao TMDB na legenda, uma única tela com pôsteres e substituição por uma captura sem pôsteres se algum titular reclamar. |
| Imagens do Reelix ficarem desatualizadas quando o app mudar, e a interface estar em português nas duas versões | Legenda explícita ("versão de desenvolvimento", "interface em português"); atualizar as capturas quando a interface mudar de forma visível. |
| Imagens do FintaLab serem tomadas como produto real | Legenda "protótipo conceitual estático", dados fictícios e os avisos que o próprio protótipo exibe nas telas. |

## 11. Perguntas abertas

| ID | Pergunta | Impacto | Dono | Bloqueia |
|---|---|---|---|---|
| Q1 | Os textos das seções 7.2 a 7.4 (lista, Football e Reelix, em inglês e português) estão aprovados ou precisam de ajustes? Em especial, as frases de desafio e de decisão técnica, que reescrevem a motivação documentada nos repositórios. | Todo o conteúdo das páginas. | Bruno | **Resolvida (2026-11-07):** textos aprovados. |
| Q2 | A categoria "Product concept"/"Conceito de produto" e o estado "Conceptual"/"Conceitual" servem ao FintaLab? | PROJ-RF-04 e a Home. | Bruno | Não bloqueia (reversível). |
| Q3 | A ordem Football, Reelix, FintaLab está correta na lista e na Home? | PROJ-RF-01 e PROJ-RF-14. | Bruno | Não bloqueia (reversível). |
| Q4 | Os textos alternativos e as legendas das imagens (seção 7.6) estão aprovados? A interface do Reelix, em português, aparece nas duas versões do site. | PROJ-RF-15. | Bruno | **Resolvida (2026-11-07):** aprovados. |
| Q6 | As seis telas novas do Reelix (home de filmes, busca, detalhe de série, avaliações e comentários, watchlist e topo do perfil) e seus textos alternativos estão aprovados? O detalhe de série mostra a imagem de fundo de uma série com atores reais, como a home mostra pôsteres. | PROJ-RF-15 e PROJ-RF-16. | Bruno | Não bloqueia: já estão no site, em commit, e podem ser retiradas. |
| Q5 | A home do Reelix (com pôsteres de séries e o que você assiste) pode entrar como imagem? Ela é a tela principal do app, mas mostra arte de estúdio e o rosto de uma pessoa real num pôster. Há captura pronta, fora do repositório. | PROJ-RF-16 e PROJ-CA-19. | Bruno | **Resolvida (2026-11-07):** a home entra (`reelix-home.jpg`), com crédito ao TMDB na legenda. |

## 12. Premissas

Decisões reversíveis adotadas neste refinamento.

1. Os slugs dos detalhes são iguais nos dois idiomas; o caminho usa `projects` em inglês e `projetos` em português.
2. A lista não tem filtros nem busca, porque são três projetos.
3. Nome, categoria, estado, descrição curta, tecnologias, repositório e slug de cada projeto ficam em uma única fonte (a lista, a Home e os detalhes a consomem), como em `src/config/experience.ts`.
4. As imagens ficam versionadas em `public/images/projects/`, como a foto do Hero, com texto alternativo e legenda por idioma. As do FintaLab têm uma versão por idioma, porque o protótipo é bilíngue; as do Reelix são únicas, porque o app só tem interface em português.
5. O estado "Conceptual" e a categoria "Product concept" para o FintaLab seguem o vocabulário do `DESIGN_SYSTEM.md` (4.6) e o README do repositório, que diz que o produto ainda não existe.
6. Nos detalhes, a implementação aparece dentro de Architecture, e Results fica de fora (decisão do usuário).
7. A SPEC passa a viver em `.specs/004-projects.md`, como as SPEC-001 a 003. A seção SPEC-004 de `FEATURES.md` aponta para este arquivo.

## 13. Decisões registradas

| Data | Decisão | Origem |
|---|---|---|
| 2026-11-07 | Lista em `/projects` e duas páginas de detalhe (Football e Reelix). | Resposta do usuário |
| 2026-11-07 | O FintaLab, em fase de planejamento, entra no portfólio, só na lista e com link para o repositório. | Resposta do usuário |
| 2026-11-07 | O FintaLab entra também na Home, como terceiro destaque. | Resposta do usuário |
| 2026-11-07 | Detalhes sem Results; Implementation dentro de Architecture. | Resposta do usuário |
| 2026-11-07 | Imagens: inicialmente a v1 sairia sem imagens; depois o usuário pediu que o app do Reelix e o protótipo do FintaLab fossem capturados e usados. A v1 passa a ter imagens dos dois (Football sem imagem). | Respostas do usuário |
| 2026-11-07 | Capturas feitas com a conta de desenvolvimento do usuário, que entrou sozinho no app; telas sociais, de perfil de amigos, de notificações, listas e detalhe de título ficam fora da v1. | Decisão tomada na captura |
| 2026-11-07 | Textos das seções 7.2 a 7.4, textos alternativos e legendas das imagens aprovados (Q1 e Q4). | Resposta do usuário |
| 2026-11-07 | A home do Reelix, com pôsteres de séries do TMDB, entra como imagem (capa do Reelix e primeira tela do detalhe); a legenda do Reelix credita o TMDB. | Resposta do usuário (Q5); o crédito é adição do agente |
| 2026-11-07 | Mais imagens do Reelix: de três para nove telas, em uma fileira rolável no detalhe; escolha e textos alternativos das seis novas feitos pelo agente, a confirmar (Q6). | Pedido do usuário ("não dá pra adicionar mais imagens do Reelix?") |
| 2026-11-07 | A home do Reelix é guardada em JPEG (196 KB) porque o PNG tinha 613 KB, acima do limite de 250 KB. | Decisão técnica do agente |
| 2026-11-07 | Football Stat Analytics é só "projeto acadêmico", sem citar curso ou instituição. | Resposta do usuário |
| 2026-11-07 | Estudos de caso profissionais ficam fora da v1. | Premissa herdada das SPEC-001 e SPEC-003 |

## 15. Implementação e verificação

Implementada na branch `feat/projects`. Arquivos:

- Novos: `src/config/projects.ts` (fonte única: slug, repositório, tecnologias e imagens), `src/components/projects/` (`ProjectsContent`, `ProjectEntry`, `ProjectDetail`, `ProjectFigure`, `ProjectTechnologies` e `layout.ts`), `src/app/[locale]/projects/[slug]/page.tsx` e `e2e/projects.spec.ts`.
- Alterados: `src/app/[locale]/projects/page.tsx` (substitui a página provisória e passa a ser indexável), `src/i18n/routing.ts` (rota `/projects/[slug]` e `/projetos/[slug]`), `src/config/navigation.ts` (`AppPathname` exclui rotas com parâmetro), `src/lib/seo/metadata.ts` (`AppHref` e metadados dos detalhes), `src/components/layout/LanguageSwitcher.tsx` (mantém o slug ao trocar de idioma), `src/components/sections/FeaturedProjects.tsx` (três destaques, lendo a fonte única), `src/components/sections/PagePlaceholder.tsx`, `e2e/home.spec.ts` e os dois `common.json` (nova seção `projects`; `home.projects.items` e `pages.projects` removidos).

Verificação em 2026-11-07:

| Critério | Resultado | Evidência |
|---|---|---|
| PROJ-CA-01 | Atendido | `e2e/projects.spec.ts`: um `h1` e três `h2` na ordem Football, Reelix, FintaLab, nos dois idiomas. |
| PROJ-CA-02 | Atendido | Categoria, estado, descrição, tecnologias e links por entrada; "View details" só no Football e no Reelix. |
| PROJ-CA-03 | Atendido | Estados da lista, dos detalhes e da Home; sem "launched"/"lançado". |
| PROJ-CA-04 | Atendido | Os quatro detalhes (dois por idioma) respondem 200; `/en/projects/nao-existe`, `/pt-BR/projetos/nao-existe` e `/en/projects/fintalab` respondem 404. |
| PROJ-CA-05 | Atendido | Um `h1` e sete `h2` na ordem prevista; nenhum "Results"/"Resultados". |
| PROJ-CA-06 | Atendido | Tecnologias idênticas à seção 7.1; Next.js e Supabase não aparecem como tecnologias do FintaLab. |
| PROJ-CA-07 | Atendido | Nenhum "%" nas páginas; o Football traz "109 automated tests" como único número de qualidade. Mutação (inserir "80%") derruba o teste. |
| PROJ-CA-08 | Atendido | Sem "Coders" nem "University" nas páginas de projeto. |
| PROJ-CA-09 | Atendido | Links para os três repositórios, em nova aba, com `rel="noopener noreferrer"` e indicação acessível. |
| PROJ-CA-10 | Atendido | Todo texto vem de `t()`; os nomes das tecnologias vêm de `src/config/projects.ts` (nomes próprios). |
| PROJ-CA-11 | Atendido | `title`, `description`, canonical, `hreflang` (`/projects/<slug>` ↔ `/projetos/<slug>`), Open Graph e `<html lang>`, sem `noindex`. O domínio dos links ainda é `localhost` até definir `NEXT_PUBLIC_SITE_URL`. |
| PROJ-CA-12 | Atendido | Sem expressões proibidas nem frases de busca de emprego, no texto e no título. |
| PROJ-CA-13 | Atendido | Home com três destaques; nome, categoria, estado e descrição idênticos aos da lista. Mutação (trocar o estado do FintaLab) derruba o teste. |
| PROJ-CA-14 | Atendido | Imagens da lista, do detalhe, textos alternativos (comparados um a um nos dois idiomas) e legendas conferidos; Football sem imagem; arquivos de até 250 KB. As três telas do FintaLab ficam lado a lado a partir de 768 px e empilhadas abaixo; as nove do Reelix ficam em uma fileira rolável e focável, medido no E2E. |
| PROJ-CA-15 | Atendido | Páginas estáticas, sem Client Components nas páginas de projeto e sem classes de animação. O seletor de idioma, já cliente, passou a usar `useParams`. |
| PROJ-CA-16 | Atendido | O teclado percorre skip link, header, "View details" e GitHub de cada entrada e o footer; títulos sem saltos. |
| PROJ-CA-17 | Atendido | Sem rolagem horizontal em 360, 390, 768, 1366, 1440 e 1920 px, na lista e nos detalhes, nos dois idiomas; no máximo 80 caracteres por linha em 1366 px. |
| PROJ-CA-18 | Atendido | `pnpm check`, `pnpm typecheck` e `pnpm test:e2e` (196 testes; o build roda como parte do `test:e2e`) sem erros. |
| PROJ-CA-19 | Atendido por revisão | Imagens revisadas uma a uma antes de entrar: nenhuma mostra e-mail, nome de terceiros ou dado de amigos; a legenda do Reelix credita o TMDB. |

Também conferido no navegador, em `localhost:3000`, a 1440 px e a 375 px: lista, detalhe do Reelix (as três telas lado a lado no desktop e empilhadas no mobile), entrada do FintaLab com as três telas e Home com os três cards.

Divergências em relação à SPEC e achados:

- **Breakpoint:** a primeira versão da galeria usou `sm:`, que o design system não tem (só `md`, `lg` e `xl`); as telas do Reelix ficaram empilhadas no desktop e os testes de DOM não pegaram. Corrigido para `md:` e acrescentado teste que mede a posição das imagens.
- **Largura do texto:** o texto da razão de cada decisão técnica ficou em 34 rem (e não nos 39 rem do restante) para não passar de 80 caracteres por linha em fonte de 16 px.
- **Tipos:** `AppPathname` passou a excluir rotas com parâmetro; o tipo das traduções não alcança o namespace dos detalhes, então `pageTexts` em `metadata.ts` usa um `switch` com chaves verificadas.
- **Lista de decisões:** `t.raw()` devolve o array de decisões, cujo número de itens o typecheck não compara entre idiomas; o E2E confere os quatro itens.
- LCP e CLS (PROJ-RNF-02) não foram medidos com ferramenta própria; as imagens têm largura e altura declaradas, o que evita deslocamento de layout.

## Refinamento

| Data | O que mudou | Motivo |
|---|---|---|
| 2026-11-07 | Requisitos numerados com prioridade (PROJ-RF-01 a 15) e requisitos não funcionais (PROJ-RNF-01 a 07). | A versão 0.1 não tinha IDs, prioridades nem requisitos não funcionais. |
| 2026-11-07 | Critérios de aceitação em Given/When/Then (PROJ-CA-01 a 18). | "Projetos identificados corretamente" e "imagens otimizadas" não eram verificáveis. |
| 2026-11-07 | Escopo fechado: três projetos, detalhe para dois, sem estudos de caso e sem Results. | "Estudos de caso profissionais" e a seção Results dependiam de resultados não validados. |
| 2026-11-07 | Inclusão do FintaLab, conforme pedido do usuário, e terceiro destaque na Home (dependência da SPEC-001 v0.8.0). | Pedido do usuário. |
| 2026-11-07 | Estrutura de detalhe reduzida de nove para sete seções, com Implementation dentro de Architecture. | Decisão do usuário. |
| 2026-11-07 | Rascunho dos textos nos dois idiomas, com tecnologias conferidas nos repositórios e rastreabilidade de cada fato. | Os textos não existiam e o conteúdo precisa refletir o estado real dos projetos. |
| 2026-11-07 | Movida de `FEATURES.md` para `.specs/004-projects.md`. | `.specs/README.md` prevê separar por funcionalidade conforme o projeto cresce. |
| 2026-11-07 | Versão 0.6.0: seis telas novas do Reelix (nove no total), galeria rolável no detalhe, novos textos alternativos, Q6 e riscos; imagens em JPEG ou PNG, todas com até 250 KB. | Pedido do usuário para adicionar mais imagens do Reelix. |
| 2026-11-07 | Versão 0.5.0: implementada; seção 15 com a verificação dos critérios, as divergências e os achados. | Implementação da SPEC. |
| 2026-11-07 | Versão 0.4.0: textos e imagens aprovados (Q1, Q4 e Q5); home do Reelix incluída como terceira imagem (JPEG), capa do Reelix e legenda com crédito ao TMDB; status passa a Approved. | Decisão do usuário. |
| 2026-11-07 | Versão 0.3.0: imagens do Reelix e do FintaLab (seção 7.6), PROJ-RF-15 passa a Must, novos PROJ-RF-16 e PROJ-CA-19, riscos, perguntas Q4 e Q5. As cinco imagens foram capturadas e estão em `public/images/projects/`. | Pedido do usuário para usar capturas do app Reelix e do protótipo do FintaLab. |
