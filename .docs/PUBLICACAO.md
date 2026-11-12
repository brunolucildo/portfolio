# PUBLICACAO.md

# Guia de publicação

Passo a passo para colocar o portfólio no ar. Decidido pelo Bruno em 2026-11-12: **Vercel (plano Hobby)** com o domínio **`brunolucildo.me` no Namecheap** (ano grátis, pela oferta do GitHub Student Developer Pack). Se a hospedagem mudar, as seções 3 a 5 precisam ser adaptadas. O restante (variáveis, indexação e conferências) vale para qualquer hospedagem.

Este guia não substitui o `README.md` (seção "Publicação e indexação") nem o `SEO.md`: ele organiza a sequência e acrescenta o que é específico da hospedagem.

## 1. Antes de começar

| Item | Estado |
|---|---|
| Código na `main`, SPECs 001 a 013 e QA final | Pronto |
| Conferências manuais do `QA-RELATORIO.md` (seção 7) | Concluídas pelo Bruno em 2026-11-12 (Safari real, celular, leitor de tela, textos en/pt-BR, mailto, Copiar, PDF, LinkedIn) |
| Conteúdo confidencial | Conferido pelo Bruno em 2026-11-12: nada sensível no site nem no PDF |
| Domínio | `brunolucildo.me` aprovado; a registrar no Namecheap |
| Hospedagem | Vercel Hobby aprovada; a conectar |

As conferências manuais já foram feitas (a indexação pode ser liberada). Se algum texto mudar depois disso, corrija antes do deploy de produção: depois que o Google indexa, corrigir texto errado leva dias.

## 2. Domínio (Namecheap)

1. Na página da oferta do GitHub Student Developer Pack, conecte a conta do GitHub ao Namecheap e resgate o **ano grátis de domínio `.me`**. Busque `brunolucildo.me` (nome aprovado pelo Bruno).
2. Antes de concluir, confira:
   - **Preço da renovação** do `.me` no segundo ano e se a **renovação automática** vem ligada (cobrança no cartão).
   - **Proteção do WHOIS** (privacidade), para não expor dados pessoais, e se ela está ativa neste domínio.
3. Ponha um lembrete no calendário uns 30 dias antes de o ano grátis vencer. Se a renovação for cara, o domínio pode ser transferido para outro registrador (o Cloudflare Registrar costuma cobrar perto do custo).
4. **Certificado SSL do Namecheap (oferta nº 2): não é necessário com a Vercel.** A Vercel emite e renova o certificado HTTPS sozinha (seção 5), e ela não usa certificado instalado por fora. Resgate a oferta só se um dia a hospedagem mudar para uma que exija certificado próprio.
5. Diferentemente do `.dev`, o `.me` não força HTTPS por si só. O HTTPS fica por conta da Vercel (redirecionamento de `http` para `https` e `Strict-Transport-Security`); confira os dois na seção 6.

## 3. Hospedagem (Vercel)

1. Crie ou entre na conta da Vercel e importe o repositório `brunolucildo/portfolio` (**Add New → Project**). O framework (Next.js) é detectado sozinho.
2. Mantenha os comandos padrão (`pnpm install`, `next build`). Não mude o diretório raiz.
3. **Não faça o primeiro deploy sem as variáveis da seção 4.** Se o primeiro build sair sem elas, o site publica com `localhost` no canonical e no Open Graph; basta refazer o deploy depois de defini-las, mas evita um build inútil.
4. O plano **Hobby** é para uso pessoal e não comercial, o que cobre um portfólio. Se o site passar a vender ou a divulgar serviços pagos, reavalie (plano Pro).

### Instalação com pnpm (resolvido em 2026-11-12)

O pnpm 12 acusava `ERR_PNPM_IGNORED_BUILDS` para `@parcel/watcher` e `@swc/core`. Os dois vêm só do `next-intl` (extração de mensagens e modo watch, recursos que o projeto não usa), e os binários de cada plataforma chegam como dependências opcionais. Por isso o `pnpm-workspace.yaml` declara os dois como `false` em `allowBuilds`: nenhum script de build de terceiros roda. Conferido numa cópia limpa: `pnpm install --frozen-lockfile`, `tsc`, `biome check` e `next build` passam.

Se a Vercel usar outra versão do pnpm e a instalação falhar, volte com o log; não aprove scripts de build por conta própria.

## 4. Variáveis de ambiente

Em **Settings → Environment Variables** do projeto na Vercel. As duas são lidas **na compilação**, então qualquer mudança exige um novo deploy.

| Variável | Production | Preview | Development |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://brunolucildo.me` (o domínio real, só a origem, sem barra final nem caminho) | vazia | vazia |
| `SITE_INDEXING` | `allow` | **vazia** | vazia |

Pontos de atenção:

- Marque cada variável **somente** no ambiente da coluna; a Vercel permite escolher Production, Preview e Development separadamente. `SITE_INDEXING=allow` em Preview faria cada branch aparecer nos buscadores.
- O build **falha de propósito** se `SITE_INDEXING=allow` for definido com uma URL sem `https` ou apontando para `localhost`. Isso é a guarda funcionando, não um defeito.
- Sem `SITE_INDEXING`, o site continua bloqueado (`Disallow: /` e `X-Robots-Tag: noindex, nofollow`). É o comportamento desejado nos previews.
- Não há segredos nas variáveis: as duas são públicas. Nenhuma credencial entra no repositório nem na Vercel para esta versão.

## 5. Domínio na Vercel e DNS

1. No projeto, **Settings → Domains**, adicione o domínio (`brunolucildo.me`). Adicione também o `www.brunolucildo.me` e deixe o `www` **redirecionar para o domínio sem `www`**, que é o canônico (`NEXT_PUBLIC_SITE_URL`).
2. A Vercel mostra os registros DNS exigidos. No Namecheap, abra **Domain List → Manage → Advanced DNS** e cadastre exatamente o que ela indicar (normalmente um registro `A` para o domínio raiz e um `CNAME` para o `www`). Use os valores que a própria Vercel exibe, não os de um tutorial.
   - Um domínio novo do Namecheap costuma vir com registros de página estacionada (um `CNAME` para `www` e um redirecionamento de URL no `@`). **Remova-os**, senão competem com os registros da Vercel.
   - Mantenha os servidores de nomes no padrão do Namecheap (**Namecheap BasicDNS**), que é onde a aba Advanced DNS vale.
3. Aguarde a propagação (de minutos a algumas horas). A Vercel emite o certificado HTTPS sozinha quando o DNS estiver correto; o status vira **Valid Configuration** no painel.
4. Faça o deploy de produção (ou **Redeploy** do último, com as variáveis já salvas).

## 6. Conferência depois do deploy

Substitua `SEU-DOMINIO` pelo domínio real. Os comandos usam `curl`, que existe no Windows 11.

```bash
curl -s https://SEU-DOMINIO/robots.txt
curl -sI https://SEU-DOMINIO/en | findstr /i "x-robots-tag strict-transport x-frame"
curl -s https://SEU-DOMINIO/sitemap.xml
```

| Conferência | Resultado esperado |
|---|---|
| `/robots.txt` | `Allow: /` e a linha `Sitemap:` com o domínio certo |
| Cabeçalhos de `/en` | **Sem** `X-Robots-Tag`; com `X-Frame-Options: DENY` e `X-Content-Type-Options: nosniff` |
| `/sitemap.xml` | 36 URLs, todas com o domínio de produção (nenhuma com `localhost` ou `vercel.app`) |
| `/documents/resume/bruno-lucildo-resume-en.pdf` | Abre, e a resposta traz `X-Robots-Tag: noindex` |
| Código-fonte da Home | `canonical`, `hreflang` e `og:image` com o domínio de produção; JSON-LD presente |
| `https://www.SEU-DOMINIO` | Redireciona para o domínio sem `www` |
| `http://SEU-DOMINIO` | Redireciona para `https` |
| Um endereço inexistente (`/en/nao-existe` e `/pt-BR/nao-existe`) | 404 localizada, com o layout do site |
| Ícone e cartão de compartilhamento | `/icon/small`, `/apple-icon` e `/en/opengraph-image` respondem (imagem) |
| Uma URL de preview da Vercel | Continua com `noindex` (confirma a separação das variáveis) |

Se algo vier com `localhost`, a variável não estava definida no momento do build: salve-a no ambiente certo e refaça o deploy.

## 7. Depois de publicado

1. **Google Search Console:** cadastre a propriedade do domínio (a verificação é por registro DNS `TXT` na aba Advanced DNS do Namecheap) e envie `https://SEU-DOMINIO/sitemap.xml`.
2. **Rich Results Test:** valide a Home (`WebSite` e `Person`) e o About (`ProfilePage`).
3. **Lighthouse em produção** (Home e uma página interna, em celular): a meta é manter os números do `QA-RELATORIO.md`.
4. **Visualização de compartilhamento:** cole o endereço no LinkedIn e confira o cartão. O LinkedIn guarda a imagem em cache; se estiver velha, use o Post Inspector deles para atualizar.
5. **HSTS e CSP:** a Vercel costuma enviar `Strict-Transport-Security` nas respostas; confira o cabeçalho na seção 6 e, se não houver, adicione-o em `next.config.ts` (hoje de fora de propósito, pois depende do HTTPS da hospedagem). A CSP continua adiada: exige liberar os scripts inline do Next e merece uma SPEC própria.
6. **Analytics:** continua sem decisão. Não instale nada antes de decidir (privacidade e aviso de cookies fazem parte da decisão).
7. Atualize o `README.md` (linha "Hospedagem, domínio e analytics") e o `QA-RELATORIO.md` com a data da publicação e os resultados.

## 8. Reverter ou pausar

- **Tirar o site dos buscadores:** remova (ou esvazie) `SITE_INDEXING` em Production e refaça o deploy. O `robots.txt` volta a `Disallow: /` e as respostas voltam a trazer `noindex`. Páginas já indexadas demoram a sair; no Search Console há a ferramenta de remoção temporária.
- **Voltar a um deploy anterior:** na aba **Deployments**, use **Promote to Production** no deploy bom.
- **Domínio errado nas variáveis:** corrija `NEXT_PUBLIC_SITE_URL` e refaça o deploy.

## 9. Fora do escopo desta versão

- Analytics e aviso de cookies.
- CSP.
- Serviço de formulário de contato (a página Contact não tem formulário).
- Currículo em português.
