# SPEC-005 — Technologies

## 1. Identificação

| Campo | Valor |
|---|---|
| Nome | Technologies |
| Identificador | SPEC-005 |
| Slug | `005-technologies` |
| Versão | 0.4.0 |
| Status | Done em 2026-11-08, por decisão do Bruno; os itens não verificados seguem para o QA final (antes: In Review, implementada em 2026-11-08; aguardando revisão do usuário e do PR) |
| Data | 2026-11-08 |
| Origem | SPEC-005 de `.specs/FEATURES.md` (v0.1, Draft) |

Prioridades usadas: **Must** (obrigatório para a v1), **Should** (desejável; pode ser adiada sem bloquear a entrega).

## 2. Contexto

A página Technologies apresenta as tecnologias, os frameworks, os bancos de dados e as práticas de engenharia que Bruno usa, agrupadas por categoria e com o contexto em que cada uma foi usada. Hoje ela não existe: não há rota, item de menu nem texto.

**Objetivo:** demonstrar familiaridade com o ecossistema técnico sem criar classificações de proficiência (`CONTENT.md`, 4.5; `DESIGN.md`, 6.5). A página responde "com o que ele trabalha e onde usou", não "o quanto sabe".

**Relação com o produto:** Experience e Projects já listam tecnologias por cargo e por projeto. Technologies é a visão transversal dessas informações: a mesma tecnologia aparece uma vez, na categoria certa, apontando para os lugares onde foi usada. Isso evita a "lista de tecnologias sem contexto" que o `CONTENT.md` pede para evitar.

**Posicionamento:** a página não é uma lista de busca de emprego e não usa expressões como "Open to Work".

## 3. Escopo

### 3.1. Dentro do escopo

1. Página própria em `/technologies` (pt-BR: `/tecnologias`), item "Technologies"/"Tecnologias" no menu principal e no rodapé, entre Projects e AI Lab.
2. Categorias com as tecnologias da seção 7.1, cada uma com um ícone monocromático e, quando documentado, uma linha de contexto ("Experience", nomes de projetos).
3. Fonte única de dados em `src/config/technologies.ts`, consistente com `experience.ts` e `projects.ts` (TECH-RF-08).
4. Ícones: do conjunto devicon (MIT) ou Simple Icons (CC0) quando existirem; monograma próprio, no mesmo estilo, quando não existirem (seção 7.5).
5. Textos em inglês e português, metadados indexáveis nos dois idiomas e testes E2E (`e2e/technologies.spec.ts`).

### 3.2. Fora do escopo

- Níveis, notas, barras, estrelas, percentuais ou "anos de experiência" por tecnologia.
- Tecnologias sem registro no currículo, no LinkedIn, nos repositórios ou nos documentos do projeto (Git, Docker, CI e semelhantes só entram se o usuário confirmar).
- Estudos de caso e links por tecnologia para páginas de detalhe (Should; ver TECH-RF-10).
- Teaser de Technologies na Home ou no About (nenhuma das SPEC-001 e SPEC-002 o pede).
- Animações de entrada, parallax e filtros (a página é estática e curta).
- Mensagens de disponibilidade profissional.
- Header, footer, menu e Language Switcher (SPEC-010, já implementados; só ganham o novo item).

## 4. Requisitos funcionais

| ID | Prioridade | Requisito |
|---|---|---|
| TECH-RF-01 | Must | A rota `/en/technologies` (pt-BR: `/pt-BR/tecnologias`) tem um `h1`, um parágrafo de abertura e uma seção por categoria, cada uma com um `h2`, na ordem da seção 7.1. |
| TECH-RF-02 | Must | "Technologies"/"Tecnologias" entra no menu principal e no rodapé, entre Projects e AI Lab, nos dois idiomas, com o estado "página atual" quando a rota está ativa. |
| TECH-RF-03 | Must | Cada categoria lista suas tecnologias como itens de uma lista (`ul`), em ordem fixa. Cada item mostra um ícone decorativo (`aria-hidden`), o nome e, quando houver, a linha de contexto. |
| TECH-RF-04 | Must | A página não exibe nível de domínio, nota, barra, percentual, "anos de uso" nem rótulos como "expert" ou "avançado". |
| TECH-RF-05 | Must | A linha de contexto usa só fatos documentados: "Experience"/"Experiência" quando a tecnologia consta em um cargo de `experience.ts` ou no currículo, e o nome de cada projeto de `projects.ts` que a usa. Tecnologia sem contexto documentado aparece sem a linha. |
| TECH-RF-06 | Must | Experiência profissional e projetos aparecem distintos: o contexto profissional é sempre o rótulo "Experience"/"Experiência" (sem citar a empresa) e os projetos usam o nome do projeto. Football Stat Analytics e FintaLab não são apresentados como experiência profissional. |
| TECH-RF-07 | Must | A página não cita o nome da empresa, o curso nem a instituição da pós-graduação, e não publica percentuais. |
| TECH-RF-08 | Must | Toda tecnologia exibida em Experience (`experience.ts`) e em Projects (`projects.ts`) existe também em Technologies, e toda tecnologia de Technologies com contexto está de fato em Experience, em Projects ou no currículo. Variações de nome (por exemplo, "Entity Framework" e "Entity Framework Core") ficam em uma única entrada. |
| TECH-RF-09 | Must | Cada tecnologia tem um ícone: o da fonte licenciada quando existir, ou um monograma próprio quando não existir (seção 7.5). Todos têm o mesmo tamanho, usam `currentColor` e não usam cores de marca. |
| TECH-RF-10 | Should (entregue em 2026-11-08, v0.4.0; ver seção 15) | Cada nome de projeto na linha de contexto leva à página de detalhe do projeto (ou à lista, quando não há detalhe), e "Experience" leva a `/experience`. |
| TECH-RF-11 | Must | A página tem metadados indexáveis em cada idioma (título, descrição, canonical, `hreflang`, Open Graph), sem `noindex`. |
| TECH-RF-12 | Must | Os nomes de tecnologia ficam na nomenclatura original nos dois idiomas; só títulos de categoria, abertura e rótulos de contexto são traduzidos (`CONTENT.md`, 3.3). |

## 5. Requisitos não funcionais

| ID | Categoria | Requisito |
|---|---|---|
| TECH-RNF-01 | Acessibilidade | Um único `h1`, `h2` por categoria sem pular níveis, listas semânticas, ícones `aria-hidden` e nome sempre em texto; contraste AA do texto e dos ícones sobre o fundo escuro; foco visível nos links (se houver). |
| TECH-RNF-02 | Responsividade | Sem rolagem horizontal em 360, 390, 768, 1366, 1440 e 1920 px, nos dois idiomas. Texto corrido com no máximo 80 caracteres por linha. |
| TECH-RNF-03 | Desempenho | Sem dependência de runtime nova; ícones como SVG versionados no repositório, servidos como arquivos estáticos (máscara CSS, sem SVG embutido no HTML); nenhuma imagem raster; sem layout shift. |
| TECH-RNF-04 | Consistência visual | Segue a identidade Dark Premium: sem cards, sem neon, sem gradiente decorativo, sem borda ou numeração meramente decorativa; ícones em tom secundário (`muted`), sem cor de marca. |
| TECH-RNF-05 | Licenças | Cada ícone de terceiros tem a origem e a licença registradas, e o aviso de licença exigido (MIT, no caso do devicon) fica versionado junto dos arquivos. |
| TECH-RNF-06 | SEO | Título e descrição únicos por idioma; páginas ligadas entre si por `hreflang`; link para a página no menu e no rodapé. |
| TECH-RNF-07 | Manutenibilidade | Categoria, nome, ícone e contexto de cada tecnologia ficam em `src/config/technologies.ts`; os textos traduzidos ficam em `common.json`. |

## 6. Interface e experiência

### 6.1. Composição

Layout editorial, sem cards, no mesmo padrão de Experience e Projects.

| Largura | Composição |
|---|---|
| ≥1024 px | Cada categoria em duas colunas separadas por filete: o `h2` na coluna estreita e a lista na larga. Dentro da lista, os itens ficam em duas colunas (`md:grid-cols-2` na coluna larga). |
| <1024 px | Coluna única: `h2` acima da lista; itens em duas colunas a partir de 768 px e em uma abaixo. |

- Cada item: ícone de 24 px à esquerda, nome em `foreground` e, abaixo, a linha de contexto em `muted` (texto pequeno). Sem rótulos ou emblemas de estado.
- Ícones monocromáticos em `currentColor`, em tom secundário; o monograma é um quadrado de cantos arredondados com 1 ou 2 letras, no mesmo tamanho e tom.
- A categoria Architecture lista conceitos, que não são marcas: seus itens usam texto, sem ícone e sem espaço reservado (decisão de consistência dentro da categoria).
- Sem animação de entrada, sem parallax e sem hover decorativo.

### 6.2. Estados

| Situação | Comportamento esperado |
|---|---|
| Tecnologia sem contexto documentado | Item sem a linha de contexto. |
| Nome longo (pt-BR) | Quebra de linha dentro da coluna, sem rolagem horizontal. |
| Navegação por teclado | Skip link, header (com o novo item), links de contexto (Should), footer. Foco visível. |
| `prefers-reduced-motion` | Sem efeito: a página não tem movimento. |
| JavaScript desabilitado | Página inteira legível. |

Não há estado de carregamento, vazio ou erro de dados: o conteúdo é estático.

## 7. Conteúdo e dados

### 7.1. Categorias e tecnologias (rascunho para aprovação)

Origem: currículo (seção Skills e cargos), `BUSINESS.md` (4.1), `CONTENT.md` (4.5), `experience.ts` e `projects.ts`. A coluna "Contexto" é o que a página exibe; "Experience" vem de `experience.ts` ou do currículo.

| Categoria (`en` / `pt-BR`) | Tecnologia | Contexto |
|---|---|---|
| Languages / Linguagens | C# | Experience |
| | JavaScript | Experience |
| | TypeScript | Football Stat Analytics · Reelix · FintaLab |
| | InterSystems Caché | Experience |
| Backend / Backend | .NET | Experience · Reelix |
| | ASP.NET Core | Experience · Reelix |
| | Node.js | Experience · Football Stat Analytics |
| | Entity Framework Core | Experience · Reelix |
| | Dapper | Experience |
| Databases / Bancos de dados | PostgreSQL | Experience · Reelix |
| | SQL Server | Experience |
| | MongoDB | Experience |
| | SQLite | Football Stat Analytics · FintaLab |
| Messaging and Caching / Mensageria e cache | RabbitMQ | Experience |
| | Redis | Experience |
| | Azure Service Bus | (sem contexto documentado; ver Q4) |
| Architecture / Arquitetura | REST APIs | Experience · Reelix |
| | Microservices | Experience |
| | Clean Architecture | Experience |
| | SOLID | Experience |
| | Event-Driven Architecture | Experience |
| | Automated testing | Football Stat Analytics |
| AI and Machine Learning / IA e aprendizado de máquina | OpenAI API | Football Stat Analytics · FintaLab |
| | RAG | Football Stat Analytics |
| Frontend and Mobile / Frontend e mobile (nova; ver Q3) | React Native | Reelix |
| | Expo | Reelix |
| Tools and Infrastructure / Ferramentas e infraestrutura | Azure Data Factory | Experience |
| | Supabase Auth | Reelix |
| | TMDB | Reelix |

Fora desta lista, até confirmação: **Domain-Driven Design** (consta em `BUSINESS.md` e `CONTENT.md`, mas não no currículo nem em nenhum cargo; ver Q5), Git, Docker, CI/CD e qualquer ferramenta sem registro. "Microservices" e "Event-Driven Architecture" vêm da seção Skills do currículo e do resumo dele; "Automated testing" vem dos 109 testes do Football Stat Analytics.

A categoria "Languages" usa os nomes do currículo; "TypeScript" vem dos projetos. Em "Frontend and Mobile" e "Tools and Infrastructure" entram só as tecnologias que `projects.ts` já exibe, para que as duas páginas não divirjam (TECH-RF-08).

### 7.2. Textos de interface (rascunho para aprovação)

| Chave | `en` | `pt-BR` |
|---|---|---|
| Título (`h1`) | Technologies | Tecnologias |
| Abertura | The languages, frameworks, data stores and practices I work with, by category, with where each one was used. | As linguagens, os frameworks, os bancos de dados e as práticas com que trabalho, por categoria e com onde cada um foi usado. |
| Nota | "Experience" refers to my professional work. The other names are personal, academic and conceptual projects. | "Experiência" se refere ao meu trabalho profissional. Os demais nomes são projetos pessoais, acadêmicos e conceituais. |
| Rótulo de contexto profissional | Experience | Experiência |
| Item de menu | Technologies | Tecnologias |

Categorias: Languages / Linguagens; Backend / Backend; Databases / Bancos de dados; Messaging and Caching / Mensageria e cache; Architecture / Arquitetura; AI and Machine Learning / IA e aprendizado de máquina; Frontend and Mobile / Frontend e mobile; Tools and Infrastructure / Ferramentas e infraestrutura.

### 7.3. SEO (rascunho para aprovação)

| Campo | `en` | `pt-BR` |
|---|---|---|
| Título | Technologies | Tecnologias |
| Descrição | Technologies and engineering practices Bruno Lucildo works with, from .NET and PostgreSQL to RabbitMQ and AI, grouped by category and linked to where they were used. | Tecnologias e práticas de engenharia com que Bruno Lucildo trabalha, de .NET e PostgreSQL a RabbitMQ e IA, por categoria e com onde foram usadas. |

O título segue o padrão das demais páginas (`<título> | Bruno Lucildo`).

### 7.4. Rotas

| Idioma | Caminho |
|---|---|
| en | `/en/technologies` |
| pt-BR | `/pt-BR/tecnologias` |

`routing.pathnames` ganha `/technologies: { en: "/technologies", "pt-BR": "/tecnologias" }`, `mainNavigation` ganha a chave `technologies` entre `projects` e `aiLab`, e `ARCHITECTURE.md` (7.1 e a lista de pendências) passa a registrar a rota.

### 7.5. Ícones

O usuário pediu ícones de marca, procurados na internet e, quando não houver, criados "próximos". Pesquisa feita em 2026-11-08:

| Fonte | Licença | Cobre |
|---|---|---|
| devicon 2.18.0 | MIT | C#, .NET Core, SQL Server, Entity Framework Core, Azure Data Factory, PostgreSQL, MongoDB, Redis, RabbitMQ, JavaScript, TypeScript, Node.js, SQLite |
| Simple Icons 16.36.0 | CC0-1.0 | .NET, PostgreSQL, MongoDB, Redis, RabbitMQ, JavaScript, TypeScript, Node.js, SQLite (usada só como reserva) |
| Nenhuma | — | ASP.NET Core, Dapper, InterSystems Caché, Azure Service Bus, OpenAI API, Supabase Auth, TMDB e, a confirmar na implementação, React Native, Expo e RAG |

Regras:

1. Ordem de escolha: devicon, depois Simple Icons, depois monograma próprio. O mapa final fica em `src/config/technologies.ts` e na tabela de origem, atualizada na implementação.
2. Os ícones são usados em versão monocromática, preenchida por `currentColor`; cores de marca não entram (identidade Dark Premium, "sem excesso de neon").
3. Para quem não tem ícone licenciado, o monograma é um quadrado arredondado com 1 ou 2 letras, no mesmo tamanho e tom. **Não imita nem recria o logotipo da marca**: um logotipo "parecido" seria uma imitação de marca registrada e poderia sugerir vínculo que não existe.
4. As tecnologias de Architecture (conceitos) não têm ícone (seção 6.1).
5. Os arquivos ficam em `public/images/technologies/` ou como componentes em `src/components/technologies/`, com a licença MIT do devicon versionada junto (`LICENSES.md`).
6. Os logotipos são marcas dos respectivos donos e servem só para identificar a tecnologia; a página não afirma aprovação nem parceria.

## 8. Critérios de aceitação

| ID | Cobre | Critério (Given / When / Then) |
|---|---|---|
| TECH-CA-01 | RF-01 | **Given** `/en/technologies` e `/pt-BR/tecnologias` **When** a página carrega **Then** há um único `h1`, o parágrafo de abertura e oito `h2` na ordem Languages, Backend, Databases, Messaging and Caching, Architecture, AI and Machine Learning, Frontend and Mobile, Tools and Infrastructure (nomes traduzidos em pt-BR). |
| TECH-CA-02 | RF-02 | **Given** qualquer página **When** o menu e o rodapé são lidos **Then** "Technologies"/"Tecnologias" aparece entre Projects e AI Lab e leva à rota do idioma; **Given** a rota ativa **Then** o item tem `aria-current="page"`. |
| TECH-CA-03 | RF-03 | **Given** cada categoria **Then** tem uma `ul` e cada item tem nome em texto; os itens com ícone têm um elemento decorativo `aria-hidden` (máscara de SVG ou monograma); as tecnologias da seção 7.1 aparecem na categoria e na ordem previstas. |
| TECH-CA-04 | RF-04, RF-07 | **Given** o texto das duas páginas **Then** não contém "%", "expert", "avançado", "anos de" nem barra de nível, e não cita a empresa, o curso nem a instituição. |
| TECH-CA-05 | RF-05, RF-06 | **Given** cada item **Then** a linha de contexto é exatamente a da seção 7.1 (por exemplo, PostgreSQL mostra "Experience · Reelix"); Football Stat Analytics e FintaLab nunca aparecem como "Experience". |
| TECH-CA-06 | RF-08 | **Given** as tecnologias exibidas nas páginas Experience e Projects **Then** cada uma tem uma entrada em Technologies (com a mesma grafia, exceto as variações da seção 7.1); **Given** uma tecnologia com contexto "Experience" **Then** ela consta em `experience.ts` ou no currículo; **Given** uma com contexto de projeto **Then** consta em `projects.ts`. |
| TECH-CA-07 | RF-09, RNF-04 | **Given** cada item com ícone **Then** o ícone tem 24 px e usa o mesmo tom `muted` do texto secundário; nenhum item de Architecture tem ícone ou espaço reservado. |
| TECH-CA-08 | RF-10 | **Given** o contexto de uma tecnologia **Then** "Experience" leva à rota de Experience e cada projeto leva ao detalhe (ou à lista); os links têm nome acessível e foco visível. (Should.) |
| TECH-CA-09 | RF-11, RNF-06 | **Given** a rota em cada idioma **Then** o `html` tem o `lang` certo, o título e a descrição são os da seção 7.3, não há `noindex`, o canonical aponta para a própria rota e os `hreflang` `en`, `pt-BR` e `x-default` estão corretos. |
| TECH-CA-10 | RF-12 | **Given** a versão em português **Then** os nomes das tecnologias estão na grafia original e só os títulos, a abertura, a nota e os rótulos de contexto estão traduzidos. |
| TECH-CA-11 | RNF-01 | **Given** a página **Then** não há título pulando nível e o contraste do texto e dos ícones atende AA; a ordem de tabulação segue o DOM. |
| TECH-CA-12 | RNF-02 | **Given** larguras de 360, 390, 768, 1366, 1440 e 1920 px **Then** não há rolagem horizontal, nos dois idiomas; **Given** 1366 px **Then** o texto corrido tem no máximo 80 caracteres por linha. |
| TECH-CA-13 | RNF-03, RNF-05 | **Given** o repositório **Then** não há dependência de runtime nova e os ícones de terceiros têm origem e licença registradas e o aviso MIT versionado. |
| TECH-CA-14 | Todos | **Given** o `package.json` **Then** `pnpm typecheck`, `pnpm check` e `pnpm test:e2e` passam sem erros, com a nova suíte `e2e/technologies.spec.ts` e os testes existentes de menu e rodapé atualizados. |

## 9. Dependências

| Dependência | Situação | Impacto |
|---|---|---|
| SPEC-010 Global Layout | Implementada | Header, footer e `main`; ganham o item de menu (verificar que sete itens cabem no cabeçalho em 1024 px e no menu móvel). |
| SPEC-008 Internationalization | Implementada na base | Rota localizada nova e conteúdo `en`/`pt-BR`. |
| SPEC-003 Experience e SPEC-004 Projects | Implementadas | Fontes de tecnologias por cargo e por projeto; Technologies deve permanecer consistente com elas (TECH-RF-08). |
| `ARCHITECTURE.md` | Existente | Registrar a rota (7.1) e remover a pendência "Rota da página Technologies". |
| `FEATURES.md` e README | Existentes | Apontar a SPEC-005 para este arquivo e atualizar a tabela de status. |

## 10. Riscos

| Risco | Mitigação |
|---|---|
| Parecer uma classificação de proficiência | Sem níveis, sem barras e sem "anos de uso"; a linha de contexto só diz onde foi usada (TECH-RF-04). |
| Tecnologia listada sem registro de uso | Só o que consta no currículo, nos repositórios ou nos documentos aprovados; itens sem fonte (DDD, Git, Docker) ficam de fora até o usuário confirmar (Q5). |
| Lista longa e visualmente repetitiva | Layout editorial em duas colunas, sem cards, e uma categoria enxuta por seção. |
| Logotipos de terceiros (marcas registradas) | Origem e licença registradas; uso só para identificar a tecnologia; monocromáticos; sem logotipos imitados (seção 7.5). |
| Mistura visual de ícones oficiais e monogramas | Mesmo tamanho, tom e traço; revisão visual na implementação; o usuário decide se prefere só texto (Q1). |
| Divergência com Experience e Projects | Fonte única mapeada e teste de consistência entre as páginas (TECH-CA-06). |
| Sete itens no menu apertarem o cabeçalho | Verificar a largura em 1024 px e em pt-BR ("Tecnologias" é mais longo); ajustar espaçamento, se preciso. |
| Currículo e site divergirem | O currículo é a origem da maioria dos itens; Microservices e Event-Driven Architecture saem da seção Skills dele. |

## 11. Perguntas abertas

| ID | Pergunta | Impacto | Dono | Bloqueia |
|---|---|---|---|---|
| Q1 | Os textos das seções 7.2 e 7.3 e os rótulos de contexto estão aprovados? | Conteúdo da página. | Bruno | **Resolvida (2026-11-08):** aprovados. |
| Q2 | A regra de ícones da seção 7.5 serve: ícone oficial (devicon, MIT) quando existir e monograma de 1 a 2 letras, **sem imitar o logotipo**, quando não existir? Você pediu um ícone "próximo" ao inexistente; recriar um logotipo seria imitar a marca, então proponho o monograma. | TECH-RF-09, aparência da lista. | Bruno | **Resolvida (2026-11-08):** aprovada (monograma sem imitar logotipos). |
| Q3 | A categoria "Frontend and Mobile" (React Native e Expo) e a inclusão de Supabase Auth e TMDB em "Tools and Infrastructure" estão corretas? Elas existem para a página ficar consistente com Projects, mas ampliam as categorias iniciais da `FEATURES.md`. | Seção 7.1. | Bruno | Não bloqueia (reversível). Implementada com a categoria nova. **Resolvida em 2026-11-08: default aceito pelo Bruno.** |
| Q4 | **Azure Service Bus** consta no currículo (Skills), mas em nenhum cargo. Entra na lista sem linha de contexto, ou prefere dizer onde usou ("Experience")? | Seção 7.1. | Bruno | Não bloqueia. Implementada com o default (sem contexto). **Resolvida em 2026-11-08: default aceito pelo Bruno.** |
| Q5 | **Domain-Driven Design** consta em `BUSINESS.md` e `CONTENT.md`, mas não no currículo nem em nenhum cargo. Pode entrar em Architecture com o contexto "Experience"? Git, Docker e CI/CD entram? Se sim, com qual contexto? | Seção 7.1. | Bruno | Não bloqueia. Implementada com o default (fora). **Resolvida em 2026-11-08: default aceito pelo Bruno.** |

## 12. Premissas

Decisões reversíveis adotadas neste refinamento.

1. Página própria em `/technologies` no menu principal (resposta do usuário), entre Projects e AI Lab.
2. São oito categorias: as sete da `FEATURES.md` e "Frontend and Mobile", acrescentada para manter a consistência com Projects (Q3).
3. "Architecture" lista conceitos; por não serem marcas, seus itens ficam sem ícone.
4. Entity Framework e Entity Framework Core são uma única entrada ("Entity Framework Core"), e "ASP.NET Core (.NET 10)" de Projects vira as entradas ".NET" e "ASP.NET Core".
5. Ícones em versão monocromática (`currentColor`) para respeitar a identidade Dark Premium; cores de marca não entram.
6. A linha de contexto lista "Experience" primeiro e os projetos depois, na ordem de `projects.ts`.
7. Technologies não tem teaser na Home nem no About na v1.

## 13. Decisões registradas

| Data | Decisão | Origem |
|---|---|---|
| 2026-11-08 | Technologies será uma página própria, no menu principal. | Resposta do usuário |
| 2026-11-08 | As tecnologias mostram onde foram usadas (Experience e projetos). | Resposta do usuário |
| 2026-11-08 | Categorias de IA e de ferramentas só com o que está documentado (currículo e repositórios). | Resposta do usuário |
| 2026-11-08 | Ícones de marca: procurados na internet e, se não houver, criados "próximos". O agente propôs devicon (MIT) com monograma próprio, sem imitar logotipos, aprovado pelo usuário (Q2). | Resposta do usuário; proposta do agente |
| 2026-11-08 | Textos de interface, SEO e regra de ícones aprovados; implementação autorizada. | Resposta do usuário (Q1 e Q2) |
| 2026-11-08 | Ícones de marca como máscara CSS do SVG versionado, em vez de SVG embutido; links de contexto (Should) ficam para depois. | Decisão técnica do agente |
| 2026-11-08 | A SPEC passa a viver em `.specs/005-technologies.md`, como as SPEC-001 a 004. | Premissa herdada |

## Refinamento

- 2026-11-08, v0.4.0: TECH-RF-10 entregue por decisão do Bruno. As linhas de contexto passam a ter links (Experience e projetos); o teste que garantia a lista sem links foi trocado pelos testes de TECH-CA-08. Os links ficam como texto sublinhado discreto, sem alvo de 44 px (são links dentro de linha de texto).
| Data | O que mudou | Motivo |
|---|---|---|
| 2026-11-08 | Versão 0.2.0: SPEC reescrita a partir do rascunho da `FEATURES.md` (v0.1) com requisitos numerados, rota, categorias com tecnologias, ícones, textos, SEO, critérios Given/When/Then, riscos e perguntas abertas. | Rascunho sem rota, sem itens e sem critérios verificáveis. |
| 2026-11-08 | Versão 0.3.0: textos e regra de ícones aprovados (Q1 e Q2); implementada (seção 15), TECH-CA-08 não entregue (Should), ícones como máscara CSS, Q3 a Q5 seguem com os defaults. | Aprovação do usuário e implementação. |

## 15. Implementação e verificação

Implementada na branch `feat/technologies` em 2026-11-08, depois da aprovação dos textos e da regra de ícones (Q1 e Q2).

- Novos: `src/config/technologies.ts` (fonte única: categorias, ícone, contexto e apelidos de nomes), `src/components/technologies/` (`TechnologiesContent`, `TechnologyCategorySection`, `TechnologyIcon`), `src/app/[locale]/technologies/page.tsx`, `public/images/technologies/` (17 SVG, `LICENSE-devicon.txt` e `LICENSES.md`) e `e2e/technologies.spec.ts`.
- Alterados: `src/i18n/routing.ts` (rota `/technologies` e `/tecnologias`), `src/config/navigation.ts` (item de menu), `src/lib/seo/metadata.ts` (namespace `technologies.metadata`), `src/content/{en,pt-BR}/common.json` (seção `technologies` e `navigation.items.technologies`), `biome.json` (os SVG de terceiros em `public/images/technologies` ficam fora do lint, para não editar os arquivos originais), `.docs/ARCHITECTURE.md`, `.specs/FEATURES.md` e o README.

Decisões de implementação:

- Os ícones de marca são uma máscara CSS do SVG versionado, pintada com a cor secundária (`bg-muted`), em vez de SVG embutido: o HTML não cresce com os caminhos (PostgreSQL e SQL Server têm cerca de 11 KB cada), o arquivo fica em cache e a cor vem do token. O monograma é um quadrado com as iniciais, no mesmo tamanho e tom. Ambos são `aria-hidden`, com o nome sempre em texto.
- 17 tecnologias usam ícone de marca (14 do devicon e 3 do Simple Icons: RabbitMQ, Expo e TMDB), 6 usam monograma (ASP.NET Core, Dapper, InterSystems Caché, Azure Service Bus, OpenAI API e RAG) e as 6 de Architecture ficam sem ícone. Supabase Auth usa o ícone do Supabase, e React Native usa a variante `original` do devicon, a única disponível.
- Dois nomes unificados: "Entity Framework" (Experience) e "Entity Framework Core" (Projects) viram "Entity Framework Core"; "ASP.NET Core (.NET 10)" vira ".NET" e "ASP.NET Core" (`technologyAliases`).
- O parágrafo de nota tem largura própria (`max-w-[30rem]`), porque em texto pequeno a coluna de leitura de 624 px passava de 80 caracteres por linha.

| Critério | Resultado | Evidência |
|---|---|---|
| TECH-CA-01 | Atendido | `h1` único e oito `h2` na ordem prevista, nos dois idiomas. |
| TECH-CA-02 | Atendido | Menu e rodapé mostram Projects, Technologies e AI Lab, com os caminhos do idioma e `aria-current` na página ativa. Conferido em 1024 px, em pt-BR: o menu cabe, com 30 px entre os links e o seletor de idioma. |
| TECH-CA-03 | Atendido | Cada categoria tem uma `ul`, nomes e contexto exatos da seção 7.1 e ícones `aria-hidden` (máscara de SVG ou monograma). |
| TECH-CA-04 | Atendido | Sem "%", sem níveis, sem empresa, curso ou instituição, sem expressões proibidas nem frases de busca de emprego. |
| TECH-CA-05 | Atendido | Linha de contexto igual à da seção 7.1 em 29 itens, nos dois idiomas. |
| TECH-CA-06 | Atendido | Quatro testes comparam `experience.ts`, `projects.ts` e `technologies.ts`. Mutação (marcar TypeScript como Experience) derruba três deles. |
| TECH-CA-07 | Atendido | Ícones de 24 px na cor do texto secundário; nenhum item de Architecture tem ícone nem espaço reservado. Mutação (`bg-primary`) derruba o teste de cor. |
| TECH-CA-08 | Atendido (v0.4.0, 2026-11-08) | Cada item da linha de contexto é um link: "Experience" leva a `/experience` (pt-BR: `/pt-BR/experiencia`) e cada projeto, ao detalhe, ou à lista no caso do FintaLab. Na v0.3.0 não havia links, porque seriam cerca de 35 repetidos que alongam a tabulação; o Bruno decidiu entregá-los (2026-11-08). Testes: links, rótulos e destinos de todos os itens, nos dois idiomas; a lista só tem esses links e nenhum botão; foco visível; clique leva ao detalhe do Reelix. |
| TECH-CA-09 | Atendido | Título, descrição, `lang`, Open Graph, canonical e `hreflang` (`en`, `pt-BR`, `x-default`) conferidos; sem `noindex`. |
| TECH-CA-10 | Atendido | Nomes de tecnologia na grafia original; só títulos, abertura, nota e rótulos traduzidos. |
| TECH-CA-11 | Atendido | Títulos sem pular nível; ordem de tabulação segue o DOM (a lista não tem elementos focáveis). Contraste dos ícones igual ao do texto secundário do site. |
| TECH-CA-12 | Atendido | Sem rolagem horizontal em 360, 390, 768, 1366, 1440 e 1920 px nos dois idiomas; parágrafos de abertura e nota com até 80 caracteres por linha em 1366 px. |
| TECH-CA-13 | Atendido | Nenhuma dependência nova (`package.json` intacto). Origem e licença dos ícones em `LICENSES.md`, aviso MIT em `LICENSE-devicon.txt`; um teste confere que os 17 arquivos existem, têm até 12 KB e são servidos como `image/svg+xml`. |
| TECH-CA-14 | Atendido | `pnpm typecheck`, `pnpm check` e `pnpm test:e2e` (238 testes) sem erros. |

Não verificado: o contraste dos ícones e do texto secundário não foi medido com ferramenta (só comparado ao token existente), e LCP e CLS não foram medidos.
