# SPEC-007 — Contact

## 1. Identificação

| Campo | Valor |
|---|---|
| Nome | Contact |
| Identificador | SPEC-007 |
| Slug | `007-contact` |
| Versão | 0.2.0 |
| Status | In Review (textos aprovados e implementada em 2026-11-08; aguardando revisão do usuário e do PR) |
| Data | 2026-11-08 |
| Origem | SPEC-007 de `.specs/FEATURES.md` (v0.1, Draft) |

Prioridades usadas: **Must** (obrigatório para a v1), **Should** (desejável; pode ser adiada sem bloquear a entrega).

## 2. Contexto

A página Contact reúne os canais de comunicação profissional de Bruno. Hoje `/contact` (pt-BR: `/contato`) é uma página provisória `noindex` (`PagePlaceholder`), embora o botão "Get in Touch" do Hero e o item de menu já levem até ela e o rodapé já liste e-mail, LinkedIn e GitHub a partir de `siteConfig.contact`.

**Objetivo:** facilitar a conexão profissional com poucos elementos e uma chamada clara, sem posicionar o portfólio como página de procura por emprego (`BUSINESS.md`; `CONTENT.md`, 4.7; `DESIGN.md`, 6.7).

**Conferência dos canais (2026-11-08):** o e-mail e o LinkedIn de `siteConfig` são os mesmos do currículo público (`bruno.lucsilva@gmail.com` e `linkedin.com/in/bruno-lucildo`), e o perfil `github.com/brunolucildo` existe (8 repositórios públicos). O telefone e a cidade do currículo não estão no site e continuam de fora.

**Posicionamento:** a página não usa "Open to Work", "Available for Opportunities", "Hire Me" nem mensagens de disponibilidade profissional.

## 3. Escopo

### 3.1. Dentro do escopo

1. Página em `/contact` (pt-BR: `/contato`) com abertura breve e quatro seções: Email, LinkedIn, GitHub e Resume.
2. Canais lidos de `siteConfig.contact` (só os definidos aparecem), como o rodapé já faz.
3. Na seção de e-mail: o endereço em texto, um link `mailto:` e um botão **Copiar** com aviso de confirmação.
4. Link para o currículo em PDF, com as mesmas regras de idioma do botão do menu.
5. Estados de foco e hover, alvos de toque de 44 px e links externos que abrem em nova aba com aviso ao leitor de tela.
6. Textos em inglês e português, metadados indexáveis e `e2e/contact.spec.ts`.
7. Remoção do que deixa de ser usado: `PagePlaceholder`, `buildPlaceholderMetadata` e o bloco `pages` do conteúdo.

### 3.2. Fora do escopo

- Formulário de mensagem, backend e serviço externo (decisão do Bruno em 2026-11-08; o serviço segue "Pendente" na `ARCHITECTURE.md`).
- Telefone, cidade e qualquer dado que esteja só no PDF do currículo.
- Mensagens de disponibilidade profissional e frases de busca de emprego do currículo.
- Analytics de cliques nos links (hospedagem e analytics seguem sem decisão).
- Página Resume própria e versão do currículo em português (SPEC-009).
- Header, footer, menu e Language Switcher (SPEC-010, já implementados) e o Hero (SPEC-001): nada neles muda.

## 4. Requisitos funcionais

| ID | Prioridade | Requisito |
|---|---|---|
| CON-RF-01 | Must | A rota `/en/contact` (pt-BR: `/pt-BR/contato`) tem um `h1`, um parágrafo de abertura e uma seção por canal, cada uma com um `h2`, na ordem Email, LinkedIn, GitHub e Resume. A página deixa de ser provisória e `noindex`. |
| CON-RF-02 | Must | A seção Email mostra o endereço em texto selecionável, um link `mailto:` com o rótulo "Send a Message" e um botão para copiar o endereço. |
| CON-RF-03 | Must | O botão Copiar copia o endereço para a área de transferência e mostra a confirmação "Address copied" em uma região `role="status"` (lida por leitor de tela), que volta ao estado inicial depois de 3 segundos. Se a cópia falhar, mostra "Could not copy. Select the address instead." e o endereço continua selecionável. |
| CON-RF-04 | Must | O botão Copiar só aparece quando a Clipboard API está disponível. Sem JavaScript ou sem a API, a seção mostra apenas o endereço e o link `mailto:`, sem botão inoperante. |
| CON-RF-05 | Must | LinkedIn e GitHub mostram o endereço público em texto e um link para o perfil que abre em nova aba (`target="_blank"`, `rel="noopener noreferrer"`) e avisa "(opens in a new tab)" ao leitor de tela. |
| CON-RF-06 | Must | A seção Resume tem um link "View Resume" para o PDF do idioma, ou para o PDF em inglês quando não há versão localizada. Nesse caso o rótulo ganha "(EN)" e o link recebe `lang="en"`, como no menu. Abre em nova aba com o mesmo aviso. |
| CON-RF-07 | Must | Só os canais definidos em `siteConfig.contact` aparecem. Se um canal não estiver definido, a seção dele não é renderizada. O currículo aparece sempre que houver PDF. |
| CON-RF-08 | Must | Todos os links e o botão têm feedback visual de hover e foco visível, e alvo de toque de pelo menos 44 px de altura. |
| CON-RF-09 | Must | A página não exibe mensagens de disponibilidade, frases de busca de emprego, telefone, cidade, nome da empresa, curso, instituição nem percentuais. |
| CON-RF-10 | Must | O endereço de e-mail, as URLs dos perfis e os nomes dos canais ficam na grafia original nos dois idiomas; só a abertura, as descrições, os rótulos de ação e os avisos são traduzidos. |
| CON-RF-11 | Must | A página tem metadados indexáveis em cada idioma (título, descrição, canonical, `hreflang`, Open Graph), sem `noindex`. |
| CON-RF-12 | Must | O código provisório que deixa de ter uso é removido: `PagePlaceholder`, `buildPlaceholderMetadata` e o bloco `pages` dos arquivos de conteúdo. |

## 5. Requisitos não funcionais

| ID | Categoria | Requisito |
|---|---|---|
| CON-RNF-01 | Acessibilidade | Um único `h1`, um `h2` por canal sem pular níveis, listas semânticas, nomes de link distintos (o nome do canal faz parte do nome acessível), aviso de nova aba, confirmação do Copiar em `role="status"` e contraste AA. |
| CON-RNF-02 | Responsividade | Sem rolagem horizontal em 360, 390, 768, 1366, 1440 e 1920 px, nos dois idiomas. O endereço de e-mail e as URLs quebram dentro da coluna se for preciso. Texto corrido com no máximo 80 caracteres por linha. |
| CON-RNF-03 | Desempenho | Sem dependência nova. O único JavaScript de cliente é o do botão Copiar; o restante da página é renderizado no servidor. Sem imagem e sem layout shift. |
| CON-RNF-04 | Consistência visual | Dark Premium, composição editorial como Technologies e Projects (título na coluna estreita, conteúdo na larga, filetes entre seções), sem cards, sem neon, sem gradiente decorativo e sem elemento gráfico. O verde-limão só aparece nos links de ação e no foco. |
| CON-RNF-05 | Privacidade | O endereço de e-mail é público por decisão do Bruno (já está no rodapé e no currículo); nada é enviado a terceiros, nenhum rastreador é adicionado e o conteúdo copiado nunca é registrado. |
| CON-RNF-06 | Manutenibilidade | Canais ficam em `src/config/site.ts` e os textos traduzidos em `common.json`. Adicionar um canal não exige alterar mais que a configuração e o conteúdo. |
| CON-RNF-07 | Movimento | Nenhuma animação nova: o aviso do Copiar troca de texto sem transição, o que atende `prefers-reduced-motion`. |

## 6. Interface e experiência

### 6.1. Composição

Layout editorial, sem cards, no mesmo padrão de Technologies, Experience e Projects.

| Largura | Composição |
|---|---|
| ≥1024 px | Cada canal em duas colunas separadas por filete: o `h2` na coluna estreita e, na larga, a descrição, o endereço e as ações. |
| <1024 px | Coluna única: `h2`, descrição, endereço e ações em sequência; as ações quebram de linha quando faltar espaço. |

- Cabeçalho: `h1` e a abertura, sem elemento gráfico.
- Cada seção: descrição de uma frase em `muted`, o endereço em `foreground` (texto selecionável) e a linha de ações com o link principal.
- Na seção Email, o botão Copiar fica ao lado do link, com o estilo secundário do design system; a confirmação aparece logo abaixo da linha de ações, sem deslocar o restante do conteúdo (altura reservada).
- O currículo usa o mesmo link de texto das outras seções; não é um botão de destaque.

### 6.2. Estados

| Situação | Comportamento esperado |
|---|---|
| Cópia concluída | Texto do botão e região de status mostram "Address copied" por 3 segundos e depois voltam ao estado inicial. |
| Cópia recusada ou com erro | Mostra "Could not copy. Select the address instead." na região de status; o endereço continua selecionável. |
| Clipboard API indisponível ou JavaScript desligado | Sem botão Copiar; endereço e link `mailto:` continuam funcionando. |
| Dispositivo sem aplicativo de e-mail configurado | O link `mailto:` pode não abrir nada; o endereço visível e o botão Copiar são o caminho alternativo. |
| Canal ausente em `siteConfig` | A seção do canal não é renderizada. |
| Currículo só em inglês (pt-BR) | Rótulo "Ver currículo (EN)" e `lang="en"` no link. |
| Navegação por teclado | Skip link, header, links e botão da página na ordem visual, footer. Foco visível. |
| `prefers-reduced-motion` | Sem diferença: a página não tem movimento. |

Não há estado de carregamento nem de erro de dados: o conteúdo é estático.

## 7. Conteúdo e dados

### 7.1. Canais (rascunho para aprovação)

Origem: `siteConfig.contact` e `siteConfig.resume`, conferidos com o currículo público em 2026-11-08.

| Canal | Valor exibido | Destino | Ação principal |
|---|---|---|---|
| Email | `bruno.lucsilva@gmail.com` | `mailto:bruno.lucsilva@gmail.com` | Send a Message / Enviar mensagem; botão Copy address / Copiar endereço |
| LinkedIn | `linkedin.com/in/bruno-lucildo` | `https://www.linkedin.com/in/bruno-lucildo/` | Connect with Me / Conecte-se comigo |
| GitHub | `github.com/brunolucildo` | `https://github.com/brunolucildo` | View on GitHub / Ver no GitHub |
| Resume | (sem valor exibido) | `/documents/resume/bruno-lucildo-resume-en.pdf` | View Resume / Ver currículo |

### 7.2. Textos de interface (rascunho para aprovação)

| Elemento | en | pt-BR |
|---|---|---|
| `h1` | Contact | Contato |
| Abertura | I enjoy talking about backend engineering, technical leadership, distributed systems and applied AI. These are the best ways to reach me. | Gosto de conversar sobre engenharia backend, liderança técnica, sistemas distribuídos e IA aplicada. Estes são os melhores caminhos para falar comigo. |
| `h2` Email | Email | Email |
| Descrição, Email | A direct message, for anything that needs detail. | Uma mensagem direta, para o que pede mais detalhe. |
| Link de e-mail | Send a Message | Enviar mensagem |
| Botão Copiar | Copy address | Copiar endereço |
| Confirmação | Address copied | Endereço copiado |
| Falha ao copiar | Could not copy. Select the address instead. | Não foi possível copiar. Selecione o endereço. |
| `h2` LinkedIn | LinkedIn | LinkedIn |
| Descrição, LinkedIn | For professional connections. | Para conexões profissionais. |
| Link do LinkedIn | Connect with Me | Conecte-se comigo |
| `h2` GitHub | GitHub | GitHub |
| Descrição, GitHub | Code and projects, in public repositories. | Código e projetos, em repositórios públicos. |
| Link do GitHub | View on GitHub | Ver no GitHub |
| `h2` Resume | Resume | Currículo |
| Descrição, Resume | A PDF with my professional history. | Um PDF com a minha trajetória profissional. |
| Link do currículo | View Resume | Ver currículo |
| Link do currículo, sem versão localizada | (não se aplica em en) | Ver currículo (EN) |

O "Email" é escrito igual nos dois idiomas, como no rodapé (nome do canal).

### 7.3. SEO (rascunho para aprovação)

| Item | en | pt-BR |
|---|---|---|
| Título | Contact \| Bruno Lucildo | Contato \| Bruno Lucildo |
| Descrição | How to reach Bruno Lucildo: email, LinkedIn and GitHub, plus the resume. | Como falar com Bruno Lucildo: email, LinkedIn e GitHub, além do currículo. |

### 7.4. Rotas

| Rota (`en`) | Rota (`pt-BR`) |
|---|---|
| `/en/contact` | `/pt-BR/contato` |

As rotas e o item de menu já existem (`routing.ts`, `navigation.ts`); nada novo entra em `pathnames`.

## 8. Critérios de aceitação

| ID | Critério (Given / When / Then) |
|---|---|
| CON-CA-01 | **Given** `/en/contact`, **when** ela é aberta, **then** há um `h1`, a abertura e quatro `h2` na ordem Email, LinkedIn, GitHub e Resume, sem `noindex` e sem o texto de página em construção. Idem em `/pt-BR/contato`. |
| CON-CA-02 | **Given** a seção Email, **when** ela é lida, **then** mostra `bruno.lucsilva@gmail.com` em texto, um link "Send a Message" com `href="mailto:bruno.lucsilva@gmail.com"` e o botão "Copy address". |
| CON-CA-03 | **Given** a Clipboard API disponível, **when** o usuário aciona "Copy address", **then** a área de transferência contém o endereço, a região `role="status"` mostra "Address copied" e, depois de 3 segundos, volta ao estado inicial. |
| CON-CA-04 | **Given** a cópia recusada pelo navegador, **when** o usuário aciona o botão, **then** a região de status mostra a mensagem de falha e o endereço continua selecionável. |
| CON-CA-05 | **Given** JavaScript desabilitado, **when** a página é aberta, **then** o endereço e o link `mailto:` estão presentes e não há botão Copiar. |
| CON-CA-06 | **Given** os links de LinkedIn e GitHub, **when** são lidos, **then** apontam para `https://www.linkedin.com/in/bruno-lucildo/` e `https://github.com/brunolucildo`, com `target="_blank"`, `rel="noopener noreferrer"` e o aviso de nova aba. |
| CON-CA-07 | **Given** o link do currículo, **when** é lido em en, **then** aponta para `/documents/resume/bruno-lucildo-resume-en.pdf`, abre em nova aba e se chama "View Resume"; em pt-BR se chama "Ver currículo (EN)" e tem `lang="en"`. |
| CON-CA-08 | **Given** `siteConfig.contact` sem um canal, **when** a página é gerada, **then** a seção desse canal não existe. |
| CON-CA-09 | **Given** o texto visível da página, **when** é lido, **then** não contém `%`, telefone, cidade, empresa, curso, instituição, "Open to Work", "Available for Opportunities", "Hire Me" nem as frases de busca de emprego do currículo. |
| CON-CA-10 | **Given** cada link e botão, **when** medidos, **then** têm pelo menos 44 px de altura, e o foco por teclado é visível e segue a ordem visual. |
| CON-CA-11 | **Given** as larguras 360, 390, 768, 1366, 1440 e 1920 px, **when** a página é aberta nos dois idiomas, **then** não há rolagem horizontal e o texto corrido tem no máximo 80 caracteres por linha. |
| CON-CA-12 | **Given** a página, **when** os metadados são lidos, **then** há título, descrição, canonical, `hreflang` e Open Graph únicos por idioma, sem `noindex`. |
| CON-CA-13 | **Given** o repositório, **when** a busca é feita, **then** `PagePlaceholder`, `buildPlaceholderMetadata` e o bloco `pages` não existem mais, e `pnpm typecheck` e `pnpm test:e2e` passam. |

## 9. Dependências

- `src/config/site.ts` (`siteConfig.contact`, `siteConfig.resume`, `getResumeHref`, `hasLocalizedResume`).
- Rota localizada e item de menu já existentes (`routing.ts`, `navigation.ts`); rodapé e Hero já apontam para a página.
- Rótulos `navigation.resume`, `navigation.resumeFallback` e `navigation.newTab`, já existentes.
- `e2e/support/content-rules.ts` (expressões proibidas e frases de busca de emprego) e `playwright.config.ts`.
- Currículo em PDF em `public/documents/resume/`.

## 10. Riscos

| Risco | Impacto | Mitigação |
|---|---|---|
| O endereço de e-mail, em texto no HTML, ser coletado por robôs de spam. | Mais spam na caixa pessoal | Já é público no rodapé e no currículo (decisão do Bruno); formulário com serviço externo ficou para depois. |
| `navigator.clipboard` exigir contexto seguro. | Copiar falhar fora de HTTPS ou localhost | O botão só aparece com a API disponível, e a falha mostra mensagem; a hospedagem deve usar HTTPS. |
| O link `mailto:` não abrir nada sem aplicativo de e-mail. | Visitante sem caminho | Endereço visível e botão Copiar. |
| Currículo só em inglês aparecer na versão em português. | Visitante surpreso | Rótulo "(EN)" e `lang="en"`, como no menu. |
| A página virar uma lista de busca de emprego. | Posicionamento errado | CON-RF-09 e CON-CA-09, com teste das expressões proibidas. |

## 11. Perguntas abertas

| ID | Pergunta | Bloqueia? | Default adotado se não houver resposta |
|---|---|---|---|
| Q1 | Os textos da seção 7.2 e o SEO da seção 7.3 podem ser publicados? | Resolvida em 2026-11-08: aprovados pelo Bruno | Nenhum: implementação só depois da aprovação. |
| Q2 | O rótulo "Email" fica igual nos dois idiomas (como no rodapé) ou prefere "E-mail" em pt-BR? | Não | "Email" nos dois, como no rodapé. |
| Q3 | A abertura cita os temas de conversa (backend, liderança técnica, sistemas distribuídos, IA aplicada). Prefere uma frase mais neutra, sem temas? | Não | A frase do rascunho. |

## 12. Premissas

1. Os canais são os três já definidos em `siteConfig.contact`; outros (X, Medium, WhatsApp) não entram sem confirmação.
2. O formulário de contato fica fora da v1 e só volta como nova SPEC, quando houver decisão de serviço, hospedagem e tratamento de spam e privacidade.
3. O botão Copiar só existe no cliente com a Clipboard API; o restante da página é estático.
4. O currículo da página usa o mesmo PDF e as mesmas regras de idioma do botão do menu.
5. O aviso de cópia dura 3 segundos e não tem animação.
6. As descrições curtas de cada canal são texto editorial, sem fato novo sobre o Bruno.

## 13. Decisões registradas

| Data | Decisão | Quem |
|---|---|---|
| 2026-11-08 | Sem formulário de mensagem na v1: só canais diretos. | Bruno |
| 2026-11-08 | E-mail com endereço visível, link `mailto:` e botão Copiar com confirmação. | Bruno |
| 2026-11-08 | A página inclui um link "View Resume". | Bruno |
| 2026-11-08 | Textos e SEO da seção 7 aprovados e implementação autorizada (Q1). Q2 e Q3 seguem como premissas reversíveis ("Email" igual nos dois idiomas e a abertura com os temas de conversa). | Bruno |

## Refinamento

- 2026-11-08, v0.2.0: textos aprovados (Q1) e página implementada; a seção 15 registra a entrega, as divergências e a verificação.
- 2026-11-08, v0.1.0: SPEC criada a partir do rascunho de `FEATURES.md` (Draft v0.1), do `BUSINESS.md`, do `CONTENT.md` (4.7), do `DESIGN.md` (6.7), do `DESIGN_SYSTEM.md` (4.10), da `ARCHITECTURE.md` (3.4) e do código de `siteConfig`, do rodapé e do menu. Canais conferidos com o currículo público e com o perfil do GitHub. Três decisões do Bruno registradas na seção 13; textos aguardam a aprovação (Q1).

## 15. Implementação e verificação

Implementada na branch `feat/contact` em 2026-11-08, depois da aprovação dos textos (Q1).

- Novos: `src/components/contact/` (`ContactContent`, `ContactChannelSection`, `CopyEmailButton`, `channels.ts`) e `e2e/contact.spec.ts`.
- Alterados: `src/app/[locale]/contact/page.tsx` (deixa de ser provisória e `noindex`), `src/lib/seo/metadata.ts` (namespace `contact.metadata`; removido `buildPlaceholderMetadata`), `src/config/site.ts` (o tipo `ContactChannels` passa a ser exportado), `src/content/{en,pt-BR}/common.json` (novo bloco `contact`; removido `pages`) e `README.md`.
- Removido: `src/components/sections/PagePlaceholder.tsx`.

Decisões de implementação:

- `buildContactChannels` (função pura em `channels.ts`) monta os canais a partir de `siteConfig.contact`, na ordem Email, LinkedIn e GitHub, e só inclui os definidos. O endereço exibido dos perfis sai da URL, sem protocolo, `www` nem barra final.
- O botão Copiar é o único Client Component da página. Os três textos dele (botão, confirmação e falha) chegam por props, porque o provedor de mensagens do layout só envia ao navegador os namespaces `navigation` e `languageSwitcher`. A primeira versão lia `contact` no cliente e a hidratação falhava com `MISSING_MESSAGE`, deixando o botão fora da página; os testes pegaram o erro.
- A região `role="status"` ocupa a linha de baixo da barra de ações com altura mínima reservada (24 px), então o aviso não desloca o conteúdo.

Divergências em relação à SPEC:

- **Seção 6.2:** o rótulo do botão não muda para "Address copied". Só a região de status mostra a confirmação, para o leitor de tela não anunciar a mesma frase duas vezes.
- **CON-RF-03:** a mensagem de falha também volta ao estado inicial depois de 3 segundos, como a de sucesso (a SPEC só definia isso para o sucesso).
- **Conteúdo:** o bloco `contact.channels.resume.actionFallback` existe também em en ("View Resume (EN)"), sem uso, só para a paridade de chaves entre os idiomas que o typecheck exige.
- **CON-CA-08:** é verificado na função `buildContactChannels` (sem e-mail, só com GitHub e sem canal nenhum), e não renderizando a página com a configuração alterada.

| Critério | Resultado | Evidência |
|---|---|---|
| CON-CA-01 | Atendido | `h1`, abertura e quatro `h2` na ordem Email, LinkedIn, GitHub e Resume (Currículo em pt-BR), sem `noindex` e sem o texto de página em construção. |
| CON-CA-02 | Atendido | Endereço em texto, link "Send a Message" com `mailto:` e botão "Copy address". |
| CON-CA-03 | Atendido | Com a permissão concedida, a área de transferência recebe o endereço, o status mostra "Address copied" e volta a vazio em até 6 s. |
| CON-CA-04 | Atendido | Com `writeText` recusando, o status mostra a mensagem de falha e o endereço tem `user-select: all`. |
| CON-CA-05 | Atendido | Com JavaScript desabilitado e sem Clipboard API, o endereço e o `mailto:` estão presentes e não há botão nem região de status. |
| CON-CA-06 | Atendido | URLs de LinkedIn e GitHub, `target`, `rel` e o nome acessível "ação — canal (abre em uma nova aba)" conferidos. |
| CON-CA-07 | Atendido | PDF em `/documents/resume/bruno-lucildo-resume-en.pdf` (responde 200, `application/pdf`), nova aba; en sem `lang`, pt-BR com "Ver currículo (EN)" e `lang="en"`. |
| CON-CA-08 | Atendido (função) | Ver a divergência acima. |
| CON-CA-09 | Atendido | Sem `%`, telefone, cidade, empresa, curso, instituição, expressões proibidas nem frases de busca de emprego. |
| CON-CA-10 | Atendido | Os cinco alvos (três links, link do currículo e botão) têm 44 px ou mais e contorno de foco; a tabulação segue a ordem visual (e-mail, Copiar, LinkedIn, GitHub, currículo). |
| CON-CA-11 | Atendido | Sem rolagem horizontal em 360, 390, 768, 1366, 1440 e 1920 px, nos dois idiomas; a abertura tem até 80 caracteres por linha em 1366 px. |
| CON-CA-12 | Atendido | Título, descrição, `lang`, Open Graph, canonical e `hreflang` (`en`, `pt-BR`, `x-default`) conferidos; sem `noindex`. |
| CON-CA-13 | Atendido | `PagePlaceholder`, `buildPlaceholderMetadata` e o bloco `pages` não existem mais (teste lê o código e os dois `common.json`); `pnpm typecheck` sem erros e `pnpm test:e2e` com 450 testes passando (50 novos). |

Verificação adicional:

- Mutação: três defeitos introduzidos de propósito (aviso que só volta depois de 12 s, botão exibido mesmo sem Clipboard API e endereço sem `select-all`) derrubaram seis testes; os arquivos foram restaurados e a suíte voltou a passar.
- Navegador: página conferida em 1440 px (en) e 375 px (pt-BR). No painel do app a cópia foi recusada (o navegador embutido não libera a área de transferência), e o caminho de falha apareceu como especificado; o caminho de sucesso foi conferido pelo Playwright.
- `pnpm check` passa nos arquivos novos e alterados; na árvore inteira falha em 48 arquivos que não foram tocados, por causa do CRLF do checkout no Windows (problema já conhecido).

Não verificado: se o link `mailto:` abre um aplicativo de e-mail real, o comportamento do Copiar em um Chrome comum com a política de permissões do usuário, o contraste com ferramenta (usa os tokens do site) e LCP e CLS.
