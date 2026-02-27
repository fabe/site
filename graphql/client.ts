import { useMemo } from "react";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { GRAPHQL_BASE_URL } from "./constants";

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;

/**
 * Create an Apollo client for use in the browser.
 * Uses HttpLink (no schema import needed).
 */
function createClientApolloClient() {
  return new ApolloClient({
    ssrMode: false,
    link: new HttpLink({
      uri: GRAPHQL_BASE_URL,
      credentials: "same-origin",
    }),
    cache: new InMemoryCache(),
  });
}

/**
 * Get or create the Apollo client for client-side use (synchronous).
 * Used in React components (e.g. ApolloProvider in the root layout).
 */
export function getClientApollo(
  initialState: any = null,
): ApolloClient<NormalizedCacheObject> {
  if (!apolloClient) {
    apolloClient = createClientApolloClient();
  }
  if (initialState) {
    apolloClient.cache.restore(initialState);
  }
  return apolloClient;
}

/**
 * Initialize an Apollo client for server-side use (async).
 * Dynamically imports the schema and SchemaLink to avoid pulling
 * server-only code (resolvers, rss-parser, sharp, etc.) into the
 * client bundle.
 */
export async function initializeApollo(
  initialState: any = null,
): Promise<ApolloClient<NormalizedCacheObject>> {
  const { SchemaLink } = await import("@apollo/client/link/schema");
  const { schema } = await import("./schema");

  const client = new ApolloClient({
    ssrMode: true,
    link: new SchemaLink({ schema }),
    cache: new InMemoryCache(),
  });

  if (initialState) {
    client.cache.restore(initialState);
  }

  return client;
}

export function useApollo(initialState: any) {
  const store = useMemo(() => getClientApollo(initialState), [initialState]);
  return store;
}
