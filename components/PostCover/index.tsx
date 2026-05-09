import { useEffect, useRef } from "react";

export const pixel = 3;
export const dot = Math.max(1, Math.round(pixel * 0.8));
export const width = 576;
export const height = 298;

const bayer = [
  0, 48, 12, 60, 3, 51, 15, 63, 32, 16, 44, 28, 35, 19, 47, 31, 8, 56, 4, 52,
  11, 59, 7, 55, 40, 24, 36, 20, 43, 27, 39, 23, 2, 50, 14, 62, 1, 49, 13, 61,
  34, 18, 46, 30, 33, 17, 45, 29, 10, 58, 6, 54, 9, 57, 5, 53, 42, 26, 38, 22,
  41, 25, 37, 21,
].map((n) => (n + 0.5) / 64);

type Layer = {
  cx: number;
  cy: number;
  f: number;
  t: number;
  p: number;
  w: number;
};
type Warp = { fx: number; fy: number; px: number; py: number };
type Blob = { cx: number; cy: number; sx: number; sy: number; w: number };
type Wave = { x: number; y: number; p: number; w: number };
type Params = {
  layers: Layer[];
  warps: Warp[];
  edge: { p1: number; p2: number; blobs: Blob[]; bites: Blob[]; waves: Wave[] };
};

function hash(s: string) {
  let h = 2166136261;
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h >>> 0;
}

function rng(a: number) {
  return () => (
    (a = Math.imul(a ^ (a >>> 15), a | 1)),
    (a ^= a + Math.imul(a ^ (a >>> 7), a | 61)),
    ((a ^ (a >>> 14)) >>> 0) / 4294967296
  );
}

function smoothstep(a: number, b: number, x: number) {
  x = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return x * x * (3 - 2 * x);
}

function fract(n: number) {
  return n - Math.floor(n);
}

function makeParams(seed: string, w: number, h: number): Params {
  const r = rng(hash(seed));
  const layers: Layer[] = [];
  for (let i = 0; i < 4; i++) {
    layers.push({
      cx: (r() - 0.5) * 1.6,
      cy: (r() - 0.5) * 1.2,
      f: 2 + r() * 10,
      t: (r() - 0.5) * 9.4,
      p: r() * 6.28,
      w: 0.4 + r() * 0.8,
    });
  }

  const warps: Warp[] = [];
  for (let i = 0; i < 3; i++)
    warps.push({
      fx: 1.5 + r() * 3,
      fy: 1.5 + r() * 3,
      px: r() * 6.28,
      py: r() * 6.28,
    });

  const ar = w / h;
  const blobs: Blob[] = [];
  for (let i = 0; i < 8; i++) {
    const t = i / 7;
    blobs.push({
      cx: (t - 0.5) * ar * 1.18 + (r() - 0.5) * 0.45,
      cy: (r() - 0.5) * 0.75,
      sx: 0.34 + r() * 0.42,
      sy: 0.32 + r() * 0.5,
      w: 0.8 + r(),
    });
  }

  const bites: Blob[] = [];
  for (let i = 0; i < 7; i++) {
    const side = r();
    let cx: number, cy: number;
    if (side < 0.42) {
      cx = (r() - 0.5) * ar * 1.65;
      cy = (r() < 0.5 ? -1 : 1) * (0.42 + r() * 0.55);
    } else {
      cx = (r() < 0.5 ? -1 : 1) * ar * (0.62 + r() * 0.35);
      cy = (r() - 0.5) * 1.3;
    }
    bites.push({
      cx,
      cy,
      sx: 0.22 + r() * 0.42,
      sy: 0.18 + r() * 0.38,
      w: 0.25 + r() * 0.6,
    });
  }

  const waves: Wave[] = [];
  for (let i = 0; i < 8; i++)
    waves.push({
      x: (r() - 0.5) * (i < 4 ? 5.5 : 13),
      y: (r() - 0.5) * (i < 4 ? 5.5 : 13),
      p: r() * Math.PI * 2,
      w: (i < 4 ? 0.08 : 0.035) + r() * (i < 4 ? 0.14 : 0.07),
    });

  return {
    layers,
    warps,
    edge: { p1: r() * Math.PI * 2, p2: r() * Math.PI * 2, blobs, bites, waves },
  };
}

function field(x: number, y: number, p: Params) {
  for (const w of p.warps) {
    const ox = x,
      oy = y;
    x += 0.16 * Math.sin(oy * w.fy + w.py) * 0.6;
    y += 0.16 * Math.sin(ox * w.fx + w.px) * 0.6;
  }
  let v = 0,
    wt = 0;
  for (const q of p.layers) {
    const dx = x - q.cx,
      dy = y - q.cy;
    const a = Math.atan2(dy, dx),
      d = Math.hypot(dx, dy);
    v +=
      q.w *
      (Math.sin(a * q.f + d * q.t + q.p) +
        0.4 * Math.sin(a * q.f * 2.1 + d * q.t * 1.4 + q.p * 3));
    wt += q.w;
  }
  return 1 / (1 + Math.exp(-(v / wt) * 16));
}

function dotNoise(ix: number, iy: number, p: Params) {
  return fract(
    Math.sin((ix + p.edge.p1) * 12.9898 + (iy + p.edge.p2) * 78.233) *
      43758.5453,
  );
}

function edgeMask(x: number, y: number, p: Params, w: number, h: number) {
  const u = x / w,
    v = y / h,
    ar = w / h;
  let nx = (u * 2 - 1) * ar,
    ny = v * 2 - 1;
  let low = 0,
    grain = 0;
  for (let i = 0; i < p.edge.waves.length; i++) {
    const wave = p.edge.waves[i];
    const n = Math.sin(nx * wave.x + ny * wave.y + wave.p) * wave.w;
    if (i < 4) low += n;
    else grain += n;
  }
  nx += low * 0.5;
  ny += low * 0.12 + Math.sin(nx * 1.7 + p.edge.p1) * 0.1;
  let s = 0;
  for (const b of p.edge.blobs)
    s +=
      b.w *
      Math.exp(-(((nx - b.cx) / b.sx) ** 2 + ((ny - b.cy) / b.sy) ** 2) * 1.05);
  for (const b of p.edge.bites)
    s -=
      b.w *
      Math.exp(-(((nx - b.cx) / b.sx) ** 2 + ((ny - b.cy) / b.sy) ** 2) * 1.15);
  s += low * 0.75 + grain * 1.35;
  return Math.min(
    smoothstep(0.3425, 1.2175, s),
    smoothstep(0, 0.072, Math.min(u, v, 1 - u, 1 - v)),
  );
}

function opticalAlignDots(
  d: number[][],
  w: number,
  h: number,
  pixel: number,
  dot: number,
) {
  if (!d.length) return d;

  const shiftForAxis = (axis: 0 | 1, size: number) => {
    const lines = new Map<number, number>();
    let min = Infinity,
      max = -Infinity,
      total = 0,
      weighted = 0;

    for (const point of d) {
      const position = point[axis];
      const key = Math.round((position + dot * 0.5) / pixel);
      lines.set(key, (lines.get(key) || 0) + 1);
      min = Math.min(min, position);
      max = Math.max(max, position + dot);
    }

    const sorted = [...lines.entries()].sort((a, b) => a[0] - b[0]);

    for (const [key, count] of sorted) {
      total += count;
      weighted += key * pixel * count;
    }

    const q = (pct: number) => {
      const target = total * pct;
      let acc = 0;
      for (const [key, count] of sorted) {
        acc += count;
        if (acc >= target) return key * pixel;
      }
      return sorted[sorted.length - 1][0] * pixel;
    };

    const opticalCenter = (q(0.03) + q(0.97)) * 0.4 + (weighted / total) * 0.2;
    const minShift = Math.ceil(-min / pixel) * pixel;
    const maxShift = Math.floor((size - max) / pixel) * pixel;
    const shift = Math.round((size * 0.5 - opticalCenter) / pixel) * pixel;

    return Math.max(minShift, Math.min(maxShift, shift));
  };

  const dx = shiftForAxis(0, w);
  const dy = shiftForAxis(1, h);

  return Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5
    ? d
    : d.map(([x, y]) => [x + dx, y + dy]);
}

export function postCoverDots(
  w: number,
  h: number,
  seed: string,
  pixelSize = pixel,
  dotSize = dot,
) {
  const p = makeParams(seed, w, h);
  const out: number[][] = [],
    ar = w / h;
  for (let yi = 0, y = 0; y < h; yi++, y += pixelSize) {
    const by = (yi & 7) * 8;
    for (let xi = 0, x = 0; x < w; xi++, x += pixelSize) {
      const threshold = bayer[by + (xi & 7)] + 0.45;
      if (threshold >= 1) continue;
      if (
        edgeMask(x + pixelSize * 0.5, y + pixelSize * 0.5, p, w, h) <=
        dotNoise(xi, yi, p)
      )
        continue;
      const nx = (((x / w) * 2 - 1) * ar) / 0.7;
      const ny = ((y / h) * 2 - 1) / 0.7;
      if (field(nx, ny, p) > threshold) out.push([x, y]);
    }
  }
  return opticalAlignDots(out, w, h, pixelSize, dotSize);
}

export function PostCover({ seed }: { seed: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dots = postCoverDots(width, height, seed);
    const color = getComputedStyle(canvas).color;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const draw = (x: number, y: number) => {
      ctx.fillRect(x, y, dot, dot);
    };

    const scrollCutoff = () => {
      if (reduceMotion) return null;

      const rect = canvas.getBoundingClientRect();
      const fadeAhead = 20;
      const progress = Math.max(
        0,
        Math.min(1, (fadeAhead - rect.top) / (rect.height + fadeAhead)),
      );

      return progress > 0 ? progress * (height + fadeAhead) : null;
    };

    const shouldHideDot = (x: number, y: number, cutoff: number) => {
      const band = 32;
      const noise = fract(
        Math.sin(x * 12.9898 + y * 78.233 + seed.length * 37.719) * 43758.5453,
      );

      return y < cutoff + (noise - 0.5) * band;
    };

    const render = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = color;

      const cutoff = scrollCutoff();

      for (const [x, y] of dots) {
        if (cutoff !== null && shouldHideDot(x, y, cutoff)) continue;
        draw(x, y);
      }

      canvas.dataset.rendered = "true";
    };

    const handleScroll = () => render();

    render();

    if (reduceMotion) return;

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [seed]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      aria-hidden="true"
      className="mb-6 block aspect-[576/298] w-full text-fg opacity-0 transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] data-[rendered=true]:opacity-100 motion-reduce:transition-none sm:mb-8"
    />
  );
}
