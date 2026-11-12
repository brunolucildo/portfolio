# QA-RELATORIO.md

# Relatório de QA final — 2026-11-08

Execução do QA final descrito em `QA.md`, sobre a `main` em fc975db (SPECs 001 a 013) mais as correções desta branch. Tudo foi medido em um build de produção local; o que depende de domínio, hospedagem ou de uma pessoa está na seção 6.

## 1. Resumo

| Área | Resultado |
|---|---|
| Build, TypeScript, Biome, dependências | Aprovado |
| Testes end-to-end | 1334 passando em Chromium, Firefox e WebKit (5 ignorados no WebKit, seção 6.1) |
| Acessibilidade automatizada (WCAG 2.2 AA) | 0 violações em 72 execuções (36 URLs, 2 larguras), agora como teste permanente |
| Contraste dos casos que a ferramenta não decide | Sem falha real (pior caso 4,55:1) |
| Lighthouse | Acessibilidade 100, boas práticas 100, desempenho 94 a 100 |
| Desempenho real (LCP, CLS, TBT) | Dentro das metas |
| Segurança | Sem segredos; 1 melhoria aplicada (cabeçalhos) |
| Defeitos encontrados | 1 média, 2 baixas, todas corrigidas; 3 instabilidades de teste resolvidas |
| Bloqueios para publicar | Nenhum de código; faltam domínio, HTTPS e conferências manuais |

## 2. Verificações automáticas

| Verificação | Resultado |
|---|---|
| `tsc --noEmit` | 0 erros |
| `biome check .` (121 arquivos) | 0 erros (antes: 3 a 48 falhas só de CRLF, resolvidas pelo `.gitattributes`) |
| `pnpm audit` | Nenhuma vulnerabilidade conhecida |
| Build de produção | Concluído; o aviso `[seo] Indexação desligada` aparece de propósito sem `SITE_INDEXING=allow` |
| `pnpm test:e2e` | 1334 passando em 4,4 min (três navegadores); 911 em 1,8 min só com Chromium |
| Dependências de execução | 4 (`next`, `next-intl`, `react`, `react-dom`) |

## 3. Acessibilidade

**Método.** axe-core 4.10.2 com as regras WCAG 2.0, 2.1 e 2.2 níveis A e AA e as boas práticas, em 36 URLs (34 páginas e as duas 404) a 1440 px e 390 px, depois de percorrer a página para disparar as revelações. As ferramentas ficaram numa pasta temporária, fora do repositório.

- **Resultado:** 0 violações nas 72 execuções.
- **Controle:** num teste com defeitos injetados (texto de baixo contraste, imagem sem `alt`, botão sem nome), o mesmo fluxo acusou os três. O zero é confiável.
- **Lighthouse:** acessibilidade 100 em todas as páginas medidas.
- **Sem JavaScript:** nenhum texto fica escondido (opacidade efetiva menor que 1) em 10 páginas (inglês e português); o conteúdo não depende de JS.

**Casos que o axe marca como "incompleto"** (não consegue calcular o fundo): texto sobre o gradiente da luz do Card, sobre o Canvas do AI Lab e no cabeçalho translúcido. Medi pelos pixels reais (texto escondido, fundo fotografado, 5º percentil, estado normal e com o mouse em cima):

| Medida | Pior caso |
|---|---|
| Cabeçalho (99 medidas, três posições de rolagem) | 6,70:1 |
| AI Lab, estado normal | 5,45:1 |
| AI Lab, com o mouse em cima do tile | 4,55:1 |
| Controles (títulos e parágrafos de Projects) | 6,73:1 |

O mínimo é 4,5:1 para texto normal. O pior caso (4,55:1) é conservador (5º percentil dos pixels) e passa. Nenhuma falha real.

## 4. Desempenho

Lighthouse 12.6.1, build de produção em `localhost`, perfil de celular (CPU 4x e rede 4G lenta simuladas) e de desktop.

| Página | Perfil | Desempenho | LCP simulado | CLS | TBT |
|---|---|---:|---:|---:|---:|
| Home en | celular | 95 | 2,87 s | 0 | 66 ms |
| Home pt-BR | celular | 96 | 2,76 s | 0 | 38 ms |
| Projects | celular | 95 | 2,91 s | 0 | 41 ms |
| AI Lab | celular | 94 | 3,02 s | 0 | 77 ms |
| AI Lab, detalhe | celular | 96 | 2,69 s | 0 | 85 ms |
| Contact | celular | 96 | 2,69 s | 0,007 | 81 ms |
| Home en | desktop | 100 | 0,67 s | 0 | 0 ms |
| AI Lab | desktop | 100 | 0,70 s | 0 | 0 ms |

O LCP simulado do celular passa de 2,5 s, mas é o modelo do Lighthouse, não o carregamento. Medido de verdade num Chromium com CPU 4x mais lenta e rede de 1,6 Mbps com 150 ms de latência, sem cache, em celular (390 px), 3 execuções por página:

| Página | FCP | LCP | Elemento do LCP |
|---|---:|---:|---|
| Home | 0,88 s | 0,90 s | Foto do Hero |
| Projects | 0,85 s | 0,85 s | Parágrafo de abertura |
| AI Lab | 0,89 s | 0,89 s | Título |
| Contact | 0,84 s | 0,84 s | Parágrafo de abertura |

Todos bem abaixo da meta de 2,5 s. O peso transferido por página fica entre 258 e 359 KB. INP não foi medido (precisa de uso real); o TBT baixo é o indício disponível. O Lighthouse ainda aponta JavaScript legado e não usado e um CSS que bloqueia a renderização (cerca de 150 ms); são sugestões de baixo ganho, sem ação.

## 5. Segurança, conteúdo e links

| Verificação | Resultado |
|---|---|
| Segredos (chaves OpenAI, AWS, GitHub, chaves privadas) na árvore e em todo o histórico | Nenhum |
| `.env` | Ignorado; só `.env.example` já foi versionado |
| Links com `target="_blank"` | Todos com `rel="noopener noreferrer"` (conferido no HTML renderizado) |
| Links externos | GitHub (perfil e 3 repositórios): 200. LinkedIn: 999, bloqueio de robôs, conferir à mão |
| Links internos | 34 páginas rastreadas, nenhum quebrado |
| Frases proibidas, empresa e métricas não validadas nas páginas | Cobertos por testes (`content-rules.ts`) |
| Cabeçalhos de segurança | Não existiam; ver D2 |

## 6. Defeitos encontrados

| ID | Severidade | Descrição | Situação |
|---|---|---|---|
| D1 | Média | **WCAG 2.5.3, rótulo no nome** (nível A): o seletor de idioma mostra "EN" e "PT", mas o nome acessível era "English" e "Português". Quem controla a página por voz ("clicar EN") não acertava o link. O Lighthouse acusou (`label-content-name-mismatch`). | Corrigido: o nome passou a ser "EN, English" e "PT, Português" (`LanguageSwitcher.tsx`). Teste novo em `layout.spec.ts` verifica todos os links e botões do cabeçalho, rodapé e conteúdo. |
| D2 | Baixa | Sem cabeçalhos de segurança, e `X-Powered-By: Next.js` exposto. | Corrigido em `next.config.ts`: `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options: DENY`, `Permissions-Policy` e `poweredByHeader: false`. Teste novo em `seo.spec.ts`. HSTS e CSP ficam fora (seção 7). |
| D3 | Baixa | No Windows, o checkout converte os arquivos para CRLF e o `biome check .` falhava (3 a 48 erros, sem diferença de conteúdo no Git). | Corrigido: `.gitattributes` com `* text=auto eol=lf`. |

Os testes novos foram validados por mutação: com as correções revertidas, 5 testes falham.

### 6.1. Firefox e WebKit, e instabilidades de teste

Com a decisão QA-Q2, o Firefox e o WebKit passaram a rodar a navegação, o menu mobile e o idioma. A primeira rodada deu 19 falhas, e nenhuma era defeito do site. Triagem:

| Achado | Causa | Resolução |
|---|---|---|
| `beforeAll` de metadados com timeout no Firefox | 68 navegações em sequência passam dos 30 s padrão | Timeout do gancho em 120 s; projetos Firefox e WebKit com 90 s por teste |
| Teste do cookie `NEXT_LOCALE` abortado no Firefox | Navegava enquanto o clique do seletor ainda carregava | Espera a URL de destino antes de seguir |
| Foco visível sem contorno no Firefox e no WebKit | O foco programático só ativa `:focus-visible` depois de uma interação de teclado; no menu mobile o Firefox exige uma tecla de navegação | Pressiona `Shift` (Chromium e WebKit) ou `Tab` (Firefox) antes de medir; confirmado por sondagem que o estilo aparece (`solid 2px`) |
| Clique no menu mobile trava no Firefox | `goto` na mesma URL já aberta deixa o clique esperando uma navegação que não termina (1 de 3 execuções) | O teste não recarrega a página só para mudar a largura |
| O WebKit não navega por Tab | O WebKit do Playwright no Windows deixa o foco no `body`, mesmo com Alt+Tab; o Safari de verdade só alcança links com um ajuste do navegador | 5 testes de Tab ignorados no WebKit, com a razão no código; seguem em Chromium e Firefox. O contorno do foco no WebKit fica para o Safari real |

Três instabilidades em Chromium, que a carga maior expôs:

| Achado | Causa | Resolução |
|---|---|---|
| Contact contava 4 botões em vez de 5 | O botão Copiar só aparece depois da hidratação e o teste contava na hora | `toHaveCount(5)`, que repete até estabilizar |
| Menu mobile aberto depois de 1280 px e de volta a 375 px (cerca de 8% em isolamento) | Duas mudanças de largura seguidas podem ser fundidas em um só evento do navegador; o componente está certo, uma pessoa não redimensiona tão rápido | O teste espera o menu fechar no desktop antes de voltar (60 de 60 passam) |
| Degradação da rede neural não acontecia sob carga | O app descarta quadros acima de 250 ms como pausa, e a CPU emulada 12 vezes mais lenta, numa máquina disputada, passava disso | O teste bloqueia a thread por 70 ms a cada 100 ms, independente da máquina; passa 6 de 6 e em metade do tempo |

Também limitei os workers a 35% dos núcleos para reduzir a disputa entre os três navegadores.

## 7. Pendências que dependem de domínio, hospedagem ou de uma pessoa

Nada disso bloqueia o código, mas bloqueia o item correspondente do checklist de publicação.

**Depende do domínio e do HTTPS**

- Publicar com `SITE_INDEXING=allow` e `NEXT_PUBLIC_SITE_URL` em `https` (passo a passo no README) e conferir `robots.txt`, `sitemap.xml` e o cabeçalho `X-Robots-Tag` na hospedagem real, que pode alterar cabeçalhos.
- Search Console (propriedade e envio do sitemap), Rich Results Test na Home e no About, Lighthouse e PageSpeed em produção. O SEO do Lighthouse fica em 66 a 69 em `localhost` só porque a página está bloqueada de propósito (`is-crawlable`); deve subir depois.
- HSTS (a hospedagem costuma ligar com o HTTPS) e uma CSP, que exigiria liberar os scripts inline do Next e merece uma SPEC própria, se desejada.
- Otimizador de imagens do Next na hospedagem escolhida (a escolha da hospedagem muda o custo e o comportamento).
- Prévia do cartão de compartilhamento no LinkedIn, WhatsApp e X, e o ícone na aba e no iPhone.

**Depende de uma pessoa** (conferências manuais abaixo concluídas pelo Bruno em 2026-11-12)

- Abrir o LinkedIn (`/in/bruno-lucildo/`), que bloqueia robôs, e confirmar que o perfil está certo.
- Ler os textos em inglês e português uma última vez (ortografia, tom, datas, cargos): os textos foram aprovados SPEC a SPEC, mas não há revisão ortográfica automática.
- Testar com um leitor de tela (NVDA ou VoiceOver) os fluxos principais: menu, troca de idioma, AI Lab.
- Testar no Safari de verdade (o WebKit do Playwright não navega por Tab nem confirma o contorno do foco) e num celular real, incluindo o menu e o parallax. O Firefox já é coberto pelos testes automáticos de navegação, menu e idioma.
- Conferir que o link `mailto:` abre um aplicativo de e-mail e que o botão Copiar funciona no Chrome de uso diário; baixar o PDF do currículo pelo botão.
- Confirmar que nenhuma informação confidencial está publicada. As checagens automáticas cobrem empresa e métricas; o PDF do currículo traz telefone e e-mail por decisão do Bruno.

## 8. Como repetir

```bash
pnpm typecheck
pnpm check
pnpm audit
pnpm exec playwright install chromium firefox webkit
pnpm test:e2e
```

O `pnpm test:e2e` já inclui o axe-core (`e2e/a11y.spec.ts`). A auditoria de desempenho (Lighthouse) e a medição de contraste por pixel foram feitas com ferramentas em uma pasta temporária, contra `next start` em uma porta livre (conferir que a porta está livre antes: um servidor antigo na mesma porta devolve HTML velho).

## 9. Decisões

Respondidas pelo Bruno em 2026-11-08, com as opções recomendadas.

| ID | Pergunta | Decisão |
|---|---|---|
| QA-Q1 | Adotar `@axe-core/playwright` como dependência de desenvolvimento, com teste permanente nas 34 páginas? | **Sim.** Entregue em `e2e/a11y.spec.ts` (74 testes). O `pnpm` 12 acusa `ERR_PNPM_IGNORED_BUILDS` de `@parcel/watcher` e `@swc/core` em qualquer instalação, o que já acontecia antes; nenhum script de build foi aprovado. |
| QA-Q2 | Rodar Firefox e WebKit no Playwright? | **Sim, um subconjunto** (navegação, menu mobile e idioma). Entregue na seção 6.1. |
