# ARCHITECTURE.md

# Arquitetura Técnica — Bruno Lucildo

## 1. Objetivo

Este documento define a arquitetura técnica do portfólio pessoal de Bruno Lucildo, estabelecendo a estrutura da aplicação, tecnologias recomendadas, organização do código, estratégias de renderização, internacionalização, segurança, desempenho, testes e publicação.

A arquitetura deverá priorizar:

- Simplicidade e facilidade de manutenção.
- Desempenho e carregamento rápido.
- SEO e acessibilidade.
- Responsividade.
- Organização e reutilização de componentes.
- Facilidade de atualização do conteúdo.
- Baixo custo operacional.
- Evolução sem complexidade prematura.

O projeto não deve adotar uma arquitetura excessivamente complexa para atender às necessidades atuais.

---

## 2. Diretrizes arquiteturais

### 2.1. Princípios

A arquitetura será orientada pelos seguintes princípios:

- **KISS:** manter as soluções simples sempre que possível.
- **SOLID:** aplicar os princípios quando contribuírem para organização e manutenção.
- **Separation of Concerns:** separar interface, conteúdo, configuração e infraestrutura.
- **DRY:** evitar duplicação desnecessária.
- **Performance First:** priorizar carregamento rápido e boa experiência.
- **Security by Design:** considerar segurança desde a implementação.
- **Progressive Enhancement:** garantir que o conteúdo essencial continue acessível mesmo quando recursos visuais ou JavaScript não forem necessários.

### 2.2. Estratégia arquitetural

A aplicação será inicialmente um site frontend, com conteúdo predominantemente estático.

Não haverá necessidade inicial de:

- Backend próprio.
- Banco de dados.
- Sistema de autenticação.
- Painel administrativo.
- CMS complexo.
- APIs próprias.
- Microsserviços.

Novas dependências deverão ser introduzidas somente quando existir uma necessidade funcional concreta.

---

## 3. Stack tecnológica

As tecnologias abaixo representam a proposta inicial de implementação.

### 3.1. Frontend

| Tecnologia | Responsabilidade | Status |
|---|---|---|
| Next.js (App Router, geração estática) | Framework principal | Aprovado |
| React | Construção da interface | Aprovado |
| TypeScript (strict) | Tipagem e segurança de desenvolvimento | Aprovado |
| Tailwind CSS | Estilização e aplicação dos tokens | Aprovado |
| Biome | Formatação e análise estática | Aprovado |
| pnpm | Gerenciamento de pacotes | Aprovado |
| next-intl | Internacionalização | Aprovado |

A combinação Next.js, React e TypeScript oferece uma base adequada para um portfólio com conteúdo estático, internacionalização, SEO e possibilidade de evolução.

### 3.2. Interface e componentes

A implementação deverá utilizar componentes próprios e reutilizáveis.

Bibliotecas de componentes poderão ser avaliadas, mas não devem determinar a identidade visual do projeto.

A prioridade será manter controle sobre:

- Aparência.
- Comportamento.
- Acessibilidade.
- Responsividade.
- Animações.

### 3.3. Animações

A solução de animações deverá ser escolhida considerando:

- Compatibilidade com React.
- Facilidade de manutenção.
- Desempenho.
- Controle de animações durante o scroll.
- Suporte a movimento reduzido.

Uma biblioteca especializada poderá ser adotada se a implementação nativa não atender adequadamente aos efeitos definidos no `DESIGN.md`.

### 3.4. Backend

Não está prevista a implementação de backend próprio na primeira versão.

Funcionalidades como contato poderão utilizar inicialmente links de e-mail ou um serviço externo, caso seja necessário um formulário funcional.

A introdução de um backend deverá depender de requisitos futuros.

---

## 4. Arquitetura da aplicação

### 4.1. Visão geral

A aplicação será organizada em camadas lógicas:

1. **Presentation:** páginas, layouts e componentes.
2. **Content:** informações profissionais, projetos, experiências e traduções.
3. **Configuration:** configurações gerais, navegação e metadados.
4. **Infrastructure:** integrações externas, publicação e recursos de infraestrutura.

Essas divisões representam responsabilidades lógicas, não a necessidade de criar projetos ou serviços independentes.

### 4.2. Fluxo simplificado

O fluxo esperado será:

Usuário → Aplicação Next.js → Página/Componente → Conteúdo e Configurações → Renderização

Para conteúdo estático, as informações serão carregadas durante a construção ou renderização da página, evitando chamadas desnecessárias a APIs.

---

## 5. Organização de diretórios

Estrutura inicial sugerida:

```text
portfolio/
│
├── public/
│   ├── images/
│   ├── icons/
│   ├── fonts/
│   └── documents/
│       └── resume/
│
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── page.tsx
│   │   │   ├── about/
│   │   │   ├── experience/
│   │   │   ├── projects/
│   │   │   ├── ai-lab/
│   │   │   └── contact/
│   │   │
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   └── sitemap.ts
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── sections/
│   │   ├── projects/
│   │   ├── experience/
│   │   └── ai-lab/
│   │
│   ├── content/
│   │   ├── en/
│   │   └── pt-BR/
│   │
│   ├── config/
│   │   ├── site.ts
│   │   ├── navigation.ts
│   │   └── locales.ts
│   │
│   ├── lib/
│   │   ├── utils/
│   │   ├── seo/
│   │   └── i18n/
│   │
│   └── styles/
│       └── tokens.css
│
├── tests/
│
├── .env.example
├── biome.json
├── package.json
├── tsconfig.json
└── README.md
```

A estrutura poderá ser ajustada durante a implementação, evitando criar diretórios sem necessidade.

---

## 6. Organização de conteúdo

O conteúdo deverá ser separado da apresentação.

Informações como experiências, projetos, tecnologias e experimentos de IA não devem ficar espalhadas diretamente pelos componentes.

A estrutura deverá permitir:

- Atualizar informações sem alterar a estrutura visual.
- Manter versões em inglês e português.
- Reutilizar informações em diferentes páginas.
- Validar dados antes da renderização.
- Identificar o estado de cada projeto.

### 6.1. Projetos

Cada projeto deverá possuir informações estruturadas, como:

- Identificador.
- Nome.
- Descrição.
- Categoria.
- Tecnologias.
- Objetivo.
- Desafio.
- Solução.
- Decisões arquiteturais.
- Resultados.
- Estado atual.
- Links relacionados.

### 6.2. Experiência profissional

Cada experiência deverá apresentar:

- Empresa.
- Cargo.
- Período.
- Descrição.
- Responsabilidades.
- Resultados.
- Tecnologias.

### 6.3. AI Lab

Os experimentos deverão ser organizados separadamente dos projetos convencionais.

Cada registro poderá conter:

- Nome do experimento.
- Objetivo.
- Modelo utilizado.
- Tecnologias.
- Abordagem.
- Resultados.
- Limitações.
- Aprendizados.
- Estado atual.

---

## 7. Internacionalização (i18n)

O site deverá oferecer dois idiomas:

- Inglês (`en`): idioma padrão.
- Português (`pt-BR`): idioma alternativo.

### 7.1. Estratégia

A internacionalização deverá utilizar rotas distintas por idioma.

Exemplos:

```text
/en
/en/about
/en/projects

/pt-BR
/pt-BR/sobre
/pt-BR/projetos
```

Decisão aprovada: as URLs em `pt-BR` serão traduzidas, com mapa de rotas por idioma (pathnames do `next-intl`):

| Página | `en` | `pt-BR` |
|---|---|---|
| Home | `/en` | `/pt-BR` |
| About | `/en/about` | `/pt-BR/sobre` |
| Experience | `/en/experience` | `/pt-BR/experiencia` |
| Projects | `/en/projects` | `/pt-BR/projetos` |
| AI Lab | `/en/ai-lab` | `/pt-BR/ai-lab` |
| Contact | `/en/contact` | `/pt-BR/contato` |

A página de Technologies (SPEC-005) ainda não possui rota própria definida; será decidida na SPEC correspondente.

### 7.2. Regras

- O inglês será o idioma padrão.
- O usuário poderá alternar entre os idiomas.
- O conteúdo não deverá misturar idiomas.
- As traduções deverão ser naturais, não necessariamente literais.
- A troca de idioma deverá preservar a página equivalente, quando disponível.
- Cada idioma deverá possuir metadados adequados para SEO.
- As páginas deverão declarar corretamente seu idioma.

### 7.3. Conteúdo traduzido

Textos, descrições e informações específicas de cada idioma deverão permanecer organizados em arquivos ou estruturas próprias.

Não utilizar condicionais espalhadas pelos componentes para traduzir textos.

---

## 8. Estratégia de renderização

A estratégia principal será utilizar renderização estática sempre que possível.

### 8.1. Static Site Generation

Páginas como:

- Home.
- Sobre.
- Experiência.
- Projetos.
- Tecnologias.
- AI Lab.
- Contato.

Poderão ser geradas estaticamente durante o build.

### 8.2. Server Components

No Next.js, Server Components deverão ser a opção padrão.

Client Components deverão ser utilizados somente quando houver necessidade de interação no navegador, como:

- Menu mobile.
- Alternância de idioma interativa.
- Animações dependentes do scroll.
- Elementos com estado local.
- Interações específicas de interface.

### 8.3. Regras

- Evitar transformar páginas inteiras em Client Components sem necessidade.
- Evitar chamadas de rede para informações já disponíveis no conteúdo local.
- Priorizar HTML renderizado no servidor.
- Evitar JavaScript desnecessário no navegador.

---

## 9. SEO e compartilhamento

O site deverá ser preparado para mecanismos de busca e compartilhamento em redes profissionais.

Requisitos:

- Título e descrição por página.
- URLs consistentes.
- Metadados Open Graph.
- Imagens de compartilhamento.
- Sitemap XML.
- Robots.txt.
- Canonical URLs.
- Metadados específicos por idioma.
- Dados estruturados quando aplicáveis.

A marca pessoal deverá ser representada de maneira consistente nos metadados.

O SEO deverá priorizar termos relacionados à experiência profissional, desenvolvimento backend, .NET, arquitetura de software e inteligência artificial, sem repetição artificial de palavras-chave.

---

## 10. Desempenho

O desempenho deverá ser considerado desde a implementação.

### 10.1. Imagens

- Utilizar formatos modernos quando possível.
- Priorizar imagens otimizadas.
- Definir dimensões adequadas.
- Utilizar carregamento tardio para imagens fora da área inicial.
- Evitar imagens excessivamente grandes.
- Priorizar o carregamento dos elementos essenciais do Hero.

### 10.2. Animações

- Preferir transform e opacity.
- Evitar animações que provoquem recálculo constante de layout.
- Evitar excesso de elementos animados simultaneamente.
- Simplificar efeitos em dispositivos móveis.
- Respeitar `prefers-reduced-motion`.

### 10.3. JavaScript

- Evitar dependências desnecessárias.
- Carregar recursos sob demanda quando adequado.
- Priorizar componentes server-side.
- Evitar bibliotecas grandes para interações simples.

### 10.4. Métricas

A implementação deverá acompanhar os indicadores Core Web Vitals:

- LCP.
- INP.
- CLS.

Metas iniciais:

| Indicador | Meta |
|---|---:|
| LCP | Até 2,5 segundos |
| INP | Até 200 ms |
| CLS | Até 0,1 |

As métricas deverão ser avaliadas em condições representativas de uso, não apenas em ambiente local.

---

## 11. Segurança

Mesmo sem backend próprio, o projeto deverá seguir boas práticas de segurança.

Requisitos:

- Manter dependências atualizadas.
- Evitar exposição de credenciais.
- Não versionar arquivos `.env`.
- Utilizar HTTPS.
- Configurar cabeçalhos de segurança quando suportados pela hospedagem.
- Evitar conteúdo HTML não confiável.
- Validar dados recebidos por integrações externas.
- Minimizar dependências de terceiros.
- Não expor informações profissionais confidenciais.

Caso sejam adicionados formulários ou integrações, deverão ser avaliados proteção contra spam, validação de entrada e limites de requisição.

---

## 12. Testes e qualidade

A aplicação deverá possuir uma estratégia de testes proporcional à sua complexidade.

### 12.1. Testes unitários

Validar funções utilitárias, transformações de conteúdo e regras isoladas.

### 12.2. Testes de componentes

Validar:

- Renderização.
- Estados.
- Interações.
- Acessibilidade básica.
- Comportamento responsivo quando aplicável.

### 12.3. Testes end-to-end

Validar fluxos principais:

- Acesso à Home.
- Navegação entre páginas.
- Alternância de idioma.
- Abertura de projetos.
- Acesso ao AI Lab.
- Navegação para canais de contato.
- Abertura do currículo.

### 12.4. Qualidade estática

O pipeline deverá executar:

- Verificação de tipos.
- Lint.
- Formatação.
- Testes automatizados.
- Build de produção.

---

## 13. CI/CD e publicação

O processo de publicação deverá ser automatizado.

### 13.1. Fluxo proposto

1. Desenvolvimento em branch de funcionalidade.
2. Pull Request.
3. Execução de verificações automatizadas.
4. Revisão das alterações.
5. Merge na branch principal.
6. Build e publicação.
7. Verificação da versão publicada.

### 13.2. Hospedagem

A hospedagem deverá suportar aplicações Next.js e distribuição por CDN.

Alternativas a avaliar:

- Vercel.
- Cloudflare.
- Outra plataforma compatível com a estratégia de renderização escolhida.

A decisão final deverá considerar custo, facilidade de manutenção, desempenho e suporte ao domínio `.dev`.

### 13.3. Ambientes

Inicialmente:

- Development.
- Production.

Um ambiente de Preview poderá ser utilizado para validar Pull Requests antes da publicação.

---

## 14. Domínio e infraestrutura

O domínio será registrado utilizando a extensão `.dev`, por meio da Name.com.

O nome completo ainda deverá ser definido.

Requisitos:

- HTTPS obrigatório.
- Redirecionamento consistente entre domínio principal e variante `www`, conforme decisão final.
- DNS configurado corretamente.
- Metadados e URLs utilizando o domínio definitivo.
- E-mail profissional poderá ser avaliado separadamente.

---

## 15. Observabilidade e analytics

O projeto não exige uma infraestrutura complexa de observabilidade.

Poderão ser utilizados:

- Monitoramento de disponibilidade.
- Relatórios de desempenho.
- Analytics com foco em privacidade.
- Registro de erros de execução quando aplicável.

A ferramenta de analytics deverá ser escolhida considerando privacidade, custo e necessidade real de coleta de dados.

Não coletar informações pessoais sem finalidade clara.

---

## 16. Fora do escopo arquitetural inicial

Não implementar inicialmente:

- Backend próprio.
- Banco de dados.
- Microsserviços.
- Autenticação.
- Painel administrativo.
- CMS complexo.
- Sistema de comentários.
- Sistema de publicação de artigos.
- Integração com IA em tempo real.
- Infraestrutura de mensageria.
- Arquitetura distribuída.

Esses elementos poderão ser avaliados caso o escopo do produto evolua.

---

## 17. Decisões pendentes

| Decisão | Situação |
|---|---|
| Next.js | Aprovado |
| React | Aprovado |
| TypeScript (strict) | Aprovado |
| Tailwind CSS | Aprovado |
| Biome | Aprovado |
| pnpm | Aprovado |
| Biblioteca de componentes | Aprovado: componentes próprios sobre os tokens, sem shadcn/ui na v1 |
| Biblioteca de animações | Aprovado: CSS e IntersectionObserver nativos; Motion só se a implementação nativa não atender ao `DESIGN.md` |
| Estratégia definitiva de i18n | Aprovado: `next-intl`, rotas `[locale]`, URLs traduzidas em `pt-BR` |
| Rota da página Technologies | Pendente |
| Hospedagem | Pendente |
| Analytics | Pendente |
| Nome completo do domínio `.dev` | Pendente |
| Serviço de formulário de contato | Pendente |

As decisões deverão ser registradas conforme forem aprovadas.

---

## 18. Critérios de conclusão

A arquitetura estará pronta para orientar a implementação quando:

- A stack principal estiver definida.
- A estrutura de diretórios estiver validada.
- A estratégia de internacionalização estiver definida.
- A estratégia de renderização estiver validada.
- O fluxo de build e publicação estiver definido.
- Os requisitos de desempenho e segurança estiverem contemplados.
- A estratégia de testes estiver documentada.
- As decisões pendentes estiverem identificadas.

---

## 19. Documentos relacionados

- `BUSINESS.md`
- `CONTENT.md`
- `DESIGN.md`
- `DESIGN_SYSTEM.md`
- `ARCHITECTURE.md`

Este documento deverá ser atualizado sempre que decisões técnicas relevantes forem alteradas.