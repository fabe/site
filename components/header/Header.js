import React from 'react';
import NProgress from 'nprogress';
import Router from 'next/router';
import Nav from '~/components/nav';
import Head from 'next/head';
import Link from 'next/link';
import config from '~/config';
import s from './Header.css';

Router.onRouteChangeStart = url => {
  console.log(`Loading: ${url}`);
  NProgress.start();
};
Router.onRouteChangeComplete = () => NProgress.done();
Router.onRouteChangeError = () => NProgress.done();

const buildTitle = title =>
  title ? `${title} — ${config.app.name}` : config.app.name;

export default ({ title, displayTitle }) => (
  <header className={s.header}>
    <Head>
      <title>{buildTitle(title)}</title>
      <link rel="stylesheet" type="text/css" href="/static/nprogress.css" />
    </Head>

    <Link prefetch href="/">
      <a>
        <img
          className={s.portrait}
          src="/img/fabian-schultz.png"
          alt={config.app.name}
          title={config.app.name}
        />
      </a>
    </Link>

    <h1 dangerouslySetInnerHTML={{ __html: displayTitle || title }} />

    <Nav />
  </header>
);
