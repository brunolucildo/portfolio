/**
 * Marcas gráficas abstratas da seção Philosophy (SPEC-012, NEU-RF-11). São
 * decorativas e animam de forma discreta (globals.css); sem animação, ficam no
 * estado completo.
 */

const satellites = [
  [80, 18],
  [120, 38],
  [120, 82],
  [80, 102],
  [40, 82],
  [40, 38],
] as const;

type MarkProps = { className?: string };

function Mark({
  className,
  children,
}: MarkProps & { children: React.ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 160 120"
      className={className}
      fill="none"
      strokeWidth="1"
    >
      {children}
    </svg>
  );
}

/** Explore: um nó central e nós que se espalham em volta. */
export function ExploreMark({ className }: MarkProps) {
  return (
    <Mark className={className}>
      <g className="neural-mark-spread">
        {satellites.map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <line
              x1="80"
              y1="60"
              x2={x}
              y2={y}
              stroke="var(--color-neural-purple)"
              strokeOpacity="0.55"
            />
            <circle cx={x} cy={y} r="3" fill="var(--color-neural-purple)" />
          </g>
        ))}
      </g>
      <circle cx="80" cy="60" r="5" fill="var(--color-primary)" />
    </Mark>
  );
}

/** Experiment: dois nós que se ligam e se desligam. */
export function ExperimentMark({ className }: MarkProps) {
  return (
    <Mark className={className}>
      <line
        className="neural-mark-link"
        x1="30"
        y1="60"
        x2="130"
        y2="60"
        stroke="var(--color-neural-purple)"
        strokeOpacity="0.7"
      />
      <circle cx="30" cy="60" r="5" fill="var(--color-neural-purple)" />
      <circle cx="130" cy="60" r="5" fill="var(--color-neural-purple)" />
      <circle
        className="neural-mark-pulse"
        cx="80"
        cy="60"
        r="4"
        fill="var(--color-primary)"
      />
    </Mark>
  );
}

/** Understand: linhas que convergem a um ponto. */
export function UnderstandMark({ className }: MarkProps) {
  return (
    <Mark className={className}>
      {[
        [14, 20],
        [14, 100],
        [60, 8],
        [60, 112],
        [146, 60],
      ].map(([x, y]) => (
        <line
          key={`${x}-${y}`}
          className="neural-mark-converge"
          x1={x}
          y1={y}
          x2="92"
          y2="60"
          stroke="var(--color-neural-purple)"
          strokeOpacity="0.6"
        />
      ))}
      <circle
        className="neural-mark-pulse"
        cx="92"
        cy="60"
        r="6"
        fill="var(--color-primary)"
      />
    </Mark>
  );
}
