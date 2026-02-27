interface ContentfulLoaderProps {
  src: string;
  width: number;
  quality?: number;
  custom?: string[];
}

function normalizeSrc(src: string) {
  return src[0] === "/" ? src.slice(1) : src;
}

function contentfulLoader({
  src,
  quality = 75,
  width,
  custom,
}: ContentfulLoaderProps): string {
  const params = ["w=" + Math.floor(width)];

  if (quality) {
    params.push("q=" + quality);
  }

  return `${normalizeSrc(src)}?fm=webp&${params.join("&")}${
    custom ? `&${custom.join("&")}` : ""
  }`;
}

export default contentfulLoader;
