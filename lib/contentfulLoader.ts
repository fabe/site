import { withImageParams } from "./imageProxy";

interface ContentfulLoaderProps {
  src: string;
  width: number;
  quality?: number;
  custom?: string[];
}

function contentfulLoader({
  src,
  quality = 75,
  width,
  custom,
}: ContentfulLoaderProps): string {
  const params: Record<string, string | number> = {
    fm: "webp",
    w: Math.floor(width),
  };

  if (quality) {
    params.q = quality;
  }

  if (custom) {
    for (const c of custom) {
      const [k, v] = c.split("=");
      if (k && v) params[k] = v;
    }
  }

  return withImageParams(src, params);
}

export default contentfulLoader;
