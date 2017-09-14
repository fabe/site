import React, { Component } from 'react';
import Link from 'next/link';
import s from './Nav.css';

export default () =>
  <nav className={s.nav} role="navigation">
    <ul>
      <li>
        <Link prefetch href="/about">
          <a>About</a>
        </Link>
      </li>
      <li>
        <a href="mailto:desk@fabianschultz.com">Contact</a>
      </li>
    </ul>
  </nav>;
