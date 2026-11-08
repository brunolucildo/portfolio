import {
  createFrameMonitor,
  degrade,
  MAX_DEGRADES,
  MIN_NODES,
  type ParallaxMode,
} from "./neuralConfig";

/**
 * Motor da rede neural do AI Lab (SPEC-012), em Canvas 2D e sem dependências.
 * Nós com posição em três dimensões são projetados em perspectiva, com
 * conexões que se desenham, partículas que percorrem as conexões, reação ao
 * cursor e parallax. É carregado depois da hidratação (NEU-RNF-02).
 */

export type NeuralEngineOptions = {
  container: HTMLElement;
  canvas: HTMLCanvasElement;
  nodes: number;
  pixelRatioCap: number;
  parallax: ParallaxMode;
  /** Ponteiro fino (mouse): habilita a reação ao cursor. */
  pointer: boolean;
  /** `false` desenha um único quadro estático (movimento reduzido). */
  animate: boolean;
  onState: (state: "running" | "static") => void;
  onDegrade: (degrades: number) => void;
};

export type NeuralEngine = { destroy: () => void };

const GREEN = "183, 243, 107";
const PURPLE = "167, 139, 250";
const WHITE = "243, 245, 242";

const FOV = 2.2;
const DEPTH_OFFSET = 1.4;
const POINTER_RADIUS = 150;
const STATIC_YAW = 0.35;
const MAX_FRAME_DELTA = 64;
const LINK_GROW_MS = 900;

type NeuralNode = {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  age: number;
  life: number;
  active: boolean;
  // Posição projetada no quadro atual.
  sx: number;
  sy: number;
  depth: number;
  alpha: number;
};

type Particle = {
  a: number;
  b: number;
  t: number;
  speed: number;
  green: boolean;
};

const random = (min: number, max: number) => min + Math.random() * (max - min);
const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));
const smooth = (value: number) => value * value * (3 - 2 * value);

function spawnNode(instantlyVisible: boolean): NeuralNode {
  const life = random(7, 15);
  return {
    x: random(-1, 1),
    y: random(-0.85, 0.85),
    z: random(-1.6, 1.6),
    vx: random(-0.025, 0.025),
    vy: random(-0.02, 0.02),
    vz: random(-0.025, 0.025),
    age: instantlyVisible ? random(1.4, life * 0.6) : 0,
    life,
    active: Math.random() < 0.28,
    sx: 0,
    sy: 0,
    depth: 0,
    alpha: 0,
  };
}

/** Inicia a rede. Devolve `null` quando o navegador não oferece canvas 2D. */
export function startNeuralNetwork(
  options: NeuralEngineOptions,
): NeuralEngine | null {
  const { container, canvas, pixelRatioCap, parallax, pointer, animate } =
    options;
  const context = canvas.getContext("2d");
  if (!context) return null;
  const ctx: CanvasRenderingContext2D = context;

  const nodes: NeuralNode[] = Array.from({ length: options.nodes }, () =>
    spawnNode(true),
  );
  const links = new Map<number, { born: number; seen: number }>();
  let linkList: [number, number][] = [];
  const particles: Particle[] = [];

  let width = 0;
  let height = 0;
  let ratio = 1;
  let frameCount = 0;
  let clock = 0;
  let last = 0;
  let raf = 0;
  let destroyed = false;
  let inView = true;
  let degrades = 0;
  let yaw = STATIC_YAW;
  let pitch = 0;
  let yawTarget = 0;
  let pitchTarget = 0;
  let cursorX = -9999;
  let cursorY = -9999;
  let cursorActive = false;
  let lastShift = Number.NaN;
  const monitor = createFrameMonitor();

  container.dataset.neuralPointer = "idle";

  function resize() {
    const rect = container.getBoundingClientRect();
    width = Math.max(1, Math.round(rect.width));
    height = Math.max(1, Math.round(rect.height));
    ratio = Math.min(window.devicePixelRatio || 1, pixelRatioCap);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function linkDistance() {
    // Mantém a conectividade parecida com menos nós.
    return 0.72 * (90 / Math.max(nodes.length, 1)) ** (1 / 3);
  }

  function project(offset: number) {
    const cosY = Math.cos(yaw);
    const sinY = Math.sin(yaw);
    const cosX = Math.cos(pitch);
    const sinX = Math.sin(pitch);
    const halfW = width / 2;
    const halfH = height / 2;
    const depthShift = parallax === "off" ? 0 : offset;

    for (const node of nodes) {
      const x1 = node.x * cosY - node.z * sinY;
      const z1 = node.x * sinY + node.z * cosY;
      const y1 = node.y * cosX - z1 * sinX;
      const z2 = node.y * sinX + z1 * cosX;
      const scale = FOV / (FOV + z2 + DEPTH_OFFSET);
      const near = clamp((scale - 0.4) / 0.8, 0, 1);

      node.depth = near;
      node.sx = halfW + x1 * scale * halfW * 0.95;
      node.sy = halfH + y1 * scale * halfH * 0.9 - depthShift * 0.07 * near;

      const fadeIn = smooth(clamp(node.age / 1.4, 0, 1));
      const fadeOut = smooth(clamp((node.life - node.age) / 1.4, 0, 1));
      node.alpha = fadeIn * fadeOut * (0.65 + 0.35 * near);
    }
  }

  function applyPointer() {
    if (!cursorActive) return;
    for (const node of nodes) {
      const dx = node.sx - cursorX;
      const dy = node.sy - cursorY;
      const distance = Math.hypot(dx, dy);
      if (distance > 0 && distance < POINTER_RADIUS) {
        const push = (1 - distance / POINTER_RADIUS) * 18 * (0.4 + node.depth);
        node.sx += (dx / distance) * push;
        node.sy += (dy / distance) * push;
        node.alpha = Math.min(
          1,
          node.alpha + (1 - distance / POINTER_RADIUS) * 0.7,
        );
      }
    }
  }

  function updateLinks(now: number, grown: boolean) {
    const limit = linkDistance();
    const limitSquared = limit * limit;
    frameCount += 1;
    linkList = [];

    for (let a = 0; a < nodes.length; a += 1) {
      const nodeA = nodes[a];
      if (!nodeA) continue;
      for (let b = a + 1; b < nodes.length; b += 1) {
        const nodeB = nodes[b];
        if (!nodeB) continue;
        const dx = nodeA.x - nodeB.x;
        const dy = nodeA.y - nodeB.y;
        const dz = nodeA.z - nodeB.z;
        if (dx * dx + dy * dy + dz * dz > limitSquared) continue;

        const key = a * 1000 + b;
        const known = links.get(key);
        if (known) {
          known.seen = frameCount;
        } else {
          links.set(key, {
            born: grown ? now - LINK_GROW_MS : now,
            seen: frameCount,
          });
        }
        linkList.push([a, b]);
      }
    }

    for (const [key, value] of links) {
      if (value.seen !== frameCount) links.delete(key);
    }
  }

  function drawLinks(now: number) {
    const limit = linkDistance();
    ctx.lineCap = "round";

    for (const [a, b] of linkList) {
      const nodeA = nodes[a];
      const nodeB = nodes[b];
      const link = links.get(a * 1000 + b);
      if (!nodeA || !nodeB || !link) continue;

      const grow = smooth(clamp((now - link.born) / LINK_GROW_MS, 0, 1));
      const closeness =
        1 -
        Math.hypot(nodeA.x - nodeB.x, nodeA.y - nodeB.y, nodeA.z - nodeB.z) /
          limit;
      const near = (nodeA.depth + nodeB.depth) / 2;
      const alpha = Math.min(
        0.9,
        (0.3 + 0.8 * closeness) *
          Math.min(nodeA.alpha, nodeB.alpha) *
          (0.5 + 0.9 * near),
      );
      if (alpha < 0.015) continue;

      ctx.strokeStyle = `rgba(${PURPLE}, ${alpha.toFixed(3)})`;
      ctx.lineWidth = 0.9 + 1.4 * near;
      ctx.beginPath();
      ctx.moveTo(nodeA.sx, nodeA.sy);
      ctx.lineTo(
        nodeA.sx + (nodeB.sx - nodeA.sx) * grow,
        nodeA.sy + (nodeB.sy - nodeA.sy) * grow,
      );
      ctx.stroke();
    }
  }

  function drawPointerLinks() {
    if (!cursorActive) return;
    const near = nodes
      .map((node) => ({
        node,
        distance: Math.hypot(node.sx - cursorX, node.sy - cursorY),
      }))
      .filter((item) => item.distance < POINTER_RADIUS * 1.2)
      .sort((left, right) => left.distance - right.distance)
      .slice(0, 5);

    for (const { node, distance } of near) {
      const alpha = (1 - distance / (POINTER_RADIUS * 1.2)) * 0.5 * node.alpha;
      ctx.strokeStyle = `rgba(${GREEN}, ${alpha.toFixed(3)})`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(cursorX, cursorY);
      ctx.lineTo(node.sx, node.sy);
      ctx.stroke();
    }
  }

  function drawNodes() {
    for (const node of nodes) {
      if (node.alpha < 0.02) continue;
      const radius = 2.1 + 3.4 * node.depth;
      const color = node.active ? GREEN : node.depth > 0.6 ? WHITE : PURPLE;

      if (node.active) {
        ctx.fillStyle = `rgba(${GREEN}, ${(node.alpha * 0.18).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(node.sx, node.sy, radius * 4.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = `rgba(${color}, ${Math.min(1, node.alpha * 1.15).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(node.sx, node.sy, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function ensureParticles() {
    const wanted = Math.round(nodes.length * 0.45);
    while (particles.length > wanted) particles.pop();
    if (linkList.length === 0) return;

    while (particles.length < wanted) {
      const pair = linkList[Math.floor(Math.random() * linkList.length)];
      if (!pair) break;
      particles.push({
        a: pair[0],
        b: pair[1],
        t: Math.random(),
        speed: random(0.15, 0.55),
        green: Math.random() < 0.6,
      });
    }
  }

  function drawParticles(dt: number) {
    for (const particle of particles) {
      if (!links.has(particle.a * 1000 + particle.b) || particle.t >= 1) {
        const pair = linkList[Math.floor(Math.random() * linkList.length)];
        if (!pair) continue;
        particle.a = pair[0];
        particle.b = pair[1];
        particle.t = 0;
        particle.speed = random(0.15, 0.55);
      }

      particle.t += particle.speed * dt;
      const from = nodes[particle.a];
      const to = nodes[particle.b];
      if (!from || !to) continue;

      const x = from.sx + (to.sx - from.sx) * Math.min(particle.t, 1);
      const y = from.sy + (to.sy - from.sy) * Math.min(particle.t, 1);
      const alpha =
        Math.min(from.alpha, to.alpha) *
        Math.sin(Math.PI * Math.min(particle.t, 1));
      if (alpha < 0.03) continue;

      const color = particle.green ? GREEN : PURPLE;
      const radius = 1.2 + 1.4 * ((from.depth + to.depth) / 2);
      ctx.fillStyle = `rgba(${color}, ${(alpha * 0.25).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(x, y, radius * 2.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(${color}, ${(alpha * 0.95).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawCursorLight() {
    if (!cursorActive) return;
    const gradient = ctx.createRadialGradient(
      cursorX,
      cursorY,
      0,
      cursorX,
      cursorY,
      220,
    );
    gradient.addColorStop(0, `rgba(${PURPLE}, 0.16)`);
    gradient.addColorStop(0.45, `rgba(${GREEN}, 0.05)`);
    gradient.addColorStop(1, `rgba(${PURPLE}, 0)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(cursorX - 220, cursorY - 220, 440, 440);
  }

  function step(dt: number) {
    for (let index = 0; index < nodes.length; index += 1) {
      const node = nodes[index];
      if (!node) continue;
      node.x += node.vx * dt;
      node.y += node.vy * dt;
      node.z += node.vz * dt;
      node.age += dt;
      if (node.x < -1.1 || node.x > 1.1) node.vx *= -1;
      if (node.y < -0.95 || node.y > 0.95) node.vy *= -1;
      if (node.z < -1.7 || node.z > 1.7) node.vz *= -1;
      if (node.age >= node.life) nodes[index] = spawnNode(false);
    }
    // Balanço lento e contínuo, somado ao deslocamento do mouse.
    const drift = Math.sin(clock / 9000) * 0.3;
    yaw += (STATIC_YAW + drift + yawTarget - yaw) * Math.min(1, dt * 3);
    pitch += (pitchTarget - pitch) * Math.min(1, dt * 3);
  }

  function scrollOffset(): number {
    const rect = container.getBoundingClientRect();
    const offset = window.innerHeight / 2 - (rect.top + rect.height / 2);
    return clamp(offset, -window.innerHeight, window.innerHeight);
  }

  function setShift(offset: number) {
    if (parallax === "off") return;
    const shift = Math.round(offset * (parallax === "full" ? 0.18 : 0.1));
    if (shift !== lastShift) {
      lastShift = shift;
      container.style.setProperty("--neural-shift", `${shift}px`);
    }
  }

  function draw(now: number, dt: number, grown: boolean) {
    // Deslocamento relativo: 0 quando o centro da seção cruza o centro da
    // janela, para que o parallax funcione igual em qualquer posição da página.
    const offset = animate ? scrollOffset() : 0;
    ctx.clearRect(0, 0, width, height);
    project(offset);
    applyPointer();
    updateLinks(now, grown);
    ensureParticles();
    drawLinks(now);
    drawPointerLinks();
    drawParticles(dt);
    drawNodes();
    drawCursorLight();
    if (animate) setShift(offset);
  }

  function shouldRun() {
    return animate && !destroyed && inView && !document.hidden;
  }

  function frame(timestamp: number) {
    raf = 0;
    if (!shouldRun()) return;

    const delta = last === 0 ? 16 : timestamp - last;
    last = timestamp;
    const dt = Math.min(delta, MAX_FRAME_DELTA) / 1000;
    clock = timestamp;

    step(dt);
    draw(timestamp, dt, false);

    // Intervalos de 1 s ou mais são pausas (aba em segundo plano), não lentidão.
    if (delta < 1000) {
      const verdict = monitor.push(delta);
      if (verdict === "slow") {
        if (degrades < MAX_DEGRADES) {
          degrades += 1;
          nodes.length = Math.min(
            nodes.length,
            Math.max(MIN_NODES, degrade(nodes.length)),
          );
          options.onDegrade(degrades);
        } else {
          options.onState("static");
          draw(timestamp, 0, true);
          return;
        }
      }
    }
    schedule();
  }

  function schedule() {
    if (raf === 0 && shouldRun()) {
      raf = requestAnimationFrame(frame);
    }
  }

  function pause() {
    if (raf !== 0) cancelAnimationFrame(raf);
    raf = 0;
    last = 0;
    monitor.reset();
  }

  function onPointerMove(event: PointerEvent) {
    const rect = container.getBoundingClientRect();
    const inside =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;

    cursorActive = inside;
    container.dataset.neuralPointer = inside ? "active" : "idle";
    if (!inside) return;

    cursorX = event.clientX - rect.left;
    cursorY = event.clientY - rect.top;
    if (parallax === "full") {
      yawTarget = (cursorX / rect.width - 0.5) * 0.5;
      pitchTarget = (cursorY / rect.height - 0.5) * -0.3;
    }
  }

  function onVisibility() {
    if (document.hidden) pause();
    else schedule();
  }

  const resizeObserver =
    typeof ResizeObserver === "undefined"
      ? null
      : new ResizeObserver(() => {
          resize();
          if (!animate) draw(0, 0, true);
        });
  const viewObserver =
    typeof IntersectionObserver === "undefined"
      ? null
      : new IntersectionObserver((entries) => {
          inView = entries.some((entry) => entry.isIntersecting);
          if (inView) schedule();
          else pause();
        });

  resize();
  resizeObserver?.observe(container);
  viewObserver?.observe(container);
  document.addEventListener("visibilitychange", onVisibility);
  if (animate && pointer) {
    window.addEventListener("pointermove", onPointerMove, { passive: true });
  }

  if (animate) {
    options.onState("running");
    schedule();
  } else {
    // Movimento reduzido: um quadro só, com as conexões já completas.
    draw(0, 0, true);
    options.onState("static");
  }

  return {
    destroy() {
      destroyed = true;
      pause();
      resizeObserver?.disconnect();
      viewObserver?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointerMove);
      links.clear();
      particles.length = 0;
      ctx.clearRect(0, 0, width, height);
      canvas.width = 0;
      canvas.height = 0;
    },
  };
}
