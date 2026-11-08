import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { currentIndexingPolicy } from "./src/lib/seo/indexing";

const withNextIntl = createNextIntlPlugin();

// Fora de um ambiente indexável (local, preview ou sem SITE_INDEXING=allow), toda
// resposta pede aos buscadores que não indexem (SPEC-013, SEO-RF-05).
const { indexable } = currentIndexingPolicy();

// Cabeçalhos de segurança básicos (QA final). Ficam de fora o HSTS, que depende do
// HTTPS da hospedagem, e a CSP, que exigiria liberar os scripts inline do Next.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
];

const nextConfig: NextConfig = {
  // Não anuncia a tecnologia do servidor em `X-Powered-By`.
  poweredByHeader: false,
  // 404 única e localizada (src/app/global-not-found.tsx); ver o comentário nele.
  experimental: { globalNotFound: true },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      ...(indexable
        ? []
        : [
            {
              source: "/:path*",
              headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
            },
          ]),
      // O PDF do currículo traz telefone e e-mail: fica fora dos buscadores, mas
      // continua acessível pelo link do site (SPEC-009, RES-RF-09).
      {
        source: "/documents/resume/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
