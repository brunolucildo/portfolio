# SPEC-006 — AI Lab

## 1. Identificação

| Campo | Valor |
|---|---|
| Nome | AI Lab |
| Identificador | SPEC-006 |
| Slug | `006-ai-lab` |
| Versão | 0.3.0 |
| Status | Done em 2026-11-08, por decisão do Bruno; os itens não verificados seguem para o QA final (antes: In Review, textos aprovados e implementada em 2026-11-08; aguardando revisão do usuário e do PR; material adicional da seção 7.6 segue em aberto) |
| Data | 2026-11-08 |
| Origem | SPEC-006 de `.specs/FEATURES.md` (v0.1, Draft) |

Prioridades usadas: **Must** (obrigatório para a v1), **Should** (desejável; pode ser adiada sem bloquear a entrega).

## 2. Contexto

O AI Lab é a seção do portfólio dedicada a experimentos, estudos e provas de conceito com inteligência artificial. Hoje `/ai-lab` é uma página provisória `noindex` (`PagePlaceholder`), embora a Home (`home.aiLab`) e o About (link "Explorar o AI Lab") já apontem para ela e prometam "projetos de aprendizado, com foco em validar o que os modelos produzem".

**Objetivo:** mostrar o raciocínio técnico por trás de experimentos com IA (o que se quis descobrir, como se abordou, o que foi medido e onde falha), sem virar um blog técnico nem uma lista de ferramentas de IA (`BUSINESS.md`, 7; `CONTENT.md`, 4.6).

**Relação com Projects:** o Football Stat Analytics já tem página de detalhe em Projects, escrita como projeto (visão geral, desafio, solução, arquitetura, decisões, estado). O AI Lab o olha por outro ângulo: **cada experimento é um recorte com hipótese, método, resultado e limitação**. Os dois não se repetem: o AI Lab liga ao projeto de origem, e Projects continua sendo o lugar do produto e da arquitetura.

**Fonte do conteúdo:** repositórios públicos de Bruno (`football-stat-analytics-cli`, `fintalab`, `analytics-personas`) e a documentação do projeto. Nada é inventado: cada afirmação e cada número deste rascunho vem de um README público dele (seção 7.5) e entra como "provisório" até a aprovação.

**Posicionamento:** a seção não é uma vitrine de busca de emprego e não usa expressões como "Open to Work". Experimentos não são apresentados como produtos.

## 3. Escopo

### 3.1. Dentro do escopo

1. Página de lista em `/ai-lab` com um card por experimento (componente "AI Experiment Card" do `DESIGN_SYSTEM.md`, 4.9), nos dois idiomas.
2. Páginas de detalhe em `/ai-lab/[slug]` para quatro experimentos (seção 7.1), com os campos de `FEATURES.md` e `CONTENT.md`: objetivo, problema investigado, abordagem e implementação, resultados, limitações, aprendizados, modelo, tecnologias e estado.
3. Um card "Em planejamento" para o Analytics Personas, sem página de detalhe.
4. Classificação de cada experimento por **tipo** (Estudo, Prova de conceito, Projeto concluído) e por **estado** (seção 7.2).
5. Fonte única de dados em `src/config/aiLab.ts`, no mesmo padrão de `projects.ts`, `experience.ts` e `technologies.ts`.
6. Textos em inglês e português, metadados indexáveis nos dois idiomas, `e2e/ai-lab.spec.ts` e a remoção do `noindex` de `/ai-lab`.
7. Composição visual própria e discreta, dentro da identidade Dark Premium (seção 6).

### 3.2. Fora do escopo

- Blog, artigos, newsletter ou qualquer fluxo editorial recorrente.
- Demonstração ao vivo, chat embutido ou qualquer chamada de modelo a partir do site (nenhuma chave de API, nenhum backend).
- Experimentos sem registro público (por exemplo, trabalho em ambiente profissional ou notas privadas).
- Resultados de trabalho corporativo, nome da empresa, nome do curso e da instituição da pós-graduação.
- Nomes de atletas, trechos ou dados dos relatórios usados no Football Stat Analytics (os PDFs não são públicos).
- Percentuais, gráficos de desempenho e rankings de modelos. Os números entram como contagens, com amostra e ressalva.
- Filtros, busca e paginação da lista (são cinco entradas).
- Mudanças na Home, no About, no Header e no Footer: o item de menu e os links para `/ai-lab` já existem.
- Páginas de detalhe para o FintaLab como produto e para o Analytics Personas.

## 4. Requisitos funcionais

| ID | Prioridade | Requisito |
|---|---|---|
| AIL-RF-01 | Must | A rota `/en/ai-lab` (pt-BR: `/pt-BR/ai-lab`) tem um `h1`, um parágrafo de abertura e a lista de experimentos na ordem da seção 7.1. A página deixa de ser provisória e `noindex`. |
| AIL-RF-02 | Must | Cada experimento aparece na lista como um AI Experiment Card com nome, tipo, estado, resumo de uma frase, modelo (quando houver) e tecnologias (quando houver). Os quatro experimentos com detalhe levam à página de detalhe; o card "Em planejamento" não é um link. |
| AIL-RF-03 | Must | As rotas `/en/ai-lab/[slug]` e `/pt-BR/ai-lab/[slug]` existem para os slugs da seção 7.1 e retornam 404 para qualquer outro valor. |
| AIL-RF-04 | Must | A página de detalhe tem um `h1` com o nome, a linha de fatos (tipo, estado, modelo, tecnologias, projeto de origem) e uma seção com `h2` para cada campo da seção 7.3, na ordem: Objetivo, Problema investigado, Abordagem, Resultados, Limitações e Aprendizados. |
| AIL-RF-05 | Must | O tipo e o estado de cada experimento são exibidos em **texto**, nunca só por cor ou forma, e usam apenas o vocabulário da seção 7.2. |
| AIL-RF-06 | Must | Estudo, prova de conceito e projeto concluído são distinguíveis na lista e no detalhe. Nenhum experimento é apresentado como produto, e nenhum dos cinco é classificado como "Projeto concluído" na v1. |
| AIL-RF-07 | Must | Todo resultado numérico é uma contagem com a amostra ("43 de 48"), nunca um percentual, e vem acompanhado da ressalva sobre o tamanho da amostra ou sobre os casos terem guiado os ajustes, conforme o rascunho da seção 7.3. |
| AIL-RF-08 | Must | Toda página de detalhe tem uma seção de Limitações com pelo menos uma limitação relevante e não apresenta resultado que o repositório público não documente. |
| AIL-RF-09 | Must | O modelo e as tecnologias exibidos são os documentados: `gpt-4o-mini` e embeddings da OpenAI nos experimentos do Football e do FintaLab. O card "Em planejamento" não declara modelo (o repositório não define) e não lista tecnologias. |
| AIL-RF-10 | Must | Cada detalhe liga ao projeto de origem em `/projects/football-stat-analytics` (ou ao FintaLab na lista de Projects) e ao repositório público, com rótulos que descrevem o destino. |
| AIL-RF-11 | Must | Toda tecnologia exibida no AI Lab existe em Technologies (`technologies.ts`) com o mesmo nome. Nenhuma tecnologia nova é criada por esta SPEC. |
| AIL-RF-12 | Must | A página não cita o nome da empresa, o curso nem a instituição da pós-graduação, nome de atleta, percentual (`%`) nem expressões de disponibilidade profissional. |
| AIL-RF-13 | Must | Há metadados indexáveis em cada idioma, na lista e em cada detalhe (título, descrição, canonical, `hreflang`, Open Graph), sem `noindex`, e as páginas entram no sitemap. |
| AIL-RF-14 | Must | O Language Switcher de uma página de detalhe leva ao mesmo experimento no outro idioma. |
| AIL-RF-15 | Must | Nomes de tecnologia, de modelo e de comandos permanecem na grafia original nos dois idiomas; só os rótulos, os títulos de seção e os textos corridos são traduzidos. |
| AIL-RF-16 | Should | A página de detalhe oferece navegação para o experimento anterior e o seguinte. |

## 5. Requisitos não funcionais

| ID | Categoria | Requisito |
|---|---|---|
| AIL-RNF-01 | Acessibilidade | Um único `h1` por página, `h2` por seção sem pular níveis, listas semânticas, estado e tipo em texto, contraste AA, foco visível nos cards e links e card inteiro acionável por um único link com nome acessível. |
| AIL-RNF-02 | Responsividade | Sem rolagem horizontal em 360, 390, 768, 1366, 1440 e 1920 px, nos dois idiomas. Texto corrido com no máximo 80 caracteres por linha. Lembrete do design system: só existem os breakpoints `md`, `lg` e `xl`. |
| AIL-RNF-03 | Desempenho | Sem dependência de runtime nova, sem imagem raster e sem chamada de rede em runtime. O elemento gráfico é CSS ou SVG estático. Sem layout shift. |
| AIL-RNF-04 | Movimento | Qualquer animação respeita `prefers-reduced-motion`, usa só `transform` e `opacity`, nunca interfere no scroll natural e fica desativada abaixo de 1024 px. A v1 não tem animação de entrada (seção 6.3). |
| AIL-RNF-05 | Consistência visual | Dark Premium, verde-limão apenas onde há função (estado e foco), sem neon, sem glitch ou elemento de terminal decorativo, sem gradiente decorativo e sem borda ou numeração meramente decorativa. |
| AIL-RNF-06 | SEO | Título e descrição únicos por página e idioma, `hreflang` ligando as versões, um `h1` descritivo e as rotas no sitemap. |
| AIL-RNF-07 | Manutenibilidade | Slug, tipo, estado, tecnologias, imagem de origem e links ficam em `src/config/aiLab.ts`; os textos traduzidos ficam em `common.json`. Adicionar um experimento não exige alterar componente. |
| AIL-RNF-08 | Segurança e privacidade | Nenhuma chave, caminho local, banco `.db` ou relatório entra no site. Os números vêm dos README públicos; o conteúdo dos relatórios e os nomes de atletas ficam de fora. |

## 6. Interface e experiência

### 6.1. Composição

**Lista (`/ai-lab`):** cabeçalho com `h1`, abertura e um elemento gráfico abstrato discreto (camadas geométricas em tom secundário, atrás do texto, decorativo e `aria-hidden`). Abaixo, os experimentos como **AI Experiment Cards**: duas colunas a partir de 1024 px e uma coluna abaixo. O card mostra, de cima para baixo: tipo e estado (texto), nome, resumo, modelo e tecnologias. Os cards são um componente específico do AI Lab e o único lugar com cards na página; o card "Em planejamento" mantém a mesma estrutura, mas sem hover de link e com o estado "Em planejamento" em destaque.

**Detalhe (`/ai-lab/[slug]`):** layout editorial, sem cards, no mesmo padrão de Projects: cabeçalho com nome e linha de fatos, depois as seções em duas colunas separadas por filete a partir de 1024 px (`h2` na coluna estreita, texto na larga) e coluna única abaixo. As contagens de resultados aparecem como lista, cada item com a contagem em destaque tipográfico e a explicação. Os números não viram gráfico.

### 6.2. Estados

| Situação | Comportamento esperado |
|---|---|
| Experimento sem modelo ou sem tecnologias (card "Em planejamento") | O card omite a linha, sem espaço reservado. |
| Slug inexistente | 404 padrão do site, nos dois idiomas. |
| Texto longo em pt-BR | Quebra dentro da coluna, sem rolagem horizontal. |
| Navegação por teclado | Skip link, header, cada card como um único alvo, links do detalhe, footer. Foco visível. |
| JavaScript desabilitado | Todo o conteúdo legível. |
| `prefers-reduced-motion` | Nenhuma diferença: a v1 não tem movimento. |

Não há estado de carregamento, vazio ou erro de dados: o conteúdo é estático.

### 6.3. Movimento

A direção visual do AI Lab permite camadas animadas (`DESIGN.md`, 6.6 e 7), mas a v1 entrega o elemento gráfico **estático**. Um movimento sutil pode vir depois, reaproveitando a mecânica de parallax já testada, se o Bruno pedir (Q4).

## 7. Conteúdo e dados

### 7.1. Experimentos (rascunho para aprovação)

Ordem da lista: do mais estruturado ao mais exploratório. **Tipo** e **estado** seguem a seção 7.2; "Projeto de origem" é onde o experimento nasceu.

| Slug | Nome (`en`) | Nome (`pt-BR`) | Tipo | Estado | Modelo | Tecnologias | Projeto de origem |
|---|---|---|---|---|---|---|---|
| `rag-grounding` | Grounded answers over reports (RAG) | Respostas fundamentadas em relatórios (RAG) | Proof of concept | In development | gpt-4o-mini, OpenAI embeddings | TypeScript, Node.js, OpenAI API, SQLite, RAG | Football Stat Analytics |
| `output-validation` | Validating model output with rules and a judge model | Validação da saída do modelo com regras e um modelo juiz | Proof of concept | In development | gpt-4o-mini | TypeScript, Node.js, OpenAI API, SQLite | Football Stat Analytics |
| `score-consistency` | Median of three samples for stable scores | Mediana de três amostras para notas estáveis | Study | Concluded | gpt-4o-mini | TypeScript, Node.js, OpenAI API | Football Stat Analytics |
| `analyst-personas` | Analyst personas built with prompts | Personas de analista construídas com prompts | Study | Concluded | gpt-4o-mini | TypeScript, OpenAI API, SQLite | FintaLab |
| (sem página) | Analytics Personas | Analytics Personas | Study | Planning | não definido | nenhuma | analytics-personas |

Origem das tecnologias: `projects.ts` (Football e FintaLab). "Node.js" no experimento de consistência e "RAG" só no primeiro seguem o que cada experimento usa de fato.

### 7.2. Tipos e estados

| Rótulo (`en` / `pt-BR`) | Significado |
|---|---|
| Study / Estudo | Investigação para aprender ou medir algo; pode terminar sem produto. |
| Proof of concept / Prova de conceito | Implementação que testa se uma abordagem funciona, com limitações declaradas. |
| Completed project / Projeto concluído | Entrega finalizada e estável. Não usado na v1. |
| In development / Em desenvolvimento | O experimento ainda evolui no repositório. |
| Concluded / Concluído | A pergunta do experimento foi respondida; o código pode continuar existindo. |
| Planning / Em planejamento | Só há intenção e fundação técnica; nenhum resultado. |

### 7.3. Textos de interface (rascunho para aprovação)

**Abertura da lista**

- en: "I'm studying AI systems development and management, and I use study projects to explore language models. Each experiment states what I wanted to find out, how I approached it, what I measured and where it falls short. They are learning projects, not products."
- pt-BR: "Estudo desenvolvimento e gestão de sistemas de IA e uso projetos de estudo para explorar modelos de linguagem. Cada experimento diz o que eu queria descobrir, como abordei, o que medi e onde ele falha. São projetos de aprendizado, não produtos."

**Rótulos:** `Objective / Objetivo`, `Problem investigated / Problema investigado`, `Approach / Abordagem`, `Results / Resultados`, `Limitations / Limitações`, `What I learned / O que aprendi`, `Model / Modelo`, `Technologies / Tecnologias`, `Part of / Parte de`, `Repository / Repositório`, `All experiments / Todos os experimentos`.

**Experimento 1: Grounded answers over reports (RAG) / Respostas fundamentadas em relatórios (RAG)**

| Campo | en | pt-BR |
|---|---|---|
| Resumo | Answering questions about scouting reports using only retrieved excerpts, and showing how much of each answer can be traced back to them. | Responder perguntas sobre relatórios de observação usando só os trechos recuperados, mostrando quanto de cada resposta pode ser rastreado até eles. |
| Objetivo | Answer questions about scouting reports using only what the reports say, and make it visible how much of each answer is actually supported. | Responder perguntas sobre relatórios de observação usando só o que os relatórios dizem, e deixar visível quanto de cada resposta tem suporte de fato. |
| Problema | A model asked about reports it has not read invents plausible details: numbers, sources and actions. Citing a source does not prove that the source says it. | Um modelo perguntado sobre relatórios que não leu inventa detalhes plausíveis: números, fontes e ações. Citar uma fonte não prova que a fonte diga aquilo. |
| Abordagem | Report PDFs are turned into text, translated from Spanish to Brazilian Portuguese, split into chunks and stored with embeddings in SQLite. A question retrieves the five most relevant chunks, ranked by a hybrid score that combines embedding similarity with keyword overlap and discards weak matches. The prompt requires a source after each statement and runs at temperature 0. Every answer then ends with a grounding report: a lexical check of how many statements, numbers and cited sources appear in the retrieved text, followed by a semantic check made by a second model call. | Os PDFs dos relatórios viram texto, são traduzidos do espanhol para o português do Brasil, divididos em trechos e guardados com embeddings no SQLite. Uma pergunta recupera os cinco trechos mais relevantes, ordenados por uma nota híbrida que combina a similaridade dos embeddings com a coincidência de palavras-chave e descarta os trechos fracos. O prompt exige uma fonte depois de cada afirmação e roda com temperatura 0. Toda resposta termina com um relatório de fundamentação: uma checagem lexical de quantas afirmações, números e fontes citadas aparecem no texto recuperado, seguida de uma checagem semântica feita por uma segunda chamada ao modelo. |
| Resultados | In the evaluation, a question supported by the reports was answered with the semantic check passing, and questions the reports could not answer (a past tournament winner, a player's salary) were declined as expected. One question written afterwards failed: retrieval ranked the right report first but filled the other four slots with excerpts about other athletes, and the model declined. Only a handful of RAG questions were tested, so this shows behavior, not a failure rate. | Na avaliação, uma pergunta com suporte nos relatórios foi respondida com a checagem semântica aprovada, e as perguntas que os relatórios não respondem (o campeão de um torneio passado, o salário de um jogador) foram recusadas como esperado. Uma pergunta escrita depois falhou: a busca colocou o relatório certo em primeiro, mas preencheu as outras quatro vagas com trechos sobre outros atletas, e o modelo recusou. Só poucas perguntas de RAG foram testadas, então isto mostra comportamento, não uma taxa de falha. |
| Limitações | The index has no athlete metadata to filter on, so a question about one athlete can retrieve excerpts about others. PDF extraction does not use OCR, so scanned reports may yield no text. The relevance score ranks excerpts; it does not measure confidence or truth. The lexical check is not semantic, and answers are not compared with official statistics. | O índice não tem metadados do atleta para filtrar, então uma pergunta sobre um atleta pode recuperar trechos de outros. A extração de PDF não usa OCR, então relatórios escaneados podem não render texto. A nota de relevância ordena trechos; não mede confiança nem verdade. A checagem lexical não é semântica, e as respostas não são comparadas com estatísticas oficiais. |
| Aprendizados | A citation proves nothing by itself: what helped was showing, next to the answer, what could and could not be traced. A retrieval failure looks like a model failure, so the two are worth measuring apart. | Uma citação não prova nada sozinha: o que ajudou foi mostrar, ao lado da resposta, o que pôde e o que não pôde ser rastreado. Uma falha de busca parece uma falha do modelo, então vale medir as duas separadamente. |

**Experimento 2: Validating model output with rules and a judge model / Validação da saída do modelo com regras e um modelo juiz**

| Campo | en | pt-BR |
|---|---|---|
| Resumo | Checking what a language model says with rules in code and a second model that has to quote the evidence. | Checar o que um modelo de linguagem diz com regras em código e um segundo modelo que precisa citar a evidência. |
| Objetivo | Keep every statement an analyst persona makes tied to the evidence the user supplied. | Manter cada afirmação de uma persona de analista ligada à evidência que o usuário forneceu. |
| Problema | Prompt instructions alone do not guarantee that a model follows a policy. In the first live tests it produced flattering adjectives, actions the data never mentioned and scores for attributes without evidence. | Instruções no prompt, sozinhas, não garantem que o modelo siga uma política. Nos primeiros testes ao vivo ele produziu adjetivos elogiosos, ações que os dados nunca citaram e notas para atributos sem evidência. |
| Abordagem | Deterministic rules enforce the answer format and reject numbers, adjectives and actions that are not in the user's input. A semantic verifier, a second model, judges each remaining statement and must quote the evidence; a quote that is not in the evidence is rejected, and if the verifier itself fails, the answer is accepted with a warning. A rejected answer gets one automatic correction attempt that lists the violated rules. A live evaluation harness runs the real model on fixed cases and on cases written afterwards, and reports how many answers pass. | Regras determinísticas impõem o formato da resposta e rejeitam números, adjetivos e ações que não estão na entrada do usuário. Um verificador semântico, um segundo modelo, julga cada afirmação restante e precisa citar a evidência; uma citação que não está na evidência é rejeitada, e, se o próprio verificador falha, a resposta é aceita com um aviso. Uma resposta rejeitada ganha uma tentativa automática de correção que lista as regras violadas. Um harness de avaliação ao vivo roda o modelo real em casos fixos e em casos escritos depois, e informa quantas respostas passam. |
| Resultados | On the cases that guided the fixes, answers valid on the first attempt went from 0 of 15 to 12 of 15 over four runs, and 14 of 15 after the correction attempt; that last figure is optimistic, because the fixes were made on those same cases. On a second round written afterwards, 43 of 48 answers were valid on the first attempt and 48 of 48 after the correction (22 of 24 and 24 of 24 on those cases alone). An embedded instruction to give every attribute 99 did not change the scores. Calibrating the verifier on 30 statements labelled by the author, over three repetitions it rejected 41 of 45 unsupported statements and accepted 42 of 45 supported ones. | Nos casos que guiaram os ajustes, as respostas válidas na primeira tentativa passaram de 0 de 15 para 12 de 15 ao longo de quatro rodadas, e 14 de 15 após a tentativa de correção; esse último número é otimista, porque os ajustes foram feitos nesses mesmos casos. Numa segunda rodada escrita depois, 43 de 48 respostas foram válidas na primeira tentativa e 48 de 48 após a correção (22 de 24 e 24 de 24 só nesses casos). Uma instrução embutida para dar 99 a todos os atributos não alterou as notas. Na calibração do verificador com 30 afirmações rotuladas pelo autor, em três repetições ele rejeitou 41 de 45 afirmações sem suporte e aceitou 42 de 45 com suporte. |
| Limitações | The rules are lexical, check number words only up to fifty and cannot prove that every sentence is correct. The judge is itself a model: it consistently accepted one false claim of missing data. The labels were set by the author alone, and 30 statements and 15 answers per run are small samples that describe this setup, not a general error rate. The model is not fully deterministic: one score varied by ten points between runs at temperature 0. None of this replaces human review. | As regras são lexicais, checam números por extenso só até cinquenta e não provam que cada frase está correta. O juiz também é um modelo: ele aceitou, em todas as repetições, uma afirmação falsa de dado ausente. Os rótulos foram definidos só pelo autor, e 30 afirmações e 15 respostas por rodada são amostras pequenas que descrevem este arranjo, não uma taxa de erro geral. O modelo não é totalmente determinístico: uma nota variou dez pontos entre rodadas com temperatura 0. Nada disso substitui a revisão humana. |
| Aprendizados | Measure with cases written after the fixes, or the numbers flatter the work. A verifier should not be trusted blindly: requiring a quote made it checkable. The check costs an extra request per answer, the price of fewer unsupported statements. | Meça com casos escritos depois dos ajustes, ou os números elogiam o trabalho. Um verificador não deve ser aceito às cegas: exigir uma citação o tornou checável. A checagem custa uma requisição extra por resposta, o preço de menos afirmações sem suporte. |

**Experimento 3: Median of three samples for stable scores / Mediana de três amostras para notas estáveis**

| Campo | en | pt-BR |
|---|---|---|
| Resumo | Testing whether answering with the median of three samples makes a model's scores stable. | Testar se responder com a mediana de três amostras torna estáveis as notas de um modelo. |
| Objetivo | Find out whether any mode makes the scores for the same input reliable from one run to the next. | Descobrir se algum modo torna confiáveis, de uma execução para outra, as notas para a mesma entrada. |
| Problema | The same input can produce different scores from the same model, even at temperature 0, which undermines a score that people might act on. | A mesma entrada pode gerar notas diferentes do mesmo modelo, mesmo com temperatura 0, o que enfraquece uma nota na qual alguém poderia se basear. |
| Abordagem | Each of six athlete cases was answered eight times per mode (temperature 0 with and without a seed, and the median of three samples at two temperatures), and the score vectors were compared. Only the deterministic validation was applied. The experiment ran twice, with 48 answers per mode and run. | Cada um de seis casos de atleta foi respondido oito vezes por modo (temperatura 0 com e sem semente, e a mediana de três amostras em duas temperaturas), e os vetores de notas foram comparados. Só a validação determinística foi aplicada. O experimento rodou duas vezes, com 48 respostas por modo e rodada. |
| Resultados | No mode made the scores reliably stable: the case that varied changed between runs, and the same mode went from a largest spread of 1 point to 8 between two executions. The seed did not help consistently. The median vote was the only mode in which every answer was valid, because it discards invalid samples. | Nenhum modo estabilizou as notas de forma confiável: o caso que variou mudou entre as rodadas, e o mesmo modo foi de uma variação máxima de 1 ponto para 8 entre duas execuções. A semente não ajudou de modo consistente. A votação pela mediana foi o único modo em que todas as respostas foram válidas, porque descarta as amostras inválidas. |
| Limitações | Six cases and two runs are a small sample. The variation comes from the model, so tuning these settings cannot remove it. The median costs three times the generation. Computing the scores in code from the cited indicators would remove the variation, but it would turn qualitative judgments into a formula, so it was not done. | Seis casos e duas rodadas são uma amostra pequena. A variação vem do modelo, então ajustar essas configurações não a elimina. A mediana custa três vezes a geração. Calcular as notas em código a partir dos indicadores citados eliminaria a variação, mas transformaria juízos qualitativos em uma fórmula, então isso não foi feito. |
| Aprendizados | A negative result is still a result: it settled the decision to keep the consensus available but off by default. Consistency is something to measure, not to assume. | Um resultado negativo também é resultado: ele fechou a decisão de manter o consenso disponível, mas desligado por padrão. Consistência é algo a medir, não a presumir. |

**Experimento 4: Analyst personas built with prompts / Personas de analista construídas com prompts**

| Campo | en | pt-BR |
|---|---|---|
| Resumo | Designing analyst personas with prompts, conversation history and simple input and output checks. | Desenhar personas de analista com prompts, histórico de conversa e checagens simples de entrada e saída. |
| Objetivo | Explore how far prompts alone can shape an assistant for football analysis. | Explorar até onde só os prompts conseguem moldar um assistente para análise de futebol. |
| Problema | The same model should behave differently when it assesses a player's performance, a transfer proposal or a tactical reading, and each task needs its own rules about what counts as evidence. | O mesmo modelo deve se comportar de forma diferente ao avaliar o desempenho de um jogador, uma proposta de transferência ou uma leitura tática, e cada tarefa precisa das suas regras sobre o que conta como evidência. |
| Abordagem | A terminal chatbot in TypeScript sends messages to the OpenAI API and streams the answer. Three personas carry their own instructions: sports analysis, transfer-proposal analysis and tactical analysis. The conversation is stored in SQLite, with utilities to limit or summarize the history, and simple checks screen input and output. | Um chatbot de terminal em TypeScript envia mensagens para a API da OpenAI e transmite a resposta. Três personas têm instruções próprias: análise esportiva, análise de proposta de transferência e análise tática. A conversa fica no SQLite, com utilitários para limitar ou resumir o histórico, e checagens simples filtram a entrada e a saída. |
| Resultados | No formal evaluation was done in this experiment: the checks are textual heuristics and the repository has no test suite. The same personas are part of Football Stat Analytics, where validation and measurement were built. | Este experimento não teve avaliação formal: as checagens são heurísticas textuais e o repositório não tem suíte de testes. As mesmas personas fazem parte do Football Stat Analytics, onde a validação e a medição foram construídas. |
| Limitações | The checks do not guarantee that an answer is correct or safe. The repository has no install or run instructions yet, so the experiment cannot be reproduced from it, and it is separate from the future FintaLab product. | As checagens não garantem que uma resposta esteja correta ou segura. O repositório ainda não tem instruções de instalação ou execução, então o experimento não pode ser reproduzido a partir dele, e é separado do futuro produto FintaLab. |
| Aprendizados | Without tests or measurements there is no way to tell whether a persona follows its instructions, which is the gap the validation and evaluation experiments address. | Sem testes ou medições, não há como saber se uma persona segue as suas instruções, que é a lacuna que os experimentos de validação e avaliação tratam. |

**Card "Em planejamento": Analytics Personas**

| Campo | en | pt-BR |
|---|---|---|
| Resumo | A platform to create and run experts: AI agents specialized in the functions of a football club, fed by connected data sources, with answers traceable to them. The technical foundation exists; product features do not. | Uma plataforma para criar e operar especialistas: agentes de IA especializados nas funções de um clube de futebol, alimentados por fontes de dados conectadas, com respostas rastreáveis até elas. A fundação técnica existe; as funcionalidades de produto, não. |

### 7.4. SEO (rascunho para aprovação)

| Página | en | pt-BR |
|---|---|---|
| Lista, título | AI Lab \| Bruno Lucildo | AI Lab \| Bruno Lucildo |
| Lista, descrição | Experiments in applied AI: retrieval-augmented answers, output validation with a judge model, consistency tests and prompt design, with results and limitations. | Experimentos de IA aplicada: respostas com recuperação de informação, validação de saída com um modelo juiz, testes de consistência e desenho de prompts, com resultados e limitações. |
| Detalhe, título | `<Nome do experimento> \| AI Lab \| Bruno Lucildo` | `<Nome do experimento> \| AI Lab \| Bruno Lucildo` |
| Detalhe, descrição | O resumo de uma frase do experimento (seção 7.3), com no máximo 160 caracteres. | O mesmo, em português. |

### 7.5. Rotas e fontes

| Rota (`en`) | Rota (`pt-BR`) |
|---|---|
| `/en/ai-lab` | `/pt-BR/ai-lab` |
| `/en/ai-lab/<slug>` | `/pt-BR/ai-lab/<slug>` |

As rotas são iguais nos dois idiomas (hoje `/ai-lab` já é igual em `routing.ts`), porque "AI Lab" é um nome próprio; só `/ai-lab/[slug]` precisa entrar em `pathnames`.

| Experimento | Fonte pública |
|---|---|
| 1 e 2 | README do `football-stat-analytics-cli` (seções Technical behavior, Live evaluation, Held-out cases, Semantic verifier calibration) |
| 3 | README do `football-stat-analytics-cli` (seção Consistency experiment) |
| 4 | README do `fintalab` (chatbot experimental) e lista de personas do Football |
| Card | README do `analytics-personas` |

### 7.6. Material adicional dos módulos da pós (a decidir; fora da v1 até a resposta)

Em 2026-11-08 o Bruno indicou os documentos que montou nas pastas `Pos/Modulo 1`, `2` e `3`. Foram lidos só leitura: `M3D4` (PDF e notebook de fine-tuning), `Benchmark Resumido de Modelos`, `Matriz Comparativa de Abordagens` e `M2D4 Framework de Testes`. **Não** foram lidos: os demais exercícios (M1D1 a M1D4, M2D1 a M2D3, M3D1), o capstone do Módulo 1, as versões da documentação do Módulo 3 e `Metodologia - SV.pdf`. Os relatórios de atletas, os bancos `.db` e o `.env.local` da pasta do Módulo 3 não foram abertos e não entram no site.

| Candidato | Fonte | Cobre do escopo | Achado | Pergunta |
|---|---|---|---|---|
| Fine-tuning com LoRA de um classificador de avaliações (Qwen2.5-1.5B-Instruct) | M3D4: PDF, notebook e adaptador | Fine-tuning; avaliação de modelos | **O notebook avalia no arquivo inteiro de dados (`test_df = df`, 75 exemplos), o mesmo usado no treino (`train_dataset` vem do mesmo arquivo, sem separação).** O PDF diz que houve divisão estratificada com semente 42 e 20% para teste, mas o notebook salvo não tem essa divisão. Os números do PDF (55 para 63 acertos de 75; saídas inválidas 13 para 1; acertos da classe negativa 14 para 22 de 25; neutras classificadas como positivas 5 para 9) são, portanto, resultados **sobre os dados de treino**, não de generalização. O próprio PDF já pede para confirmar essa separação. | Q6 |
| Framework de testes de prompt (10 casos, 3 execuções, prompt V1 para V2) | M2D4 | Engenharia de prompts; avaliação | O método é sólido e reaproveitável. Mas a tabela de execuções é descrita como "cenário de teste controlado, utilizado para demonstrar a identificação de inconsistências", e não se sabe se as 30 execuções foram reais. | Q7 |
| Escolha de abordagem (regras, ML, LLM, híbrida) e de modelo | Matriz Comparativa e Benchmark Resumido (M1) | Avaliação de modelos | São notas de 1 a 5 e níveis qualitativos, sem método de medição descrito. Publicar um ranking de modelos pareceria resultado comprovado e contraria a seção 3.2. | Q8 |

Se o Bruno aprovar algum candidato, ele entra por nova versão desta SPEC (slug, tipo, estado, textos en e pt-BR e ressalvas), e os números do fine-tuning seriam convertidos em contagens "X de Y", nunca em percentuais (AIL-RF-07).

## 8. Critérios de aceitação

| ID | Critério (Given / When / Then) |
|---|---|
| AIL-CA-01 | **Given** a rota `/en/ai-lab`, **when** ela é aberta, **then** há um `h1`, uma abertura e cinco cards (quatro com link, um "Em planejamento" sem link), e a página não tem `noindex`. Idem em `/pt-BR/ai-lab`. |
| AIL-CA-02 | **Given** cada card da lista, **when** ele é lido, **then** mostra tipo e estado em texto do vocabulário da seção 7.2, e o modelo e as tecnologias apenas quando existem. |
| AIL-CA-03 | **Given** um card com link, **when** o usuário o aciona (mouse ou teclado), **then** abre `/ai-lab/<slug>` no mesmo idioma. |
| AIL-CA-04 | **Given** `/en/ai-lab/rag-grounding`, **when** ela é aberta, **then** há um `h1`, a linha de fatos e seis `h2` na ordem Objective, Problem investigated, Approach, Results, Limitations e What I learned. Idem para os outros três slugs e nos dois idiomas. |
| AIL-CA-05 | **Given** `/en/ai-lab/slug-inexistente`, **when** ela é aberta, **then** a resposta é 404. |
| AIL-CA-06 | **Given** qualquer página do AI Lab, **when** o texto visível é lido, **then** não contém `%`, o nome da empresa, o curso, a instituição, nome de atleta, "Open to Work", "Available for Opportunities" nem "Hire Me". |
| AIL-CA-07 | **Given** as páginas de detalhe, **when** os resultados são lidos, **then** todo número é uma contagem "X de Y" e cada experimento com números traz a ressalva de amostra do rascunho. |
| AIL-CA-08 | **Given** `aiLab.ts`, `technologies.ts` e `projects.ts`, **when** o teste de consistência roda, **then** toda tecnologia de um experimento existe em Technologies com o mesmo nome, e os projetos de origem existem em Projects. |
| AIL-CA-09 | **Given** o Language Switcher em `/en/ai-lab/score-consistency`, **when** o idioma muda para pt-BR, **then** a URL é `/pt-BR/ai-lab/score-consistency`. |
| AIL-CA-10 | **Given** as larguras 360, 390, 768, 1366, 1440 e 1920 px, **when** a lista e cada detalhe são abertos nos dois idiomas, **then** não há rolagem horizontal. |
| AIL-CA-11 | **Given** a navegação só por teclado, **when** o usuário percorre a lista, **then** cada card é um único alvo com nome acessível e foco visível. |
| AIL-CA-12 | **Given** qualquer página do AI Lab, **when** os metadados são lidos, **then** há título, descrição, canonical, `hreflang` e Open Graph únicos por idioma, e as rotas estão no sitemap. |
| AIL-CA-13 | **Given** o repositório, **when** `pnpm typecheck`, `pnpm check` e `pnpm test:e2e` rodam, **then** os três passam, e `e2e/ai-lab.spec.ts` cobre os critérios acima. |

## 9. Dependências

- `.specs/004-projects.md` e `src/config/projects.ts` (projeto de origem e links).
- `.specs/005-technologies.md` e `src/config/technologies.ts` (AIL-RF-11).
- Rotas localizadas em `src/i18n/routing.ts` (novo `pathname` para `/ai-lab/[slug]`) e metadados em `src/lib/seo/metadata.ts` (tirar o placeholder de `/ai-lab`).
- `PagePlaceholder` deixa de atender `aiLab` (continua para Contact).
- `e2e/support/content-rules.ts` (regras de conteúdo proibido) e `playwright.config.ts`.
- README públicos dos três repositórios, como fonte (seção 7.5).

## 10. Riscos

| Risco | Impacto | Mitigação |
|---|---|---|
| Os README mudarem depois da publicação e os números do site ficarem desatualizados. | Informação divergente do repositório | Registrar a data da fonte na seção 15 e tratar mudança de número como pedido novo ao Bruno. |
| Números parecerem resultado de produto ou taxa geral de acerto. | Alegação não comprovada | Contagem "X de Y", ressalva de amostra em cada experimento e nenhum percentual (AIL-RF-07). |
| Repetir o conteúdo de Projects. | Redundância e ruído | O AI Lab traz hipótese, método, resultado e limitação; arquitetura e decisões ficam em Projects, com link. |
| Aprendizados serem lidos como fato documentado. | Texto meu apresentado como dele | Todos os aprendizados são provisórios até a aprovação (Q1); vêm de limitações e decisões já documentadas. |
| Dados dos relatórios (nomes de atletas) vazarem para o site. | Privacidade | AIL-RF-12 e AIL-CA-06 proíbem nomes; os textos não citam nenhum. |
| Estados "Concluído" não corresponderem à leitura do Bruno. | Estado errado em público | Q2, reversível em `aiLab.ts`. |
| Publicar métricas de fine-tuning medidas nos dados de treino como se fossem de teste. | Alegação não comprovada e perda de credibilidade técnica | Candidato fora da v1 até a Q6; se entrar, o texto declara a limitação de avaliação. |

## 11. Perguntas abertas

| ID | Pergunta | Bloqueia? | Default adotado se não houver resposta |
|---|---|---|---|
| Q1 | Os textos, os números e as ressalvas da seção 7.3 estão corretos e podem ser publicados (incluindo a seção "O que aprendi", que é síntese minha)? | Resolvida em 2026-11-08: aprovados pelo Bruno | Nenhum: implementação só depois da aprovação. |
| Q2 | Tipo e estado da seção 7.1 estão certos? Em especial: "Concluído" para o experimento de consistência e para as personas, e "Em desenvolvimento" para RAG e validação (como o Football em Projects). | Não | Os da tabela. **Resolvida em 2026-11-08: default aceito pelo Bruno.** |
| Q3 | O card do Analytics Personas, sem modelo e sem tecnologias, e a frase da seção 7.3 estão bons? Quer outro nome público? | Não | O da tabela. **Resolvida em 2026-11-08: default aceito pelo Bruno.** |
| Q4 | O elemento gráfico do AI Lab fica estático na v1 (premissa) ou já quer um movimento sutil por camadas? | Não | Estático. **Resolvida em 2026-11-08: default aceito pelo Bruno.** |
| Q5 | A ordem da lista da seção 7.1 serve, ou prefere o Football primeiro por ser o mais conhecido? | Não | A da tabela. **Resolvida em 2026-11-08: default aceito pelo Bruno.** |
| Q6 | Fine-tuning (seção 7.6): publicar como estudo com enquadramento honesto (resultados medidos nos próprios dados de treino, e a falha de avaliação como aprendizado), refazer no Colab com separação treino/teste real e publicar os números válidos, ou deixar fora da v1? O PDF também precisa ser corrigido, se for entregue de novo. | Não (os outros quatro não dependem) | Fora da v1. **Decidido em 2026-11-08 (Bruno): publicar com enquadramento honesto**, dizendo que os números vêm dos dados de treino e que a falha de avaliação foi o aprendizado. Exige nova rodada de textos (v0.4.0). |
| Q7 | As 30 execuções do framework de testes (M2D4) foram reais ou ilustrativas? Se ilustrativas, publico só o método. | Não | Só o método, sem resultados, se o candidato entrar. **Decidido em 2026-11-08 (Bruno): as 30 execuções foram ilustrativas; entra só o método, sem resultados numéricos.** |
| Q8 | A escolha de abordagem e de modelo do Módulo 1 entra em algum formato? | Não | Fora da v1. **Decidido em 2026-11-08 (Bruno): entra como estudo**, com texto novo para aprovação (v0.4.0). |

## 12. Premissas

1. Os quatro experimentos com detalhe e o card de planejamento são o conteúdo da v1; novos experimentos entram por nova SPEC ou ajuste em `aiLab.ts`.
2. Os números e as frases vêm dos README públicos conferidos em 2026-11-08; resultados do README de 2026-11-05 não foram refeitos.
3. Os experimentos 1 a 3 pertencem ao Football Stat Analytics (projeto acadêmico em desenvolvimento, sem citar a instituição); o experimento 4 pertence ao repositório do FintaLab.
4. As personas do FintaLab e do Football são as mesmas (mesmos nomes e arquivo de histórico nos dois README); por isso o texto diz que "fazem parte do Football Stat Analytics".
5. A rota `/ai-lab` não é localizada (igual em en e pt-BR).
6. O modelo exibido é `gpt-4o-mini` para os três experimentos que o documentam; nenhum outro modelo é citado.
7. O Analytics Personas não ganha tecnologias nem detalhe porque o repositório é só fundação técnica.

## 13. Decisões registradas

| Data | Decisão | Quem |
|---|---|---|
| 2026-11-08 | Entram na v1: RAG com fundamentação, validação de saída com modelo juiz (incluindo o harness de avaliação), consenso por mediana (resultado negativo) e as personas de prompt do FintaLab. | Bruno |
| 2026-11-08 | Estrutura: lista em `/ai-lab` e página de detalhe por experimento (`/ai-lab/[slug]`), como em Projects. | Bruno |
| 2026-11-08 | Números de avaliação publicados como contagens, com ressalvas; sem percentuais. | Bruno |
| 2026-11-08 | Analytics Personas entra como card "Em planejamento", sem página de detalhe. | Bruno |
| 2026-11-08 | Textos, números e ressalvas da seção 7.3 aprovados e implementação autorizada (Q1). Q2 a Q5 seguem como premissas reversíveis (tipo e estado em `aiLab.ts`, gráfico estático, ordem da tabela). | Bruno |

## Refinamento

- 2026-11-08, v0.3.0: textos aprovados (Q1) e página implementada; seção 15 registra a entrega, as divergências e a verificação.
- 2026-11-08, v0.1.0: SPEC criada a partir do ponteiro de `FEATURES.md` (Draft v0.1), do `BUSINESS.md` (7), do `CONTENT.md` (4.6), do `DESIGN.md` (6.6) e do `DESIGN_SYSTEM.md` (4.9). Conteúdo levantado nos README públicos de `football-stat-analytics-cli`, `fintalab` e `analytics-personas`. Quatro decisões do Bruno registradas na seção 13. Textos, estados e premissas aguardam a aprovação (Q1 a Q5).
- 2026-11-08, v0.2.0: o Bruno apontou os documentos das pastas Módulo 1, 2 e 3. Levantados três candidatos (seção 7.6), nenhum incluído na v1. Achado relevante: o notebook de fine-tuning avalia no mesmo arquivo usado no treino, o que contradiz o PDF (Q6). Perguntas Q6 a Q8 abertas, não bloqueantes.

## 15. Implementação e verificação

Implementada na branch `feat/ai-lab` em 2026-11-08, depois da aprovação dos textos (Q1).

- Novos: `src/config/aiLab.ts` (fonte única: slug, tipo, estado, modelo, tecnologias e projeto de origem), `src/components/ai-lab/` (`AiLabContent`, `ExperimentCard`, `ExperimentDetail`, `ExperimentMeta`, `AiLabGraphic`), `src/app/[locale]/ai-lab/[slug]/page.tsx` e `e2e/ai-lab.spec.ts`.
- Alterados: `src/app/[locale]/ai-lab/page.tsx` (deixa de ser provisória e `noindex`), `src/i18n/routing.ts` (`/ai-lab/[slug]`), `src/lib/seo/metadata.ts` (namespaces `aiLab.metadata` e `aiLab.experiments.<chave>`; o texto provisório só serve a Contact), `src/components/layout/LanguageSwitcher.tsx` (o slug também vale em `/ai-lab/[slug]`), `src/components/sections/PagePlaceholder.tsx`, `src/content/{en,pt-BR}/common.json` (novo bloco `aiLab`; removido `pages.aiLab`), `README.md` e `.docs/CONTENT.md` (estado do AI Lab).

Decisões de implementação:

- Título e descrição do detalhe saem do nome e do resumo do experimento, sem campo extra de metadados: título `<Nome> | AI Lab | Bruno Lucildo` e descrição igual ao resumo (todos com até 160 caracteres, conferido por teste).
- O card é um único link (o nome, com `after:absolute after:inset-0`), com foco desenhado no card inteiro. Modelo e tecnologias ficam no rodapé do card, para alinhar cards vizinhos de títulos com tamanhos diferentes (conferido medindo as posições no navegador).
- Reaproveita `ProjectTechnologies` e `layout.ts` de Projects, como Technologies já faz.
- O gráfico é um SVG estático, decorativo e visível só a partir de 1024 px (premissa Q4).

Divergências em relação à SPEC:

- **AIL-RF-13 (sitemap):** o projeto ainda não tem sitemap para nenhuma página; o que depende desta SPEC (metadados, canonical, `hreflang`, Open Graph, sem `noindex`) foi entregue. O sitemap fica para a etapa de SEO.
- **AIL-RF-16 (Should), não entregue:** navegação para o experimento anterior e o seguinte. Com quatro experimentos, o link "Todos os experimentos" no topo basta.
- **Seção 6.1, Resultados:** saem como parágrafo (o texto aprovado), e não como lista com as contagens em destaque tipográfico. O parágrafo de Resultados da validação é denso; dividi-lo por assunto, sem mudar palavras, é uma sugestão para a revisão.
- **AIL-RF-10:** "Parte de" leva à página de detalhe do Football Stat Analytics e, no caso do FintaLab (sem detalhe), à lista de Projects.

| Critério | Resultado | Evidência |
|---|---|---|
| AIL-CA-01 | Atendido | `h1`, abertura e cinco cards (quatro com um único link, um "Em planejamento" sem link), sem `noindex`, nos dois idiomas. |
| AIL-CA-02 | Atendido | Tipo, estado, resumo, modelo e tecnologias conferidos card a card; o card em planejamento não tem modelo, lista nem link. |
| AIL-CA-03 | Atendido | Cada link aponta para `/ai-lab/<slug>` no mesmo idioma. |
| AIL-CA-04 | Atendido | `h1` e seis `h2` na ordem Objective, Problem investigated, Approach, Results, Limitations e What I learned (e equivalentes em pt-BR), para os quatro slugs. |
| AIL-CA-05 | Atendido | Slug inexistente e `analytics-personas` respondem 404, nos dois idiomas. |
| AIL-CA-06 | Atendido | Sem `%`, empresa, curso, instituição, nomes de atletas, expressões proibidas nem frases de busca de emprego, na lista e nos quatro detalhes. |
| AIL-CA-07 | Atendido | Contagens "X de Y" e as ressalvas de amostra presentes (conferidas por trecho em cada experimento). |
| AIL-CA-08 | Atendido | Teste compara `aiLab.ts` com `technologies.ts` e `projects.ts`: toda tecnologia existe em Technologies e a origem existe em Projects. |
| AIL-CA-09 | Atendido | A troca de idioma em cada detalhe abre o mesmo experimento no outro idioma. |
| AIL-CA-10 | Atendido | Sem rolagem horizontal em 360, 390, 768, 1366, 1440 e 1920 px, lista e detalhes, nos dois idiomas. |
| AIL-CA-11 | Atendido | A tabulação passa uma vez por card, na ordem visual; links com alvo de pelo menos 44 px. |
| AIL-CA-12 | Parcial | Título, descrição, canonical, `hreflang` e Open Graph por idioma conferidos; sem sitemap (ver divergências). |
| AIL-CA-13 | Atendido com ressalva | `pnpm typecheck` sem erros; `pnpm test:e2e` com 400 testes passando (162 novos). `pnpm check` passa nos arquivos novos e alterados; na árvore inteira falha em 38 arquivos que não foram tocados, por causa do CRLF do checkout no Windows (problema já conhecido, o Git guarda LF). |

Verificação adicional:

- Mutação: três defeitos introduzidos de propósito (número de resultado trocado, gráfico visível abaixo de 1024 px e alvo de toque reduzido) derrubaram quatro testes; os arquivos foram restaurados e a suíte voltou a passar.
- Navegador: lista e detalhe conferidos em 1440 px (en) e em 375 px (pt-BR). A pasta `.next` precisou ser apagada uma vez por causa de um `EPERM` do build.

Não verificado: o contraste não foi medido com ferramenta (usa os mesmos tokens do restante do site), e LCP e CLS não foram medidos.
