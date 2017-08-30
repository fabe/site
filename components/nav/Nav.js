import React, { Component } from 'react';
import Link from 'next/link';

class Page extends Component {
  render() {
    return (
      <ul>
        <li>
          <Link href="/" prefetch>
            <a>Home</a>
          </Link>
        </li>
        <li>
          <Link href="/about" prefetch>
            <a>About</a>
          </Link>
        </li>
      </ul>
    );
  }
}

export default Page;
