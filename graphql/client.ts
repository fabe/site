import { IncomingMessage, ServerResponse } from 'http';
import { useMemo } from 'react';

import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { GRAPHQL_BASE_URL, PREFER_USING_SCHEMA_LINK } from './constants';

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;

export type ResolverContext = {
  req?: IncomingMessage;
  res?: ServerResponse;
};

function createIsomorphLink(context: ResolverContext = {}) {
  const isServer = typeof window === 'undefined';

  if (isServer && PREFER_USING_SCHEMA_LINK) {
    const { SchemaLink } = require('@apollo/client/link/schema');
    const { schema } = require('./schema');

    console.log(`🌐 Using schema link on server.`);
    return new SchemaLink({ schema, context });
  }

  console.log(
    `🌐 Using ${GRAPHQL_BASE_URL} on ${isServer ? 'server' : 'client'}.`
  );
  return new HttpLink({
    uri: GRAPHQL_BASE_URL,
    credentials: 'same-origin',
  });
}

function createApolloClient(context?: ResolverContext) {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: createIsomorphLink(context),
    cache: new InMemoryCache(),
  });
}

export function initializeApollo(
  initialState: any = null,
  // Pages with Next.js data fetching methods, like `getStaticProps`, can send
  // a custom context which will be used by `SchemaLink` to server render pages
  context?: ResolverContext
) {
  const _apolloClient = apolloClient ?? createApolloClient(context);

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // get hydrated here
  if (initialState) {
    _apolloClient.cache.restore(initialState);
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo(initialState: any) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}
