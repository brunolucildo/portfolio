import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { currentIndexingPolicy } from "./src/lib/seo/indexing";

const withNextIntl = createNextIntlPlugin();

// Fora de um ambiente indexável (local, preview ou sem SITE_INDEXING=allow), toda
// resposta pede aos buscadores que não indexem (SPEC-013, SEO-RF-05).
const { indexable } = currentIndexingPolicy();

const nextConfig: NextConfig = {
  // 404 única e localizada (src/app/global-not-found.tsx); ver o comentário nele.
  experimental: { globalNotFound: true },
  async headers() {
    return [
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
