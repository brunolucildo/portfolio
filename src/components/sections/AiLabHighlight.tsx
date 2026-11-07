import { getTranslations } from "next-intl/server";
import { buttonStyles } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { Link } from "@/i18n/navigation";

export async function AiLabHighlight() {
  const t = await getTranslations("home.aiLab");

  return (
    <Section
      id="ai-lab"
      title={t("title")}
      description={t("description")}
      className="border-t border-border"
    >
      <Link
        href="/ai-lab"
        className={buttonStyles({ variant: "secondary", size: "lg" })}
      >
        {t("link")}
      </Link>
    </Section>
  );
}
