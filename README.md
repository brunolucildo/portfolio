# Portfólio — Bruno Lucildo

Site de portfólio pessoal de Bruno Lucildo, com foco em desenvolvimento backend, liderança técnica, arquitetura de software e exploração de inteligência artificial.

O site é bilíngue (inglês como padrão e português do Brasil), estático e sem backend próprio.

## Estado do projeto

| Área | Situação |
|---|---|
| Base do projeto (Next.js, TypeScript, Tailwind, Biome, i18n) | Pronta |
| Design system (tokens e componentes fundamentais) | Pronto |
| Layout global (header, menu mobile, troca de idioma, footer) | Pronto |
| Home (SPEC-001) | Concluída |
| About (SPEC-002) | Concluída |
| Experience (SPEC-003) | Concluída |
| Projects (SPEC-004) | Concluída |
| Technologies (SPEC-005) | Concluída |
| AI Lab (SPEC-006) | Concluída |
| Contact (SPEC-007) | Concluída |
| Internationalization (SPEC-008) | Concluída |
| Resume (SPEC-009) | Concluída. PDF ajustado entregue (formação e autor); título do arquivo em branco, aceito |
| Layout global (SPEC-010) | Concluída |
| Fotografia e assets (SPEC-011) | Concluída: ícone do site, imagem de compartilhamento e créditos das imagens |
| AI Lab: Neural Intelligence Environment (SPEC-012) | Concluída: página de lista imersiva com rede neural em Canvas 2D, filtros e Research Log; aguarda commit e PR |
| Links de contexto em Technologies (TECH-RF-10) e anterior/seguinte no AI Lab (AIL-RF-16) | Concluídos |
| AI Lab: escolha de abordagem e de modelo, framework de testes e fine-tuning (SPEC-006 v0.5.0) | Concluídos |
| Testes end-to-end (Playwright) | Configurados; cobrem Home, About, Experience, Projects, Technologies, AI Lab, Contact, Internationalization, Resume, Layout global e Assets (imagens, ícone e compartilhamento) |
| SEO final (SPEC-013) | Implementado: `robots.txt`, `sitemap.xml` (34 páginas), guarda de indexação, JSON-LD e limites de título e descrição; falta o domínio para validar no Search Console e no Rich Results Test |
| QA final | Executado em 2026-11-08: 911 E2E, axe-core sem violações, Lighthouse 100 em acessibilidade e boas práticas; 3 defeitos corrigidos. Relatório em [`.docs/QA-RELATORIO.md`](./.docs/QA-RELATORIO.md); faltam as conferências manuais e as que dependem do domínio |
| Hospedagem, domínio e analytics | Pendentes de decisão |

O detalhamento está nas especificações em [`.specs/`](./.specs/).

## Stack

- [Next.js](https://nextjs.org) 16 (App Router, geração estática) e React 19
- TypeScript em modo `strict`
- [Tailwind CSS](https://tailwindcss.com) 4, com tokens de design em `src/styles/tokens.css`
- [next-intl](https://next-intl.dev) para internacionalização, com rotas por idioma
- [Biome](https://biomejs.dev) para lint e formatação
- pnpm como gerenciador de pacotes

## Como executar

Requisitos: Node.js LTS (20.9 ou superior) e pnpm.

```bash
pnpm install
pnpm dev
```

Abra `http://localhost:3000`, que redireciona para `/en`.

Se o `pnpm` não funcionar no seu ambiente (no Windows, uma instalação global quebrada faz o comando terminar sem mensagem), use o `npm` com os mesmos scripts:

```bash
npm run dev
```

### Scripts

| Comando | O que faz |
|---|---|
| `pnpm dev` | Servidor de desenvolvimento |
| `pnpm build` | Build de produção |
| `pnpm start` | Servidor de produção (após o build) |
| `pnpm typecheck` | Verificação de tipos |
| `pnpm check` | Lint e verificação de formatação (Biome) |
| `pnpm test:e2e` | Testes end-to-end (Playwright): faz o build e sobe o app na porta 3100. Na primeira vez, rode `pnpm exec playwright install chromium` |
| `pnpm format` | Formata os arquivos |

A estratégia de testes está em [`.docs/QA.md`](./.docs/QA.md).

### Variáveis de ambiente

Copie `.env.example` para `.env.local` se precisar definir valores locais.

| Variável | Uso |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL pública do site, usada em canonical, Open Graph, sitemap e dados estruturados. Só o domínio, sem caminho; a barra final é removida e um valor inválido derruba o build. Sem ela, o padrão é `http://localhost:3000`. |
| `SITE_INDEXING` | Autoriza os buscadores. Só o valor `allow` libera, e exige `NEXT_PUBLIC_SITE_URL` com `https` fora de `localhost` (senão o build falha). Sem ela, o site fica bloqueado. |

### Publicação e indexação

O site nasce **bloqueado para buscadores**: sem `SITE_INDEXING=allow`, o `robots.txt` diz `Disallow: /` e toda resposta sai com `X-Robots-Tag: noindex, nofollow`. Isso protege previews e o ambiente local. Para publicar:

1. No ambiente de produção, defina `NEXT_PUBLIC_SITE_URL` (ex.: `https://seu-dominio.dev`) e `SITE_INDEXING=allow` **antes do build**; as duas são lidas na compilação.
2. Depois do deploy, confira `/robots.txt` (deve ter `Allow: /` e a linha `Sitemap:`), `/sitemap.xml` (34 URLs com o domínio certo) e a ausência do cabeçalho `X-Robots-Tag` em `/en`. O PDF do currículo mantém o seu `noindex`.
3. Nos previews, deixe `SITE_INDEXING` sem valor.
4. Com o domínio no ar: envie o sitemap no Google Search Console e valide a Home e o About no Rich Results Test (itens do QA final).

O build avisa no log quando a indexação está desligada.

## Idiomas e rotas

| Página | Inglês (`en`) | Português (`pt-BR`) |
|---|---|---|
| Home | `/en` | `/pt-BR` |
| About | `/en/about` | `/pt-BR/sobre` |
| Experience | `/en/experience` | `/pt-BR/experiencia` |
| Projects | `/en/projects` | `/pt-BR/projetos` |
| AI Lab | `/en/ai-lab` | `/pt-BR/ai-lab` |
| Contact | `/en/contact` | `/pt-BR/contato` |
| Resume | `/en/resume` | `/pt-BR/curriculo` |

Os textos ficam em `src/content/en/common.json` e `src/content/pt-BR/common.json`. As duas estruturas precisam ter as mesmas chaves, e o `pnpm typecheck` falha quando divergem.

## Estrutura

```text
.
├── .docs/            Documentação do projeto (negócio, conteúdo, design, arquitetura, QA)
├── .specs/           Especificações das funcionalidades
├── .claude/skills/   Skills usadas pelo agente de IA
├── public/
│   ├── documents/    Currículo em PDF
│   └── images/       Foto do Hero (hero/) e capturas dos projetos (projects/)
└── src/
    ├── app/[locale]/ Páginas e layout por idioma
    ├── components/   ui/, layout/ e sections/
    ├── config/       Dados do site e navegação
    ├── content/      Textos por idioma
    ├── i18n/         Rotas, navegação e validação de idioma
    ├── lib/          Utilitários e metadados de SEO
    └── styles/       Tokens de design
```

## Foto do Hero

A fotografia do Hero é versionada em `public/images/hero/bruno-lucildo-portrait.png` e configurada em `src/config/site.ts`. Se o arquivo for removido, a Home omite a foto e o restante do Hero se reorganiza, então o build não quebra.

## Documentação

Os documentos de referência estão em [`.docs/`](./.docs/):

- `BUSINESS.md`: objetivos, posicionamento e escopo
- `CONTENT.md`: conteúdo e comunicação
- `DESIGN.md` e `DESIGN_SYSTEM.md`: identidade visual, tokens e componentes
- `ARCHITECTURE.md`: arquitetura e decisões técnicas
- `DEVELOPMENT.md`: convenções de desenvolvimento
- `SEO.md` e `QA.md`: requisitos de SEO e estratégia de qualidade
- `RULES.md`: regras para agentes de IA

As instruções do agente estão em [`CLAUDE.md`](./CLAUDE.md).
