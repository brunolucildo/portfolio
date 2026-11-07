# SPEC-003 — Experience

## 1. Identificação

| Campo | Valor |
|---|---|
| Nome | Experience |
| Identificador | SPEC-003 |
| Slug | `003-experience` |
| Versão | 0.4.0 |
| Status | In Review (implementada em 2026-11-07; aguardando revisão do usuário e do PR) |
| Data | 2026-11-07 |
| Origem | SPEC-003 de `.specs/FEATURES.md` (v0.1, Draft) |

Prioridades usadas: **Must** (obrigatório para a v1), **Should** (desejável; pode ser adiada sem bloquear a entrega).

## 2. Contexto

A página Experience apresenta o histórico profissional de Bruno. Hoje ela existe apenas como página provisória (título e "em construção"), marcada como `noindex`, e já é o destino dos links "Ver experiência" da Home e do About.

**Objetivo:** demonstrar evolução profissional, responsabilidades, atuação técnica e resultados verificáveis (`CONTENT.md`, seção 4.3).

**Relação com o produto:** a Home mostra três fatos em poucos segundos, o About conta como Bruno chegou até aqui sem cargos nem datas, e Experience é o lugar dos cargos, dos períodos e dos resultados. Esta SPEC é também o ponto de validação das métricas que o About e a Home deixaram de fora (`CONTENT.md`, 6.3). O portfólio não deve ser uma reprodução do currículo (`BUSINESS.md`, 6.1): a página prioriza impacto e responsabilidade, não listas de tarefas.

## 3. Escopo

### 3.1. Dentro do escopo

1. Abertura com a apresentação do percurso e a descrição da empresa, sem citar o nome.
2. Linha do tempo vertical com cinco cargos, do mais recente ao mais antigo.
3. Em cada cargo: título, período, contexto, responsabilidades e tecnologias. Conquistas aparecem somente onde há resultado validado (hoje, só no cargo atual).
4. Três métricas autorizadas, cada uma com seu contexto (seção 7.3): mais de cinco serviços modernizados, redução de 80% no tempo de inclusão de itens em pedidos de venda e mais de 200 pull requests revisados.
5. Diferenciação entre o que é individual e o que é resultado da equipe, pela redação em primeira pessoa.
6. Metadados da página nos dois idiomas, substituindo o `noindex` provisório.

### 3.2. Fora do escopo

- Nome da empresa (decisão do usuário; vale para a página e para os metadados).
- Localização dos cargos e frases de busca de emprego ("Seeking…", "Open to global relocation", "Open to Work", "Hire Me" e equivalentes).
- Formação acadêmica e cursos (ficam no About, SPEC-002).
- A métrica de redução de ~40% no tempo de resposta das APIs (decisão do usuário: não publicar).
- Estudos de caso e seus links (SPEC-004; veja EXP-RF-13).
- Currículo em PDF (SPEC-009) e formulário de contato (SPEC-007).
- Fotografia, parallax, animação de entrada e cards (a página é tipográfica, como o About).
- Níveis de proficiência, barras de habilidade e contadores animados.
- Header, footer, menu e Language Switcher (SPEC-010, já implementados).

## 4. Requisitos funcionais

| ID | Prioridade | Requisito |
|---|---|---|
| EXP-RF-01 | Must | A página tem um `h1`, um parágrafo de abertura e uma linha do tempo com cinco entradas, nesta ordem: Technical Lead, Senior Backend Engineer e três de Full Stack Software Engineer (da mais recente à mais antiga). |
| EXP-RF-02 | Must | Cada entrada tem um `h2` com o título do cargo e o período em mês e ano, no idioma da página. O cargo atual termina em "Present" (`en`) ou "atual" (`pt-BR`). Os períodos são os da seção 7.2. |
| EXP-RF-03 | Must | Cada entrada tem uma frase de contexto, seguida das responsabilidades, com os textos da seção 7.1. |
| EXP-RF-04 | Must | Uma entrada só exibe a lista de conquistas quando houver resultado validado. Nenhum título de seção aparece sem conteúdo. Nesta versão, só o Technical Lead tem conquistas. |
| EXP-RF-05 | Must | Cada entrada lista as tecnologias da seção 7.1, em texto discreto, sem indicador de proficiência e sem ordenação que sugira domínio. |
| EXP-RF-06 | Must | Ações individuais são escritas em primeira pessoa do singular; resultados coletivos atribuem a equipe ("minha equipe", "sob minha liderança"). Nenhum resultado coletivo aparece como feito individual. |
| EXP-RF-07 | Must | As únicas métricas numéricas publicadas são as da seção 7.3 (mais de cinco serviços, 80% e mais de 200 pull requests), além do tamanho da equipe (cinco), dos anos de experiência (10+) e das datas. O 80% traz o contexto de medição e a autoria coletiva. |
| EXP-RF-08 | Must | A página não cita o nome da empresa, em nenhum idioma nem nos metadados. A empresa é descrita uma única vez, na abertura. |
| EXP-RF-09 | Must | Todo texto visível vem dos arquivos de conteúdo `en` e `pt-BR`, sem condicionais de idioma nos componentes. Os períodos têm uma única fonte de dados, formatada por idioma, e não são digitados duas vezes. |
| EXP-RF-10 | Must | A página define `title`, `description`, canonical, `hreflang` e Open Graph para cada idioma e deixa de ser `noindex`. |
| EXP-RF-11 | Must | A página não contém as expressões proibidas do `CLAUDE.md` (seção 7), mensagens de disponibilidade profissional nem as frases genéricas do `CONTENT.md` (seção 9). |
| EXP-RF-12 | Must | Os fatos comuns com a Home e o About (equipe de cinco desenvolvedores e mais de 10 anos de experiência) coincidem com eles e com o currículo. |
| EXP-RF-13 | Should | Quando existir um estudo de caso ligado a um cargo (SPEC-004), a entrada exibe um link para ele, na rota do idioma ativo. Na v1 não há estudos de caso, então nenhum link é exibido. |

## 5. Requisitos não funcionais

| ID | Categoria | Requisito |
|---|---|---|
| EXP-RNF-01 | Renderização | A página é gerada estaticamente, sem Client Components, e o conteúdo está no HTML inicial. |
| EXP-RNF-02 | Desempenho | LCP até 2,5 s e CLS até 0,1 em build de produção. A página não carrega imagens. |
| EXP-RNF-03 | Acessibilidade | WCAG 2.2 AA: contraste, hierarquia de títulos sem saltos (`h1` e depois um `h2` por cargo), foco visível e leitura correta por leitor de tela. A linha do tempo é uma lista ordenada e os períodos usam marcação de data (`<time>`). |
| EXP-RNF-04 | Responsividade | Sem rolagem horizontal em 360, 390, 768, 1366, 1440 e 1920 px, nos dois idiomas. Leitura confortável em tela pequena. |
| EXP-RNF-05 | Leitura | O texto respeita a largura de leitura do projeto, com no máximo 80 caracteres por linha em desktop (como no About). |
| EXP-RNF-06 | Consistência | Datas, cargos e fatos coincidem com o currículo publicado em `public/documents/resume/`, exceto onde a seção 11 registra a divergência aprovada. |
| EXP-RNF-07 | Tipos e qualidade | TypeScript strict; `pnpm check`, `pnpm typecheck` e `pnpm build` sem erros; paridade de chaves entre `en` e `pt-BR` validada pelo typecheck; testes E2E em `e2e/experience.spec.ts`. |

## 6. Interface e experiência

### 6.1. Composição

Layout editorial, alinhado à esquerda, sem cards, com uma linha do tempo vertical discreta (`DESIGN_SYSTEM.md`, 4.7).

| Largura | Composição |
|---|---|
| ≥1024 px | Cada entrada em duas colunas: período na coluna estreita e conteúdo (título, contexto, responsabilidades, conquistas, tecnologias) na coluna larga, ligados por um filete vertical com um marcador por entrada. |
| <1024 px | Coluna única: marcador e filete à esquerda; período acima do título e conteúdo abaixo. |

- O `h1` usa `text-h1`; a abertura usa `text-body-lg` em cor secundária.
- As conquistas recebem destaque discreto (marcador verde-limão e peso de fonte), sem fundo, caixa nem ícone. O verde-limão é usado de forma intencional, não em todas as entradas.
- As tecnologias aparecem como uma linha de texto separada por marcadores, ou como `Badge` discreto, sem agrupar por nível.
- O cargo atual tem o marcador preenchido; os demais, com contorno.
- Sem animação de entrada, sem parallax e sem hover decorativo.

### 6.2. Estados

| Situação | Comportamento esperado |
|---|---|
| Entrada sem conquistas | Mostra apenas contexto, responsabilidades e tecnologias, sem título vazio. |
| Texto mais longo em pt-BR | Quebra de linha dentro da coluna, sem rolagem horizontal. |
| Navegação por teclado | A página não tem links no `main` na v1. A ordem é skip link, header e footer, com foco visível. |
| `prefers-reduced-motion` | Sem efeito: a página não tem movimento. |
| JavaScript desabilitado | Página inteira legível. |

Não há estado de carregamento, vazio ou erro: a página é estática.

## 7. Conteúdo e dados

Origem: currículo em `public/documents/resume/bruno-lucildo-resume-en.pdf` (fonte principal), o PDF do perfil do LinkedIn (`bruno-lucildo`), `CONTENT.md` (4.3, 5.1 e 6.3), `BUSINESS.md` e as respostas do usuário em 2026-11-07. Os textos abaixo usam apenas fatos dessas fontes e foram **aprovados pelo usuário em 2026-11-07** (Q1 e Q3), inclusive a voz em primeira pessoa, a atribuição à equipe, os títulos dos cargos em pt-BR, a descrição da empresa e os textos de SEO.

### 7.1. Textos e tecnologias

Convenção de voz: primeira pessoa; o verbo no passado nas conquistas e no presente nas responsabilidades do cargo atual.

**Abertura e página**

| Elemento | Inglês (`en`) | Português (`pt-BR`) |
|---|---|---|
| `h1` | Experience | Experiência |
| Abertura | Ten-plus years at a steel distribution and industrial solutions company, from full-stack developer to technical lead of the team building its new ERP platform. | Mais de dez anos em uma empresa de distribuição de aço e soluções industriais, de desenvolvedor full stack a líder técnico da equipe que constrói sua nova plataforma de ERP. |
| Rótulo "Responsabilidades" | Responsibilities | Responsabilidades |
| Rótulo "Conquistas" | Achievements | Conquistas |
| Rótulo "Tecnologias" | Technologies | Tecnologias |
| Title (SEO) | Experience \| Bruno Lucildo | Experiência \| Bruno Lucildo |
| Description (SEO) | Bruno Lucildo's career path from full-stack developer to backend technical lead: roles, responsibilities and results across more than ten years of enterprise software. | A trajetória profissional de Bruno Lucildo de desenvolvedor full stack a líder técnico backend: cargos, responsabilidades e resultados em mais de dez anos de software corporativo. |

**Entrada 1 — Technical Lead (maio de 2023 a atual)**

| Elemento | Inglês (`en`) | Português (`pt-BR`) |
|---|---|---|
| Título | Technical Lead | Líder Técnico |
| Contexto | I lead the team of five software engineers who develop and modernize the company's new ERP platform, while staying hands-on in architecture and development. | Lidero a equipe de cinco engenheiros de software que desenvolve e moderniza a nova plataforma de ERP da empresa, sem deixar de atuar na arquitetura e no desenvolvimento. |
| Resp. 1 | Provide technical direction, mentoring and architectural guidance to a team of five software engineers. | Dou direção técnica, mentoria e orientação de arquitetura a uma equipe de cinco engenheiros de software. |
| Resp. 2 | Define the software architecture and engineering standards for the new ERP platform; the standards have been adopted across multiple teams. | Defino a arquitetura de software e os padrões de engenharia da nova plataforma de ERP; os padrões foram adotados por várias equipes. |
| Resp. 3 | Review code and coach developers, with more than 200 pull requests reviewed. | Faço revisão de código e acompanhamento técnico dos desenvolvedores, com mais de 200 pull requests revisados. |
| Resp. 4 | Drive technical decisions across modern and legacy components, balancing business continuity, scalability and maintainability. | Conduzo decisões técnicas entre componentes modernos e legados, equilibrando continuidade do negócio, escalabilidade e manutenibilidade. |
| Conquista 1 | Led the modernization of more than five business-critical services, including user registration and access and sales operations, migrating legacy modules to .NET services. | Liderei a modernização de mais de cinco serviços críticos para o negócio, incluindo cadastro e acesso de usuários e operações de vendas, migrando módulos legados para serviços .NET. |
| Conquista 2 | Under my technical leadership, my team designed and implemented distributed solutions with RabbitMQ that cut the time to add items to sales orders by 80%, measured before and after the change in production. | Sob minha liderança técnica, minha equipe projetou e implementou soluções distribuídas com RabbitMQ que reduziram em 80% o tempo para incluir itens em pedidos de venda, medido antes e depois da mudança, em produção. |
| Conquista 3 | Improved backend performance through PostgreSQL query optimization and service-level improvements. | Melhorei o desempenho do backend com a otimização de consultas PostgreSQL e melhorias nos serviços. |
| Tecnologias | .NET, C#, Clean Architecture, SOLID, PostgreSQL, RabbitMQ | .NET, C#, Clean Architecture, SOLID, PostgreSQL, RabbitMQ |

**Entrada 2 — Senior Backend Engineer (setembro de 2022 a maio de 2023)**

| Elemento | Inglês (`en`) | Português (`pt-BR`) |
|---|---|---|
| Título | Senior Backend Engineer | Engenheiro Backend Sênior |
| Contexto | I was responsible for the backend architecture and implementation of the company's next-generation ERP. | Fui responsável pela arquitetura e pela implementação do backend do ERP de nova geração da empresa. |
| Resp. 1 | Designed and developed scalable REST APIs with ASP.NET Core. | Projetei e desenvolvi APIs REST escaláveis com ASP.NET Core. |
| Resp. 2 | Designed relational data models and optimized queries across SQL Server and PostgreSQL to improve API performance. | Projetei modelos de dados relacionais e otimizei consultas no SQL Server e no PostgreSQL para melhorar o desempenho das APIs. |
| Resp. 3 | Implemented search with MongoDB Atlas Search and introduced Redis for distributed caching and session management. | Implementei busca com MongoDB Atlas Search e introduzi o Redis para cache distribuído e gerenciamento de sessão. |
| Resp. 4 | Developed asynchronous integrations with RabbitMQ and JWT-based authentication and authorization. | Desenvolvi integrações assíncronas com RabbitMQ e autenticação e autorização baseadas em JWT. |
| Resp. 5 | Built data access layers with Entity Framework and Dapper. | Construí camadas de acesso a dados com Entity Framework e Dapper. |
| Tecnologias | C#, ASP.NET Core, PostgreSQL, SQL Server, MongoDB, Redis, RabbitMQ, Entity Framework, Dapper | C#, ASP.NET Core, PostgreSQL, SQL Server, MongoDB, Redis, RabbitMQ, Entity Framework, Dapper |

**Entrada 3 — Full Stack Software Engineer (março de 2020 a agosto de 2022)**

| Elemento | Inglês (`en`) | Português (`pt-BR`) |
|---|---|---|
| Título | Full Stack Software Engineer | Engenheiro de Software Full Stack |
| Contexto | I built and maintained enterprise applications, business intelligence and data integrations for the company. | Construí e mantive aplicações corporativas, business intelligence e integrações de dados para a empresa. |
| Resp. 1 | Developed enterprise web applications supporting core business processes. | Desenvolvi aplicações web corporativas que sustentam processos centrais do negócio. |
| Resp. 2 | Designed and implemented the company's Balanced Scorecard platform. | Projetei e implementei a plataforma de Balanced Scorecard da empresa. |
| Resp. 3 | Built Business Intelligence dashboards for operational and management reporting. | Construí dashboards de Business Intelligence para relatórios operacionais e gerenciais. |
| Resp. 4 | Developed ETL processes with Azure Data Factory. | Desenvolvi processos de ETL com Azure Data Factory. |
| Resp. 5 | Developed applications and integrations with Node.js and JavaScript, and maintained legacy applications built on InterSystems Caché. | Desenvolvi aplicações e integrações com Node.js e JavaScript e mantive aplicações legadas em InterSystems Caché. |
| Tecnologias | InterSystems Caché, Azure Data Factory, SQL Server, JavaScript, Node.js | InterSystems Caché, Azure Data Factory, SQL Server, JavaScript, Node.js |

**Entrada 4 — Full Stack Software Engineer (junho de 2018 a março de 2020)**

| Elemento | Inglês (`en`) | Português (`pt-BR`) |
|---|---|---|
| Título | Full Stack Software Engineer | Engenheiro de Software Full Stack |
| Contexto | I developed and maintained internal enterprise web applications. | Desenvolvi e mantive aplicações web corporativas internas. |
| Resp. 1 | Implemented new features and enhancements for business-critical systems. | Implementei novas funcionalidades e melhorias em sistemas críticos para o negócio. |
| Resp. 2 | Maintained and evolved legacy applications as part of the company's software development initiatives. | Mantive e evoluí aplicações legadas dentro das iniciativas de desenvolvimento de software da empresa. |
| Tecnologias | InterSystems Caché, SQL Server, JavaScript | InterSystems Caché, SQL Server, JavaScript |

**Entrada 5 — Full Stack Software Engineer (julho de 2016 a junho de 2018)**

| Elemento | Inglês (`en`) | Português (`pt-BR`) |
|---|---|---|
| Título | Full Stack Software Engineer | Engenheiro de Software Full Stack |
| Contexto | I started my career supporting the development and maintenance of internal enterprise applications. | Comecei a carreira apoiando o desenvolvimento e a manutenção de aplicações corporativas internas. |
| Resp. 1 | Implemented new features and enhancements for business systems. | Implementei novas funcionalidades e melhorias em sistemas do negócio. |
| Resp. 2 | Built my software engineering foundations working with enterprise applications and legacy technologies. | Construí minha base de engenharia de software trabalhando com aplicações corporativas e tecnologias legadas. |
| Tecnologias | InterSystems Caché, SQL Server, JavaScript | InterSystems Caché, SQL Server, JavaScript |

### 7.2. Períodos (fonte única)

| Entrada | Início | Fim | Fonte |
|---|---|---|---|
| 1 | 2023-05 | atual | Currículo e LinkedIn |
| 2 | 2022-09 | 2023-05 | Currículo (o LinkedIn diz abril de 2023; o usuário fixou maio de 2023 em 2026-11-07) |
| 3 | 2020-03 | 2022-08 | Currículo e LinkedIn |
| 4 | 2018-06 | 2020-03 | Currículo e LinkedIn |
| 5 | 2016-07 | 2018-06 | Currículo e LinkedIn |

O período total na empresa (de julho de 2016 ao presente, mais de 10 anos) sustenta o "mais de dez anos" da abertura e o "10+" da Home.

### 7.3. Métricas autorizadas e rastreabilidade

| Afirmação | Fonte | Alcance | Situação |
|---|---|---|---|
| Equipe de cinco engenheiros | Currículo e LinkedIn; `CONTENT.md` 5.1 | Coletivo, sob minha liderança | Aprovada (Home e About) |
| Mais de cinco serviços críticos modernizados (cadastro e acesso de usuários, vendas) | Currículo ("5+") e LinkedIn ("more than 5") | Eu liderei; a execução é da equipe | Autorizada pelo usuário em 2026-11-07 |
| Migração de módulos legados para serviços .NET | LinkedIn (não consta no currículo) | Junto da modernização acima | Autorizada pelo usuário em 2026-11-07 |
| Padrões de engenharia adotados por várias equipes | LinkedIn ("multiple teams"); o currículo diz apenas "para a nova plataforma de ERP" | Eu defino; a adoção é coletiva | Autorizada pelo usuário em 2026-11-07 |
| Redução de 80% no tempo de inclusão de itens em pedidos de venda, com RabbitMQ | Currículo (o LinkedIn não cita o número) | **Equipe, sob minha liderança**; medida antes e depois, em produção | Autorizada pelo usuário em 2026-11-07, com autoria e medição informadas por ele |
| Mais de 200 pull requests revisados | LinkedIn (o currículo não cita) | Individual; apresentada como volume de revisão de código, não como resultado | Autorizada pelo usuário em 2026-11-07 |
| Otimização de consultas PostgreSQL e dos serviços, sem número | Currículo | Individual (voz do currículo) | Aprovada com o texto (2026-11-07) |
| Redução de ~40% no tempo de resposta das APIs | LinkedIn | — | **Não publicar** (decisão do usuário) |

As afirmações em primeira pessoa e a atribuição "minha equipe" seguem o princípio do `CONTENT.md` (2.3, item 5) e foram aprovadas pelo usuário (Q1).

## 8. Critérios de aceitação

| ID | Cobre | Critério (Given / When / Then) |
|---|---|---|
| EXP-CA-01 | RF-01 | **Given** `/en/experience` **When** a página carrega **Then** há um único `h1`, o parágrafo de abertura e cinco `h2`, nesta ordem: Technical Lead, Senior Backend Engineer, Full Stack Software Engineer, Full Stack Software Engineer, Full Stack Software Engineer. O mesmo vale para `/pt-BR/experiencia` com os títulos em português. |
| EXP-CA-02 | RF-02 | **Given** cada entrada **When** renderizada **Then** o período usa `<time datetime>` com os valores da seção 7.2; o cargo atual termina em "Present"/"atual"; os meses e o ano aparecem no idioma da página. |
| EXP-CA-03 | RF-03, RF-04 | **Given** as entradas **When** renderizadas **Then** todas têm contexto e responsabilidades; só a entrada Technical Lead tem a lista de conquistas; nenhuma entrada exibe o rótulo "Achievements"/"Conquistas" sem itens. |
| EXP-CA-04 | RF-05 | **Given** cada entrada **Then** as tecnologias exibidas são exatamente as da seção 7.1 e não há barra, nota, nível ou ordenação por domínio. |
| EXP-CA-05 | RF-06, RF-07 | **Given** a conquista do RabbitMQ **When** lida **Then** atribui o feito à equipe ("my team"/"minha equipe"), cita a medição antes e depois, em produção, e traz "80%". **Given** as conquistas **Then** nenhuma atribui resultado coletivo apenas ao autor. |
| EXP-CA-06 | RF-07 | **Given** o `main` dos dois idiomas **When** buscado por percentuais **Then** só "80%" aparece; "40%" não aparece; "200" aparece uma única vez, como volume de pull requests; "5+"/"more than five"/"mais de cinco" só aparece associado aos serviços modernizados. |
| EXP-CA-07 | RF-08, RF-11 | **Given** o conteúdo e os metadados dos dois idiomas **When** buscados por "Açovisa", "Acovisa" e pelas expressões proibidas ("Open to Work", "Available for Opportunities", "Available for Hire", "Looking for a New Job", "Hire Me", "paixão por tecnologia", "passion for technology", "Seeking", "relocation") **Then** não há ocorrências. |
| EXP-CA-08 | RF-09 | **Given** `/en/experience` e `/pt-BR/experiencia` **When** inspecionadas **Then** não há texto visível fora dos arquivos de conteúdo, nenhuma frase aparece em idioma diferente do da página (exceto nomes próprios e termos técnicos) e os períodos vêm de uma única fonte. |
| EXP-CA-09 | RF-10 | **Given** o HTML das duas páginas **Then** cada uma tem `title`, `description`, canonical, `hreflang` para as duas versões e Open Graph próprios, `<html lang>` correto e **nenhuma** meta `robots` com `noindex`. |
| EXP-CA-10 | RF-12, RNF-06 | **Given** a Home, o About e o currículo **When** comparados com a página **Then** equipe de cinco, "10+" e as datas coincidem, e a única divergência é a registrada na seção 11. |
| EXP-CA-11 | RF-13 | **Given** a página na v1 **Then** não há link para estudo de caso no `main`. |
| EXP-CA-12 | RNF-01, RNF-02 | **Given** o HTML da página **Then** não contém `<img>`, nenhuma camada de parallax e nenhuma classe de animação de entrada, e o conteúdo está no HTML inicial. |
| EXP-CA-13 | RNF-03 | **Given** a árvore de acessibilidade **Then** a linha do tempo é uma lista ordenada, há um único `h1` e nenhum nível de título é pulado; a ordem de leitura coincide com a ordem visual; a navegação por teclado passa por skip link, header e footer com foco visível. |
| EXP-CA-14 | RNF-04, RNF-05 | **Given** as larguras 360, 390, 768, 1366, 1440 e 1920 px **Then** `scrollWidth` não excede `innerWidth`, em ambos os idiomas; **Given** largura ≥1024 px **Then** nenhuma linha de texto passa de 80 caracteres. |
| EXP-CA-15 | RNF-07 | **Given** o código da página **Then** `pnpm check`, `pnpm typecheck` e `pnpm build` terminam sem erros e `pnpm test:e2e` passa, incluindo `e2e/experience.spec.ts`. |

## 9. Dependências

| Dependência | Situação | Impacto |
|---|---|---|
| SPEC-010 Global Layout | Implementada | Header, footer, skip link e `main`. |
| SPEC-008 Internationalization | Implementada na base | Rotas `/experience` e `/experiencia`, conteúdo `en`/`pt-BR` e metadados. |
| Design system | Implementado | Tipografia, container de leitura e `Badge`; o item de experiência (4.7) é novo. |
| SPEC-001 Home e SPEC-002 About | Implementadas | Já apontam para a rota de Experience; os fatos devem coincidir. |
| SPEC-009 Resume | Pendente | O currículo é a fonte principal e deve ficar consistente com a página. |
| SPEC-004 Projects | Pendente | Origem dos estudos de caso de EXP-RF-13. |
| Testes E2E | Implementados | Cada página nova ganha o seu `*.spec.ts`. |

## 10. Riscos

| Risco | Mitigação |
|---|---|
| Métricas sem lastro (80%, 200+, mais de cinco) | Cada uma tem fonte e autorização registrada (7.3); o 80% traz medição e autoria; o ~40% fica de fora. |
| Resultado coletivo apresentado como individual | EXP-RF-06 e EXP-CA-05; revisão frase a frase pelo usuário (Q1). |
| Divergência entre site, currículo e LinkedIn | Seção 11; EXP-CA-10; manter uma única fonte para datas e fatos. |
| O anonimato da empresa ser só de apresentação | O currículo em PDF e o LinkedIn, ambos públicos, citam a empresa. A decisão é do usuário; a SPEC não promete confidencialidade além do texto da página. |
| Texto virar cópia do currículo | Linguagem própria, conquistas só onde há resultado, entradas antigas enxutas (EXP-RF-04). |
| Excesso de tecnologias diluir o posicionamento backend | Lista curada do currículo (decisão do usuário); QlikView, jQuery, HTML5/CSS3, Materialize e Bootstrap ficam de fora. |
| Estudos de caso inexistentes | EXP-RF-13 é Should e não entrega nada na v1. |

## 11. Divergências conhecidas entre as fontes

| Item | Currículo | LinkedIn | Na página |
|---|---|---|---|
| Fim do Senior Backend | Maio de 2023 | Abril de 2023 | Maio de 2023 (decisão do usuário) |
| Redução de 80% | Cita, atribuída a RabbitMQ | Não cita | Publicada, como resultado da equipe, medida antes e depois em produção |
| Redução de ~40% nas APIs | Não cita | Cita | Não publicada |
| 200+ pull requests | Não cita | Cita | Publicada, como volume de revisão |
| Padrões adotados por várias equipes e migração para .NET | Não cita | Cita | Publicadas (autorizadas pelo usuário) |
| Tecnologias (QlikView, jQuery, HTML5/CSS3, Materialize, Bootstrap) | Não cita | Cita | Não publicadas (lista do currículo) |
| Descrição da empresa | "Steel Distribution & Industrial Solutions" | "Indústria e Comércio de Aços Especiais" | Descrição do currículo, sem o nome |
| Título do cargo | "Senior Backend Engineer"; "Software Engineer Fullstack" | "Senior Backend Software Engineer"; "Full Stack Software Engineer" | "Senior Backend Engineer"; "Full Stack Software Engineer" |

Como a página publica itens que o currículo não traz (200+, migração para .NET, padrões em várias equipes), vale avaliar a atualização do currículo (SPEC-009) para manter a consistência. A decisão é do usuário.

## 12. Perguntas abertas

| ID | Pergunta | Impacto | Dono | Bloqueia |
|---|---|---|---|---|
| Q1 | Os textos da seção 7.1 (inclusive a voz em primeira pessoa, a atribuição à equipe e os títulos dos cargos em pt-BR) estão aprovados ou precisam de ajustes? | Todo o conteúdo da página. | Bruno | **Resolvida (2026-11-07):** textos aprovados sem ajustes. |
| Q2 | A ordem do mais recente ao mais antigo está correta? A SPEC original dizia apenas "ordem cronológica". | EXP-RF-01 e EXP-CA-01. | Bruno | Não bloqueia (reversível). Segue como premissa até ser revista na validação visual. |
| Q3 | O título, a descrição de SEO e a descrição da empresa na abertura (seção 7.1) estão aprovados? | EXP-RF-10 e EXP-RF-08. | Bruno | **Resolvida (2026-11-07):** aprovados. |

## 13. Premissas

Decisões reversíveis adotadas neste refinamento.

1. A linha do tempo vai do mais recente ao mais antigo (Q2).
2. A empresa aparece só como descrição na abertura, sem repetição por entrada, e sem localização.
3. As tecnologias de cada cargo seguem a linha de habilidades do currículo, sem as competências gerais ("Technical Leadership", "Software Architecture", "Performance Optimization"), que já estão no texto. No Technical Lead, entram também PostgreSQL e RabbitMQ, porque o texto das conquistas os cita.
4. Os títulos dos cargos seguem o currículo e o LinkedIn (seção 11), com tradução própria em pt-BR; a Home usa "Desenvolvedor Backend Sênior" como posicionamento, e a linha do tempo usa o título formal do cargo.
5. As entradas 4 e 5 não têm lista de conquistas porque não há resultado validado.
6. Nenhum link na página na v1: sem estudos de caso, sem currículo e sem chamada final; os caminhos de saída ficam no header e no footer.
7. A SPEC passa a viver em `.specs/003-experience.md`, como as SPEC-001 e SPEC-002. A seção SPEC-003 de `FEATURES.md` aponta para este arquivo.

## 14. Decisões registradas

| Data | Decisão | Origem |
|---|---|---|
| 2026-11-07 | A página descreve a empresa sem citar o nome. | Resposta do usuário |
| 2026-11-07 | Cinco entradas na linha do tempo, como no currículo e no LinkedIn. | Resposta do usuário |
| 2026-11-07 | Métricas publicadas: mais de cinco serviços, 80% (RabbitMQ) e mais de 200 pull requests. A de ~40% não é publicada. | Resposta do usuário |
| 2026-11-07 | O 80% é resultado da equipe sob a liderança dele, medido antes e depois em produção. | Resposta do usuário |
| 2026-11-07 | Os 200+ pull requests entram como volume de revisão na liderança, não como conquista destacada. | Resposta do usuário |
| 2026-11-07 | Entram também a migração para .NET e os padrões adotados por várias equipes, ambos só do LinkedIn. | Resposta do usuário |
| 2026-11-07 | Tecnologias vêm da lista do currículo. | Resposta do usuário |
| 2026-11-07 | Fim do cargo de Senior Backend: maio de 2023. | Resposta do usuário (retomada anterior) |
| 2026-11-07 | O link para estudos de caso (requisito original) passa a Should, sem entrega na v1 por não haver estudos de caso. | Premissa do refinamento, a confirmar |
| 2026-11-07 | Textos da seção 7.1 aprovados (conteúdo, voz, títulos em pt-BR, descrição da empresa e SEO). Q1 e Q3 resolvidas. | Resposta do usuário |

## 15. Implementação e verificação

Implementada na branch `feat/experience`. Arquivos:

- Novos: `src/components/experience/ExperienceContent.tsx`, `src/components/experience/ExperienceItem.tsx`, `src/config/experience.ts` (períodos e tecnologias, fonte única), `src/lib/utils/format-month.ts` e `e2e/experience.spec.ts`.
- Alterados: `src/app/[locale]/experience/page.tsx` (substitui a página provisória e passa a ser indexável), `src/lib/seo/metadata.ts` (`buildPageMetadata` aceita `experience.metadata`; "experience" sai do tipo das páginas provisórias), `src/components/sections/PagePlaceholder.tsx`, `e2e/support/content-rules.ts` (nome da empresa e frases de busca de emprego) e os dois `common.json` (nova seção `experience`; chave `pages.experience` removida por ficar sem uso).

Verificação em 2026-11-07:

| Critério | Resultado | Evidência |
|---|---|---|
| EXP-CA-01 | Atendido | `e2e/experience.spec.ts`: um `h1` e cinco `h2` na ordem prevista, nos dois idiomas. |
| EXP-CA-02 | Atendido | Teste dos `<time datetime>` com os valores da seção 7.2; o cargo atual mostra "May 2023 – Present" e "mai. 2023 – atual". |
| EXP-CA-03 | Atendido | Contagens de responsabilidades (4, 5, 5, 2, 2) e conquistas (3, só no cargo atual); sem rótulo vazio. |
| EXP-CA-04 | Atendido | As tecnologias de cada entrada coincidem com a seção 7.1; sem indicador de nível. |
| EXP-CA-05 | Atendido | A conquista do RabbitMQ é atribuída a "my team"/"minha equipe" e cita a medição antes e depois, em produção. Mutação (trocar por "I designed") derruba o teste. |
| EXP-CA-06 | Atendido | Só "80%" aparece como percentual; "40%" ausente; "200" aparece uma vez. Mutação (inserir "about 40%") derruba o teste. |
| EXP-CA-07 | Atendido | Texto e metadados sem nome da empresa, expressões proibidas ou frases de busca de emprego. |
| EXP-CA-08 | Atendido | Todo texto vem de `t()`; os períodos vêm de `src/config/experience.ts`; ver divergências. |
| EXP-CA-09 | Atendido | `title`, `description`, canonical, `hreflang` (en, pt-BR, x-default), Open Graph e `<html lang>` corretos, sem `noindex`. O domínio dos links ainda é `localhost` até definir `NEXT_PUBLIC_SITE_URL`. |
| EXP-CA-10 | Atendido em parte | Equipe de cinco e "10+" coincidem com a Home e o About; as datas foram conferidas com o currículo por leitura. A comparação é manual, sem teste automatizado. |
| EXP-CA-11 | Atendido | Sem links nem botões no `main`. |
| EXP-CA-12 | Atendido | Sem `<img>`, parallax, classes de animação nem Client Components. |
| EXP-CA-13 | Atendido | Lista ordenada, `h1` único, `h1` > `h2` > `h3` sem saltos; o teclado passa por skip link, header e footer. Não há elemento focável no `main`. |
| EXP-CA-14 | Atendido | Sem rolagem horizontal em 360, 390, 768, 1366, 1440 e 1920 px nos dois idiomas; no máximo 80 caracteres por linha em 1366 px. |
| EXP-CA-15 | Atendido | `pnpm check`, `pnpm typecheck` e `pnpm test:e2e` (91 testes, 40 novos) sem erros; o build roda como parte do `test:e2e`. |

Também foi conferido no navegador, em `localhost:3000` (servidor de desenvolvimento), a 1440 px e a 375 px, em `/en/experience` e `/pt-BR/experiencia`: linha do tempo legível, marcador preenchido no cargo atual, conquistas com marcador verde-limão e sem rolagem horizontal.

Divergências em relação à SPEC:

- As tecnologias ficam em `src/config/experience.ts`, e não nos arquivos de conteúdo, porque são nomes próprios iguais nos dois idiomas (exceção prevista em EXP-CA-08). Os textos e os rótulos seguem nos `common.json`.
- A largura de leitura é de 624 px (`max-w-[39rem]`), igual à do About, para ficar abaixo de 80 caracteres por linha.
- As listas de responsabilidades e conquistas são arrays nos `common.json`. O typecheck compara as chaves entre `en` e `pt-BR`, mas não o número de itens; esse número é verificado pelo E2E.
- O formato do mês depende do ICU do navegador (`May 2023`, `mai. 2023`).
- LCP e CLS (EXP-RNF-02) não foram medidos com ferramenta própria; a página é estática e sem imagens.

## Refinamento

| Data | O que mudou | Motivo |
|---|---|---|
| 2026-11-07 | Requisitos numerados com prioridade (EXP-RF-01 a 13) e requisitos não funcionais (EXP-RNF-01 a 07). | A versão 0.1 não tinha IDs, prioridades nem requisitos não funcionais. |
| 2026-11-07 | Critérios de aceitação em Given/When/Then (EXP-CA-01 a 15). | "Layout responsivo" e "resultados com contexto" não eram verificáveis. |
| 2026-11-07 | Escopo fechado: empresa sem nome, cinco cargos, métricas autorizadas e fronteira com About, Projects e Resume. | "Destacar resultados relevantes" e "validar métricas" estavam abertos. |
| 2026-11-07 | Rascunho dos textos nos dois idiomas, com rastreabilidade, alcance individual ou coletivo e divergências entre currículo e LinkedIn. | Os textos não existiam e as métricas precisavam de contexto antes da publicação. |
| 2026-11-07 | "Permitir navegação para estudos de caso" virou EXP-RF-13 (Should), sem entrega na v1. | Não há estudos de caso; a Home os exclui até validar as métricas. A confirmar. |
| 2026-11-07 | Movida de `FEATURES.md` para `.specs/003-experience.md`. | `.specs/README.md` prevê separar por funcionalidade conforme o projeto cresce. |
| 2026-11-07 | Versão 0.3.0: textos aprovados; Q1 e Q3 resolvidas; status passa a Approved. | Decisão do usuário. |
| 2026-11-07 | Versão 0.4.0: implementada; seção 15 com a verificação dos critérios e as divergências. | Implementação da SPEC. |
