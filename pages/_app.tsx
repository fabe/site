import '../styles/globals.css';

import React from 'react';

import { ApolloProvider } from '@apollo/client';

import Shell from '../components/Shell';
import { useApollo } from '../graphql/client';

import type { AppProps } from 'next/app';
function MyApp({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={apolloClient}>
      <nav className="sr-only">
        <a href="/#content">Skip to content</a>
      </nav>
      <Shell>
        <Component {...pageProps} />
      </Shell>
    </ApolloProvider>
  );
}

export default MyApp;
