# SPEC-009 — Resume

## 1. Identificação

| Campo | Valor |
|---|---|
| Nome | Resume |
| Identificador | SPEC-009 |
| Slug | `009-resume` |
| Versão | 0.4.0 |
| Status | Done em 2026-11-08, por decisão do Bruno; os itens não verificados seguem para o QA final (antes: In Review, implementada e com o PDF ajustado entregue em 2026-11-08; aguardando a revisão do usuário e do PR) |
| Data | 2026-11-08 |
| Origem | SPEC-009 de `.specs/FEATURES.md` (v0.1, Draft) |

Prioridades usadas: **Must** (obrigatório para a v1), **Should** (desejável; pode ser adiada sem bloquear a entrega).

## 2. Contexto

Hoje o currículo existe só como um PDF em inglês (`public/documents/resume/bruno-lucildo-resume-en.pdf`) e dois links que abrem o arquivo direto em nova aba: o botão secundário do header (desktop e menu mobile) e a seção Resume da página Contact. Não há página própria, o PDF não tem título nem autor corretos nos metadados (autor "User", sem título) e o arquivo pode ser indexado por buscadores, com telefone e e-mail dentro.

**Objetivo:** dar ao currículo um lugar próprio no site, como recurso secundário e complementar (`BUSINESS.md`, 6.1 e 12.1; `CONTENT.md`, 4.8; `DESIGN_SYSTEM.md`, 4.2): uma página `/resume` que explica o que é o documento e oferece abrir ou baixar o PDF, mais um arquivo consistente com o restante do site, sem virar cópia do currículo nem da página Experience.

**Posicionamento:** a página não usa "Open to Work", "Available for Opportunities", "Hire Me" nem mensagens de disponibilidade. O PDF, por ser um documento, mantém as frases de busca de emprego (decisão do Bruno, seção 13).

## 3. Escopo

### 3.1. Dentro do escopo

1. Página em `/resume` (pt-BR: `/curriculo`) com abertura breve, ações para abrir e baixar o PDF, dados do arquivo, lista do que o documento traz e links para Experience e Contact.
2. Rota localizada em `routing.ts`, fora de `mainNavigation` (o currículo não vira item da navegação principal nem do rodapé).
3. Botão "Resume" do header (desktop e menu mobile) passa a levar à página, na mesma aba, sem "(EN)", com `aria-current="page"` quando ela está aberta.
4. Cabeçalho `X-Robots-Tag: noindex` só para os arquivos de `/documents/resume/`.
5. Ajuste do PDF pelo Bruno: rótulo da formação alinhado ao site e metadados (título e autor). O arquivo novo substitui o atual com o mesmo nome.
6. Mapa de consistência entre o PDF e o site (seção 7.5) e um procedimento para manter o documento atualizado.
7. Textos em inglês e português, metadados indexáveis da página e `e2e/resume.spec.ts`; atualização dos testes e das specs que descrevem o botão do menu.

### 3.2. Fora do escopo

- Versão do currículo em português: o PDF segue só em inglês (decisão do Bruno, 2026-11-08). O código já aceita um PDF por idioma em `siteConfig.resume`; incluir o arquivo depois não exige mudança de código.
- Pré-visualização do PDF embutida na página (`<iframe>`/`<object>`): descartada (decisão do Bruno).
- Reproduzir cargos, datas, métricas ou tecnologias do currículo na página: isso é a SPEC-003 e a SPEC-005.
- Incluir no PDF os itens que só estão no site (mais de 200 PRs, migração para .NET, padrões adotados por várias equipes): o PDF fica como está nesses pontos (decisão do Bruno).
- Alterar a seção Resume da página Contact: continua com o link direto para o PDF e a regra "(EN)" (premissa, Q3).
- Item no menu principal ou no rodapé; `sitemap` e analytics de aberturas e downloads (hospedagem e analytics seguem sem decisão; `BUSINESS.md` e `ARCHITECTURE.md` citam a métrica).
- Geração do PDF a partir do site, ou editar o conteúdo do PDF por código: o documento é produzido pelo Bruno no Word.

## 4. Requisitos funcionais

| ID | Prioridade | Requisito |
|---|---|---|
| RES-RF-01 | Must | A rota `/en/resume` (pt-BR: `/pt-BR/curriculo`) tem um `h1`, um parágrafo de abertura, um bloco de ações e dados do arquivo, uma seção "O que o documento traz" (`h2`) e uma linha de links para Experience e Contact. Ela entra em `routing.pathnames`, e não em `mainNavigation`. |
| RES-RF-02 | Must | O bloco de ações tem "View Resume", que abre o PDF do idioma em nova aba (`target="_blank"`, `rel="noopener noreferrer"`, aviso "(opens in a new tab)" ao leitor de tela), e "Download PDF", que baixa o mesmo arquivo (`download` com o nome do arquivo). Os dois usam `getResumeHref(locale)` e `hreflang` com o idioma do arquivo. |
| RES-RF-03 | Must | O bloco de dados do arquivo é uma lista de descrição (`dl`) com Formato (PDF), Idioma do arquivo (nome por extenso, no idioma da página) e Última atualização (mês e ano, vindos de `siteConfig.resume`, formatados no idioma da página). |
| RES-RF-04 | Must | Em pt-BR, enquanto não houver PDF em português (`hasLocalizedResume` falso), a página mostra o aviso "O currículo está disponível apenas em inglês." perto das ações. Em en, e quando houver PDF no idioma, o aviso não aparece. Não há "(EN)" nos rótulos dos botões da página. |
| RES-RF-05 | Must | A seção "O que o documento traz" lista Resumo, Experiência profissional, Formação, Habilidades e Idiomas, cada um com uma frase genérica sobre o tipo de informação. Nenhum cargo, data, empresa, métrica, curso ou tecnologia do currículo é repetido. |
| RES-RF-06 | Must | A página tem links internos para Experience e Contact, com os rótulos do rascunho da seção 7.2, na mesma aba. |
| RES-RF-07 | Must | O botão "Resume" do header (desktop e menu mobile) é um link interno para `/resume`, na mesma aba, com o rótulo "Resume" (pt-BR: "Currículo"), sem `target`, sem `lang` e sem "(EN)". Mantém o estilo secundário e, na página `/resume`, recebe `aria-current="page"`. No menu mobile, ao navegar, o menu fecha. |
| RES-RF-08 | Must | A página Contact não muda: a seção Resume continua com o link direto para o PDF e a regra de idioma da SPEC-007 (CON-RF-06). |
| RES-RF-09 | Must | O PDF do currículo é servido com `X-Robots-Tag: noindex` (cabeçalho só para `/documents/resume/:path*`); o `Content-Type` continua `application/pdf` e o arquivo abre no navegador. A página `/resume` é indexável. |
| RES-RF-10 | Must | A página tem metadados indexáveis em cada idioma (título, descrição, canonical, `hreflang`, Open Graph), sem `noindex`, com o `hreflang` apontando `/en/resume` ↔ `/pt-BR/curriculo`. |
| RES-RF-11 | Must | O texto visível da página não contém telefone, cidade, nome da empresa, curso, instituição, percentuais, nem as expressões proibidas e as frases de busca de emprego de `e2e/support/content-rules.ts`. |
| RES-RF-12 | Must | O PDF publicado tem o autor "Bruno Lucildo" nos metadados e o rótulo da formação alinhado ao do site. O título do arquivo, previsto na v0.3.0 ("Bruno Lucildo — Resume"), ficou sem preenchimento: o Bruno aceitou em 2026-11-08 e pode incluí-lo numa troca futura do PDF. |
| RES-RF-13 | Must | Datas, cargos, tamanho da equipe, anos de experiência e formação do PDF coincidem com o site, exceto onde a seção 7.5 registra uma exceção aprovada. A conferência é feita por leitura a cada troca do PDF. |
| RES-RF-14 | Must | Ao trocar o PDF, `siteConfig.resume` tem a data da atualização (`updatedAt`, formato `AAAA-MM`) revisada no mesmo commit. O procedimento está na seção 7.6. |
| RES-RF-15 | Should | A página mostra também o Tamanho do arquivo (em KB ou MB, lido do arquivo em tempo de build), para quem baixa em conexão móvel. |
| RES-RF-16 | Must | O que deixa de ter uso é removido: `navigation.resumeFallback` dos dois `common.json` e as props `resumeHref` e `resumeLocalized` de `Header` e `HeaderNav`. `getResumeHref` e `hasLocalizedResume` continuam, porque Contact e a página os usam. |

## 5. Requisitos não funcionais

| ID | Categoria | Requisito |
|---|---|---|
| RES-RNF-01 | Acessibilidade | Um único `h1`, `h2` sem pular níveis, `dl` semântico, nomes de link distintos ("View Resume — PDF (opens in a new tab)"), foco visível, alvos de toque de pelo menos 44 px e contraste AA. O botão de download tem nome acessível que informa o formato. |
| RES-RNF-02 | Responsividade | Sem rolagem horizontal em 360, 390, 768, 1366, 1440 e 1920 px, nos dois idiomas. Os dois botões quebram de linha quando faltar espaço. Texto corrido com no máximo 80 caracteres por linha. |
| RES-RNF-03 | Desempenho | Sem dependência nova, sem JavaScript de cliente na página e sem imagem. O tamanho do arquivo (RES-RF-15) é lido no servidor, em tempo de build; se a leitura falhar, a linha Tamanho some e a página continua válida. |
| RES-RNF-04 | Consistência visual | Dark Premium, composição editorial como Contact e Technologies (título na coluna estreita, conteúdo na larga, filetes entre seções), sem cards, sem neon, sem gradiente decorativo e sem elemento gráfico. "View Resume" usa o botão secundário do design system e "Download PDF" o estilo de texto; o verde-limão só aparece nos links de ação e no foco. |
| RES-RNF-05 | Privacidade | O PDF contém telefone, cidade e e-mail, públicos por decisão do Bruno. A página não os repete, e o `noindex` reduz a indexação do arquivo. Nada é enviado a terceiros e nenhum rastreador é adicionado. |
| RES-RNF-06 | SEO | A página indexável usa os textos da seção 7.3. O PDF fica fora do índice (RES-RF-09). O tamanho do PDF permanece abaixo de 1 MB. |
| RES-RNF-07 | Manutenibilidade | O arquivo, o idioma e a data ficam em `src/config/site.ts`; os textos, em `common.json`. Adicionar um PDF em pt-BR exige apenas o arquivo, a entrada em `siteConfig.resume` e a atualização dos testes de idioma. |
| RES-RNF-08 | Movimento | Nenhuma animação nova; a página não tem movimento, o que atende `prefers-reduced-motion`. |
| RES-RNF-09 | Internacionalização | Rotas e textos nos dois idiomas, `<html lang>` igual ao idioma da página, `hreflang` conforme a SPEC-008, e o nome do arquivo e o formato "PDF" na grafia original. |

## 6. Interface e experiência

### 6.1. Composição

Layout editorial, sem cards, no mesmo padrão de Contact.

| Largura | Composição |
|---|---|
| ≥1024 px | Cabeçalho com `h1` e abertura. Em seguida, duas seções separadas por filete, cada uma com o `h2` (ou o rótulo) na coluna estreita e o conteúdo na larga: ações e dados do arquivo; "O que o documento traz". Os links finais ocupam uma linha ao fim. |
| <1024 px | Coluna única, na mesma ordem; os botões quebram de linha quando faltar espaço. |

- O bloco de ações mostra "View Resume" (botão secundário) e "Download PDF" (texto), depois o aviso de idioma (pt-BR), depois a lista Formato, Idioma, Última atualização e, se houver, Tamanho.
- A lista "O que o documento traz" é uma lista simples: o termo em `foreground`, a frase em `muted`.
- Os links finais (Experience e Contact) usam o estilo de texto e não competem com o botão do PDF.
- O botão do header não ganha destaque novo: é o mesmo botão secundário, agora com `aria-current="page"` na rota `/resume`.

### 6.2. Estados

| Situação | Comportamento esperado |
|---|---|
| Página aberta em en | Sem aviso de idioma; Idioma do arquivo: "English". |
| Página aberta em pt-BR sem PDF localizado | Aviso "O currículo está disponível apenas em inglês."; Idioma do arquivo: "Inglês". |
| PDF em pt-BR adicionado à configuração | O aviso some, o link da página em pt-BR aponta para o novo arquivo e Idioma do arquivo mostra "Português". |
| Tamanho indisponível | A linha Tamanho não é exibida; o resto da página não muda. |
| Download recusado ou bloqueado pelo navegador | O link "View Resume" continua como caminho alternativo. |
| Clique no botão do header | Navega para a página na mesma aba; no menu mobile, o menu fecha. |
| Navegação por teclado | Skip link, header, botão e links da página na ordem visual, footer. Foco visível. |
| `prefers-reduced-motion` | Sem diferença: a página não tem movimento. |

Não há estado de carregamento nem de erro de dados: o conteúdo é estático.

## 7. Conteúdo e dados

### 7.1. Arquivos e rotas

| Item | Valor |
|---|---|
| PDF (en) | `/documents/resume/bruno-lucildo-resume-en.pdf` (substituído por uma versão ajustada pelo Bruno, mesmo nome) |
| PDF (pt-BR) | não existe; `getResumeHref("pt-BR")` devolve o arquivo em inglês |
| Rota (`en`) | `/en/resume` |
| Rota (`pt-BR`) | `/pt-BR/curriculo` |
| Data de atualização | `siteConfig.resume.updatedAt`; o PDF atual foi gerado em 2026-11-07, então o valor inicial é `2026-11` |

### 7.2. Textos de interface (rascunho para aprovação)

| Elemento | en | pt-BR |
|---|---|---|
| `h1` | Resume | Currículo |
| Abertura | The formal version of my professional history, in a single document. The Experience page tells the same story with more context. | A versão formal da minha trajetória profissional, em um único documento. A página Experiência conta a mesma história com mais contexto. |
| Botão principal | View Resume | Ver currículo |
| Botão de download | Download PDF | Baixar PDF |
| Aviso de nova aba (leitor de tela) | (opens in a new tab) | (abre em uma nova aba) |
| Aviso de idioma | (não se aplica em en) | O currículo está disponível apenas em inglês. |
| Rótulo, formato | Format | Formato |
| Valor, formato | PDF | PDF |
| Rótulo, idioma | File language | Idioma do arquivo |
| Valor, idioma | English | Inglês |
| Rótulo, atualização | Last updated | Última atualização |
| Valor, atualização | November 2026 | novembro de 2026 |
| Rótulo, tamanho | Size | Tamanho |
| `h2` conteúdo | What's inside | O que o documento traz |
| Item, resumo | **Summary:** a profile of my background and focus. | **Resumo:** um perfil da minha formação e do meu foco. |
| Item, experiência | **Professional experience:** roles, periods and responsibilities. | **Experiência profissional:** cargos, períodos e responsabilidades. |
| Item, formação | **Education:** degrees and postgraduate studies. | **Formação:** graduação e pós-graduação. |
| Item, habilidades | **Skills:** languages, frameworks, databases, messaging and architecture. | **Habilidades:** linguagens, frameworks, bancos de dados, mensageria e arquitetura. |
| Item, idiomas | **Languages:** spoken languages and proficiency. | **Idiomas:** idiomas falados e nível de proficiência. |
| Link, Experience | View experience | Ver experiência |
| Link, Contact | Get in Touch | Entrar em contato |

"Format" e "PDF" não são traduzidos no valor; a data usa `Intl.DateTimeFormat` do idioma da página.

### 7.3. SEO (rascunho para aprovação)

| Item | en | pt-BR |
|---|---|---|
| Título | Resume \| Bruno Lucildo | Currículo \| Bruno Lucildo |
| Descrição | View or download Bruno Lucildo's resume (PDF, in English): professional experience, education, skills and languages. | Veja ou baixe o currículo de Bruno Lucildo (PDF, em inglês): experiência profissional, formação, habilidades e idiomas. |

### 7.4. Mudança no header e no conteúdo

| Item | Antes | Depois |
|---|---|---|
| Destino do botão do header | PDF, em nova aba | `/resume`, na mesma aba |
| Rótulo do botão em pt-BR | "Currículo (EN)" com `lang="en"` | "Currículo" |
| `navigation.resumeFallback` | existe | removido |
| Aviso de arquivo em inglês | rótulo "(EN)" no botão | aviso na página `/resume` (e "(EN)" só em Contact) |

### 7.5. Consistência entre o PDF e o site (conferida em 2026-11-08)

Fonte: leitura do PDF atual, `CONTENT.md`, SPEC-002, SPEC-003 e SPEC-005, e as respostas do Bruno.

| Item | PDF | Site | Situação |
|---|---|---|---|
| Nome | "Bruno Lucildo da Silva" | "Bruno Lucildo" | Aceito: nome completo em documento formal (premissa) |
| Anos de experiência | 10+ | 10+ | Coincide |
| Equipe liderada | 5 engenheiros | 5 desenvolvedores | Coincide |
| Serviços modernizados | 5+ | "mais de cinco" (Experience) | Coincide |
| Cargos e datas | Cinco cargos, jul/2016 a atual; Senior Backend até maio/2023 | Experience, mesmas datas | Coincide |
| Redução de 80% (RabbitMQ) | Citada | Citada só em Experience; fora da Home e do About | Aceito: o PDF é documento |
| Nome da empresa | Citado | Fora do site (descrição sem nome) | Divergência conhecida e aceita (SPEC-003, seção 11 e risco da seção 10); o PDF público já cita |
| Formação | "Master's in AI Systems Development and Management" | "pós-graduação (programa Master)" | Alinhado em 2026-11-08: o PDF novo diz "Postgraduate Program (Master) in AI Systems Development and Management" |
| Mais de 200 PRs, migração para .NET, padrões em várias equipes | Não cita | Cita (Experience) | Mantido assim (decisão de 2026-11-08) |
| Frases de busca de emprego ("Seeking…", "Open to global relocation…") | Citadas | Proibidas | Exceção aprovada pelo Bruno: só no documento |
| Telefone e cidade | Citados | Fora do site | Exceção aprovada pelo Bruno; `noindex` reduz a indexação |
| Metadados do arquivo | Autor "Bruno Lucildo"; sem título | — | Autor corrigido em 2026-11-08; título ausente, aceito pelo Bruno (o arquivo foi gerado pelo Adobe PDF Services) |
| Tecnologias | Lista própria, inclui Azure Service Bus e Event-Driven Architecture | Technologies usa a lista do currículo (`resumeOnly` em `technologies.spec.ts`) | Coincide por teste |

### 7.6. Procedimento para trocar o PDF

1. O Bruno edita o documento no Word (origem: pasta `CV`), confere os itens da seção 7.5 e exporta o PDF com título e autor definidos nas propriedades do arquivo.
2. O PDF novo substitui o atual em `public/documents/resume/`, com o mesmo nome (ou o nome novo vai para `siteConfig.resume` no mesmo commit).
3. `siteConfig.resume.updatedAt` recebe o mês da atualização.
4. `pnpm test:e2e` e a conferência por leitura da seção 7.5 rodam antes do commit.

### 7.7. Texto proposto para a formação no PDF (Q2)

| Item | Atual | Proposto |
|---|---|---|
| Linha da formação | Master's in AI Systems Development and Management – Coders University (ESIC), Brazil (2026 – Present) | Postgraduate Program (Master) in AI Systems Development and Management – Coders University (ESIC), Brazil (2026 – Present) |

O rótulo segue o do site e o do LinkedIn ("Postgraduate Degree, Master's Program"). A redação final é do Bruno.

## 8. Critérios de aceitação

| ID | Critério (Given / When / Then) |
|---|---|
| RES-CA-01 | **Given** `/en/resume`, **when** aberta, **then** há um `h1`, a abertura, o bloco de ações e dados, um `h2` "What's inside", os links para Experience e Contact, sem `noindex` e sem o texto de página em construção. Idem em `/pt-BR/curriculo`. |
| RES-CA-02 | **Given** `/en/resume`, **when** "View Resume" é lido, **then** `href="/documents/resume/bruno-lucildo-resume-en.pdf"`, `target="_blank"`, `rel="noopener noreferrer"`, `hreflang="en"` e nome acessível com o aviso de nova aba; "Download PDF" tem o mesmo `href` e o atributo `download` com `bruno-lucildo-resume-en.pdf`. |
| RES-CA-03 | **Given** `/pt-BR/curriculo`, **when** lida, **then** os botões se chamam "Ver currículo" e "Baixar PDF", apontam para o PDF em inglês, têm `hreflang="en"` e não contêm "(EN)". |
| RES-CA-04 | **Given** a página em en e em pt-BR, **when** o bloco de dados é lido, **then** é um `dl` com Formato "PDF", Idioma do arquivo ("English"/"Inglês") e Última atualização no formato do idioma ("November 2026"/"novembro de 2026"). |
| RES-CA-05 | **Given** `/pt-BR/curriculo` sem PDF em português, **when** lida, **then** mostra "O currículo está disponível apenas em inglês."; **given** `/en/resume`, **then** o aviso não existe. |
| RES-CA-06 | **Given** `siteConfig.resume` com uma entrada `pt-BR` (teste com a configuração alterada), **when** a página em pt-BR é gerada, **then** o aviso não aparece, os botões apontam para o PDF em português e o idioma do arquivo é "Português". |
| RES-CA-07 | **Given** a seção "O que o documento traz", **when** lida, **then** tem as cinco entradas da seção 7.2 e nenhuma ocorrência de cargo, data, empresa, métrica, curso ou tecnologia do currículo. |
| RES-CA-08 | **Given** os links finais, **when** acionados, **then** levam a `/en/experience` e `/en/contact` (pt-BR: `/pt-BR/experiencia` e `/pt-BR/contato`) na mesma aba. |
| RES-CA-09 | **Given** o header em 1440 px e o menu mobile em 375 px, **when** o botão Resume é lido e acionado, **then** é um link interno para `/en/resume` (pt-BR: `/pt-BR/curriculo`), sem `target`, com o rótulo "Resume" (pt-BR: "Currículo"); na página, tem `aria-current="page"`; no mobile, o menu fecha ao navegar. |
| RES-CA-10 | **Given** a página Contact, **when** a seção Resume é lida, **then** o link continua apontando para o PDF, com "View Resume"/"Ver currículo (EN)" e `lang="en"` em pt-BR, como na SPEC-007. |
| RES-CA-11 | **Given** uma requisição ao PDF, **when** a resposta chega, **then** o status é 200, `Content-Type` é `application/pdf`, `X-Robots-Tag` contém `noindex`, o arquivo começa com `%PDF-` e tem menos de 1 MB; **given** a página `/resume`, **then** não há `noindex`. |
| RES-CA-12 | **Given** a página, **when** os metadados são lidos, **then** há título, descrição, canonical, `hreflang` (`en`, `pt-BR`, `x-default`, apontando as rotas localizadas) e Open Graph únicos por idioma, sem `noindex`. |
| RES-CA-13 | **Given** o texto visível da página nos dois idiomas, **when** lido, **then** não contém `%`, telefone, cidade, empresa, curso, instituição, expressões proibidas nem frases de busca de emprego. |
| RES-CA-14 | **Given** o PDF publicado, **when** os metadados são lidos, **then** o autor é "Bruno Lucildo" (e não o usuário do computador); **given** o texto do PDF, **then** a linha da formação diz "Postgraduate Program (Master) in AI Systems Development and Management". |
| RES-CA-15 | **Given** a seção 7.5, **when** conferida por leitura contra o PDF e o site, **then** cada linha está "Coincide", "Aceito" ou "Mantido", sem pendência. |
| RES-CA-16 | **Given** `siteConfig.resume.updatedAt`, **when** lido, **then** tem o formato `AAAA-MM`, não está no futuro e é igual ou posterior ao mês de geração do PDF. |
| RES-CA-17 | **Given** os links e botões da página e do header, **when** medidos, **then** têm pelo menos 44 px de altura e foco visível, e a tabulação segue a ordem visual. |
| RES-CA-18 | **Given** as larguras 360, 390, 768, 1366, 1440 e 1920 px, **when** a página é aberta nos dois idiomas, **then** não há rolagem horizontal e o texto corrido tem no máximo 80 caracteres por linha. |
| RES-CA-19 | **Given** o repositório, **when** a busca é feita, **then** `resumeFallback` e as props `resumeHref` e `resumeLocalized` do header não existem mais, e `pnpm typecheck` e `pnpm test:e2e` passam. |
| RES-CA-20 | **Given** o tamanho do PDF, **when** a página é gerada, **then** a linha Tamanho mostra o valor do arquivo (RES-RF-15, Should). |

## 9. Dependências

- `src/i18n/routing.ts` (nova entrada em `pathnames`) e `src/config/navigation.ts` (o tipo `AppPathname` já deriva de `routing.pathnames`; o item **não** entra em `mainNavigation`).
- `src/components/layout/Header.tsx` e `HeaderNav.tsx` (botão Resume), `src/config/site.ts` (`resume`, `getResumeHref`, `hasLocalizedResume`), `src/lib/seo/metadata.ts` (`buildPageMetadata`).
- `next.config.ts` (cabeçalhos do PDF).
- `src/components/contact/ContactContent.tsx`: apenas leitura; nada muda.
- Testes existentes a revisar: o teste de rótulo e `lang` do currículo em `e2e/i18n.spec.ts` (hoje exige "Currículo (EN)" no menu) e os de `e2e/contact.spec.ts` que usam o mesmo PDF.
- SPEC-008 (seção 7.4 e I18N-RF-14: a exceção "(EN) no menu e em Contact" passa a valer só em Contact e como aviso na página) e SPEC-010 (comportamento do botão do header): registrar a mudança nas duas.
- `e2e/support/content-rules.ts` (expressões proibidas e frases de busca de emprego) e `playwright.config.ts`.
- Arquivo ajustado pelo Bruno (Q2) em `public/documents/resume/`.

## 10. Riscos

| Risco | Impacto | Mitigação |
|---|---|---|
| O botão do header passar a exigir um clique a mais para chegar ao PDF. | Visitante que só quer o arquivo demora mais | A página mostra "View Resume" e "Download PDF" acima da dobra, e o PDF continua direto em Contact. A decisão é do Bruno e é reversível. |
| A página virar cópia do currículo ou da Experience. | Redundância e divergência de fatos | Escopo sem cargos, datas ou métricas (RES-RF-05, RES-CA-07). |
| O PDF e o site divergirem com o tempo. | Fato diferente em documentos públicos | Seção 7.5, procedimento da 7.6, RES-RF-13 e RES-CA-15. A conferência é manual: não há extração automática do texto do PDF (exigiria dependência nova). |
| O PDF ser servido em cache depois de trocado. | Visitante vê versão antiga | O arquivo mantém a URL; ao escolher hospedagem e CDN, revisar o cache de `/documents/`. |
| `X-Robots-Tag` não valer no ambiente de hospedagem final. | PDF indexado com telefone | RES-CA-11 testa a resposta do servidor do projeto; repetir a verificação ao definir a hospedagem. |
| Os metadados do PDF dependerem do exportador do Word. | Título ou autor voltarem ao padrão | Passo 1 da seção 7.6 e RES-CA-14 na troca do arquivo. |
| Rótulo da formação no PDF induzir a leitura de mestrado acadêmico. | Informação imprecisa em documento público | Alinhamento da seção 7.7 (Q2). |
| A página ser lida como busca de emprego. | Posicionamento errado | RES-RF-11 e RES-CA-13, com teste das expressões proibidas. |

## 11. Perguntas abertas

| ID | Pergunta | Bloqueia? | Default adotado se não houver resposta |
|---|---|---|---|
| Q1 | Os textos das seções 7.2 e 7.3 podem ser publicados? | Resolvida em 2026-11-08: aprovados pelo Bruno | Nenhum: implementação só depois da aprovação. |
| Q2 | A formação no PDF fica como na seção 7.7, e o título e o autor do arquivo são "Bruno Lucildo — Resume" e "Bruno Lucildo"? O Bruno ajusta no Word e envia o PDF novo. | Resolvida em 2026-11-08: formação e autor entregues; o título ficou de fora por escolha dele | A página é implementada com o PDF atual; os dois critérios ficam pendentes até o arquivo chegar. |
| Q3 | A seção Resume de Contact continua com o link direto para o PDF ou passa a levar à página `/resume`? | Não | Continua com o link direto (RES-RF-08). **Resolvida em 2026-11-08: default aceito pelo Bruno.** |
| Q4 | A página mostra a data da última atualização e o tamanho do arquivo? | Não | Mostra os dois: a data é obrigatória (RES-RF-03) e o tamanho é Should (RES-RF-15). **Resolvida em 2026-11-08: default aceito pelo Bruno.** |
| Q5 | O nome completo "Bruno Lucildo da Silva" no PDF, contra "Bruno Lucildo" no site, fica assim? | Não | Fica (seção 7.5). **Resolvida em 2026-11-08: default aceito pelo Bruno.** |

## 12. Premissas

1. O botão "Resume" do header não entra em `mainNavigation`; o rodapé continua sem item de currículo.
2. A data de atualização é um campo manual de `siteConfig.resume`, revisado a cada troca do PDF; não é lida do arquivo.
3. O tamanho do arquivo vem de `fs.statSync` em tempo de build, no Server Component da página.
4. Contact não muda (Q3).
5. `hreflang` nos links do PDF descreve o idioma do arquivo; `lang="en"` deixa de ser usado na página nova, porque os rótulos estão no idioma da página.
6. O PDF novo substitui o atual com o mesmo nome (`bruno-lucildo-resume-en.pdf`).
7. As frases genéricas de "O que o documento traz" são texto editorial, sem fato novo sobre o Bruno.
8. A página usa o botão secundário para "View Resume" porque o currículo é recurso secundário; o primário continua reservado às chamadas principais do site.

## 13. Decisões registradas

| Data | Decisão | Quem |
|---|---|---|
| 2026-11-07 | Telefone e e-mail pessoal ficam no PDF público do currículo. | Bruno |
| 2026-11-07 | As frases de busca de emprego ficam no PDF (documento), nunca no site. | Bruno |
| 2026-11-08 | Haverá uma página `/resume` própria (pt-BR: `/curriculo`). | Bruno |
| 2026-11-08 | O currículo continua só em inglês; versão em português fica para depois. | Bruno |
| 2026-11-08 | Alinhar no PDF a formação e os metadados; os itens que só estão no site ficam fora do PDF. | Bruno |
| 2026-11-08 | O PDF fica fora dos buscadores (`X-Robots-Tag: noindex`). | Bruno |
| 2026-11-08 | O botão do header leva à página `/resume`. | Bruno |
| 2026-11-08 | A página mostra ações e o que há no PDF, sem pré-visualização embutida. | Bruno |
| 2026-11-08 | Textos e SEO das seções 7.2 e 7.3 aprovados e implementação autorizada (Q1). Q2 a Q5 seguem abertas, com os defaults da seção 11. | Bruno |
| 2026-11-08 | PDF novo entregue (`CV - Bruno Lucildo.pdf`, na pasta `CV`) com a formação ajustada e o autor corrigido; o título do arquivo pode ficar vazio ("se não funcionou, pode ignorar"). Q2 resolvida. | Bruno |

## Refinamento

- 2026-11-08, v0.4.0: PDF ajustado entregue (Q2 resolvida): formação alinhada e autor corrigido; RES-RF-12 deixou de exigir o título do arquivo, por escolha do Bruno; RES-CA-14 atendido; teste do mês de criação passou a ler também o `xmp:CreateDate`, e um teste novo confere o autor.
- 2026-11-08, v0.3.0: página, botão do header, `noindex` e testes implementados; a seção 15 registra a entrega, as divergências e a verificação. A SPEC-008 (seção 7.4) foi atualizada para o novo comportamento do botão do menu.
- 2026-11-08, v0.2.0: textos e SEO aprovados (Q1); status passa a Approved. Q2 (PDF ajustado) segue pendente e só afeta RES-RF-12 e RES-CA-14.
- 2026-11-08, v0.1.0: SPEC criada a partir do rascunho de `FEATURES.md` (Draft v0.1), do `BUSINESS.md`, do `CONTENT.md` (4.8), do `DESIGN.md`, do `DESIGN_SYSTEM.md` (4.2), do `QA.md`, do código (`site.ts`, header, Contact, rotas), dos testes existentes e da leitura do PDF atual. Rascunho original preservado: PDF, abrir ou baixar, idioma por versão, documento atualizado e acesso pelo menu como ação secundária. Detalhado: o que é "atualizado" virou procedimento e critério (RES-RF-13/14); "abrir ou baixar" virou dois botões; "versão por idioma" virou regra com aviso; "dados pessoais desnecessários" virou decisão registrada (telefone e cidade no PDF) com `noindex`; "integrar ao menu" virou o botão levando à página. Seis decisões do Bruno de 2026-11-08 e duas anteriores registradas na seção 13; textos aguardavam a aprovação (Q1).

## 15. Implementação e verificação

Implementada na branch `docs/spec-009-resume` em 2026-11-08, depois da aprovação dos textos (Q1).

- Novos: `src/app/[locale]/resume/page.tsx`, `src/components/resume/` (`ResumeContent`, `format.ts`) e `e2e/resume.spec.ts` (50 testes).
- Alterados: `src/i18n/routing.ts` (rota `/resume` ↔ `/curriculo`), `src/config/site.ts`, `src/lib/seo/metadata.ts` (namespace `resume.metadata`), `src/components/layout/Header.tsx` e `HeaderNav.tsx`, `next.config.ts` (`X-Robots-Tag`), `src/content/{en,pt-BR}/common.json` (bloco `resume`; removido `navigation.resumeFallback`), `e2e/i18n.spec.ts`, `e2e/contact.spec.ts`, `.specs/008-internationalization.md` e `README.md`.

Decisões de implementação:

- `siteConfig.resume` guarda, por idioma, `{ href, updatedAt }`, e não um `updatedAt` único. Assim um PDF em pt-BR futuro tem a própria data. `getResumeFile(locale)` devolve a entrada e `getResumeHref` continua devolvendo só o caminho.
- A formatação (mês por `Intl`, tamanho em KB ou MB, nome do arquivo) fica em `format.ts`, em funções puras testadas sem navegador. O tamanho é lido de `public/` no servidor; se a leitura falhar, a linha Tamanho some.
- `Header` deixou de ser assíncrono e de ler o idioma: o botão agora é um `Link` interno e não precisa mais do caminho do PDF.
- O aviso de arquivo em inglês depende só de `hasLocalizedResume(locale)`: em en o PDF é do próprio idioma, então não há aviso.

Divergências em relação à SPEC:

- **RES-RF-14 e seção 7.1:** a data está em `siteConfig.resume.en.updatedAt` (por arquivo), e não em `siteConfig.resume.updatedAt`.
- **Seção 6.1:** o bloco de ações e dados do arquivo fica no cabeçalho da página, sem `h2` próprio (a SPEC previa uma seção com rótulo na coluna estreita). Só "O que o documento traz" usa as duas colunas. O texto aprovado não previa um título para esse bloco, e criar um exigiria texto novo.
- **RES-CA-06:** verificado nas funções `hasLocalizedResume` e `getResumeHref` com a configuração alterada, e não renderizando a página com ela (a página é gerada no servidor).
- **Header:** o botão não ganhou indicador visual de página ativa, só `aria-current="page"`, como a SPEC pede.

| Critério | Resultado | Evidência |
|---|---|---|
| RES-CA-01 | Atendido | `h1`, abertura, `h2` "What's inside"/"O que o documento traz" e cinco itens, sem `noindex`. |
| RES-CA-02 | Atendido | "View Resume" com `href`, `target`, `rel`, `hreflang="en"` e nome acessível com o aviso de nova aba; "Download PDF" com o `download` do arquivo. |
| RES-CA-03 | Atendido | "Ver currículo" e "Baixar PDF", sem "(EN)" e sem `lang`. |
| RES-CA-04 | Atendido | `dl` com Formato, Idioma do arquivo, Última atualização ("November 2026"/"novembro de 2026") e Tamanho igual ao do arquivo. |
| RES-CA-05 | Atendido | Aviso só em pt-BR. |
| RES-CA-06 | Atendido (função) | Ver a divergência acima. |
| RES-CA-07 | Atendido | Os cinco itens, sem cargo, data, empresa, métrica, curso nem tecnologia. |
| RES-CA-08 | Atendido | Links finais levam a Experience e Contact na mesma aba. |
| RES-CA-09 | Atendido | Header em 1440 px e menu mobile em 375 px: link interno, sem `target`, `aria-current="page"` na página, menu fecha ao navegar. |
| RES-CA-10 | Atendido | `e2e/contact.spec.ts` segue passando; em pt-BR, Contact mantém "Ver currículo (EN)" e `lang="en"`. |
| RES-CA-11 | Atendido | PDF com 200, `application/pdf`, `X-Robots-Tag: noindex`, `%PDF-` e menos de 1 MB; as páginas `/resume` e `/curriculo` sem `noindex`. |
| RES-CA-12 | Atendido | Título, descrição, canonical, `hreflang` (`en`, `pt-BR`, `x-default`, com as rotas localizadas) e Open Graph. |
| RES-CA-13 | Atendido | Sem `%`, telefone, cidade, empresa, expressões proibidas nem frases de busca de emprego. |
| RES-CA-14 | Atendido | PDF novo do Bruno (261 KB, gerado em 2026-11-08): autor "Bruno Lucildo" (teste lê o `dc:creator` do XMP; o arquivo antigo daria `User`) e formação "Postgraduate Program (Master)…", conferida por leitura. O título ficou vazio, aceito por ele. |
| RES-CA-15 | Atendido | Seção 7.5 conferida por leitura do PDF em 2026-11-08; as linhas "A alinhar" e "A corrigir" dependem da Q2. |
| RES-CA-16 | Atendido | Formato `AAAA-MM`, não está no futuro e não é anterior ao mês de geração do PDF (`/CreationDate`). |
| RES-CA-17 | Atendido | Os quatro alvos da página têm 44 px ou mais e contorno de foco; a tabulação segue a ordem visual. |
| RES-CA-18 | Atendido | Sem rolagem horizontal em 360, 390, 768, 1366, 1440 e 1920 px, nos dois idiomas; a abertura tem até 80 caracteres por linha em 1366 px. |
| RES-CA-19 | Atendido | `resumeHref`, `resumeLocalized` e `resumeFallback` não existem mais (teste lê o código e os dois `common.json`); `tsc --noEmit` sem erros e suíte E2E com 625 testes passando. |
| RES-CA-20 | Atendido | A linha Tamanho mostra o tamanho real do PDF ("358 KB"). |

Verificação adicional:

- Mutação: três defeitos introduzidos de propósito. Remover o `noindex` e fazer o botão do header abrir em nova aba derrubaram cinco testes. O terceiro (aviso de idioma em inglês) era um mutante equivalente, porque a condição `locale !== defaultLocale` era redundante; a condição foi simplificada para `!localized` e uma mutação nova (aviso sempre visível) derrubou o teste de en. Arquivos restaurados e suíte completa verde depois.
- Navegador: página conferida em 1440 px (en) e 375 px (pt-BR), com o servidor de produção da porta 3200, já encerrado.
- Problema encontrado e corrigido nos testes: o teste de teclado contava o link "Experience" do menu do header; passou a contar só os da página. A chave `resume.details.formatValue` ("PDF") entrou na lista de textos iguais nos dois idiomas de `e2e/i18n.spec.ts`.
- `pnpm check` equivalente (Biome) passa nos arquivos novos e alterados; na árvore inteira ainda falha em arquivos não tocados, por causa do CRLF do checkout no Windows. Os quatro arquivos em que rodei `biome check --write` (`site.ts`, `format.ts`, `resume.spec.ts` e `contact.spec.ts`) passaram para LF, como o Git guarda.

Não verificado: o download real pelo atributo `download` em um navegador de uso comum (só os atributos foram conferidos), se o `X-Robots-Tag` chega ao cliente na hospedagem final (ainda não decidida), o contraste com ferramenta (usa os tokens do site) e LCP e CLS.
