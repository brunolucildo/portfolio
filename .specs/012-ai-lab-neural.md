# SPEC-012 — AI Lab: Neural Intelligence Environment

> **Atualização de 2026-11-12 (SPEC-014):** NEU-RF-15 muda: o card "Em planejamento" (agora Rondo) tem um único link, no nome, para `/projects/rondo` (`/projetos/rondo`); os demais continuam como estão. Vale a SPEC-014.

## 1. Identificação

| Campo | Valor |
|---|---|
| Nome | AI Lab: Neural Intelligence Environment |
| Identificador | SPEC-012 |
| Slug | `012-ai-lab-neural` |
| Versão | 0.2.0 |
| Status | Done (implementada em 2026-11-08; textos aprovados pelo Bruno; commit e PR aguardam autorização) |
| Data | 2026-11-08 |
| Origem | Briefing do Bruno de 2026-11-08 ("Redesign do AI Lab") e SPEC-006 (AI Lab, v0.5.0) |

Prioridades usadas: **Must** (obrigatório), **Should** (desejável; pode ser adiada sem bloquear a entrega).

## 2. Contexto

A página `/ai-lab` (SPEC-006) é uma lista de oito cards uniformes com título, abertura e elemento gráfico estático. O Bruno pediu uma reformulação completa da **página de lista**, para que ela pareça um ambiente de pesquisa em inteligência artificial: uma rede neural em profundidade como elemento dominante, uma filosofia do laboratório, uma área de experimentos com destaque e filtros, uma linha de pesquisa e um encerramento visual.

**Objetivo:** dar ao AI Lab uma identidade visual própria e marcante, sem virar um dashboard, um template SaaS nem uma demonstração desconectada do portfólio (`DESIGN.md`, 6.6: "uma atmosfera mais experimental, sem abandonar a identidade Dark Premium").

**O que não muda:** os dados, os textos e as rotas dos experimentos (SPEC-006), a honestidade dos resultados, os metadados de SEO, o header, o footer e as demais páginas.

**Conflitos com decisões anteriores, resolvidos pelo Bruno em 2026-11-08** (seção 13):

| Briefing | Decisão anterior | Resolução |
|---|---|---|
| Roxo `#A78BFA` e hex próprios (`#090B0B`, `#121815`, `#B5F28A`, `#29332E`, `#A2AEA7`) | O design system só tem o verde-limão como destaque; gradientes "principalmente de verde" (`DESIGN.md`, 3.3) | Tokens do site mais um token novo de roxo, usado só no AI Lab. Os hex do briefing não viram tokens |
| Three.js / React Three Fiber / GSAP | Arquitetura aprovou CSS e IntersectionObserver nativos (`ARCHITECTURE.md`, decisões) | Canvas 2D sem dependência nova |
| Filtros All, Experiments, Research, Projects | O AI Lab classifica por Estudo e Prova de conceito; nenhum item é "Projeto concluído" | Prova de conceito = Experiments, Estudo = Research; Projects só aparece se houver "Projeto concluído" |
| Research Log com datas | Nenhum experimento tem data; não inventar | Sem datas, na ordem da lista de experimentos |

**Posicionamento:** o laboratório continua sendo um conjunto de projetos de aprendizado, não produtos. A abertura aprovada da SPEC-006 ("São projetos de aprendizado, não produtos") permanece na página.

## 3. Escopo

### 3.1. Dentro do escopo

1. Reformulação da página `/ai-lab` e `/pt-BR/ai-lab` em cinco seções: Hero, Philosophy, Experiments & Research, Research Log e Closing.
2. Rede neural em Canvas 2D, com profundidade, partículas, conexões animadas, reação ao cursor e parallax pelo mouse e pelo scroll, no Hero, e uma versão reduzida no encerramento.
3. Experimento em destaque e grade assimétrica, numeração `EXP / 001`, indicadores de estado, hover com profundidade e iluminação e filtros funcionais sem recarregar a página.
4. Linha de pesquisa vertical com os experimentos que têm página, com revelação progressiva ao rolar.
5. Token de cor novo (roxo) e as variáveis do canvas, em `src/styles/tokens.css`.
6. Textos novos em inglês e português (seção 7), metadados inalterados e `e2e/ai-lab.spec.ts` atualizado, com testes novos.
7. O identificador `EXP / 00X` no cabeçalho de cada página de detalhe, para o número ser o mesmo nos dois lugares.

### 3.2. Fora do escopo

- Redesenho das páginas de detalhe `/ai-lab/<slug>` (só ganham o identificador); novas rotas, novos experimentos e novos resultados.
- Three.js, React Three Fiber, GSAP, Framer Motion, WebGL e qualquer dependência nova.
- Datas, métricas, resultados ou registros que não existam nos dados da SPEC-006.
- Cards de projetos da seção Projects dentro do AI Lab (Football Stat Analytics e FintaLab ficam em Projects).
- Som, vídeo, interações de arrastar, cursor personalizado e scroll hijacking.
- Mudanças em Home, About, header, footer e demais páginas; o `AiLabHighlight` da Home não muda.
- Dashboard, filtros por tecnologia ou por modelo, busca e paginação.

## 4. Requisitos funcionais

| ID | Prioridade | Requisito |
|---|---|---|
| NEU-RF-01 | Must | A página tem cinco seções, na ordem: Hero, Philosophy, Experiments & Research, Research Log e Closing. O `h1` existe só no Hero; cada uma das outras seções tem um `h2`. O título da aba e a descrição de SEO não mudam. |
| NEU-RF-02 | Must | O Hero tem o `h1` com o rótulo "AI Lab" e a headline (seção 7.1), a descrição curta, um link CTA "Explore experiments" que leva à seção de experimentos (`#experiments`) e a rede neural como elemento visual dominante, ocupando boa parte do espaço do Hero. |
| NEU-RF-03 | Must | A rede neural é desenhada em um `<canvas>` decorativo (`aria-hidden`, sem foco): nós com posição em três dimensões projetados em perspectiva, conexões entre nós próximos com opacidade conforme a profundidade, partículas que percorrem as conexões, nós que aparecem e desaparecem aos poucos, conexões que se desenham, e partículas com velocidades diferentes. O verde indica atividade (nós ativos e partículas) e o roxo, as conexões e a iluminação. |
| NEU-RF-04 | Must | Em dispositivos com ponteiro fino (mouse), os nós próximos ao cursor reagem de forma discreta (deslocamento e brilho) e há iluminação localizada. Nenhuma informação da página depende do cursor. |
| NEU-RF-05 | Must | Parallax entre camadas: a partir de 1024 px, pelo movimento do mouse e pelo scroll; de 768 a 1023 px, só pelo scroll e com menos camadas; abaixo de 768 px, sem parallax, só com o movimento lento da própria rede. O parallax nunca bloqueia nem altera o scroll natural. |
| NEU-RF-06 | Must | A quantidade de nós se adapta ao aparelho: 90 nós a partir de 1024 px, 56 de 768 a 1023 px e 32 abaixo de 768 px; a resolução do canvas é limitada a 2x no desktop e a 1,5x no celular. Aparelhos com 4 núcleos ou menos, 4 GB de memória ou menos, ou com economia de dados começam na densidade do tablet. |
| NEU-RF-07 | Must | Se a animação ficar lenta (tempo médio de quadro acima de 22 ms por 90 quadros seguidos), a rede reduz os nós em 30%, até duas vezes. Se ainda assim ficar lenta, a animação para em um quadro estático. O piso é de 20 nós. |
| NEU-RF-08 | Must | A animação pausa quando a aba está oculta e quando o canvas está fora da tela, e retoma sozinha. Ao sair da página, todos os recursos são liberados: quadro de animação cancelado, listeners removidos e observadores desconectados. |
| NEU-RF-09 | Must | Com `prefers-reduced-motion: reduce`, a rede é desenhada uma vez, estática, sem reação ao cursor, sem parallax e sem partículas em movimento; as animações CSS decorativas ficam paradas. Todo o conteúdo continua acessível. |
| NEU-RF-10 | Must | Sem JavaScript, ou se o canvas 2D não estiver disponível, o Hero e o encerramento mostram um desenho estático da rede (SVG renderizado no servidor), com a mesma área e sem deslocar o texto. |
| NEU-RF-11 | Must | A seção Philosophy tem um `h2` e três conceitos, **Explore**, **Experiment** e **Understand**, cada um com título, frase (seção 7.2) e uma marca gráfica abstrata animada de forma discreta (nós que se espalham; um par de nós que se liga e se desliga; linhas que convergem a um ponto). Não são três cards: a composição é horizontal a partir de 768 px e em blocos verticais abaixo disso. |
| NEU-RF-12 | Must | A seção Experiments & Research tem um `h2`, a abertura aprovada da SPEC-006 (`aiLab.intro`), a barra de filtros, o experimento em destaque e a grade assimétrica com os demais. Os oito itens da SPEC-006 estão presentes, na mesma lista `ul#ai-lab-list`, e o título de cada um é um `h3`. |
| NEU-RF-13 | Must | O experimento em destaque é `rag-grounding` (campo `featured` em `aiLab.ts`): maior, com resumo, modelo, tecnologias e estado, e o rótulo "Featured experiment". A partir de 1024 px a grade usa 12 colunas de larguras desiguais (destaque com 7 colunas e 2 linhas; os demais com 4, 5 ou 6 colunas); de 768 a 1023 px, 2 colunas com o destaque em largura total; abaixo disso, 1 coluna. |
| NEU-RF-14 | Must | Cada item mostra o número `EXP / 00X` (posição na lista, com três dígitos), o estado como indicador (ponto de cor mais o texto do estado, nunca só a cor), o tipo, o nome, o resumo, o modelo (quando existe) e as tecnologias (quando existem). Os dados vêm de `aiLab.ts` e dos textos da SPEC-006; nada é inventado. |
| NEU-RF-15 | Must | Os experimentos com página (`slug` não nulo) têm um único link, no nome, para `/ai-lab/<slug>` no mesmo idioma. O card "Em planejamento" (Analytics Personas) não tem link. Não existe link quebrado. |
| NEU-RF-16 | Must | Os filtros são **All**, **Experiments** (provas de conceito), **Research** (estudos) e **Projects** (projetos concluídos, só quando algum item for desse tipo). São botões com `aria-pressed`, filtram sem recarregar a página, anunciam o resultado ("Showing X of Y") em uma região `role="status"` e são acessíveis por teclado. Na v1 o filtro Projects não aparece, porque nenhum item é "Projeto concluído". |
| NEU-RF-17 | Must | Os oito itens estão sempre no HTML do servidor. Sem JavaScript, a barra de filtros não aparece e todos os itens ficam visíveis. Com um filtro ativo, os itens que não correspondem recebem `hidden`; o destaque só tem tratamento de destaque enquanto estiver visível. |
| NEU-RF-18 | Must | Hover e foco nos itens com link: profundidade (elevação e leve inclinação) e iluminação localizada em verde e roxo que acompanha o cursor, só com ponteiro fino. O foco por teclado mostra o mesmo contorno do site. Com movimento reduzido, só a cor e a borda mudam. |
| NEU-RF-19 | Must | A seção Research Log tem um `h2`, uma frase de abertura (seção 7.4) e uma lista ordenada (`ol`) com os sete experimentos que têm página, na ordem da lista. Cada registro mostra o nome (`h3`), o contexto (o resumo do experimento), "What I learned" (o texto de aprendizado já aprovado) e um link para o experimento. Não há datas. |
| NEU-RF-20 | Must | A linha e os pontos luminosos ligam os registros. A linha se desenha e cada registro entra conforme o scroll (IntersectionObserver). Sem JavaScript ou com movimento reduzido, todos os registros aparecem completos e estáticos. |
| NEU-RF-21 | Must | O encerramento mostra a headline "Curiosity never stops." (um `h2`) sobre uma versão reduzida da rede (40% dos nós do Hero), com uma transição suave para o fundo do footer. Não tem links novos. |
| NEU-RF-22 | Must | Todos os textos novos existem em inglês e português (seção 7), sem mistura de idiomas; as chaves novas ficam em `aiLab.neural` nos dois `common.json`. |
| NEU-RF-23 | Must | O cabeçalho de cada página de detalhe mostra o mesmo `EXP / 00X` da lista, antes do tipo e do estado. Nada mais muda nas páginas de detalhe. |
| NEU-RF-24 | Should | A iluminação localizada dos itens usa uma única escuta de ponteiro na grade (não uma por item). |

## 5. Requisitos não funcionais

| ID | Categoria | Requisito |
|---|---|---|
| NEU-RNF-01 | Identidade visual | Dark Premium, com os tokens do site. O roxo entra como `--color-neural-purple: #a78bfa` (7,16:1 sobre o fundo e 6,71:1 sobre a superfície) e só no AI Lab. Sem gradiente em todos os elementos, brilho limitado e sem aparência de template de ficção científica. O verde segue sendo a cor de atividade e de ação. |
| NEU-RNF-02 | Desempenho | Sem dependência nova. O código novo de cliente (canvas, filtros e revelação) soma no máximo 20 KB comprimidos, e o canvas é carregado depois da hidratação, sem bloquear o LCP: o texto do Hero é o elemento de LCP. Nenhum deslocamento de layout causado pelo canvas (área reservada) ou pelos filtros. |
| NEU-RNF-03 | Desempenho | Meta de 60 quadros por segundo no desktop de referência, com a degradação automática de NEU-RF-06 e NEU-RF-07. Só `transform`, `opacity` e desenho no canvas animam; nada que recalcule o layout a cada quadro. |
| NEU-RNF-04 | Acessibilidade | Canvas e marcas gráficas são decorativos (`aria-hidden`). Contraste AA para todo texto: a rede nunca fica atrás do texto sem uma máscara que garanta 4,5:1 (texto `foreground` ou `muted` sobre fundo escuro). Navegação por teclado completa (CTA, filtros, itens, links do log), contornos de foco visíveis e alvos de 44 px. |
| NEU-RNF-05 | Movimento | `prefers-reduced-motion` desliga todo movimento decorativo (NEU-RF-09). O parallax obedece a `DESIGN.md` 7.4: nada obrigatório no celular, nada que dependa só do cursor, sem scroll artificial. |
| NEU-RNF-06 | Responsividade | Sem rolagem horizontal em 360, 390, 768, 1024, 1366, 1440 e 1920 px, nos dois idiomas. Os filtros rolam na horizontal no celular, sem quebrar a página. Texto corrido com no máximo 80 caracteres por linha. |
| NEU-RNF-07 | Robustez | Sem WebGL e sem dependência de GPU. Se o canvas falhar, a página continua completa (NEU-RF-10). Sem vazamento de memória ao navegar entre páginas (NEU-RF-08). |
| NEU-RNF-08 | SEO | Todo o conteúdo dos experimentos fica no HTML do servidor (inclusive o que o filtro oculta). O `h1` contém "AI Lab". Metadados, canonical, `hreflang` e Open Graph não mudam. |
| NEU-RNF-09 | Manutenibilidade | Um componente de rede reutilizado no Hero e no encerramento (variante `hero` ou `closing`), configurado por propriedades. A fonte dos experimentos continua sendo `src/config/aiLab.ts` (acrescido do campo `featured`); o número `EXP` é derivado da posição, não duplicado. |
| NEU-RNF-10 | Testabilidade | O contêiner da rede expõe `data-neural-state` (`running`, `static` ou `fallback`), `data-neural-nodes` (quantidade de nós) e `data-neural-parallax` (`full`, `scroll` ou `off`), que são o contrato dos testes. |

## 6. Interface e experiência

### 6.1. Composição

| Seção | Desktop (≥1024 px) | Tablet (768 a 1023 px) | Celular (<768 px) |
|---|---|---|---|
| Hero | Texto à esquerda (no máximo 6 colunas), rede ocupando a largura inteira por trás e à direita; altura de pelo menos 85% da altura da janela | Texto no topo, rede abaixo e por trás, menos nós | Texto centrado, rede por trás com 32 nós e sem parallax |
| Philosophy | Três conceitos lado a lado, separados por filetes, cada um com a marca gráfica acima | Três colunas estreitas | Blocos verticais |
| Experiments & Research | Abertura e filtros; destaque (7 colunas, 2 linhas) e grade de 12 colunas | Duas colunas, destaque em largura total | Uma coluna; filtros em faixa rolável |
| Research Log | Linha vertical à esquerda e registros à direita | Igual, com a linha mais próxima da borda | Linha à esquerda, registros empilhados |
| Closing | Headline grande sobre a rede reduzida, com a base esmaecendo para o footer | Igual | Headline menor, 13 nós |

### 6.2. Estados

| Situação | Comportamento esperado |
|---|---|
| Movimento reduzido | Rede estática (um quadro), sem reação ao cursor, sem parallax, sem revelação por scroll; tudo visível. |
| Sem JavaScript | SVG estático no lugar da rede, sem barra de filtros, oito itens visíveis, registros visíveis. |
| Canvas indisponível | O mesmo que sem JavaScript, só para a rede (`data-neural-state="fallback"`). |
| Aparelho lento | Menos nós, e depois quadro estático; a página segue usável. |
| Aba oculta ou rede fora da tela | Animação pausada; retoma ao voltar. |
| Filtro ativo sem itens | Não ocorre na v1 (Experiments e Research têm itens); se ocorrer, a região de status diz "Showing 0 of 8" e a grade mostra uma mensagem simples. |
| Toque (celular) | Sem hover; a profundidade só aparece no foco e no toque; os filtros funcionam por toque e rolam na horizontal. |
| Navegação por teclado | Skip link, header, CTA, filtros, itens da grade, links do log e footer, na ordem visual. |
| Planejamento | O card "Em planejamento" fica na grade, com borda tracejada e sem link, e aparece nos filtros como Research (é um Estudo). |

## 7. Conteúdo e dados

### 7.1. Hero (aprovado em 2026-11-08)

| Elemento | en | pt-BR |
|---|---|---|
| Rótulo do `h1` | AI Lab | AI Lab |
| Headline (no `h1`) | Exploring the intelligence behind the code. | Explorando a inteligência por trás do código. |
| Descrição | Experiments, research and ideas exploring the possibilities of artificial intelligence. | Experimentos, pesquisa e ideias que exploram as possibilidades da inteligência artificial. |
| CTA | Explore experiments | Explorar experimentos |

O `h1` contém o rótulo e a headline (por exemplo, "AI Lab Exploring the intelligence behind the code."), para manter "AI Lab" no título principal da página.

### 7.2. Philosophy (aprovado em 2026-11-08)

| Elemento | en | pt-BR |
|---|---|---|
| `h2` | The philosophy | A filosofia |
| Explore | Investigate models and emerging technologies. | Investigar modelos e tecnologias emergentes. |
| Experiment | Test ideas, architectures and techniques. | Testar ideias, arquiteturas e técnicas. |
| Understand | Learn from results, failures and discoveries. | Aprender com resultados, falhas e descobertas. |

Títulos dos conceitos: Explore, Experiment, Understand / Explorar, Experimentar, Entender.

### 7.3. Experiments & Research (aprovado em 2026-11-08)

| Elemento | en | pt-BR |
|---|---|---|
| `h2` | Experiments & Research | Experimentos e pesquisa |
| Abertura | O texto `aiLab.intro` já aprovado na SPEC-006 | O mesmo, em português |
| Filtros | All, Experiments, Research, Projects | Todos, Experimentos, Pesquisa, Projetos |
| Nome do grupo de filtros | Filter experiments | Filtrar experimentos |
| Região de status | Showing {count} of {total} | Mostrando {count} de {total} |
| Rótulo do destaque | Featured experiment | Experimento em destaque |
| Número | `EXP / 001` a `EXP / 008` (igual nos dois idiomas) | igual |

Mapeamento dos filtros (a partir do tipo da SPEC-006): prova de conceito → Experiments (RAG e validação); estudo → Research (consistência, personas, escolha de abordagem e de modelo, framework de testes, fine-tuning e o card em planejamento); projeto concluído → Projects (nenhum na v1).

### 7.4. Research Log e Closing (aprovado em 2026-11-08)

| Elemento | en | pt-BR |
|---|---|---|
| `h2` do log | Research log | Registro de pesquisa |
| Frase de abertura | The experiments in the order they appear in the lab, with what each one taught me. There are no dates: this is a path, not a calendar. | Os experimentos na ordem em que aparecem no laboratório, com o que cada um me ensinou. Não há datas: é um caminho, não um calendário. |
| Rótulo do contexto | Context | Contexto |
| Rótulo do aprendizado | What I learned | O que aprendi |
| Link do registro | Read the experiment | Ler o experimento |
| Headline do encerramento (`h2`) | Curiosity never stops. | A curiosidade não para. |

Cada registro reaproveita textos já aprovados da SPEC-006: o contexto é o resumo do experimento e o aprendizado é o campo "O que aprendi". Nenhum texto de experimento é reescrito.

### 7.5. Dados e rotas

| Item | Valor |
|---|---|
| Experimentos | Os oito de `src/config/aiLab.ts` (sete com página e o card "Em planejamento"); novo campo `featured` (`true` só em `rag-grounding`) |
| Rotas | `/en/ai-lab` e `/pt-BR/ai-lab` (as mesmas); detalhes `/ai-lab/<slug>` inalterados |
| Âncora do CTA | `#experiments` na própria página |
| Token novo | `--color-neural-purple: #a78bfa` em `src/styles/tokens.css` |
| Contrato dos testes | `data-neural-state`, `data-neural-nodes` e `data-neural-parallax` no contêiner da rede |

## 8. Critérios de aceitação

| ID | Critério (Given / When / Then) |
|---|---|
| NEU-CA-01 | **Given** `/en/ai-lab` e `/pt-BR/ai-lab`, **when** abertas, **then** há cinco seções na ordem prevista, um único `h1` que contém "AI Lab" e a headline, um `h2` por seção e os cards como `h3`, sem pular níveis. |
| NEU-CA-02 | **Given** o Hero, **when** lido, **then** mostra a descrição e o CTA "Explore experiments" (pt-BR: "Explorar experimentos"); **when** o CTA é acionado, **then** a URL ganha `#experiments` e a seção de experimentos fica visível abaixo do header fixo. |
| NEU-CA-03 | **Given** o desktop sem preferência de movimento, **when** a página abre, **then** o contêiner da rede tem `data-neural-state="running"`, um `<canvas>` com `aria-hidden="true"` e `data-neural-nodes="90"`; **given** 375 px, **then** `data-neural-nodes="32"` e `data-neural-parallax="off"`. |
| NEU-CA-04 | **Given** o desktop, **when** o mouse se move sobre o Hero, **then** a rede reage (o atributo `data-neural-pointer` passa a `active`) e o texto continua legível; **given** um dispositivo de toque, **then** não há reação ao cursor. |
| NEU-CA-05 | **Given** o desktop, **when** a página rola, **then** a camada da rede se desloca (a variável `--neural-shift` muda) e o scroll continua nativo, sem mudar a posição que o navegador calcula; **given** 800 px, **then** `data-neural-parallax="scroll"`; **given** 1280 px, **then** `full`. |
| NEU-CA-06 | **Given** `prefers-reduced-motion: reduce`, **when** a página abre, **then** `data-neural-state="static"`, nenhuma animação CSS decorativa está em execução e todo o conteúdo está visível. |
| NEU-CA-07 | **Given** o canvas 2D indisponível, **when** a página abre, **then** `data-neural-state="fallback"`, o SVG estático aparece e o texto não se desloca; **given** JavaScript desabilitado, **then** o SVG aparece, os oito itens e todos os registros estão visíveis e não há barra de filtros. |
| NEU-CA-08 | **Given** a Philosophy, **when** lida, **then** tem o `h2` e os três conceitos com título, frase e marca gráfica oculta para leitores de tela, e não é uma lista de cards. |
| NEU-CA-09 | **Given** a seção de experimentos, **when** lida, **then** `ul#ai-lab-list` tem oito itens, `rag-grounding` é o destaque com o rótulo "Featured experiment", e cada item mostra `EXP / 00X` na ordem de `aiLab.ts`. |
| NEU-CA-10 | **Given** cada item, **when** lido, **then** mostra o estado em texto, o tipo, o nome, o resumo, o modelo e as tecnologias só quando existem, com os mesmos valores da SPEC-006. |
| NEU-CA-11 | **Given** os itens com `slug`, **when** o link do nome é acionado (mouse ou teclado), **then** abre `/ai-lab/<slug>` no mesmo idioma; **given** o card "Em planejamento", **then** não tem link; **given** a página inteira, **then** nenhum link leva a uma rota inexistente. |
| NEU-CA-12 | **Given** a barra de filtros, **when** "Research" é acionado, **then** ficam visíveis só os cinco estudos mais o card em planejamento (seis itens), `aria-pressed="true"` está só nesse botão e a região de status diz "Showing 6 of 8"; **when** "Experiments" é acionado, **then** ficam os dois experimentos de prova de conceito; **when** "All" é acionado, **then** voltam os oito. A URL não muda e a página não recarrega. |
| NEU-CA-13 | **Given** os filtros, **when** a página é lida, **then** o filtro Projects não existe; **given** o teclado, **then** `Tab` alcança cada botão e `Enter` e `Espaço` o acionam, com contorno de foco e 44 px de altura. |
| NEU-CA-14 | **Given** um filtro ativo, **when** o HTML do servidor é lido, **then** os oito itens estão presentes; os que não correspondem têm `hidden` só depois da hidratação. |
| NEU-CA-15 | **Given** o Research Log, **when** lido, **then** é uma lista ordenada com os sete experimentos que têm página, na ordem da lista, cada um com nome, contexto, "What I learned" e o link "Read the experiment" para a página certa, e a página não tem elemento `time` nem data. |
| NEU-CA-16 | **Given** o Research Log, **when** a página rola, **then** os registros ganham a classe de entrada ao entrar na janela; **given** movimento reduzido ou sem JavaScript, **then** todos aparecem completos desde o início. |
| NEU-CA-17 | **Given** o Closing, **when** lido, **then** tem o `h2` "Curiosity never stops." (pt-BR: "A curiosidade não para."), a rede reduzida com 40% dos nós do Hero (36 no desktop) e nenhum link novo. |
| NEU-CA-18 | **Given** as páginas de detalhe, **when** abertas, **then** mostram `EXP / 00X` igual ao da lista antes do tipo e do estado, e o resto da página é igual ao da SPEC-006. |
| NEU-CA-19 | **Given** a página, **when** o texto visível é lido nos dois idiomas, **then** todos os textos novos coincidem com a seção 7, as chaves de `aiLab.neural` existem nos dois idiomas e não há mistura de idiomas; os textos aprovados da SPEC-006 estão intactos. |
| NEU-CA-20 | **Given** 360, 390, 768, 1024, 1366, 1440 e 1920 px, nos dois idiomas, **when** a página abre, **then** não há rolagem horizontal; **given** 375 px, **then** a faixa de filtros rola na horizontal dentro do próprio contêiner. |
| NEU-CA-21 | **Given** a navegação até outra página e a volta, **when** repetida várias vezes, **then** não há erro no console, há um único canvas na página e o estado da rede é `running` de novo. |
| NEU-CA-22 | **Given** o carregamento da página, **when** o tráfego é medido, **then** o código do canvas chega depois da hidratação, o deslocamento de layout acumulado é menor que 0,02 e o conteúdo do Hero aparece sem esperar o canvas. |
| NEU-CA-23 | **Given** o repositório, **when** `pnpm typecheck` e `pnpm test:e2e` rodam, **then** passam, com os testes de estrutura do AI Lab atualizados e os de comportamento (dados, rotas, detalhe, SEO, honestidade dos textos) intactos. |

## 9. Dependências

- SPEC-006: fonte dos experimentos, rotas, textos, tipos e estados; seu AIL-RF-01 e AIL-RF-02 (lista e cards) passam a ser definidos por esta SPEC, e o elemento gráfico estático da seção 6.1 e o Q4 ("gráfico estático") são substituídos.
- `src/components/ai-lab/` (`AiLabContent`, `ExperimentCard`, `ExperimentMeta`, `AiLabGraphic`, `ExperimentDetail`), `src/config/aiLab.ts`, `src/content/{en,pt-BR}/common.json`.
- `src/styles/tokens.css` (token novo) e `src/app/globals.css` (movimento reduzido, que já existe).
- `src/components/sections/HeroParallaxLayers.tsx`: padrão de parallax do Hero da Home (CSS onde há scroll-driven animations, JavaScript nos demais), a reutilizar na leitura de variáveis e no tratamento de movimento reduzido.
- Testes: `e2e/ai-lab.spec.ts` (estrutura da lista muda), `e2e/layout.spec.ts`, `e2e/i18n.spec.ts` e `e2e/assets.spec.ts` (conferir que seguem passando).
- `.docs/DESIGN.md` (3.3 e 6.6) e `.docs/DESIGN_SYSTEM.md`: registrar o roxo como acento exclusivo do AI Lab na implementação.

## 10. Riscos

| Risco | Impacto | Mitigação |
|---|---|---|
| A rede ficar atrás do texto e piorar a leitura. | Contraste abaixo de AA | Máscara escura sob o texto (NEU-RNF-04), opacidade máxima dos nós atrás do texto e verificação visual por captura. |
| Desempenho ruim em aparelho fraco ou bateria baixa. | Quadros perdidos, aquecimento | Densidade por tamanho de tela e por capacidade, degradação automática, pausa fora da tela e quadro estático como piso. |
| O efeito virar decoração sem propósito. | Contraria `DESIGN.md` 8 | A rede é o conceito do laboratório e o único movimento contínuo; marcas da Philosophy e revelação do log são discretas e param com movimento reduzido. |
| A página perder SEO ao esconder itens no filtro. | Menos conteúdo indexável | Todos os itens no HTML do servidor; `hidden` só depois da hidratação (NEU-RF-17). |
| O roxo diluir a identidade do restante do site. | Inconsistência visual | Token de uso exclusivo do AI Lab; header, footer e demais páginas inalterados. |
| Testes de estrutura do AI Lab quebrarem em massa. | Retrabalho e regressão | A seção 9 lista o que muda; `ul#ai-lab-list`, os nomes e os links são preservados, e só níveis de título, contagens e ordem de tabulação mudam. |
| O filtro Projects não existir na v1 contraria o briefing. | Expectativa | Decisão do Bruno (2026-11-08); o filtro aparece sozinho quando houver um item "Projeto concluído". |
| Canvas e testes automatizados em modo headless. | Testes instáveis | O contrato `data-neural-*` evita comparar pixels; o desenho em si é conferido por captura manual. |

## 11. Perguntas abertas

Todas respondidas em 2026-11-08; nenhuma pergunta bloqueia a entrega.

| ID | Pergunta | Resposta |
|---|---|---|
| Q1 | Os textos novos das seções 7.1 a 7.4, em inglês e português, podem ser publicados? | Sim: aprovados como estão (as traduções para pt-BR são minhas, no mesmo tom). |
| Q2 | O Research Log segue a ordem da lista ou uma ordem de aprendizado? | Sem datas, na ordem da lista (a frase de abertura diz "não é um calendário"). |
| Q3 | O experimento em destaque é o RAG (`rag-grounding`)? | Sim, por ser o mais estruturado e o primeiro da lista (default, sem objeção). |
| Q4 | As páginas de detalhe também ganham a nova atmosfera? | Não: só o identificador `EXP / 00X`. |
| Q5 | O `EXP / 00X` aparece também no cabeçalho do detalhe? | Sim (default): é um identificador, não só decoração. |
| Q6 | O `h1` reúne o rótulo "AI Lab" e a headline? | Sim: os dois dentro do `h1`. |

## 12. Premissas

1. O briefing vale para a página de lista; as páginas de detalhe só ganham o identificador (Q4).
2. A rede é Canvas 2D desenhado à mão, sem biblioteca; é uma projeção em perspectiva (nós com x, y e z), não 3D com iluminação real.
3. Os números de nós (90, 56, 32, 20 de piso) e o limiar de 22 ms são pontos de partida; podem ser ajustados na implementação, registrando o motivo.
4. O estado "Em planejamento" aparece como Research porque o tipo é "Estudo".
5. Os filtros guardam o estado só na memória da página; recarregar volta para "All".
6. As marcas gráficas da Philosophy e a rede do encerramento são SVG e Canvas autorais, sem imagens e sem direitos a verificar.
7. Os hex do briefing que diferem dos tokens do site (fundo, superfície, verde, borda e texto) não viram tokens; o design system do site prevalece.
8. Nenhum dado novo do Bruno é publicado: todos os textos de experimento vêm da SPEC-006.

## 13. Decisões registradas

| Data | Decisão | Quem |
|---|---|---|
| 2026-11-08 | O AI Lab ganha a identidade "Neural Interface" imersiva, em verde e roxo, com Hero, Philosophy, Experiments & Research, Research Log e Closing. | Bruno (briefing) |
| 2026-11-08 | Cores: tokens do site e um token novo de roxo (`#a78bfa`) como acento exclusivo do AI Lab; os hex do briefing não viram tokens. | Bruno |
| 2026-11-08 | Tecnologia: Canvas 2D sem dependência nova, sem Three.js, sem GSAP e sem Framer Motion. | Bruno |
| 2026-11-08 | Filtros: Prova de conceito = Experiments, Estudo = Research; Projects só aparece quando houver um "Projeto concluído". | Bruno |
| 2026-11-08 | Research Log sem datas, na ordem do aprendizado (ordem da lista, Q2). | Bruno |
| 2026-11-08 | Textos da seção 7 aprovados como escritos; detalhes só com `EXP / 00X`; `h1` com o rótulo e a headline. | Bruno |
| 2026-11-08 | O parallax e o deslocamento da camada usam a posição da seção em relação à janela, não o `scrollY` absoluto: o `scrollY` empurrava a rede do encerramento para fora da seção. | Implementação (bug achado na revisão visual) |
| 2026-11-08 | A barra de filtros só é montada depois da hidratação, para não aparecer inerte sem JavaScript (NEU-RF-17). | Implementação |

## 14. Implementação e verificação

Implementada em 2026-11-08 na branch `feat/ai-lab-neural` (empilhada sobre `feat/ai-lab-pos`, PR #17, ainda não integrada). Nenhuma biblioteca nova.

### 14.1. O que foi entregue

- Hero, Philosophy, Experiments & Research (destaque, grade assimétrica, filtros, `EXP / 00X`, iluminação e inclinação ao cursor), Research Log e Closing, nesta ordem, em `en` e `pt-BR`.
- Rede em Canvas 2D (`src/components/ai-lab/neural/`): perspectiva 3D, interação com o cursor, parallax por mouse e por scroll, degradação adaptativa, pausa fora da tela e em aba oculta, limpeza completa ao desmontar, quadro estático com movimento reduzido e SVG de servidor como alternativa.
- Token `--color-neural-purple` (`#a78bfa`) e `--shadow-glow-purple`, exclusivos do AI Lab.
- Removidos `ExperimentCard` e `AiLabGraphic`, substituídos por `ExperimentTile` e pela rede.

### 14.1.1. Padronização com o resto do site (pedido do Bruno)

Só um efeito foi levado para fora do AI Lab: a luz verde discreta que segue o cursor, no `Card` com `interactive` (hoje, os três destaques da Home). Vem de `CardLight` (uma única escuta de ponteiro para todos os cards, só com ponteiro fino e sem movimento reduzido) e do bloco `[data-card-light]` em `globals.css`. A inclinação, o roxo, a rede e a revelação no scroll continuam exclusivos do AI Lab. Os cards da Home não são clicáveis por inteiro (o link é "View on GitHub"); o hover indica que há uma ação dentro do card. Testes em `e2e/home.spec.ts` (3 novos; mutação removendo `CardLight` derruba o teste de acompanhamento do cursor). Suíte completa: 885 testes passando.

### 14.2. Divergências em relação ao texto original da SPEC

| Item | Divergência | Motivo |
|---|---|---|
| Atributo do canvas | O `canvas` não tem `aria-hidden` próprio; o contêiner `[data-neural-variant]` é `aria-hidden`. | O Biome (`noAriaHiddenOnFocusable`) rejeita o atributo no `canvas`; o efeito para leitores de tela é o mesmo. |
| `data-neural-nodes` | Guarda a quantidade inicial planejada; a redução fica em `data-neural-degraded` (0, 1 ou 2). | O teste precisa distinguir a densidade por faixa da degradação. |
| Status dos filtros | Frase montada com as chaves `showing` e `of` ("Showing 2 of 8"). | Evita concatenar uma frase inteira com contagem em duas línguas. |
| `.neural-glow` | Camada de luz difusa (roxo e verde) sob a rede, não prevista nos requisitos. | O briefing pede iluminação difusa e a rede sozinha ficava fraca em telas grandes. |
| Parallax | Calculado pela posição da seção em relação à janela, não por `scrollY`. | Com `scrollY` absoluto a rede do encerramento saía da seção. |
| Barra de filtros | Montada só depois da hidratação. | NEU-RF-17: sem JavaScript a barra não aparece. |

### 14.3. Verificação

| Verificação | Resultado |
|---|---|
| `tsc --noEmit` | Sem erros |
| `biome check e2e src` | Sem erros (o `biome check .` ainda aponta o formato CRLF de `biome.json`, `package.json` e `playwright.config.ts`, arquivos que esta SPEC não tocou) |
| `pnpm test:e2e`, suíte completa | 885 testes passando (linha de base anterior: 830) |
| Novos | `e2e/ai-lab-neural.spec.ts`: regras puras (densidade, parallax, capacidade, degradação, monitor de quadros), seções e textos nos dois idiomas, filtros, Research Log, movimento reduzido, sem JavaScript, sem contexto 2D, degradação sob CPU limitada, limpeza dos ouvintes, contrato `data-neural-*` |
| Atualizados | `e2e/ai-lab.spec.ts` (h1 com rótulo e headline, cards em `h3`, dois links por experimento na ordem de tabulação, redes decorativas) |
| Bugs achados pelos testes | `degrade(90)` dava 62 por ponto flutuante (corrigido com aritmética inteira); a degradação ignorava quadros acima de 250 ms, justamente os de aparelhos muito lentos (limite agora 1 s) |
| Instabilidade | Em uma das duas execuções completas, `layout.spec.ts` "passar ao desktop e voltar ao celular o deixa fechado" falhou; passou isolado (50 de 50) e na repetição da suíte (882 de 882). Não foi investigada além disso. |
| Visual | Capturas reais em Chromium (desktop 1440, celular 390, todas as seções). Não há teste de pixels; o desenho é conferido por captura, como previsto nos riscos. |

## Refinamento

- 2026-11-08, v0.1.0: SPEC criada a partir do briefing do Bruno, do `DESIGN.md` (3.3, 6.6, 7 e 8), do `DESIGN_SYSTEM.md` (4.9), da `ARCHITECTURE.md` (decisão de animações), do `CLAUDE.md` e do código atual do AI Lab. Quatro conflitos com decisões anteriores foram levados ao Bruno e resolvidos (seção 2). Textos novos aguardam a aprovação (Q1); nada foi implementado.
- 2026-11-08, v0.2.0: textos e perguntas Q1 a Q6 resolvidos; implementação concluída e verificada (seção 14); status Done.
