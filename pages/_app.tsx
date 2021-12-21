import '../styles/globals.css';

import { ApolloProvider } from '@apollo/client';

import { useApollo } from '../graphql/client';

import type { AppProps } from 'next/app';
import Shell from '../components/Shell';

function MyApp({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={apolloClient}>
      <Shell>
        <Component {...pageProps} />
      </Shell>
    </ApolloProvider>
  );
}

export default MyApp;
