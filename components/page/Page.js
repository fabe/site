import React, { Component } from 'react';
import Nav from '~/components/nav';
import Head from 'next/head';
import config from '~/config';
import s from './Page.css';

class Page extends Component {
  render() {
    const title = this.props.title
      ? `${config.app.name} — ${this.props.title}`
      : config.app.name;

    return (
      <div className={s.container}>
        <Head>
          <title>
            {title}
          </title>
        </Head>
        <Nav />
        {this.props.children}
      </div>
    );
  }
}

export default Page;
