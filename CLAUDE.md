# CLAUDE.md

# Instruções do Projeto — Bruno Lucildo

## 1. Contexto do projeto

Este repositório contém o portfólio pessoal de Bruno Lucildo.

O projeto representa uma marca pessoal profissional com foco em:

- Desenvolvimento backend.
- Liderança técnica.
- Arquitetura de software.
- Sistemas distribuídos.
- Engenharia de software.
- Exploração e aplicação de inteligência artificial.

O site não deverá ser apresentado exclusivamente como uma página de procura por emprego.

## 2. Hierarquia de instruções

Antes de executar qualquer tarefa, respeite esta ordem de prioridade:

1. Decisões explícitas e aprovadas pelo usuário.
2. Documentação oficial do projeto.
3. SPEC correspondente à funcionalidade.
4. Instruções deste arquivo e do `RULES.md`.
5. Recomendações das skills instaladas.
6. Preferências genéricas do agente.

As skills são ferramentas auxiliares. Elas não substituem a documentação e não podem alterar decisões aprovadas silenciosamente.

Se encontrar contradições entre documentos, requisitos ou instruções, informe o conflito e solicite esclarecimento quando ele afetar a implementação.

Não escolha arbitrariamente uma interpretação que altere o escopo ou a arquitetura.

## 3. Documentação obrigatória

Consulte os documentos relevantes antes de implementar.

Os documentos ficam em `.docs/` e as especificações em `.specs/`.

| Documento                | Finalidade                                      |
| ------------------------ | ----------------------------------------------- |
| `.docs/BUSINESS.md`      | Objetivos, posicionamento e escopo do produto   |
| `.docs/CONTENT.md`       | Conteúdo, trajetória profissional e comunicação |
| `.docs/DESIGN.md`        | Direção visual e identidade                     |
| `.docs/DESIGN_SYSTEM.md` | Tokens, componentes e regras visuais            |
| `.docs/ARCHITECTURE.md`  | Arquitetura e organização técnica               |
| `.docs/DEVELOPMENT.md`   | Convenções e ferramentas de desenvolvimento     |
| `.docs/SEO.md`           | Requisitos de SEO                               |
| `.docs/QA.md`            | Estratégia de testes e qualidade                |
| `.docs/RULES.md`         | Regras de comportamento dos agentes             |
| `.specs/`                | Requisitos específicos das funcionalidades      |

Não é necessário reler todos os documentos integralmente para cada ajuste pequeno. Consulte os documentos relacionados à tarefa e amplie a leitura quando houver dependências.

## 4. Skills disponíveis

As skills instaladas estão em `.claude/skills/`.

Utilize somente as skills relevantes para a tarefa.

| Skill                         | Quando utilizar                                                         |
| ----------------------------- | ----------------------------------------------------------------------- |
| `feature-concept`             | Transformar uma ideia em conceito de funcionalidade                     |
| `create-spec`                 | Criar uma nova especificação                                            |
| `refine-spec`                 | Revisar ou refinar uma SPEC existente                                   |
| `find-skills`                 | Descobrir skills para uma necessidade ainda não coberta                 |
| `frontend-design`             | Planejar e construir interfaces                                         |
| `implement-me`                | Implementar uma funcionalidade especificada                             |
| `next-best-practices`         | Consultar práticas específicas de Next.js                               |
| `vercel-react-best-practices` | Avaliar práticas de React e otimização                                  |
| `playwright`                  | Criar ou executar testes end-to-end                                     |
| `tdd`                         | Aplicar desenvolvimento guiado por testes                               |
| `web-design-guidelines`       | Revisar interface, usabilidade e acessibilidade                         |
| `shadcn`                      | Utilizar componentes shadcn/ui, somente se essa biblioteca for aprovada |
| `commit-and-push`             | Executar operações Git somente mediante autorização explícita           |
| `skill-creator`               | Criar ou modificar skills quando solicitado                             |

### Regras para utilização

- Leia as instruções da skill antes de utilizá-la.
- Não acione skills sem relação com a tarefa.
- Não execute skills redundantes sem benefício concreto.
- Não instale dependências apenas porque uma skill recomenda.
- Não permita que uma skill sobrescreva decisões aprovadas.
- Se uma skill estiver indisponível, informe a limitação.
- Não invente resultados de execução.

A skill `supabase-postgres-best-practices` não faz parte das ferramentas previstas para a primeira versão do portfólio. Não introduza Supabase ou PostgreSQL como dependência por causa de instruções genéricas de outras skills.

## 5. Processo de trabalho

### 5.1. Novas funcionalidades

1. Compreender o objetivo e o contexto.
2. Consultar `BUSINESS.md` e os documentos relacionados.
3. Identificar se já existe uma SPEC.
4. Utilizar `feature-concept` quando a ideia ainda precisar ser estruturada.
5. Utilizar `create-spec` para criar uma especificação, quando necessário.
6. Utilizar `refine-spec` quando uma especificação existente precisar de revisão.
7. Confirmar requisitos e critérios de aceitação antes de implementar funcionalidades relevantes.

### 5.2. Implementação

1. Ler a SPEC aprovada.
2. Analisar a estrutura existente.
3. Consultar a arquitetura e os padrões de desenvolvimento.
4. Identificar componentes e recursos reutilizáveis.
5. Planejar alterações proporcionais à complexidade.
6. Implementar dentro do escopo.
7. Executar testes e verificações aplicáveis.
8. Revisar o resultado.
9. Informar pendências e limitações.

Utilize `implement-me` quando a funcionalidade estiver especificada e pronta para implementação.

### 5.3. Interface e design

Ao criar ou reformular interfaces:

1. Consultar `DESIGN.md` e `DESIGN_SYSTEM.md`.
2. Utilizar `frontend-design` para planejar a solução visual.
3. Definir brevemente cores, tipografia, composição e princípios relevantes.
4. Comparar o plano com a identidade já aprovada.
5. Implementar a interface.
6. Utilizar `web-design-guidelines` para revisar o resultado quando apropriado.
7. Revisar screenshots quando o ambiente permitir.
8. Corrigir inconsistências antes de entregar.

Não gerar um novo sistema visual para cada página. A identidade deve permanecer consistente.

### 5.4. Testes

- Utilizar `tdd` quando a tarefa se beneficiar de desenvolvimento guiado por testes.
- Utilizar `playwright` para fluxos end-to-end e validações de navegador.
- Consultar `QA.md` para os critérios aplicáveis.
- Nunca afirmar que testes passaram sem executá-los.

## 6. Identidade visual

Respeite a identidade Dark Premium definida em `DESIGN.md` e `DESIGN_SYSTEM.md`.

Diretrizes:

- Base escura com verde-limão utilizado de forma intencional.
- Tipografia com hierarquia clara.
- Composição com espaço negativo.
- Elementos visuais discretos.
- Cards somente quando fizerem sentido para o conteúdo.
- Animações moderadas e justificadas.
- Responsividade desde a concepção.

Evite:

- Estética genérica de template.
- Excesso de neon.
- Glitch e elementos de terminal decorativos.
- Cards idênticos para todo tipo de conteúdo.
- Bordas, labels e numerações meramente decorativas.
- Animações de entrada repetitivas em todas as seções.
- Gradientes decorativos sem função.
- Destaques visuais que prejudiquem a leitura.

O parallax não poderá interferir no scroll natural e deverá respeitar `prefers-reduced-motion`.

## 7. Conteúdo e posicionamento

- Inglês (`en`) é o idioma padrão.
- Português brasileiro (`pt-BR`) é o idioma alternativo.
- Não misturar idiomas.
- Não inventar experiências, cargos, métricas ou resultados.
- Não apresentar projetos em desenvolvimento como produtos lançados.
- Proteger informações confidenciais.
- Diferenciar experiência profissional de estudos acadêmicos.

Não introduzir expressões como:

- Open to Work.
- Available for Opportunities.
- Hire Me.

CTAs preferidos:

- Explore My Work.
- Get in Touch.
- Connect with Me.
- View Resume.

## 8. Arquitetura e tecnologia

- Respeitar `ARCHITECTURE.md`.
- Respeitar a stack efetivamente aprovada e instalada.
- Não presumir que tecnologias sugeridas já foram escolhidas.
- Não introduzir backend, banco de dados ou serviços externos sem necessidade e aprovação.
- Não adicionar dependências sem justificativa.
- Priorizar soluções simples e sustentáveis.

## 9. Segurança e operações

- Não expor credenciais.
- Não versionar arquivos sensíveis.
- Não executar comandos destrutivos sem autorização.
- Não alterar remotos Git.
- Não alterar configurações de autenticação ou infraestrutura sem autorização.
- Não executar commit ou push automaticamente.
- Não executar deploy sem autorização explícita.

A skill `commit-and-push` só poderá ser acionada mediante pedido explícito do usuário.

A conclusão de uma SPEC não representa autorização automática para commitar ou enviar alterações ao remoto.

## 10. Qualidade

Toda implementação deverá respeitar:

- TypeScript strict, caso a stack aprovada utilize TypeScript.
- Padrões de desenvolvimento.
- Responsividade.
- Acessibilidade.
- SEO.
- Testes aplicáveis.
- Critérios de aceitação da SPEC.
- Regras de segurança.

## 11. Entrega

Ao concluir uma tarefa, apresentar:

1. Resumo das alterações.
2. Arquivos criados ou modificados.
3. Decisões técnicas relevantes.
4. Testes executados e resultados.
5. Pendências ou limitações.
6. Divergências em relação à SPEC, se existirem.

Não declarar uma tarefa concluída quando houver requisitos obrigatórios pendentes.

## 12. Regra final

Atue como um desenvolvedor experiente integrado ao projeto.

Priorize soluções corretas, simples, consistentes, acessíveis e sustentáveis.

A qualidade da implementação é mais importante do que a quantidade de código ou a quantidade de skills utilizadas.
