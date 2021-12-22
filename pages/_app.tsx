import '../styles/globals.css';

import React from 'react';

import { ApolloProvider } from '@apollo/client';

import Shell from '../components/Shell';
import { useApollo } from '../graphql/client';

import type { AppProps } from 'next/app';
import Link from 'next/link';
function MyApp({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={apolloClient}>
      <nav className="sr-only">
        <Link href="/#content">
          <a>Skip to content</a>
        </Link>
      </nav>
      <Shell>
        <Component {...pageProps} />
      </Shell>
    </ApolloProvider>
  );
}

export default MyApp;
