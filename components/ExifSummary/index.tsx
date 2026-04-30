interface ExifSummaryProps {
  exif: EXIF;
}

export function ExifSummaryExposure({ exif }: ExifSummaryProps) {
  const { FNumber, ExposureTime, FocalLength, FocalLengthIn35mmFormat, ISO } =
    exif;

  if (
    !FNumber ||
    !ExposureTime ||
    !FocalLength ||
    !FocalLengthIn35mmFormat ||
    !ISO
  ) {
    return null;
  }

  return (
    <span>
      {Math.round(FocalLength)}mm ({Math.round(FocalLengthIn35mmFormat)}mm), ƒ
      {FNumber.toFixed(1)},{" "}
      {ExposureTime < 1 ? (
        <span className="diagonal-fractions">
          1/{Math.round(1 / ExposureTime)}
        </span>
      ) : (
        ExposureTime
      )}{" "}
      sec, ISO {ISO}
    </span>
  );
}
