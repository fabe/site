import React, { Component } from 'react';
import Link from 'next/link';
import { withRouter } from 'next/router';
import s from './Nav.css';

const Nav = router => (
  <nav className={s.nav} role="navigation">
    <ul>
      <li>
        <Link prefetch href="/">
          <a>Work {router.pathname}</a>
        </Link>
      </li>

      <li>
        <Link prefetch href="/about">
          <a>About</a>
        </Link>
      </li>

      <li>
        <a href="mailto:desk@fabianschultz.com">Contact</a>
      </li>
    </ul>
  </nav>
);

export default withRouter(Nav);
