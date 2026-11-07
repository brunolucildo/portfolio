import { getTranslations } from "next-intl/server";
import { buttonStyles } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { Link } from "@/i18n/navigation";

const factKeys = ["years", "scope", "team"] as const;

export async function ExperienceHighlights() {
  const t = await getTranslations("home.experience");

  return (
    <Section id="experience" title={t("title")}>
      <ul className="grid gap-8 md:grid-cols-3 md:gap-10">
        {factKeys.map((key) => (
          <li key={key} className="border-t border-border pt-6">
            <p className="text-h3 text-foreground font-display">
              {t(`facts.${key}`)}
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-10">
        <Link
          href="/experience"
          className={buttonStyles({ variant: "text", size: "md" })}
        >
          {t("link")}
        </Link>
      </p>
    </Section>
  );
}
