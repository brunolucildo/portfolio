# QA.md

# Garantia de Qualidade — Bruno Lucildo

## 1. Objetivo

Definir a estratégia de garantia de qualidade do portfólio, assegurando que todas as páginas e funcionalidades atendam aos requisitos funcionais, visuais, técnicos e de acessibilidade.

A qualidade deverá ser considerada durante todo o desenvolvimento, não somente antes da publicação.

## 2. Princípios

- Prevenir problemas em vez de apenas corrigi-los.
- Testar de acordo com o risco e a complexidade.
- Validar a experiência real do usuário.
- Evitar regressões visuais e funcionais.
- Garantir consistência entre idiomas.
- Considerar acessibilidade desde o início.
- Validar o comportamento em diferentes dispositivos.

## 3. Camadas de testes

### 3.1. Testes unitários

Ferramenta proposta: Vitest.

Validar:

- Funções utilitárias.
- Formatação de conteúdo.
- Transformações de dados.
- Regras de navegação.
- Funções relacionadas à internacionalização.

Não criar testes unitários para elementos triviais sem comportamento relevante.

### 3.2. Testes de componentes

Ferramentas propostas:

- Vitest.
- React Testing Library.

Validar:

- Renderização.
- Estados.
- Interações.
- Links e botões.
- Navegação por teclado.
- Comportamento dos componentes compartilhados.

### 3.3. Testes end-to-end

Ferramenta adotada: Playwright (`@playwright/test`), somente com Chromium.

Estado atual (2026-11-07):

- Comando: `pnpm test:e2e`. A configuração em `playwright.config.ts` faz o build de produção e sobe o app na porta 3100, sempre testando um build novo; o relatório HTML fica em `playwright-report/`.
- Primeira instalação do navegador: `pnpm exec playwright install chromium`.
- Os testes ficam em `e2e/`, um arquivo por página (`home.spec.ts`, `about.spec.ts`), com regras de conteúdo compartilhadas em `e2e/support/content-rules.ts`.
- Cobertura atual: estrutura de títulos, metadados (`title`, descrição, canonical, `hreflang`, Open Graph, `noindex`), links e rotas por idioma, troca de idioma, expressões proibidas, ordem e foco do teclado, alvos de toque, largura de leitura e rolagem horizontal em 360, 390, 768, 1366, 1440 e 1920 px.
- Cada nova página implementada ganha seu `*.spec.ts` na mesma entrega, cobrindo os critérios de aceitação verificáveis pelo navegador da sua SPEC.
- Não cobrem: contraste, leitores de tela, LCP e CLS, que continuam em verificação manual ou com ferramenta própria.

Vitest e React Testing Library (3.1 e 3.2) ainda não foram adotados: entram quando houver lógica própria para testar, como a validação do formulário de contato.

Validar fluxos completos:

1. Acessar a Home.
2. Navegar pelas seções.
3. Alternar entre inglês e português.
4. Abrir detalhes de projetos.
5. Explorar o AI Lab.
6. Acessar informações profissionais.
7. Utilizar links de contato.
8. Acessar o currículo.

## 4. Testes funcionais

### Navegação

- Todos os itens de navegação levam ao destino correto.
- A seção ativa é identificada corretamente.
- O menu mobile abre e fecha.
- Links externos funcionam.
- A navegação por teclado é possível.

### Internacionalização

- Inglês é o idioma padrão.
- Português está disponível.
- A troca de idioma preserva a página equivalente quando disponível.
- Não existem textos misturados.
- Não existem traduções ausentes nas páginas públicas.

### Projetos

- Os cards apresentam informações corretas.
- O estado do projeto é exibido.
- Links estão corretos.
- Projetos conceituais não são apresentados como produtos lançados.
- Detalhes e tecnologias correspondem ao conteúdo cadastrado.

### AI Lab

- Experimentos são identificados corretamente.
- Modelos e tecnologias estão corretos.
- Limitações e estado atual são apresentados quando relevantes.
- Não existem alegações de resultados não comprovados.

### Contato

- E-mail utiliza endereço válido.
- Links externos apontam para os perfis corretos.
- Formulários, caso existam, apresentam validação e feedback adequados.

### Currículo

- O documento abre ou é baixado corretamente.
- O arquivo corresponde ao idioma selecionado, quando houver versões distintas.
- O arquivo está atualizado.

## 5. Testes visuais e responsividade

Validar, no mínimo:

| Categoria | Largura de referência |
|---|---:|
| Mobile pequeno | 360 px |
| Mobile | 390 px |
| Tablet | 768 px |
| Notebook | 1366 px |
| Desktop | 1440 px |
| Desktop amplo | 1920 px |

Verificar:

- Ausência de rolagem horizontal.
- Legibilidade dos textos.
- Hierarquia visual.
- Espaçamentos.
- Cards.
- Navegação.
- Imagens.
- Parallax.
- Estados de interação.
- Sobreposição de elementos.

Os valores são referências de teste, não limites rígidos de layout.

## 6. Acessibilidade

Objetivo: WCAG 2.2 nível AA.

Verificar:

- Contraste.
- Navegação por teclado.
- Foco visível.
- Ordem de tabulação.
- Textos alternativos.
- Rótulos de controles.
- Semântica HTML.
- Hierarquia de títulos.
- Mensagens de erro compreensíveis.
- Compatibilidade com leitores de tela nos fluxos principais.
- Movimento reduzido.

Ferramentas sugeridas:

- Lighthouse.
- axe-core.
- Testes manuais com teclado.
- Leitores de tela disponíveis nos ambientes de validação.

Ferramentas automatizadas não substituem testes manuais.

## 7. Movimento e animações

Validar:

- Animações não bloqueiam conteúdo.
- Parallax não interfere no scroll natural.
- Não há movimentos bruscos.
- O mobile possui efeitos simplificados.
- `prefers-reduced-motion` desativa movimentos não essenciais.
- Animações não causam deslocamentos inesperados de layout.

## 8. SEO e conteúdo

Verificar:

- Títulos e descrições.
- Canonical.
- `hreflang`.
- Sitemap.
- Robots.
- Open Graph.
- Dados estruturados, quando utilizados.
- URLs.
- Links internos e externos.
- Ausência de conteúdo duplicado indevido.

Também validar:

- Ortografia.
- Traduções.
- Datas.
- Cargos.
- Empresas.
- Tecnologias.
- Resultados e métricas.
- Estado dos projetos.

## 9. Segurança

Verificar:

- Ausência de credenciais no repositório.
- Arquivos sensíveis ignorados pelo Git.
- Dependências sem vulnerabilidades conhecidas relevantes.
- Links externos seguros.
- Conteúdo externo tratado como não confiável.
- Ausência de informações profissionais confidenciais.
- Formulários protegidos, caso sejam implementados.

## 10. Desempenho

Acompanhar Core Web Vitals:

| Indicador | Meta |
|---|---:|
| LCP | Até 2,5 s |
| INP | Até 200 ms |
| CLS | Até 0,1 |

Verificar também:

- Peso das imagens.
- Fontes.
- JavaScript enviado ao navegador.
- Quantidade de dependências.
- Tempo de carregamento.
- Desempenho em dispositivos móveis.

As metas devem ser avaliadas em ambiente representativo e, quando possível, com dados reais de usuários.

## 11. Ambientes de validação

### Development

Validação durante o desenvolvimento.

### Preview

Validação de alterações antes da publicação.

### Production

Verificação final após o deploy.

Não utilizar o ambiente de produção para testar funcionalidades incompletas.

## 12. Critérios de severidade

| Severidade | Definição | Tratamento |
|---|---|---|
| Crítica | Site indisponível, exposição de dados ou falha grave | Bloqueia publicação |
| Alta | Funcionalidade principal quebrada | Corrigir antes da publicação |
| Média | Problema localizado com alternativa de uso | Corrigir conforme prioridade |
| Baixa | Ajuste visual ou melhoria não bloqueante | Registrar e priorizar |

## 13. Checklist de publicação

- [ ] Build de produção concluído.
- [ ] Verificação TypeScript concluída.
- [ ] Lint e formatação concluídos.
- [ ] Testes automatizados aprovados.
- [ ] Fluxos principais validados.
- [ ] Inglês e português revisados.
- [ ] Layout mobile validado.
- [ ] Navegação por teclado validada.
- [ ] Movimento reduzido validado.
- [ ] SEO validado.
- [ ] Links revisados.
- [ ] Currículo atualizado.
- [ ] Conteúdo profissional revisado.
- [ ] Nenhuma informação confidencial publicada.
- [ ] Domínio e HTTPS funcionando.

## 14. Definition of Done

Uma funcionalidade será considerada aprovada quando:

- Atender à SPEC correspondente.
- Passar pelos testes aplicáveis.
- Funcionar nos idiomas suportados.
- Apresentar comportamento responsivo.
- Atender aos requisitos de acessibilidade.
- Não comprometer desempenho.
- Não apresentar defeitos críticos ou altos conhecidos.
- Estiver pronta para publicação.

## 15. Documentos relacionados

- `DEVELOPMENT.md`
- `SEO.md`
- `RULES.md`
- `.specs/`