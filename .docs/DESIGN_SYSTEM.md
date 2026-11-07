# DESIGN_SYSTEM.md

# Sistema de Design — Bruno Lucildo

## 1. Objetivo

Este documento define os padrões visuais e as regras de interface do portfólio pessoal de Bruno Lucildo.

O objetivo é garantir consistência visual, acessibilidade, reutilização de componentes e facilidade de evolução durante o desenvolvimento.

O sistema deve refletir o conceito **Dark Premium — Engineering Beyond Code**, transmitindo maturidade técnica, clareza, personalidade e sofisticação.

Este documento complementa o `DESIGN.md`, detalhando tokens, componentes, estados, comportamento e critérios de implementação.

---

## 2. Princípios do sistema

O sistema de design será orientado pelos seguintes princípios:

- **Consistência:** elementos equivalentes devem apresentar o mesmo comportamento e aparência.
- **Simplicidade:** evitar elementos decorativos sem função clara.
- **Hierarquia:** destacar informações importantes por meio de tamanho, contraste e espaçamento.
- **Reutilização:** componentes devem ser projetados para diferentes contextos sem duplicação desnecessária.
- **Acessibilidade:** garantir navegação por teclado, contraste e identificação dos elementos.
- **Desempenho:** animações e efeitos visuais não devem comprometer a experiência.
- **Responsividade:** todos os componentes devem funcionar em desktop, tablet e dispositivos móveis.

---

## 3. Design Tokens

Os tokens são valores centralizados que definem a identidade visual e devem ser reutilizados em toda a aplicação.

### 3.1. Cores

| Token | Valor | Aplicação |
|---|---|---|
| Background | `#0B0D0C` | Fundo principal |
| Surface | `#121613` | Cards e superfícies |
| Surface Elevated | `#191F1A` | Elementos destacados |
| Primary | `#B7F36B` | Destaques e ações principais |
| Text Primary | `#F3F5F2` | Textos principais |
| Text Secondary | `#929A91` | Textos auxiliares |
| Border | `#252B26` | Bordas e divisores |
| Success | `#8EDB75` | Feedback positivo |
| Warning | `#E9C46A` | Alertas |
| Error | `#E77979` | Erros |

Regras:

- O verde-limão deve ser utilizado com moderação.
- Textos extensos devem utilizar cores neutras de alto contraste.
- Bordas devem ser discretas.
- Cores semânticas devem ser reservadas para seus respectivos significados.
- Não utilizar cores vibrantes como decoração sem justificativa funcional.

### 3.2. Tipografia

**Famílias principais**

- Space Grotesk: títulos, chamadas e elementos de destaque.
- Inter: textos, descrições, navegação e informações auxiliares.

**Escala tipográfica inicial**

| Token | Tamanho | Aplicação |
|---|---:|---|
| Display | 64 px | Título principal do Hero |
| H1 | 48 px | Títulos de páginas |
| H2 | 36 px | Títulos de seções |
| H3 | 24 px | Títulos de cards |
| H4 | 20 px | Subtítulos |
| Body Large | 18 px | Textos de destaque |
| Body | 16 px | Texto padrão |
| Small | 14 px | Informações auxiliares |
| Caption | 12 px | Metadados |

Regras:

- Priorizar legibilidade em vez de tamanhos excessivamente grandes.
- Utilizar pesos entre 400 e 700 conforme a hierarquia.
- Evitar textos longos em caixa alta.
- Ajustar a escala tipográfica em telas menores.
- Manter uma largura confortável para leitura de parágrafos.

### 3.3. Espaçamento

Adotar uma escala baseada em múltiplos de 4 px.

| Token | Valor |
|---|---:|
| Space 1 | 4 px |
| Space 2 | 8 px |
| Space 3 | 12 px |
| Space 4 | 16 px |
| Space 5 | 20 px |
| Space 6 | 24 px |
| Space 8 | 32 px |
| Space 10 | 40 px |
| Space 12 | 48 px |
| Space 16 | 64 px |
| Space 20 | 80 px |
| Space 24 | 96 px |

Regras:

- Utilizar espaçamentos consistentes entre componentes.
- Manter maior distância entre seções do que entre elementos relacionados.
- Evitar valores arbitrários quando um token existente atender à necessidade.
- Ajustar espaçamentos em dispositivos menores.

### 3.4. Bordas e arredondamentos

| Token | Valor | Aplicação |
|---|---:|---|
| Radius Small | 6 px | Elementos compactos |
| Radius Medium | 10 px | Botões e campos |
| Radius Large | 16 px | Cards |
| Radius XL | 24 px | Blocos destacados |
| Radius Full | 999 px | Badges e elementos circulares |

As bordas devem utilizar a cor `Border`, com espessura padrão de 1 px.

### 3.5. Sombras

As sombras devem ser discretas, utilizadas principalmente para separar superfícies e criar profundidade.

- Evitar sombras muito claras ou excessivamente contrastantes.
- Preferir profundidade por diferença de superfícies.
- Não utilizar sombras coloridas como padrão.
- Reservar efeitos de brilho verde para situações pontuais.

### 3.6. Largura e estrutura

Valores iniciais para validação durante a implementação:

- Container principal: máximo de 1200 px.
- Container de leitura: máximo de 760 px.
- Padding lateral desktop: 32 px.
- Padding lateral tablet: 24 px.
- Padding lateral mobile: 20 px.

O conteúdo deve permanecer centralizado, respeitando a hierarquia e a largura adequada de cada seção.

---

## 4. Componentes

Os componentes abaixo representam a base visual do projeto. A implementação deverá priorizar reutilização sem criar abstrações desnecessárias.

### 4.1. Button

Responsável por ações e navegação.

Variantes:

- Primary: fundo verde-limão e texto escuro.
- Secondary: fundo transparente e borda discreta.
- Ghost: sem fundo e sem borda.
- Text: ação apresentada como texto com destaque visual.

Tamanhos:

- Small
- Medium
- Large

Estados:

- Default
- Hover
- Focus Visible
- Active
- Disabled
- Loading, quando aplicável.

Regras:

- Áreas clicáveis devem ser confortáveis.
- O estado de foco deve ser claramente visível.
- Animações de hover devem ser discretas.
- Não utilizar botões para elementos que não executam ações.

### 4.2. Navigation

Responsável pela navegação principal.

Itens:

- Home
- About
- Experience
- Projects
- AI Lab
- Contact
- Resume

Regras:

- Navegação simples e discreta.
- Indicação visual da seção ativa.
- Menu mobile acessível por teclado.
- Currículo deve ter destaque secundário.
- Não utilizar indicadores de disponibilidade profissional.

### 4.3. Container

Responsável por limitar e organizar o conteúdo.

Variantes:

- Main Container
- Reading Container
- Full Width Container

Deve garantir alinhamento consistente entre seções.

### 4.4. Section

Componente estrutural utilizado para organizar as áreas do site.

Deve permitir:

- Identificação da seção.
- Título e descrição opcionais.
- Espaçamento vertical consistente.
- Variações de composição.
- Elementos decorativos opcionais.

### 4.5. Card

Componente utilizado para agrupar informações relacionadas.

Características:

- Fundo Surface.
- Borda discreta.
- Arredondamento consistente.
- Espaçamento interno padronizado.
- Hover apenas quando existir interação.

### 4.6. Project Card

Apresenta projetos e estudos de caso.

Informações possíveis:

- Nome do projeto.
- Descrição curta.
- Categoria.
- Tecnologias utilizadas.
- Estado atual.
- Imagem ou representação visual.
- Link para detalhes.

O estado do projeto deve ser explícito, utilizando classificações como:

- Concluído.
- Em desenvolvimento.
- Experimental.
- Conceitual.

Não apresentar projetos planejados como produtos lançados.

### 4.7. Experience Item

Utilizado na seção de experiência profissional.

Informações:

- Empresa.
- Cargo.
- Período.
- Contexto.
- Responsabilidades.
- Conquistas.
- Tecnologias relacionadas.

A apresentação poderá utilizar uma timeline vertical, desde que permaneça legível em dispositivos móveis.

### 4.8. Technology Badge

Apresenta tecnologias, linguagens e ferramentas.

Regras:

- Utilizar estilo discreto.
- Evitar indicadores artificiais de proficiência.
- Organizar por categorias.
- Não transformar a seção em uma coleção excessiva de etiquetas.

### 4.9. AI Experiment Card

Componente específico para o AI Lab.

Informações:

- Nome do experimento.
- Objetivo.
- Tecnologias e modelos utilizados.
- Abordagem técnica.
- Estado atual.
- Aprendizados e limitações.

Deve diferenciar experimentos, provas de conceito e projetos concluídos.

### 4.10. Contact Link

Apresenta canais de contato e redes profissionais.

Exemplos:

- E-mail.
- LinkedIn.
- GitHub.

Deve apresentar feedback visual de interação e foco acessível.

### 4.11. Language Switcher

Permite alternar entre inglês e português.

Regras:

- Inglês como idioma padrão.
- Português como alternativa.
- Identificação clara do idioma ativo.
- Preservar a página atual durante a troca de idioma, quando houver tradução correspondente.
- Não misturar idiomas na mesma interface.

---

## 5. Estados e interações

Componentes interativos devem definir seus estados de forma consistente.

| Estado | Comportamento esperado |
|---|---|
| Default | Aparência padrão |
| Hover | Feedback visual discreto |
| Focus Visible | Destaque acessível ao navegar por teclado |
| Active | Indicação de interação |
| Disabled | Aparência de indisponibilidade |
| Loading | Indicação de processamento, quando aplicável |

Regras gerais:

- O hover não pode ser a única forma de comunicar uma informação.
- O foco deve permanecer visível.
- Elementos desabilitados devem ter seu comportamento claramente definido.
- Não utilizar animações que dificultem a leitura.

---

## 6. Motion Design

As animações devem complementar a experiência, sem competir com o conteúdo.

### 6.1. Transições

Valores iniciais:

| Token | Duração | Aplicação |
|---|---:|---|
| Fast | 150 ms | Hover e feedback |
| Normal | 250 ms | Transições de componentes |
| Slow | 400 ms | Entrada de elementos e transições de seção |

Utilizar curvas de aceleração suaves e consistentes.

### 6.2. Animações permitidas

- Fade in.
- Slide up discreto.
- Alteração de opacidade.
- Pequenas mudanças de escala.
- Transições de cor.
- Movimentos parallax controlados.

### 6.3. Parallax

O parallax será utilizado principalmente no Hero.

Pode envolver:

- Elementos geométricos.
- Camadas de fundo.
- Gradientes.
- Fotografia profissional, caso utilizada.
- Elementos gráficos decorativos.

Em outras seções, utilizar apenas quando houver benefício visual claro.

Restrições:

- Não alterar o comportamento natural do scroll.
- Não utilizar scroll hijacking.
- Não comprometer a leitura.
- Evitar excesso de camadas.
- Simplificar ou remover efeitos em dispositivos móveis.
- Respeitar a preferência `prefers-reduced-motion`.

### 6.4. Acessibilidade e movimento reduzido

Quando o usuário ativar a preferência por movimento reduzido:

- Remover parallax.
- Desabilitar movimentos decorativos não essenciais.
- Reduzir transições.
- Manter todas as informações e funcionalidades disponíveis.

---

## 7. Responsividade

Breakpoints iniciais, sujeitos a validação durante a implementação:

| Nome | Largura |
|---|---:|
| Mobile | Até 767 px |
| Tablet | 768–1023 px |
| Desktop | 1024–1439 px |
| Large Desktop | A partir de 1440 px |

Regras:

- Priorizar uma experiência mobile funcional.
- Evitar rolagem horizontal.
- Adaptar grids e cards conforme o espaço disponível.
- Reduzir títulos muito grandes em telas menores.
- Simplificar efeitos visuais no mobile.
- Manter áreas de interação confortáveis.
- Garantir que a navegação continue intuitiva.

---

## 8. Acessibilidade

O objetivo é seguir as diretrizes WCAG 2.2 nível AA.

Requisitos:

- Contraste adequado entre texto e fundo.
- Navegação completa por teclado.
- Indicadores de foco visíveis.
- Estrutura semântica de títulos.
- Textos alternativos para imagens relevantes.
- Identificação acessível de botões e links.
- Não utilizar somente cores para transmitir informações.
- Respeitar preferências de movimento reduzido.
- Garantir legibilidade com zoom.
- Evitar elementos interativos pequenos ou difíceis de alcançar.

---

## 9. Diretrizes de implementação

O sistema de design deverá ser implementado de maneira independente da escolha definitiva de framework ou biblioteca visual.

Diretrizes:

- Centralizar tokens de design.
- Evitar valores visuais duplicados.
- Manter componentes pequenos e reutilizáveis.
- Separar estrutura, conteúdo e apresentação.
- Evitar dependências visuais desnecessárias.
- Não criar abstrações sem necessidade real.
- Garantir consistência entre os idiomas.
- Priorizar componentes semanticamente corretos.

A escolha de framework, biblioteca de componentes, solução de animação e estratégia de estilização deverá ser documentada na arquitetura técnica do projeto.

---

## 10. Critérios de qualidade

Uma implementação será considerada aderente ao sistema quando:

- Respeitar a identidade visual definida.
- Utilizar os tokens centralizados.
- Manter consistência entre componentes.
- Apresentar comportamento adequado em diferentes resoluções.
- Garantir navegação por teclado.
- Respeitar preferências de acessibilidade.
- Utilizar animações de forma moderada.
- Não comprometer desempenho.
- Manter conteúdo e interações legíveis.
- Não introduzir elementos que contradigam o posicionamento profissional.

---

## 11. Decisões pendentes

Os seguintes pontos deverão ser validados durante a evolução do projeto:

- Framework e biblioteca de interface.
- Estratégia definitiva de estilização.
- Biblioteca ou abordagem de animações.
- Implementação da fotografia profissional.
- Composição final do Hero.
- Valores definitivos de breakpoints.
- Ajustes da escala tipográfica após os primeiros protótipos.

---

## 12. Relação com os demais documentos

Este documento deve ser interpretado em conjunto com:

- `BUSINESS.md`: objetivos, posicionamento e escopo do produto.
- `CONTENT.md`: conteúdo, mensagens e estrutura textual.
- `DESIGN.md`: direção visual, composição e referências.
- `DESIGN_SYSTEM.md`: tokens, componentes e regras de interface.

Novas decisões visuais devem atualizar este documento para evitar divergências entre planejamento e implementação.