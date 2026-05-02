export const IS_PROD = process.env.NODE_ENV === "production";
export const IS_DEV = process.env.NODE_ENV === "development";

// Use a relative URL so the browser resolves it against the current origin in
// development, preview, and production.
export const GRAPHQL_BASE_URL = "/api/graphql";
