import { withImageParams } from "./imageProxy";

interface PhotoImageLoaderProps {
  src: string;
  width: number;
  quality?: number;
  custom?: string[];
}

function cloudinaryLoader(
  src: string,
  width: number,
  quality: number,
  custom?: string[],
): string {
  const transforms: string[] = [
    "f_auto",
    `q_${quality}`,
    `w_${Math.floor(width)}`,
  ];

  if (custom) {
    for (const c of custom) {
      const [key, value] = c.split("=");
      if (!key || !value) continue;
      if (key === "h") transforms.push(`h_${value}`);
      if (key === "fit")
        transforms.push(value === "fill" ? "c_fill" : `c_${value}`);
    }
  }

  if (!transforms.some((transform) => transform.startsWith("c_"))) {
    transforms.push("c_limit");
  }

  return src.replace(
    "/image/upload/",
    `/image/upload/${transforms.join(",")}/`,
  );
}

export function isCloudinaryImageUrl(src: string): boolean {
  return src.includes("res.cloudinary.com") && src.includes("/image/upload/");
}

export function photoImageLoader({
  src,
  quality = 75,
  width,
  custom,
}: PhotoImageLoaderProps): string {
  if (!src) return "";

  if (isCloudinaryImageUrl(src)) {
    return cloudinaryLoader(src, width, quality, custom);
  }

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

export default photoImageLoader;
