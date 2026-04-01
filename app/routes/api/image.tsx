import { createFileRoute } from "@tanstack/react-router";

const ALLOWED_HOSTS = new Set([
  "images.ctfassets.net",
  "i.gr-assets.com",
  "assets.literal.club",
  "assets-ol.literal.club",
  "lastfm.freetls.fastly.net",
  "books.google.com",
]);

const ALLOWED_SUFFIX_PATTERNS = [
  ".digitaloceanspaces.com",
  ".spotifycdn.com",
  ".scdn.co",
];

function isHostAllowed(hostname: string): boolean {
  if (ALLOWED_HOSTS.has(hostname)) return true;
  return ALLOWED_SUFFIX_PATTERNS.some((suffix) => hostname.endsWith(suffix));
}

export const Route = createFileRoute("/api/image")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { searchParams } = new URL(request.url);
        const url = searchParams.get("url");

        if (!url) {
          return new Response("Missing url parameter", { status: 400 });
        }

        let parsed: URL;
        try {
          parsed = new URL(url);
        } catch {
          return new Response("Invalid url", { status: 400 });
        }

        if (!isHostAllowed(parsed.hostname)) {
          return new Response("Host not allowed", { status: 403 });
        }

        try {
          const upstream = await fetch(url);

          if (!upstream.ok) {
            return new Response("Upstream fetch failed", {
              status: upstream.status,
            });
          }

          const contentType =
            upstream.headers.get("content-type") ?? "image/jpeg";

          const isStable = parsed.hostname === "images.ctfassets.net";
          const cacheControl = isStable
            ? "public, max-age=31536000, immutable"
            : "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400";

          return new Response(upstream.body, {
            headers: {
              "Content-Type": contentType,
              "Cache-Control": cacheControl,
            },
          });
        } catch {
          return new Response("Upstream fetch error", { status: 502 });
        }
      },
    },
  },
});
