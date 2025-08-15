import sharp from "sharp";

export interface ColorData {
  dominant: string;
  palette: string[];
  gradient: string;
}

export async function extractColorsFromImage(
  imageUrl: string,
): Promise<ColorData> {
  try {
    // Prefer fetching a small, compressed Contentful rendition
    const makeSmallContentfulUrl = (url: string) => {
      try {
        const u = new URL(url);
        // Only modify Contentful image hosts
        const isContentful =
          /ctfassets\.net$/.test(u.hostname) ||
          u.hostname.includes("images.ctfassets.net");
        if (!isContentful) return url;
        // Merge/override sizing and format params
        if (!u.searchParams.has("w")) u.searchParams.set("w", "320");
        u.searchParams.set("q", "60");
        u.searchParams.set("fm", "webp");
        return u.toString();
      } catch {
        return url;
      }
    };

    const response = await fetch(makeSmallContentfulUrl(imageUrl));
    const buffer = await response.arrayBuffer();

    // Read a small sRGB image and analyze raw pixels
    const processed = sharp(Buffer.from(buffer))
      .toColourspace("srgb")
      .resize(160, 160, { fit: "inside" });
    const { data, info } = await processed
      .raw()
      .toBuffer({ resolveWithObject: true });
    const width = info.width;
    const height = info.height;
    const channels = info.channels; // 3 or 4

    // Sample pixels (skip extreme borders; downweight very bright highlights)
    type Bucket = { rSum: number; gSum: number; bSum: number; count: number };
    const buckets = new Map<string, Bucket>();
    const q = 20; // bucket size
    const marginX = Math.floor(width * 0.05);
    const marginY = Math.floor(height * 0.05);

    for (let y = marginY; y < height - marginY; y += 2) {
      for (let x = marginX; x < width - marginX; x += 2) {
        const i = (y * width + x) * channels;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const brightness = max / 255;
        const saturation = max === 0 ? 0 : (max - min) / max;

        // Skip near-white, near-black, and very gray pixels
        if (brightness > 0.92 || brightness < 0.06) continue;
        if (saturation < 0.12) continue;

        // Center bias and highlight penalty so small bright skies don't dominate
        const centerWeight =
          1 +
          (1 -
            Math.sqrt((x - width / 2) ** 2 + (y - height / 2) ** 2) /
              Math.sqrt((width / 2) ** 2 + (height / 2) ** 2)) *
            2;
        const brightPenalty = 1 - Math.max(0, brightness - 0.8) * 2.0; // 1..-∞
        const weight = Math.max(0.25, centerWeight * brightPenalty);

        // Push into a quantized bucket multiple times according to weight
        const key = `${Math.floor(r / q)}-${Math.floor(g / q)}-${Math.floor(
          b / q,
        )}`;
        const reps = Math.max(1, Math.floor(weight));
        const current = buckets.get(key) ?? {
          rSum: 0,
          gSum: 0,
          bSum: 0,
          count: 0,
        };
        current.rSum += r * reps;
        current.gSum += g * reps;
        current.bSum += b * reps;
        current.count += reps;
        buckets.set(key, current);
      }
    }

    // Choose best bucket by a balanced score (saturation + mid brightness), weighted by population
    let best: { r: number; g: number; b: number } | null = null;
    let bestScore = -1;
    for (const bucket of buckets.values()) {
      const r = bucket.rSum / bucket.count;
      const g = bucket.gSum / bucket.count;
      const b = bucket.bSum / bucket.count;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const brightness = max / 255;
      const saturation = max === 0 ? 0 : (max - min) / max;
      const midBias = 1 - Math.abs(brightness - 0.55) * 0.9;
      const score = bucket.count * (0.6 + saturation * 0.8) * midBias;
      if (score > bestScore) {
        bestScore = score;
        best = { r, g, b };
      }
    }

    let avgR: number, avgG: number, avgB: number;
    if (best) {
      avgR = Math.round(best.r);
      avgG = Math.round(best.g);
      avgB = Math.round(best.b);
    } else {
      // Fallback: very small or filtered images
      const stats = await sharp(Buffer.from(buffer))
        .toColourspace("srgb")
        .resize(128, 128, { fit: "inside" })
        .stats();
      avgR = stats.dominant.r;
      avgG = stats.dominant.g;
      avgB = stats.dominant.b;
    }

    // Subtle saturation boost and soft light/dark variants for gradient
    const clamp = (v: number) => Math.max(0, Math.min(255, v));
    const toRgb = (r: number, g: number, b: number) =>
      `rgb(${Math.round(clamp(r))}, ${Math.round(clamp(g))}, ${Math.round(
        clamp(b),
      )})`;
    const saturate = (r: number, g: number, b: number, amt: number) => {
      const gray = (r + g + b) / 3;
      return [
        clamp(gray + (r - gray) * (1 + amt)),
        clamp(gray + (g - gray) * (1 + amt)),
        clamp(gray + (b - gray) * (1 + amt)),
      ];
    };
    const lighten = (r: number, g: number, b: number, amt: number) => [
      clamp(r + (255 - r) * amt),
      clamp(g + (255 - g) * amt),
      clamp(b + (255 - b) * amt),
    ];
    const darken = (r: number, g: number, b: number, amt: number) => [
      clamp(r * (1 - amt)),
      clamp(g * (1 - amt)),
      clamp(b * (1 - amt)),
    ];

    const [sR, sG, sB] = saturate(avgR, avgG, avgB, 0.18);
    const [dR, dG, dB] = darken(sR, sG, sB, 0.12);
    const [lR, lG, lB] = lighten(sR, sG, sB, 0.1);

    const base = toRgb(sR, sG, sB);
    const dark = toRgb(dR, dG, dB);
    const light = toRgb(lR, lG, lB);

    const palette = [base, dark, light];
    // Soft three-stop gradient (dark -> base -> light)
    const gradient = `linear-gradient(135deg, ${dark}, ${base}, ${light})`;

    return {
      dominant: base,
      palette,
      gradient,
    };
  } catch (error) {
    console.error("Error extracting colors from image:", error);
    // Fallback to neutral colors
    return {
      dominant: "rgb(100, 100, 100)",
      palette: [
        "rgb(100, 100, 100)",
        "rgb(80, 80, 80)",
        "rgb(120, 120, 120)",
        "rgb(60, 60, 60)",
        "rgb(140, 140, 140)",
      ],
      gradient:
        "linear-gradient(135deg, rgb(100, 100, 100), rgb(120, 120, 120))",
    };
  }
}

export async function extractColorsForPhotoSets(
  photoSets: any[],
): Promise<Map<string, ColorData>> {
  const colorMap = new Map<string, ColorData>();

  // Process images in parallel with a concurrency limit
  const concurrency = 5;
  const chunks = [];

  for (let i = 0; i < photoSets.length; i += concurrency) {
    chunks.push(photoSets.slice(i, i + concurrency));
  }

  for (const chunk of chunks) {
    const promises = chunk.map(async (photoSet) => {
      if (photoSet.featuredPhoto?.url) {
        const colors = await extractColorsFromImage(photoSet.featuredPhoto.url);
        colorMap.set(photoSet.id, colors);
      }
    });

    await Promise.all(promises);
  }

  return colorMap;
}
