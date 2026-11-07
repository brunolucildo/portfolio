# DEVELOPMENT.md

# Guia de Desenvolvimento — Bruno Lucildo

## 1. Objetivo

Este documento estabelece os padrões, ferramentas, convenções e fluxos de trabalho para o desenvolvimento do portfólio pessoal.

O objetivo é manter uma implementação organizada, consistente, sustentável e alinhada à arquitetura definida no `ARCHITECTURE.md`.

## 2. Princípios de desenvolvimento

- Priorizar soluções simples e legíveis.
- Evitar complexidade sem necessidade.
- Aplicar SOLID quando trouxer benefícios reais.
- Manter separação entre conteúdo, interface e configuração.
- Reutilizar componentes sem criar abstrações prematuras.
- Priorizar acessibilidade e desempenho.
- Não adicionar dependências sem justificativa.
- Manter o código fácil de compreender e modificar.

## 3. Ambiente de desenvolvimento

### 3.1. Tecnologias propostas

| Tecnologia | Finalidade |
|---|---|
| Node.js LTS | Ambiente de execução |
| pnpm | Gerenciamento de pacotes |
| Next.js | Framework |
| React | Interface |
| TypeScript | Linguagem |
| Tailwind CSS | Estilização |
| Biome | Lint e formatação |
| Git | Controle de versão |
| GitHub | Repositório e colaboração |

As versões deverão ser definidas no momento da inicialização do projeto, priorizando versões estáveis e compatíveis entre si.

### 3.2. Requisitos locais

Antes de iniciar:

- Node.js instalado.
- pnpm instalado.
- Git configurado.
- Acesso ao repositório.
- Editor com suporte a TypeScript.

### 3.3. Comandos esperados

```bash
# Instalar dependências
pnpm install

# Iniciar ambiente local
pnpm dev

# Verificar tipos
pnpm typecheck

# Executar lint e verificações
pnpm check

# Formatar arquivos
pnpm format

# Executar testes
pnpm test

# Executar testes E2E
pnpm test:e2e

# Gerar build
pnpm build
```

Os comandos deverão ser ajustados à configuração efetivamente adotada no projeto.

## 4. Organização do código

A organização deverá seguir a estrutura definida no `ARCHITECTURE.md`.

Diretrizes:

- Componentes visuais em `components/`.
- Elementos estruturais em `components/layout/`.
- Componentes compartilhados em `components/ui/`.
- Seções específicas em `components/sections/`.
- Conteúdo separado por idioma em `content/`.
- Configurações centralizadas em `config/`.
- Funções compartilhadas em `lib/`.
- Tokens visuais centralizados em `styles/`.

Não criar arquivos ou diretórios sem uma responsabilidade definida.

## 5. Convenções de código

### 5.1. Nomenclatura

- Componentes React: PascalCase.
- Funções e variáveis: camelCase.
- Constantes: camelCase ou UPPER_SNAKE_CASE quando representar constantes globais convencionais.
- Arquivos de componentes: PascalCase ou padrão único definido na inicialização.
- Tipos e interfaces: PascalCase.
- Pastas: kebab-case.

Exemplos:

```text
ProjectCard.tsx
ExperienceTimeline.tsx
language-switcher/
siteConfig.ts
```

### 5.2. TypeScript

- Manter `strict` habilitado.
- Evitar `any`.
- Preferir tipos explícitos nas fronteiras de dados.
- Evitar conversões de tipo sem justificativa.
- Não duplicar definições de tipos.
- Utilizar tipos menores e específicos quando necessário.

### 5.3. React e Next.js

- Priorizar Server Components.
- Utilizar Client Components somente quando necessário.
- Evitar componentes excessivamente grandes.
- Separar lógica reutilizável da apresentação quando houver benefício.
- Evitar estado global sem necessidade.
- Utilizar recursos nativos do Next.js sempre que possível.
- Não utilizar efeitos para resolver problemas que podem ser resolvidos diretamente durante a renderização.

### 5.4. Estilização

- Utilizar os tokens do `DESIGN_SYSTEM.md`.
- Evitar valores visuais duplicados.
- Manter consistência de espaçamento e tipografia.
- Evitar estilos inline recorrentes.
- Não utilizar cores fora da identidade visual sem justificativa.
- Manter responsividade desde a criação do componente.

## 6. Componentes

Um componente deverá ser criado quando existir uma responsabilidade visual ou funcional clara.

Diretrizes:

- Preferir componentes pequenos.
- Evitar componentes genéricos demais.
- Evitar duplicação de estruturas equivalentes.
- Separar componentes compartilhados dos específicos de uma seção.
- Definir propriedades com tipos claros.
- Garantir estados e acessibilidade.

Não transformar cada elemento HTML em um componente independente sem necessidade.

## 7. Gerenciamento de conteúdo

O conteúdo deverá permanecer separado da apresentação.

Regras:

- Não espalhar textos diretamente pelos componentes quando forem conteúdos editoriais.
- Manter traduções organizadas por idioma.
- Estruturar projetos e experiências com tipos definidos.
- Não inventar resultados, métricas ou tecnologias.
- Diferenciar projetos concluídos, em desenvolvimento e conceituais.
- Revisar o conteúdo antes de publicar.

## 8. Internacionalização

Idiomas:

- Inglês (`en`): padrão.
- Português (`pt-BR`): alternativa.

Regras:

- Não misturar idiomas.
- Manter traduções equivalentes.
- Preservar a página correspondente durante a troca de idioma, quando disponível.
- Utilizar a solução de internacionalização definida na arquitetura.
- Não duplicar componentes para cada idioma.

## 9. Git e versionamento

### 9.1. Branches

Padrão sugerido:

- `main`: versão estável.
- `feature/nome-da-funcionalidade`: novas funcionalidades.
- `fix/nome-do-ajuste`: correções.
- `docs/nome-do-documento`: documentação.

### 9.2. Commits

Adotar Conventional Commits.

Exemplos:

```text
feat: add project showcase section
fix: correct mobile navigation
docs: update development guidelines
style: refine hero typography
test: add language switcher coverage
refactor: simplify project card component
```

### 9.3. Pull Requests

Cada Pull Request deverá:

- Ter objetivo claro.
- Descrever as alterações.
- Informar como foi validado.
- Incluir imagens quando houver mudanças visuais relevantes.
- Não misturar alterações sem relação.
- Passar pelas verificações automatizadas.

## 10. Dependências

Antes de adicionar uma dependência, avaliar:

- Necessidade real.
- Tamanho e impacto no bundle.
- Manutenção do projeto.
- Segurança.
- Compatibilidade com a stack.
- Possibilidade de resolver com recursos nativos.

Não adicionar bibliotecas apenas por conveniência.

## 11. Animações e desempenho

- Priorizar CSS para interações simples.
- Utilizar Motion somente quando houver necessidade.
- Preferir `transform` e `opacity`.
- Respeitar `prefers-reduced-motion`.
- Evitar animações simultâneas em excesso.
- Simplificar efeitos no mobile.
- Não comprometer navegação ou leitura com parallax.

## 12. Segurança

- Não versionar credenciais.
- Manter `.env` fora do Git.
- Disponibilizar `.env.example` quando necessário.
- Não expor chaves privadas no frontend.
- Revisar dependências.
- Evitar HTML não confiável.
- Validar entradas de integrações externas.

## 13. Definition of Done

Uma implementação estará concluída quando:

- Atender aos requisitos da respectiva SPEC.
- Respeitar o sistema de design.
- Funcionar em desktop, tablet e mobile.
- Possuir acessibilidade adequada.
- Não apresentar erros de console relevantes.
- Passar nas verificações de tipos e lint.
- Possuir testes compatíveis com sua complexidade.
- Não introduzir regressões conhecidas.
- Estar documentada quando necessário.
- Ter sido validada em ambiente de preview.

## 14. Documentos relacionados

- `ARCHITECTURE.md`
- `DESIGN.md`
- `DESIGN_SYSTEM.md`
- `SEO.md`
- `QA.md`
- `RULES.md`
- `.specs/`

Este documento deverá evoluir conforme as práticas de desenvolvimento forem consolidadas.