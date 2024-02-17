import { ImageLoaderProps } from "next/image";

function normalizeSrc(src: string) {
  return src[0] === "/" ? src.slice(1) : src;
}

function contentfulLoader({
  src,
  quality = 75,
  width,
  custom,
}: ImageLoaderProps & { custom?: string[] }): string {
  const params = ["w=" + Math.floor(width)];

  if (quality) {
    params.push("q=" + quality);
  }

  return `${normalizeSrc(src)}?fm=webp&${params.join("&")}${
    custom ? `&${custom.join("&")}` : ""
  }`;
}

export default contentfulLoader;
