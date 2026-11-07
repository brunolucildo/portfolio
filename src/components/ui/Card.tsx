import type { ComponentProps } from "react";
import { cn } from "@/lib/utils/cn";

type CardProps = ComponentProps<"div"> & {
  /** Habilita o feedback de hover; use apenas quando o card for interativo. */
  interactive?: boolean;
};

export function Card({ interactive = false, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-surface p-6",
        interactive &&
          "transition-colors duration-(--duration-normal) ease-standard hover:border-muted hover:bg-surface-elevated",
        className,
      )}
      {...props}
    />
  );
}
