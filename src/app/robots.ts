import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { currentIndexingPolicy } from "@/lib/seo/indexing";
import { buildRobots } from "@/lib/seo/robots";

export default function robots(): MetadataRoute.Robots {
  const policy = currentIndexingPolicy();

  if (!policy.indexable && process.env.NODE_ENV === "production") {
    console.warn(`[seo] Indexação desligada. ${policy.reason}`);
  }

  return buildRobots(policy.indexable, siteConfig.url);
}
