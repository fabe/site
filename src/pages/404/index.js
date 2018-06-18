import React from 'react';
import Header from '~/src/components/Header';
import Layout from '~/src/components/Layout';
import omg from './omg.mp4';

export default ({ posts }) => (
  <Layout>
    <div>
      <Header video={omg}>
        <div className="title">
          <h1>404</h1>
        </div>
        <div className="summary">
          <p>That wasn't found.</p>
        </div>
      </Header>
    </div>
  </Layout>
);
