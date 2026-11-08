import type { ComponentProps } from "react";
import { cn } from "@/lib/utils/cn";
import { CardLight } from "./CardLight";

type CardProps = ComponentProps<"div"> & {
  /**
   * Habilita o feedback de hover (borda, fundo e uma luz verde que segue o
   * cursor); use apenas quando o card tiver uma ação.
   */
  interactive?: boolean;
};

export function Card({
  interactive = false,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      data-card-light={interactive ? "" : undefined}
      className={cn(
        "rounded-lg border border-border bg-surface p-6",
        interactive &&
          "relative overflow-hidden transition-colors duration-(--duration-normal) ease-standard hover:border-muted hover:bg-surface-elevated",
        className,
      )}
      {...props}
    >
      {children}
      {interactive ? <CardLight /> : null}
    </div>
  );
}
