import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // 404 única e localizada (src/app/global-not-found.tsx); ver o comentário nele.
  experimental: { globalNotFound: true },
};

export default withNextIntl(nextConfig);
