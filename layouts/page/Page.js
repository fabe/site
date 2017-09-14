import React, { Component } from 'react';
import Header from '~/components/header';
import Footer from '~/components/footer';
import s from './Page.css';

class Page extends Component {
  render() {
    return (
      <div>
        <div className={s.container}>
          <Header title={this.props.title} />
          {this.props.children}
        </div>
        <Footer />
      </div>
    );
  }
}

export default Page;
