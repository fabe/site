export function proxiedImageUrl(externalUrl: string | undefined | null): string {
  if (!externalUrl) return "";
  return `/api/image?url=${encodeURIComponent(externalUrl)}`;
}

/**
 * Extract the original upstream URL from a proxied `/api/image?url=...` URL.
 * Returns the input unchanged if it's not a proxied URL.
 */
export function unwrapProxiedUrl(url: string): string {
  if (url.startsWith("/api/image?")) {
    const params = new URLSearchParams(url.slice("/api/image?".length));
    return params.get("url") ?? url;
  }
  return url;
}

/**
 * Append Contentful image-API transform params to a URL.
 * Works with both raw Contentful URLs and proxied `/api/image?url=...` URLs.
 */
export function withImageParams(
  src: string,
  params: Record<string, string | number>,
): string {
  if (!src) return "";

  // If it's a proxied URL, decode the upstream URL, append params, re-encode
  if (src.startsWith("/api/image?url=")) {
    const rest = src.slice("/api/image?url=".length);
    // The encoded URL may be followed by other proxy-level params (unlikely, but safe)
    const upstreamRaw = decodeURIComponent(rest);
    const sep = upstreamRaw.includes("?") ? "&" : "?";
    const qs = Object.entries(params)
      .map(([k, v]) => `${k}=${v}`)
      .join("&");
    return `/api/image?url=${encodeURIComponent(upstreamRaw + sep + qs)}`;
  }

  // Raw URL — just append
  const sep = src.includes("?") ? "&" : "?";
  const qs = Object.entries(params)
    .map(([k, v]) => `${k}=${v}`)
    .join("&");
  return src + sep + qs;
}
