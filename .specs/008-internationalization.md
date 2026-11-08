# SPEC-008 — Internationalization

## 1. Identificação

| Campo | Valor |
|---|---|
| Nome | Internationalization |
| Identificador | SPEC-008 |
| Slug | `008-internationalization` |
| Versão | 0.2.0 |
| Status | In Review (textos aprovados e implementada em 2026-11-08; aguardando revisão do usuário e do PR) |
| Data | 2026-11-08 |
| Origem | SPEC-008 de `.specs/FEATURES.md` (v0.1, Draft) |

Prioridades usadas: **Must** (obrigatório para a v1), **Should** (desejável; pode ser adiada sem bloquear a entrega).

## 2. Contexto

O site é bilíngue: inglês (`en`, padrão) e português do Brasil (`pt-BR`). A infraestrutura (`next-intl`, rotas `[locale]`, URLs traduzidas, troca de idioma) foi montada junto com a base e as SPECs 001 a 007 já entregam o conteúdo nos dois idiomas. Esta SPEC **formaliza o que existe como requisitos testáveis** e fecha as lacunas encontradas na auditoria.

**Objetivo:** atender públicos internacionais e brasileiros com uma experiência consistente: o mesmo conteúdo, a mesma navegação e os mesmos metadados nos dois idiomas, sem mistura de línguas (`ARCHITECTURE.md`, 7; `CONTENT.md`, 3; `SEO.md`, 6).

### 2.1. Auditoria (2026-11-08, sobre a `main` em `5be8138`)

O que já funciona e passa a ser requisito:

- Treze rotas públicas nos dois idiomas, sempre com prefixo (`localePrefix: "always"`), com URLs traduzidas em pt-BR (`routing.ts`).
- Slug do idioma errado redireciona para o equivalente (`/pt-BR/about` para `/pt-BR/sobre`; `/en/sobre` para `/en/about`); barra final e caixa (`/EN/about`, `/pt-br/sobre`) também normalizam.
- `<html lang>` correto, `canonical`, `hreflang` (`en`, `pt-BR`, `x-default`) e `og:locale` no HTML de cada página.
- Seletor de idioma que preserva a página e o slug dinâmico (`/projects/[slug]`, `/ai-lab/[slug]`).
- 261 textos por idioma, com a paridade de chaves garantida em tempo de compilação (`src/content/parity.ts`).
- Datas por `Intl.DateTimeFormat(locale)` (`formatMonth`): "May 2023" em en e "mai. 2023" em pt-BR.
- A raiz `/` redireciona (307) por cookie `NEXT_LOCALE` e, na falta dele, por `Accept-Language`; o resto vai para `/en`.

Lacunas encontradas:

1. **A página 404 é a tela padrão do Next:** em inglês, fundo branco, sem `lang`, sem cabeçalho nem rodapé, inclusive em `/pt-BR/...`. Mistura idiomas e quebra a identidade visual.
2. **`hreflang` duplicado e divergente:** o middleware injeta um cabeçalho HTTP `Link` com os idiomas, com o `x-default` apontando para `/about` (sem prefixo), enquanto o HTML aponta para `/en/about`.
3. **Nada protege a tradução no futuro:** só as chaves são conferidas, não se um texto ficou igual ao inglês. Hoje há 20 textos idênticos entre os idiomas, todos legítimos (nomes próprios e marcas).
4. **`og:locale:alternate` ausente:** as páginas declaram o próprio `og:locale`, mas não o do outro idioma.
5. **Comportamento da raiz e do cookie sem documentação** (seção 7.3).

**Decisões do Bruno (2026-11-08):** manter a detecção do idioma pelo navegador na raiz e incluir uma 404 localizada, com a identidade do site, nesta SPEC.

## 3. Escopo

### 3.1. Dentro do escopo

1. Requisitos testáveis para o que já existe: idiomas, rotas, redirecionamentos, `lang`, seletor, metadados, datas e paridade de textos.
2. Página 404 localizada, com cabeçalho, rodapé, `lang`, texto e link para a Home, para rotas inexistentes e para `notFound()` dentro de um idioma.
3. `hreflang` com uma única fonte (o HTML): remover o cabeçalho HTTP `Link` do middleware.
4. `og:locale:alternate` com o outro idioma em todas as páginas.
5. Teste que falha quando um texto fica igual nos dois idiomas sem estar em uma lista explícita de exceções, e teste contra mistura de idiomas.
6. Teste transversal dos metadados das treze rotas (título, descrição, canonical, `hreflang` recíproco, `og:locale`).
7. Documentação do comportamento da raiz `/` e do cookie `NEXT_LOCALE` (seção 7.3) e das exceções (seção 7.4).
8. `e2e/i18n.spec.ts`.

### 3.2. Fora do escopo

- Sitemap e `robots.txt` (não existem; ficam para a SPEC de SEO).
- Versão do currículo em português (SPEC-009); o PDF só em inglês é uma exceção documentada.
- Um terceiro idioma, traduzir nomes de projetos e de tecnologias ou localizar o nome da empresa.
- Mudar as URLs já aprovadas (`ARCHITECTURE.md`, 7.1).
- Mudar o comportamento da detecção do idioma na raiz (decisão do Bruno).
- Banner de consentimento de cookies e analytics (dependem da hospedagem e do analytics, ainda sem decisão).

## 4. Requisitos funcionais

| ID | Prioridade | Requisito |
|---|---|---|
| I18N-RF-01 | Must | O site tem exatamente dois idiomas, `en` (padrão) e `pt-BR`, e todas as páginas públicas da seção 7.1 existem nos dois, sempre com o prefixo de idioma na URL. |
| I18N-RF-02 | Must | As URLs seguem o mapa da seção 7.1. Uma URL com o slug do outro idioma redireciona para a equivalente no idioma da URL (`/pt-BR/about` para `/pt-BR/sobre`, `/en/sobre` para `/en/about`). |
| I18N-RF-03 | Must | A raiz `/` redireciona (307) para `/pt-BR` quando o cookie `NEXT_LOCALE` é `pt-BR` ou, sem o cookie, quando `Accept-Language` prefere o português; nos demais casos vai para `/en`. O cookie vence o cabeçalho. |
| I18N-RF-04 | Must | `<html lang>` é igual ao idioma da página. Trechos em outro idioma dentro da página (o currículo em inglês na versão pt-BR) recebem `lang="en"`. |
| I18N-RF-05 | Must | O seletor de idioma mostra os dois idiomas, marca o ativo com `aria-current`, leva à página equivalente (inclusive com slug dinâmico) e faz a escolha valer nas próximas visitas pelo cookie `NEXT_LOCALE` (gravado quando o idioma escolhido difere do detectado, seção 7.3). |
| I18N-RF-06 | Must | Cada página tem, em cada idioma, título e descrição próprios e traduzidos, `canonical` para si mesma, `hreflang` `en`, `pt-BR` e `x-default` (este apontando para a versão `en`), `og:locale` do idioma e nenhum `noindex`. Os `hreflang` são recíprocos: a alternativa pt-BR de uma página `en` é o `canonical` da página pt-BR correspondente, e vice-versa. |
| I18N-RF-07 | Must | O `hreflang` tem uma única fonte, o HTML. As respostas não trazem cabeçalho HTTP `Link` com `rel="alternate"` e `hreflang`. |
| I18N-RF-08 | Should | Cada página declara `og:locale:alternate` com o outro idioma (`pt_BR` nas páginas `en` e `en_US` nas páginas pt-BR). |
| I18N-RF-09 | Must | Os dois arquivos de conteúdo têm as mesmas chaves (já garantido no typecheck) e nenhum texto é igual nos dois idiomas, salvo os da lista de exceções da seção 7.4. Um texto novo igual ao inglês faz o teste falhar. |
| I18N-RF-10 | Must | Uma página não mistura idiomas: o texto visível das páginas pt-BR não contém palavras funcionais do inglês (`the`, `and`, `with`, `for`) e o das páginas `en` não contém as do português (`de`, `para`, `com`, `uma`, `não`), fora nomes próprios, tecnologias e a lista da seção 7.4. |
| I18N-RF-11 | Must | Datas e meses saem de `Intl` no idioma da página, sem nomes de mês escritos no conteúdo ("May 2023" em en e "mai. 2023" em pt-BR). |
| I18N-RF-12 | Must | A 404 é localizada: qualquer rota inexistente sob um idioma válido, e qualquer `notFound()` (slug inexistente de projeto ou de experimento), responde 404 com a identidade do site (cabeçalho, skip link, rodapé), `<html lang>` do idioma, um `h1`, um texto curto, um link para a Home do mesmo idioma e `noindex`. O seletor de idioma da 404 leva à lista da seção no outro idioma quando a 404 vem de um slug inexistente de projeto ou de experimento, e à Home dele nos demais casos. |
| I18N-RF-13 | Must | Um caminho sem idioma válido (`/nao-existe`, `/fr/about`) é redirecionado para o idioma detectado e cai na 404 localizada desse idioma. |
| I18N-RF-14 | Must | As exceções da seção 7.4 estão documentadas e cada uma tem teste ou verificação: currículo só em inglês, slug `/ai-lab` igual nos dois idiomas e a lista de nomes próprios. |

## 5. Requisitos não funcionais

| ID | Categoria | Requisito |
|---|---|---|
| I18N-RNF-01 | Manutenibilidade | Textos só em `src/content/<idioma>/common.json`, sem condicionais por idioma nos componentes e sem componentes duplicados por idioma (`DEVELOPMENT.md`, 8). Acrescentar um idioma exige apenas a configuração de rotas, a pasta de conteúdo e o registro nos metadados. |
| I18N-RNF-02 | Privacidade | O único cookie do site é `NEXT_LOCALE` (preferência de idioma, `SameSite=Lax`, sem dado pessoal). Nenhum cookie de terceiros. |
| I18N-RNF-03 | Desempenho | O provedor de mensagens continua enviando ao navegador só `navigation` e `languageSwitcher`; a 404 é estática e não acrescenta JavaScript de cliente além do seletor de idioma. |
| I18N-RNF-04 | Acessibilidade | A 404 tem um único `h1`, link com nome claro, foco visível e contraste AA, e o seletor de idioma mantém os atributos `lang` e `hrefLang` de cada opção. |
| I18N-RNF-05 | SEO | A 404 devolve status 404 (não 200), e as páginas indexáveis não declaram `noindex`. |
| I18N-RNF-06 | Consistência visual | A 404 usa o layout, os tokens e a tipografia do site (Dark Premium), sem ilustração nem elemento decorativo. |

## 6. Interface e experiência

A única interface nova é a **página 404** (I18N-RF-12). Ela segue o padrão editorial das demais páginas:

- Dentro do layout do idioma: skip link, cabeçalho com o menu e o seletor de idioma, conteúdo e rodapé.
- Conteúdo: `h1` ("Page not found" / "Página não encontrada"), um parágrafo curto e o link de texto para a Home. Sem cards, sem botão de destaque e sem código de erro decorativo.
- O seletor de idioma da 404 não pode levar à mesma URL, que também seria uma 404: leva à lista da seção no outro idioma quando o slug de projeto ou de experimento não existe, e à Home dele quando o caminho não tem rota.

### 6.1. Estados

| Situação | Comportamento esperado |
|---|---|
| Rota inexistente em um idioma válido (`/pt-BR/nao-existe`) | 404 localizada em pt-BR, com layout. |
| Slug inexistente em rota dinâmica (`/en/ai-lab/zzz`) | 404 localizada em en, com layout. |
| Caminho sem idioma (`/nao-existe`) | Redireciona para o idioma detectado e mostra a 404 desse idioma. |
| Idioma inexistente (`/fr/about`) | Redireciona para `/en/fr/about` e mostra a 404 em en. |
| Navegador em português, sem cookie, na raiz | Redireciona para `/pt-BR`. |
| Cookie `NEXT_LOCALE=en` com navegador em português, na raiz | Redireciona para `/en`. |
| JavaScript desabilitado | A 404 e o conteúdo continuam legíveis; o seletor de idioma funciona como link. |

## 7. Conteúdo e dados

### 7.1. Rotas

| Página | `en` | `pt-BR` |
|---|---|---|
| Home | `/en` | `/pt-BR` |
| About | `/en/about` | `/pt-BR/sobre` |
| Experience | `/en/experience` | `/pt-BR/experiencia` |
| Projects | `/en/projects` | `/pt-BR/projetos` |
| Projects, detalhe | `/en/projects/<slug>` | `/pt-BR/projetos/<slug>` |
| Technologies | `/en/technologies` | `/pt-BR/tecnologias` |
| AI Lab | `/en/ai-lab` | `/pt-BR/ai-lab` |
| AI Lab, detalhe | `/en/ai-lab/<slug>` | `/pt-BR/ai-lab/<slug>` |
| Contact | `/en/contact` | `/pt-BR/contato` |

São treze URLs por idioma: Home, About, Experience, Projects, dois detalhes de projeto (`football-stat-analytics` e `reelix`), Technologies, AI Lab, quatro detalhes de experimento (`rag-grounding`, `output-validation`, `score-consistency` e `analyst-personas`) e Contact.

### 7.2. Textos da 404 (rascunho para aprovação)

| Elemento | en | pt-BR |
|---|---|---|
| `h1` | Page not found | Página não encontrada |
| Parágrafo | The page you are looking for does not exist or has moved. | A página que você procura não existe ou mudou de endereço. |
| Link | Back to home | Voltar para o início |
| Título | Page not found \| Bruno Lucildo | Página não encontrada \| Bruno Lucildo |

### 7.3. Comportamento da raiz e do cookie (documentação do que existe)

- Ordem de decisão em `/`: 1) cookie `NEXT_LOCALE` com um idioma válido; 2) `Accept-Language` (o primeiro idioma suportado); 3) `en`.
- O redirecionamento é 307 (temporário): a raiz não é uma página indexável; as páginas de cada idioma são.
- O cookie `NEXT_LOCALE` é gravado pelo `next-intl` quando o idioma da URL difere do que seria detectado (pelo cookie anterior ou por `Accept-Language`), o que inclui o uso do seletor. Se o idioma da URL já é o detectado, nada é gravado. É funcional, de sessão, `SameSite=Lax`, sem dado pessoal.
- O `x-default` do `hreflang` aponta para a versão `en` da página.

### 7.4. Exceções documentadas

| Exceção | Motivo | Verificação |
|---|---|---|
| Currículo em PDF só em inglês | Não há versão em português (SPEC-009) | Rótulo "(EN)" e `lang="en"` no link em pt-BR (menu e Contact) |
| Slug `/ai-lab` igual nos dois idiomas | "AI Lab" é um nome próprio | Mapa de rotas e teste de URLs |
| Textos iguais nos dois idiomas (20) | Nomes próprios, marcas e termos técnicos | Lista explícita no teste (abaixo) |

Textos permitidos como iguais nos dois idiomas (por chave): `metadata.title`, `navigation.items.aiLab`, `languageSwitcher.options.en`, `languageSwitcher.options.pt-BR`, `about.education.items.undergraduate.period`, `about.education.items.postgraduate.institution`, `projects.items.football.name`, `projects.items.reelix.name`, `projects.items.fintalab.name`, `projects.detail.sections.links`, `projects.detail.football.metadata.title`, `projects.detail.reelix.metadata.title`, `technologies.categories.backend`, `aiLab.metadata.title`, `aiLab.title`, `aiLab.experiments.analyticsPersonas.name`, `contact.channels.email.title`, `contact.channels.linkedin.title`, `contact.channels.github.title` e `home.aiLab.title`.

## 8. Critérios de aceitação

| ID | Critério (Given / When / Then) |
|---|---|
| I18N-CA-01 | **Given** as treze rotas da seção 7.1, **when** cada uma é aberta nos dois idiomas, **then** responde 200 com `<html lang>` igual ao idioma, e `/pt-BR/about` e `/en/sobre` redirecionam para `/pt-BR/sobre` e `/en/about`. |
| I18N-CA-02 | **Given** a raiz `/`, **when** é aberta com `Accept-Language: pt-BR` e sem cookie, **then** redireciona para `/pt-BR`; com `Accept-Language: fr` ou sem o cabeçalho, para `/en`; com o cookie `NEXT_LOCALE=en` e `Accept-Language: pt-BR`, para `/en`. |
| I18N-CA-03 | **Given** qualquer página, **when** o seletor de idioma é usado, **then** abre a página equivalente no outro idioma (inclusive `/projects/<slug>` e `/ai-lab/<slug>`); e, partindo de um navegador em inglês, escolher pt-BR grava `NEXT_LOCALE=pt-BR` e a raiz `/` passa a levar a `/pt-BR`. |
| I18N-CA-04 | **Given** as treze rotas nos dois idiomas, **when** os metadados são lidos, **then** título e descrição são únicos entre as páginas do mesmo idioma, o `canonical` é a própria URL, `hreflang` `en`, `pt-BR` e `x-default` existem, o `x-default` aponta para `en`, os pares são recíprocos, `og:locale` é o do idioma e não há `noindex`. |
| I18N-CA-05 | **Given** uma resposta HTML de qualquer página, **when** os cabeçalhos são lidos, **then** não há cabeçalho `Link` com `hreflang`. |
| I18N-CA-06 | **Given** cada página, **when** o `head` é lido, **then** `og:locale:alternate` é `pt_BR` nas páginas `en` e `en_US` nas páginas pt-BR. (Should) |
| I18N-CA-07 | **Given** os dois `common.json`, **when** o teste compara as folhas, **then** os textos idênticos são exatamente os da lista da seção 7.4, e um texto novo idêntico faz o teste falhar. |
| I18N-CA-08 | **Given** o texto visível das treze páginas, **when** é lido, **then** as páginas pt-BR não têm palavras funcionais do inglês e as `en` não têm as do português (fora a lista de exceções), e a página Experience mostra "May 2023" em en e "mai. 2023" em pt-BR. |
| I18N-CA-09 | **Given** `/pt-BR/nao-existe`, `/en/nao-existe`, `/en/ai-lab/zzz` e `/pt-BR/projetos/zzz`, **when** são abertas, **then** respondem 404 com cabeçalho, skip link e rodapé, `<html lang>` do idioma, um `h1` com o texto da seção 7.2, o link para a Home do mesmo idioma e `noindex`. |
| I18N-CA-10 | **Given** a 404, **when** o seletor de idioma é usado, **then** abre a Home do outro idioma (caminho sem rota) ou a lista da seção no outro idioma (slug inexistente em `/projects/<slug>` ou `/ai-lab/<slug>`). |
| I18N-CA-11 | **Given** `/nao-existe` e `/fr/about`, **when** são abertas, **then** terminam na 404 localizada do idioma detectado (`/en/...` ou `/pt-BR/...`). |
| I18N-CA-12 | **Given** a navegação por todas as páginas, **when** os cookies são lidos, **then** o único cookie é `NEXT_LOCALE`. |
| I18N-CA-13 | **Given** o repositório, **when** `pnpm typecheck` e `pnpm test:e2e` rodam, **then** passam, e `e2e/i18n.spec.ts` cobre os critérios acima. |

## 9. Dependências

- `src/i18n/` (`routing.ts`, `request.ts`, `locale.ts`, `navigation.ts`) e `src/proxy.ts` (middleware do `next-intl`).
- `src/app/[locale]/layout.tsx` (idioma, provedor de mensagens, cabeçalho e rodapé) e `src/lib/seo/metadata.ts` (metadados por idioma).
- `src/components/layout/LanguageSwitcher.tsx` e `src/content/{en,pt-BR}/common.json`.
- SPECs 001 a 007 (conteúdo e metadados já nos dois idiomas) e `e2e/` existentes, que seguem passando.
- `NEXT_PUBLIC_SITE_URL` para URLs absolutas em produção (hospedagem ainda sem decisão).

## 10. Riscos

| Risco | Impacto | Mitigação |
|---|---|---|
| Sem `NEXT_PUBLIC_SITE_URL`, `canonical`, `hreflang` e Open Graph apontam para `localhost`. | SEO errado em produção | Já registrado como pendência de infraestrutura; definir a variável antes da publicação. |
| Redirecionamento por `Accept-Language` levar um visitante ao idioma que ele não quer. | Frustração | O seletor de idioma está em toda página e grava a escolha no cookie. |
| O teste de mistura de idiomas (palavras funcionais) dar falso positivo com um nome próprio ou termo técnico. | Teste instável | Lista explícita de exceções e palavras escolhidas por não colidirem com nomes de tecnologia. |
| A 404 em rota dinâmica com `dynamicParams = false` não usar o layout do idioma. | 404 sem identidade | Critérios I18N-CA-09 cobrem `/en/ai-lab/zzz` e `/pt-BR/projetos/zzz`. |
| `experimental.globalNotFound` (recurso experimental do Next) mudar ou sair em uma atualização. | A 404 volta ao shell vazio ou o build quebra | Versão do Next fixada no lockfile; os testes de 404 (status, `lang`, `h1`, título, `noindex`, sem JavaScript) falham se o comportamento mudar; revisar a cada atualização do Next. |
| Remover o cabeçalho `Link` e o Google deixar de ler o `hreflang`. | Idiomas sem associação | O HTML já traz os `hreflang` e é a fonte recomendada; I18N-CA-04 garante a reciprocidade. |

## 11. Perguntas abertas

| ID | Pergunta | Bloqueia? | Default adotado se não houver resposta |
|---|---|---|---|
| Q1 | Os textos da 404 (seção 7.2) podem ser publicados? | Resolvida em 2026-11-08: aprovados pelo Bruno | Nenhum: implementação só depois da aprovação. |
| Q2 | Aceita `og:locale:alternate` (Should) nas páginas? | Não | Sim. |
| Q3 | O currículo em português entra com a SPEC-009 ou o PDF só em inglês é definitivo? | Não | Segue só em inglês, como exceção documentada. |

## 12. Premissas

1. A detecção do idioma na raiz fica como está (decisão do Bruno) e o redirecionamento continua 307.
2. O `x-default` aponta para a versão `en` de cada página.
3. Caminhos sem idioma válido continuam sendo redirecionados pelo `next-intl` para o idioma detectado, e a 404 desse idioma é a resposta final.
4. A lista de 20 textos idênticos da seção 7.4 reflete o conteúdo de `main` em `5be8138`; textos novos entram na lista só com justificativa.
5. As palavras funcionais do teste de mistura de idiomas são uma heurística, não uma revisão de tradução (`ARCHITECTURE.md` e `CONTENT.md` pedem revisão humana das traduções).
6. Não há banner de cookies nesta etapa, porque o único cookie é funcional; a decisão volta a ser revista quando houver analytics.

## 13. Decisões registradas

| Data | Decisão | Quem |
|---|---|---|
| 2026-11-08 | Manter a detecção do idioma pelo navegador na raiz (cookie e `Accept-Language`). | Bruno |
| 2026-11-08 | Incluir nesta SPEC uma página 404 localizada, com a identidade do site. | Bruno |
| 2026-11-08 | Textos da 404 aprovados e implementação autorizada (Q1). Q2 e Q3 seguem como premissas reversíveis (`og:locale:alternate` incluído; currículo só em inglês). | Bruno |

## Refinamento

- 2026-11-08, v0.2.0: textos da 404 aprovados (Q1) e SPEC implementada; a seção 15 registra a entrega, as divergências (404 por `global-not-found` e destino do seletor na 404) e a verificação.
- 2026-11-08, v0.1.0: SPEC criada a partir do rascunho de `FEATURES.md` (Draft v0.1), do `ARCHITECTURE.md` (7), do `SEO.md` (6), do `CONTENT.md` (3), do `DEVELOPMENT.md` (8) e do `QA.md`, com uma auditoria do código e do comportamento real do servidor (redirecionamentos, 404, cabeçalhos e cookies). Duas decisões do Bruno registradas na seção 13; os textos da 404 aguardam a aprovação (Q1).

## 15. Implementação e verificação

Implementada na branch `feat/i18n` em 2026-11-08, depois da aprovação dos textos da 404 (Q1).

- Novos: `src/app/global-not-found.tsx` (404 de todo o site), `src/app/fonts.ts` (fontes, compartilhadas), `src/components/layout/SiteShell.tsx` (`html`, cabeçalho, conteúdo e rodapé, usado pelo layout do idioma e pela 404), `src/components/layout/NotFoundContent.tsx` e `e2e/i18n.spec.ts`.
- Alterados: `next.config.ts` (`experimental.globalNotFound`), `src/app/[locale]/layout.tsx` (passa a usar o `SiteShell`), `src/i18n/routing.ts` (`alternateLinks: false`), `src/lib/seo/metadata.ts` (função `openGraphLocales`, com `og:locale:alternate`), `src/app/[locale]/page.tsx` (a Home usa a mesma função), `src/components/layout/LanguageSwitcher.tsx` (destino na 404), `src/content/{en,pt-BR}/common.json` (bloco `notFound`) e `README.md`.

Decisões de implementação:

- **A 404 usa `global-not-found`, e não `[locale]/not-found.tsx` com rota catch-all** (o plano da seção 3.1). Com o layout raiz em um segmento dinâmico (`app/[locale]/layout.tsx`), o Next 16 respondia 404 com um shell vazio (`<html id="__next_error__">`, sem `lang`, sem `h1` e com o título padrão) e só montava a página no cliente. Isso valia até para um componente estático e persistiu com uma camada raiz que repassa os filhos e sem o `revalidate` do layout. A documentação do Next indica `global-not-found` para esse caso. O idioma vem da requisição (middleware do `next-intl`), então cada 404 sai renderizada no servidor, com o `lang`, o título e o `h1` do idioma.
- `SiteShell` e `fonts.ts` existem para que o layout e a 404 tenham exatamente o mesmo documento (mesmas fontes, skip link, cabeçalho e rodapé).
- O destino do seletor na 404 (I18N-RF-12 e I18N-CA-10) foi detalhado: um caminho sem rota leva à Home do outro idioma e um slug inexistente de projeto ou de experimento leva à lista da seção no outro idioma. A primeira versão da SPEC dizia "Home" nos dois casos; a lista da seção preserva mais o contexto.
- O teste de mistura de idiomas ignora endereços de e-mail e URLs (`.com` não é a palavra "com") e usa `innerText` de propósito, para manter o espaço entre os elementos.

Divergências em relação à SPEC:

- O plano de usar `[locale]/not-found.tsx` e `[locale]/[...rest]` foi trocado por `global-not-found` (acima); o requisito I18N-RF-12 foi atendido sem mudança de comportamento.
- I18N-RF-12 e I18N-CA-10 mudaram de texto (destino do seletor), conforme acima.

| Critério | Resultado | Evidência |
|---|---|---|
| I18N-CA-01 | Atendido | As treze rotas respondem 200 com `lang` correto nos dois idiomas; `/pt-BR/about`, `/en/sobre`, `/EN/about`, `/pt-br/sobre` e a barra final redirecionam para a URL equivalente. |
| I18N-CA-02 | Atendido | A raiz responde 307 para `/pt-BR` (navegador em português) e `/en` (francês, inglês ou sem cabeçalho), e o cookie vence o cabeçalho nos dois sentidos. |
| I18N-CA-03 | Atendido | O seletor troca e volta em todas as treze rotas (inclusive com slug) e, partindo de um navegador em inglês, escolher pt-BR grava `NEXT_LOCALE=pt-BR` e a raiz passa a levar a `/pt-BR`. |
| I18N-CA-04 | Atendido | Título e descrição únicos entre as páginas de cada idioma, `canonical` próprio, `hreflang` `en`, `pt-BR` e `x-default` recíprocos (o `x-default` aponta para `en`), `og:locale` do idioma e nenhum `noindex`. |
| I18N-CA-05 | Atendido | Nenhuma das 26 respostas traz cabeçalho `Link` com `hreflang`. Mutação (`alternateLinks: true`) derruba o teste. |
| I18N-CA-06 | Atendido | `og:locale:alternate` é o do outro idioma nas 26 páginas. |
| I18N-CA-07 | Atendido | Os 20 textos iguais são exatamente a lista da seção 7.4. Mutação (texto da 404 em inglês no pt-BR) derruba o teste. |
| I18N-CA-08 | Atendido | As 26 páginas passam na busca de palavras do outro idioma; "May 2023" em en e "mai. 2023" em pt-BR. |
| I18N-CA-09 | Atendido | Seis URLs de 404 (rotas inexistentes e slugs inexistentes, nos dois idiomas) respondem 404 com skip link, cabeçalho, rodapé, `lang`, título, `h1`, link para a Home e `noindex`. Mutação (`lang` fixo em `en`) derruba os testes em pt-BR. |
| I18N-CA-10 | Atendido | O seletor leva à Home do outro idioma (caminho sem rota) ou à lista da seção (slug inexistente), nas seis URLs. |
| I18N-CA-11 | Atendido | `/nao-existe` e `/fr/about` terminam em `/en/...` ou em `/pt-BR/...` conforme o navegador, com a 404 localizada. |
| I18N-CA-12 | Atendido | Depois de navegar por todas as páginas nos dois idiomas, o único cookie é `NEXT_LOCALE`. |
| I18N-CA-13 | Atendido | `pnpm typecheck` sem erros; `pnpm test:e2e` com 575 testes passando (125 novos). |

Verificação adicional:

- Mutação: três defeitos introduzidos de propósito (cabeçalho `Link` de volta, texto em inglês no pt-BR e `lang` fixo na 404) derrubaram oito testes; os arquivos foram restaurados e a suíte voltou a passar.
- Navegador: 404 conferida em 1440 px, em pt-BR (`/pt-BR/nao-existe`) e em en (`/en/ai-lab/zzz`).
- `pnpm check` passa nos arquivos novos e alterados; na árvore inteira falha só nos arquivos que não foram tocados, por causa do CRLF do checkout no Windows (problema já conhecido).

Não verificado: a 404 no modo de desenvolvimento (`next dev`), que precisa ser reiniciado para ler o novo `next.config.ts`; o contraste com ferramenta; LCP e CLS. Observação fora do escopo: o navegador pede `/favicon.ico`, que cai em `[locale]` e responde 404; o site não tem favicon, e isso fica para a etapa de SEO.
