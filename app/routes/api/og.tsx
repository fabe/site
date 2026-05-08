import { createFileRoute } from "@tanstack/react-router";
import {
  dot,
  pixel,
  postCoverDots,
  width as coverWidth,
} from "@/components/PostCover";

const width = 1200;
const height = 630;
const canvasColor = "rgb(249, 250, 251)";
const foregroundColor = "rgb(38, 38, 38)";
const scale = width / coverWidth;
const pixelSize = scale * pixel;
const dotSize = scale * dot;

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export const Route = createFileRoute("/api/og")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const sharp = (await import("sharp")).default;
          const { searchParams } = new URL(request.url);
          const seed =
            searchParams.get("slug") ?? searchParams.get("title") ?? "";
          const dots = postCoverDots(width, height, seed, pixelSize, dotSize);
          const rects = dots
            .map(
              ([x, y]) =>
                `<rect x="${x}" y="${y}" width="${dotSize}" height="${dotSize}"/>`,
            )
            .join("");
          const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeXml(seed)}">
  <rect width="100%" height="100%" fill="${canvasColor}"/>
  <g fill="${foregroundColor}">${rects}</g>
</svg>`;

          const png = await sharp(Buffer.from(svg)).png().toBuffer();
          const body = png.buffer.slice(
            png.byteOffset,
            png.byteOffset + png.byteLength,
          ) as ArrayBuffer;

          return new Response(body, {
            headers: {
              "Content-Type": "image/png",
              "Cache-Control":
                "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
            },
          });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Unknown error";
          console.error(`OG image generation failed: ${message}`);
          return new Response("Failed to generate the image", {
            status: 500,
          });
        }
      },
    },
  },
});
