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
  try {
    const url = new URL(src);
    return (
      url.protocol === "https:" &&
      url.hostname === "res.cloudinary.com" &&
      url.pathname.includes("/image/upload/")
    );
  } catch {
    return false;
  }
}

export function photoImageLoader({
  src,
  quality = 75,
  width,
  custom,
}: PhotoImageLoaderProps): string {
  if (!src) return "";

  if (!isCloudinaryImageUrl(src)) return "";

  return cloudinaryLoader(src, width, quality, custom);
}

export function photoImageSrcSet({
  src,
  quality,
  widths,
  custom,
}: Omit<PhotoImageLoaderProps, "width"> & { widths: number[] }): string {
  return widths
    .map(
      (width) =>
        `${photoImageLoader({ src, width, quality, custom })} ${Math.floor(width)}w`,
    )
    .join(", ");
}

export default photoImageLoader;
