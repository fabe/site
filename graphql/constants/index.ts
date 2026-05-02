const IS_PROD = process.env.NODE_ENV === "production";

// Use a relative URL so the browser resolves it against the current origin in
// development, preview, and production.
export const GRAPHQL_BASE_URL = "/api/graphql";
