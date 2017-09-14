import React from 'react';
import NProgress from 'nprogress';
import Router from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import config from '~/config';
import Nav from '~/components/nav';
import s from './Header.css';

Router.onRouteChangeStart = url => {
  console.log(`Loading: ${url}`);
  NProgress.start();
};
Router.onRouteChangeComplete = () => NProgress.done();
Router.onRouteChangeError = () => NProgress.done();

const buildTitle = title =>
  title ? `${config.app.name} — ${title}` : config.app.name;

export default ({ title }) =>
  <header className={s.header}>
    <Head>
      <title>
        {buildTitle(title)}
      </title>
      <link rel="stylesheet" type="text/css" href="/static/nprogress.css" />
    </Head>
    <Link prefetch href="/">
      <a>
        {config.app.name}
      </a>
    </Link>
    <Nav />
  </header>;
