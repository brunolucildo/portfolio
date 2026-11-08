# SPEC-011 — Photography and Visual Assets

## 1. Identificação

| Campo | Valor |
|---|---|
| Nome | Photography and Visual Assets |
| Identificador | SPEC-011 |
| Slug | `011-visual-assets` |
| Versão | 0.2.0 |
| Status | Done em 2026-11-08, por decisão do Bruno; os itens não verificados seguem para o QA final (antes: In Review, textos aprovados e implementada em 2026-11-08; aguardando a revisão do usuário e do PR) |
| Data | 2026-11-08 |
| Origem | SPEC-011 de `.specs/FEATURES.md` (v0.1, Draft) |

Prioridades usadas: **Must** (obrigatório para a v1), **Should** (desejável; pode ser adiada sem bloquear a entrega).

## 2. Contexto

As imagens do site foram entrando junto com cada página: a fotografia do Hero (SPEC-001), as telas do Reelix e do FintaLab (SPEC-004) e os ícones de tecnologias (SPEC-005). Todas estão aprovadas e funcionam, mas nunca houve uma SPEC que as reunisse, e três das cinco linhas do escopo original ainda não existem: **ícone do site, imagem de compartilhamento e verificação de direitos de uso**. Esta SPEC formaliza o inventário, registra a auditoria de 2026-11-08 em um build de produção e fecha as lacunas.

**Objetivo:** usar elementos visuais autênticos e relevantes, otimizados e com direitos verificados, sem comprometer o estilo Dark Premium (`DESIGN.md`, 9; `SEO.md`, 9; `ARCHITECTURE.md`, 10.1).

**Posicionamento:** nenhuma imagem genérica de banco de imagens, nenhum elemento de disponibilidade profissional. A fotografia pessoal é a do Bruno, sem substituta.

## 3. Escopo

### 3.1. Dentro do escopo

1. Formalizar e proteger com testes o que existe: fotografia do Hero, telas dos projetos e ícones de tecnologias (inventário, peso, formato, `alt`, carregamento e direitos).
2. Criar o **ícone do site**: monograma "BL", com favicon, ícone de iPhone e ícone grande.
3. Criar a **imagem de compartilhamento** (`og:image`), um cartão tipográfico por idioma, e ligá-la ao metadado de todas as páginas.
4. Ajustar a legenda do Reelix à redação dos termos do TMDB, nos dois idiomas.
5. Registrar a origem e os direitos de cada grupo de imagens em `public/images/CREDITS.md`.
6. Atualizar os trechos desatualizados de `BUSINESS.md`, `CONTENT.md` e `DESIGN.md` sobre a fotografia (decisão tomada, documentos ainda dizem "em aberto").
7. Criar `e2e/assets.spec.ts` e ajustar os testes que citam a legenda do Reelix.

### 3.2. Fora do escopo

- Trocar, recortar ou retratar de novo a fotografia: o tratamento e o `alt` estão aprovados (SPEC-001).
- Fotografia também no About (a decisão do projeto é Hero; o About segue sem imagem).
- Imagem de compartilhamento diferente por página, com foto ou com o título da página (decisão do Bruno: um cartão por idioma).
- Logotipo do TMDB na página do Reelix (decisão do Bruno); logotipos de empresas ou de clientes.
- Ilustrações, animações e vídeos.
- `robots.txt`, `sitemap.xml`, dados estruturados e `NEXT_PUBLIC_SITE_URL` (SEO final, ainda sem SPEC).
- Escolha de hospedagem e de CDN; o otimizador de imagens depende dela (seção 10).
- Novas capturas dos projetos; as nove telas do Reelix e as seis do FintaLab já foram aprovadas.

## 4. Requisitos funcionais

| ID | Prioridade | Situação | Requisito |
|---|---|---|---|
| VIS-RF-01 | Must | Existe | Toda imagem de `public/images/` é usada pelo código, e toda imagem que o código referencia existe. Não há arquivo órfão nem referência quebrada. As exceções são os arquivos de licença (`LICENSE-devicon.txt`, `LICENSES.md`) e o `CREDITS.md`. |
| VIS-RF-02 | Must | Existe | A fotografia do Hero é `public/images/hero/bruno-lucildo-portrait.png` (574 × 811 px), com o tratamento aprovado (saturação reduzida e esmaecimento na base), `alt` nos dois idiomas e `priority`. A fotografia fica no Hero, à direita no desktop; o About não tem foto. |
| VIS-RF-03 | Must | Existe | Toda `img` das páginas tem `alt` não vazio (retirado do conteúdo, nos dois idiomas), `width` e `height` declarados e `sizes`. Os ícones de tecnologias são decorativos (máscara CSS, sem `alt`). |
| VIS-RF-04 | Must | Existe | Só a fotografia do Hero carrega com prioridade; as demais imagens carregam sob demanda (`loading="lazy"`). |
| VIS-RF-05 | Must | Existe | O servidor entrega as imagens em formato moderno (WebP, pelo otimizador do Next) e em tamanho próximo ao exibido. |
| VIS-RF-06 | Must | Muda | O peso dos arquivos de origem respeita limites: fotografia do Hero até 600 KB, cada tela de projeto até 300 KB e cada SVG de tecnologia até 15 KB. Hoje: 495 KB, 236 KB e 11 KB. |
| VIS-RF-07 | Must | Muda | Nenhuma imagem versionada traz metadados embutidos (EXIF, XMP, comentários, `tEXt`/`iTXt`, localização). Hoje nenhuma traz; um teste protege contra uma imagem nova que traga. |
| VIS-RF-08 | Must | Muda | O site tem **ícone**: monograma "BL" em verde-limão (`primary`) sobre o fundo escuro (`background`), com `<link rel="icon">` em todas as páginas, inclusive a 404; `/favicon.ico` responde 200 com uma imagem; ícone de 180 × 180 px para iPhone (`apple-touch-icon`) e ícone de 512 × 512 px declarados. |
| VIS-RF-09 | Must | Muda | Cada idioma tem uma **imagem de compartilhamento** de 1200 × 630 px (PNG), gerada por código, em `/en/opengraph-image` e `/pt-BR/opengraph-image`, com o nome, a linha de posicionamento e o título do Hero (textos já aprovados na Home), sobre o fundo escuro com um detalhe verde-limão, sem fotografia. |
| VIS-RF-10 | Must | Muda | Toda página indexável tem `og:image` (URL absoluta da imagem do idioma), `og:image:width`, `og:image:height`, `og:image:alt`, `twitter:card` com `summary_large_image` e `twitter:image`. A 404 não tem. |
| VIS-RF-11 | Must | Muda | A legenda do Reelix usa a redação dos termos do TMDB nos dois idiomas (seção 7.3). Não há logotipo do TMDB na página, e o ícone da página Technologies não muda. |
| VIS-RF-12 | Must | Muda | `public/images/CREDITS.md` registra, por grupo de imagens, a origem, o autor, a licença ou autorização e a data: fotografia, telas do Reelix, telas do FintaLab, ícones de tecnologias e o ícone e a imagem de compartilhamento. Os arquivos de licença dos ícones continuam em `technologies/`. |
| VIS-RF-13 | Must | Muda | `BUSINESS.md` (pergunta da fotografia), `CONTENT.md` (item "Definir utilização da fotografia") e `DESIGN.md` (seção 9) passam a dizer que a fotografia foi decidida: no Hero, com o tratamento aprovado. |
| VIS-RF-14 | Must | Muda | `e2e/assets.spec.ts` cobre os critérios da seção 8 e passa junto com o restante da suíte. |

## 5. Requisitos não funcionais

| ID | Categoria | Requisito |
|---|---|---|
| VIS-RNF-01 | Desempenho | A fotografia do Hero é o elemento do LCP da Home e carrega com `priority`. Com `width` e `height` declarados, nenhuma imagem causa deslocamento de layout. Sem dependência nova: ícones e cartão usam `next/og` (já incluso no Next). Medido em um servidor local: a Home transfere cerca de 18 KB de imagem. |
| VIS-RNF-02 | Acessibilidade | `alt` descreve a imagem sem repetir o texto ao lado; imagens decorativas têm `alt` vazio ou são máscaras CSS. O monograma tem contraste de 14,90:1 (primary sobre o fundo), acima de AA. |
| VIS-RNF-03 | Consistência visual | Dark Premium: o ícone e o cartão usam os tokens do site (`background`, `foreground`, `primary`), sem gradiente decorativo, sem neon e sem elemento gráfico além do texto e de um filete. A tipografia do cartão é a fonte sem serifa do sistema de geração de imagens; se a fonte do site for carregada, melhor (premissa 4). |
| VIS-RNF-04 | SEO | Nomes de arquivo descritivos, imagens com `alt`, `og:image` por idioma e `twitter:card` grande (`SEO.md`, 9). O cartão é legível em miniatura (texto principal com pelo menos 64 px). |
| VIS-RNF-05 | Privacidade | Sem metadados nas imagens (VIS-RF-07). As telas dos projetos só mostram dados de teste, fictícios ou públicos; nenhuma tela mostra e-mail, token, nome de outra pessoa ou dado pessoal real (verificação por leitura, seção 7.2). |
| VIS-RNF-06 | Manutenibilidade | Fotografia, telas e ícones ficam em `src/config/site.ts`, `src/config/projects.ts` e `src/config/technologies.ts`. O cartão e o ícone leem os textos e as cores da mesma fonte que o site, para não divergirem. |
| VIS-RNF-07 | Movimento | Nenhuma animação nova; o cartão e o ícone são estáticos. |

## 6. Interface e experiência

### 6.1. Ícone do site

- Quadrado, fundo `background`, as letras **B** e **L** em `primary`, em negrito, centralizadas e com margem de cerca de 18% (o desenho continua legível em 16 px).
- Formatos: ícone de aba (32 px, e `/favicon.ico`), ícone de iPhone (180 px, sem cantos arredondados: o sistema arredonda) e ícone grande (512 px).

### 6.2. Imagem de compartilhamento (1200 × 630 px)

| Elemento | Posição e estilo |
|---|---|
| Fundo | `background`, liso. |
| Filete | Linha curta em `primary`, acima do nome, à esquerda. |
| Nome | "Bruno Lucildo", `foreground`, 72 px ou mais, à esquerda. |
| Posicionamento | "Senior Backend Developer \| Technical Lead" (pt-BR: "Desenvolvedor Backend Sênior \| Líder Técnico"), `muted`, abaixo do nome. |
| Título | "Engineering beyond code." (pt-BR: "Engenharia além do código."), `foreground`, abaixo, em corpo menor que o nome. |
| Margens | 80 px; nada dentro de 40 px das bordas, para o corte dos aplicativos. |

Sem fotografia, sem logotipo, sem URL.

### 6.3. Estados

| Situação | Comportamento esperado |
|---|---|
| Fotografia removida | A Home omite a foto e o Hero se reorganiza (comportamento atual, README). |
| Link compartilhado em en | Cartão em inglês, com o título e a descrição da própria página. |
| Link compartilhado em pt-BR | Cartão em português, com o título e a descrição da página. |
| 404 | Sem `og:image`; com o ícone do site. |
| `NEXT_PUBLIC_SITE_URL` ausente | `og:image` aponta para `http://localhost:3000` (limitação conhecida, igual ao canonical). |
| Navegador pede `/favicon.ico` sem ler o HTML | Recebe a imagem do ícone. |
| `prefers-reduced-motion` | Sem diferença: não há movimento. |

## 7. Conteúdo e dados

### 7.1. Inventário e direitos (conferido em 2026-11-08)

| Grupo | Arquivos | Origem e direitos | Peso | Situação |
|---|---|---|---|---|
| Fotografia do Hero | `hero/bruno-lucildo-portrait.png` | Retrato do próprio Bruno, versionado por decisão dele (2026-11-07). Uso autorizado por ele | 495 KB, 574 × 811 | Aprovada |
| Telas do Reelix (9) | `projects/reelix-*.png/jpg` | Capturas do app do Bruno (2026-11-07); pôsteres e dados de filmes vêm do TMDB | 76 a 236 KB, 830 a 860 × 1340 a 1800 | Aprovadas; legenda a ajustar (VIS-RF-11) |
| Telas do FintaLab (3 × 2 idiomas) | `projects/fintalab-*.png` | Protótipo estático do Bruno, com pessoas, clubes e números fictícios | 124 a 172 KB, 2160 × 1350 | Aprovadas |
| Ícones de tecnologias (17) | `technologies/*.svg` | devicon 2.18.0 (MIT) e Simple Icons (CC0); `LICENSES.md` e `LICENSE-devicon.txt` | 0,3 a 11 KB, total 42 KB | Aprovados (SPEC-005) |
| Ícone do site | gerado por código | Autoria do projeto (monograma tipográfico) | n/a | A criar |
| Imagem de compartilhamento | gerada por código | Autoria do projeto (texto e tokens do site) | n/a | A criar |

### 7.2. Auditoria (2026-11-08)

Feita em um build de produção, com Playwright (Chromium), em nove páginas, a 1440 e a 375 px.

| Item | Resultado | Situação |
|---|---|---|
| `alt` das imagens | Todas as `img` têm `alt` não vazio | Conforme |
| `width` e `height` | Declarados em todas | Conforme |
| Carregamento | Só a fotografia do Hero é prioritária; as demais, sob demanda | Conforme |
| Formato servido | WebP em todas as imagens de raster | Conforme |
| Tamanho servido | Nenhuma imagem com mais de 1,3 vez o tamanho exibido | Conforme |
| Peso na Home | Cerca de 18 KB de imagem; o LCP é a fotografia | Conforme (servidor local, indicativo) |
| Peso em `/projects/reelix` | 96 KB a 1440 px e 309 KB a 375 px (DPR 2), nove telas | Conforme |
| Metadados embutidos | Nenhuma imagem tem EXIF, XMP, comentário ou texto embutido | Conforme |
| Arquivos órfãos | Os 33 arquivos de imagem de `public/images/` (1 fotografia, 15 telas e 17 SVG) são usados | Conforme |
| Favicon e ícones de app | `/favicon.ico`, `/icon.png` e `/apple-touch-icon.png` respondem 404; nenhuma página tem `<link rel="icon">` | **Lacuna** (VIS-RF-08) |
| `og:image` e `twitter:card` | Ausentes em todas as páginas | **Lacuna** (VIS-RF-09 e 10) |
| Legenda do TMDB | Usa uma versão curta; os termos pedem a frase completa | **Lacuna** (VIS-RF-11) |
| Origem e direitos | Documentados só para os ícones de tecnologias | **Lacuna** (VIS-RF-12) |
| Documentos | `BUSINESS.md`, `CONTENT.md` e `DESIGN.md` ainda dizem que a fotografia está em aberto | **Lacuna** (VIS-RF-13) |
| Testes de imagens | Só indiretos, nas specs de cada página | **Lacuna** (VIS-RF-14) |
| Otimizador do Next | Funciona no servidor de produção do Next; depende da hospedagem | Risco (seção 10) |

Fontes sobre o TMDB: [Termos de uso da API](https://www.themoviedb.org/api-terms-of-use), [FAQ da API](https://developer.themoviedb.org/docs/faq) e [Logos e atribuição](https://www.themoviedb.org/about/logos-attribution).

### 7.3. Textos novos (rascunho para aprovação)

Só a legenda do Reelix tem texto novo. O cartão reutiliza o nome, o posicionamento e o título do Hero (já aprovados), e o ícone não tem texto além das letras.

| Elemento | en | pt-BR |
|---|---|---|
| Legenda do Reelix (`projects.captions.reelix`) | Screens from the development build. The app interface is in Portuguese. Movie and series data and images from TMDB. This product uses TMDB and the TMDB APIs but is not endorsed, certified, or otherwise approved by TMDB. | Telas da versão de desenvolvimento. A interface do app está em português. Dados e imagens de filmes e séries do TMDB. Este produto usa o TMDB e as APIs do TMDB, mas não é endossado, certificado nem aprovado de outra forma pelo TMDB. |
| `alt` da imagem de compartilhamento | Bruno Lucildo, Senior Backend Developer \| Technical Lead. Engineering beyond code. | Bruno Lucildo, Desenvolvedor Backend Sênior \| Líder Técnico. Engenharia além do código. |

### 7.4. Rotas e arquivos novos

| Item | Valor |
|---|---|
| Ícone | `/icon` (32 e 512 px), `/apple-icon` (180 px) e `/favicon.ico`, gerados por código |
| Cartão | `/en/opengraph-image` e `/pt-BR/opengraph-image` (PNG, 1200 × 630 px) |
| Créditos | `public/images/CREDITS.md` |

## 8. Critérios de aceitação

| ID | Critério (Given / When / Then) |
|---|---|
| VIS-CA-01 | **Given** a pasta `public/images/` e o código, **when** comparados, **then** todo arquivo de imagem é referenciado e toda referência a imagem aponta para um arquivo existente. |
| VIS-CA-02 | **Given** `/en` e `/pt-BR`, **when** abertas, **then** há uma fotografia com `alt` do idioma, `priority` e as dimensões declaradas; `/en/about` não tem imagem. |
| VIS-CA-03 | **Given** as nove páginas da auditoria, **when** lidas a 1440 e a 375 px, **then** toda `img` tem `alt` não vazio, `width` e `height`, e só a do Hero não tem `loading="lazy"`. |
| VIS-CA-04 | **Given** as imagens do site, **when** requisitadas pelo navegador, **then** o tipo servido é `image/webp` e nenhuma mede mais de 1,3 vez o tamanho exibido. |
| VIS-CA-05 | **Given** os arquivos de origem, **when** medidos, **then** a fotografia tem até 600 KB, cada tela de projeto até 300 KB e cada SVG até 15 KB. |
| VIS-CA-06 | **Given** os arquivos PNG, JPG e SVG de `public/images/`, **when** lidos, **then** nenhum tem metadado embutido (`tEXt`, `iTXt`, `zTXt`, `eXIf`, EXIF, XMP ou comentário). |
| VIS-CA-07 | **Given** qualquer página, inclusive a 404, **when** o HTML é lido, **then** há `<link rel="icon">` e `apple-touch-icon`; **given** `/favicon.ico`, **then** responde 200 com `image/*`. |
| VIS-CA-08 | **Given** os ícones de 32, 180 e 512 px, **when** lidos, **then** têm as dimensões previstas, fundo `background` e as letras na cor `primary`. |
| VIS-CA-09 | **Given** `/en/opengraph-image` e `/pt-BR/opengraph-image`, **when** requisitadas, **then** respondem 200 com `image/png` de 1200 × 630 px, e cada uma é diferente da outra. |
| VIS-CA-10 | **Given** cada página indexável, nos dois idiomas, **when** os metadados são lidos, **then** `og:image` é a URL absoluta do cartão do idioma, com `og:image:width` 1200, `og:image:height` 630, `og:image:alt`, `twitter:card` `summary_large_image` e `twitter:image`; **given** a 404, **then** não há `og:image`. |
| VIS-CA-11 | **Given** a página do Reelix, nos dois idiomas, **when** a legenda é lida, **then** é o texto da seção 7.3, e a página não contém imagem do TMDB além das telas. |
| VIS-CA-12 | **Given** `public/images/CREDITS.md`, **when** lido, **then** lista os seis grupos da seção 7.1, cada um com origem, direitos e data. |
| VIS-CA-13 | **Given** `BUSINESS.md`, `CONTENT.md` e `DESIGN.md`, **when** lidos, **then** nenhum diz que a posição da fotografia está em aberto. |
| VIS-CA-14 | **Given** o repositório, **when** `pnpm typecheck` e `pnpm test:e2e` rodam, **then** passam, incluindo `e2e/assets.spec.ts`. |
| VIS-CA-15 | **Given** `/en/projects/reelix` e a Home, **when** carregadas, **then** a página não tem deslocamento de layout causado por imagens (`width` e `height` declarados em todas). |

## 9. Dependências

- `src/config/site.ts` (`heroPhoto`), `src/config/projects.ts` (`imageSource`), `src/config/technologies.ts`, `src/components/sections/HeroSection.tsx`, `src/components/projects/ProjectFigure.tsx`.
- `src/lib/seo/metadata.ts` (`buildPageMetadata`: `og:image`, `twitter`) e `src/i18n/routing.ts` (rotas do cartão por idioma).
- `src/content/{en,pt-BR}/common.json` (legenda do Reelix) e `e2e/projects.spec.ts` (testa o texto atual da legenda).
- `next/og` (incluso no Next 16) para o ícone e o cartão; `src/styles/tokens.css` para as cores.
- `e2e/support/content-rules.ts` e `playwright.config.ts`.
- Documentos: `.docs/BUSINESS.md`, `.docs/CONTENT.md` e `.docs/DESIGN.md`.
- SEO final (futuro): `robots.txt`, `sitemap.xml` e `NEXT_PUBLIC_SITE_URL`, que dão a URL absoluta correta das imagens.

## 10. Riscos

| Risco | Impacto | Mitigação |
|---|---|---|
| O otimizador de imagens do Next depender do servidor da hospedagem. | Em hospedagem estática pura, as imagens iriam em PNG de até 495 KB, sem redimensionamento | A escolha da hospedagem deve confirmar o otimizador (ou um loader próprio) e repetir VIS-CA-04. Os limites de peso da origem (VIS-RF-06) já deixam o pior caso aceitável. |
| `og:image` apontar para `localhost` até `NEXT_PUBLIC_SITE_URL` ser definida. | Pré-visualização quebrada ao compartilhar | Limitação conhecida (igual ao canonical); definir a variável é parte do SEO final. |
| Aplicativos cortarem as bordas do cartão ou lerem a miniatura. | Texto cortado ou ilegível | Margem de segurança de 40 px e texto principal com 64 px ou mais (VIS-RNF-04). |
| O cartão gerado usar uma fonte diferente da do site. | Identidade visual levemente diferente | Premissa 4: usar a fonte do site se couber; senão, a fonte padrão, sem prejuízo da leitura. |
| Pôsteres do TMDB serem lidos como obra do Bruno ou como produto endossado. | Questão de direitos | Legenda com a redação dos termos (VIS-RF-11), crédito em `CREDITS.md`, e as telas mostram um app do Bruno, não os pôsteres como conteúdo. |
| Uma imagem futura trazer metadados de localização ou de dispositivo. | Vazamento de dados pessoais | VIS-RF-07 e VIS-CA-06, com teste automático. |
| Um monograma "BL" ser lido como logotipo de marca registrada. | Confusão com terceiros | Letras em fonte do sistema, sem desenho próprio; é um monograma tipográfico, não um logotipo. |

## 11. Perguntas abertas

| ID | Pergunta | Bloqueia? | Default adotado se não houver resposta |
|---|---|---|---|
| Q1 | A legenda do Reelix da seção 7.3 (frase dos termos do TMDB) e o `alt` do cartão podem ser publicados? | Resolvida em 2026-11-08: aprovados pelo Bruno | Nenhum: implementação só depois da aprovação. |
| Q2 | O cartão leva só o texto aprovado da Home (nome, posicionamento e título), ou prefere outra frase? | Não | Os textos da Home. **Resolvida em 2026-11-08: default aceito pelo Bruno.** |
| Q3 | O monograma é "BL" em verde-limão sobre o fundo escuro, como na seção 6.1? | Não | Sim. **Resolvida em 2026-11-08: default aceito pelo Bruno.** |
| Q4 | Os limites de peso da seção VIS-RF-06 (600 KB, 300 KB, 15 KB) estão bons? | Não | Sim. **Resolvida em 2026-11-08: default aceito pelo Bruno.** |

## 12. Premissas

1. A fotografia fica só no Hero e o About continua sem imagem (decisão implícita do Bruno ao aprovar o Hero).
2. O ícone e o cartão são gerados por código (`next/og`), sem arquivos binários novos para manter, e usam os tokens de cor do site.
3. `/favicon.ico` é servido por uma rota que devolve a imagem do ícone (os navegadores aceitam PNG com esse nome); não há arquivo `.ico` de verdade.
4. A fonte do cartão é a fonte padrão do gerador de imagens; se a fonte do site puder ser carregada sem dependência nova, passa a ser usada.
5. O cartão é igual em todas as páginas do mesmo idioma; o título e a descrição do compartilhamento vêm da página.
6. O teste de peso e de metadados lê os arquivos de `public/images/`; não depende do servidor.
7. As telas dos projetos já foram conferidas por leitura quanto a dados pessoais reais quando foram capturadas e aprovadas (SPEC-004).

## 13. Decisões registradas

| Data | Decisão | Quem |
|---|---|---|
| 2026-11-07 | A fotografia fica no Hero, com o tratamento e o `alt` aprovados, versionada no Git. | Bruno |
| 2026-11-07 | As telas do Reelix (nove) e do FintaLab (três por idioma) estão aprovadas, com a legenda do TMDB. | Bruno |
| 2026-11-08 | O ícone do site é o monograma "BL" em verde-limão sobre o fundo escuro, gerado por código. | Bruno |
| 2026-11-08 | A imagem de compartilhamento é um cartão tipográfico por idioma, sem fotografia, igual em todas as páginas. | Bruno |
| 2026-11-08 | A legenda do Reelix passa a usar a redação dos termos do TMDB, sem logotipo. | Bruno |
| 2026-11-08 | Textos da seção 7.3 aprovados e implementação autorizada (Q1). Q2 a Q4 seguem com os defaults da seção 11. | Bruno |

## Refinamento

- 2026-11-08, v0.2.0: textos aprovados (Q1) e SPEC implementada; a seção 15 registra a entrega, as divergências e a verificação.
- 2026-11-08, v0.1.0: SPEC criada a partir do rascunho de `FEATURES.md` (Draft v0.1), do `BUSINESS.md`, do `CONTENT.md` (8), do `DESIGN.md` (9), do `SEO.md` (9), da `ARCHITECTURE.md` (10.1), do código dos componentes de imagem e de uma auditoria em build de produção (alt, dimensões, carregamento, formato, tamanho servido, peso, metadados embutidos, arquivos órfãos, ícones e `og:image`). Rascunho original preservado: fotografia, imagem de apresentação, imagens de projetos, imagens de compartilhamento, ícones e ilustrações; requisitos de autorização, otimização, qualidade, contraste, `alt` e relevância. As quatro "decisões pendentes" já estavam decididas (fotografia no Hero, tratamento aprovado, seleção das imagens de projetos aprovada) e viraram decisões registradas. Três decisões do Bruno registradas na seção 13; os textos novos aguardavam a aprovação (Q1).

## 15. Implementação e verificação

Implementada na branch `feat/layout` em 2026-11-08, depois da aprovação dos textos (Q1).

- Novos: `src/config/brand.ts`, `src/lib/brand/monogram.tsx`, `src/app/icon.tsx`, `src/app/apple-icon.tsx`, `src/app/favicon.ico/route.ts`, `src/app/[locale]/opengraph-image.tsx`, `public/images/CREDITS.md` e `e2e/assets.spec.ts` (24 testes).
- Alterados: `src/lib/seo/metadata.ts` (`socialImage`, `og:image` e `twitter` em `buildPageMetadata`), `src/app/[locale]/page.tsx` (Home), `src/proxy.ts`, `src/content/{en,pt-BR}/common.json` (`metadata.ogImageAlt` e a legenda do Reelix), `e2e/projects.spec.ts`, `.docs/BUSINESS.md`, `.docs/CONTENT.md`, `.docs/DESIGN.md` e `README.md`.

Decisões de implementação:

- O gerador de imagens só traz a fonte Geist em peso normal. O monograma ganhou aparência de negrito com um contorno da mesma cor (`WebkitTextStroke`), legível em 16 px e sem arquivo de fonte novo; o cartão usa o mesmo recurso, leve, só no nome.
- O `alt` do cartão vem do conteúdo (`metadata.ogImageAlt`) e entra pelo metadado das páginas, e não por `export const alt`, que não varia por idioma.
- As cores da marca ficam em `src/config/brand.ts`, e um teste confere que são as de `tokens.css`.
- O cartão é gerado no build, um por idioma (`generateStaticParams`); sem isso o Next o tratava como rota dinâmica.

Divergências em relação à SPEC:

- **Seção 7.4:** os ícones saem em `/icon/small` (32 px), `/icon/large` (512 px) e `/apple-icon` (180 px), e não em `/icon`. O `/favicon.ico` devolve um PNG de 48 px (o Next não gera `favicon` por código).
- **`src/proxy.ts` (não previsto):** o middleware de idioma redirecionava `/icon/small` e `/apple-icon` para `/en/icon/small` e `/en/apple-icon`, que davam 404; os links do `<head>` ficariam quebrados. O `matcher` agora deixa esses dois caminhos de fora.
- **Premissa 4:** a fonte do cartão é a Geist padrão do gerador, como previsto, e não a do site.
- **VIS-CA-15:** medido como deslocamento acumulado de layout abaixo de 0,02 nas páginas com imagem (Home, lista e detalhe do Reelix), além de `width` e `height` declarados.

| Critério | Resultado | Evidência |
|---|---|---|
| VIS-CA-01 | Atendido | 33 arquivos de imagem, todos referenciados pela configuração; nenhuma referência quebrada. |
| VIS-CA-02 | Atendido | Home com a fotografia, `alt` do idioma e sem `lazy`; About sem imagem. |
| VIS-CA-03 | Atendido | Seis páginas em en e quatro em pt-BR, a 1440 e a 375 px: `alt` não vazio, `width` e `height`, e só o Hero sem `lazy`. |
| VIS-CA-04 | Atendido | Tudo em `image/webp`, e nenhuma imagem com mais de 1,3 vez o tamanho exibido. |
| VIS-CA-05 | Atendido | Fotografia 495 KB (limite 600), maior tela 236 KB (limite 300) e maior SVG 11 KB (limite 15). |
| VIS-CA-06 | Atendido | PNG, JPG e SVG lidos por bloco, marcador e texto: nenhum metadado embutido. |
| VIS-CA-07 | Atendido | `/en`, `/en/about`, `/pt-BR/sobre` e a 404 declaram os ícones de 32, 512 e 180 px; todos respondem 200 com `image/png` sem redirecionar; `/favicon.ico` responde 200. |
| VIS-CA-08 | Atendido | Dimensões 32, 180 e 512 px, canto na cor de fundo (11, 13, 12) e pixels verde-limão em pelo menos 4% da área. |
| VIS-CA-09 | Atendido | Dois PNG de 1200 x 630 px (IHDR lido), diferentes entre si; conferidos também a olho (en e pt-BR). |
| VIS-CA-10 | Atendido | Nas oito rotas fixas e em dois detalhes, por idioma: um `og:image` absoluto de `/<idioma>/opengraph-image`, largura 1200, altura 630, `alt` do idioma, `twitter:card` grande e `twitter:image`; a 404 sem `og:image`. |
| VIS-CA-11 | Atendido | Legenda do texto aprovado (`projects.spec.ts`); a página do Reelix sem imagem do TMDB. |
| VIS-CA-12 | Atendido | `CREDITS.md` com seis linhas, cada uma com origem, direitos e data. |
| VIS-CA-13 | Atendido | Os três documentos atualizados; teste confere que as frases antigas sumiram. |
| VIS-CA-14 | Atendido | `tsc --noEmit` sem erros e suíte E2E completa com 700 testes passando. |
| VIS-CA-15 | Atendido | Ver a divergência acima. |

Verificação adicional:

- Mutação: seis defeitos de propósito (proxy sem a exceção dos ícones, `og:image` removido, `alt` vazio nas telas, Hero sem `priority`, arquivo de imagem órfão e cartão com 600 px de altura) derrubaram 12 testes, com uma exceção: o do tamanho do cartão passou porque comparava o PNG com a constante mutada (`socialImageSize`). Passou a comparar com 1200 x 630 literais, e a mutação foi pega. Arquivos restaurados e suíte completa verde depois.
- Problema encontrado e corrigido: o redirecionamento do middleware sobre os ícones (acima), visto com `curl -L` (404).
- Os cartões de en e pt-BR e os ícones foram baixados do servidor de produção e conferidos como imagem.

Não verificado: a aparência do ícone na aba de um navegador real e na tela de início de um iPhone, a prévia do cartão em LinkedIn, WhatsApp e X (exigem a URL pública), o contraste com ferramenta (usa os tokens) e o otimizador de imagens em uma hospedagem de produção.
