export const IS_PROD = process.env.NODE_ENV === "production";
export const IS_DEV = process.env.NODE_ENV === "development";

export const GRAPHQL_BASE_URL = IS_DEV
  ? "http://localhost:3000/api/graphql"
  : "https://graphql.fabianschultz.com";
