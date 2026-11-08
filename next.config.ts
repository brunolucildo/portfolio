import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // 404 única e localizada (src/app/global-not-found.tsx); ver o comentário nele.
  experimental: { globalNotFound: true },
  // O PDF do currículo traz telefone e e-mail: fica fora dos buscadores, mas
  // continua acessível pelo link do site (SPEC-009, RES-RF-09).
  async headers() {
    return [
      {
        source: "/documents/resume/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
