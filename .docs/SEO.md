# SEO.md

# Estratégia de SEO — Bruno Lucildo

## 1. Objetivo

Definir os requisitos de otimização para mecanismos de busca e compartilhamento do portfólio pessoal.

O SEO deverá aumentar a capacidade de descoberta do site, apresentar corretamente a marca pessoal e facilitar o acesso aos projetos, experiências e conteúdos profissionais.

A estratégia não deverá comprometer a naturalidade dos textos ou a experiência do usuário.

## 2. Diretrizes

- Conteúdo original e relevante.
- Estrutura semântica correta.
- URLs simples e consistentes.
- Metadados específicos por página.
- Internacionalização adequada.
- Boa experiência mobile.
- Carregamento rápido.
- Imagens otimizadas.
- Links internos coerentes.
- Dados estruturados quando aplicáveis.

## 3. Público e temas de busca

Temas relacionados ao posicionamento profissional:

- Senior Backend Developer.
- Senior .NET Developer.
- Technical Lead.
- C#.
- ASP.NET Core.
- Backend Architecture.
- Distributed Systems.
- Microservices.
- PostgreSQL.
- RabbitMQ.
- Artificial Intelligence.
- AI Engineering.

As palavras-chave deverão aparecer naturalmente no conteúdo, sem repetição artificial.

## 4. Metadados

Cada página deverá possuir:

- Title.
- Meta description.
- Canonical URL.
- Open Graph title.
- Open Graph description.
- Open Graph image.
- Idioma correspondente.

Os títulos e descrições deverão ser únicos e representar corretamente o conteúdo da página.

### 4.1. Home

Título sugerido:

`Bruno Lucildo | Senior Backend Developer & Technical Lead`

Descrição sugerida:

`Explore the work, experience and technical projects of Bruno Lucildo, a backend developer and technical lead focused on scalable systems and software engineering.`

As versões em português deverão receber traduções naturais.

## 5. URLs

As URLs deverão ser:

- Curtas.
- Descritivas.
- Consistentes.
- Sem parâmetros desnecessários.
- Compatíveis com a estratégia de internacionalização.

Estrutura sugerida:

```text
/en
/en/about
/en/experience
/en/projects
/en/ai-lab
/en/contact

/pt-BR
/pt-BR/sobre
/pt-BR/experiencia
/pt-BR/projetos
/pt-BR/laboratorio-ia
/pt-BR/contato
```

Os caminhos definitivos deverão ser definidos na implementação.

## 6. Internacionalização e SEO

Cada página deverá declarar corretamente seu idioma.

Requisitos:

- URLs próprias para cada idioma.
- `hreflang` para versões equivalentes.
- Canonical adequado.
- Alternativas de idioma coerentes.
- Metadados traduzidos.
- Não utilizar traduções automáticas sem revisão.
- Evitar indexação de versões duplicadas sem necessidade.

O idioma padrão será inglês (`en`) e o alternativo será português brasileiro (`pt-BR`).

## 7. Estrutura semântica

Utilizar elementos HTML semânticos:

- `header`
- `nav`
- `main`
- `section`
- `article`
- `footer`

Regras:

- Um título principal `h1` coerente por página.
- Hierarquia correta entre `h2`, `h3` e demais títulos.
- Links com descrições claras.
- Imagens relevantes com texto alternativo.
- Não utilizar elementos semânticos apenas por aparência.

## 8. Dados estruturados

Avaliar a utilização de JSON-LD para:

- Person.
- WebSite.
- ProfilePage, quando aplicável.
- CreativeWork ou SoftwareApplication para projetos, somente quando as propriedades forem verdadeiras e adequadas.

Regras:

- Não inventar informações.
- Não declarar avaliações ou classificações inexistentes.
- Não marcar conteúdo que não esteja visível na página.
- Validar os dados estruturados antes da publicação.

## 9. Imagens e compartilhamento

Requisitos:

- Imagens em formatos modernos.
- Dimensões adequadas.
- Nomes de arquivos descritivos.
- Textos alternativos.
- Imagem Open Graph por página ou seção quando apropriado.
- Imagem de compartilhamento principal com identidade visual do portfólio.

Evitar imagens genéricas que não agreguem contexto.

## 10. Sitemap e robots

Implementar:

- `sitemap.xml`
- `robots.txt`

O sitemap deverá conter apenas URLs canônicas e indexáveis.

Páginas inexistentes, previews e ambientes não públicos não deverão ser indexados.

## 11. Links internos e externos

### Links internos

- Home para seções principais.
- Projetos relacionados às tecnologias.
- Experiências relacionadas a estudos de caso, quando apropriado.
- Navegação entre versões de idioma.

### Links externos

- LinkedIn.
- GitHub, quando definido.
- Repositórios públicos.
- Demonstrações de projetos.
- Currículo.

Links externos deverão ser revisados periodicamente.

## 12. Performance e SEO técnico

A implementação deverá observar:

- Core Web Vitals.
- HTML renderizado corretamente.
- Imagens otimizadas.
- Fontes otimizadas.
- Ausência de conteúdo essencial dependente exclusivamente de JavaScript.
- Redirecionamentos corretos.
- HTTPS.
- Tratamento de páginas inexistentes.
- Ausência de links quebrados.

## 13. Privacidade e indexação

- Não publicar informações pessoais desnecessárias.
- Não expor dados confidenciais de empresas ou projetos.
- Não indexar arquivos internos.
- Não indexar ambientes de preview.
- Não publicar métricas profissionais sem validação.

## 14. Ferramentas de validação

Ferramentas sugeridas:

- Google Search Console.
- Lighthouse.
- PageSpeed Insights.
- Rich Results Test.
- Validador de dados estruturados.
- Verificadores de links quebrados.

A escolha das ferramentas poderá ser ajustada conforme a hospedagem e as necessidades do projeto.

## 15. Critérios de aceitação

- Todas as páginas públicas possuem título e descrição.
- Cada idioma possui metadados próprios.
- URLs canônicas estão corretas.
- Sitemap e robots estão disponíveis.
- Open Graph está configurado.
- Hierarquia semântica está correta.
- Links internos e externos funcionam.
- Dados estruturados, quando utilizados, são válidos.
- Não existem páginas internas ou previews indexáveis indevidamente.

## 16. Documentos relacionados

- `CONTENT.md`
- `ARCHITECTURE.md`
- `DEVELOPMENT.md`
- `QA.md`
- `.specs/`