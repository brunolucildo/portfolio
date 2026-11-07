# .specs/FEATURES.md

# Especificações das Funcionalidades — Bruno Lucildo

## 1. Objetivo

Este documento reúne as especificações iniciais das funcionalidades do portfólio pessoal.

As especificações descrevem o comportamento esperado de cada página e funcionalidade, servindo como referência para implementação e validação.

**Status geral:** Draft.

---

# SPEC-001 — Home

**Status:** In Review. Refinada, implementada e movida para [`001-home.md`](./001-home.md).

A Home é a principal porta de entrada do portfólio. Os requisitos, os critérios de aceitação, as perguntas abertas e o histórico de refinamento estão no arquivo dedicado.

---

# SPEC-002 — About

**Status:** In Review. Refinada e movida para [`002-about.md`](./002-about.md).

A seção About apresenta a trajetória, a filosofia profissional e os interesses de Bruno. Os requisitos, os critérios de aceitação, o rascunho dos textos, as perguntas abertas e o histórico de refinamento estão no arquivo dedicado.

---

# SPEC-003 — Experience

**Status:** Approved. Refinada e movida para [`003-experience.md`](./003-experience.md).

A seção Experience apresenta o histórico profissional de Bruno. Os requisitos, os critérios de aceitação, o rascunho dos textos, a validação das métricas, as perguntas abertas e o histórico de refinamento estão no arquivo dedicado.

---

# SPEC-004 — Projects

## 1. Contexto

A seção Projects apresenta projetos pessoais, acadêmicos e estudos de caso profissionais.

## 2. Objetivo

Demonstrar capacidade de planejamento, arquitetura, desenvolvimento e resolução de problemas.

## 3. Projetos iniciais

### Football Stat Analytics

Projeto acadêmico relacionado à análise de desempenho de atletas de futebol utilizando IA.

Informações que poderão ser apresentadas:

- Análise conversacional de atletas.
- Agentes especializados.
- Engenharia de prompts.
- Recuperação de informações.
- Memória com SQLite.
- Testes automatizados.
- Decisões sobre modelos de IA.

Deve ser identificado corretamente como projeto acadêmico.

### Reelix

Projeto de aplicativo para acompanhamento de filmes e séries.

Possíveis informações:

- Conceito do produto.
- Organização modular.
- Arquitetura.
- Experiência do usuário.
- Integrações externas.
- Estado de desenvolvimento.

Não apresentar como produto lançado enquanto não estiver efetivamente disponível.

### Estudos de caso profissionais

Apresentar desafios reais de engenharia de software, respeitando confidencialidade.

Exemplos:

- Modernização de sistemas legados.
- Arquitetura distribuída.
- Integração com RabbitMQ.
- Melhorias de desempenho.
- Evolução de sistemas críticos.

Resultados deverão ser validados antes da publicação.

## 4. Requisitos funcionais

- Exibir projetos selecionados.
- Apresentar categorias.
- Identificar estado atual.
- Exibir tecnologias.
- Permitir acesso aos detalhes.
- Disponibilizar links externos quando existentes.

## 5. Estrutura de detalhes

Cada projeto deverá possuir:

1. Overview.
2. Challenge.
3. Solution.
4. Architecture.
5. Technical Decisions.
6. Implementation.
7. Results.
8. Current State.
9. Links.

## 6. Critérios de aceitação

- Projetos identificados corretamente.
- Estado explícito.
- Tecnologias correspondentes à implementação real.
- Imagens otimizadas.
- Links válidos.
- Conteúdo traduzido.
- Informações confidenciais protegidas.

---

# SPEC-005 — Technologies

## 1. Contexto

A seção Technologies apresenta as tecnologias e ferramentas utilizadas profissionalmente ou exploradas em projetos.

## 2. Objetivo

Demonstrar familiaridade com o ecossistema técnico sem criar classificações artificiais de proficiência.

## 3. Categorias

Categorias iniciais:

- Languages.
- Backend.
- Databases.
- Messaging and Caching.
- Architecture.
- AI and Machine Learning.
- Tools and Infrastructure.

## 4. Requisitos funcionais

- Apresentar tecnologias por categoria.
- Utilizar ícones quando disponíveis.
- Manter organização visual consistente.
- Permitir relacionar tecnologias a projetos e experiências quando fizer sentido.

## 5. Regras

- Não inventar níveis de domínio.
- Não apresentar tecnologias apenas por tendência.
- Diferenciar experiência profissional de estudos.
- Não transformar a seção em uma lista excessiva de badges.

## 6. Critérios de aceitação

- Categorias coerentes.
- Tecnologias revisadas.
- Identidade visual respeitada.
- Layout responsivo.
- Informações consistentes nos idiomas.

---

# SPEC-006 — AI Lab

## 1. Contexto

O AI Lab é uma seção própria para experimentos, estudos e projetos relacionados à inteligência artificial.

## 2. Objetivo

Demonstrar exploração técnica, aprendizado e aplicação prática de IA, sem transformar o portfólio em um blog técnico.

## 3. Escopo

- Experimentos com LLMs.
- Agentes de IA.
- RAG.
- Prompt Engineering.
- Fine-tuning.
- Avaliação de modelos.
- Estudos acadêmicos.
- Provas de conceito.

## 4. Estrutura de cada experimento

- Nome.
- Objetivo.
- Contexto.
- Modelo utilizado.
- Tecnologias.
- Abordagem.
- Implementação.
- Resultados.
- Limitações.
- Aprendizados.
- Estado atual.

## 5. Requisitos funcionais

- Apresentar experimentos.
- Permitir visualizar detalhes.
- Identificar tecnologias e modelos.
- Exibir estado atual.
- Diferenciar estudo, PoC e projeto concluído.

## 6. Regras de conteúdo

- Não afirmar resultados não comprovados.
- Informar limitações relevantes.
- Não apresentar experimentos como produtos comerciais.
- Explicar abordagens de maneira compreensível.
- Priorizar aprendizado e decisões técnicas.

## 7. Requisitos visuais

- Identidade consistente com o restante do site.
- Composição visual própria, mas sem criar outra identidade.
- Cards específicos para experimentos.
- Elementos gráficos discretos.
- Animações moderadas.

## 8. Critérios de aceitação

- Experimentos classificados corretamente.
- Modelos e tecnologias identificados.
- Resultados e limitações documentados.
- Layout responsivo.
- Conteúdo traduzido.

---

# SPEC-007 — Contact

## 1. Contexto

A seção Contact oferece meios de comunicação e conexão profissional.

## 2. Objetivo

Facilitar o contato sem posicionar o portfólio exclusivamente como uma página de procura por emprego.

## 3. Canais previstos

- E-mail.
- LinkedIn.
- GitHub, quando definido.

## 4. Requisitos funcionais

- Exibir canais disponíveis.
- Permitir abrir os destinos corretamente.
- Apresentar feedback visual.
- Funcionar em dispositivos móveis.

Um formulário de contato poderá ser avaliado posteriormente, mas não é requisito da primeira versão.

## 5. Comunicação

CTAs permitidos:

- Get in Touch.
- Connect with Me.
- Send a Message.

Não utilizar mensagens de disponibilidade profissional.

## 6. Critérios de aceitação

- Links revisados.
- Endereço de e-mail válido.
- Navegação acessível.
- Layout responsivo.
- Conteúdo traduzido.

---

# SPEC-008 — Internationalization

## 1. Contexto

O site deverá oferecer conteúdo em inglês e português brasileiro.

## 2. Objetivo

Atender públicos internacionais e brasileiros, mantendo uma experiência consistente.

## 3. Idiomas

- `en`: padrão.
- `pt-BR`: alternativo.

## 4. Requisitos funcionais

- Identificar o idioma ativo.
- Permitir alternância.
- Preservar a página equivalente quando possível.
- Apresentar conteúdo traduzido.
- Utilizar URLs próprias por idioma.
- Configurar metadados e hreflang.

## 5. Regras

- Não misturar traduções.
- Não utilizar traduções literais sem revisão.
- Não perder o contexto da navegação durante a troca.
- Manter consistência de datas e formatos.

## 6. Critérios de aceitação

- Todas as páginas públicas disponíveis nos dois idiomas, salvo exceção documentada.
- Navegação de idioma funcionando.
- Metadados localizados.
- Nenhuma tradução essencial ausente.
- URLs coerentes.

---

# SPEC-009 — Resume

## 1. Contexto

O currículo disponibiliza uma versão formal e resumida da trajetória profissional.

## 2. Objetivo

Permitir acesso rápido ao histórico profissional em formato de documento.

## 3. Requisitos funcionais

- Disponibilizar currículo em PDF.
- Permitir abrir ou baixar o arquivo.
- Disponibilizar versões em inglês e português quando aprovadas.
- Manter o documento atualizado.
- Integrar o acesso ao menu principal como ação secundária.

## 4. Regras

- Não utilizar o currículo como conteúdo principal da Home.
- Não apresentar informações divergentes do site.
- Validar datas, cargos e tecnologias.
- Não publicar dados pessoais desnecessários.

## 5. Critérios de aceitação

- Arquivo acessível.
- PDF válido.
- Versão correta por idioma.
- Conteúdo atualizado.
- Link funcionando em desktop e mobile.

---

# SPEC-010 — Global Layout and Navigation

## 1. Contexto

O layout global estabelece a estrutura compartilhada entre todas as páginas.

## 2. Objetivo

Garantir consistência de navegação, identidade visual e comportamento.

## 3. Elementos

- Header.
- Navegação principal.
- Language Switcher.
- Conteúdo principal.
- Footer.
- Elementos compartilhados de layout.

## 4. Requisitos funcionais

- Navegar entre páginas.
- Indicar a localização atual.
- Alternar idiomas.
- Adaptar navegação ao mobile.
- Disponibilizar acesso ao currículo.
- Exibir links de contato no footer.

## 5. Requisitos não funcionais

- HTML semântico.
- Navegação por teclado.
- Responsividade.
- Contraste adequado.
- Foco visível.
- Ausência de scroll horizontal.
- Carregamento eficiente.

## 6. Critérios de aceitação

- Layout consistente em todas as páginas.
- Menu desktop funcional.
- Menu mobile funcional.
- Links corretos.
- Idioma preservado.
- Navegação acessível.

---

# SPEC-011 — Photography and Visual Assets

## 1. Contexto

O projeto poderá utilizar fotografia profissional e imagens de projetos para reforçar a identidade visual.

## 2. Objetivo

Utilizar elementos visuais autênticos e relevantes, sem comprometer o estilo Dark Premium.

## 3. Escopo

- Fotografia profissional.
- Imagem de apresentação.
- Imagens de projetos.
- Imagens de compartilhamento.
- Ícones e ilustrações.

## 4. Requisitos

- Utilizar imagens autorizadas.
- Otimizar dimensões e formatos.
- Preservar qualidade visual.
- Garantir contraste com o fundo.
- Utilizar texto alternativo quando necessário.
- Evitar imagens genéricas sem relação com o conteúdo.

## 5. Decisões pendentes

- Utilização de fotografia pessoal.
- Posição da fotografia no Hero ou About.
- Tratamento visual.
- Seleção das imagens de projetos.

## 6. Critérios de aceitação

- Imagens aprovadas.
- Arquivos otimizados.
- Direitos de uso verificados.
- Apresentação responsiva.
- Textos alternativos adequados.

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