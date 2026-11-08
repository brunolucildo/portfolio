# SPEC-010 — Global Layout and Navigation

## 1. Identificação

| Campo | Valor |
|---|---|
| Nome | Global Layout and Navigation |
| Identificador | SPEC-010 |
| Slug | `010-global-layout` |
| Versão | 0.2.0 |
| Status | Done em 2026-11-08, por decisão do Bruno; os itens não verificados seguem para o QA final (antes: In Review, implementada em 2026-11-08; aguardando a revisão do usuário e do PR) |
| Data | 2026-11-08 |
| Origem | SPEC-010 de `.specs/FEATURES.md` (v0.1, Draft) |

Prioridades usadas: **Must** (obrigatório para a v1), **Should** (desejável; pode ser adiada sem bloquear a entrega).

## 2. Contexto

O layout global (cabeçalho, navegação, seletor de idioma, rodapé, atalho "pular para o conteúdo") foi implementado antes das specs das páginas e nunca teve uma SPEC refinada nem um arquivo de testes próprio: só aparece de passagem em `e2e/i18n.spec.ts` e `e2e/resume.spec.ts`. Esta SPEC formaliza o que existe, registra a auditoria feita em 2026-11-08 em um build de produção real e fecha as lacunas encontradas.

**Objetivo:** garantir consistência de navegação, identidade visual e comportamento em todas as páginas, com navegação acessível por teclado e leitor de tela, sem criar elementos novos (`DESIGN.md`, seção 10; `DESIGN_SYSTEM.md`, seção 4.2).

**Posicionamento:** o layout não usa indicadores de disponibilidade profissional (`DESIGN_SYSTEM.md`, 4.2). O currículo é uma ação secundária.

## 3. Escopo

### 3.1. Dentro do escopo

1. Formalizar o comportamento existente: `SiteShell`, `SkipLink`, `Header`, `HeaderNav`, `LanguageSwitcher` e `Footer`, usados por todas as páginas e pela 404 global.
2. Corrigir as lacunas da seção 7 (menu mobile, foco atrás do cabeçalho fixo, alvos de toque, estado ativo do botão Resume e link do currículo no rodapé).
3. Criar `e2e/layout.spec.ts`, com os testes que hoje só existem de forma indireta.
4. Atualizar a SPEC-009 (rodapé) e o README quando a implementação terminar.

### 3.2. Fora do escopo

- Novos itens de menu, submenus, busca, alternância de tema e qualquer indicador de disponibilidade.
- Armadilha de foco (`focus trap`) no menu mobile: o padrão adotado é o de botão de divulgação, em que o `Tab` continua pelo restante da página.
- Fechar o menu ao clicar fora dele (premissa 3, reversível).
- Comportamento do seletor de idioma, rotas e metadados (SPEC-008) e as páginas em si.
- Textos novos: o rodapé reutiliza o rótulo "Resume"/"Currículo" já aprovado em `navigation.resume`.
- Rastreamento de cliques na navegação, `sitemap` e analytics.

## 4. Requisitos funcionais

| ID | Prioridade | Situação | Requisito |
|---|---|---|---|
| LAY-RF-01 | Must | Existe | Toda página, inclusive a 404, é renderizada por `SiteShell`: `<html lang>` do idioma, atalho "pular para o conteúdo", um `header` (banner), um `main#main` focável por programa e um `footer` (contentinfo), nessa ordem. |
| LAY-RF-02 | Must | Existe | A partir de 1024 px, o cabeçalho fixo mostra o nome (link para a Home), a navegação principal com Home, About, Experience, Projects, Technologies, AI Lab e Contact nessa ordem, o seletor de idioma e o botão Resume. |
| LAY-RF-03 | Must | Existe | O item da página atual tem `aria-current="page"` e sublinhado primary. A Home só fica ativa em `/`; páginas filhas (`/projects/[slug]`, `/ai-lab/[slug]`) mantêm o item da seção ativo. |
| LAY-RF-04 | Must | Muda | O botão Resume é um link interno para `/resume` (SPEC-009). Na página do currículo ele tem `aria-current="page"` **e** a borda na cor primary no lugar da borda cinza; nas demais páginas, o estilo secundário atual. |
| LAY-RF-05 | Must | Existe | Abaixo de 1024 px, o cabeçalho mostra o nome e um botão de menu com `aria-expanded`, `aria-controls` e rótulo que alterna entre "Open menu" e "Close menu". O painel reúne a navegação, o seletor de idioma e o botão Resume. |
| LAY-RF-06 | Must | Muda | O painel do menu mobile fecha ao navegar, **inclusive ao acionar o link da página em que o visitante já está** (hoje continua aberto), e ao pressionar `Escape`, devolvendo o foco ao botão de menu. |
| LAY-RF-07 | Should | Muda | Se o menu estiver aberto e a janela passar de 1024 px, ele fecha; ao voltar abaixo de 1024 px, ele aparece fechado (hoje reaparece aberto). |
| LAY-RF-08 | Must | Existe | O seletor de idioma (SPEC-008) aparece no cabeçalho e no painel mobile, com o idioma atual marcado por `aria-current="true"`. |
| LAY-RF-09 | Must | Muda | O rodapé mostra o nome, o copyright com o ano corrente, a navegação do rodapé e os canais Email, LinkedIn e GitHub definidos em `siteConfig.contact`. A navegação do rodapé repete os sete itens do cabeçalho e **acrescenta o currículo (link para `/resume`) depois de Contact**, com o rótulo de `navigation.resume`. |
| LAY-RF-10 | Must | Existe | O primeiro `Tab` de qualquer página leva ao atalho "pular para o conteúdo", que fica visível ao receber o foco; acioná-lo move o foco para `main#main`. |
| LAY-RF-11 | Must | Muda | O foco por teclado nunca fica escondido atrás do cabeçalho fixo: `html` reserva `scroll-padding-top` de pelo menos a altura do cabeçalho (64 px) mais 16 px. |
| LAY-RF-12 | Must | Muda | Todos os alvos interativos do layout (nome do site, itens de navegação, botão de menu, seletor de idioma, botão Resume e links do rodapé) têm pelo menos 44 px de altura. Hoje o nome do site mede 26 px e o botão Resume 36 px. |
| LAY-RF-13 | Must | Existe | O layout não exibe indicadores de disponibilidade profissional, "Open to Work", "Hire Me" nem equivalentes. |
| LAY-RF-14 | Must | Existe | Os textos do layout vêm de `navigation`, `languageSwitcher` e `footer` e existem nos dois idiomas; os canais mantêm a grafia original. |
| LAY-RF-15 | Must | Muda | `e2e/layout.spec.ts` cobre os critérios da seção 8 e passa junto com o restante da suíte. |

## 5. Requisitos não funcionais

| ID | Categoria | Requisito |
|---|---|---|
| LAY-RNF-01 | Acessibilidade | Um `banner`, um `main` e um `contentinfo` por página. Três `nav` com nome (`Main navigation` no cabeçalho, `Main navigation` no painel mobile e `Footer navigation`), só um deles exposto por vez no cabeçalho. Foco visível (contorno de 2 px na cor primary) em todos os alvos. |
| LAY-RNF-02 | Contraste | Texto e estados dos componentes do layout com contraste AA. Medido com os tokens: texto secundário 6,73:1 sobre o fundo, 6,31:1 sobre a superfície e 5,79:1 sobre a superfície elevada; primary 14,90:1 sobre o fundo. |
| LAY-RNF-03 | Responsividade | Sem rolagem horizontal e sem sobreposição entre os elementos do cabeçalho em 360, 390, 768, 1024, 1100, 1366, 1440 e 1920 px, nos dois idiomas. Medido: em 1024 px o cabeçalho termina em 992 px, com folga mínima de 4 px entre os elementos. |
| LAY-RNF-04 | Desempenho | Sem dependência nova. Os únicos Client Components do layout são `HeaderNav` e `LanguageSwitcher`; cabeçalho, rodapé e atalho são renderizados no servidor. |
| LAY-RNF-05 | Consistência visual | Dark Premium, sem cards, sem neon e sem elemento gráfico decorativo. O verde-limão aparece só no item ativo, na borda do botão Resume ativo e no foco. |
| LAY-RNF-06 | Movimento | Apenas transições de cor de 150 ms ou menos; nenhuma animação de entrada. Com `prefers-reduced-motion`, nada se move. |
| LAY-RNF-07 | Manutenibilidade | Os itens de navegação ficam em `src/config/navigation.ts` e as rotas em `routing.ts`. O currículo não entra em `mainNavigation`: o cabeçalho e o rodapé o tratam como destino à parte. |

## 6. Interface e experiência

### 6.1. Composição

| Largura | Cabeçalho | Rodapé |
|---|---|---|
| ≥1024 px | Altura de 64 px, fixo. Nome à esquerda; navegação no meio; seletor de idioma e botão Resume à direita. | Duas colunas: identidade e copyright à esquerda; navegação e canais à direita, lado a lado. |
| <1024 px | Nome à esquerda e botão de menu à direita. O painel abre logo abaixo do cabeçalho, em largura total, com a navegação em coluna e, embaixo, o seletor de idioma e o botão Resume. | Coluna única: identidade, navegação e canais em sequência. |

- O botão Resume mantém o estilo secundário (borda cinza, texto `foreground`). Na página do currículo, a borda passa a `primary`; o texto não muda.
- O item ativo da navegação continua com sublinhado primary de 2 px.
- O link do currículo no rodapé usa o mesmo estilo dos demais links da lista.

### 6.2. Estados

| Situação | Comportamento esperado |
|---|---|
| Página atual | Item da navegação com `aria-current="page"` e sublinhado; botão Resume com `aria-current` e borda primary na página do currículo. |
| Menu mobile fechado | Painel oculto (`hidden`); botão com `aria-expanded="false"`. |
| Menu mobile aberto | Painel visível; `aria-expanded="true"`; `Tab` percorre navegação, seletor, Resume e depois o conteúdo. |
| Link da página atual, no menu aberto | O menu fecha e o foco fica na página. |
| `Escape` com o menu aberto | O menu fecha e o foco volta ao botão de menu. |
| Janela passa de 1024 px com o menu aberto | O menu fecha (Should). |
| Foco por teclado em um elemento perto do cabeçalho | O elemento rola até uma posição abaixo do cabeçalho, sem ficar escondido. |
| Currículo só em inglês, em pt-BR | O botão e o link do rodapé mostram "Currículo", sem "(EN)": o aviso fica na página (SPEC-009). |
| Canal ausente em `siteConfig.contact` | O link do canal some do rodapé; o resto não muda. |
| `prefers-reduced-motion` | Sem diferença: o layout não tem movimento além de transições de cor. |
| 404 | O mesmo cabeçalho e rodapé, no idioma da URL; o seletor leva à Home ou à lista da seção (SPEC-008). |

Não há estado de carregamento nem de erro de dados: o layout é estático.

## 7. Auditoria (2026-11-08)

Feita em um build de produção, com Playwright (Chromium), nos dois idiomas.

| Item | Resultado | Situação |
|---|---|---|
| Landmarks | Um `main`, um `footer`; `header` de página não é landmark; três `nav` com nome, só um exposto por vez | Conforme |
| Atalho "pular para o conteúdo" | Primeiro `Tab`, visível, foco vai para `main` | Conforme |
| Cabeçalho em 1024, 1100 e 1280 px (en e pt-BR) | Sem rolagem horizontal nem sobreposição; folga mínima de 4 px | Conforme |
| Contraste dos tokens | Mínimo 5,79:1 em texto | Conforme |
| `Escape` no menu mobile | Fecha e devolve o foco ao botão | Conforme |
| Ordem de tabulação com o menu aberto | Navegação, seletor, Resume, conteúdo | Conforme |
| Clique no link da página atual com o menu aberto | O menu continua aberto | **Lacuna** (LAY-RF-06) |
| Menu aberto, janela até o desktop e de volta | O menu reaparece aberto | **Lacuna** (LAY-RF-07) |
| Foco por `Shift+Tab` em `/en/projects` (1440 × 600 px) | Um link fica a 0 px do topo, atrás do cabeçalho de 65 px; não há `scroll-padding-top` | **Lacuna** (LAY-RF-11) |
| Altura dos alvos: nome do site | 26 px | **Lacuna** (LAY-RF-12) |
| Altura dos alvos: botão Resume | 36 px (`size="sm"`) | **Lacuna** (LAY-RF-12) |
| Botão Resume na página do currículo | Só `aria-current`; sem mudança visual | **Lacuna** (LAY-RF-04) |
| Rodapé | Sem link para o currículo | **Lacuna** (LAY-RF-09) |
| Clique fora do menu | O menu continua aberto | Mantido (premissa 3) |
| Testes do layout | Só indiretos, em `i18n.spec.ts` e `resume.spec.ts` | **Lacuna** (LAY-RF-15) |

## 8. Critérios de aceitação

| ID | Critério (Given / When / Then) |
|---|---|
| LAY-CA-01 | **Given** cada rota de `routing.pathnames` e uma 404, nos dois idiomas, **when** a página abre, **then** há `html lang` igual ao idioma, um `header`, um `main#main`, um `footer`, e o atalho é o primeiro elemento focável. |
| LAY-CA-02 | **Given** 1440 px, **when** o cabeçalho é lido, **then** o nome leva à Home, a navegação tem os sete itens na ordem prevista, e o seletor de idioma e o botão Resume estão presentes. |
| LAY-CA-03 | **Given** cada página e uma página filha (`/projects/[slug]`), **when** a navegação é lida, **then** só o item da seção tem `aria-current="page"` e a Home só fica ativa em `/`. |
| LAY-CA-04 | **Given** `/resume` (pt-BR: `/curriculo`), **when** o botão do header é lido, **then** tem `aria-current="page"` e a borda computada na cor primary; **given** outra página, **then** não tem `aria-current` e a borda é a cinza. |
| LAY-CA-05 | **Given** 375 px, **when** o botão de menu é acionado, **then** `aria-expanded` vira `true`, o painel mostra navegação, seletor e Resume, e o rótulo do botão muda para "Close menu"/"Fechar menu". |
| LAY-CA-06 | **Given** o menu aberto em 375 px, **when** o link da página atual é acionado, **then** o menu fecha; **when** qualquer outro link é acionado, **then** a página muda e o menu fecha; **when** `Escape` é pressionado, **then** o menu fecha e o foco volta ao botão. |
| LAY-CA-07 | **Given** o menu aberto em 375 px, **when** a janela passa para 1280 px e volta para 375 px, **then** o painel está fechado. *(Should)* |
| LAY-CA-08 | **Given** o rodapé, **when** lido, **then** mostra o nome, o copyright com o ano corrente, a navegação com os sete itens e o currículo na última posição (link para `/en/resume` e `/pt-BR/curriculo`), e os canais Email, LinkedIn e GitHub. |
| LAY-CA-09 | **Given** o primeiro `Tab`, **when** o atalho recebe o foco, **then** fica visível; **when** é acionado com `Enter`, **then** o foco está em `main`. |
| LAY-CA-10 | **Given** uma página longa (`/en/projects`, 1440 × 600 px), **when** o foco percorre todos os elementos com `Tab` e depois com `Shift+Tab`, **then** o topo de nenhum elemento fora do cabeçalho fica acima da borda inferior do cabeçalho. |
| LAY-CA-11 | **Given** cada alvo interativo do cabeçalho e do rodapé, em 375 px e em 1440 px, **when** medido, **then** tem pelo menos 44 px de altura e contorno de foco visível. |
| LAY-CA-12 | **Given** 360, 390, 768, 1024, 1100, 1366, 1440 e 1920 px, nos dois idiomas, **when** a Home e uma página interna abrem, **then** não há rolagem horizontal e os elementos do cabeçalho não se sobrepõem. |
| LAY-CA-13 | **Given** o texto do cabeçalho e do rodapé nos dois idiomas, **when** lido, **then** não contém "Open to Work", "Available for Opportunities", "Hire Me" nem as demais expressões proibidas, e o botão e o link do currículo não contêm "(EN)". |
| LAY-CA-14 | **Given** o repositório, **when** `pnpm typecheck` e `pnpm test:e2e` rodam, **then** passam, incluindo `e2e/layout.spec.ts`. |

## 9. Dependências

- `src/components/layout/` (`SiteShell`, `SkipLink`, `Header`, `HeaderNav`, `LanguageSwitcher`, `Footer`), `src/config/navigation.ts`, `src/i18n/routing.ts` e `src/app/globals.css` (`scroll-padding-top`).
- SPEC-008: seletor de idioma, 404 localizada e `lang`; SPEC-009: botão Resume e página `/resume`.
- `src/components/ui/Button.tsx` (`buttonStyles`) e os tokens de `src/styles/tokens.css`.
- `e2e/i18n.spec.ts` e `e2e/resume.spec.ts`: testes que tocam o layout e devem continuar passando.
- `e2e/support/content-rules.ts` (expressões proibidas).

## 10. Riscos

| Risco | Impacto | Mitigação |
|---|---|---|
| O link do currículo no rodapé ser lido como destaque do currículo em todas as páginas. | Contraria o posicionamento secundário | Estilo igual ao dos demais links, sem destaque (LAY-RF-09); decisão do Bruno, reversível em uma linha. |
| `scroll-padding-top` deslocar âncoras e a rolagem do atalho. | Conteúdo começar longe do topo | O valor (80 px) é só a altura do cabeçalho mais folga; LAY-CA-09 e LAY-CA-10 verificam o atalho e o foco. |
| Aumentar o botão Resume para 44 px mudar o ritmo visual do cabeçalho de 64 px. | Cabeçalho apertado | O cabeçalho continua com 64 px de altura; conferir em 1024 px, a largura mais justa. |
| Fechar o menu ao passar de 1024 px exigir um listener de `matchMedia`. | JavaScript a mais no cliente | Só um listener, dentro de `HeaderNav` (já Client Component); é Should e pode ficar de fora. |
| Teste de foco atrás do cabeçalho depender do comportamento de rolagem do Chromium. | Teste instável | Medir a posição depois de cada `Tab` e `Shift+Tab`, com pausa curta para a rolagem terminar. |
| Itens ocultos (`nav` do painel mobile) serem contados como visíveis nos testes. | Falso positivo | Os testes contam só os elementos visíveis. |

## 11. Perguntas abertas

| ID | Pergunta | Bloqueia? | Default adotado se não houver resposta |
|---|---|---|---|
| Q1 | Posso implementar as correções da seção 7 e criar `e2e/layout.spec.ts`? | Resolvida em 2026-11-08: autorizado pelo Bruno | Nenhum: implementação só depois do OK. |
| Q2 | O menu mobile deve fechar também ao clicar fora dele? | Não | Não fecha (premissa 3). **Resolvida em 2026-11-08: default aceito pelo Bruno.** |
| Q3 | O botão Resume e o nome do site passam a 44 px de altura (hoje 36 px e 26 px)? | Não | Sim (LAY-RF-12), como as demais páginas. **Resolvida em 2026-11-08: default aceito pelo Bruno.** |
| Q4 | O fechamento do menu ao passar de 1024 px (LAY-RF-07) entra na v1? | Não | Entra, como Should. **Resolvida em 2026-11-08: default aceito pelo Bruno.** |

## 12. Premissas

1. O comportamento que já existe (seção 4, coluna "Existe") é mantido; os testes novos o protegem.
2. O rodapé reutiliza `navigation.resume` como rótulo; não há texto novo para aprovar.
3. O menu mobile segue o padrão de botão de divulgação: fecha por `Escape` e ao navegar, não ao clicar fora, e não prende o foco.
4. `scroll-padding-top` é de 5 rem (80 px) em `html`: altura do cabeçalho (64 px) mais 16 px.
5. O estado ativo do botão Resume usa só a cor da borda; o texto e o tamanho não mudam.
6. O botão Resume e o nome do site passam a ter `min-h-11` (44 px) sem alterar a altura de 64 px do cabeçalho.
7. O currículo não entra em `mainNavigation`; cabeçalho e rodapé o tratam como destino à parte.

## 13. Decisões registradas

| Data | Decisão | Quem |
|---|---|---|
| 2026-11-08 | O rodapé ganha um link para o currículo (`/resume`), depois de Contact, na lista de navegação. | Bruno |
| 2026-11-08 | O botão Resume mostra o estado ativo com a borda na cor primary, além do `aria-current`. | Bruno |
| 2026-11-08 | A próxima etapa depois da SPEC-009 é o refinamento da SPEC-010 (layout e navegação já implementados). | Bruno |
| 2026-11-08 | Implementação das correções da seção 7 e de `e2e/layout.spec.ts` autorizada (Q1). Q2 a Q4 seguem com os defaults da seção 11. | Bruno |

## Refinamento

- 2026-11-08, v0.2.0: correções implementadas e `e2e/layout.spec.ts` criado; a seção 15 registra a entrega e a verificação.
- 2026-11-08, v0.1.0: SPEC criada a partir do rascunho de `FEATURES.md` (Draft v0.1), do `DESIGN.md` (10), do `DESIGN_SYSTEM.md` (4.2), do `QA.md`, do código dos componentes de layout e de uma auditoria em build de produção (cabeçalho em 1024 a 1280 px, menu mobile, atalho, foco sob o cabeçalho fixo, landmarks, contraste e alvos de toque). Rascunho original preservado: estrutura compartilhada, navegação entre páginas, localização atual, troca de idioma, adaptação ao mobile, acesso ao currículo e links de contato no rodapé; os requisitos não funcionais (HTML semântico, teclado, responsividade, contraste, foco, sem rolagem horizontal, carregamento) viraram LAY-RNF-01 a 06 com medições. Seis lacunas e duas decisões do Bruno registradas; aguardando o OK (Q1).

## 15. Implementação e verificação

Implementada na branch `feat/layout` (a partir da `docs/spec-009-resume`) em 2026-11-08, depois da autorização (Q1).

- Novo: `e2e/layout.spec.ts` (50 testes, 25 por idioma).
- Alterados: `src/components/layout/HeaderNav.tsx` (menu que fecha em qualquer link e ao chegar ao desktop, borda ativa e 44 px no Resume), `Header.tsx` (alvo de 44 px no nome do site), `Footer.tsx` (link do currículo), `src/app/globals.css` (`scroll-padding-top`) e `README.md`.

Decisões de implementação:

- O helper `cn` do projeto só junta classes e não resolve conflitos do Tailwind, então o botão Resume usa o modificador `!` (`min-h-11!` e `border-primary!`), como o estilo `text` já faz com `px-0!`. O botão continua no tamanho `sm`, com o mesmo texto e o mesmo preenchimento.
- `closeMenu` fecha o painel em qualquer link (itens, Resume), inclusive o da página atual, que não muda a rota. O fechamento ao passar de 1024 px usa um listener de `matchMedia` que só existe enquanto o menu está aberto.
- `scroll-padding-top` de 5 rem em `html` vale também para âncoras e para o atalho do conteúdo.
- O link do currículo no rodapé reutiliza `navigation.resume` e fica depois de Contact; o currículo continua fora de `mainNavigation`.

Divergências em relação à SPEC: nenhuma. Em LAY-CA-12, o teste cobre a Home, Contact e o currículo (a SPEC pedia uma página interna); em LAY-CA-03, as páginas filhas testadas são `/projects/reelix` e `/ai-lab/rag-grounding`.

| Critério | Resultado | Evidência |
|---|---|---|
| LAY-CA-01 | Atendido | As oito rotas fixas, nos dois idiomas, e a 404: `lang`, um `banner`, um `main#main`, um `contentinfo`, e o primeiro `Tab` no atalho. |
| LAY-CA-02 | Atendido | Nome com link para a Home, sete itens na ordem e com as rotas do idioma, lista de idioma e Resume. |
| LAY-CA-03 | Atendido | Só o item da seção tem `aria-current="page"` nas sete rotas e nas duas páginas filhas. |
| LAY-CA-04 | Atendido | Borda `rgb(183, 243, 107)` e `aria-current` no currículo; `rgb(37, 43, 38)` e sem `aria-current` em About. |
| LAY-CA-05 | Atendido | `aria-expanded`, `aria-controls`, rótulo "Open menu"/"Close menu" (pt-BR: "Abrir menu"/"Fechar menu") e painel com sete itens, dois idiomas e Resume. |
| LAY-CA-06 | Atendido | Fecha ao acionar o link da página atual, outro link, o Resume (também já no currículo) e o idioma; `Escape` devolve o foco ao botão. |
| LAY-CA-07 | Atendido | Aberto a 375 px, a 1280 px e de volta a 375 px: painel fechado. |
| LAY-CA-08 | Atendido | Nome, ano corrente, sete itens e o currículo por último, e Email, LinkedIn e GitHub. |
| LAY-CA-09 | Atendido | Atalho visível com o foco; `Enter` leva o foco a `main`. |
| LAY-CA-10 | Atendido | `Tab` e `Shift+Tab` por 70 paradas em `/projects` (1440 × 600 px): nenhum elemento fora do cabeçalho com o topo atrás dele. |
| LAY-CA-11 | Atendido | Todos os links e botões do cabeçalho e do rodapé, a 1440 e a 375 px (menu aberto), com 44 px ou mais e contorno de foco. |
| LAY-CA-12 | Atendido | Sem rolagem horizontal nem sobreposição em 360, 390, 768, 1024, 1100, 1366, 1440 e 1920 px, nos dois idiomas. |
| LAY-CA-13 | Atendido | Sem expressões proibidas nem "(EN)" no cabeçalho e no rodapé. |
| LAY-CA-14 | Atendido | `tsc --noEmit` sem erros e a suíte E2E completa com 676 testes passando. |

Verificação adicional:

- Mutação: cinco defeitos de propósito (sem `scroll-padding-top`, link do menu sem `onClick`, nome do site sem 44 px, rodapé sem o currículo e `matchMedia` apontando para uma largura inalcançável) derrubaram 10 testes, ao menos um por correção. Arquivos restaurados e suíte completa verde depois.
- Navegador: botão Resume com a borda verde-limão em `/en/resume` conferido em produção, no servidor da porta 3200 (já encerrado).
- Erros do próprio teste, corrigidos na primeira rodada: rótulo da Home em pt-BR ("Início"), slug do AI Lab, lista de paradas do teclado e a regra do Chromium de só mostrar `:focus-visible` em foco programático depois de interação por teclado.
- Biome passa nos arquivos novos e alterados.

Não verificado: leitores de tela reais, o contraste com ferramenta (os valores vêm dos tokens), Firefox e Safari (os testes rodam só no Chromium) e o menu em um aparelho com toque.
