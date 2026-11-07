import type { ComponentProps } from "react";
import { cn } from "@/lib/utils/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "text";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium " +
  "transition-colors duration-(--duration-fast) ease-standard " +
  "disabled:pointer-events-none disabled:opacity-50 " +
  "aria-disabled:pointer-events-none aria-disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-on-primary hover:bg-primary/90 active:bg-primary/80",
  secondary:
    "border border-border text-foreground hover:bg-surface-elevated active:bg-surface",
  ghost: "text-foreground hover:bg-surface-elevated active:bg-surface",
  text: "px-0! text-primary underline-offset-4 hover:underline active:text-primary/80",
};

const sizes: Record<ButtonSize, string> = {
  sm: "min-h-9 px-3 text-small",
  md: "min-h-11 px-5 text-body",
  lg: "min-h-12 px-6 text-body-lg",
};

type StyleOptions = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

/**
 * Classes do botão para uso em elementos de navegação (`<a>`, `Link`), mantendo
 * a aparência idêntica à do `<button>`.
 */
export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: StyleOptions = {}): string {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonProps = ComponentProps<"button"> &
  StyleOptions & {
    loading?: boolean;
  };

export function Button({
  variant,
  size,
  className,
  loading = false,
  disabled,
  type = "button",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonStyles({ variant, size, className })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <span
          aria-hidden="true"
          className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      ) : null}
      {children}
    </button>
  );
}
