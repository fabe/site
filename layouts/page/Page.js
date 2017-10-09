import React, { Component } from 'react';
import Header from '~/components/header';
import Footer from '~/components/footer';
import s from './Page.css';

class Page extends Component {
  render() {
    return (
      <div className={this.props.className}>
        <Header
          title={this.props.title}
          displayTitle={this.props.displayTitle}
          pathname={this.props.pathname}
        />
        <div className={this.props.fullWidth || s.container}>
          <article className={s.article}>{this.props.children}</article>
        </div>
        <Footer />
      </div>
    );
  }
}

export default Page;
