import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/Badge";
import { buttonStyles } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils/cn";

export async function FeaturedProject() {
  const t = await getTranslations("home.project");

  return (
    <Section id="featured-project" title={t("title")}>
      <Card interactive className="relative max-w-reading p-8 md:p-10">
        <div className="flex flex-wrap gap-2">
          <Badge>{t("category")}</Badge>
          <Badge>{t("status")}</Badge>
        </div>
        <h3 className="mt-6 text-h3 text-foreground">{t("name")}</h3>
        <p className="mt-3 max-w-reading text-muted">{t("description")}</p>
        <Link
          href="/projects"
          className={cn(
            buttonStyles({ variant: "text", size: "md" }),
            "mt-6 after:absolute after:inset-0 after:content-['']",
          )}
        >
          {t("link")}
        </Link>
      </Card>
    </Section>
  );
}
