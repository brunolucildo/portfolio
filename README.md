# Portfólio — Bruno Lucildo

Site de portfólio pessoal de Bruno Lucildo, com foco em desenvolvimento backend, liderança técnica, arquitetura de software e exploração de inteligência artificial.

O site é bilíngue (inglês como padrão e português do Brasil), estático e sem backend próprio.

## Estado do projeto

| Área | Situação |
|---|---|
| Base do projeto (Next.js, TypeScript, Tailwind, Biome, i18n) | Pronta |
| Design system (tokens e componentes fundamentais) | Pronto |
| Layout global (header, menu mobile, troca de idioma, footer) | Pronto |
| Home (SPEC-001) | Implementada, em revisão de conteúdo |
| About (SPEC-002) | Implementada, em revisão |
| Experience (SPEC-003) | Implementada, em revisão |
| Projects, AI Lab e Contact | Páginas provisórias, ainda sem conteúdo |
| Testes end-to-end (Playwright) | Configurados; cobrem Home, About e Experience |
| Technologies, Resume (página), SEO final | Pendentes |
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

Ainda não há runner de testes configurado; a estratégia proposta está em [`.docs/QA.md`](./.docs/QA.md).

### Variáveis de ambiente

Copie `.env.example` para `.env.local` se precisar definir valores locais.

| Variável | Uso |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL pública do site, usada em canonical e Open Graph. Sem ela, o padrão é `http://localhost:3000`. |

## Idiomas e rotas

| Página | Inglês (`en`) | Português (`pt-BR`) |
|---|---|---|
| Home | `/en` | `/pt-BR` |
| About | `/en/about` | `/pt-BR/sobre` |
| Experience | `/en/experience` | `/pt-BR/experiencia` |
| Projects | `/en/projects` | `/pt-BR/projetos` |
| AI Lab | `/en/ai-lab` | `/pt-BR/ai-lab` |
| Contact | `/en/contact` | `/pt-BR/contato` |

Os textos ficam em `src/content/en/common.json` e `src/content/pt-BR/common.json`. As duas estruturas precisam ter as mesmas chaves, e o `pnpm typecheck` falha quando divergem.

## Estrutura

```text
.
├── .docs/            Documentação do projeto (negócio, conteúdo, design, arquitetura, QA)
├── .specs/           Especificações das funcionalidades
├── .claude/skills/   Skills usadas pelo agente de IA
├── public/
│   ├── documents/    Currículo em PDF
│   └── images/hero/  Foto do Hero
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
