const IS_PROD = process.env.NODE_ENV === "production";

// In dev, use a relative URL so the browser resolves it against whatever port
// the dev server is actually running on (5173, 5174, etc.).
// In prod, point to the dedicated GraphQL host.
export const GRAPHQL_BASE_URL = IS_PROD
  ? "https://graphql.fabianschultz.com"
  : "/api/graphql";
