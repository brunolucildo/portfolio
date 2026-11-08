import type { NeuralVariant } from "./neuralConfig";

/** Gerador determinístico: o servidor e o cliente produzem o mesmo desenho. */
function seeded(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const WIDTH = 1200;
const HEIGHT = 600;

function buildNetwork(count: number) {
  const next = seeded(count * 7919);
  const points = Array.from({ length: count }, () => ({
    x: Math.round(next() * WIDTH * 10) / 10,
    y: Math.round(next() * HEIGHT * 10) / 10,
    r: Math.round((1.4 + next() * 2.4) * 10) / 10,
    active: next() < 0.28,
  }));

  const limit = (WIDTH / count) * 3.2;
  const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let a = 0; a < points.length; a += 1) {
    for (let b = a + 1; b < points.length; b += 1) {
      const from = points[a];
      const to = points[b];
      if (from && to && Math.hypot(from.x - to.x, from.y - to.y) < limit) {
        lines.push({ x1: from.x, y1: from.y, x2: to.x, y2: to.y });
      }
    }
  }
  return { points, lines };
}

const networks = {
  hero: buildNetwork(34),
  closing: buildNetwork(14),
} as const;

/**
 * Desenho estático da rede (SPEC-012, NEU-RF-10): aparece sem JavaScript, enquanto
 * o canvas carrega e se o canvas 2D não estiver disponível. Decorativo.
 */
export function NeuralFallback({ variant }: { variant: NeuralVariant }) {
  const { points, lines } = networks[variant];

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="xMidYMid slice"
      className="neural-fallback absolute inset-0 size-full"
    >
      <g
        stroke="var(--color-neural-purple)"
        strokeOpacity="0.28"
        strokeWidth="1"
      >
        {lines.map((line) => (
          <line
            key={`${line.x1}-${line.y1}-${line.x2}-${line.y2}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
          />
        ))}
      </g>
      {points.map((point) => (
        <circle
          key={`${point.x}-${point.y}`}
          cx={point.x}
          cy={point.y}
          r={point.r}
          fill={
            point.active ? "var(--color-primary)" : "var(--color-neural-purple)"
          }
          fillOpacity={point.active ? 0.85 : 0.6}
        />
      ))}
    </svg>
  );
}
