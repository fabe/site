# Stellate removal plan

Goal: remove Stellate completely without changing the public site behavior. The site is hosted on Vercel, and most first-party data loading already happens server-side through `SchemaLink`, so the GraphQL CDN is not carrying much architectural weight.

## Current Stellate surface area

- `stellate.yml` defines the Stellate service and cache rules.
- `.env.example` no longer lists `GRAPHCDN_BASE_URL` or `STELLATE_TOKEN`; remove those from real Vercel/local environments too.
- `graphql/constants/index.ts` sends production browser GraphQL traffic to `https://graphql.fabianschultz.com`.
- `app/routes/colophon.tsx` links to the GraphQL endpoint and credits Stellate.
- DNS for `graphql.fabianschultz.com` likely points at Stellate today.

## Recommended replacement

Use Vercel directly and remove the separate GraphQL CDN layer.

Preferred path:

1. Change the browser GraphQL endpoint to same-origin `/api/graphql` in production and development.
   - This avoids a second domain entirely.
   - It also avoids CORS and DNS complexity.
   - Existing server-side route loaders keep using `initializeApollo()` with `SchemaLink`, so they bypass HTTP GraphQL either way.
2. Keep `app/routes/api/graphql.tsx` as the single GraphQL HTTP endpoint for interactive/client-side queries.
3. Remove public Stellate references and configuration.

Optional compatibility path if the public `graphql.fabianschultz.com` endpoint should remain:

1. Add `graphql.fabianschultz.com` as a domain on the Vercel project.
2. Add a Vercel rewrite from that host to `/api/graphql`, so `https://graphql.fabianschultz.com` continues to work without Stellate.
3. Point DNS for `graphql.fabianschultz.com` at Vercel instead of Stellate.

## Caching strategy on Vercel

Do not try to recreate Stellate exactly unless metrics show it is needed.

- Most site pages fetch data in server loaders via `SchemaLink`, not through the browser GraphQL endpoint.
- The browser GraphQL endpoint is mainly useful for live music polling and any interactive client-side fetches.
- Vercel’s CDN is straightforward for `GET` responses with `Cache-Control`, but GraphQL clients commonly use `POST`, which should not be treated as CDN-cacheable.

If caching is needed later:

1. Enable GET for idempotent Apollo queries with `useGETForQueries: true`.
2. In `app/routes/api/graphql.tsx`, set response `Cache-Control` by operation name:
   - live music/status queries: short TTL or `no-store` depending on desired freshness;
   - content queries: `s-maxage=86400, stale-while-revalidate=604800`;
   - feeds/sitemap can stay as route-level concerns.
3. Keep mutations disabled/nonexistent before caching any GraphQL traffic.

## Implementation steps

1. Confirm DNS ownership/current target for `graphql.fabianschultz.com`.
2. Decide whether to keep the dedicated GraphQL domain:
   - if no, switch `GRAPHQL_BASE_URL` to `/api/graphql`;
   - if yes, add the domain to Vercel and configure a host rewrite to `/api/graphql`.
3. Delete `stellate.yml`.
4. Remove any Stellate/GraphCDN environment variables from Vercel project settings and local env files.
5. Update `app/routes/colophon.tsx` to remove the Stellate credit and point the GraphQL API link at the new endpoint.
6. Search for remaining references: `rg -i "stellate|graphcdn|graphql.fabianschultz.com|STELLATE|GRAPHCDN"`.
7. Run:
   - `pnpm lint`
   - `pnpm knip`
   - `pnpm build`
8. Deploy a Vercel preview and verify:
   - home page loads intro/posts/books/music;
   - `/photos`, a photo set, and a photo detail load;
   - `/posts`, a post, RSS/Atom/feed routes, sitemap, and OG image route load;
   - `/api/graphql` accepts a basic POST query;
   - `graphql.fabianschultz.com` works only if intentionally kept.

## Rollback plan

- Revert `GRAPHQL_BASE_URL` to the previous hosted endpoint.
- Restore `stellate.yml` and DNS if needed.
- Re-add Stellate environment variables only if the rollback requires deployment automation.
