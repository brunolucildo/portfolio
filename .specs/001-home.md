# SPEC-001 — Home

## 1. Identificação

| Campo | Valor |
|---|---|
| Nome | Home |
| Identificador | SPEC-001 |
| Slug | `001-home` |
| Versão | 0.8.0 |
| Status | In Review (v0.8.0 implementada: três projetos em destaque, com o FintaLab; inclui o fallback em JavaScript do parallax, HOME-RF-14, confirmado no Firefox pelo usuário em 2026-11-07; aguardam validação final a revisão de conteúdo provisório e o domínio) |
| Data | 2026-11-07 |
| Origem | SPEC-001 de `.specs/FEATURES.md` (v0.1, Draft) |

Prioridades usadas: **Must** (obrigatório para a v1), **Should** (desejável; pode ser adiada sem bloquear a entrega).

## 2. Contexto

A Home é a principal porta de entrada do portfólio. Deve apresentar rapidamente a identidade profissional, o posicionamento e os caminhos para explorar o conteúdo, sem concentrar toda a trajetória em uma única página (`CONTENT.md`, seção 4.1).

**Objetivo:** transmitir maturidade técnica, experiência em desenvolvimento backend, liderança e interesse por engenharia e novas tecnologias.

**Relação com o produto:** é o ponto de partida dos dois públicos principais (profissionais e lideranças de engenharia; recrutadores) e distribui o tráfego para Projects, Experience, AI Lab e Contact. Não é uma página de procura por emprego (`BUSINESS.md`, seções 1.1 e 8.3).

## 3. Escopo

### 3.1. Dentro do escopo

1. **Hero:** posicionamento profissional, mensagem principal, mensagem complementar, CTAs, fotografia e parallax.
2. **Faixa de experiência:** três fatos verificáveis, com link para Experience.
3. **Projetos em destaque:** Football Stat Analytics (projeto acadêmico), Reelix (projeto pessoal) e FintaLab (conceito de produto), cada um com estado explícito e link para o repositório público.
4. **Destaque do AI Lab:** bloco de chamada com link para a página AI Lab.
5. **Caminhos de contato:** CTA "Get in Touch" no Hero. Os canais completos ficam no footer (SPEC-010).
6. **Metadados** da Home nos dois idiomas.

### 3.2. Fora do escopo

- Formulário de contato (SPEC-007).
- Seção de tecnologias na Home.
- Estudos de caso profissionais na Home, até o estado e as métricas serem validados.
- A métrica "redução de 80% no tempo de inclusão de itens em pedidos de venda": não validada (`CONTENT.md`, 6.3).
- Nome de empresa, cargos anteriores e linha do tempo (pertencem a Experience, SPEC-003).
- Mensagens de disponibilidade profissional ("Open to Work", "Available for Opportunities", "Hire Me" e equivalentes).
- Header, footer, menu e Language Switcher (SPEC-010, já implementados).
- Blog, depoimentos, contadores animados e indicadores de proficiência.

## 4. Requisitos funcionais

| ID | Prioridade | Requisito |
|---|---|---|
| HOME-RF-01 | Must | O Hero exibe, nesta ordem: identificação de posicionamento, título principal (`h1`) e mensagem complementar, com os textos da seção 8. |
| HOME-RF-02 | Must | O Hero oferece dois CTAs: "Explore My Work" (principal) para a página Projects e "Get in Touch" (secundário) para a página Contact. |
| HOME-RF-03 | Must | A faixa de experiência exibe os três fatos da seção 8, com um link para Experience. |
| HOME-RF-04 | Must | O destaque de projetos apresenta o Football Stat Analytics, o Reelix e o FintaLab, nessa ordem, cada um com nome, descrição curta, categoria, estado atual explícito e link para o repositório (HOME-RF-13). Nome, categoria, estado e descrição vêm da mesma fonte da página Projects (SPEC-004, PROJ-RF-14). Um link para Projects aparece abaixo dos cards. |
| HOME-RF-05 | Should | O destaque do AI Lab apresenta uma descrição do escopo da seção e um link para a página AI Lab, sem citar experimentos ou resultados específicos. |
| HOME-RF-06 | Must | O Hero possui um espaço para fotografia profissional: à direita do texto a partir de 1024 px e abaixo do texto em larguras menores. Sem o arquivo da foto, o Hero se apresenta apenas com texto, sem espaço vazio. |
| HOME-RF-07 | Must | O Hero aplica parallax em 2 a 3 camadas decorativas, ativo somente a partir de 1024 px e sem `prefers-reduced-motion: reduce`. |
| HOME-RF-08 | Must | Todo texto visível vem dos arquivos de conteúdo `en` e `pt-BR`, sem condicionais de idioma nos componentes. |
| HOME-RF-09 | Must | A Home define `title`, `description`, canonical, `hreflang` e Open Graph para cada idioma. |
| HOME-RF-10 | Must | A página tem um único `h1`, um `h2` por bloco abaixo do Hero e usa os landmarks do layout global (`header`, `main`, `footer`). |
| HOME-RF-11 | Should | O Hero tem animação de entrada discreta (fade-in com slide-up curto), sem atrasar o acesso ao conteúdo. |
| HOME-RF-12 | Must | A página não contém as expressões proibidas da seção 3.2 nem afirma resultados, métricas ou cargos não validados. |
| HOME-RF-13 | Must | Cada card de projeto tem um link externo "View on GitHub" para o repositório público do projeto, aberto em nova aba com `rel="noopener noreferrer"` e indicação acessível de nova aba. |
| HOME-RF-14 | Must | Em navegadores sem suporte a scroll-driven animations em CSS (ex.: Firefox), o parallax do Hero funciona por um fallback em JavaScript, com os mesmos deslocamentos, a mesma rotação e as mesmas condições de ativação de HOME-RF-07. Onde o CSS é suportado, o fallback não é ativado. |

## 5. Requisitos não funcionais

| ID | Categoria | Requisito |
|---|---|---|
| HOME-RNF-01 | Desempenho | LCP até 2,5 s, INP até 200 ms e CLS até 0,1 (`ARCHITECTURE.md`, 10.4), medidos em build de produção. |
| HOME-RNF-02 | Desempenho | A fotografia reserva suas dimensões para não causar deslocamento de layout, usa formato moderno e é carregada com prioridade por estar na primeira dobra. |
| HOME-RNF-03 | Renderização | A Home é gerada estaticamente. O conteúdo essencial está no HTML inicial. Componentes de cliente são usados apenas onde há interação ou movimento. |
| HOME-RNF-04 | Acessibilidade | Atende a WCAG 2.2 AA: contraste, foco visível, ordem de tabulação lógica, alvos de toque de pelo menos 44 px nos CTAs. |
| HOME-RNF-05 | Acessibilidade | Camadas decorativas do parallax são ocultas de leitores de tela (`aria-hidden`). A fotografia tem texto alternativo no idioma da página. |
| HOME-RNF-06 | Movimento | O parallax (CSS e fallback JS) só usa `transform` e `opacity`, não altera o comportamento natural do scroll e não move o texto principal. O fallback usa listener de scroll passivo, atualiza no máximo uma vez por quadro (`requestAnimationFrame`) e não força leitura de layout a cada evento. |
| HOME-RNF-07 | Responsividade | Sem rolagem horizontal nas larguras 360, 390, 768, 1366, 1440 e 1920 px (`QA.md`, seção 5). |
| HOME-RNF-08 | Segurança | Links externos, se houver, usam `rel="noopener noreferrer"`. Nenhum dado pessoal além dos canais públicos aprovados. |
| HOME-RNF-09 | Tipos e qualidade | TypeScript strict, `pnpm check`, `pnpm typecheck` e `pnpm build` sem erros. |

## 6. Interface e experiência

### 6.1. Composição

| Bloco | Composição | Observações |
|---|---|---|
| Hero | Texto à esquerda, fotografia à direita (≥1024 px). Coluna única em larguras menores, com a foto abaixo do texto. | Título em `text-display`. Muito espaço negativo. |
| Faixa de experiência | Três itens em linha (≥768 px) ou em coluna (<768 px), com link para Experience. | Sem cards idênticos: apresentada como faixa tipográfica. |
| Projetos em destaque | Três cards em colunas (≥1024 px) ou empilhados (<1024 px), cada um com categoria, estado, descrição e link para o GitHub; link para Projects abaixo. | Usa `Card` (sem hover, pois o card não é clicável) e `Badge`. |
| AI Lab | Bloco de chamada com título, texto curto e link. | Visual coerente com o restante, sem criar nova identidade. |

### 6.2. Estados

| Situação | Comportamento esperado |
|---|---|
| Foto ausente | Hero em coluna de texto, sem reserva de espaço vazio. |
| `prefers-reduced-motion: reduce` | Sem parallax, sem animação de entrada. Todo o conteúdo visível e estático. |
| Largura abaixo de 1024 px | Sem parallax. Foto abaixo do texto. |
| JavaScript desabilitado | Todo o texto, os CTAs e os links permanecem visíveis e funcionais. O parallax continua ativo onde o CSS o suporta; no restante, as camadas ficam estáticas. |
| Navegador sem scroll-driven animations | O fallback em JavaScript move as camadas (HOME-RF-14). Se o JavaScript falhar ou estiver desabilitado, as camadas ficam estáticas e a página permanece íntegra. |
| Texto em pt-BR mais longo | Quebra de linha sem estourar o container nem gerar rolagem horizontal. |
| Foco por teclado | Anel de foco verde visível em CTAs e links, na ordem visual. |

Não há estado de carregamento nem de erro: a página é estática e não consome dados externos.

## 7. Parallax (HOME-RF-07)

- Aplica-se somente ao Hero.
- 2 a 3 camadas geométricas decorativas (formas, gradientes discretos em verde e tons próximos ao fundo), sem fotografia animada.
- Ativo a partir de 1024 px; desligado em tablet e mobile.
- Desligado quando `prefers-reduced-motion: reduce`.
- Sem scroll hijacking, sem dependência do movimento do cursor, sem biblioteca de animação (decisão aprovada em `ARCHITECTURE.md`, seção 17).
- Intensidade (v0.6.0): deslocamento total de 140, 300 e 520 px (fundo, meio e frente) ao longo dos primeiros 80vh de scroll; a camada da frente também gira de 12° a 100°. Halo a 30% de opacidade e anel e quadrado com contorno de 2 px em verde, posicionados para ficarem visíveis ao redor da fotografia. Cobertos por testes em `e2e/home.spec.ts`.

### 7.1. Fallback em JavaScript (HOME-RF-14, v0.7.0)

Decisão do usuário em 2026-11-07: o efeito deve aparecer também no Firefox, que não suporta `animation-timeline` (scroll-driven animations).

- **Aprimoramento progressivo:** o CSS continua sendo o caminho principal. O fallback só é ativado quando `CSS.supports("animation-timeline: scroll()")` é falso. Onde o CSS funciona, nenhum listener é registrado.
- **Componente de cliente mínimo**, sem biblioteca, limitado ao Hero. O texto, os CTAs e a foto continuam renderizados no servidor.
- **Mesmos valores do CSS:** deslocamento de 140, 300 e 520 px (fundo, meio e frente) ao longo dos primeiros 80vh de scroll e rotação de 12° a 100° na camada da frente. O CSS do parallax não anima `opacity`, então o fallback também não. Os números ficam em uma única fonte: as variáveis `--parallax-*` de `globals.css`, usadas pelas keyframes e lidas pelo JavaScript.
- **Implementação:** `src/components/sections/HeroParallaxLayers.tsx` (componente de cliente com as três camadas). Quando ativo, marca o contêiner com `data-parallax-fallback="active"`, que também serve de gancho para os testes.
- **Mesmas condições de ativação:** largura mínima de 1024 px e sem `prefers-reduced-motion: reduce`. O fallback observa as duas media queries (`matchMedia` com `change`) e, ao deixarem de valer, remove o listener e devolve as camadas à posição original, sem recarregar a página.
- **Desempenho e scroll natural:** listener `scroll` com `{ passive: true }`, atualização por `requestAnimationFrame` (no máximo uma por quadro), progresso calculado a partir de `scrollY`, escrevendo só `transform` e `opacity` (ou variáveis CSS que os controlam). Sem `preventDefault`, sem scroll suave simulado e sem leitura de layout a cada evento.
- **Limpeza:** ao desmontar o componente, remove listeners, observadores e quadros pendentes.
- **Acessibilidade:** as camadas continuam `aria-hidden`.

## 8. Conteúdo e dados

Origem: `CONTENT.md`, `BUSINESS.md`, `SEO.md` e `.specs/FEATURES.md`. A coluna Situação indica se o texto está aprovado ou é provisório.

| Elemento | Inglês (`en`) | Português (`pt-BR`) | Fonte | Situação |
|---|---|---|---|---|
| Identificação | Senior Backend Developer \| Technical Lead | Desenvolvedor Backend Sênior \| Líder Técnico | BUSINESS 1.3 | Aprovado |
| Título (`h1`) | Engineering beyond code. | Engenharia além do código. | SPEC-001 original | Aprovado |
| Mensagem complementar | Building scalable systems, leading engineering teams and exploring the future of technology. | Construindo sistemas escaláveis, liderando times de engenharia e explorando o futuro da tecnologia. | SPEC-001 original | Aprovado |
| CTA principal | Explore My Work | Explorar meu trabalho | CONTENT 4.1 | Aprovado |
| CTA secundário | Get in Touch | Entrar em contato | CONTENT 4.1 | Aprovado |
| Fato 1 | 10+ years of experience | Mais de 10 anos de experiência | CONTENT 5.1; LinkedIn (desde jul/2016) | Aprovado (atualizado de 8+ em 2026-11-07) |
| Fato 2 | Backend development and technical leadership | Desenvolvimento backend e liderança técnica | CONTENT 5.1 | Aprovado |
| Fato 3 | Leading a team of five developers | Liderando uma equipe de cinco desenvolvedores | CONTENT 5.1 e BUSINESS 4.2 | Aprovado |
| Football: nome | Football Stat Analytics | Football Stat Analytics | CONTENT 6.1 | Aprovado |
| Football: categoria | Academic project | Projeto acadêmico | CONTENT 6.1 | Aprovado |
| Football: descrição | Analysis of football athlete performance using AI, conversational interaction and information retrieval. | Análise de desempenho de atletas de futebol com IA, interação conversacional e recuperação de informações. | CONTENT 6.1 | Provisório |
| Football: estado | In development | Em desenvolvimento | Resposta do usuário (Q2, reconfirmada) | Aprovado |
| Reelix: nome | Reelix | Reelix | CONTENT 6.2 | Aprovado |
| Reelix: categoria | Personal project | Projeto pessoal | CONTENT 6.2 | Provisório |
| Reelix: descrição | An app to discover and track movies and series, record what you have watched and share authorized activity with friends. | Aplicativo para descobrir e acompanhar filmes e séries, registrar o que você assistiu e compartilhar atividades autorizadas com amigos. | README do repositório `reelix` (04/11/2026) | `pt-BR` do README; `en` provisório |
| Reelix: estado | In development | Em desenvolvimento | README e PROJECT_STATUS do repositório; resposta do usuário | Aprovado |
| FintaLab (nome, categoria, estado e descrição) | Os textos do FintaLab (conceito de produto, estado Conceptual) e os dos outros dois projetos agora ficam em `projects.items` e são os mesmos da página Projects | Idem | SPEC-004, seção 7.2 | Aprovado (2026-11-07) |
| AI Lab | Texto de chamada sobre o escopo (LLMs, agentes, RAG, engenharia de prompts) | Equivalente | SPEC-006 e BUSINESS 7.2 | Provisório |
| Título dos blocos | Experience; Featured projects; AI Lab | Experiência; Projetos em destaque; AI Lab | Criado na implementação | Provisório |
| Rótulos dos links | View experience; View projects; View on GitHub; Explore the AI Lab | Ver experiência; Ver projetos; Ver no GitHub; Explorar o AI Lab | Criado na implementação | Provisório |
| Title (SEO) | Bruno Lucildo \| Senior Backend Developer & Technical Lead | Tradução natural a revisar | SEO 4.1 | `en` aprovado; `pt-BR` provisório |
| Description (SEO) | Explore the work, experience and technical projects of Bruno Lucildo, a backend developer and technical lead focused on scalable systems and software engineering. | Tradução natural a revisar | SEO 4.1 | `en` aprovado; `pt-BR` provisório |

Regras de conteúdo:

- Textos provisórios podem ser implementados e ficam marcados como pendentes de revisão; não podem ser publicados sem aprovação.
- O estado do projeto usa uma das classificações do `DESIGN_SYSTEM.md` (4.6): Concluído, Em desenvolvimento, Experimental ou Conceitual.
- Os fatos da faixa de experiência vêm do inventário do `CONTENT.md` (5.1) e devem ser confirmados antes da publicação.
- Fotografia: `public/images/hero/bruno-lucildo-portrait.png`, versionada no Git desde 2026-11-07. Texto alternativo **aprovado** em 2026-11-07 (Q1a), idêntico ao de `common.json` (`photoAlt`):
  - `en`: "Portrait of Bruno Lucildo in a green three-piece suit and sunglasses, leaning against a terracotta wall."
  - `pt-BR`: "Retrato de Bruno Lucildo de terno verde de três peças e óculos escuros, apoiado em uma parede terracota."

## 9. Critérios de aceitação

| ID | Cobre | Critério (Given / When / Then) |
|---|---|---|
| HOME-CA-01 | RF-01 | **Given** a Home em `/en` **When** a página carrega **Then** o `h1` é "Engineering beyond code." e a identificação e a mensagem complementar aparecem acima da dobra em 1366×768. |
| HOME-CA-02 | RF-02 | **Given** a Home em `/en` **When** o usuário ativa "Explore My Work" **Then** navega para `/en/projects`; **When** ativa "Get in Touch" **Then** navega para `/en/contact`. Em `/pt-BR` os destinos são `/pt-BR/projetos` e `/pt-BR/contato`. |
| HOME-CA-03 | RF-03 | **Given** a Home **When** renderizada **Then** exibe exatamente os três fatos da seção 8 e um link para Experience que leva à rota do idioma ativo. |
| HOME-CA-04 | RF-04 | **Given** a Home **When** renderizada **Then** há três cards (Football Stat Analytics, Reelix e FintaLab), cada um com categoria e estado de lista permitida (o FintaLab como "Conceptual"/"Conceitual"); nenhum card apresenta o projeto como produto lançado. O link abaixo dos cards leva a Projects. |
| HOME-CA-05 | RF-05 | **Given** a Home **When** renderizada **Then** o bloco do AI Lab tem link para a rota AI Lab do idioma e não contém alegações de resultado nem nomes de experimentos específicos. |
| HOME-CA-06 | RF-06 | **Given** largura ≥1024 px e arquivo de foto presente **Then** a foto fica à direita do texto. **Given** largura <1024 px **Then** fica abaixo do texto. **Given** arquivo ausente **Then** o Hero não reserva espaço para a foto. |
| HOME-CA-07 | RF-07, RNF-06 | **Given** largura ≥1024 px **When** o usuário rola **Then** as camadas decorativas se movem em velocidades diferentes e o texto principal não se move. **Given** `prefers-reduced-motion: reduce` **Then** nenhuma camada se move. **Given** largura <1024 px **Then** nenhuma camada se move. |
| HOME-CA-08 | RF-08 | **Given** `/en` e `/pt-BR` **When** inspecionadas **Then** não há texto visível fora dos arquivos de conteúdo e nenhuma frase aparece em idioma diferente do da página (exceto nomes próprios e termos técnicos). |
| HOME-CA-09 | RF-09 | **Given** `/en` e `/pt-BR` **When** o HTML é inspecionado **Then** cada uma tem `title`, `description`, canonical, `hreflang` para as duas versões e Open Graph próprios; `<html lang>` corresponde ao idioma. |
| HOME-CA-10 | RF-10 | **Given** a Home **When** a árvore de acessibilidade é lida **Then** há um único `h1` e nenhum nível de título é pulado. |
| HOME-CA-11 | RF-11 | **Given** carregamento da página **Then** o conteúdo do Hero fica totalmente visível em até 400 ms após a animação iniciar e o CLS permanece ≤0,1. |
| HOME-CA-12 | RF-12 | **Given** o conteúdo dos dois idiomas **When** buscado por "Open to Work", "Available for Opportunities", "Available for Hire", "Looking for a New Job", "Hire Me" e "80%" **Then** não há ocorrências. |
| HOME-CA-13 | RNF-01 | **Given** build de produção em perfil mobile **When** medido com Lighthouse **Then** LCP ≤2,5 s e CLS ≤0,1. |
| HOME-CA-14 | RNF-04 | **Given** navegação apenas por teclado **When** o usuário percorre a Home **Then** a ordem é skip link, header, CTAs, link de experiência, card do projeto, link do AI Lab, footer, com foco visível em cada item. |
| HOME-CA-15 | RNF-07 | **Given** as larguras 360, 390, 768, 1366, 1440 e 1920 px **Then** `scrollWidth` é igual a `innerWidth` em ambos os idiomas. |
| HOME-CA-17 | RF-13 | **Given** os cards de projeto **When** o usuário ativa "View on GitHub" **Then** o repositório correspondente (`brunolucildo/football-stat-analytics-cli`, `brunolucildo/reelix` ou `brunolucildo/fintalab`) abre em nova aba, o link tem `rel="noopener noreferrer"` e um leitor de tela anuncia a nova aba. |
| HOME-CA-18 | RF-14, RNF-06 | **Given** um navegador sem `animation-timeline` (ex.: Firefox) e largura ≥1024 px **When** o usuário rola **Then** as camadas se movem com os mesmos deslocamentos e a mesma rotação de HOME-RF-07 e o texto principal não se move. **Given** `prefers-reduced-motion: reduce` ou largura <1024 px **Then** nenhuma camada se move e nenhum listener de scroll fica registrado. **Given** a mudança dessas condições com a página aberta **Then** o movimento é ligado ou desligado sem recarregar. **Given** um navegador com `animation-timeline` **Then** o fallback não registra listener algum. **Given** JavaScript desabilitado **Then** a página permanece íntegra, com as camadas estáticas onde o CSS não é suportado. |
| HOME-CA-16 | RNF-09 | **Given** o código da Home **Then** `pnpm check`, `pnpm typecheck` e `pnpm build` terminam sem erros. |

## 10. Dependências

| Dependência | Situação | Impacto |
|---|---|---|
| SPEC-010 Global Layout | Implementada | Header, footer, skip link, `main` e Language Switcher. |
| SPEC-008 Internationalization | Implementada na base | Rotas, conteúdo `en`/`pt-BR`, metadados por idioma. |
| Design system | Implementado | Tokens e componentes Button, Container, Section, Card, Badge. |
| SPEC-011 Fotografia | Pendente | Arquivo e tratamento da foto (Q1). |
| SPEC-004 Projects | Implementada | Fonte única dos projetos e dos textos dos cards; o link abaixo dos cards leva à lista. |
| SPEC-006 AI Lab | Pendente | Destino do destaque e texto de escopo. |
| Domínio definitivo | Pendente | Canonical e URLs absolutas do Open Graph (Q4). |

## 11. Riscos

| Risco | Mitigação |
|---|---|
| Foto de baixa qualidade ou com fundo incoerente prejudica o Hero | Aprovar a foto antes de fechar HOME-CA-06 e definir tratamento visual discreto. |
| ~~A foto fica fora do Git e um deploy publica o site sem ela~~ | Resolvido em 2026-11-07: a foto passou a ser versionada. A verificação de existência do arquivo (premissa 7) permanece como proteção do build. |
| A foto é uma captura de tela de baixa resolução (574×811 px) e entra no histórico do Git | Aceito pelo usuário. Substituir pelo original, se surgir, adiciona outro binário ao histórico; avaliar antes de trocar. |
| Parallax prejudica desempenho ou leitura | Limitar a 3 camadas, usar apenas `transform`/`opacity`, validar INP e CLS (HOME-CA-07, HOME-CA-13). |
| O fallback em JavaScript piora INP, causa jank ou diverge do efeito em CSS | Listener passivo com `requestAnimationFrame`, valores numéricos em fonte única, ativação só onde o CSS não é suportado e teste E2E no Firefox (HOME-CA-18). |
| Fatos de experiência divergentes do currículo ou do Experience | Confirmar os três fatos antes de publicar e manter uma única fonte de conteúdo. |
| Publicação de texto provisório em pt-BR | Marcar como pendente e bloquear o checklist de publicação até a revisão. |
| Exposição de dado confidencial ou de terceiros ao apontar para os repositórios | Usar apenas as descrições aprovadas. O repositório do Football Stat Analytics versiona bancos `.db` com trechos indexados de relatórios; conferir se esse conteúdo pode ficar público antes de promover o link. |
| Estado do Reelix indicar produto pronto | Rótulo "Em desenvolvimento" e descrição sem afirmar produção ou lançamento; o README do projeto diz que o status não confirma implantação. |

## 12. Perguntas abertas

| ID | Pergunta | Situação | Impacto | Bloqueia |
|---|---|---|---|---|
| Q1 | Qual é a fotografia do Hero (arquivo, enquadramento, texto alternativo em EN e pt-BR)? | **Arquivo definido:** `public/images/hero/bruno-lucildo-portrait.png` (retrato vertical, 574×811 px, versionado; antes `bruno-lucildo-hero.png`). **Respondido em 2026-11-07:** (a) texto alternativo da seção 8 aprovado; (b) e (c) mantida a captura atual (574×811 px, com a faixa clara no canto) e aprovado o tratamento visual implementado. **Também decidido:** a foto passa a ser versionada no Git e o arquivo foi renomeado para `bruno-lucildo-portrait.png`; substituir pelo original, se surgir, não exige nova aprovação do tratamento. | Define HOME-RF-06, HOME-CA-06 e o LCP do Hero. | Não bloqueia. |
| Q2 | Qual é o estado do Football Stat Analytics? | **Respondida:** Em desenvolvimento. | HOME-RF-04. | Não bloqueia mais. |
| Q3 | Os textos provisórios em pt-BR (título, CTAs, mensagem complementar) e os três fatos de experiência estão aprovados? | **Respondida:** aprovados como estão. | Seção 8. | Não bloqueia mais. |
| Q4 | Qual será o domínio `.dev` e a imagem Open Graph? | **Respondida:** ainda não definidos. A implementação usa uma URL base central em `config/site.ts` e deixa a imagem Open Graph para depois. | Canonical e Open Graph absolutos (HOME-RF-09). | Publicação. |
| Q5 | O AI Lab em pt-BR é `/pt-BR/ai-lab` ou `/pt-BR/laboratorio-ia`? | **Mantido** `/pt-BR/ai-lab`, como implementado, por falta de objeção. | HOME-RF-05. | Não bloqueia. |

## 13. Premissas

Decisões reversíveis adotadas neste refinamento. Podem ser alteradas sem refazer a SPEC.

1. O destaque do AI Lab é um bloco de chamada com o escopo geral, sem experimentos específicos, porque o conteúdo inicial do AI Lab está pendente (`CONTENT.md`, seção 11).
2. A faixa de experiência usa os três fatos do inventário do `CONTENT.md`; o texto exato é provisório.
3. Os CTAs apontam para Projects ("Explore My Work") e Contact ("Get in Touch"). A SPEC original não indicava os destinos.
4. Os canais de contato completos permanecem no footer (SPEC-010). Não há bloco de contato adicional na Home.
5. A SPEC passa a viver em `.specs/001-home.md`, conforme o `.specs/README.md` permite. A seção SPEC-001 de `FEATURES.md` aponta para este arquivo.
6. Como o domínio não está definido, o canonical e o Open Graph usam uma URL base central configurável, sem imagem Open Graph por enquanto.
7. O build não pode depender da foto: a Home verifica a existência do arquivo e omite o espaço da foto quando ele não existe.
8. O estado do Reelix vem do README e do PROJECT_STATUS do repositório (fotografia do código em 04/11/2026), que descreve implementação e não confirma produção.

## 14. Decisões registradas

| Data | Decisão | Origem |
|---|---|---|
| 2026-11-07 | Hero com fotografia à direita no desktop. | Resposta do usuário |
| 2026-11-07 | Home destaca somente o Football Stat Analytics; Reelix e estudos de caso aguardam validação. | Resposta do usuário |
| 2026-11-07 | Resumo de experiência como faixa de fatos verificáveis, sem a métrica de 80%. | Resposta do usuário |
| 2026-11-07 | Parallax somente no Hero, desktop, em CSS, sem biblioteca. | Resposta do usuário |
| 2026-11-07 | Estado do Football Stat Analytics: Em desenvolvimento. | Resposta do usuário (Q2) |
| 2026-11-07 | Textos pt-BR e três fatos de experiência aprovados como estão. | Resposta do usuário (Q3) |
| 2026-11-07 | Domínio ainda não definido; URL base central e sem imagem Open Graph por ora. | Resposta do usuário (Q4) |
| 2026-11-07 | Foto do Hero fica fora do Git (`public/images/hero/` no `.gitignore`). | Resposta do usuário (Q1) |
| 2026-11-07 | Arquivo da foto indicado e movido para `public/images/hero/bruno-lucildo-hero.png`. | Resposta do usuário (Q1) |
| 2026-11-07 | Football Stat Analytics permanece "Em desenvolvimento" (o README do projeto o chama de "experimental"). | Resposta do usuário |
| 2026-11-07 | Reelix entra na Home como projeto pessoal em desenvolvimento. | Resposta do usuário |
| 2026-11-07 | FintaLab entra na Home como terceiro destaque, conceito de produto em planejamento. | Resposta do usuário (SPEC-004) |
| 2026-11-07 | Cards de projeto com link externo para o repositório no GitHub. | Resposta do usuário |
| 2026-11-07 | Parallax ganha fallback em JavaScript para navegadores sem scroll-driven animations (Firefox), mantendo o CSS como caminho principal. Substitui a decisão "em CSS" sem JS apenas para esses navegadores; segue sem biblioteca. | Resposta do usuário (retomada) |
| 2026-11-07 | Texto alternativo da foto aprovado; mantidos a captura atual e o tratamento visual implementado. | Resposta do usuário (Q1) |
| 2026-11-07 | A foto do Hero passa a ser versionada no Git (revoga "fora do Git") e o arquivo é renomeado de `bruno-lucildo-hero.png` para `bruno-lucildo-portrait.png`. | Resposta do usuário (retomada) |

## Refinamento

| Data | O que mudou | Motivo |
|---|---|---|
| 2026-11-07 | Requisitos numerados com prioridade (HOME-RF-01 a 12) e requisitos não funcionais (HOME-RNF-01 a 09). | A versão 0.1 não tinha IDs, prioridades nem requisitos não funcionais. |
| 2026-11-07 | Critérios de aceitação em Given/When/Then (HOME-CA-01 a 16). | Critérios como "o posicionamento é compreendido rapidamente" não eram verificáveis. |
| 2026-11-07 | Escopo fechado: quantidade e conteúdo de cada bloco; fora do escopo explícito. | "Resumo de experiência", "destaques de projetos" e "destaque do AI Lab" estavam abertos. |
| 2026-11-07 | Destino dos CTAs, parallax (camadas, breakpoint, reduced motion) e foto (posição e fallback) definidos. | Lacunas de comportamento e dependência de decisões pendentes. |
| 2026-11-07 | Adicionados metadados, estados (sem foto, sem JS, movimento reduzido) e tabela de conteúdo com origem e situação. | A SPEC não cobria SEO, estados nem a origem dos textos. |
| 2026-11-07 | Perguntas abertas, riscos, premissas e decisões registrados. | Expor decisões escondidas e itens bloqueantes. |
| 2026-11-07 | Movida de `FEATURES.md` para `.specs/001-home.md`. | `.specs/README.md` prevê separar por funcionalidade conforme o projeto cresce. |
| 2026-11-07 | Q2 a Q5 respondidas; textos aprovados; estado do projeto definido; Q1 mantida aberta; premissas 6 e 7 e novo risco da foto fora do Git; status passa a Approved (v0.3.0). | Respostas do usuário às perguntas abertas. |
| 2026-11-07 | Q1 parcialmente respondida: arquivo da foto indicado; texto alternativo e tratamento visual propostos e pendentes de aprovação. | Resposta do usuário. |
| 2026-11-07 | Implementada (v0.4.0, In Review). Adicionados à seção 8 os títulos de bloco e os rótulos de link criados na implementação, ainda provisórios. | Implementação revelou textos que a SPEC não listava. |
| 2026-11-07 | v0.5.0: Reelix incluído nos destaques; RF-04 reescrito para dois projetos; novo RF-13 e CA-17 (links para o GitHub); tabela de conteúdo, composição e riscos atualizados. | Informações do perfil público do GitHub e decisão do usuário. |
| 2026-11-07 | v0.6.0: parallax intensificado (deslocamentos, opacidade e contornos maiores; quadrado girando) e coberto por testes E2E. | Pedido do usuário: o efeito original não era percebido no Chrome nem no Firefox. |
| 2026-11-07 | v0.7.0: novo HOME-RF-14, seção 7.1 e HOME-CA-18 (fallback em JavaScript do parallax); RNF-06, estados e riscos ajustados; Q1 atualizada e texto alternativo da foto aprovado. Foto do Hero passa a ser versionada e renomeada para `bruno-lucildo-portrait.png` (riscos, premissa 7 e Q1 ajustados). Fallback implementado (`HeroParallaxLayers.tsx`, variáveis `--parallax-*`) e coberto por 5 testes E2E em `e2e/home.spec.ts` (CA-18; o Chromium é forçado ao caminho do fallback; mutação confirmada). Confirmado no Firefox real pelo usuário. | Decisões do usuário na retomada: o efeito deve aparecer também no Firefox; a foto entra no Git. |
| 2026-11-07 | v0.8.0: FintaLab entra como terceiro destaque (RF-04, composição, CA-04, CA-17 e dependência da SPEC-004 atualizados); nome, categoria, estado e descrição dos cards passam a vir da fonte única de Projects. Implementado e coberto por `e2e/home.spec.ts` e `e2e/projects.spec.ts`. | Pedido do usuário na SPEC-004. |
