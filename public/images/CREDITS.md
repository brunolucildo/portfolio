# Créditos e direitos das imagens

Origem, autoria e direitos de uso de cada grupo de imagens do site (SPEC-011).
Conferido em 2026-11-08. Os ícones de tecnologias têm o detalhe por arquivo em
[`technologies/LICENSES.md`](./technologies/LICENSES.md).

| Grupo | Arquivos | Origem e direitos | Data |
|---|---|---|---|
| Fotografia do Hero | `hero/bruno-lucildo-portrait.png` | Retrato do próprio Bruno Lucildo. Uso autorizado por ele, que também decidiu versioná-la no repositório. | 2026-11-07 |
| Telas do Reelix | `projects/reelix-*.png`, `projects/reelix-*.jpg` | Capturas do aplicativo Reelix, de autoria do Bruno, feitas na versão de desenvolvimento. Os pôsteres e os dados de filmes e séries vêm do TMDB; a legenda da página informa o crédito e que o produto não é endossado pelo TMDB. Termos: https://www.themoviedb.org/api-terms-of-use | 2026-11-07 |
| Telas do FintaLab | `projects/fintalab-*.png` | Capturas do protótipo estático do FintaLab, de autoria do Bruno. Pessoas, clubes e números são fictícios. | 2026-11-07 |
| Ícones de tecnologias | `technologies/*.svg` | devicon 2.18.0 (licença MIT) e Simple Icons (CC0). Os logotipos são marcas dos respectivos donos; o site não afirma aprovação nem parceria. Ver `technologies/LICENSES.md`. | 2026-11-08 |
| Ícone do site | gerado por código (`src/app/icon.tsx`, `apple-icon.tsx` e `favicon.ico/route.ts`) | Monograma tipográfico "BL" do projeto, em fonte Geist (SIL OFL, incluída no Next.js) com as cores do site. Não é um logotipo registrado. | 2026-11-08 |
| Imagem de compartilhamento | gerada por código (`src/app/[locale]/opengraph-image.tsx`) | Cartão tipográfico do projeto, com o texto do Hero e as cores do site. Sem fotografia. | 2026-11-08 |

## Regras para novas imagens

- Só entram imagens do próprio Bruno, capturas dos projetos dele ou arquivos com licença que permita o uso (registrar a licença aqui).
- Nenhuma imagem pode conter dado pessoal real, credencial ou metadados embutidos (EXIF, localização). O teste `e2e/assets.spec.ts` confere os metadados.
- Limites de peso: fotografia até 600 KB, cada tela de projeto até 300 KB e cada SVG até 15 KB.
