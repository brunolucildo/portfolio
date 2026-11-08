import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/Badge";
import type { ExperimentState, ExperimentType } from "@/config/aiLab";
import { cn } from "@/lib/utils/cn";

/** O ponto é só reforço: o estado sempre aparece também em texto (AIL-RF-05). */
const stateDot: Record<ExperimentState, string> = {
  inDevelopment: "bg-primary",
  concluded: "bg-muted",
  planning: "border border-muted",
};

type ExperimentMetaProps = {
  type: ExperimentType;
  state: ExperimentState;
  className?: string;
};

/** Tipo (estudo, prova de conceito ou projeto concluído) e estado do experimento. */
export async function ExperimentMeta({
  type,
  state,
  className,
}: ExperimentMetaProps) {
  const t = await getTranslations("aiLab");

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <span className="text-small text-muted">{t(`types.${type}`)}</span>
      <Badge className="gap-2">
        <span
          aria-hidden="true"
          className={cn("size-1.5 rounded-full", stateDot[state])}
        />
        {t(`states.${state}`)}
      </Badge>
    </div>
  );
}
