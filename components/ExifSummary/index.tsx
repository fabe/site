interface ExifSummaryProps {
  exif: EXIF;
}

export default function ExifSummary({ exif }: ExifSummaryProps) {
  return (
    <span>
      {exif.Make} {exif.Model}, ƒ{exif.FNumber.toFixed(1)},{" "}
      {exif.ExposureTime < 1 ? (
        <span className="diagonal-fractions">
          1/{Math.round(1 / exif.ExposureTime)}
        </span>
      ) : (
        exif.ExposureTime
      )}{" "}
      sec, {exif.FocalLength}mm ({exif.FocalLengthIn35mmFormat}mm), ISO{" "}
      {exif.ISO}
    </span>
  );
}

export function ExifSummaryExposure({ exif }: ExifSummaryProps) {
  return (
    <span>
      {exif.FocalLength}mm ({exif.FocalLengthIn35mmFormat}mm), ƒ
      {exif.FNumber.toFixed(1)},{" "}
      {exif.ExposureTime < 1 ? (
        <span className="diagonal-fractions">
          1/{Math.round(1 / exif.ExposureTime)}
        </span>
      ) : (
        exif.ExposureTime
      )}{" "}
      sec, ISO {exif.ISO}
    </span>
  );
}
