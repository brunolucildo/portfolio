import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { buildSitemap } from "@/lib/seo/sitemap";

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemap(siteConfig.url);
}
