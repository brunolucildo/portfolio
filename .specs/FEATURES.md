# .specs/FEATURES.md

# Especificações das Funcionalidades — Bruno Lucildo

## 1. Objetivo

Este documento reúne as especificações iniciais das funcionalidades do portfólio pessoal.

As especificações descrevem o comportamento esperado de cada página e funcionalidade, servindo como referência para implementação e validação.

**Status geral:** SPECs 001 a 011 concluídas (Done, por decisão do Bruno em 2026-11-08). SEO final e QA final ainda não têm SPEC; dependem do domínio e da hospedagem. A seção 5 registra as decisões de fechamento e o que foi aberto a partir delas.

---

# SPEC-001 — Home

**Status:** Done. Refinada, implementada e movida para [`001-home.md`](./001-home.md).

A Home é a principal porta de entrada do portfólio. Os requisitos, os critérios de aceitação, as perguntas abertas e o histórico de refinamento estão no arquivo dedicado.

---

# SPEC-002 — About

**Status:** Done. Refinada, implementada e movida para [`002-about.md`](./002-about.md).

A seção About apresenta a trajetória, a filosofia profissional e os interesses de Bruno. Os requisitos, os critérios de aceitação, o rascunho dos textos, as perguntas abertas e o histórico de refinamento estão no arquivo dedicado.

---

# SPEC-003 — Experience

**Status:** Done. Refinada, implementada e movida para [`003-experience.md`](./003-experience.md).

A seção Experience apresenta o histórico profissional de Bruno. Os requisitos, os critérios de aceitação, o rascunho dos textos, a validação das métricas, as perguntas abertas e o histórico de refinamento estão no arquivo dedicado.

---

# SPEC-004 — Projects

**Status:** Done. Refinada, implementada e movida para [`004-projects.md`](./004-projects.md).

A seção Projects apresenta os projetos pessoais, acadêmicos e conceituais de Bruno, com uma página de detalhe para os mais desenvolvidos. Os requisitos, os critérios de aceitação, o rascunho dos textos, as perguntas abertas e o histórico de refinamento estão no arquivo dedicado.

---

# SPEC-005 — Technologies

**Status:** Done. Refinada, implementada e movida para [`005-technologies.md`](./005-technologies.md).

A seção Technologies apresenta as tecnologias e ferramentas utilizadas profissionalmente ou exploradas em projetos, por categoria e com o contexto em que cada uma foi usada. Os requisitos, os critérios de aceitação, o rascunho dos textos, as perguntas abertas e o histórico de refinamento estão no arquivo dedicado.

---

# SPEC-006 — AI Lab

**Status:** Done. Refinada, implementada e movida para [`006-ai-lab.md`](./006-ai-lab.md).

A seção AI Lab apresenta experimentos, estudos e provas de conceito com inteligência artificial, cada um com problema, abordagem, resultados observados e limitações. Os requisitos, os critérios de aceitação, o rascunho dos textos, as perguntas abertas e o histórico de refinamento estão no arquivo dedicado.

---

# SPEC-007 — Contact

**Status:** Done. Refinada, implementada e movida para [`007-contact.md`](./007-contact.md).

A seção Contact reúne os canais de comunicação profissional: e-mail com botão de copiar, LinkedIn, GitHub e currículo. Os requisitos, os critérios de aceitação, o rascunho dos textos, as perguntas abertas e o histórico de refinamento estão no arquivo dedicado.

---

# SPEC-008 — Internationalization

**Status:** Done. Refinada, implementada e movida para [`008-internationalization.md`](./008-internationalization.md).

A seção de internacionalização formaliza o inglês (padrão) e o português do Brasil: rotas, redirecionamentos, seletor de idioma, metadados, `hreflang`, página 404 localizada e proteção contra textos sem tradução. Os requisitos, os critérios de aceitação, a auditoria do que já existe, as perguntas abertas e o histórico de refinamento estão no arquivo dedicado.

---

# SPEC-009 — Resume

**Status:** Done. Refinada, implementada e movida para [`009-resume.md`](./009-resume.md).

A seção Resume dá ao currículo em PDF uma página própria (`/resume`), com ações para abrir e baixar o arquivo, e define a consistência do documento com o site, o idioma do arquivo e o procedimento de atualização. Os requisitos, os critérios de aceitação, o rascunho dos textos, o mapa de consistência, as perguntas abertas e o histórico de refinamento estão no arquivo dedicado.

---

# SPEC-010 — Global Layout and Navigation

**Status:** Done. Refinada, implementada e movida para [`010-global-layout.md`](./010-global-layout.md).

O layout global reúne cabeçalho, navegação, seletor de idioma, rodapé e o atalho para o conteúdo. A SPEC formaliza o que já foi implementado, registra a auditoria em build de produção e fecha as lacunas encontradas (menu mobile, foco atrás do cabeçalho fixo, alvos de toque, estado ativo do botão Resume e link do currículo no rodapé). Os requisitos, os critérios de aceitação, a auditoria, as perguntas abertas e o histórico de refinamento estão no arquivo dedicado.

---

# SPEC-011 — Photography and Visual Assets

**Status:** Done. Refinada, implementada e movida para [`011-visual-assets.md`](./011-visual-assets.md).

A SPEC reúne a fotografia do Hero, as telas dos projetos e os ícones de tecnologias já aprovados, e cria o ícone do site e a imagem de compartilhamento. Os requisitos, os critérios de aceitação, a auditoria, o inventário de direitos, o rascunho dos textos, as perguntas abertas e o histórico de refinamento estão no arquivo dedicado.

---

# SPEC-012 — AI Lab: Neural Intelligence Environment

**Status:** Done (2026-11-08). Implementada e verificada; especificação em [`012-ai-lab-neural.md`](./012-ai-lab-neural.md).

A SPEC reformula a página de lista do AI Lab como um ambiente imersivo de pesquisa em IA: rede neural em Canvas 2D, filosofia do laboratório, experimentos em destaque com filtros, linha de pesquisa e encerramento visual, sem dependência nova. Os requisitos, os critérios de aceitação, os textos para aprovação, o impacto nos testes, as perguntas abertas e as decisões estão no arquivo dedicado.

---

# SPEC-013 — SEO Final

**Status:** In Review (2026-11-08). Implementada e verificada; especificação em [`013-seo.md`](./013-seo.md).

A SPEC fecha o SEO técnico para a publicação: `robots.txt`, `sitemap.xml` com as 34 páginas e `hreflang`, guarda contra indexação de ambientes não públicos, validação de `NEXT_PUBLIC_SITE_URL`, dados estruturados (`WebSite`, `Person`, `ProfilePage`), limites de 60 e 160 caracteres para título e descrição (com textos reescritos para aprovação) e testes de auditoria. Hospedagem, domínio, Search Console e Lighthouse em produção ficam fora e seguem para o QA final.

---

## 2. Dependências entre funcionalidades

| Funcionalidade | Dependências principais |
|---|---|
| Home | Layout, conteúdo e navegação |
| About | Conteúdo e layout |
| Experience | Conteúdo e layout |
| Projects | Conteúdo, cards e navegação |
| Technologies | Conteúdo e componentes visuais |
| AI Lab | Conteúdo, cards e navegação |
| Contact | Layout e canais de contato |
| Internationalization | Rotas, conteúdo e metadados |
| Resume | Arquivos e navegação |
| Global Layout | Design System e internacionalização |
| Photography | Design e assets |

## 3. Ordem sugerida de implementação

1. Estrutura base e configuração do projeto.
2. Design tokens e componentes fundamentais.
3. Layout global e navegação.
4. Internacionalização.
5. Home.
6. About.
7. Experience.
8. Projects.
9. Technologies.
10. AI Lab.
11. Contact.
12. Resume.
13. SEO e otimizações.
14. QA final e publicação.

## 4. Regra de evolução

As especificações poderão ser divididas em arquivos individuais conforme a implementação avançar.

Nenhuma funcionalidade deverá ser considerada concluída apenas por possuir interface visual. Os critérios funcionais, de conteúdo, responsividade, acessibilidade e qualidade também deverão ser atendidos.

## 5. Decisões de fechamento (2026-11-08)

Tomadas pelo Bruno ao fechar as SPECs 001 a 011.

| Tema | Decisão | Desdobramento |
|---|---|---|
| Status das SPECs | Todas as SPECs 001 a 011 passam a Done. Os itens "Não verificado" de cada uma seguem para o QA final. | Atualizado nos arquivos das SPECs, neste índice e no README. |
| Perguntas reversíveis | Os defaults de todas as perguntas abertas das SPECs 003 a 011 foram aceitos. | Cada linha marcada como resolvida na tabela de perguntas da SPEC. |
| Bancos `.db` do Football | Ficam públicos no repositório `football-stat-analytics-cli`. | Registrado na SPEC-004 e no `CONTENT.md`; nada muda no site. |
| Requisitos Should sem entrega | Serão entregues: TECH-RF-10 (nomes de projeto em Technologies levam à página do projeto) e AIL-RF-16 (anterior e seguinte entre experimentos do AI Lab). | Entregues em 2026-11-08 (SPEC-005 v0.4.0 e SPEC-006 v0.4.0 parcial: AIL-RF-16), com testes. |
| Material da pós no AI Lab | Entram três itens: o fine-tuning, com enquadramento honesto (os números vêm dos dados de treino e a falha de avaliação foi o aprendizado); o método do framework de testes (M2D4), sem resultados numéricos, porque as 30 execuções foram ilustrativas; e a escolha de abordagem e de modelo do Módulo 1, como estudo. | Entregue em 2026-11-08: SPEC-006 v0.5.0, com os três experimentos novos e os textos aprovados pelo Bruno. |
| Limpeza local | Apagadas as branches locais já mergeadas e descartada a troca de quebra de linha (CRLF) dos arquivos sem diferença de conteúdo. | Feito em 2026-11-08. |
