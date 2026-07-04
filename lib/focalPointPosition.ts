type ImageWithFocalPoint = {
  focalPoint?: { x: number; y: number } | null;
  width?: number | null;
  height?: number | null;
};

function clamp(value: number) {
  return Math.min(Math.max(value, 0), 1);
}

function getCenteredCropPosition(
  focalPoint: number,
  imageSize: number,
  cropSize: number,
) {
  if (cropSize >= imageSize) return 0.5;

  return clamp((focalPoint - cropSize / 2) / (imageSize - cropSize));
}

export function getFocalPointObjectPosition(
  image: ImageWithFocalPoint,
  cropAspectRatio: number,
) {
  if (!image.focalPoint || !image.width || !image.height) return undefined;

  const imageAspectRatio = image.width / image.height;
  let x = 0.5;
  let y = 0.5;

  if (imageAspectRatio > cropAspectRatio) {
    x = getCenteredCropPosition(
      image.focalPoint.x,
      image.width,
      image.height * cropAspectRatio,
    );
  } else if (imageAspectRatio < cropAspectRatio) {
    y = getCenteredCropPosition(
      image.focalPoint.y,
      image.height,
      image.width / cropAspectRatio,
    );
  }

  return `${x * 100}% ${y * 100}%`;
}
