# SPEC-002 — About

## 1. Identificação

| Campo | Valor |
|---|---|
| Nome | About |
| Identificador | SPEC-002 |
| Slug | `002-about` |
| Versão | 0.3.0 |
| Status | Approved (textos, formação e SEO aprovados em 2026-11-07; pronta para implementação) |
| Data | 2026-11-07 |
| Origem | SPEC-002 de `.specs/FEATURES.md` (v0.1, Draft) |

Prioridades usadas: **Must** (obrigatório para a v1), **Should** (desejável; pode ser adiada sem bloquear a entrega).

## 2. Contexto

A página About apresenta a trajetória, a filosofia profissional e os interesses de Bruno. Hoje ela existe apenas como página provisória (título e "em construção"), marcada como `noindex`.

**Objetivo:** humanizar a marca pessoal e contextualizar a experiência profissional além da lista de tecnologias (`BUSINESS.md`, seção 6.1: o portfólio não deve ser uma reprodução do currículo).

**Relação com o produto:** complementa a Home e a página Experience. A Home mostra o posicionamento em poucos segundos; Experience detalha cargos, responsabilidades e resultados; o About conta como Bruno chegou até aqui, como trabalha e o que o interessa.

## 3. Escopo

### 3.1. Dentro do escopo

1. Apresentação pessoal em primeira pessoa.
2. Trajetória como narrativa de evolução (full-stack, backend, liderança técnica), sem cargos, datas ou empresas.
3. Filosofia de engenharia e a relação entre desenvolvimento e liderança técnica.
4. Interesse em inteligência artificial, apresentado como estudo.
5. Formação acadêmica, separada da narrativa profissional.
6. Links de continuidade para Experience e AI Lab.
7. Metadados da página nos dois idiomas, substituindo o `noindex` provisório.

### 3.2. Fora do escopo

- Fotografia no About (a foto fica no Hero da Home).
- Linha do tempo de cargos e períodos (pertence a Experience, SPEC-003).
- Nome da empresa, cargos exatos, datas de emprego e métricas profissionais (inclusive a redução de 80%).
- Lista de tecnologias e de projetos (SPEC-005 e SPEC-004).
- Mensagens de disponibilidade profissional ("Open to Work", "Available for Opportunities", "Hire Me" e equivalentes).
- Currículo em PDF e formulário de contato (SPEC-009 e SPEC-007).
- Parallax, animações de entrada e cards (o About é tipográfico).
- Biografia extensa: o `CONTENT.md` (seção 4.2) pede evitar uma autobiografia.

## 4. Requisitos funcionais

| ID | Prioridade | Requisito |
|---|---|---|
| ABOUT-RF-01 | Must | A página tem um `h1`, um parágrafo de abertura e quatro blocos, nesta ordem: trajetória, desenvolvimento e liderança, exploração de IA e formação. Cada bloco tem um `h2`. |
| ABOUT-RF-02 | Must | Os textos estão em primeira pessoa, com os conteúdos da seção 8, sem nome de empresa, cargos, datas de emprego ou métricas. |
| ABOUT-RF-03 | Must | O bloco de formação lista cada curso com nome, instituição e período ou situação ("em andamento" para o curso em curso), separado da narrativa profissional. |
| ABOUT-RF-04 | Should | O bloco de trajetória tem um link para Experience e o bloco de IA tem um link para o AI Lab, ambos para a rota do idioma ativo. |
| ABOUT-RF-05 | Must | Todo texto visível vem dos arquivos de conteúdo `en` e `pt-BR`, sem condicionais de idioma nos componentes. |
| ABOUT-RF-06 | Must | A página define `title`, `description`, canonical, `hreflang` e Open Graph para cada idioma e deixa de ser `noindex`. |
| ABOUT-RF-07 | Must | O texto usa o container de leitura (máximo de 760 px), com no máximo 80 caracteres por linha em desktop. |
| ABOUT-RF-08 | Must | A página não contém as expressões proibidas da seção 3.2 nem as frases genéricas que o `CONTENT.md` (seção 9) manda evitar. |
| ABOUT-RF-09 | Must | A página não usa foto, parallax nem animação de entrada. |

## 5. Requisitos não funcionais

| ID | Categoria | Requisito |
|---|---|---|
| ABOUT-RNF-01 | Renderização | A página é gerada estaticamente, sem Client Components, e o conteúdo está no HTML inicial. |
| ABOUT-RNF-02 | Desempenho | LCP até 2,5 s e CLS até 0,1 em build de produção. A página não carrega imagens. |
| ABOUT-RNF-03 | Acessibilidade | WCAG 2.2 AA: contraste, foco visível, hierarquia de títulos sem saltos e alvos de toque de pelo menos 44 px nos links. |
| ABOUT-RNF-04 | Responsividade | Sem rolagem horizontal em 360, 390, 768, 1366, 1440 e 1920 px, nos dois idiomas. |
| ABOUT-RNF-05 | Consistência | Os fatos do About (equipe de cinco desenvolvedores, mais de 10 anos, formação) coincidem com a Home, com Experience e com o currículo. |
| ABOUT-RNF-06 | Tipos e qualidade | TypeScript strict; `pnpm check`, `pnpm typecheck` e `pnpm build` sem erros; paridade de chaves entre `en` e `pt-BR` validada pelo typecheck. |

## 6. Interface e experiência

### 6.1. Composição

Layout editorial, alinhado à esquerda, sem cards.

| Largura | Composição |
|---|---|
| ≥1024 px | Cada bloco em duas colunas: o `h2` na coluna estreita e o texto na coluna larga, com largura de leitura limitada. A abertura ocupa a coluna larga, abaixo do `h1`. |
| <1024 px | Coluna única: `h2` acima do texto. |

- O `h1` usa `text-h1` e o parágrafo de abertura usa `text-body-lg` em cor secundária.
- Os blocos são separados por espaçamento generoso e por um filete discreto, não por caixas.
- A formação usa uma lista com três informações por item (curso, instituição, período ou situação), sem ícones nem selos de nível.
- Os links usam a variante `text` do botão.

### 6.2. Estados

| Situação | Comportamento esperado |
|---|---|
| Texto mais longo em pt-BR | Quebra de linha dentro da coluna, sem rolagem horizontal. |
| Navegação por teclado | Ordem: skip link, header, link de Experience, link do AI Lab, footer, com foco visível. |
| `prefers-reduced-motion` | Sem efeito: a página não tem movimento. |
| JavaScript desabilitado | Página inteira legível e links funcionais. |

Não há estado de carregamento, vazio ou erro: a página é estática.

## 7. Conteúdo e dados

Origem: `CONTENT.md` (4.2, 5.1 e 5.3), `BUSINESS.md` (4.1 a 4.3) e o currículo em `public/documents/resume/`. Os textos abaixo foram escritos apenas com fatos já registrados nesses documentos e **aprovados pelo Bruno em 2026-11-07** (Q1, Q2 e Q3).

### 7.1. Textos

| Elemento | Inglês (`en`) | Português (`pt-BR`) | Situação |
|---|---|---|---|
| `h1` | About | Sobre | Aprovado (2026-11-07) |
| Abertura | I'm a senior backend developer and technical lead, working mostly with C# and .NET. I design and modernize enterprise systems, and I lead a team of five developers while staying hands-on in architecture and code. | Sou desenvolvedor backend sênior e líder técnico, trabalhando principalmente com C# e .NET. Projeto e modernizo sistemas corporativos e lidero uma equipe de cinco desenvolvedores, sem deixar de atuar na arquitetura e no código. | Aprovado (2026-11-07) |
| Bloco 1: título | How I got here | Minha trajetória | Aprovado (2026-11-07) |
| Bloco 1: texto | I started as a full-stack developer maintaining legacy enterprise applications. Over the years I moved into backend architecture for a new platform and, later, into technical leadership. Working with both legacy and modern code shaped how I decide: I weigh business continuity, scalability and maintainability together. | Comecei como desenvolvedor full-stack, mantendo aplicações corporativas legadas. Com os anos, passei à arquitetura backend de uma nova plataforma e, depois, à liderança técnica. Trabalhar com código legado e moderno moldou a forma como decido: pondero continuidade do negócio, escalabilidade e manutenibilidade em conjunto. | Aprovado (2026-11-07) |
| Bloco 2: título | Development and leadership | Desenvolvimento e liderança | Aprovado (2026-11-07) |
| Bloco 2: texto | I favor Clean Architecture and SOLID because they keep systems easy to change, and I pick tools for the problem at hand. As a technical lead, I review code, mentor developers and help define the engineering standards the team works by. | Prefiro Clean Architecture e SOLID porque mantêm os sistemas fáceis de evoluir, e escolho as ferramentas pelo problema em questão. Como líder técnico, faço revisões de código, oriento desenvolvedores e ajudo a definir os padrões de engenharia do time. | Aprovado (2026-11-07) |
| Bloco 3: título | Exploring AI | Explorando IA | Aprovado (2026-11-07) |
| Bloco 3: texto | I'm studying AI systems development and management, and I use study projects to explore LLMs, AI agents, RAG and prompt engineering, with a focus on validating what the models produce. They are learning projects, and I present them that way in the AI Lab. | Estudo desenvolvimento e gestão de sistemas de IA e uso projetos de estudo para explorar LLMs, agentes de IA, RAG e engenharia de prompts, com foco em validar o que os modelos produzem. São projetos de aprendizado, e é assim que os apresento no AI Lab. | Aprovado (2026-11-07) |
| Bloco 4: título | Education | Formação | Aprovado (2026-11-07) |
| Formação 1 | Undergraduate degree in Systems Analysis and Development, Federal Institute of Education, Science and Technology of São Paulo (IFSP), 2009–2013 | Graduação em Análise e Desenvolvimento de Sistemas, Instituto Federal de Educação, Ciência e Tecnologia de São Paulo (IFSP), 2009–2013 | Aprovado (nome conferido no LinkedIn, Q1) |
| Formação 2 | Postgraduate degree (Master's program) in AI Systems Development and Management, Coders University, in progress | Pós-graduação (programa Master) em Desenvolvimento e Gestão de Sistemas de IA, Coders University, em andamento | Aprovado (rótulo conforme LinkedIn e GitHub, Q1) |
| Link do bloco 1 | View experience | Ver experiência | Reutiliza o texto da Home |
| Link do bloco 3 | Explore the AI Lab | Explorar o AI Lab | Reutiliza o texto da Home |
| Title (SEO) | About \| Bruno Lucildo | Sobre \| Bruno Lucildo | Aprovado (2026-11-07) |
| Description (SEO) | Bruno Lucildo's path from full-stack developer to backend technical lead, how he works, and his study of AI systems. | A trajetória de Bruno Lucildo de desenvolvedor full-stack a líder técnico backend, como ele trabalha e seus estudos em sistemas de IA. | Aprovado (2026-11-07) |

### 7.2. Rastreabilidade dos fatos

| Afirmação | Fonte |
|---|---|
| Desenvolvedor backend sênior e líder técnico | `BUSINESS.md` 1.3 |
| C# e .NET como base | `BUSINESS.md` 4.1 |
| Liderança de uma equipe de cinco desenvolvedores | `CONTENT.md` 5.1; `BUSINESS.md` 4.2 |
| Início como full-stack em aplicações corporativas legadas; passagem à arquitetura backend de uma nova plataforma; liderança técnica | Currículo e LinkedIn (experiência profissional, de 2016 ao presente) |
| Equilíbrio entre continuidade do negócio, escalabilidade e manutenibilidade | Currículo (resumo da atuação de liderança) |
| Clean Architecture, SOLID, revisões de código, mentoria e padrões de engenharia | `BUSINESS.md` 4.1 e 4.2 |
| Estudos em IA, LLMs, agentes, RAG e engenharia de prompts, com foco em validação | `BUSINESS.md` 4.3; `CONTENT.md` 5.3; README do perfil público no GitHub |
| Formação | `CONTENT.md` 5.3; LinkedIn ("Postgraduate Degree, Master's Program" na Coders University; IFSP, 2009–2013); perfil público no GitHub |

As afirmações de postura ("prefiro", "escolho as ferramentas pelo problema", "pondero") são a voz do autor e dependem da sua aprovação (Q2). Não há afirmações de resultado nem números.

## 8. Critérios de aceitação

| ID | Cobre | Critério (Given / When / Then) |
|---|---|---|
| ABOUT-CA-01 | RF-01 | **Given** `/en/about` **When** a página carrega **Then** há um único `h1`, o parágrafo de abertura e quatro `h2` na ordem trajetória, desenvolvimento e liderança, IA e formação. O mesmo vale para `/pt-BR/sobre`. |
| ABOUT-CA-02 | RF-02, RF-08 | **Given** o conteúdo dos dois idiomas **When** buscado por nome de empresa do currículo, "80%", "Open to Work", "Available for Opportunities", "Available for Hire", "Looking for a New Job", "Hire Me", "paixão por tecnologia" e "passion for technology" **Then** não há ocorrências. |
| ABOUT-CA-03 | RF-03 | **Given** o bloco de formação **When** renderizado **Then** cada curso mostra nome, instituição e período ou situação, e o curso em andamento exibe "in progress" (`en`) ou "em andamento" (`pt-BR`). |
| ABOUT-CA-04 | RF-04 | **Given** `/en/about` **When** o usuário ativa o link de experiência **Then** navega para `/en/experience`; **When** ativa o link do AI Lab **Then** navega para `/en/ai-lab`. Em pt-BR os destinos são `/pt-BR/experiencia` e `/pt-BR/ai-lab`. |
| ABOUT-CA-05 | RF-05 | **Given** `/en/about` e `/pt-BR/sobre` **When** inspecionadas **Then** não há texto visível fora dos arquivos de conteúdo e nenhuma frase aparece em idioma diferente do da página (exceto nomes próprios e termos técnicos). |
| ABOUT-CA-06 | RF-06 | **Given** o HTML de `/en/about` e `/pt-BR/sobre` **Then** cada uma tem `title`, `description`, canonical, `hreflang` para as duas versões e Open Graph próprios, `<html lang>` correto e **nenhuma** meta `robots` com `noindex`. |
| ABOUT-CA-07 | RF-07 | **Given** largura ≥1024 px **When** medida a coluna de texto **Then** a largura não excede 760 px e nenhuma linha passa de 80 caracteres. |
| ABOUT-CA-08 | RF-09, RNF-01 | **Given** o HTML da página **Then** não contém `<img>`, nenhuma camada de parallax e nenhuma classe de animação de entrada, e a página funciona sem JavaScript. |
| ABOUT-CA-09 | RNF-03 | **Given** navegação apenas por teclado **When** o usuário percorre a página **Then** a ordem é skip link, header, link de experiência, link do AI Lab, footer, com foco visível. |
| ABOUT-CA-10 | RNF-04 | **Given** as larguras 360, 390, 768, 1366, 1440 e 1920 px **Then** `scrollWidth` não excede `innerWidth`, em ambos os idiomas. |
| ABOUT-CA-11 | RNF-05 | **Given** os textos aprovados **When** comparados com a Home, Experience e o currículo **Then** não há divergência de fatos (tamanho da equipe, anos de experiência, formação). |
| ABOUT-CA-12 | RNF-06 | **Given** o código da página **Then** `pnpm check`, `pnpm typecheck` e `pnpm build` terminam sem erros. |

## 9. Dependências

| Dependência | Situação | Impacto |
|---|---|---|
| SPEC-010 Global Layout | Implementada | Header, footer, skip link e `main`. |
| SPEC-008 Internationalization | Implementada na base | Rotas, conteúdo `en`/`pt-BR` e metadados. |
| Design system | Implementado | Container de leitura, tipografia e botão `text`. |
| SPEC-001 Home | Implementada | Reutiliza os textos dos links e os fatos já aprovados. |
| SPEC-003 Experience | Pendente | Destino do link de experiência (hoje página provisória) e fonte única dos cargos e datas. |
| SPEC-006 AI Lab | Pendente | Destino do link do AI Lab. |

## 10. Riscos

| Risco | Mitigação |
|---|---|
| Afirmações de postura que não refletem como Bruno se descreve | Aprovação frase a frase (Q2) antes da publicação. |
| Texto virar cópia do currículo ou repetir Experience | Escopo sem cargos, datas nem empresas; critério ABOUT-CA-02. |
| Rótulo da pós-graduação induzir a "mestrado" (curso lato sensu) | Conferir o nome oficial e o rótulo adequado (Q1). |
| Divergência entre About, Home, Experience e currículo | ABOUT-CA-11 e fonte única dos fatos (`CONTENT.md` 5.1). |
| Frases genéricas ("paixão por tecnologia") | ABOUT-RF-08 e ABOUT-CA-02. |

## 11. Perguntas abertas

| ID | Pergunta | Impacto | Dono | Bloqueia |
|---|---|---|---|---|
| Q1 | O rótulo "pós-graduação (programa Master)" e os nomes oficiais dos cursos e instituições estão corretos? O LinkedIn escreve "Postgraduate Degree, Master's Program" na Coders University e traz o nome completo do IFSP; o currículo escreve apenas "Master's". | Evita induzir a leitura de mestrado acadêmico; ABOUT-RF-03 e ABOUT-CA-11. | Bruno | **Resolvida (2026-11-07):** rótulo "pós-graduação (programa Master)" aprovado. |
| Q2 | Os textos do rascunho (seção 7.1), inclusive as frases de postura, estão aprovados ou precisam de ajustes? | Todo o conteúdo do About. | Bruno | **Resolvida (2026-11-07):** textos aprovados sem ajustes. |
| Q3 | O título e a descrição de SEO propostos estão aprovados? | ABOUT-RF-06. | Bruno | **Resolvida (2026-11-07):** aprovados. |

## 12. Premissas

Decisões reversíveis adotadas neste refinamento.

1. A página usa um layout editorial em duas colunas no desktop e coluna única abaixo de 1024 px.
2. O link para Experience e o link para o AI Lab entram como Should, pois a SPEC original pedia navegação para estudos relacionados apenas em Experience.
3. O `h1` é "About"/"Sobre", igual ao item de menu, e a abertura carrega a apresentação.
4. Os fatos da trajetória (início como full-stack em sistemas legados, backend, liderança) vêm do currículo e entram sem datas nem empresa.
5. A SPEC passa a viver em `.specs/002-about.md`, como a SPEC-001. A seção SPEC-002 de `FEATURES.md` aponta para este arquivo.

## 13. Decisões registradas

| Data | Decisão | Origem |
|---|---|---|
| 2026-11-07 | Estrutura de narrativa editorial, sem cargos nem datas. | Resposta do usuário |
| 2026-11-07 | Sem nome de empresa no About. | Resposta do usuário |
| 2026-11-07 | Sem fotografia no About; a foto fica no Hero. | Resposta do usuário |
| 2026-11-07 | O rascunho dos textos é redigido por Claude, com revisão e aprovação do usuário. | Resposta do usuário |
| 2026-11-07 | Anos de experiência passam de "8+" para "10+" (LinkedIn: desde jul/2016), em todo o site. | Resposta do usuário |
| 2026-11-07 | Nenhuma métrica de resultado é publicada no About nem na Home; validação fica para a SPEC-003 (Experience). | Resposta do usuário |
| 2026-11-07 | Textos do About (7.1), rótulo da formação 2 e SEO aprovados sem ajustes (Q1, Q2, Q3). | Resposta do usuário |

## Refinamento

| Data | O que mudou | Motivo |
|---|---|---|
| 2026-11-07 | Requisitos numerados com prioridade (ABOUT-RF-01 a 09) e requisitos não funcionais (ABOUT-RNF-01 a 06). | A versão 0.1 não tinha IDs, prioridades nem requisitos não funcionais. |
| 2026-11-07 | Critérios de aceitação em Given/When/Then (ABOUT-CA-01 a 12). | "Informações revisadas" e "hierarquia visual consistente" não eram verificáveis. |
| 2026-11-07 | Escopo fechado e fronteira com Experience: trajetória como narrativa, sem cargos, datas ou empresa. | "Trajetória profissional" se sobrepunha à SPEC-003 e ao currículo. |
| 2026-11-07 | Fotografia removida do escopo do About. | A SPEC original a deixava condicional ("caso aprovada"); decisão do usuário. |
| 2026-11-07 | Rascunho dos textos nos dois idiomas, com rastreabilidade de cada fato. | Os textos não existiam e o conteúdo é o ponto mais pessoal do site. |
| 2026-11-07 | Adicionados metadados, estados, links de continuidade e remoção do `noindex` provisório. | A SPEC não cobria SEO, estados nem a transição da página provisória. |
| 2026-11-07 | Movida de `FEATURES.md` para `.specs/002-about.md`. | `.specs/README.md` prevê separar por funcionalidade conforme o projeto cresce. |
| 2026-11-07 | Rótulo da formação 2 trocado para "pós-graduação" e foco em validação incluído no bloco de IA, com base no perfil público do GitHub. O LinkedIn exige login e não pôde ser consultado. | Complemento de informações a pedido do usuário. |
| 2026-11-07 | Formação atualizada com os nomes do LinkedIn (IFSP; "pós-graduação, programa Master") após leitura do PDF exportado do perfil. | Complemento de informações a pedido do usuário. |
| 2026-11-07 | Versão 0.3.0: textos, formação e SEO aprovados; Q1 a Q3 resolvidas; "8+" trocado por "10+". | Decisões do usuário na retomada do projeto. |
